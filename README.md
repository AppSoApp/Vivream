# Vivream

**Brain-dump in. Blueprint out.**

A free, local-first AI workbench that turns one raw brain-dump into five structured outputs — powered by your own Claude Code, Codex, or Agy CLI. No subscription. No cloud. Everything runs on your machine.

[![npm](https://img.shields.io/npm/v/vivream)](https://www.npmjs.com/package/vivream)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/AppSoApp?label=Sponsor&logo=githubsponsors)](https://github.com/sponsors/AppSoApp)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-donate-FF5E5B?logo=ko-fi)](https://ko-fi.com/appsoapplication)

---

## Quick Start

```bash
npx vivream
```

Opens automatically at `http://localhost:3001`.

---

## Features

**Five outputs from one brain-dump.** Type your ideas once, generate any of:

| | Output | What it's for |
|---|---|---|
| 📄 | **Spec** | A structured design document |
| ▤ | **Execution prompt** | A ready-to-paste prompt for Claude Code / Cursor / ChatGPT |
| 🌿 | **Mindmap** | A node-graph visualization of your idea |
| `{}` | **JSON** | Structured data for system integration |
| 🎤 | **Pitch deck** | Marp slides, targeted at investors / team / clients |

- **Brainstorm mode** — `/brainstorm` opens an AI-guided mindmap brainstorming session. Input ideas one by one; every 5 ideas the AI summarizes the cycle and suggests improvements. A live mindmap updates in real time as you think.
- **CLI runtime selection** — Vivream detects which AI CLIs are installed on your machine (Claude Code / Codex / Agy) and shows a *detected / not installed* status. Choose a default runtime in **Settings → CLI**, or switch on the fly from the selector in the workbench header.
- **Specialized AI roles per output** — each output mode is backed by a dedicated AI skill (e.g. Spec writes as a senior tech writer, Pitch as a startup storyteller), so the AI adopts the right voice for what you're building.
- **Time Machine** — roll back to any previous checkpoint in your session.
- **Cross-Pollination** — Vivream surfaces similar past sessions and suggests connections automatically.
- **Local-first & private** — sessions live in your browser's IndexedDB, BYOK API keys are encrypted with AES-256-GCM, and every AI run happens on your own machine. No data is sent to Vivream servers.
- **Bilingual UI (Korean / English)** — toggle the language in **Settings → General**. Landing, settings, workbench, output panels, and API error messages are all fully translated. Browser locale is auto-detected via `Accept-Language` on first visit.
- **Improved Windows compatibility** — Claude Code / Codex / Agy CLIs are now reliably detected and launched on Windows (fixes `.cmd` shim spawning since CVE-2024-27980).

---

## Requirements

- **Node.js ≥ 20** ([nodejs.org](https://nodejs.org))
- One AI runtime (pick one):

| Runtime | How to get it |
|---|---|
| **Claude Code** (recommended) | [claude.ai/code](https://claude.ai/code) |
| **OpenAI Codex CLI** | `npm install -g @openai/codex` |
| **Agy** | [antigravity.ai](https://antigravity.ai) |
| **BYOK API Key** | Enter inside the app under Settings → BYOK |

---

## Installation by OS

### Windows

1. Install Node.js from [nodejs.org](https://nodejs.org) (LTS version)
2. Open **PowerShell** or **Command Prompt**
3. Run:
```
npx vivream
```
4. Browser opens automatically at `http://localhost:3001`

> If `npx` is not found, restart the terminal after installing Node.js.

### macOS

1. Install Node.js:
```bash
brew install node
# or download from nodejs.org
```
2. Open **Terminal** and run:
```bash
npx vivream
```
3. Browser opens automatically at `http://localhost:3001`

### Linux

```bash
# Install Node.js 20+ (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Run Vivream
npx vivream
```

---

## How It Works

1. **Brain-dump** — Type your raw ideas, notes, or goals into the input box. No structure needed.
2. **Pick a runtime** — Vivream auto-detects your installed CLI, or choose one from the header selector (Claude Code / Codex / Agy / BYOK key).
3. **Generate** — AI turns your dump into any of the five outputs: spec, execution prompt, mindmap, JSON, or pitch deck. Each mode is guided by its own specialized AI role. Generate one output, or hit **✦ Generate all remaining** to fill every tab in one go. The runtime selector shows which CLI is active (e.g. *Auto · Claude*).
4. **Save sessions** — Save your sessions and revisit them later.
5. **Time Machine** — Roll back to any previous checkpoint in your session.
6. **Cross-Pollination** — Vivream finds similar past sessions and suggests connections automatically.

All AI processing happens on your machine using your own credentials. No data is sent to Vivream servers.

---

## Settings

### CLI runtime (Settings → CLI)
See which AI CLIs are installed (*detected / not installed*) and choose your default runtime. Priority order: your explicit choice (header selector or saved default) → auto-detected CLI (Claude → Codex → Agy) → BYOK API key. You can also switch runtimes any time from the selector in the workbench header.

### Language (Settings → General)
Toggle the UI language between **한국어** and **English**. Landing, settings, workbench, output panels, and API error messages are all fully translated. Browser locale is auto-detected via `Accept-Language` on first visit (cookie wins thereafter).

### BYOK (Bring Your Own Key)
If you don't have Claude Code / Codex / Agy installed, you can use an API key directly:

1. Open `http://localhost:3001`
2. Go to **Settings → BYOK**
3. Enter your Anthropic API key

Keys are encrypted with AES-256-GCM. Get an API key at [console.anthropic.com](https://console.anthropic.com).

### Port
Default port is `3001`. If it's in use, Vivream automatically tries the next available port.

---

## Troubleshooting

**"No local AI CLI detected"**  
→ Install Claude Code, Codex CLI, or Agy — or add a BYOK API key in Settings. Check **Settings → CLI** to see what's detected.

**Browser doesn't open automatically**  
→ Navigate to `http://localhost:3001` manually.

**Port already in use**  
→ Vivream will automatically find the next free port. Check the terminal output for the actual URL.

**First run is slow**  
→ The first run extracts the server bundle (~13MB) to `~/.vivream/cache/`. Subsequent runs start instantly.

---

## Support Development

Vivream is free and open to use. If it saves you time, consider sponsoring:

- [GitHub Sponsors](https://github.com/sponsors/AppSoApp)
- [Ko-fi](https://ko-fi.com/appsoapplication)

---

## Contact

appsoapplication@gmail.com · [Issues](https://github.com/AppSoApp/Vivream/issues)

## License

MIT

---

## 한국어

**아이디어를 쏟아내세요. 설계도로 바꿔드립니다.**

하나의 브레인덤프를 다섯 가지 구조화된 결과물로 바꿔주는 무료 로컬 AI 워크벤치. Claude Code / Codex / Agy CLI 로 구동. 구독 없음. 클라우드 없음. 내 컴퓨터에서 전부 실행.

### 시작하기

```bash
npx vivream
```

`http://localhost:3001` 이 자동으로 열립니다.

### 핵심 기능

**한 번의 덤프 → 다섯 가지 결과물.** 아이디어를 한 번 입력하면 아래 중 무엇이든 생성할 수 있습니다:

| | 결과물 | 용도 |
|---|---|---|
| 📄 | **설계서** | 구조화된 설계 문서 |
| ▤ | **실행 프롬프트** | Claude Code / Cursor / ChatGPT 에 그대로 붙여넣는 프롬프트 |
| 🌿 | **마인드맵** | 아이디어를 노드 그래프로 시각화 |
| `{}` | **JSON** | 시스템 연동용 구조화 데이터 |
| 🎤 | **피치 덱** | 투자자 · 팀 · 클라이언트 대상 Marp 슬라이드 |

- **브레인스토밍 모드** — `/brainstorm` 에서 AI 가이드 마인드맵 브레인스토밍 세션을 시작합니다. 아이디어를 하나씩 입력하면 5개마다 AI 가 사이클 요약과 개선점을 제안하고, 실시간 마인드맵이 업데이트됩니다.
- **CLI 런타임 선택** — 내 컴퓨터에 설치된 AI CLI(Claude Code / Codex / Agy)를 자동 감지해 *감지됨 / 미설치* 상태로 보여줍니다. **설정 → CLI** 에서 기본 런타임을 고르거나, 워크벤치 헤더의 선택기에서 즉시 전환할 수 있습니다.
- **결과물별 전용 AI 역할** — 각 출력 모드마다 전담 AI 스킬이 붙습니다(예: 설계서는 시니어 테크 라이터, 피치는 스타트업 스토리텔러). 만들려는 결과물에 맞는 목소리로 AI 가 작동합니다.
- **Time Machine** — 세션의 이전 체크포인트로 롤백.
- **Cross-Pollination** — 과거 유사 세션을 찾아 자동으로 연결을 제안.
- **로컬 우선 & 프라이버시** — 세션은 브라우저 IndexedDB 에 저장되고, BYOK API 키는 AES-256-GCM 으로 암호화되며, 모든 AI 실행이 내 컴퓨터에서 일어납니다. Vivream 서버로 데이터를 보내지 않습니다.
- **한/영 UI 전환** — **설정 → 일반** 에서 언어를 바꿀 수 있습니다. 랜딩 · 설정 · 워크벤치 · 산출물 패널 · API 에러 메시지까지 모두 번역 완료. 첫 방문 시 브라우저 `Accept-Language` 자동 감지 (이후 쿠키 우선).
- **Windows 호환성 개선** — Windows 에서 Claude Code / Codex / Agy CLI 감지 및 실행이 안정화됐습니다 (CVE-2024-27980 이후 `.cmd` 쉬움 스폰 문제 수정).

### 필요 사항

- **Node.js ≥ 20** ([nodejs.org](https://nodejs.org))
- 아래 중 하나:
  - **Claude Code** (권장) — [claude.ai/code](https://claude.ai/code)
  - **OpenAI Codex CLI** — `npm install -g @openai/codex`
  - **Agy** — [antigravity.ai](https://antigravity.ai)
  - **BYOK** — 앱 내 설정 → BYOK에서 API 키 입력

### 설치 방법

**Windows**
1. [nodejs.org](https://nodejs.org)에서 Node.js 설치
2. PowerShell 또는 명령 프롬프트 열기
3. `npx vivream` 실행

**macOS**
```bash
brew install node
npx vivream
```

**Linux**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
npx vivream
```

### 사용법

1. **입력창에 아이디어 덤프** — 형식 없이 자유롭게 입력
2. **런타임 선택** — 설치된 CLI 를 자동 감지하거나, 헤더 선택기에서 직접 선택 (Claude Code / Codex / Agy / BYOK 키)
3. **생성 버튼 클릭** — AI 가 다섯 결과물(설계서 · 실행 프롬프트 · 마인드맵 · JSON · 피치 덱) 중 원하는 것으로 정리. 모드마다 전용 AI 역할이 작동. 하나씩 생성하거나 **✦ 나머지 모두 생성** 으로 모든 탭을 한 번에 채울 수 있고, 런타임 선택기가 현재 활성 CLI 를 표시합니다(예: *자동 · Claude*)
4. **세션 저장** — 이전 작업 저장 및 재방문
5. **Time Machine** — 이전 체크포인트로 롤백
6. **Cross-Pollination** — 과거 유사 세션 자동 추천

### 설정

- **CLI 런타임 (설정 → CLI)** — 설치된 CLI 의 *감지됨 / 미설치* 상태 확인 및 기본 런타임 선택. 우선순위: 명시 선택(헤더 선택기 또는 저장된 기본값) → 자동 감지 CLI(claude → codex → agy 순) → BYOK API 키. 헤더 선택기에서 언제든 전환 가능.
- **언어 (설정 → 일반)** — UI 언어를 **한국어 / English** 로 전환. 랜딩 · 설정 · 워크벤치 · 산출물 패널 · API 에러 메시지까지 모두 번역 완료. 첫 방문 시 브라우저 `Accept-Language` 자동 감지 (이후 쿠키 우선).
- **BYOK (설정 → BYOK)** — Claude Code / Codex / Agy 없이 Anthropic API 키를 직접 사용. 키는 AES-256-GCM 으로 암호화 저장. [console.anthropic.com](https://console.anthropic.com) 에서 키 발급.
- **포트** — 기본 포트는 `3001`. 사용 중이면 다음 가용 포트를 자동으로 시도.

### 후원

- [GitHub Sponsors](https://github.com/sponsors/AppSoApp)
- [Ko-fi](https://ko-fi.com/appsoapplication)

### 문의

appsoapplication@gmail.com · [이슈](https://github.com/AppSoApp/Vivream/issues)
