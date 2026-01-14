export async function seedSystemDocuments(client) {
  await client.createIfNotExists({
    _id: "systemSettings",
    _type: "siteSettings",
    schemaVersion: "1.0.0",
    brandName: "Velocity",
  });

  await client.createIfNotExists({
    _id: "seoLocal",
    _type: "seoLocal",
    primaryKeyword: "agence web locale",
    serviceAreas: ["Paris", "Lyon"],
    googleBusinessUrl: "https://maps.google.com/?q=velocity",
  });
}
