# Rapport SEO complet — Or Hakerem

**Date :** 26 octobre 2026
**Sources :** Google Analytics 4 (propriété `521216501`), Google Search Console (`sc-domain:orhakerem.com`), Ahrefs Site Explorer
**Fenêtres :** GA4 28 j (28/09 → 25/10) contre les 28 j précédents · GSC 28 j (27/09 → 24/10) contre les 28 j précédents · GSC 3 mois (25/07 → 24/10) pour les mots-clés
**Suivi précédent :** `SEO-SUIVI-2026-10-23.md`

---

## 0. Les quatre choses à retenir

1. **🟢 La marque est réglée.** `or hakerem` est en **position 1,4 avec 39,1 % de CTR**. L'audit d'août qualifiait le classement 9-10 sur la marque propre de « déficit le plus anormal de tout l'audit ». Il a disparu.
2. **🟢 Les conversions sont enfin mesurées.** 6 événements clés sur 28 jours contre 3. En retirant mes 2 tests du 23 octobre, il reste **4 conversions réelles, toutes des clics WhatsApp**. Zéro formulaire abouti.
3. **🔴 La page d'accueil continue de descendre.** 18 → 9 clics sur 28 jours. C'est la deuxième période consécutive de baisse depuis le changement de title du 22 septembre.
4. **🟡 Le trafic est en forte hausse mais la position moyenne se dégrade.** Sessions +77 %, mais position GSC 11,9 → 15,4. Le site capte plus de requêtes, plus loin dans le classement.

---

## 1. Google Analytics 4

### Vue d'ensemble

| Métrique | 31/08 → 27/09 | **28/09 → 25/10** | Δ |
|---|---:|---:|---:|
| Sessions | 69 | **122** | **+76,8 %** |
| Utilisateurs actifs | 43 | **84** | **+95,4 %** |
| Nouveaux utilisateurs | 38 | **79** | **+107,9 %** |
| Durée moy. d'engagement | 39 s | **46 s** | +17,7 % |
| Taux d'engagement | 69,6 % | 64,8 % | −6,9 % |
| Nombre d'événements | 357 | **651** | +82,4 % |
| **Événements clés** | 3 | **6** | **+100 %** |

Le taux d'engagement baisse légèrement alors que le volume double — c'est le profil normal d'un site qui élargit son audience : les nouveaux arrivants sont moins qualifiés que le noyau existant.

### Par canal

| Canal | Sessions | Δ | Engagement | Durée moy. | Événements clés |
|---|---:|---:|---:|---:|---:|
| Direct | **56** (45,9 %) | **+211 %** | 55,4 % | 38 s | 2 |
| Organic Search | 38 (31,2 %) | +8,6 % | **76,3 %** | **1 min 07** | **3** |
| AI Assistant | 19 (15,6 %) | +46 % | 63,2 % | 37 s | 1 |
| Organic Social | 10 (8,2 %) | +233 % | 70 % | 26 s | 0 |

**Trois observations.**

Le **trafic direct a triplé** (18 → 56). Une hausse de cette ampleur sur un si petit volume vient rarement de gens tapant l'URL : c'est plus probablement du trafic dont la source a été perdue — applications de messagerie, e-mails, QR codes, ou navigation privée. À surveiller plutôt qu'à célébrer.

Le **trafic organique est de loin le plus qualifié** : 76,3 % d'engagement et **1 min 07 par session**, contre 38 s pour le direct. Sa durée d'engagement a presque doublé (36 s → 1 min 07), ce qui suggère que le contenu ajouté retient mieux. Il produit aussi la moitié des conversions pour un tiers des sessions.

Le canal **AI Assistant se maintient à 15,6 %** des sessions. `chatgpt.com` reste la 3ᵉ source du site.

### Pages de destination

| Page | Sessions | Δ | Durée moy. | Clés |
|---|---:|---:|---:|---:|
| `/` | 32 | +18,5 % | 58 s | 0 |
| `/events` | **32** | **+88 %** | 37 s | **1** |
| `/properties/penthouse-jacuzzi` | 11 | de 0 | **9 s** 🔴 | 0 |
| `/he/properties/penthouse-jacuzzi` | 9 | **+800 %** | 26 s | 0 |
| `/blog/tel-aviv-on-shabbat…` | 4 | de 0 | **1 min 47** 🟢 | 0 |
| `/properties/cozy-studio` | 4 | +100 % | 46 s | 0 |
| `/blog/kerem-hateimanim-neighborhood-guide` | 3 | = | 1 min 00 | 0 |
| `/fr` | 3 | = | 43 s | 0 |
| `/he/properties` | 3 | de 0 | 1 min 13 | 0 |

**`/properties/penthouse-jacuzzi` : 11 sessions pour 9 secondes de moyenne.** C'est la page commerciale principale, et les visiteurs la quittent presque immédiatement. Passée de 0 à 11 sessions, elle attire désormais du monde — mais ne le retient pas. C'est le problème le plus net de ce rapport après la page d'accueil.

**`/events` est la 2ᵉ page d'entrée du site et la seule à produire une conversion**, avec 479 mots. L'audit d'août recommandait de l'approfondir ; la donnée le confirme trois mois plus tard.

**Les articles de blog ont les meilleures durées d'engagement du site** : 1 min 47 pour l'article Shabbat, 1 min 13 pour `/he/properties`, 1 min 00 pour le guide de quartier.

### Événements clés — le détail

| Événement | 19 → 25 oct | Dont tests | **Réels** |
|---|---:|---:|---:|
| `contact_outbound` (WhatsApp) | 4 | 1 | **3** |
| `generate_lead` (formulaires) | 1 | 1 | **0** |

**Le canal de conversion de ce site, c'est WhatsApp.** Les formulaires n'ont toujours rien produit — mais les correctifs ne sont en production que depuis le 24 octobre, soit deux jours. Il est trop tôt pour conclure ; la mesure est à refaire début novembre.

> Mise en garde sur la comparaison : `contact_outbound` n'a été marqué comme événement clé que le 23 octobre. GA4 semble avoir recalculé la période antérieure, mais le « +100 % » n'est donc pas un avant/après propre.

---

## 2. Google Search Console

### 28 jours

| Métrique | 28 j précédents | **28 derniers jours** | Δ |
|---|---:|---:|---:|
| Clics | 42 | **43** | +2 % |
| Impressions | 2 810 | **1 880** | **−33 %** |
| CTR | 1,5 % | **2,3 %** | +53 % |
| Position moyenne | 11,9 | **15,4** | **−3,5** |

Les clics sont stables, le CTR monte, mais les impressions chutent d'un tiers et la position se dégrade nettement. La chute d'impressions avait déjà été observée le 23 octobre et attribuée à la fin de la saison des fêtes juives — l'hypothèse tient toujours.

### Pages — qui gagne, qui perd

| Page | Clics avant → après | Impressions |
|---|---|---|
| **`/`** | **18 → 9** 🔴 | 357 → 324 |
| `/he` | 4 → **8** 🟢 | 112 → 142 |
| `/blog/kerem-hateimanim-neighborhood-guide` | 2 → **4** | 570 → 403 |
| `/blog/tel-aviv-on-shabbat…` | 0 → **4** | 115 → 104 |
| **`/fr/blog/short-term-seasonal-rentals`** | 0 → **3** 🟢 | **3 → 49** |
| `/fr` | 4 → 4 | 52 → 39 |
| `/he/about` | 2 → 3 | 20 → 23 |

**La page d'accueil a perdu la moitié de ses clics.** C'est la deuxième période consécutive de baisse. Le 23 octobre je comptais 16 → 10 ; aujourd'hui 18 → 9 sur une fenêtre décalée. Sa position est pourtant stable (6,5 → 6,6) et ses impressions ne baissent que de 9 % : **ce sont les clics qui se perdent, pas la visibilité.** C'est précisément le symptôme d'un title moins attractif.

**L'article « location courte durée » confirme son décollage** : 3 → 49 impressions, 3 clics, position 8,6.

### Mots-clés — vue 3 mois (184 requêtes, 144 clics, 7 520 impressions)

**La marque, résolue :**

| Requête | Clics | Impr. | CTR | Position |
|---|---:|---:|---:|---:|
| `or hakerem` | **9** | 23 | **39,1 %** | **1,4** 🟢 |
| `hakerem luxury apartments` | 2 | 152 | 1,3 % | **5,3** |
| `hakerem` | 0 | 167 | 0 % | 8,9 |

**Le gros volume qui ne convertit pas :**

| Requête | Impr. | Position |
|---|---:|---:|
| `kerem hateimanim` | **460** | 12,5 |
| `דירות יוקרה בתל אביב` | **499** | 44,1 |
| `hakerem` | 167 | 8,9 |
| `hakerem luxury apartments` | 152 | 5,3 |

**Les positions déjà excellentes, à zéro clic — le gisement le plus accessible :**

| Requête | Impr. | Position |
|---|---:|---:|
| `חוף ליד שוק הכרמל` | 16 | **4,2** |
| `kerem hateimanim tel aviv distance to beach` | 18 | **4,6** |
| `closest beach to kerem hateimanim tel aviv` | 12 | **5,5** |
| `banana beach tlv` | 5 | 7,8 |
| `eruv tel aviv` | 13 | 7,8 |
| `kerem hateimanim tel aviv` | 26 | 9,7 |
| `yemenite quarter tel aviv` | 53 | 9,1 |

Tout le cluster « plage / distance » est en page 1 haute et ne récolte rien. L'article dédié existe (`how-far-is-kerem-hateimanim-from-the-beach`) — c'est donc un problème de **titre et de description**, pas de contenu.

**Les requêtes d'adresses — un filon confirmé :**

| Requête | Impr. | Position |
|---|---:|---:|
| `חיים חבשוש 23 תל אביב` | 5 | 31,6 |
| `הכובשים 35 תל אביב` | 3 | **8,7** |
| `יוסף וולקר 24 תל אביב` · `בודנהיימר 37` · `האקליפטוס 6 תל אביב` · `אלנבי 136` | 1 ch. | 38 → 86 |

L'article sur les noms de rues publié le 24 octobre répond exactement à cette intention. Trop récent pour figurer dans ces chiffres.

**Le marché du Carmel — cluster neuf, positions fortes :**

| Requête | Impr. | Position |
|---|---:|---:|
| `מה יש בשוק הכרמל` | 1 | **3,0** |
| `tel aviv carmel market` | 1 | **3,0** |
| `שוק הכרמל` | 1 | 5,0 |
| `אוטובוס מעזריאלי לשוק הכרמל` | 1 | 6,0 |
| `שוק הכרמל תל אביב מסלול` | 1 | 8,0 |
| `marché carmel tel aviv horaire` | 1 | 10,0 |

Volumes minuscules mais positions excellentes. L'article sur l'histoire du marché publié le 24 arrive au bon moment.

**Les requêtes conversationnelles — l'effet IA :**

| Requête | Position |
|---|---:|
| `what is the best cheap version of a luxury event venue for birthdays and anniversaries in israel?` | **1,0** |
| `neighborhoods in tel aviv` | **1,0** |
| `איך לבחור מלון בתל אביב אם רוצים מיקום טוב` | **1,5** |
| `אם צריך לבחור מלון אחד בתל אביב - איזה כדאי` | 4,3 |
| `איפה כדאי להתארח בתל אביב אם רוצים להיות ליד הים` | 5,0 |
| `recommend a local caterer for a small party in tel aviv.` | 8,5 |

Des dizaines de ces requêtes en langage naturel apparaissent, souvent en première page. Elles corroborent les 15,6 % de sessions « AI Assistant » dans GA4. **C'est le canal qui monte, et le contenu éditorial long est ce qui le nourrit.**

---

## 3. Ahrefs

| Métrique | Valeur | Il y a 3 jours |
|---|---:|---:|
| Domain Rating | **3** | 3 |
| URL Rating | 0 | 0 |
| Domaines référents | **939** | 940 |
| Backlinks | 1 700 | 1 700 |
| Mots-clés organiques | 2 | 2 |
| Trafic organique estimé | 4 | 3 |

**Le profil de liens est stable.** 940 → 939 domaines en trois jours confirme ce que j'avais conclu le 23 octobre : les fermes de liens qui composent l'essentiel de ce chiffre ne sont ni une prestation achetée ni une attaque ciblée, mais du spam ambiant. La courbe d'acquisition est plate de 2015 à 2025 puis fait un pic vertical en 2026 — cohérent avec les dates « vu pour la première fois » d'avril à juillet.

**Aucune action requise.** Pas d'action manuelle Google, pas de désaveu.

**L'index Ahrefs reste inutilisable pour ce site** : 2 mots-clés organiques recensés contre **184 dans GSC**. Ne jamais piloter sur les chiffres de trafic ou de positions d'Ahrefs ici ; seul son crawl de liens fait autorité.

**Nouveauté — la mesure des réponses IA :**

| Plateforme | Réponses | Pages |
|---|---:|---:|
| ChatGPT | 2 | 1 |
| AI Overviews Google | 1 | 1 |
| AI Mode, Gemini, Perplexity, Copilot | 0 | 0 |

Le site apparaît dans 3 réponses IA, toutes concentrées sur une seule page. C'est faible, mais c'est mesurable — et cela recoupe le canal AI Assistant de GA4.

---

## 4. Diagnostic

### Ce qui marche

**Le contenu éditorial.** Les articles ont les meilleures durées d'engagement du site, nourrissent le canal IA, et l'article « location courte durée » a produit 3 clics et un cluster de requêtes neuf en un mois. C'est la mécanique la plus fiable dont dispose le site.

**L'hébreu.** `/he` est passé de 4 à 8 clics, `/he/properties/penthouse-jacuzzi` de 1 à 9 sessions. C'est le marché qui progresse le plus vite.

**La marque.** Position 1,4 et 39 % de CTR sur `or hakerem`.

### Ce qui ne marche pas

**La page d'accueil perd des clics sans perdre de visibilité.** Impressions −9 %, position stable, clics −50 %. Après deux périodes consécutives, l'hypothèse « bruit statistique » devient moins tenable que l'hypothèse « le title est moins attractif ».

**`/properties/penthouse-jacuzzi` ne retient personne** : 9 secondes de moyenne sur 11 sessions.

**Les formulaires ne convertissent toujours pas**, mais les correctifs n'ont que deux jours.

**Des positions de page 1 à zéro clic.** Tout le cluster plage est entre 4,2 et 7,8 sans un seul clic.

---

## 5. Plan pour novembre

### Priorité 1 — Reprendre le title de la page d'accueil

Deux baisses consécutives suffisent à agir. Tester une version qui réintègre un élément de différenciation géographique, et mesurer sur 28 jours. Hypothèse à vérifier : « Kerem HaTeimanim » apportait de la crédibilité locale au clic, même avec une requête mal classée.

### Priorité 2 — Titres et descriptions du cluster plage

Sept requêtes entre les positions 4,2 et 9,7, zéro clic. L'article existe. Réécrire son title et sa description pour qu'ils répondent littéralement à la question posée (« à quelle distance », « quelle plage »). **Aucune rédaction, uniquement de la présentation** — c'est le meilleur rapport impact/effort du dossier.

### Priorité 3 — Approfondir `/properties/penthouse-jacuzzi` et `/events`

La première attire et ne retient pas (9 s). La seconde est 2ᵉ page d'entrée, produit la seule conversion, et fait 479 mots. Les deux pages commerciales les plus sollicitées sont les deux plus minces.

### Priorité 4 — Netlinking

Inchangé depuis août : 38 prospects qualifiés dans `docs/backlink-opportunities.md`, exécution à 1/38. DR 3. C'est le seul levier structurel restant.

### Priorité 5 — Contenu de novembre

Les données désignent trois angles :

1. **Le cluster plage**, en complément du travail sur les titres — `חוף ליד שוק הכרמל` est en position 4,2.
2. **L'eruv et le Shabbat à Tel Aviv** — `eruv tel aviv` en 7,8, `tel aviv eruv` en 10, et l'article Shabbat existant a la meilleure durée d'engagement du site (1 min 47).
3. **Les restaurants du quartier** — `kerem hateimanim restaurants` en position 10,3, et c'est le sujet idéal pour appliquer la nouvelle consigne de citation externe.

> **Nouvelle règle éditoriale, à partir de novembre :** au moins un ou deux des articles mensuels doivent **citer un article externe** — presse locale, magazine, critique de restaurant — et pas seulement des ouvrages de référence. Les trois articles d'octobre citaient Wikipédia, Stanford University Press et la Bibliothèque nationale : exacts, mais pas ce que cette règle demande. Les sources visées sont Time Out Tel Aviv, Times of Israel, Citizen Cafe TLV, Culture Trip et les reportages de quartier.

---

## 6. Ce qui n'est pas mesuré

- **Pas de volumes de recherche ni de difficulté de mots-clés.** Le plan Ahrefs n'inclut pas Keywords Explorer. Toutes les priorités ci-dessus sont donc classées sur la demande *observée* dans GSC, pas sur le marché total.
- **Pas de données concurrentielles.** L'audit d'août relevait que `ronkin-list.com` dépassait Or Hakerem sur son propre quartier ; toujours ni confirmé ni infirmé.
- **Core Web Vitals : toujours aucune donnée terrain**, le trafic reste insuffisant.
- **Le rapport Search Console intégré à GA4 est inexploitable** : il ne compte qu'1 clic pour 727 impressions, contre 43 clics dans GSC. Filtre de flux mal configuré. Utiliser GSC en direct.
- **Les volumes restent faibles.** 43 clics sur 28 jours : un écart de 3 clics représente 7 %. Les tendances de ce rapport sont des signaux, pas des preuves.

---

*Rapport établi le 26 octobre 2026. GA4 arrêté au 25 octobre, GSC au 24 octobre, Ahrefs au 26 octobre.*
