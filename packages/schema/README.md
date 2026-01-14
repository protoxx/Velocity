# @velocity/schema

Bibliothèque de schémas et structure Sanity mutualisée.

## Contenu
- `src/schemas`: documents Sanity (pages, blocks, settings, SEO local).
- `src/structure`: desk structure personnalisée pour Velocity.

## Scripts
- `pnpm --filter @velocity/schema build`: compile les schémas via tsup.

## Utilisation
Dans `sanity.config.ts` :
```ts
import { schemaTypes, deskStructure } from "@velocity/schema";

defineConfig({
  schema: { types: schemaTypes },
  plugins: [deskTool({ structure: deskStructure })],
});
```
