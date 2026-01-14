import path from "path";
import fs from "fs/promises";
import process from "process";
import { createClient } from "@sanity/client";
import { loadEnv } from "../provision/utils/load-env.mjs";

const argvDataset = process.argv.find((arg) => arg.startsWith("--dataset="))?.split("=")[1];

const env = loadEnv();
const dataset = argvDataset || env.dataset;

const client = createClient({
  projectId: env.projectId,
  dataset,
  token: env.token,
  useCdn: false,
  apiVersion: "2023-12-15",
});

async function runMigrations() {
  const dir = path.resolve(process.cwd(), "scripts/migrations");
  const files = await fs.readdir(dir);
  const migrationFiles = files.filter((file) => /\.mjs$/.test(file) && file !== "migrate.mjs");

  migrationFiles.sort();

  if (migrationFiles.length === 0) {
    console.log("No migration files found. Skipping.");
    return;
  }

  const systemSettings = await client.getDocument("systemSettings");
  const currentVersion = systemSettings?.schemaVersion || "0.0.0";
  console.log(`Current schema version: ${currentVersion}`);

  for (const file of migrationFiles) {
    const migrationPath = path.join(dir, file);
    console.log(`Running migration ${file} on dataset ${dataset}`);
    const module = await import(migrationPath);
    if (typeof module.run !== "function") {
      console.warn(`Migration ${file} does not export a run() function. Skipping.`);
      continue;
    }
    await module.run(client, { currentVersion });
  }
}

runMigrations().catch((err) => {
  console.error(err);
  process.exit(1);
});
