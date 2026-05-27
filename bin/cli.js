#!/usr/bin/env node
'use strict';

const { spawn, spawnSync } = require('child_process');
const path = require('path');
const net = require('net');
const os = require('os');
const fs = require('fs');
const tar = require('tar');

const PKG_ROOT = path.join(__dirname, '..');
const PKG_JSON = require(path.join(PKG_ROOT, 'package.json'));
const VERSION = PKG_JSON.version;

// npm excludes node_modules/ from published packages unconditionally,
// so the standalone server is shipped as a tarball and extracted here on first run.
const BUNDLE_PATH = path.join(PKG_ROOT, 'vivream-server.tar.gz');
const CACHE_DIR = path.join(os.homedir(), '.vivream', 'cache', VERSION);
// pnpm monorepo standalone 구조: server.js 는 apps/web/ 하위에 위치
const SERVER_PATH = path.join(CACHE_DIR, 'apps', 'web', 'server.js');

const DEFAULT_PORT = 3001;

const isKo = /^ko/.test(process.env.LANG || process.env.LC_ALL || process.env.VIVREAM_LANG || '');

const MSG = {
  extracting: isKo ? '  번들 추출 중 (최초 1회)...' : '  Extracting bundle (first run only)...',
  starting: isKo ? '  Vivream 시작 중...' : '  Starting Vivream...',
  ready: (port) => isKo
    ? `\n  ✓ 준비 완료 →  http://localhost:${port}\n\n  종료: Ctrl+C\n  문의: appsoapplication@gmail.com\n`
    : `\n  ✓ Ready →  http://localhost:${port}\n\n  Quit: Ctrl+C\n  Contact: appsoapplication@gmail.com\n`,
  noCli: isKo
    ? '\n  ⚠  로컬 AI CLI 미감지 (Claude Code / Codex / Agy).\n     설치 후 재실행하거나, 앱 설정에서 BYOK API 키를 입력하세요.\n'
    : '\n  ⚠  No local AI CLI detected (Claude Code / Codex / Agy).\n     Install one and restart, or enter a BYOK API key inside the app.\n',
  detected: (names) => isKo
    ? `  ✓ 로컬 AI CLI 감지: ${names.join(', ')}`
    : `  ✓ Local AI CLI detected: ${names.join(', ')}`,
  portBusy: (p) => isKo ? `  포트 ${p} 사용 중 — 다음 포트 시도...` : `  Port ${p} in use — trying next...`,
  error: isKo
    ? '  서버 시작 실패. Node.js ≥20 이 설치되어 있는지 확인하세요.'
    : '  Failed to start server. Ensure Node.js ≥20 is installed.',
  extractError: isKo
    ? '  번들 추출 실패. 재설치를 시도하세요: npm install -g vivream'
    : '  Failed to extract bundle. Try reinstalling: npm install -g vivream',
};

async function ensureExtracted() {
  if (fs.existsSync(SERVER_PATH)) return;
  if (!fs.existsSync(BUNDLE_PATH)) {
    process.stderr.write(MSG.extractError + '\n');
    process.exit(1);
  }
  process.stdout.write(MSG.extracting + '\n');
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  try {
    await tar.extract({ file: BUNDLE_PATH, cwd: CACHE_DIR });
  } catch (e) {
    process.stderr.write(MSG.extractError + '\n');
    process.exit(1);
  }
}

function findFreePort(start) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(start, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', () => resolve(findFreePort(start + 1)));
  });
}

function openBrowser(port) {
  const url = `http://localhost:${port}`;
  const args =
    process.platform === 'darwin' ? ['open', [url]] :
    process.platform === 'win32'  ? ['cmd', ['/c', 'start', '', url]] :
    ['xdg-open', [url]];
  try { spawnSync(args[0], args[1], { stdio: 'ignore' }); } catch { /* ignore */ }
}

// --- Cross-platform CLI detection (runs in the user's real shell at npx launch) ---
const CLI_ENV_KEY = { claude: 'CLAUDE_CLI_PATH', codex: 'CODEX_CLI_PATH', agy: 'AGY_CLI_PATH' };

function wellKnownBinDirs() {
  const home = os.homedir();
  if (process.platform === 'win32') {
    const appdata = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    return [
      path.join(appdata, 'npm'),
      path.join(home, '.bun', 'bin'),
    ];
  }
  return [
    '/opt/homebrew/bin',
    '/usr/local/bin',
    '/usr/bin',
    path.join(home, '.local', 'bin'),
    path.join(home, '.npm-global', 'bin'),
    path.join(home, '.bun', 'bin'),
    path.join(home, '.deno', 'bin'),
    path.join(home, '.volta', 'bin'),
  ];
}

// Prefer launchers we can actually exec. Windows: .exe/.cmd over .ps1; never the extensionless sh-shim.
function scoreCandidate(p) {
  const ext = path.extname(p).toLowerCase();
  if (process.platform === 'win32') {
    if (ext === '.exe') return 5;
    if (ext === '.cmd') return 4;
    if (ext === '.bat') return 3;
    if (ext === '.ps1') return 1;
    if (ext === '') return 0; // sh-shim, not runnable on Windows
    return 2;
  }
  return 1;
}

function detectCliPath(name) {
  // 1) honor a pre-set override
  const preset = process.env[CLI_ENV_KEY[name]];
  if (preset && fs.existsSync(preset)) return preset;

  const isWin = process.platform === 'win32';

  // 2) PATH lookup via where/which (uses the user's interactive shell PATH)
  try {
    const r = spawnSync(isWin ? 'where' : 'which', [name], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout) {
      const hits = r.stdout
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((p) => fs.existsSync(p))
        .sort((a, b) => scoreCandidate(b) - scoreCandidate(a));
      if (hits.length > 0 && scoreCandidate(hits[0]) > 0) return hits[0];
    }
  } catch { /* ignore */ }

  // 3) well-known install dirs (GUI/minimal PATH, Homebrew on Apple Silicon, etc.)
  const exts = isWin ? ['.cmd', '.exe', '.bat'] : [''];
  for (const dir of wellKnownBinDirs()) {
    for (const ext of exts) {
      const p = path.join(dir, name + ext);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

function detectAllClis() {
  const out = {};
  for (const name of ['claude', 'codex', 'agy']) {
    const p = detectCliPath(name);
    if (p) out[name] = p;
  }
  return out;
}

async function main() {
  await ensureExtracted();

  const detected = detectAllClis();
  const detectedNames = Object.keys(detected);
  if (detectedNames.length === 0) {
    process.stderr.write(MSG.noCli);
  } else {
    process.stdout.write(MSG.detected(detectedNames) + '\n');
  }

  const port = await findFreePort(DEFAULT_PORT);
  if (port !== DEFAULT_PORT) process.stdout.write(MSG.portBusy(DEFAULT_PORT) + '\n');
  process.stdout.write(MSG.starting + '\n');

  const cliEnv = {};
  for (const [name, p] of Object.entries(detected)) cliEnv[CLI_ENV_KEY[name]] = p;
  if (detectedNames.length) cliEnv.VIVREAM_DETECTED_CLIS = detectedNames.join(',');

  const server = spawn(process.execPath, [SERVER_PATH], {
    cwd: CACHE_DIR,
    env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1', NODE_ENV: 'production', VIVREAM_ENABLE_CLI_RUNTIME: 'true', ...cliEnv },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let ready = false;

  const handleReady = () => {
    if (ready) return;
    ready = true;
    process.stdout.write(MSG.ready(port));
    setTimeout(() => openBrowser(port), 400);
  };

  server.stdout.on('data', (d) => {
    const s = d.toString();
    if (/ready|started|listening/i.test(s)) handleReady();
  });

  // Forward server errors to console so user can see what went wrong
  server.stderr.on('data', (d) => process.stderr.write(d));

  // Fallback: open browser after 3s regardless
  setTimeout(handleReady, 3000);

  server.on('error', (e) => { process.stderr.write(e.message + '\n'); process.exit(1); });
  server.on('exit', (code) => {
    if (!ready) process.stderr.write(MSG.error + '\n');
    if (code && code !== 0) process.exit(code);
  });

  const shutdown = () => { server.kill('SIGTERM'); setTimeout(() => process.exit(0), 500); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => { process.stderr.write(String(e) + '\n'); process.exit(1); });
