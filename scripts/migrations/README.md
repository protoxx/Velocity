# Migrations Sanity Velocity

Chaque migration doit être versionnée et rejouable.

## Convention
- `scripts/migrations/<version>-<slug>.ts`
- Exporter une fonction `run(client)` qui reçoit un `SanityClient` configuré.
- La fonction doit être idempotente (vérifier existence avant création/modification).

## Exécution
- Utiliser le CLI interne (à venir) `pnpm velocity migrate --dataset <slug>`.
- Chaque migration devra mettre à jour le champ `schemaVersion` dans `systemSettings`.
