import { defineField, defineType, type StringRule } from "sanity";

export const block = defineType({
  name: "pageBlock",
  title: "Bloc de page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom interne",
      type: "string",
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "blockType",
      title: "Type de bloc",
      type: "string",
      options: {
        list: [
          { title: "Hero Local", value: "heroLocal" },
          { title: "Services Grid", value: "servicesGrid" },
          { title: "Preuves Sociales", value: "localProof" },
          { title: "FAQ Locale", value: "faqLocal" },
          { title: "CTA Contact", value: "ctaContact" },
          { title: "Zone de chalandise", value: "zoneCoverage" },
          { title: "Cas client / Avant-Après", value: "caseStudy" },
          { title: "À propos local", value: "aboutLocal" },
          { title: "Carte + Contact", value: "contactMap" },
          { title: "Liens légaux", value: "legalLinks" },
          { title: "Actions flottantes", value: "stickyActions" },
        ],
      },
      validation: (rule: StringRule) => rule.required(),
    }),
    defineField({
      name: "data",
      title: "Données",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", title: "Titre" }),
        defineField({ name: "subheading", type: "text", title: "Sous-titre" }),
        defineField({ name: "items", type: "array", of: [{ type: "text" }], title: "Items" }),
        defineField({ name: "primaryCta", type: "string", title: "CTA principal" }),
        defineField({ name: "secondaryCta", type: "string", title: "CTA secondaire" }),
        defineField({
          name: "serviceAreas",
          title: "Zones desservies",
          type: "array",
          of: [{ type: "string" }],
          hidden: ({ parent }) => parent?.blockType !== "zoneCoverage",
        }),
        defineField({
          name: "coverageDescription",
          title: "Description chalandise",
          type: "text",
          hidden: ({ parent }) => parent?.blockType !== "zoneCoverage",
        }),
        defineField({
          name: "metrics",
          title: "Métriques clés",
          type: "array",
          of: [
            defineField({
              name: "metric",
              type: "object",
              fields: [
                defineField({ name: "label", type: "string", title: "Label" }),
                defineField({ name: "value", type: "string", title: "Valeur" }),
              ],
            }),
          ],
          hidden: ({ parent }) => parent?.blockType !== "caseStudy",
        }),
        defineField({
          name: "gallery",
          title: "Galerie (avant/après)",
          type: "array",
          of: [{ type: "image" }],
          options: { layout: "grid" },
          hidden: ({ parent }) => parent?.blockType !== "caseStudy",
        }),
        defineField({
          name: "faqs",
          title: "Questions fréquentes",
          type: "array",
          of: [
            defineField({
              name: "faq",
              type: "object",
              fields: [
                defineField({ name: "question", type: "string", title: "Question" }),
                defineField({ name: "answer", type: "text", title: "Réponse" }),
              ],
            }),
          ],
          hidden: ({ parent }) => parent?.blockType !== "faqLocal",
        }),
        defineField({
          name: "richText",
          title: "Texte long",
          type: "text",
          hidden: ({ parent }) => !["aboutLocal", "caseStudy"].includes(parent?.blockType ?? ""),
        }),
        defineField({
          name: "certifications",
          title: "Certifications / labels",
          type: "array",
          of: [{ type: "image" }],
          options: { layout: "grid" },
          hidden: ({ parent }) => parent?.blockType !== "aboutLocal",
        }),
        defineField({
          name: "address",
          title: "Adresse complète",
          type: "text",
          hidden: ({ parent }) => parent?.blockType !== "contactMap",
        }),
        defineField({
          name: "lat",
          title: "Latitude",
          type: "number",
          hidden: ({ parent }) => parent?.blockType !== "contactMap",
        }),
        defineField({
          name: "lng",
          title: "Longitude",
          type: "number",
          hidden: ({ parent }) => parent?.blockType !== "contactMap",
        }),
        defineField({
          name: "phone",
          title: "Téléphone",
          type: "string",
          hidden: ({ parent }) => !["contactMap", "stickyActions", "ctaContact"].includes(parent?.blockType ?? ""),
        }),
        defineField({
          name: "email",
          title: "Email",
          type: "string",
          hidden: ({ parent }) => parent?.blockType !== "contactMap",
        }),
        defineField({
          name: "mapUrl",
          title: "Lien Google Maps",
          type: "url",
          hidden: ({ parent }) => parent?.blockType !== "contactMap",
        }),
        defineField({
          name: "legalLinks",
          title: "Liens légaux",
          type: "array",
          of: [
            defineField({
              name: "link",
              type: "object",
              fields: [
                defineField({ name: "label", type: "string", title: "Titre du lien" }),
                defineField({ name: "url", type: "url", title: "URL" }),
              ],
            }),
          ],
          hidden: ({ parent }) => parent?.blockType !== "legalLinks",
        }),
        defineField({
          name: "actions",
          title: "Actions flottantes",
          type: "array",
          of: [
            defineField({
              name: "action",
              type: "object",
              fields: [
                defineField({ name: "label", type: "string", title: "Label bouton" }),
                defineField({
                  name: "type",
                  type: "string",
                  title: "Type",
                  options: {
                    list: [
                      { title: "Appel", value: "call" },
                      { title: "SMS", value: "sms" },
                      { title: "WhatsApp", value: "whatsapp" },
                      { title: "Devis", value: "link" },
                    ],
                  },
                }),
                defineField({ name: "href", type: "string", title: "Lien / numéro" }),
              ],
            }),
          ],
          hidden: ({ parent }) => parent?.blockType !== "stickyActions",
        }),
      ],
    }),
  ],
});
