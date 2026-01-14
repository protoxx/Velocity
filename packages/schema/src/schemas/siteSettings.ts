import { defineField, defineType, type StringRule } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  fields: [
    defineField({
      name: "brandName",
      title: "Nom de marque",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "primaryColor", title: "Couleur primaire", type: "string" }),
    defineField({ name: "secondaryColor", title: "Couleur secondaire", type: "string" }),
    defineField({ name: "contactEmail", title: "Email de contact", type: "string" }),
    defineField({ name: "phone", title: "Téléphone", type: "string" }),
    defineField({ name: "address", title: "Adresse", type: "text" }),
  ],
});
