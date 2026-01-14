// src/schemas/page.ts
import {
  defineType,
  defineField
} from "sanity";
var page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Contenu" },
    { name: "seo", title: "SEO" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "content",
      title: "Blocs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "pageBlock" }] }],
      group: "content"
    }),
    defineField({
      name: "seo",
      title: "SEO Local",
      type: "reference",
      to: [{ type: "seoLocal" }],
      group: "seo",
      validation: (rule) => rule.required()
    })
  ]
});

// src/schemas/pageBlock.ts
import { defineField as defineField2, defineType as defineType2 } from "sanity";
var block = defineType2({
  name: "pageBlock",
  title: "Bloc de page",
  type: "document",
  fields: [
    defineField2({
      name: "title",
      title: "Nom interne",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField2({
      name: "blockType",
      title: "Type de bloc",
      type: "string",
      options: {
        list: [
          { title: "Hero Local", value: "heroLocal" },
          { title: "Services Grid", value: "servicesGrid" },
          { title: "Preuves Sociales", value: "localProof" },
          { title: "FAQ", value: "faq" },
          { title: "CTA Contact", value: "ctaContact" }
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField2({
      name: "data",
      title: "Donn\xE9es",
      type: "object",
      fields: [
        defineField2({ name: "heading", type: "string", title: "Titre" }),
        defineField2({ name: "subheading", type: "text", title: "Sous-titre" }),
        defineField2({ name: "items", type: "array", of: [{ type: "text" }], title: "Items" }),
        defineField2({ name: "primaryCta", type: "string", title: "CTA principal" }),
        defineField2({ name: "secondaryCta", type: "string", title: "CTA secondaire" })
      ]
    })
  ]
});

// src/schemas/siteSettings.ts
import { defineField as defineField3, defineType as defineType3 } from "sanity";
var siteSettings = defineType3({
  name: "siteSettings",
  title: "Param\xE8tres du site",
  type: "document",
  fields: [
    defineField3({
      name: "brandName",
      title: "Nom de marque",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField3({ name: "logo", title: "Logo", type: "image" }),
    defineField3({ name: "primaryColor", title: "Couleur primaire", type: "string" }),
    defineField3({ name: "secondaryColor", title: "Couleur secondaire", type: "string" }),
    defineField3({ name: "contactEmail", title: "Email de contact", type: "string" }),
    defineField3({ name: "phone", title: "T\xE9l\xE9phone", type: "string" }),
    defineField3({ name: "address", title: "Adresse", type: "text" })
  ]
});

// src/schemas/seoLocal.ts
import { defineField as defineField4, defineType as defineType4 } from "sanity";
var seoLocal = defineType4({
  name: "seoLocal",
  title: "SEO Local",
  type: "document",
  fields: [
    defineField4({ name: "primaryKeyword", title: "Mot-cl\xE9 principal", type: "string" }),
    defineField4({ name: "serviceAreas", title: "Zones desservies", type: "array", of: [{ type: "string" }] }),
    defineField4({ name: "googleBusinessUrl", title: "Lien Google Business", type: "url" }),
    defineField4({ name: "openingHours", title: "Horaires", type: "array", of: [{ type: "string" }] }),
    defineField4({ name: "testimonials", title: "Avis", type: "array", of: [{ type: "text" }] })
  ]
});

// src/schemas/index.ts
var schemaTypes = [page, block, siteSettings, seoLocal];

// src/structure/index.ts
var deskStructure = (S) => S.list().title("Velocity CMS").items([
  S.listItem().title("Pages").schemaType("page").child(S.documentTypeList("page")),
  S.listItem().title("Blocks").schemaType("pageBlock").child(S.documentTypeList("pageBlock")),
  S.divider(),
  S.listItem().title("Site Settings").schemaType("siteSettings").child(S.editor().schemaType("siteSettings").documentId("siteSettings")),
  S.listItem().title("SEO Local").schemaType("seoLocal").child(S.editor().schemaType("seoLocal").documentId("seoLocal"))
]);
export {
  deskStructure,
  schemaTypes
};
