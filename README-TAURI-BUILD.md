?=Registro Studio Music — Tauri packaging (automated steps)

Prerequisites
- Windows build host
- Node.js (18+), npm
- Rust toolchain (rustup, cargo)
- Global install of `pkg` (npm i -g pkg) or use the devDependency script
- Install Tauri CLI: `cargo install tauri-cli` or `npm i -D @tauri-apps/cli`

Build steps (exact commands to run in repository root):

1) Install dependencies

```powershell
npm install
```

2) Build frontend, transpile server and produce server.exe (pkg)

```powershell
npm run build:web
npm run build:server:js
npm run build:server:exe
```

Notes:
- `build:server:js` compiles `server.ts` to `dist_server/server.js` using `tsc`.
- `build:server:exe` uses `pkg` to bundle `dist_server/server.js` into `dist/server.exe` (Node runtime included).

3) Build Tauri bundle (.exe installer) — this will include `dist/server.exe` as a resource

```powershell
npx tauri build
```

Or run the combined script:

```powershell
npm run tauri:build
```

Output:
- A Windows bundle/installer and an App executable will be generated in `src-tauri/target/release/bundle/windows`.

Caveats & tips:
- `pkg` may require adjusting `server.ts` to avoid dynamic `require` or unsupported native modules. `better-sqlite3` is native and may not be compatible with `pkg` without rebuilding native modules; consider shipping database files separately or using a pure-JS SQLite driver.
- If `pkg` fails for native modules, alternative: compile server to a standalone executable using `nexe` or rewrite server parts into the Tauri Rust backend.
- Make sure antiviruses allow the generated exe during testing.

If quieres, procedo a: (A) adaptar `server.ts` para ser compatible con `pkg` (reemplazar imports dinámicos y `better-sqlite3` usage), o (B) cambiar estrategia y portar la lógica crítica de `server.ts` al backend Rust de Tauri.
