import process from "node:process";

const API_BASE = "https://api.vercel.com";

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} environment variable for Vercel automation`);
  }
  return value;
}

function buildUrl(path, teamId) {
  const url = new URL(`${API_BASE}${path}`);
  if (teamId) {
    url.searchParams.set("teamId", teamId);
  }
  return url;
}

async function vercelRequest(path, { method = "GET", body, headers = {}, throwOnError = true } = {}) {
  const token = getRequiredEnv("VERCEL_TOKEN");
  const teamId = process.env.VERCEL_TEAM_ID;
  const url = buildUrl(path, teamId);

  const finalHeaders = {
    Authorization: `Bearer ${token}`,
    ...headers,
  };

  if (body && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, { method, body, headers: finalHeaders });
  const contentType = response.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    data = await response.json();
  } else if (contentType) {
    data = await response.text();
  }

  if (!response.ok && throwOnError) {
    const errorPayload = typeof data === "string" ? data : JSON.stringify(data);
    throw new Error(`[Vercel] ${method} ${path} failed (${response.status}): ${errorPayload}`);
  }

  return { status: response.status, ok: response.ok, data };
}

async function getProject(projectName) {
  const result = await vercelRequest(`/v10/projects/${projectName}`, { throwOnError: false });
  if (result.status === 404) {
    return null;
  }
  if (!result.ok) {
    throw new Error(`[Vercel] Unable to retrieve project ${projectName}`);
  }
  return result.data;
}

async function createProject(projectName) {
  console.log(`Creating Vercel project "${projectName}"…`);
  const result = await vercelRequest(`/v10/projects`, {
    method: "POST",
    body: JSON.stringify({
      name: projectName,
      framework: "nextjs",
    }),
  });
  return result.data;
}

async function listEnvVars(projectId) {
  const result = await vercelRequest(`/v10/projects/${projectId}/env`);
  return result.data?.envs ?? [];
}

async function deleteEnvVar(projectId, envId) {
  await vercelRequest(`/v10/projects/${projectId}/env/${envId}`, { method: "DELETE" });
}

async function createEnvVar(projectId, payload) {
  await vercelRequest(`/v10/projects/${projectId}/env`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function syncVercelProject({
  projectName,
  dataset,
  sanityProjectId,
  previewSecret,
  previewToken,
  deployHookUrl,
}) {
  if (!projectName) {
    throw new Error("syncVercelProject: projectName is required");
  }
  if (!dataset) {
    throw new Error("syncVercelProject: dataset is required");
  }
  if (!sanityProjectId) {
    throw new Error("syncVercelProject: sanityProjectId is required");
  }

  const project = (await getProject(projectName)) ?? (await createProject(projectName));

  console.log(`Syncing environment variables for project ${project.name} (${project.id})…`);
  const envTargets = ["production", "preview", "development"];
  const envDefinitions = [
    { key: "SANITY_PROJECT_ID", value: sanityProjectId },
    { key: "SANITY_DATASET", value: dataset },
    previewSecret ? { key: "SANITY_PREVIEW_SECRET", value: previewSecret } : null,
    previewToken ? { key: "SANITY_PREVIEW_TOKEN", value: previewToken } : null,
  ].filter(Boolean);

  const existingEnvs = await listEnvVars(project.id);

  for (const definition of envDefinitions) {
    const duplicates = existingEnvs.filter((env) => env.key === definition.key);
    for (const duplicate of duplicates) {
      await deleteEnvVar(project.id, duplicate.id);
    }

    await createEnvVar(project.id, {
      key: definition.key,
      value: definition.value,
      target: envTargets,
      type: "encrypted",
      comment: `Managed by Velocity bootstrap for dataset ${dataset}`,
    });
    console.log(`  • ${definition.key} updated`);
  }

  if (deployHookUrl) {
    try {
      console.log("Triggering deploy hook…");
      const deployResponse = await fetch(deployHookUrl, { method: "POST" });
      if (!deployResponse.ok) {
        const body = await deployResponse.text();
        throw new Error(`Deploy hook failed (${deployResponse.status}): ${body}`);
      }
      console.log("Deploy hook triggered.");
    } catch (error) {
      console.warn("Unable to trigger deploy hook:", error.message);
    }
  }

  console.log(`Vercel project ${project.name} is synced.`);
}
