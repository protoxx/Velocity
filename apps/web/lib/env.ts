const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || "2023-12-15";
const useCdn = process.env.SANITY_USE_CDN === "true";
const previewToken = process.env.SANITY_PREVIEW_TOKEN || process.env.SANITY_WRITE_TOKEN;
const previewSecret = process.env.SANITY_PREVIEW_SECRET;

if (!projectId || !dataset) {
  throw new Error("Missing SANITY_PROJECT_ID or SANITY_DATASET for web app");
}

export const sanityEnv = {
  projectId,
  dataset,
  apiVersion,
  useCdn,
  previewToken,
  previewSecret,
};
