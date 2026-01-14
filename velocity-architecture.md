# Velocity – Architecture & Roadmap

## 1. Vision
- Usine à sites premium pour entreprises locales : performances, SEO local, conversions.
- Stack unifiée : Next.js + Tailwind, Sanity Headless, exports Stitch convertis en composants React, déploiement Vercel.
- Philosophie : structure verrouillée par meilleures pratiques, personnalisation uniquement via contenus et thèmes.

## 2. Architecture Globale
1. **Monorepo Turborepo/PNPM**
   - `apps/web` (Next.js App Router), `apps/studio` (Sanity v3), `packages/ui` (composants Stitch → React), `packages/schema`, `packages/config`.
   - CI Vercel (web) + Sanity deploy (studio).
2. **Pipeline Stitch → React**
   - Script `stitch:import` qui parse HTML/CSS, mappe classes vers Tailwind, génère composants + tokens.
   - Composants structurés (HeroLocal, ServicesGrid, Testimonials, etc.) documentés via Storybook.
3. **Rendu Next.js**
   - `BlockRenderer` relie les blocs Sanity aux composants React.
   - Fallback de sécurité si un `blockType` n’existe pas.
4. **Sanity Headless**
   - Documents : `page`, `block`, `settings`, `seoLocal`.
   - `blockType` verrouillés (flag `isSystemBlock`) correspondant 1:1 aux composants générés.
   - Desk structure custom + validations pour éviter toute casse visuelle.

## 3. Stratégie Sanity First
- Dataset maître `velocity-template` avec toutes les pages obligatoires (Accueil, Services, À propos, Contact, Mentions légales, RGPD, Blog facultatif) + contenu par défaut SEO local.
- Custom inputs : sélecteur de zones desservies, vérification densité mots-clés, intégration Google Business, pickers de palettes.
- Initial Value Templates pour créer de nouvelles pages pré-remplies.
- Scripts CLI :
  - `velocity sanity:bootstrap --client <slug>` → clone dataset maître, applique branding, invite l’équipe.
  - `velocity sanity:migrate` → pousse les évolutions de schémas/custom inputs sur tous les datasets.

## 4. Onboarding Digital (sans choix de blocs)
1. **Tunnel utilisateur**
   - Étapes : informations business, zone d’intervention, prestations clés, éléments différenciants, assets (logo, médias), contraintes légales, outils (prise de RDV, chat, formulaires), préférences de ton.
   - Champs SEO local obligatoires (mots-clés, communes, horaires, avis clients).
2. **Stockage & Automatisation**
   - Next API route → Prisma + Postgres (Neon/Supabase) pour leads.
   - Inngest/Jobs déclenchés :
     1. Création dataset Sanity depuis template.
     2. Injection des contenus onboarding dans les documents correspondants.
     3. Provision projet Vercel (env vars liées au dataset).
     4. Envoi des accès studio au client.
3. **Aucun choix de blocs**
   - Le mapping onboarding → blocs est fixe (HeroLocal, ServicesGrid, LocalProof, FAQ, CTA Contact, Footer légal).
   - Les clients modifient seulement leur contenu via Sanity.

## 5. Roadmap Technique
| Phase | Objectifs clés |
| --- | --- |
| **A. Sanity Custom Factory** | Définir schémas définitifs, desk structure, custom inputs SEO local, dataset maître. |
| **B. Stitch Integration** | Écrire parser/générateur, produire bibliothèque de blocs par défaut, Storybook + tests. |
| **C. Onboarding Minimaliste** | Développer tunnel formulaire, persistance leads, mapping auto vers blocs. |
| **D. Provisioning Automatisé** | Scripts CLI + jobs (dataset clone, seed contenu, déploiement Vercel, notifications). |
| **E. Extensions** | Bibliothèque de variantes sectorielles, automatisations CRM, tests E2E Playwright. |

## 6. Prochaines Étapes Immédiates
1. Initialiser le monorepo (Turborepo) + configurations Next/Sanity communes.
2. Concevoir et tester les schémas Sanity + desk structure + initial values.
3. Builder le script `stitch:import` + premiers blocs locaux.
4. Mettre en place la base données leads + API onboarding.
5. Rédiger les scripts CLI de bootstrap dataset/projet.

## 7. Mises à jour Sanity côté clients
1. **Code partagé, déploiement unique**
   - Schémas, desk structure et inputs custom vivent dans le monorepo. Une fois déployé, le studio Sanity commun reflète immédiatement les changements pour tous les clients (datasets distincts, code identique).
2. **Datasets versionnés**
   - Chaque dataset client comporte un document `systemSettings` avec `schemaVersion`. Les updates ne sont appliquées que si la version diffère.
3. **Scripts de migration contrôlés**
   - Dossier `/scripts/migrations/<version>.ts` contenant les mutations Sanity nécessaires (ajout de champs, normalisation de data).
   - CLI `velocity sanity:migrate --target client-foo --from 1.2.0 --to 1.3.0` :
     1. Vérifie la version actuelle.
     2. Exécute les mutations via `sanityClient.patch/mutate`.
     3. Met à jour `schemaVersion`.
4. **Orchestration & sécurité**
   - Liste centralisée des datasets clients (Postgres/JSON) parcourue par un job (Inngest/GitHub Action) qui lance les migrations, avec mode dry-run et exports automatiques (`sanity dataset export`) pour rollback.
   - Notification client une fois la migration appliquée.

## 8. Seeds & Automations
1. **Dataset maître**
   - JSON seeds versionnés (`scripts/provision/seed-data`) couvrant toutes les pages obligatoires : Accueil, Services, Contact, FAQ, Mentions légales.
   - Blocs fournis par défaut : Hero (home/contact/faq/legal), Zone Coverage, Case Study, Local Proof, FAQ Local, CTA Contact, Contact Map, Legal Links, Sticky Actions, About Local.
   - Script `pnpm seed:dataset` (Sanity client + tokens) pour injecter `systemSettings`, `seoLocal`, `page-welcome`, `page-services`, `page-contact`, `page-faq`, `page-mentions`.
2. **CLI internes**
   - `pnpm build:schema` : compile `@velocity/schema` via tsup (utilisé par Studio).
   - `pnpm migrate [--dataset=<slug>]` : exécute les scripts `scripts/migrations/*.mjs`, lit `schemaVersion` et applique les mutations nécessaires avant mise à jour.
3. **Gestion des secrets**
   - `.env.local` (template fourni) centralise `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_WRITE_TOKEN`.
   - `load-env` utilisé autant par le seed que par les migrations pour éviter la duplication.
3. **Workflow clone → migration → déploiement**
   1. **Clonage dataset (`velocity sanity:bootstrap`)**
      - Inputs : slug client, nom légal, contact.
      - Étapes : `sanity dataset clone velocity-template <client-dataset>` → création des documents `siteSettings/seoLocal/systemSettings`.
      - Script applique immédiatement branding de base (nom, coordonnées) puis crée les env vars Vercel (`SANITY_PROJECT_ID`, `SANITY_DATASET=<client>`).
   2. **Provision Next.js / Vercel**
      - `pnpm deploy --filter web --env SANITY_DATASET=<client>` : déploie l’app Next sur un projet Vercel cloné (ou branche).
      - Le Studio (projet unique) pointe déjà sur le dataset client via la switch list Sanity.
   3. **Mises à jour / migrations**
      - Chaque dataset possède `systemSettings.schemaVersion`.
      - Workflow single dataset : `pnpm migrate --dataset <client> --target 1.3.0`
        1. Lit la version actuelle (ex. 1.2.0).
        2. Exécute les scripts `scripts/migrations/1.2.1-*.mjs`, `1.3.0-*.mjs` dans l’ordre (patchs, ajout de champs, normalisation data).
        3. Met à jour `schemaVersion`.
      - Mode bulk (nouveau) : `scripts/migrations/migrate-all.mjs` lit `scripts/provision/clients.json`, exporte chaque dataset (`sanity dataset export <slug> logs/...tar.gz`), lance `pnpm migrate --dataset=<slug>` et enregistre les logs pour rollback.
   4. **Déploiement continu**
      - Toute modification de `@velocity/schema` ou du Studio déclenche `pnpm run build:schema` puis `sanity deploy` (studio partagé).
      - Côté web, chaque projet Vercel consomme la même base de code : un merge sur `main` reconstruit l’app pour tous les clients (datas spécifiques via env vars).

## 9. Catalogue de blocs Velocity
| Bloc | Usage principal | Champs clés |
| --- | --- | --- |
| HeroLocal | Promesse + CTA multi-pages (Accueil/Contact/FAQ/Legal) | heading, subheading, primary/secondary CTA |
| ServicesGrid | Présenter offres/services | items (array), heading |
| LocalProof | Avis clients / logos | items (citations) |
| ZoneCoverage | Zones desservies / SEO local | serviceAreas, coverageDescription |
| CaseStudy | Résultats clients locaux | metrics, gallery, richText |
| FaqLocal | FAQ optimisée rich snippet | faqs (question/réponse) |
| AboutLocal | Storytelling + labels | richText, certifications |
| ContactMap | Coordonnées + carte | address, phone, email, mapUrl |
| CtaContact | Conversion (audit/devis) | heading + CTAs |
| LegalLinks | Mentions légales / RGPD / CGV | legalLinks (label+URL) |
| StickyActions | Barre flottante mobile (call/SMS/WhatsApp/devis) | actions (type, href) |

## 10. Guide opérateur Sanity (éditeur)
1. **Accès & navigation**
   - Panneau gauche : *Pages* (documents `page`), *Blocks* (documents `pageBlock`), *Site Settings*, *SEO Local`.
   - Le Studio unique pointe sur le dataset du client couramment sélectionné (switch via Sanity > datasets).
2. **Construire une page**
   - Ouvrir *Pages* → choisir la page (ou `+` pour en créer une).
   - Remplir **Titre / Slug** puis sauvegarder (`Cmd/Ctrl+S`).
   - Onglet *Contenu* : le champ `content[]` référence des `pageBlock`. Ajouter un bloc → choisir le type (Hero, FAQ…). Réordonner par drag & drop, les champs sont verrouillés pour éviter les erreurs.
3. **Éditer un bloc**
   - Aller dans *Blocks* → ouvrir le bloc voulu (ex. `block-cta-contact`).
   - Modifier les champs (heading, CTA…). Les blocs peuvent être réutilisés par plusieurs pages.
4. **Paramétrage global**
   - *Site Settings* : nom de marque, coordonnées, palette.
   - *SEO Local* : zones desservies, horaires, avis (injectés dans les blocs SEO).
5. **Preview & mode draft**
   - Variables requises : `SANITY_STUDIO_PREVIEW_SECRET`, `SANITY_STUDIO_PREVIEW_URL` côté Studio et `SANITY_PREVIEW_SECRET` + token côté app web.
   - Dans une page (draft ou publiée), le bouton **Preview** (icône œil) apparaît dès qu’un slug est défini.
   - Cliquer sur l’œil → ouverture de `/api/preview?slug=<slug>` → se retrouve sur `/preview/<slug>` avec la bannière “Mode preview”.
   - Bouton “Quitter le preview” renvoie vers `/api/exit-preview?slug=<slug>` et recharge la page live.
6. **Publication**
   - Chaque modification enregistrée est instantanément visible en preview.
   - Cliquer sur **Publish** pour pousser la version live (Next.js lit directement les contenus Sanity).
7. **Bonnes pratiques**
   - Toujours conserver au moins un bloc CTA/Legal sur les pages obligatoires.
   - Ne jamais supprimer les documents `siteSettings/seoLocal/systemSettings` (utilisés par les scripts de migration).
   - Avant migration, noter le `schemaVersion` courant; après migration, vérifier que la valeur a été incrémentée.
8. **QA & contrôle qualité**
   - Effectuer un tour Lighthouse (mobile + desktop) sur Accueil / Contact / FAQ après chaque refonte de bloc.
   - Utiliser le bouton Preview pour valider la version draft avant publication.
   - Lancer `pnpm test --filter @velocity/web` (à venir) pour vérifier BlockRenderer + routes API avant release.
   - Script `pnpm qa:web` exécute Vitest + coverage ; à combiner avec Lighthouse CI pour les pages critiques.
