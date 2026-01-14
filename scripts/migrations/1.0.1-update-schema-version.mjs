function isVersionGte(current, target) {
  const cur = current.split(".").map(Number);
  const tar = target.split(".").map(Number);
  for (let i = 0; i < 3; i += 1) {
    if ((cur[i] || 0) > (tar[i] || 0)) return true;
    if ((cur[i] || 0) < (tar[i] || 0)) return false;
  }
  return true;
}

export async function run(client, context = {}) {
  const targetVersion = "1.0.1";
  const currentVersion = context.currentVersion || "0.0.0";

  if (isVersionGte(currentVersion, targetVersion)) {
    console.log(`Dataset already at version ${currentVersion}. Skipping ${targetVersion}.`);
    return;
  }

  console.log(`Updating schemaVersion from ${currentVersion} to ${targetVersion}`);
  await client
    .patch("systemSettings")
    .set({ schemaVersion: targetVersion })
    .commit({ autoGenerateArrayKeys: true });
}
