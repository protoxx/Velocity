import dotenv from "dotenv";
import path from "path";
import process from "process";

export function loadEnv() {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const token = process.env.SANITY_WRITE_TOKEN;
  const templateDataset = process.env.SANITY_TEMPLATE_DATASET || dataset;
  const previewSecret = process.env.SANITY_PREVIEW_SECRET;
  const previewToken = process.env.SANITY_PREVIEW_TOKEN || process.env.SANITY_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    throw new Error("Missing SANITY_PROJECT_ID/SANITY_DATASET/SANITY_WRITE_TOKEN in .env.local");
  }

  return { projectId, dataset, token, templateDataset, previewSecret, previewToken };
}
