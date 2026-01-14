import path from "path";
import process from "process";
import { exec as execCallback } from "child_process";
import { promisify } from "util";

import { createClient } from "@sanity/client";

import { loadEnv } from "./utils/load-env.mjs";
import { seedSystemDocuments } from "./utils/seed-system.mjs";
import { seedPages } from "./utils/seed-pages.mjs";
import { syncVercelProject } from "./utils/vercel-sync.mjs";

const exec = promisify(execCallback);

function parseArgs() {
  const args = Object.fromEntries(
    process.argv
      .slice(2)
      .filter((arg) => arg.includes("="))
      .map((arg) => arg.split("=").map((value) => value.replace(/^--/, "")))
  );

  const {
    clientSlug,
    brandName = "Client local",
    dataset = clientSlug,
    vercelProject,
    deployHook,
  } = args;

  if (!clientSlug) {
    throw new Error("Missing --clientSlug=<slug> argument");
  }

  return { clientSlug, brandName, dataset, vercelProject, deployHook };
}

const STUDIO_DIR = path.resolve(process.cwd(), "apps/studio");

async function cloneDataset({ templateDataset, dataset, projectId }) {
  if (dataset === templateDataset) {
    console.log("Dataset cible identique au template, clonage ignoré");
    return;
  }

  console.log(`Checking if dataset ${dataset} already exists…`);
  try {
    await exec(`sanity dataset describe ${dataset}`, {
      env: process.env,
      cwd: STUDIO_DIR,
    });
    console.log(`Dataset ${dataset} already exists, skipping clone.`);
    return;
  } catch {
    // describe failed -> dataset doesn't exist, continue with clone
  }

  console.log(`Cloning dataset ${templateDataset} -> ${dataset}`);
  try {
    await exec(`sanity dataset create ${dataset} --copy ${templateDataset} --visibility private --force`, {
      env: process.env,
      cwd: STUDIO_DIR,
    });
    console.log(`Dataset ${dataset} created`);
  } catch (error) {
    if (error?.stderr?.includes("already exists")) {
      console.log(`Dataset ${dataset} already exists, skipping clone.`);
      return;
    }
    throw error;
  }
}

async function warmVercelProject({
  clientSlug,
  dataset,
  sanityProjectId,
  previewSecret,
  previewToken,
  vercelProject,
  deployHook,
}) {
  if (!process.env.VERCEL_TOKEN) {
    console.log("Skipping Vercel sync (VERCEL_TOKEN not set).");
    return;
  }

  const projectName = vercelProject || `velocity-${clientSlug}`;
  const deployHookUrl = deployHook || process.env.VERCEL_DEPLOY_HOOK_URL;

  await syncVercelProject({
    projectName,
    dataset,
    sanityProjectId,
    previewSecret,
    previewToken,
    deployHookUrl,
  });
}

async function bootstrapClient() {
  const { projectId, token, templateDataset, previewSecret, previewToken } = loadEnv();
  const { clientSlug, brandName, dataset, vercelProject, deployHook } = parseArgs();

  await cloneDataset({ templateDataset, dataset, projectId });

  const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: "2023-12-15",
  });

  console.log("Seeding system documents for", dataset);
  await seedSystemDocuments(client, { brandName });
  await seedPages(client);

  await warmVercelProject({
    clientSlug,
    dataset,
    sanityProjectId: projectId,
    previewSecret,
    previewToken,
    vercelProject,
    deployHook,
  });

  console.log(`Client ${clientSlug} ready on dataset ${dataset}`);
}

bootstrapClient().catch((err) => {
  console.error(err);
  process.exit(1);
});
