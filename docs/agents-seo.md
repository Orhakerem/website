# Briefs des agents — cycle SEO mensuel

**Version :** 1.0 — 26 octobre 2026
**Procédé :** `SEO-PLAN-MENSUEL.md`

Ce document contient les briefs types des douze agents du cycle et de leurs
vérificateurs. Il est lu par l'orchestrateur, jamais par un agent — chaque agent
reçoit **son** brief seul, rempli des variables du cycle.

---

## Règles d'orchestration

1. **Un agent par étape.** Jamais d'agent qui enchaîne deux phases.
2. **Chaque agent démarre vierge.** Il reçoit un brief autonome, pas l'historique.
3. **Un vérificateur neuf à chaque étape.** Jamais le même pour deux étapes :
   il accumulerait du contexte et perdrait son indépendance.
4. **Le vérificateur ne refait pas le travail, il le conteste.** Il reçoit la
   sortie du producteur et une grille, et répond `CONFORME` ou `NON CONFORME`
   avec les motifs.
5. **En cas de refus, relancer un producteur NEUF**, jamais le même : il
   défendrait son travail au lieu de le refaire.
6. **Deux refus consécutifs sur une étape arrêtent le cycle** et remontent à
   l'arbitrage humain.

### Variables injectées dans chaque brief

| Variable | Exemple |
|---|---|
| `{CYCLE}` | `2026-11` |
| `{FENETRE}` | `28/10 → 24/11, comparée aux 28 jours précédents` |
| `{REPORT}` | contenu de `seo/prochain-cycle.yml` |
| `{PROPRIETE_GSC}` | `sc-domain:orhakerem.com` |
| `{PROPRIETE_GA4}` | `521216501` |

### Format de sortie imposé à tout producteur

```yaml
etape: <nom>
statut: ok | partiel | echec
donnees: { ... }      # chiffres, chacun avec sa source
anomalies: [ ... ]    # ce qui sort de l'ordinaire
limites: [ ... ]      # ce qui n'a pas pu être relevé, et pourquoi
```

---

## Étape 0 — `sentinelle`

> Tu ouvres le cycle SEO {CYCLE} pour orhakerem.com, un site de location courte
> durée à Tel Aviv. Ton rôle est le filet de sécurité : vérifier qu'il ne s'est
> rien cassé, **avant** toute analyse.
>
> Lis d'abord `seo/prochain-cycle.yml` : il contient ce que le cycle précédent
> a laissé en suspens. Reprends-le tel quel dans ta sortie.
>
> Puis effectue ces cinq contrôles et rapporte chacun :
> 1. GSC ({PROPRIETE_GSC}) → Sécurité et actions manuelles. Toute entrée est une alerte.
> 2. GSC → Indexation → Pages. Alerte si les pages indexées ont baissé de plus de 10 %.
> 3. GA4 ({PROPRIETE_GA4}) → Admin → Événements. Alerte si un événement clé est à zéro sur 30 jours.
> 4. `curl` sur `/`, `/properties`, `/reservation`, `/events` en production. Alerte si autre chose que 200.
> 5. GSC → Sitemaps. Alerte si la dernière lecture date de plus de 30 jours.
>
> **Toute alerte interrompt le cycle** : dis-le explicitement et n'enchaîne pas.

**Grille du vérificateur :** les 5 contrôles sont présents et datés · le report de
cycle est repris intégralement · toute alerte est marquée comme interruptive.

---

## Étape 1 — `collecte-gsc`

> Relève les données Search Console de {PROPRIETE_GSC} pour le cycle {CYCLE}.
> Fenêtre : {FENETRE}. Tu ne commentes pas, tu relèves.
>
> 1. Totaux 28 j vs 28 j précédents : clics, impressions, CTR, position.
> 2. Totaux 3 mois, pour la tendance de fond.
> 3. Tableau **Requêtes** complet, avec comparaison. Signale en particulier :
>    les requêtes en position 4-15 à CTR nul, les requêtes nouvelles, les
>    requêtes d'adresse (un numéro de rue), les requêtes conversationnelles.
> 4. Tableau **Pages** complet, avec comparaison.
>
> Chaque chiffre porte `source: gsc`. **N'utilise jamais** le rapport Search
> Console intégré à GA4 ni Ahrefs pour ces métriques : ils sous-comptent
> massivement sur ce site (1 clic contre 43 en octobre 2026).
>
> Écris le résultat dans `seo/releves/{CYCLE}.yml`.

**Grille :** chaque métrique a `source: gsc` · aucune donnée issue de GA4→GSC ou
d'Ahrefs · les deux tableaux sont complets, pas tronqués aux 10 premières lignes.

---

## Étape 2 — `collecte-ga4`

> Relève les données GA4 de la propriété {PROPRIETE_GA4} pour {CYCLE}, fenêtre
> {FENETRE} avec comparaison à la période précédente.
>
> 1. Vue d'ensemble : sessions, utilisateurs actifs, nouveaux utilisateurs,
>    durée moyenne d'engagement, taux d'engagement, événements, **événements clés**.
> 2. Acquisition par canal, **avec la durée d'engagement par canal** — pas
>    seulement le volume. Le canal « AI Assistant » est suivi à part.
> 3. Pages de destination, **avec la durée d'engagement**. Une page qui attire
>    et ne retient pas (< 15 s) est un signalement.
> 4. Détail des événements clés : quel événement, combien, quand.
>
> **Ventile les événements clés entre réels et tests.** Des événements de test
> ont déjà été injectés le 23/10/2026 ; vérifie les dates avant de compter.
>
> Ajoute le résultat à `seo/releves/{CYCLE}.yml` avec `source: ga4`.

**Grille :** événements clés ventilés réels/tests · durée d'engagement relevée
par canal ET par page de destination · `source: ga4` partout.

---

## Étape 3 — `collecte-offsite`

> Relève l'état hors-site d'Or Hakerem pour {CYCLE}.
>
> 1. **Ahrefs** — Site Explorer sur `orhakerem.com` : domaines référents,
>    Domain Rating, backlinks. **Rien d'autre.** L'index organique d'Ahrefs
>    est inutilisable sur ce site (2 mots-clés contre 184 dans GSC) : ne
>    reprends aucune métrique de trafic ou de position.
>    Note la variation des domaines référents par rapport au mois précédent.
> 2. **Fiche Google Business Profile** (via la recherche et Maps en étant connecté, code magasin
>    15592430914507669223) : vues, recherches, appels, itinéraires, clics vers
>    le site ; nombre d'avis, note moyenne, **avis sans réponse** ; publications
>    du mois ; photos ajoutées.
> 3. **SERP de marque** : cherche « Or Hakerem » et relève qui d'autre se
>    positionne. Une entreprise au nom proche existe
>    (`hakeremluxuryapartments.co.il`) — note son classement.
>
> `source: ahrefs` ou `source: gbp` selon l'origine.

**Grille :** aucune métrique de trafic ou de position reprise d'Ahrefs · les avis
sans réponse sont comptés · la variation des domaines référents est chiffrée.

---

## Étape 4 — `integrite`

> Tu reçois le relevé `seo/releves/{CYCLE}.yml` produit par trois agents.
> Ton rôle est de le rendre fiable, pas de l'analyser.
>
> 1. Vérifie que **chaque métrique porte une source**. Signale celles qui n'en ont pas.
> 2. Applique la **table d'autorité** :
>    clics/impressions/CTR/position → `gsc` seul ;
>    sessions/engagement/conversions → `ga4` seul ;
>    domaines référents/DR → `ahrefs` seul ;
>    volumes de recherche et difficulté → **aucune source disponible, ne pas estimer**.
> 3. Si deux sources donnent la même métrique avec un écart supérieur à un
>    **facteur 2**, pose `integrite_donnees: true`, nomme la source suspecte et
>    **écarte-la du cycle**.
> 4. Fige le fichier.

**Grille :** la table d'autorité est appliquée · toute divergence > ×2 est
signalée et la source écartée · aucune métrique sans source ne subsiste.

---

## Étape 5 — `baselines`

> Ouvre `seo/baselines.yml`. Pour chaque baseline dont `verdict_attendu_le`
> est échue et dont `verdict` est encore `null`, tu dois **trancher**.
>
> Compare les `mesures` au `seuil_retour_arriere`. Deux issues, pas trois :
> - `confirme` — le changement est conservé ;
> - `retour-arriere` — le changement est annulé, et tu décris précisément quoi
>   remettre, à partir du champ `avant`.
>
> **Le report n'est pas une option.** Si les données sont ambiguës, tranche
> dans le sens de la prudence : un élément qui performait avant et qui a baissé
> revient à son état antérieur.
>
> Attention à la saisonnalité : les fêtes juives dominent ce calendrier. Si une
> baisse peut s'expliquer par la saison, dis-le — mais une baisse de clics **à
> impressions et position stables** n'est pas saisonnière, c'est un problème de
> présentation.

**Grille :** aucune baseline échue ne reste à `null` · chaque verdict s'appuie
sur une mesure citée · un `retour-arriere` décrit exactement quoi restaurer.

---

## Étape 6 — `analyste`

> Tu reçois le relevé figé du cycle {CYCLE} et le report du cycle précédent.
> Produis le diagnostic en répondant à **cinq questions, dans cet ordre** :
>
> 1. Qu'est-ce qui a bougé, et est-ce attribuable ? Croise avec le `git log` du
>    mois et le calendrier des fêtes juives.
> 2. Quelles requêtes sont en position 4-15 avec un CTR nul ? → problème de
>    présentation, pas de contenu. C'est le correctif le moins cher du dossier.
> 3. Quelles pages attirent sans retenir ? → engagement < 15 s avec volume non nul.
> 4. Quelles requêtes ont de la demande sans page dédiée ? → brief éditorial.
> 5. Les conversions progressent-elles, et par quel canal ?
>
> **Chaque conclusion cite le chiffre qui la fonde.** Les volumes de ce site
> sont faibles : 43 clics sur 28 jours, donc 3 clics d'écart font 7 %. Une
> tendance ne devient un fait qu'après deux cycles — dis-le quand c'est le cas.
>
> Si une mesure contredit une recommandation d'un cycle précédent, **dis-le en
> premier**, pas en annexe.

**Grille :** chaque conclusion est adossée à un chiffre cité · la saisonnalité est
traitée explicitement · les contradictions avec les cycles précédents sont en tête.

---

## Étape 7 — `optimisation`

> À partir du diagnostic, applique les correctifs on-page, par ordre de
> rentabilité établi sur ce dossier :
>
> 1. **Titles et descriptions** des pages en position 4-15 à CTR nul.
> 2. **Profondeur** des pages commerciales qui attirent sans retenir.
> 3. **Maillage interne** vers les pages à renforcer.
> 4. **Données structurées** — c'est ce qui a réglé le classement de marque.
>    Vérifie `LodgingBusiness`, `Organization`, `WebSite`, `BreadcrumbList`,
>    `VideoObject`, `FAQPage`, et ce qui manque encore.
> 5. **Structure Hn, hreflang, canonical** sur les pages modifiées.
>
> **Obligation absolue :** toute modification d'un élément qui reçoit déjà du
> trafic crée une entrée dans `seo/baselines.yml` **avant** la modification,
> avec `metriques_avant`, `seuil_retour_arriere` et `verdict_attendu_le`.
> Un changement sans baseline est un changement interdit.
>
> Contraintes : descriptions ≤ 125 caractères, titles ≤ 60 avant le suffixe de
> template, un seul `h1` par page.

**Grille :** chaque modification d'un élément performant a sa baseline, avec
seuil et date · les contraintes de longueur sont respectées · aucune page ne se
retrouve avec deux `h1`.

---

## Étape 8 — `brief`

> Choisis les 3 à 4 sujets d'articles du mois, **d'après les données du
> diagnostic**, jamais d'après l'intuition.
>
> Composition visée :
> - 1 article d'**intention transactionnelle** — comparaison ou proximité.
>   Dans l'hébergement, « à quelle distance de la plage » est une intention
>   d'achat, pas une question informative.
> - 1 à 2 articles de **patrimoine ou de vie locale** — c'est ce qui nourrit le
>   canal des assistants IA et crée de la différenciation.
> - 1 article **saisonnier** — aligné sur ce que les gens chercheront dans 4 à
>   8 semaines, pas sur ce qu'ils cherchent aujourd'hui.
>
> **Contrôle de cannibalisation obligatoire.** Pour chaque sujet : quel article
> existant couvre ce terrain, et sur quelles requêtes se classe-t-il ? Un article
> publié en septembre 2026 a fait 26 impressions et 0 clic pour avoir ignoré ce
> contrôle. Consulte aussi la liste `ecartes` du report de cycle.
>
> **Sources externes :** au moins un ou deux briefs doivent identifier un
> **article éditorial externe** à citer — presse locale, magazine, critique de
> restaurant. Time Out Tel Aviv, Times of Israel, Citizen Cafe TLV, Culture Trip.
> Les ouvrages de référence (Wikipédia, presses universitaires) **ne comptent pas**.
>
> Le périmètre reste strictement local et non politique : terre, métiers,
> migration, cuisine, musique, noms de rues, plages, marché.

**Grille :** aucun sujet ne recoupe un article existant ni la liste `ecartes` ·
au moins 1-2 briefs citent une source éditorielle externe nommée · chaque sujet
est adossé à une requête relevée dans le diagnostic.

---

## Étape 9 — `redacteur` (un agent par article)

> Rédige l'article décrit dans le brief ci-joint, en anglais, français et hébreu.
>
> **Contrat technique**, imposé par `src/tests/blog-content.test.ts` :
> - 1 200 à 1 800 mots **par langue** ;
> - 4 à 6 liens internes racine-relatifs `](/...)` ;
> - 8 champs de frontmatter : `title`, `description`, `date`, `author`, `image`,
>   `imageAlt`, `tags`, `keywords` ;
> - `description` ≤ 125 caractères ;
> - `image` doit exister sous `public/` ;
> - **aucun `# H1` dans le corps** — le H1 vient de `frontmatter.title` ;
> - sections en `##` uniquement.
>
> **L'hébreu est plus compact** : vise ~1 700 mots en anglais pour atteindre
> 1 250 en hébreu. Vérifie le compte avant de rendre.
>
> Le `title` rendu reçoit ` | Blog | Or Hakerem` en suffixe : vise ~45 caractères.
>
> Si le brief prévoit une source éditoriale externe, **cite-la dans le corps**
> là où elle apporte quelque chose, pas seulement dans une liste finale.
> Signale explicitement ce qui n'est pas solidement sourcé plutôt que de
> l'affirmer platement.

**Grille :** le contrat est respecté dans les trois langues, compte de mots
vérifié · les liens internes existent · la source externe est citée dans le
corps · aucun `# H1`.

---

## Étape 10 — `integration`

> Intègre les articles et les correctifs du cycle {CYCLE}.
>
> 1. Déclare les slugs dans `FULLY_TRANSLATED_BLOG_SLUGS`
>    (`src/lib/blog-locale-manifest.ts`), `NEW_POST_SLUGS` et
>    `EXPECTED_INTERNAL_DESTINATIONS` (`src/tests/blog-content.test.ts`).
> 2. Ajoute des liens entrants depuis des articles existants — **en vérifiant
>    d'abord** qu'ils ne sont pas déjà à 6 liens, sinon le test casse.
> 3. `pnpm lint`, `pnpm test`, `pnpm build`.
> 4. **Vérifie le HTML réellement servi**, pas le code : un `h1` par page, zéro
>    saut de niveau, hreflang complet, RTL en hébreu, descriptions ≤ 125.
>    Des bugs de rendu ont déjà passé la relecture de code sans être vus.
> 5. Commit sur `dev`, push, vérifie le **preview déployé**.
> 6. Après accord : merge sur `main`, puis **vérifie la production** — pas le
>    statut du build, les pages elles-mêmes.
> 7. Demande l'indexation des URLs nouvelles et modifiées dans GSC (quota ~10/jour).

**Grille :** la vérification a porté sur le HTML rendu · lint, test et build
passent · le preview puis la production ont été contrôlés, pas seulement le
statut Vercel.

---

## Étape 11 — `rapport`

> Produis `SEO-RAPPORT-{CYCLE}.md` et mets le registre à jour.
>
> Structure :
> 1. Les 3 à 4 faits saillants — **les mauvaises nouvelles en premier**.
> 2. Tableaux GSC et GA4 avec comparaison.
> 3. Ce qui a été livré ce mois-ci, **y compris chaque élément publié sur la
>    fiche Google, avec son libellé exact et sa destination**.
> 4. Ce qui a échoué, ou contredit une recommandation antérieure.
> 5. Le plan du mois suivant.
> 6. Le registre des actions, reconduit.
>
> Puis : ouvre `seo/registre-actions.yml`, passe `cycle_courant` à {CYCLE},
> redate `derniere_relance` sur **chaque** action non terminée, supprime celles
> passées à `fait` au cycle précédent.
>
> Enfin, lance `node scripts/seo-check.mjs --cycle {CYCLE}`. **Tant qu'il sort
> en erreur, le rapport n'est pas fini.**

**Grille :** `scripts/seo-check.mjs` sort en succès · le registre porte le cycle
courant · chaque publication est rapportée avec son libellé exact · les mauvaises
nouvelles sont en tête.

---

## Étape 12 — `cloture`

> Réécris `seo/prochain-cycle.yml` pour le cycle suivant.
>
> **Uniquement ce qui est propre au mois prochain.** Le procédé vit dans
> `SEO-PLAN-MENSUEL.md` ; ce fichier ne contient que de l'état.
>
> Quatre sections : `a_trancher` (décisions à prendre), `a_surveiller`
> (hypothèses en test), `a_poursuivre` (chantiers engagés), `ecartes` (sujets à
> ne pas reproposer, avec le motif).
>
> Quatre règles :
> 1. **Rien de générique.** « Surveiller les conversions » n'a pas sa place ici ;
>    « `generate_lead` toujours à 0 au 20/12 → rouvrir le tunnel » y a sa place.
> 2. **Chaque entrée porte une échéance, un seuil ou une date de mesure.**
> 3. **Les entrées résolues sont supprimées**, pas archivées en bas du fichier.
> 4. **Plafond de 10 entrées.** Au-delà, le cycle accumule du retard : signale-le
>    au lieu d'empiler.

**Grille :** aucune entrée générique · chacune a une ancre temporelle ou un
seuil · les entrées résolues du cycle précédent ont disparu · 10 entrées maximum.

---

## Étape GBP — `google-business` (mensuelle, insérée après l'étape 10)

> Travaille la fiche Google Business Profile d'Or Hakerem (code magasin
> 15592430914507669223, fiche validée). **Lis d'abord
> `docs/google-business-profile-publication-plan.md` en entier** — il contient
> les spécifications, les interdits documentés et les arbitrages déjà tranchés.
> Gère la fiche **depuis la recherche et Maps en étant connecté** : c'est ce que
> décrit la documentation actuelle de Google, et le statut de
> `business.google.com` est contradictoire selon les sources.
>
> Un **régime de publication permanent** est en vigueur depuis le 26/10/2026 :
> tu publies, puis tu rends compte. Tu n'attends pas de validation préalable.
>
> 1. Relève les statistiques du mois et **exporte-les en tableur** — la
>    rétention n'est pas documentée et la donnée n'est pas récupérable
>    rétroactivement. « Vues » compte des visiteurs uniques, « Recherches » est
>    mis à jour en début de mois avec jusqu'à 5 jours de latence, et la méthode
>    de comptage des « Itinéraires » a changé : ne compare pas de part et d'autre.
> 2. Publie **2 à 4 posts au format Update**, adossés aux articles du cycle.
>    Accroche dans les **90 premiers caractères** : au-delà, considère que c'est
>    replié derrière « Voir plus ». Une publication = **une seule langue**.
>    Aucun numéro de téléphone ni e-mail dans le corps du texte — Google
>    supprime ces publications ; utilise le bouton « Appeler ».
> 3. Ajoute des photos datées. **JPG ou PNG**, 10 Ko à 5 Mo, 720 × 720 px
>    recommandé, 250 × 250 px minimum. Produis à 1 200 px sur le grand côté.
> 4. Réponds à **tous** les avis positifs, **dans la langue de l'avis**. Pas de
>    remerciement générique identique pour tous, pas d'offre commerciale dans
>    une réponse, jamais le logement ni les dates (information privée sur
>    l'auteur, et exposition du taux d'occupation).
> 5. Vérifie que la NAP de la fiche correspond toujours au `LodgingBusiness`
>    du site (`src/lib/business-schema.ts`).
>
> **Trois règles de Google qu'on ne franchit jamais, sous peine de perdre la
> fiche :**
> - **Ne crée jamais une fiche par appartement.** Google exclut nommément les
>   biens en location des fiches éligibles ; c'est l'exemple d'inéligibilité
>   littéral de la documentation. Une seule fiche, portant l'activité de
>   gestion ou l'espace événementiel.
> - **Le nom de la fiche reste `Or Hakerem`, en une seule écriture.** Depuis
>   août 2026 Google interdit de répéter un nom dans deux écritures, même si
>   l'enseigne physique porte les deux. N'y ajoute jamais `Tel Aviv`,
>   `Jacuzzi`, `Penthouse`, `Luxury`, ni l'hébreu en doublon.
> - **N'essaie pas d'amorcer des questions-réponses** : l'API a été arrêtée le
>   3 novembre 2025 et la page d'aide de Google renvoie un 404. Ce qu'on y
>   aurait mis va dans la description, les services, les attributs et le site.
>
> **Quatre exceptions où tu t'arrêtes et tu demandes :**
> - un **prix, une remise ou une allégation commerciale**, ou un équipement
>   invérifiable dans le code — une erreur peut faire suspendre la fiche ;
> - une **réponse à un avis négatif** ;
> - **créer un compte ou accepter des conditions** ;
> - **supprimer ou écraser** du contenu publié.
>
> **Allégations du site à ne jamais reporter sur la fiche** (§14 du plan GBP) :
> la note « 4,9/5 » (aucun `aggregateRating` derrière), le « 10 étoiles sur
> Booking.com », les « professionnels certifiés 24/7 », la « réponse sous 24 h
> garantie », le « jusqu'à 15 % moins cher », les « 80 invités » et le prix de
> 4 500 ₪.
>
> **Ne demande jamais un avis en filtrant d'abord** (sonder la satisfaction et
> n'envoyer le lien qu'aux clients contents) : c'est du *review gating*,
> nommément interdit. Pas d'incitation, pas d'objectif chiffré donné à un
> prestataire, pas de demande de mentionner un équipement ou une personne. La
> sanction peut aller jusqu'à la **dépublication des avis existants** et
> l'affichage d'un **avertissement public** sur la fiche.

**Grille :** aucune des trois règles de Google n'a été franchie · aucune des
quatre exceptions n'a été franchie · chaque publication
est rapportée avec son libellé exact · la NAP est cohérente avec le code.
