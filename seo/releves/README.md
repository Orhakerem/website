# Relevés mensuels

Un fichier `AAAA-MM.yml` par cycle, produit par les agents de collecte
(étapes 1 à 3) et figé par l'agent `integrite` (étape 4).

**Chaque métrique porte sa source.** `scripts/seo-check.mjs` refuse un relevé
dont une métrique n'a pas de champ `source`.

Table d'autorité — voir `SEO-PLAN-MENSUEL.md` §2, défaut 3 :

| Métrique | Source faisant autorité | Jamais utiliser |
|---|---|---|
| Clics, impressions, CTR, position | `gsc` | `ga4-gsc`, `ahrefs` |
| Sessions, engagement, conversions | `ga4` | `ahrefs` |
| Domaines référents, DR | `ahrefs` | — |
| Volumes de recherche, difficulté | *aucune source disponible* | ne pas estimer |

Si deux sources divergent d'un facteur supérieur à 2 sur une même métrique,
poser `integrite_donnees: true` et écarter la source suspecte du cycle.
