# Plan SEO mensuel automatisé — Or Hakerem

**Version :** 2.0 — 26 octobre 2026
**Périmètre :** `orhakerem.com` (EN/FR/HE) — location courte durée et événements, Kerem HaTeimanim, Tel Aviv
**Nature :** spécification d'une tâche mensuelle exécutée par une chaîne d'agents
**Fondé sur :** `SEO-AUDIT.md` (juin), `SEO-AUDIT-2026-08.md`, `ANALYTICS-AUDIT-2026-08-25.md`, `SEO-SUIVI-2026-08-25.md`, `SEO-SUIVI-2026-10-23.md`, `SEO-RAPPORT-2026-10-26.md`

> **Statut au 26 octobre 2026 : mise en place faite.** Les fichiers d'état et le contrôle bloquant existent, les briefs d'agents sont écrits, la fiche Google est vérifiée. **Le premier cycle n'est pas lancé** — il démarre le 1er novembre.

---

## 1. Objet

Quatre mois de travail ont donné des résultats réels — la marque est passée de la position 9-10 à **1,4**, le blog de 7 à 19 articles, `/fr` et `/he` sont devenues les meilleures pages du site. Mais trois défauts se répètent à chaque cycle et annulent une partie du gain.

Ce plan transforme le suivi SEO en **tâche mensuelle automatisée**, exécutée par une chaîne d'agents spécialisés, avec un contrôle indépendant à chaque étape et des garde-fous qui rendent les trois défauts structurellement impossibles.

---

## 2. Les trois défauts et leur correctif

Un rappel écrit ne suffit pas : les trois règles existaient déjà sous forme de prose et ont été enfreintes quand même. Chacune reçoit donc un **artefact vérifiable par machine** et une **étape qui bloque le cycle** tant qu'il n'est pas à jour.

### Défaut 1 — La valeur fuit par les chantiers non exécutés

Quatre playbooks complets dorment depuis août : Google Business Profile, citations d'annuaires, liens UTM, netlinking (1 contact sur 38). Le diagnostic « 43 % de Direct » posé le 25 août est toujours vrai aujourd'hui — à 45,9 %, en hausse de 211 % — et la solution était écrite depuis deux mois.

**Correctif — `seo/registre-actions.yml`**

Un registre structuré, pas une liste en prose. Chaque entrée porte :

```yaml
- id: gbp-activation
  action: Activer et publier sur la fiche Google Business Profile
  document: docs/google-business-profile-publication-plan.md
  responsable: proprietaire        # proprietaire | claude
  etat: bloque                     # bloque | en-cours | fait
  ouvert_depuis: 2026-08-25
  derniere_relance: null
  echeance: 2026-11-30
  impact: eleve
  pourquoi: Canal majeur pour un hébergement, totalement inexploité
```

**Mécanisme de blocage :** le script `scripts/seo-check.mjs` sort en erreur si une entrée `etat != fait` n'a pas été relancée au cours du cycle courant. **Le rapport mensuel ne peut pas être produit tant que le script échoue.** La relance n'est pas une politesse : c'est une condition de sortie.

### Défaut 2 — On change ce qui marche sans filet

Le title de la page d'accueil a été raccourci le 22 septembre. Deux périodes plus tard, elle a perdu la moitié de ses clics **à position et impressions stables**. Aucun seuil de retour arrière n'avait été posé, et personne ne s'était engagé à regarder.

**Correctif — `seo/baselines.yml`**

Toute modification d'un élément qui performe (title, meta description, H1, structure d'une page qui reçoit déjà du trafic) crée obligatoirement une entrée :

```yaml
- id: home-title-2026-09-22
  url: /
  element: title
  avant: "Luxury Apartments in Tel Aviv | Or Hakerem | Kerem HaTeimanim"
  apres: "Luxury Apartments in Tel Aviv | Or Hakerem"
  date: 2026-09-22
  metriques_avant:                 # 28 j précédant le changement
    clics: 16
    impressions: 386
    ctr: 4.1
    position: 6.5
  seuil_retour_arriere: "clics -25% à impressions ±15% sur 28 j"
  revues: [2026-10-20, 2026-11-17]
  verdict: null                    # null | confirme | retour-arriere
```

**Mécanisme de blocage :** `seo-check.mjs` échoue si une revue est échue sans verdict. L'étape de diagnostic doit trancher : confirmer ou revenir en arrière. **Pas de troisième option, pas de report.**

### Défaut 3 — On fait confiance aux outils sans les vérifier

L'index Ahrefs recense 2 mots-clés quand GSC en voit 184. L'intégration Search Console de GA4 compte 1 clic quand GSC en compte 43. Les deux ont été utilisés avant d'être recoupés.

**Correctif — table d'autorité + contrôle de divergence**

| Métrique | Source faisant autorité | Jamais utiliser |
|---|---|---|
| Clics, impressions, CTR, position | **GSC** | GA4 → Search Console, Ahrefs |
| Sessions, engagement, conversions | **GA4** | Ahrefs Traffic analytics |
| Domaines référents, DR | **Ahrefs** | — |
| Volumes de recherche, difficulté | *aucune source disponible* | ne pas estimer |

**Mécanisme de blocage :** chaque chiffre collecté est enregistré avec sa source dans `seo/releves/AAAA-MM.yml`. Si deux sources divergent d'un facteur supérieur à 2 sur une même métrique, l'agent pose un drapeau `integrite_donnees` et **la source suspecte est écartée du cycle**. Le vérificateur de l'étape refuse le relevé si une métrique n'a pas de source déclarée.

---

## 3. Architecture multi-agents

### Principes non négociables

1. **Un agent par étape.** Jamais d'agent qui enchaîne deux phases.
2. **Chaque agent démarre vierge.** Il reçoit un brief autonome, pas l'historique de la conversation.
3. **Un vérificateur neuf à chaque étape.** Jamais le même vérificateur pour deux étapes : il accumulerait du contexte et perdrait son indépendance.
4. **Le vérificateur ne refait pas le travail, il le conteste.** Il reçoit la sortie du producteur et une grille de contrôle, et répond `CONFORME` ou `NON CONFORME` avec les motifs.
5. **Un agent ne reçoit que ce dont il a besoin.** Les sorties circulent sous forme de handoffs compacts, pas de transcriptions.
6. **Deux refus consécutifs sur une étape arrêtent le cycle** et remontent à l'arbitrage humain.

### Le rôle de l'orchestrateur

L'orchestrateur — la session principale — ne collecte pas de données et ne rédige pas d'articles. Il :
- lance chaque agent avec son brief,
- reçoit le handoff, le transmet à un vérificateur neuf,
- en cas de `NON CONFORME`, relance un **producteur neuf** avec les motifs,
- tient le fil et produit la synthèse finale.

### Format de handoff

Chaque agent rend un bloc court et structuré, jamais de prose longue :

```yaml
etape: collecte-gsc
statut: ok                 # ok | partiel | echec
donnees: { ... }           # les chiffres, avec leur source
anomalies: [ ... ]         # ce qui sort de l'ordinaire
limites: [ ... ]           # ce qui n'a pas pu être relevé, et pourquoi
```

---

## 4. Le cycle mensuel

Onze étapes, chacune avec son producteur et son vérificateur. Durée visée : **4 h**, dont la moitié en rédaction.

| # | Étape | Agent producteur | Le vérificateur contrôle |
|---|---|---|---|
| **0** | **Filet de sécurité** | `sentinelle` — actions manuelles, pages indexées, événements clés reçus, HTTP 200 sur les pages clés, lecture du sitemap | Que les 5 contrôles ont été faits et que toute alerte interrompt bien le cycle |
| **1** | **Relevé GSC** | `collecte-gsc` — 28 j vs 28 j, 3 mois, tableaux requêtes et pages complets | Chaque chiffre a une source ; aucune donnée issue de GA4→GSC ou d'Ahrefs |
| **2** | **Relevé GA4** | `collecte-ga4` — vue d'ensemble, canaux avec durée d'engagement, pages de destination, détail des événements clés | Les événements clés sont ventilés entre réels et tests ; la durée d'engagement est relevée, pas seulement le volume |
| **3** | **Relevé hors-site** | `collecte-offsite` — Ahrefs (domaines référents, DR uniquement), fiche Google Business Profile, avis | Qu'aucune métrique de trafic Ahrefs n'a été reprise (table d'autorité §2) |
| **4** | **Contrôle d'intégrité** | `integrite` — recoupe les trois relevés, applique la règle du facteur 2 | Que les divergences sont signalées et les sources suspectes écartées |
| **5** | **Revue des baselines** | `baselines` — ouvre `seo/baselines.yml`, tranche chaque revue échue | Qu'aucune revue échue ne reste sans verdict `confirme` ou `retour-arriere` |
| **6** | **Diagnostic** | `analyste` — les 5 questions (§4.1), avec ventilation saisonnière | Que chaque conclusion s'appuie sur un chiffre cité, et que la saisonnalité est traitée |
| **7** | **Optimisation on-page** | `optimisation` — titles et descriptions en position 4-15 à CTR nul, profondeur, maillage, données structurées | Que toute modification a créé une entrée dans `seo/baselines.yml` avec seuil et dates de revue |
| **8** | **Brief éditorial** | `brief` — choix des 3-4 sujets d'après les données, contrôle de cannibalisation, sources externes identifiées | Qu'aucun sujet ne recoupe un article existant, et qu'au moins 1-2 briefs citent une source éditoriale externe |
| **9** | **Rédaction** | `redacteur` — **un agent par article**, trilingue | Contrat `blog-content.test.ts` : 1 200-1 800 mots, 4-6 liens, frontmatter, description ≤ 125, image existante, pas de `# H1` |
| **10** | **Intégration et livraison** | `integration` — manifeste, test, liens entrants, lint/test/build, vérification du HTML servi, commit, preview | Que la vérification a porté sur le **HTML rendu**, pas sur le code |
| **11** | **Rapport et relances** | `rapport` — rapport daté, registre des actions redaté, `seo-check.mjs` au vert | Que `scripts/seo-check.mjs` sort en succès et que le registre porte la date du cycle |
| **12** | **Report de cycle** | `cloture` — réécrit `seo/prochain-cycle.yml` : uniquement ce qui est propre au mois suivant | Qu'aucune entrée n'est générique, que chacune porte une échéance ou un seuil, et que les entrées résolues ont été **supprimées** |

### 4.1 Les cinq questions du diagnostic

1. Qu'est-ce qui a bougé, et est-ce attribuable ? Croiser avec le `git log` et le calendrier des fêtes.
2. Quelles requêtes sont en position 4-15 avec un CTR nul ? → problème de présentation, pas de contenu.
3. Quelles pages attirent sans retenir ? → engagement sous 15 s avec volume non nul.
4. Quelles requêtes ont de la demande sans page dédiée ? → brief éditorial du mois.
5. Les conversions progressent-elles, et par quel canal ?

---

### 4.2 Le report de cycle — ce qui rend la tâche cumulative

Sans mémoire d'un mois sur l'autre, la tâche se réexécute à l'identique et oublie ce qu'elle a mis en route. L'étape 12 existe pour ça.

**Le procédé ne bouge pas, l'état oui.** La méthode vit dans ce document et dans les briefs d'agents ; elle est stable. Ce qui change chaque mois vit dans **`seo/prochain-cycle.yml`**, versionné dans git — donc diffable, relisible, et avec un historique. C'est ce qui donne un vrai suivi plutôt qu'un prompt qui enfle.

L'agent `cloture` le réécrit en fin de cycle. L'agent `sentinelle` le lit en tout début du cycle suivant, avant toute collecte.

```yaml
cycle: 2026-11
etabli_le: 2026-11-26

a_trancher:            # décisions à prendre, avec échéance ferme
  - id: home-title-2026-09-22
    quoi: Verdict définitif sur le retour arrière du title d'accueil
    echeance: 2026-12-15
    contexte: 2e revue, clics -50% à position et impressions stables

a_surveiller:          # hypothèses en cours de test, avec seuil
  - quoi: generate_lead après les correctifs formulaires du 24/10
    seuil: si toujours 0 sur 28 j, rouvrir le diagnostic du tunnel
  - quoi: cluster plage après réécriture des titles
    mesurer_le: 2026-12-20

a_poursuivre:          # chantiers engagés, non terminés
  - quoi: Publications GBP — rythme de 2 à 4 par mois à tenir

ecartes:               # pour ne pas les reproposer
  - sujet: petits-événements-juifs
    motif: cannibalisation confirmée avec private-events
```

**Quatre règles, contrôlées par le vérificateur :**

1. **Rien de générique.** « Surveiller les conversions » n'a pas sa place ici : c'est dans le procédé. « `generate_lead` toujours à 0 au 20/12 → rouvrir le tunnel » y a sa place.
2. **Chaque entrée porte une échéance ou un seuil.** Sans quoi elle ne sera jamais tranchée.
3. **Les entrées résolues sont supprimées**, pas archivées en bas du fichier. Le fichier doit rester court ; s'il grossit de mois en mois, c'est que rien ne se termine.
4. **Plafond de 10 entrées.** Au-delà, c'est que le cycle accumule du retard : l'agent le signale au lieu d'empiler.

---

## 5. Pilier Google Business Profile

C'est le manque le plus coûteux du dossier. Pour un hébergement à Tel Aviv, le pack local est un canal d'acquisition à part entière, et il est **entièrement inexploité** depuis la création du site.

### 5.1 Mise en place préalable — faite le 26 octobre

`docs/google-business-profile-publication-plan.md`, qui datait d'août et n'avait
jamais été activé, est **réécrit**. Conduit en multi-agents comme prévu : un
agent a extrait les faits de la société depuis le dépôt, un agent a repris les
bonnes pratiques sur la documentation Google, et un vérificateur neuf a contrôlé
chaque affirmation sur pièces.

**Trois découvertes qui changent le document, et pas seulement le mettent à
jour :**

**🔴 Les appartements ne sont pas éligibles à une fiche.** Google exclut
nommément « les biens en location ou à la vente, tels que les maisons de
vacances, les maisons témoins ou les appartements vacants »
(<https://support.google.com/business/answer/13763036>). L'entité éligible est
l'activité de gestion, ou l'espace événementiel — qui passe naturellement le
test du contact en personne. Créer une fiche par appartement serait le geste le
plus susceptible de nous faire perdre la fiche entière. Les logements passent par
Google Vacation Rentals, via un partenaire de connectivité.

**🔴 Une règle nouvelle de Google, d'août 2026, nous visait directement.** Les
« noms bilingues répétés » sont désormais interdits : répéter le même nom dans
deux écritures est une violation de politique, **même si l'enseigne physique
porte les deux**. Un nom de fiche `Or Hakerem אור הכרם` serait un vecteur de
suspension. Une seule écriture.

**🟡 Les questions-réponses n'existent plus.** L'API a été arrêtée le 3 novembre
2025 et la page d'aide de Google renvoie un 404 — vérifié. On ne peut plus
amorcer de questions. Ce qu'on y aurait mis va désormais dans la description, les
services, les attributs et le site, puisque c'est de là que les réponses sont
synthétisées.

**Et une correction d'ampleur sur nos propres données :** l'adresse est écrite de
**six façons différentes** dans le dépôt, un **troisième numéro de téléphone**
erroné traîne dans le `README.md` depuis l'audit d'août, **aucun fichier ne
déclarait d'horaires** (ce qui empêche l'affichage du logo et rend l'éligibilité non
démontrable), et le **4,9/5 affiché sur la page propriétés n'est adossé à aucun
`aggregateRating`**. Cinq actions nouvelles au registre : `gbp-entite`,
`gbp-horaires`, `gbp-categories`, `nap-telephone`, `gbp-attribution`.

**Un déblocage immédiat :** les quatre brouillons de publication rédigés en août
étaient en `HOLD` pour deux motifs — URL de destination non live et approbation
humaine. Les **quatre URL renvoient 200** (vérifié) et l'approbation est acquise.
Le blocage était administratif. Trois sont publiables en l'état au premier cycle ;
le quatrième est à réécrire, parce qu'il repose sur l'allégation « jusqu'à 15 %
moins cher » qui relève de l'exception §5.3.

### 5.2 Dans le cycle mensuel

| Fréquence | Action |
|---|---|
| Mensuel | Relevé des statistiques de la fiche : vues, recherches, appels, itinéraires, clics vers le site |
| Mensuel | 2 à 4 publications au format **Update**, adossées aux articles du mois |
| Mensuel | Ajout de photos datées — les fiches actives sont favorisées |
| Mensuel | Réponse à **tous** les avis, positifs comme négatifs |
| Mensuel | Vérification que la NAP de la fiche correspond toujours au `LodgingBusiness` du site |
| Trimestriel | Revue des catégories et des attributs — les questions-réponses ont été supprimées par Google (API arrêtée le 3 novembre 2025, page d'aide en 404) : on ne peut plus amorcer de questions |

### 5.3 Régime de publication — autorisation permanente du 26 octobre

**Je publie, puis je rends compte.** Vous ne validez plus chaque élément en amont ; vous corrigez après si nécessaire. Cette autorisation **remplace la « publication gate »** écrite dans `docs/google-business-profile-publication-plan.md` en août, qui exigeait un accord humain avant chaque action publique — c'est précisément elle qui a gelé le chantier pendant deux mois.

Chaque élément publié figure dans le rapport mensuel avec **son libellé exact, sa destination et sa date**, pour que la correction soit possible.

**Quatre exceptions où je m'arrête quand même**, parce qu'une erreur y coûte plus cher que l'attente :

| Exception | Pourquoi |
|---|---|
| Un **prix, une remise ou une allégation commerciale**, ou un équipement invérifiable dans le code | Une erreur peut faire **suspendre la fiche** Google |
| Une **réponse à un avis négatif** | Réputationnel, et ça dégénère vite |
| **Créer un compte ou accepter des conditions** en votre nom | Hors de ce que je fais, quelle que soit l'autorisation |
| **Supprimer ou écraser** du contenu publié | L'ajout est réversible, l'effacement beaucoup moins |

### 5.4 État de la fiche au 26 octobre — vérifié

Le prérequis bloquant est levé.

| | |
|---|---|
| Fiche | **validée à 100 %** |
| Code magasin | `15592430914507669223` |
| Nom affiché | Or Hakerem |
| Adresse affichée | `hakovshim 35, tel aviv, 6329302` — casse à corriger |
| Interactions clients | **331** |
| Diagnostic Google | « Tout va bien », aucune recommandation en attente |

**Ce que l'inspection a révélé, et qui n'était dans aucun audit :**

**🔴 Quatre avis, aucune réponse.** Dont un négatif sévère vieux de onze
semaines : « un endroit horrible qui se comporte comme une boîte de nuit au
milieu d'un quartier résidentiel ». Les trois autres sont positifs — un 10/10,
deux éloges sur l'emplacement et la propreté. Laisser un avis de ce type sans
réponse pendant trois mois est le plus mauvais signal possible, pour Google
comme pour un lecteur. La réponse aux trois positifs est à ma charge ; celle à
l'avis négatif relève de l'exception et sera soumise avant publication.

**🟡 Une entreprise au nom quasi identique se positionne sur la marque.**
`hakeremluxuryapartments.co.il` — « Hakerem Luxury Apartments » — apparaît dans
le SERP de marque. L'audit d'août attribuait le mauvais classement sur la marque
à une « collision d'entité » sans pouvoir la nommer : voici le candidat. La
requête `hakerem luxury apartments` (152 impressions, position 5,3) est
probablement **leur** marque et non la nôtre, ce qui changerait la lecture de
cette ligne dans tous les rapports précédents. À instruire avant d'en tirer
une conclusion.

**🟡 Des listes OTA concurrentes de notre propre bien.** Booking.com, Agoda et
`telavivhotelsisrael.com` publient chacun une page sur le penthouse ou sur
« Hakerem apartment ». Elles captent une part du trafic de marque.

**🟢 Une citation d'annuaire existe déjà** sans action de notre part :
`easy.co.il` publie une fiche Or Hakerem en hébreu.

### 5.5 Intervention du 27 octobre — ce qui a changé sur la fiche

| Action | État |
|---|---|
| Horaires corrigés : dim.–jeu. 08:00–19:00, ven. 08:00–12:00, sam. fermé | ✅ **en ligne** |
| Réponse à Yoann M. (français), Julian Levit (anglais), adi ziv (hébreu) | ✅ **publiées** |
| Réponse à l'avis négatif de Daniel T. | 🔴 en attente — exception |

**Deux découvertes qui corrigent des rapports antérieurs :**

**La fiche ne manquait pas d'horaires : elle en déclarait de faux.**
« Ouvert 24h/24 » du dimanche au jeudi — le « 24/7 » de la conciergerie avait
fui dans un champ structuré. Google présentait l'établissement comme ouvert à
3h du matin. C'est plus dommageable qu'une absence d'horaires.

**🔴 La note Google réelle est 4,0 sur 4 avis**, pas 4,9. Le site affiche
« 4.9/5 — Verified guest rating » : il ne s'agit donc pas d'une note simplement
non adossée, mais d'une note qui **contredit** la note publique de Google.

**Et la collision de marque est bien plus large que mesurée.** Le SERP de marque
contient cinq entités au nom quasi identique, dont **HaKerem Luxury Apartments :
9,4/10 sur 166 avis** sur Booking. Contre nos 4 avis à 4,0. Cet écart explique
le mauvais classement de marque bien mieux que n'importe quel facteur technique
— ce qui fait de la **collecte d'avis le levier le plus rentable du dossier**,
devant les publications.

## 6. Fichiers de la mise en place

| Fichier | Rôle | État |
|---|---|---|
| `seo/registre-actions.yml` | Chantiers ouverts, responsable, échéance, date de relance | ✅ créé |
| `seo/baselines.yml` | Modifications d'éléments performants, seuil et date de verdict | ✅ créé |
| `seo/prochain-cycle.yml` | Report de cycle — état propre au mois suivant (§4.2) | ✅ créé |
| `seo/releves/` | Un relevé par cycle, chaque métrique avec sa source | ✅ créé |
| `scripts/seo-check.mjs` | Contrôle bloquant des trois défauts | ✅ créé et testé |
| `docs/agents-seo.md` | Briefs des douze agents et grilles de leurs vérificateurs | ✅ créé |
| `docs/google-business-profile-publication-plan.md` | Reprise du document d'août | ✅ réécrit |
| `~/.claude/scheduled-tasks/seo-mensuel-orhakerem/SKILL.md` | La tâche planifiée elle-même — procédé, accès, régime de publication et **décisions arrêtées** | ✅ armée, 1er du mois à 9h |

**Trois destinations pour ce qu'un cycle apprend, à ne pas mélanger** — c'est ce
qui fait que la tâche s'enrichit au lieu de se répéter :

| Ce qui est appris | Où ça va |
|---|---|
| État propre au mois suivant — un seuil, un verdict à rendre, un sujet écarté | `seo/prochain-cycle.yml` |
| Un chantier ouvert, son responsable, son échéance | `seo/registre-actions.yml` |
| **Une décision arrêtée, ou un changement du procédé** | **la tâche elle-même** |

La troisième est la plus facile à oublier. Sans elle, un arbitrage rendu une fois
est reproposé le mois suivant — ce qui use la confiance dans le dispositif plus
sûrement qu'une erreur. Exemple déjà consigné : la décision du 27 octobre de ne
pas répondre à l'avis de Daniel T.

Le contrôle a été vérifié dans les deux sens : il passe sur le cycle de mise en
place d'octobre, et il **bloque** sur novembre tant que les douze actions
ouvertes n'ont pas été relancées — ce qui est précisément son rôle.

## 7. Spécificités du secteur — ce qui oriente les arbitrages

**La proximité est une intention d'achat.** « À quelle distance de la plage » n'est pas une question informative : c'est quelqu'un qui compare des logements. Le site a **sept requêtes de ce type entre les positions 4,2 et 9,7, toutes à zéro clic**.

**Les requêtes d'adresse sont le signal d'intention le plus fort.** `חיים חבשוש 23 תל אביב`, `הכובשים 35 תל אביב` : quelqu'un vérifie une annonce vue ailleurs.

**La réservation directe est le modèle économique.** Le maillage doit converger vers elle sans la marteler.

**Les avis pèsent sur le classement local et sur la conversion.** Aujourd'hui suivis nulle part.

**Trois intentions, trois types de page.** Inspiration → comparaison → réservation. Le blog couvre bien la première ; les pages commerciales de la troisième font 400 à 500 mots quand les concurrents en font 1 100 à 2 200.

**La saisonnalité domine.** Fêtes juives, été, et la semaine israélienne du dimanche au jeudi.

---

## 8. Registre des actions

Le registre vit désormais dans **`seo/registre-actions.yml`**, contrôlé par
`scripts/seo-check.mjs`. État au 26 octobre — 8 entrées :

| Action | Responsable | État |
|---|---|---|
| Fiche Google revendiquée et validée | propriétaire | ✅ **fait** — vérifié le 26/10 |
| Répondre aux 4 avis Google | **claude** | ⛔ échéance 07/11 |
| Tenir 2 à 4 publications par mois sur la fiche | **claude** | ⛔ échéance 30/11 |
| Poser les liens UTM | propriétaire | ⛔ échéance 30/11 |
| Créer les citations d'annuaires | propriétaire | ⛔ échéance 31/12 |
| Netlinking — 5 contacts par semaine | propriétaire | 🔸 1 sur 38 |
| Mettre en place une collecte d'avis | propriétaire | ⛔ échéance 31/12 |
| Instruire la collision de marque | **claude** | ⛔ échéance 30/11 |

Trois de ces huit actions sont passées à ma charge depuis l'autorisation du 26
octobre. C'était le but : le registre ne doit pas être une liste de choses que
vous seul pouvez faire.

## 9. Focus roulant

| Mois | Thèmes |
|---|---|
| **Novembre 2026** | **Récupérer les clics perdus** — verdict sur le title d'accueil, titles et descriptions du cluster plage (7 requêtes en position 4-10 à zéro clic, aucune rédaction nécessaire).<br>**+ Ouvrir le hors-site** — reprise du document GBP, premières publications, pose des UTM. L'autorisation du 26/10 vient de lever le blocage qui durait depuis août. |
| **Décembre 2026** | **Profondeur commerciale** — `/events` (479 mots, 2ᵉ page d'entrée, seule page qui convertit) et `/properties/penthouse-jacuzzi` (9 s d'engagement).<br>**+ Cadence netlinking** — 5 contacts par semaine sur les 37 prospects restants. |
| **Janvier 2027** | **Consolidation** — mesurer ce que le hors-site a produit, citations d'annuaires, collecte d'avis. Premier cycle où les trois leviers tournent ensemble. |

Le hors-site ne passe plus en dernier. C'était le plafond réel du site, et il vient d'être débloqué : le faire attendre deux mois reviendrait à reproduire le défaut 1.

---

## 10. Ce qui mesure le succès

| Indicateur | Référence 26/10/2026 | Cible 3 mois |
|---|---:|---|
| **Événements clés réels par mois** | 4 | **15+** |
| Clics organiques / 28 j | 43 | 70 |
| Sessions organiques avec engagement | 29 | 60 |
| Domaines référents légitimes | ~0 | 10 |
| Actions propriétaire débloquées | 0 / 5 | 3 / 5 |
| Durée d'engagement, trafic organique | 1 min 07 | > 1 min |

Le premier et l'avant-dernier sont les seuls qui comptent vraiment. Un mois où les clics montent, les conversions stagnent et le registre ne bouge pas est un mois raté.

---

## 11. Limites assumées

- **Pas de volumes de recherche ni de difficulté de mots-clés** : le plan Ahrefs n'inclut pas Keywords Explorer. Les priorités reposent sur la demande *observée*, pas sur le marché total.
- **Pas d'analyse concurrentielle systématique.** `ronkin-list.com` dépassait le site sur son propre quartier en août ; ni confirmé ni infirmé depuis.
- **Pas de Core Web Vitals terrain** : trafic insuffisant.
- **Les volumes restent faibles.** 43 clics sur 28 jours : trois clics d'écart font 7 %. Toute tendance se confirme sur deux cycles avant d'être traitée comme un fait.
- **Je publie désormais sur le site et sur la fiche Google** (autorisation permanente du 26/10, §5.3), avec quatre exceptions. En revanche je ne crée toujours pas de comptes et n'accepte pas de conditions en votre nom : les inscriptions aux annuaires et la validation de la fiche restent à vous.

---

*Plan établi le 26 octobre 2026. À valider avant mise en place. Révision trimestrielle.*
