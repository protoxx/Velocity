import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "../..");
const tmpDir = resolve(root, ".tmp");
const lhciTmp = resolve(tmpDir, "lhci-temp");
const chromeDir = resolve(tmpDir, "lhci-chrome");

mkdirSync(tmpDir, { recursive: true });
mkdirSync(lhciTmp, { recursive: true });
mkdirSync(chromeDir, { recursive: true });
