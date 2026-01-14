"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  deskStructure: () => deskStructure,
  schemaTypes: () => schemaTypes
});
module.exports = __toCommonJS(index_exports);

// src/schemas/page.ts
var import_sanity = require("sanity");
var page = (0, import_sanity.defineType)({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Contenu" },
    { name: "seo", title: "SEO" }
  ],
  fields: [
    (0, import_sanity.defineField)({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required()
    }),
    (0, import_sanity.defineField)({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    (0, import_sanity.defineField)({
      name: "content",
      title: "Blocs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "pageBlock" }] }],
      group: "content"
    }),
    (0, import_sanity.defineField)({
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
var import_sanity2 = require("sanity");
var block = (0, import_sanity2.defineType)({
  name: "pageBlock",
  title: "Bloc de page",
  type: "document",
  fields: [
    (0, import_sanity2.defineField)({
      name: "title",
      title: "Nom interne",
      type: "string",
      validation: (rule) => rule.required()
    }),
    (0, import_sanity2.defineField)({
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
    (0, import_sanity2.defineField)({
      name: "data",
      title: "Donn\xE9es",
      type: "object",
      fields: [
        (0, import_sanity2.defineField)({ name: "heading", type: "string", title: "Titre" }),
        (0, import_sanity2.defineField)({ name: "subheading", type: "text", title: "Sous-titre" }),
        (0, import_sanity2.defineField)({ name: "items", type: "array", of: [{ type: "text" }], title: "Items" }),
        (0, import_sanity2.defineField)({ name: "primaryCta", type: "string", title: "CTA principal" }),
        (0, import_sanity2.defineField)({ name: "secondaryCta", type: "string", title: "CTA secondaire" })
      ]
    })
  ]
});

// src/schemas/siteSettings.ts
var import_sanity3 = require("sanity");
var siteSettings = (0, import_sanity3.defineType)({
  name: "siteSettings",
  title: "Param\xE8tres du site",
  type: "document",
  fields: [
    (0, import_sanity3.defineField)({
      name: "brandName",
      title: "Nom de marque",
      type: "string",
      validation: (rule) => rule.required()
    }),
    (0, import_sanity3.defineField)({ name: "logo", title: "Logo", type: "image" }),
    (0, import_sanity3.defineField)({ name: "primaryColor", title: "Couleur primaire", type: "string" }),
    (0, import_sanity3.defineField)({ name: "secondaryColor", title: "Couleur secondaire", type: "string" }),
    (0, import_sanity3.defineField)({ name: "contactEmail", title: "Email de contact", type: "string" }),
    (0, import_sanity3.defineField)({ name: "phone", title: "T\xE9l\xE9phone", type: "string" }),
    (0, import_sanity3.defineField)({ name: "address", title: "Adresse", type: "text" })
  ]
});

// src/schemas/seoLocal.ts
var import_sanity4 = require("sanity");
var seoLocal = (0, import_sanity4.defineType)({
  name: "seoLocal",
  title: "SEO Local",
  type: "document",
  fields: [
    (0, import_sanity4.defineField)({ name: "primaryKeyword", title: "Mot-cl\xE9 principal", type: "string" }),
    (0, import_sanity4.defineField)({ name: "serviceAreas", title: "Zones desservies", type: "array", of: [{ type: "string" }] }),
    (0, import_sanity4.defineField)({ name: "googleBusinessUrl", title: "Lien Google Business", type: "url" }),
    (0, import_sanity4.defineField)({ name: "openingHours", title: "Horaires", type: "array", of: [{ type: "string" }] }),
    (0, import_sanity4.defineField)({ name: "testimonials", title: "Avis", type: "array", of: [{ type: "text" }] })
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deskStructure,
  schemaTypes
});
