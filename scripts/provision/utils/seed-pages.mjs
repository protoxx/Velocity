import fs from "fs/promises";
import path from "path";

export async function seedPages(client) {
  const seedsDir = path.resolve(process.cwd(), "scripts/provision/seed-data");
  const files = await fs.readdir(seedsDir);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const content = await fs.readFile(path.join(seedsDir, file), "utf-8");
    const doc = JSON.parse(content);
    await client.createIfNotExists(doc);
    console.log(`Seeded ${doc._id}`);
  }
}
