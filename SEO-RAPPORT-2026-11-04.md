# Rapport SEO — cycle 2026-11

**Mois analysé :** octobre 2026 (01/10 → 31/10) comparé à septembre 2026 (01/09 → 30/09)
**Cycle :** lancé le 04/11 à 7h par la tâche planifiée, interrompu trois fois, repris en session avec toi les 04 et 05/11, clos le 05/11
**Sources :** relevé figé `seo/releves/2026-11.yml` (GSC `sc-domain:orhakerem.com`, GA4 `521216501`, Ahrefs, fiche Google), diagnostic validé `seo/releves/2026-11.diagnostic.md`, `git log`
**Rapport précédent :** `SEO-RAPPORT-2026-10-26.md`
**Contrôle :** `node scripts/seo-check.mjs --cycle 2026-11` → **aucun blocage** (1 avertissement attendu : `integrite_donnees: true`)

---

## Ce sur quoi j'ai besoin de toi

### 1. Tu me donnes l'accord pour fusionner dev → main ?

| | |
|---|---|
| **Ce qui est bloqué** | Tout ce qui a été livré sur le site ce cycle est **en preview seulement** : 2 articles en trois langues (6 URL), 12 titles et descriptions, liens entrants. Les 12 baselines posées le 04/11 (verdict le 04/01/2027) mesurent une production qui n'a pas changé tant que main n'est pas fusionnée. L'article Hanoukka doit être indexé avant le 04/12, date de la 1re bougie. |
| **Ce qui a été fait en attendant** | Le preview a été vérifié sur le HTML servi : https://website-i5nqrgcho-or-hakerem.vercel.app (commit `27613a9`). Le 12/11 est inscrit comme date butoir dans `seo/prochain-cycle.yml`. Passé cette date, la fenêtre de mesure des baselines est amputée d'autant. |
| **Ce que je recommande** | **Fusionner maintenant.** Ensuite, je vérifie la production et je demande à GSC l'indexation des 6 nouvelles URL et des 8 URL modifiées. |

### 2. Je peux corriger l'UTM du bouton « Site web » et du lien de réservation de la fiche s'ils sont en `organic` ?

| | |
|---|---|
| **Ce qui est bloqué** | Je ne peux pas attribuer les **10 clics vers le site** venus de la fiche en octobre (source gbp). Sans UTM conforme, GA4 les classe en google / organic ou en direct. |
| **Ce qui a été fait en attendant** | Les 2 publications du 04/11 ont été corrigées le 05/11 (voir « Ce qui a été livré »). Le §13 du plan de publication est aligné sur `docs/utm-links.md`. L'action `gbp-utm-boutons` est ouverte au registre. |
| **Ce que je recommande** | Je lis les deux URL au prochain passage sur la fiche, sans rien modifier. Si elles sont en `organic` ou sans UTM, tu m'autorises à passer à `utm_source=google_business_profile&utm_medium=referral`, comme pour les publications. C'est une modification de fiche : il faut ton accord. |

### 3. Le `generate_lead` du 01/11 est un vrai contact ou un test ?

| | |
|---|---|
| **Ce qui est bloqué** | Le seuil du 20/11 dans `prochain-cycle.yml`. Selon ta réponse, on rouvre ou non le diagnostic du tunnel de formulaire. |
| **Ce qui a été fait en attendant** | GA4 montre 1 `generate_lead` et 1 `contact_outbound` le 01/11 (source ga4, `hors_fenetre`). C'est le premier lead depuis les correctifs du 23/10. Il n'est pas vérifié. |
| **Ce que je recommande** | Regarde si un e-mail Resend est arrivé le 01/11, ou s'il y a une ligne du 01/11 dans la table `reservations`, et dis-le-moi. Tu peux aussi m'autoriser à lire la table Supabase, en lecture seule. |

---

## Ce qui contredit les cycles précédents

Toutes ces erreurs viennent du rapport du 26/10 ou de `prochain-cycle.yml`. Chaque correction est sourcée dans le diagnostic.

| # | On avait écrit | En réalité | Source |
|---|---|---|---|
| C1 | « 4 conversions réelles, toutes WhatsApp » | **1** seul événement clé réel dans cette fenêtre. Les 6 événements clés comptaient **5 tests** du 23/10, pas 2, et `contact_outbound` n'est compté comme clé que depuis le 25/10, sans effet rétroactif. En événements bruts, il y en avait 7. | ga4 |
| C2 | « Le seuil de retour arrière du title d'accueil est franchi » | Le seuil **n'a jamais été franchi** : les impressions sont toujours sorties de la bande ±15 % (−23 %, −16 %, −18 %). Le retour arrière repose sur la règle de prudence : CTR plus bas sur 3 relevés, à position égale ou meilleure. | gsc, baselines |
| C3 | « −33 % d'impressions dus à la fin des fêtes » | L'effet des fêtes ne peut pas être isolé. **Environ 95 %** de la baisse vient de 2 URL : l'article plage (527 → 2) et `/blog` (262 → 46). Sans elles, la baisse n'est que de −1,6 %. C'est septembre qui sort de la norme : octobre est à −11 % d'août. | gsc |
| C4 | « La position moyenne se dégrade » | C'est surtout un effet de composition des requêtes. L'article plage sort de la demande à position stable, et le cluster « luxe » en hébreu grossit tout en descendant. Seul `/blog` perd vraiment du rang (9,5 → 26,1). | gsc |
| C5 | « Cluster plage : réécrire title et description » (et la mesure prévue le 20/12) | La réécriture **n'a jamais été faite** : le fichier n'a qu'un commit, du 23/06. La demande plage nommée tombe à **0** en octobre. Les « 7 requêtes » mêlaient d'autres sujets. | git, gsc |
| C6 | « La marque est réglée (`or hakerem` en position 1,4) » | `or hakerem` a fait **0 impression** en octobre (14 en septembre). La marque n'est ni réglée ni perdue : elle n'est pas mesurée ce mois-ci. | gsc |
| C7 | « `/events` est la seule page qui convertit » | Cette affirmation reposait sur la page de destination GA4, une dimension écartée. En GSC, `/events` fait 2 clics. | gsc |
| C8 | « Penthouse : 11 sessions à 9 s » | Même dimension écartée. La seule donnée valide vient de GSC : 0 clic pour 52 impressions, position 11,0. | gsc |
| C9 | « Organic Search produit la moitié des conversions » | Les 3 événements clés organiques d'octobre sont des tests du 23/10. **0** conversion organique réelle. | ga4 |
| C10 | « L'article plage est désindexé en /fr et /he » | Les versions /fr et /he **n'ont jamais existé** : le code ne les publie pas. L'URL anglaise est toujours servie (2 impressions). | code, gsc |

---

## Les faits saillants

| | Fait | Chiffres et source |
|---|---|---|
| 🔴 | **Aucune conversion venue de Google n'est démontrée en octobre.** Les 2 seuls événements clés réels présumés viennent de ChatGPT, les 25 et 26/10. | 7 événements clés, dont 5 tests du 23/10 (ga4) |
| 🔴 | **Les pages commerciales anglaises ne reçoivent aucun clic, alors qu'elles sont en page 1-2.** Leurs titles ont été corrigés ce cycle, mais en preview seulement. | `/properties` 78 impressions, position 9,7 ; penthouse 52 impressions, position 11,0 ; 0 clic (gsc) |
| 🟠 | **Les impressions baissent de 26 % et la position recule de 11,3 à 16,2.** Deux URL concentrent la baisse (voir C3 et C4). | 2 971 → 2 196 (gsc) |
| 🟢 | **Les clics tiennent et plusieurs pages progressent.** | 49 → 50 clics ; `/he` 6 → 10 ; guide de quartier 3 → 6 ; article Shabbat 0 → 4 (gsc) |

---

## Données d'octobre comparées à septembre

**Intégrité : `integrite_donnees: true`.** La dimension « page de destination » de GA4 (`pages_destination`, `pages_moins_15s_oct`) diverge de GSC d'un facteur supérieur à 2. Exemple : `/he` reçoit 10 clics GSC pour 4 sessions google / organic. Elle est donc **écartée**, et aucune conclusion par page ne s'appuie sur GA4. Les rangs SERP sont aussi écartés : ils restent indicatifs. Les totaux, eux, concordent : 50 clics GSC pour 47 sessions google / organic, soit ×1,06.

### GSC

| Métrique | Sept. | **Oct.** | Δ | Source |
|---|---:|---:|---:|---|
| Clics | 49 | **50** | +2 % | gsc `totaux_*` |
| Impressions | 2 971 | **2 196** | −26 % | gsc |
| CTR | 1,6 % | **2,3 %** | +0,7 pt | gsc |
| Position moyenne | 11,3 | **16,2** | −4,9 | gsc |
| Accueil `/` sur 28 j (04/10-31/10 vs 06/09-03/10) | 15 clics / 328 impr. | **12 / 315** | −20 % / −4 % | gsc `home_28j` |
| Clics venus de requêtes anonymisées | 41 / 49 | **48 / 50** | | gsc |

| Page | Clics sept. → oct. | Impressions sept. → oct. | Position | Source |
|---|---:|---:|---:|---|
| `/` | 17 → 12 | 375 → 345 | 6,4 → 6,1 | gsc |
| `/he` | 6 → 10 | 138 → 148 | 10,3 → 6,9 | gsc |
| `/blog/kerem-hateimanim-neighborhood-guide` | 3 → 6 | 587 → 482 | 9 → 9 | gsc |
| `/blog/tel-aviv-on-shabbat-…` | 0 → 4 | 116 → 159 | 7,6 → 6,8 | gsc |
| `/he/properties` | 0 → 0 | 221 → 319 | 42,3 → 53,7 | gsc |
| `/blog/how-far-is-…-beach` | 0 → 0 | **527 → 2** | 5,1 → 5,5 | gsc |
| `/blog` | 0 → 1 | **262 → 46** | **9,5 → 26,1** | gsc |

### GA4

| Métrique | Sept. | **Oct.** | Source |
|---|---:|---:|---|
| Sessions | 75 | **132** | ga4 `vue_ensemble_*` |
| Utilisateurs actifs | 49 | **89** | ga4 |
| Taux d'engagement | 73,3 % | **66,7 %** | ga4 |
| Durée moyenne d'engagement par session | 40 s | **47 s** | ga4 |
| Événements clés | 3 (non ventilés) | **7, dont 5 tests et 2 réels présumés** | ga4 `evenements_cles_oct` |
| `contact_outbound` bruts (WhatsApp) | 4 | **9**, dont 8 réels présumés | ga4 |

| Canal | Sessions sept. → oct. | Engagement oct. | Événements clés oct. | Source |
|---|---:|---:|---:|---|
| Direct | 19 → **56** (42,4 %) | 55,4 % | 2, des tests | ga4 `canaux` |
| Organic Search | 34 → **52** | **80,8 %**, 66 s | 3, des tests | ga4 |
| AI Assistant (chatgpt.com) | 18 → 16 | 56,3 % | **2, réels** | ga4 |
| Organic Social | 4 → 9 | 66,7 % | 0 | ga4 |

---

## Hors-site

| Domaine | Relevé du 04/11 | Source |
|---|---|---|
| Liens (Ahrefs) | DR **2,8** (3 au 01/10, variation d'arrondi), **936** domaines référents (945 au 01/10, −9), 1 668 backlinks | ahrefs |
| Fiche Google | 183 vues · 41 interactions : 31 itinéraires, **10 clics vers le site**, 0 appel, 0 chat · **4 avis, note 4,0**, 0 nouvel avis · 0 publication en octobre · NAP conforme à `business-schema.ts` · catégorie principale : « Agence de location d'appartements à court terme ». Export : `seo/releves/gbp-stats-2026-10.csv` | gbp |
| SERP de marque (session connectée, **indicative**) | « Or Hakerem » : orhakerem.com 1er avec 6 sitelinks et panneau de connaissance, mais l'homonyme Hakerem Luxury Apartments occupe les rangs 4 à 7, 9 et 12. « hakerem » : le concurrent est 2e, nous sommes 3e ; l'aperçu IA affiche le concurrent à 4,9 (54 avis), nous à 4,0 (4 avis) | serp, écartée |

---

## Ce qui a été livré

### Fiche Google : 2 publications le 04/11

| Langue / type / bouton | Libellé exact | Destination finale (corrigée le 05/11) |
|---|---|---|
| EN · Nouveauté · *En savoir plus* | « Choosing where to stay shapes the pace of a Tel Aviv visit. Our neighbourhood guide compares beach access, markets, walks, and the character of several central areas — including Kerem HaTeimanim, close to Carmel Market and the sea. Read the guide before choosing the base that fits your trip. » | `https://www.orhakerem.com/blog/where-to-stay-in-tel-aviv-neighborhoods-guide?utm_source=google_business_profile&utm_medium=referral&utm_campaign=gbp&utm_content=post_2026-11_where-to-stay-in-tel-aviv-neighborhoods-guide` |
| HE · Nouveauté · *Réserver* | « קל יותר לתכנן חגיגה אינטימית כשכל השאלות המעשיות ברורות כבר מההתחלה. המדריך שלנו לתל אביב עוסק בתזמון האורחים, בתכנון ההגעה, באפשרויות לינה בקרבת מקום ובנקודות שכדאי לאשר לפני שבוחרים מקום. קראו אותו בתחילת התכנון של האירוע הפרטי שלכם. » | `https://www.orhakerem.com/he/blog/private-events-tel-aviv-intimate-celebrations?utm_source=google_business_profile&utm_medium=referral&utm_campaign=gbp&utm_content=post_2026-11_private-events-tel-aviv-intimate-celebrations` |

**Correction d'URL du 05/11.** Les deux publications sont parties le 04/11 avec `utm_source=google&utm_medium=organic`, ce qui contredit `docs/utm-links.md`, et le vérificateur les a refusées. Tu as autorisé la modification le 05/11, au titre de l'exception « écraser du contenu publié ». Les deux URL ont été corrigées et les publications sont repassées « En attente » d'examen Google. Le 2e vérificateur est CONFORME. Les deux pages de destination existent déjà en production.
**Aussi sur la fiche :** aucun avis positif n'est resté sans réponse, l'avis de Daniel T n'a pas été touché (décision arrêtée) et la NAP est cohérente.

### Site : 12 modifications on-page (commit `a86a2cb`, preview seulement)

Une baseline a été posée **avant** chaque modification dans `seo/baselines.yml`. Les métriques d'avant viennent de GSC (octobre, ou 28 j pour l'accueil). Le verdict est attendu le **04/01/2027**.

| # | URL · élément | Avant | Après | Baseline (clics / impr. / pos.) |
|---|---|---|---|---|
| 1 | `/` · title | Luxury Apartments in Tel Aviv \| Or Hakerem | Luxury Apartments in Tel Aviv \| Or Hakerem \| Kerem HaTeimanim (retour arrière) | `home-title-retour-2026-11-04` · 12 / 315 / 6,0 |
| 2 | `/he` · title | דירות יוקרה בתל אביב \| אור הכרם | אור הכרם \| אירוח בוטיקי ואירועים בכרם התימנים, תל אביב | `he-home-title-…` · 10 / 148 / 6,9 |
| 3 | `/he` · description | דירות פרימיום להשכרה לטווח קצר… | אור הכרם בכרם התימנים, תל אביב: שהיות קצרות בדירות בוטיק… | `he-home-description-…` · 10 / 148 / 6,9 |
| 4 | `/he/properties` · title | דירות יוקרה בתל אביב \| הנכסים של אור הכרם | דירות יוקרה להשכרה בתל אביב \| פנטהאוז ודירה \| אור הכרם | `he-properties-title-…` · 0 / 319 / 53,7 |
| 5 | `/he/properties` · description | …פנטהאוז עם ג׳קוזי פרטי וסטודיו נעים… | …פנטהאוז עם ג׳קוזי פרטי ודירת חדר שינה משופצת… | `he-properties-description-…` · 0 / 319 / 53,7 |
| 6 | `/properties` · title | Luxury Apartments in Tel Aviv \| Or Hakerem Properties | Tel Aviv Rentals: Jacuzzi Penthouse & 1-Bedroom \| Or Hakerem | `properties-title-…` · 0 / 78 / 9,7 |
| 7 | `/properties` · description | A penthouse with private jacuzzi and a cosy studio… | Two rentals in Kerem HaTeimanim…: a 3-bedroom penthouse… and a renovated 1-bedroom apartment. | `properties-description-…` · 0 / 78 / 9,7 |
| 8 | `/properties/penthouse-jacuzzi` · title | Luxury Penthouse with Private Jacuzzi & Sea Views \| Tel Aviv \| Or Hakerem | 3-Bedroom Jacuzzi Penthouse in Tel Aviv \| Or Hakerem | `penthouse-jacuzzi-title-…` · 0 / 52 / 11,0 |
| 9 | `/properties/penthouse-jacuzzi` · description | …Book direct and save 15%. | Rent a 3-bedroom penthouse for up to 7 guests… (sans remise) | `penthouse-jacuzzi-description-…` · 0 / 52 / 11,0 |
| 10 | `/he/blog/where-to-stay…` · description | מדריך מעשי לבחירת מקום לינה… | איפה ללון בתל אביב ליד הים? השוואה בין… | `he-blog-where-to-stay-description-…` · 0 / 73 / 9,4 |
| 11 | `/fr/blog/where-to-stay…` · description | Un guide pratique pour choisir où séjourner… (188 caractères) | Où loger à Tel Aviv près de la plage ? Kerem HaTeimanim, Neve Tzedek… | `fr-blog-where-to-stay-description-…` · 0 / 30 / 8,3 |
| 12 | `/blog/kerem-hateimanim-neighborhood-guide` · description | Discover Kerem HaTeimanim — Tel Aviv's most authentic… | Kerem HaTeimanim, Tel Aviv's Yemenite Quarter: history, best streets… | `blog-kerem-hateimanim-neighborhood-guide-description-…` · 6 / 482 / 9,0 |

Facteur confondant noté sur les n° 4 et 5 : le nouvel article HE renvoie vers `/he/properties`.

### Site : 2 articles en trois langues (commit `0669917`, preview seulement)

| Article | Langues | Sources externes | Notes |
|---|---|---|---|
| `luxury-apartment-vs-hotel-suite-tel-aviv` | en / fr / he | Aucune, conformément au brief | Cible le cluster « luxe » en hébreu sous l'angle du séjour (227 impressions d'intention location en octobre, gsc). 1 refus (conciergerie « à l'avance », taxi de nuit), puis CONFORME |
| `hanukkah-tel-aviv-sufganiyot-candle-lighting` | en / fr / he | **Presse locale :** Time Out Israel, « Sufganiyot Season… », Jacob Jaffe, 12/12/2019 ; Ynet, « Six super Sufganiyot and Latkes », Buzzy Gordon, 29/12/2019. Calendrier : Hebcal, « Chanukah 2026 » | Sujet choisi sur le calendrier, sans aucune requête observée dans GSC. 1 refus (compte des soirs faux, Biscotti / Bnei Brak), puis CONFORME |

**Liens entrants** (`96fec84`, puis `27613a9`) : `short-term-seasonal-rentals` → article luxe, et `small-jewish-celebrations` → Hanoukka, dans les trois langues. Deux liens ont été retirés après un refus à l'étape 10 : ils faisaient dépasser à leurs articles le plafond de 6 liens internes.

**En preview seulement, en attente de main :** les 6 URL d'articles, les 12 modifications et les liens entrants. Seules les publications sur la fiche sont publiées, et elles sont en attente d'examen par Google depuis la correction d'URL du 05/11.

---

## Ce qui a échoué

| Quoi | Ce qui s'est passé |
|---|---|
| **Article `kerem-hateimanim-yemenite-restaurants`** | **Reporté** au cycle 2026-12, sur ta décision du 05/11, après **3 refus**. Les sources datent de 2012, 2016 et 2018, et le texte glissait sans cesse vers le présent (« ce restaurant sert… ») sans qu'aucune adresse n'ait été vérifiée. Le brouillon est rangé dans `seo/brouillons/…/` avec `MOTIFS.md` (commit `2c300b8`). Il n'est pas publié. |
| **Étape 0, arrêt du 04/11 au matin** | (1) La 1re sentinelle tournait **sur le mauvais profil Chrome** et a conclu à tort à une perte d'accès à GSC et GA4. (2) Un refus du vérificateur venait **de l'orchestrateur, pas du producteur** : il avait résumé le report de cycle au lieu de le transmettre tel quel. Un producteur neuf a refait l'étape, avec une transmission par fichier. (3) La 3e sentinelle était CONFORME mais lançait une alerte : `purchase` à 0. GA4 interdit de le retirer, et la règle a été précisée avec ton accord. |
| **Étape 4 (intégrité), 2 refus** | Le recoupement par page a d'abord été déclaré « non comparable », à tort, puis chiffré faux (23 au lieu de 17 contre 4). Arrêt du cycle. Tu as dit de poursuivre, et le 3e producteur était CONFORME. |
| **Étape 6 (diagnostic), 2 refus** | La v1 utilisait des séries journalières absentes du relevé. La v2 attribuait mal des commits. Arrêt du cycle. Tu as dit de poursuivre, et la v3 était CONFORME. |
| **Refus isolés, corrigés au passage suivant** | Article luxe ×1, article Hanoukka ×1, UTM de la fiche ×1, étape 10 (liens) ×1. |
| **`run_scheduled_task`** | Il est refusé depuis une session de tâche : le cycle a dû être repris à la main dans la session. |

---

## Dettes repérées hors périmètre

| Dette | Où | Suite |
|---|---|---|
| Remise « 15 % » encore présente | `src/lib/property-seo.ts` l. 38, 56, 70, 87, 100 (descriptions fr et he du penthouse, 3 descriptions du cozy-studio) | registre `allegations-15pct-studio` |
| « studio » pour un bien d'une chambre ; « up to 6 » invités alors que property-seo dit 7 | cozy-studio (titles et keywords), `/fr/properties` (`seo.ts` l. 122-124), `penthouse-vs-studio`, `short-term-seasonal` EN | idem, avec baseline obligatoire |
| Descriptions de plus de 125 caractères ; plus de 6 liens internes | best-time-to-visit (155 car., 7 liens), penthouse-vs-studio (168 car., 10 liens), guide de quartier (7 liens) | à traiter avec la ligne précédente |
| 4,9/5 affiché sur le site contre 4,0 réel sur Google | site | toujours non corrigé |
| Dimension « page de destination » de GA4 non fiable | GA4 | registre `ga4-page-destination` (échéance 03/12) |
| Pas de BreadcrumbList | `/properties`, `/he/properties` | non ouvert |
| **L'article Hanoukka cite des adresses de boulangeries tirées de sources de 2019.** La règle ajoutée ce cycle (source de moins de 3 ans, ou adresse vérifiée) s'applique aussi à lui, et le journal ne dit pas que ces adresses ont été vérifiées | `content/blog/*/hanukkah-…mdx` l. 53-56 | à vérifier avant la fusion, ou juste après |
| `seo-check.mjs` : une ligne de note en colonne 0 arrêtait la lecture du registre, si bien que `gbp-attribution` et `ga4-purchase-cle` n'étaient jamais contrôlés. Le contrôle des sources ne lit qu'une fenêtre de ±6 lignes | `seo/registre-actions.yml` (corrigé le 05/11), `scripts/seo-check.mjs` | durcir le lecteur |

---

## Le mois suivant

Le détail, avec les échéances et les seuils, est dans **`seo/prochain-cycle.yml`** (réécrit à l'étape 12) et dans le registre ci-dessous. Je ne le répète pas ici. L'ordre qui compte : la fusion dev → main avant le 12/11, puis le lead du 01/11 avant le 20/11, puis le relevé 2026-12 du 04/12.

## Registre reconduit (`seo/registre-actions.yml`, cycle 2026-11)

| Action | Resp. | État | Échéance | Ce cycle |
|---|---|---|---|---|
| `gbp-publications` | claude | en-cours | 30/11 | 2 publications le 04/11, UTM corrigé le 05/11, en attente d'examen |
| `gbp-utm-boutons` *(nouv.)* | propr. | bloque | 30/11 | UTM du bouton « Site web » et du lien de réservation à lire, puis à corriger avec ton accord |
| `gbp-photo-exterieure` *(transférée de prochain-cycle)* | propr. | bloque | 30/11 | photo de l'enseigne toujours absente |
| `gbp-categories` | claude | en-cours | 30/11 | principale conforme ; secondaires pas encore vues |
| `gbp-reponses-avis` | propr. | bloque | 30/11 | signaler ou non l'avis de Daniel T : toujours ouvert |
| `utm` | propr. | bloque | 30/11 | Direct à 42,4 % ; liens non posés |
| `ga4-page-destination` *(nouv.)* | claude | en-cours | 03/12 | diagnostic à faire avant la collecte de décembre |
| `article-restaurants-reprise` *(nouv.)* | claude | en-cours | 04/12 | reprise si au moins 4 des 7 adresses sont confirmées |
| `entite-concurrente` | claude | en-cours | 31/12 | collision confirmée sur la SERP ; marque à re-mesurer sur 3 mois |
| `allegations-15pct-studio` *(nouv.)* | claude | en-cours | 31/12 | baselines d'abord |
| `collecte-avis` | propr. | bloque | 31/12 | toujours 4 avis, note 4,0 |
| `netlinking` | propr. | en-cours | 31/12 | 936 domaines référents ; aucun contact ce cycle |
| `citations-annuaires` | propr. | bloque | 31/12 | rien de nouveau |
| `gbp-attribution` | claude | bloque | 31/12 | pas commencé ; contrôlé pour la 1re fois |
| `gbp-validation`, `gbp-entite`, `gbp-horaires`, `nap-telephone`, `ga4-purchase-cle` | | fait | | conservées : leur consigne est « à supprimer au cycle de décembre » |

## Ce que j'ai modifié dans la tâche planifiée, et pourquoi

Fichier : `~/.claude/scheduled-tasks/seo-mensuel-orhakerem/SKILL.md`

| Section | Modification | Pourquoi |
|---|---|---|
| Accès | Quel profil Chrome voit GSC et GA4, et comment le retrouver | Le mauvais profil a coûté un faux diagnostic de perte d'accès à l'étape 0 |
| Accès | Une exécution planifiée ne peut pas se relancer elle-même : la reprise se fait dans la session | `run_scheduled_task` est refusé depuis une session de tâche |
| Décisions arrêtées | `purchase` n'est pas une alerte : seul un événement clé déjà déclenché qui tombe à 0 en est une | GA4 interdit de le retirer, et il gelait le cycle à chaque fois. Changé avec ton accord du 04/11 |
| Décisions arrêtées | L'UTM de la fiche est `google_business_profile` / `referral` | Les publications sont parties en `google` / `organic`, et il a fallu les corriger et les faire réexaminer |
| Contenu | Une source qui décrit des commerces doit dater de moins de 3 ans, sinon l'adresse doit être vérifiée | 3 refus sur l'article restaurants, à cause de sources de 2012-2018 |
