import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "../..");
const tmpDir = resolve(root, ".tmp");
const lhciTempDir = resolve(tmpDir, "lhci-temp");
const chromeDir = resolve(tmpDir, "lhci-chrome");
const chromeProfileDir = resolve(tmpDir, "lhci-chrome-profile");

const NEXT_DEV_COMMAND = {
  command: "pnpm",
  args: ["--filter", "@velocity/web", "dev", "--hostname", "0.0.0.0", "--port", "3000"],
};

for (const dir of [tmpDir]) {
  mkdirSync(dir, { recursive: true });
}

const safeEnsureDir = (dir) => {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Impossible de nettoyer ${dir}:`, error.message);
    }
  }
  mkdirSync(dir, { recursive: true });
};

safeEnsureDir(lhciTempDir);
safeEnsureDir(chromeDir);
safeEnsureDir(chromeProfileDir);

const lhciExecutable = resolve(
  root,
  process.platform === "win32" ? "node_modules/.bin/lhci.cmd" : "node_modules/.bin/lhci"
);

const env = {
  ...process.env,
  LHCI_NO_LIGHTHOUSE_TMP_CLEANUP: "1",
  TMP: lhciTempDir,
  TEMP: lhciTempDir,
  CHROME_LAUNCHER_USER_DATA_DIR: chromeProfileDir,
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function spawnNextServer() {
  return new Promise((resolve, reject) => {
    const server = spawn(NEXT_DEV_COMMAND.command, NEXT_DEV_COMMAND.args, {
      cwd: root,
      env: process.env,
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });

    let resolved = false;
    const readyPattern = /http:\/\/localhost:3000/i;

    const handleReady = (chunk) => {
      const text = chunk.toString();
      process.stdout.write(text.replace(/^/gm, "[warmup] "));
      if (!resolved && readyPattern.test(text)) {
        resolved = true;
        resolve(server);
      }
    };

    server.stdout.on("data", handleReady);
    server.stderr.on("data", (chunk) => process.stderr.write(chunk.toString()));

    server.on("error", (error) => {
      if (!resolved) {
        reject(error);
      }
    });

    server.on("exit", (code) => {
      if (!resolved) {
        reject(new Error(`Le serveur Next s'est arrêté avant d'être prêt (code ${code}).`));
      }
    });
  });
}

async function killProcess(child) {
  if (!child || child.killed) return;

  return new Promise((resolve) => {
    child.once("exit", () => resolve());

    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
        stdio: "ignore",
        shell: true,
      });
    } else {
      child.kill("SIGTERM");
    }

    setTimeout(resolve, 5000);
  });
}

async function warmupNextServer() {
  console.log("⚙️  Warm-up du serveur Next.js avant LHCI…");
  try {
    const server = await spawnNextServer();
    try {
      await wait(1500);
      const urls = ["http://localhost:3000/", "http://localhost:3000/contact", "http://localhost:3000/faq"];
      for (const url of urls) {
        try {
          const response = await fetch(url);
          console.log(`[warmup] ${url} -> ${response.status}`);
        } catch (error) {
          console.warn(`[warmup] Échec de la requête ${url}:`, error.message);
        }
      }
    } finally {
      await killProcess(server);
    }
  } catch (error) {
    console.warn("Warm-up Next.js échoué, LHCI se lancera quand même :", error.message);
  }
}

async function runLhci() {
  await warmupNextServer();

  const child = spawn(lhciExecutable, ["autorun", "--config", "./lighthouserc.json"], {
    cwd: root,
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("error", (error) => {
    console.error("Failed to run Lighthouse CI:", error);
    process.exit(1);
  });

  child.on("exit", (code) => {
    process.exit(code ?? 1);
  });
}

await runLhci();
