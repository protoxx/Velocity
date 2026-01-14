import fs from "fs/promises";
import path from "path";
import process from "process";
import { promisify } from "util";
import { exec as execCallback } from "child_process";

const exec = promisify(execCallback);

const CLIENTS_FILE = path.resolve(process.cwd(), "scripts/provision/clients.json");
const LOG_DIR = path.resolve(process.cwd(), "scripts/migrations/logs");

async function ensureLogDir() {
  await fs.mkdir(LOG_DIR, { recursive: true });
}

async function loadClients() {
  const raw = await fs.readFile(CLIENTS_FILE, "utf-8");
  return JSON.parse(raw);
}

async function backupDataset(dataset) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outputPath = path.join(LOG_DIR, `${dataset}-${timestamp}.tar.gz`);
  console.log(`Exporting dataset ${dataset} to ${outputPath}`);
  await exec(`sanity dataset export ${dataset} ${outputPath} --raw`, { env: process.env });
}

async function migrateDataset(dataset) {
  console.log(`Running migrations for dataset ${dataset}`);
  await exec(`pnpm migrate --dataset=${dataset}`, { env: process.env, stdio: "inherit" });
}

async function run() {
  await ensureLogDir();
  const clients = await loadClients();

  for (const client of clients) {
    const dataset = client.dataset || client.slug;
    try {
      console.log(`\n➡️  Processing dataset: ${dataset}`);
      await backupDataset(dataset);
      await migrateDataset(dataset);
      console.log(`✅ Dataset ${dataset} migrated`);
    } catch (error) {
      console.error(`❌ Migration failed for ${dataset}`, error);
    }
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
