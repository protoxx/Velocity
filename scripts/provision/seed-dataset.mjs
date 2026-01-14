import { createClient } from "@sanity/client";
import { loadEnv } from "./utils/load-env.mjs";
import { seedSystemDocuments } from "./utils/seed-system.mjs";
import { seedPages } from "./utils/seed-pages.mjs";

const env = loadEnv();
const client = createClient({
  projectId: env.projectId,
  dataset: env.dataset,
  token: env.token,
  useCdn: false,
  apiVersion: "2023-12-15",
});

async function seedDataset() {
  const systemSettingsId = "systemSettings";

  const existing = await client.getDocument(systemSettingsId);
  if (existing) {
    console.log("System settings already exist. Skipping seed.");
    return;
  }

  await seedSystemDocuments(client);
  await seedPages(client);
}

seedDataset().catch((err) => {
  console.error(err);
  process.exit(1);
});
