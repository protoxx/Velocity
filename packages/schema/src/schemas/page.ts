import {
  defineType,
  defineField,
  type ReferenceRule,
  type SlugRule,
  type StringRule,
} from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Contenu" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule: SlugRule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Blocs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "pageBlock" }] }],
      group: "content",
    }),
    defineField({
      name: "seo",
      title: "SEO Local",
      type: "reference",
      to: [{ type: "seoLocal" }],
      group: "seo",
      validation: (rule: ReferenceRule) => rule.required(),
    }),
  ],
});
