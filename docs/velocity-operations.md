# Velocity — Guide opérateur

Ce document décrit toutes les étapes nécessaires pour exploiter la stack Velocity, du setup local jusqu’au déploiement Vercel d’un nouveau client. Chaque section référence les scripts existants et les variables d’environnement attendues.

## 1. Pré-requis

1. **Node + PNPM** : Node 20+ et `pnpm@9` (le projet fixe la version dans `packageManager`).
2. **CLI Sanity** : `npm install -g @sanity/cli` pour permettre les commandes `sanity dataset ...` utilisées par les scripts.
3. **CLI Vercel (facultatif)** : utile pour inspecter un projet ou récupérer un token, mais non requis pour les automations.
4. **Accès Sanity** : un token `SANITY_WRITE_TOKEN` avec droits `write` sur le projet racine.
5. **Accès Vercel** : un `VERCEL_TOKEN` (scope `projects`, `deployments`, `env.write`).

## 2. Configuration `.env.local`

Le script `bootstrap-client` lit les variables Sanity et Vercel dans `.env.local`. Exemple complet :

```
SANITY_PROJECT_ID=uvojc8nn
SANITY_DATASET=velocity-template
SANITY_WRITE_TOKEN=***
SANITY_PREVIEW_SECRET=velocity-preview-secret
SANITY_PREVIEW_TOKEN=${SANITY_WRITE_TOKEN}

VERCEL_TOKEN=***
VERCEL_TEAM_ID=
VERCEL_DEPLOY_HOOK_URL=
```

- `SANITY_PREVIEW_SECRET` doit matcher la valeur utilisée par `apps/web` et le Studio.
- `VERCEL_TEAM_ID` est optionnel si le projet vit dans l’espace personnel.
- `VERCEL_DEPLOY_HOOK_URL` permet de déclencher un deploy après provisionnement.

## 3. Scripts disponibles

| Commande | Description |
| --- | --- |
| `pnpm dev:web` / `pnpm dev:studio` | Démarre Next.js (App Router) / Sanity Studio. |
| `pnpm seed:dataset` | Injecte les documents système + pages par défaut dans le dataset actif. |
| `pnpm migrate -- --dataset=<slug>` | Applique les scripts de migration ciblés. |
| `node scripts/provision/bootstrap-client.mjs --clientSlug=foo` | Clone le dataset template, seed, synchronise Vercel et lance éventuellement un deploy. |
| `pnpm qa:web` | Lance les tests Vitest (routes preview + BlockRenderer). |
| `pnpm qa:lighthouse` | Warm-up Next.js puis lance Lighthouse CI sur `/`. |

## 4. Bootstrap d’un nouveau client

1. **Préparer les variables** (voir §2).
2. **Exécuter** :
   ```bash
   node scripts/provision/bootstrap-client.mjs \
     --clientSlug=boucherie-lacroix \
     --brandName="Boucherie Lacroix" \
     --dataset=boucherie-lacroix \
     --vercelProject=velocity-boucherie \
     --deployHook="https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx"
   ```
3. **Ce que fait le script** :
   1. Clone le dataset `SANITY_TEMPLATE_DATASET` → `<dataset>`.
   2. Seed les documents système + pages obligatoires (Accueil, Services, FAQ, Contact…).
   3. Appelle `syncVercelProject` pour créer/configurer le projet Vercel :
      - création du projet (si absent) avec framework Next.js,
      - injection des variables `SANITY_*` sur les trois environnements,
      - déclenchement du deploy hook si fourni.
4. **Résultat** : un dataset client prêt dans Sanity + un projet Vercel prêt à builder l’app Next.

> ⚠️ Si `VERCEL_TOKEN` n’est pas défini, l’étape Vercel est simplement ignorée.

### 4.1 Cycle de vie après la mise en place initiale

Les étapes lourdes (initialisation Git, push complet du monorepo, configuration du Root Directory Vercel vers `apps/web`) ne sont à réaliser **qu’une seule fois**. Ensuite :

- Chaque nouveau client se résume à relancer la commande `bootstrap-client` avec son slug/dataset.
- Le script détecte si un dataset existe déjà et saute automatiquement le clonage.
- Le projet Vercel garde la configuration `apps/web` : seules les variables d’environnement et le deploy hook sont rafraîchis.
- Les mises à jour de code se font via les commits habituels (`git commit` / `git push`), sans impact sur les datasets existants.

## 5. Synchronisation Vercel (détails)

`syncVercelProject` (`scripts/provision/utils/vercel-sync.mjs`) expose :

- `getProject`/`createProject` (API Vercel v10) pour provisionner un projet `nextjs`.
- Suppression systématique des anciennes variables d’environnement avant réinjection (targets `production`, `preview`, `development`).
- Déclenchement facultatif du deploy via `VERCEL_DEPLOY_HOOK_URL` ou `--deployHook`.

Réutiliser cette fonction dans d’autres scripts (migrations bulk, orchestrations) suffit pour garder les projets Vercel alignés.

### 5.1 Paramétrage du projet Vercel (Root Directory & build)

Quand le bootstrap déclenche le deploy hook, Vercel doit pointer vers l’application Next située dans `apps/web` :

1. **Project Settings → General → Root Directory** : sélectionner `apps/web`.
2. **Build & Output Settings** :
   - Install command : `pnpm install`
   - Build command : `pnpm --filter @velocity/web build`
   - Output directory : `.next`
3. **Framework Preset** : `Next.js` (détecte automatiquement `next` listé dans `apps/web/package.json`).

Sans ce paramétrage, Vercel cherche un `package.json` à la racine du repo, ne trouve pas `next` et échoue avec : “No Next.js version detected…”.

## 6. QA & Monitoring

1. **Tests unitaires** (`pnpm qa:web`) : couvre les routes `api/preview` + `BlockRenderer`. À lancer avant chaque merge.
2. **Lighthouse CI** (`pnpm qa:lighthouse`) :
   - Warm-up automatique (build Next + requêtes sur `/`, `/contact`, `/faq`).
   - Prépare des dossiers temporaires `.tmp/lhci-*` et fixe les flags Chrome pour Windows.
   - Les rapports sont dumpés dans `.lighthouse/`. En cas de 404 sur `/contact` ou `/faq`, prévoir un fallback Sanity ou désactiver temporairement les URLs.
3. **Warnings connus** :
   - React `key` warning sur certaines listes (à corriger côté blocs dès que possible).
   - Sur Windows, `taskkill` peut logguer des erreurs “processus introuvable” lors du shutdown Chrome → safe à ignorer.

## 7. Workflow complet (résumé)

1. **Init local** : cloner repo → installer PNPM → copier `.env.local.example`.
2. **Seed template** : `pnpm seed:dataset` (optionnel si dataset déjà prêt).
3. **Bootstrap client** : commande `node scripts/provision/bootstrap-client.mjs ...`.
4. **Vérifier sur Vercel** : projet créé, variables présentes, premier deploy lancé.
5. **Studio** : le dataset client est accessible via Sanity Studio (switch dataset).
6. **QA** : `pnpm qa:web` puis `pnpm qa:lighthouse` (une fois les pages /contact et /faq disponibles).
7. **Déploiements suivants** : un merge sur `main` rebuild chaque projet Vercel (code partagé), seules les données Sanity diffèrent.

## 8. Glossaire rapide

- **Dataset maître** : `velocity-template`, contient toutes les pages/blocs par défaut.
- **System documents** : `systemSettings`, `siteSettings`, `seoLocal`.
- **Blocks canoniques** : HeroLocal, ServicesGrid, LocalProof, FAQ, CTA Contact, Contact Map, Legal Links, etc. Ils sont listés dans `velocity-architecture.md`.
- **Preview secret** : token partagé entre Studio et site pour sécuriser `/api/preview`.

---
**Contact** : Pour toute question sur l’automatisation Vercel ou l’extension du pipeline, se référer au dossier `scripts/provision/utils/` et aux issues correspondantes dans le repo.
