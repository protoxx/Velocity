import { defineField, defineType } from "sanity";

export const seoLocal = defineType({
  name: "seoLocal",
  title: "SEO Local",
  type: "document",
  fields: [
    defineField({ name: "primaryKeyword", title: "Mot-clé principal", type: "string" }),
    defineField({ name: "serviceAreas", title: "Zones desservies", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "googleBusinessUrl", title: "Lien Google Business", type: "url" }),
    defineField({ name: "openingHours", title: "Horaires", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "testimonials", title: "Avis", type: "array", of: [{ type: "text" }] }),
  ],
});
