import type { StructureResolver } from "sanity/desk";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Velocity CMS")
    .items([
      S.listItem().title("Pages").schemaType("page").child(S.documentTypeList("page")),
      S.listItem().title("Blocks").schemaType("pageBlock").child(S.documentTypeList("pageBlock")),
      S.divider(),
      S.listItem()
        .title("Site Settings")
        .schemaType("siteSettings")
        .child(S.editor().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("SEO Local")
        .schemaType("seoLocal")
        .child(S.editor().schemaType("seoLocal").documentId("seoLocal")),
    ]);
