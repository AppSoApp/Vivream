#!/usr/bin/env node
'use strict';

const { spawn, spawnSync } = require('child_process');
const path = require('path');
const net = require('net');
const os = require('os');
const fs = require('fs');

const PKG_ROOT = path.join(__dirname, '..');
const PKG_JSON = require(path.join(PKG_ROOT, 'package.json'));
const VERSION = PKG_JSON.version;

// npm excludes node_modules/ from published packages unconditionally,
// so the standalone server is shipped as a tarball and extracted here on first run.
const BUNDLE_PATH = path.join(PKG_ROOT, 'vivream-server.tar.gz');
const CACHE_DIR = path.join(os.homedir(), '.vivream', 'cache', VERSION);
const SERVER_PATH = path.join(CACHE_DIR, 'server.js');

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
  portBusy: (p) => isKo ? `  포트 ${p} 사용 중 — 다음 포트 시도...` : `  Port ${p} in use — trying next...`,
  error: isKo
    ? '  서버 시작 실패. Node.js ≥20 이 설치되어 있는지 확인하세요.'
    : '  Failed to start server. Ensure Node.js ≥20 is installed.',
  extractError: isKo
    ? '  번들 추출 실패. 재설치를 시도하세요: npm install -g vivream'
    : '  Failed to extract bundle. Try reinstalling: npm install -g vivream',
};

function ensureExtracted() {
  if (fs.existsSync(SERVER_PATH)) return;
  if (!fs.existsSync(BUNDLE_PATH)) {
    process.stderr.write(MSG.extractError + '\n');
    process.exit(1);
  }
  process.stdout.write(MSG.extracting + '\n');
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const result = spawnSync('tar', ['-xzf', BUNDLE_PATH, '-C', CACHE_DIR], { stdio: 'inherit' });
  if (result.status !== 0) {
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

function cliExists(name) {
  const r = spawnSync(name, ['--version'], { stdio: 'ignore', shell: false });
  return r.status === 0;
}

async function main() {
  ensureExtracted();

  if (!['claude', 'codex', 'agy'].some(cliExists)) {
    process.stderr.write(MSG.noCli);
  }

  const port = await findFreePort(DEFAULT_PORT);
  if (port !== DEFAULT_PORT) process.stdout.write(MSG.portBusy(DEFAULT_PORT) + '\n');
  process.stdout.write(MSG.starting + '\n');

  const server = spawn(process.execPath, [SERVER_PATH], {
    cwd: CACHE_DIR,
    env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1', NODE_ENV: 'production' },
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
    if (/ready|started|listening/i.test(d.toString())) handleReady();
  });

  // Fallback: open browser after 3s regardless
  setTimeout(handleReady, 3000);

  server.on('error', () => { process.stderr.write(MSG.error + '\n'); process.exit(1); });
  server.on('exit', (code) => { if (code && code !== 0) process.exit(code); });

  const shutdown = () => { server.kill('SIGTERM'); setTimeout(() => process.exit(0), 500); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => { process.stderr.write(String(e) + '\n'); process.exit(1); });
