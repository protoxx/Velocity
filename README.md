# Velocity Monorepo

Stack de production Velocity (Next.js + Sanity + automation provisioning).

## Structure
- `apps/studio` : studio Sanity customisé.
- `packages/schema` : schémas/desk mutualisés.
- `scripts/provision` : seeds datasets, outils provisioning.
- `scripts/migrations` : migrations versionnées (à venir).

## Pré-requis
- Node 18+
- PNPM (via `corepack enable` ou `npm install -g pnpm`).

## Installation
```bash
pnpm install
```

## Variables d’environnement
Copier `.env.local.example` → `.env.local` et renseigner :
```
SANITY_PROJECT_ID=xxx
SANITY_DATASET=velocity-template
SANITY_WRITE_TOKEN=sk...
```

## Commandes utiles
- `pnpm dev:studio` : lancer Sanity Studio.
- `pnpm build:studio` : build production Studio.
- `pnpm seed:dataset` : pousser les documents seed (settings + pages + blocs) vers le dataset ciblé.
- `pnpm --filter @velocity/schema build` : compiler les schémas.

## Provisioning seed
1. Vérifier que `.env.local` est présent.
2. (Optionnel) éditer les fichiers JSON dans `scripts/provision/seed-data` (pages/blocs par défaut).
3. Exécuter `pnpm seed:dataset`.
4. Aller sur sanity.io → dataset choisi pour vérifier l’import (`systemSettings`, `seoLocal`, `page-welcome`).

## Roadmap immédiate
- Ajouter CLI migrations (`velocity migrate`).
- Étendre la bibliothèque de blocs et seeds (Services, Contact, Mentions légales).
- Brancher `apps/web` pour consommer les données.
