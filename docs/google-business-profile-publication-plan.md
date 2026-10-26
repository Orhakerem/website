# Or Hakerem — fiche Google Business Profile : plan d'exploitation

**Version du 26 octobre 2026.** Remplace le document d'août 2026, qui n'a jamais
été activé. Les deux causes de ce gel sont traitées ici : la fiche était crue
non validée (elle l'est, à 100 %), et chaque action publique exigeait un accord
humain préalable (ce verrou est levé, voir §1).

> Sourcing : les règles citées ci-dessous renvoient à la documentation Google
> elle-même. Quand une pratique est de source praticienne et non documentée par
> Google, elle est marquée **[non documenté]**. La distinction compte : seules les
> règles documentées exposent la fiche à une suspension.

---

## 1. Régime de publication

**Je publie, puis je rends compte.** Autorisation permanente donnée le
26 octobre 2026. L'ancienne « publication gate » — approbation humaine de chaque
libellé, image et URL avant toute action publique — est supprimée. C'est elle qui
a immobilisé quatre chantiers prêts pendant deux mois.

Chaque élément publié figure au rapport mensuel avec **son libellé exact, sa
destination et sa date**, pour que la correction reste possible après coup.

**Quatre exceptions, où je m'arrête quand même :**

| Exception | Pourquoi |
|---|---|
| Un **prix, une remise, une allégation commerciale** ou un équipement invérifiable dans le code | Risque de **suspension de la fiche** |
| Une **réponse à un avis négatif** | Réputationnel, et ça dégénère vite |
| **Créer un compte ou accepter des conditions** | Hors de ce que je fais, quelle que soit l'autorisation |
| **Supprimer ou écraser** du contenu publié | L'ajout est réversible, l'effacement beaucoup moins |

---

## 2. Éligibilité — l'arbitrage fondateur

C'est le point qui doit être tranché avant toute optimisation, parce qu'il
conditionne tout le reste et qu'une erreur ici coûte la fiche entière.

### Les logements eux-mêmes ne sont pas éligibles

Google exige un contact en personne avec le client pendant les horaires
déclarés, et exclut nommément « les biens en location ou à la vente, tels que
les maisons de vacances, les maisons témoins ou les appartements vacants ».
Les bureaux de vente ou de gestion, eux, sont éligibles.
→ <https://support.google.com/business/answer/13763036>

**Conséquences directes :**

- **Ne jamais créer une fiche par appartement.** C'est l'exemple d'inéligibilité
  littéral de la documentation, et le geste le plus susceptible de faire perdre
  la fiche.
- **Une seule fiche par entreprise** — règle explicite. Des fiches multiples à
  la même adresse déclenchent une détection de doublon, et une fiche marquée
  doublon « n'apparaît ni dans la recherche ni sur Maps ».
  → <https://support.google.com/business/answer/12756178>
- L'entité éligible est **l'activité de gestion et de réservation**, ou **l'espace
  événementiel** — qui passe naturellement le test du contact en personne,
  puisque les clients s'y rendent physiquement.

### Ce que cela implique pour la fiche actuelle

La fiche existante est validée et porte 331 interactions clients : elle n'est pas
à refaire. Elle doit en revanche être **tenue du côté éligible** :

- positionner la catégorie principale sur **l'activité**, non sur le bien (§4) ;
- ne pas décrire la fiche comme « appartement » dans le nom ou la catégorie
  principale ;
- déclarer des horaires réels d'accueil (§6), aujourd'hui absentes partout.

### Faut-il une seconde fiche pour l'espace événementiel ?

Possible, à deux conditions cumulatives : un **nom différent** et une
**signalétique permanente et photographiable pour chacune des deux activités**.
Sans enseigne distincte, la seconde fiche sera traitée comme un doublon et
masquée. En l'absence de cette signalétique, **une seule fiche**, et l'offre
événementielle est portée par une catégorie secondaire et les services.

**Décision : une seule fiche**, jusqu'à ce que l'existence d'une signalétique
permanente distincte soit établie. → action `gbp-entite` au registre.

### La voie Google Vacation Rentals, pour les logements

Les deux appartements ne peuvent pas être sur la fiche, mais ils peuvent entrer
dans Google via **Google Vacation Rentals**, dont l'intégration directe est
réservée aux gestionnaires d'un certain volume. Avec deux biens, le passage se
fait par un partenaire de connectivité (iGMS, Lodgify, Hospitable, Beds24).
→ <https://support.google.com/hotelprices/answer/12568039>

⚠️ **À vérifier avant d'y investir quoi que ce soit [non documenté] :** une source
unique rapporte que Google a retiré le module Vacation Rentals de la recherche
pour les utilisateurs de l'Espace économique européen le 8 septembre 2026, sans
date de retour. Tel Aviv n'est pas dans l'EEE, mais **la demande francophone,
elle, l'est** — ce qui viderait le canal de l'essentiel de son intérêt pour le
marché français. À confirmer en source directe avant toute décision.

---

## 3. Nom de la fiche

Deux règles mordent simultanément.

### Règle générale

Le nom doit être celui du monde réel, tel qu'il figure sur l'enseigne, le site et
les documents. Sont interdits, avec suspension possible à la clé : slogans, codes
de magasin, ® et ™, mots entièrement capitalisés, horaires, numéros de téléphone,
URL, caractères spéciaux, mentions légales non réellement utilisées, **détails de
localisation** (« près de », « à l'intérieur de ») et **descriptions de produit ou
de service**.
→ <https://support.google.com/business/answer/3038177>

### Règle des noms bilingues répétés — **[datation non documentée]**

Google interdit de « répéter le même nom commercial dans plusieurs écritures ou
langues ». Exemples donnés par Google : `Burger King バーガーキング` est refusé,
`Burger King` est accepté. **La règle s'applique même lorsque l'enseigne physique
porte les deux écritures** — la page le dit explicitement.

La règle et son exemple ont été **vérifiés en source directe** sur
<https://support.google.com/business/answer/3038177>. Sa **date d'apparition**,
en revanche, n'est pas vérifiable : la page ne porte pas de date de modification
exploitable. Les reportings tiers la situent vers le 10 août 2026. À traiter comme
une règle en vigueur, non comme un changement daté.

**Conséquence pour nous :** un nom de fiche du type `Or Hakerem אור הכרם` est
désormais une violation de politique et un vecteur de suspension.

| | |
|---|---|
| Nom de fiche | **`Or Hakerem`** — une seule écriture, rien d'autre |
| À ne jamais ajouter | `Tel Aviv`, `Jacuzzi`, `Penthouse`, `Luxury`, `Kerem HaTeimanim`, l'hébreu en doublon |
| Côté site | `alternateName: ['Or HaKerem', 'אור הכרם']` dans `src/lib/site-schema.ts` reste **légitime** — le schema.org accepte les noms alternatifs, c'est le champ *nom de la fiche* qui est contraint |

Un nom hébreu distinct peut en principe être renseigné en basculant la langue de
l'interface Maps **[non documenté, comportement inconstant]**, mais uniquement si
`אור הכרם` est un nom commercial réellement distinct — jamais comme
translittération de la forme latine, ce que la règle d'août interdit.

---

## 4. Catégories — et le compromis qu'elles imposent

Google ne publie pas la liste des catégories, seulement les règles d'usage :
1 principale + 9 secondaires maximum, « le moins de catégories possible pour
décrire l'activité principale », et interdiction de s'en servir comme mots-clés
ou pour décrire des caractéristiques.
→ <https://support.google.com/business/answer/3039617>

### Recommandation

| Rang | Catégorie | Justification |
|---|---|---|
| **Principale** | **Agence de location de maisons de vacances** (*Vacation home rental agency*) | Décrit **l'activité de gestion**, qui est l'entité éligible. Une catégorie principale décrivant le *bien* affirme implicitement la chose inéligible. |
| Secondaire | La catégorie d'espace événementiel trouvée dans le sélecteur | Porte la 2ᵉ page d'entrée du site |
| Secondaire | *Serviced apartment* / location saisonnière | Couvre l'intention « appartement » |
| À exclure | Conciergerie, agence de voyage, tourisme | Catégories-mots-clés, interdites |

Les libellés exacts doivent être **relevés dans le sélecteur** : les listes
tierces sont indicatives et certaines chaînes n'ont pas pu être confirmées.
→ action `gbp-categories` au registre.

### Le compromis à connaître : catégorie d'hébergement = perte des publications « Offre »

Une fiche portant une catégorie d'hôtellerie **perd le format Offer** : « les
hôtels ne peuvent pas créer de publications "offre", ni aucune publication
mentionnant une promotion, une offre spéciale ou une remise ».
→ <https://support.google.com/business/answer/7213077>

Les métriques changent aussi : « Clics sur la réservation » est réservé aux
hôtels. → <https://support.google.com/business/answer/9918094>

**Arbitrage retenu : catégorie principale de type agence.** Le motif n'est pas
le format Offre — sous le régime du §1 nous ne publions aucun prix sans accord,
donc cet avantage est pour l'instant théorique. Le motif réel est
**l'éligibilité** : une catégorie principale décrivant l'activité de gestion est
alignée sur l'entité qui a le droit d'avoir une fiche (§2), là où une catégorie
d'hébergement rapproche la fiche du bien, c'est-à-dire de la chose que Google
exclut. Préserver le format Offre et les métriques standard est un effet
secondaire bienvenu, pas la raison du choix.

---

## 5. NAP canonique

### Référence

| Champ | Valeur canonique | Source dans le dépôt |
|---|---|---|
| Nom | `Or Hakerem` | `src/lib/business-schema.ts:4` |
| Adresse | `35 HaKovshim St` · `Tel Aviv-Yafo` · `6329302` · `IL` | `src/lib/business-schema.ts:8-11` — quatre champs séparés ; **le pays y est `IL`, pas `Israel`**. La forme d'une ligne « 35 HaKovshim St, Tel Aviv-Yafo 6329302, Israel » est une recomposition pour les formulaires d'annuaire, pas une chaîne du code |
| Téléphone | `+972585778891` | `src/lib/business-schema.ts:12` — valeur brute. `+972 58-577-8891` est un **format d'affichage** et n'existe nulle part dans le code |
| Coordonnées | `32.0700843, 34.7640991` | `src/lib/business-schema.ts:46-47` |
| Site | `https://www.orhakerem.com/` | — |
| Fiche | `https://www.google.com/maps?cid=11119085925362597877` | `src/lib/business-schema.ts:5` |

### Incohérences réelles, relevées dans le dépôt le 26 octobre

Un vérificateur indépendant a repris chaque affirmation sur pièces. Résultat :
**l'adresse est écrite de six façons différentes** et aucun fichier ne déclare
d'horaires.

| Forme | Où | Écart |
|---|---|---|
| `35 HaKovshim St` + `Tel Aviv-Yafo` + `6329302` + `IL` | `src/lib/business-schema.ts:8-11`, assertion de test `src/tests/business-schema.test.ts:21` | **la forme canonique** |
| `35 Hakovshim Street` / `Tel Aviv, Israel` | `src/i18n/messages/common.ts:34-35` (pied de page) · `src/i18n/messages/home.ts:26,65,66` · `src/app/[locale]/privacy/content/en.tsx:131,408` · `src/lib/faq-data.tsx` (en) | pas de code postal, `Tel Aviv` et non `Tel Aviv-Yafo`, `Street` au lieu de `St` |
| `35 rue Hakovshim` / `Tel Aviv, Israël` | `src/i18n/messages/common.ts:113-114` · `src/i18n/messages/home.ts:96,136,137` · `src/app/[locale]/privacy/content/fr.tsx:132,418` · `src/lib/faq-data.tsx:196` | voie traduite en français |
| `רחוב הכובשים 35, תל אביב, ישראל` | `src/app/[locale]/privacy/content/he.tsx:131,401` · `src/lib/faq-data.tsx:346` | forme hébraïque, pas de code postal |
| `35 Hakovshim Street, Kerem HaTeimanim, Tel Aviv-Yafo 6329302, Israel` | `public/llms.txt:9` | `k` minuscule, `Street` au lieu de `St`, quartier ajouté |
| `Hakovshim Street 35` | `src/lib/faq-data.tsx:48` | ordre inversé |
| `HaKovshim 35, Tel Aviv-Jaffa` | `src/components/MapEmbed.tsx:9` (URL-encodé) | `Jaffa` au lieu de `Yafo` |
| `hakovshim 35, tel aviv, 6329302` | la fiche Google elle-même | tout en minuscules |

Les formes traduites en texte courant (française, hébraïque) sont **légitimes** —
Google rend d'ailleurs l'adresse dans la locale du visiteur. Ce qui doit être
unifié, c'est la **forme structurée** : code postal présent partout, `Tel Aviv-Yafo`
et non `Tel Aviv` ni `Tel Aviv-Jaffa`, et l'ordre `numéro + voie`.

**Trois numéros de téléphone, et sur la page contact seul le français est
cliquable.** Les données structurées ne déclarent que l'israélien
`+972585778891` (`business-schema.ts:12`, repris par `site-schema.ts:26` et le
`contactPoint` en `:56`). Le numéro français n'apparaît dans aucun JSON-LD.

Inventaire complet des **dix** liens `tel:` du dépôt :

| Numéro | Emplacements |
|---|---|
| `+33651179925` (France) | `src/app/[locale]/contact/page.tsx:95` · `src/app/[locale]/page.tsx:195` · `src/components/Footer.tsx:162` · `privacy/content/en.tsx:424`, `fr.tsx:434`, `he.tsx:417` |
| `+972585778891` (Israël, canonique) | `src/components/Footer.tsx:171` · `privacy/content/en.tsx:420`, `fr.tsx:430`, `he.tsx:413` |

Le point précis est donc : **sur la page contact**, le seul lien `tel:` est le
français, et le CTA d'accueil l'utilise aussi. Ailleurs — pied de page, pages de
confidentialité dans les trois langues — l'israélien est bien cliquable. Le
numéro israélien figure en outre dans les CTA WhatsApp
(`src/i18n/messages/contact.ts:12,28,42`).

**🔴 Et un troisième numéro traîne :** `README.md:148` affiche
`+33 6 51 17 99 25 / +972 52 686 9791`. Le `+972 52 686 9791` n'est ni le
canonique ni le français. Il avait été signalé comme erroné dès
`SEO-AUDIT-2026-08.md:265` — la correction a été faite dans `public/llms.txt`
mais **jamais dans le README**, qui est resté deux mois avec un numéro faux.

→ À trancher : soit le français devient un `contactPoint` déclaré, soit
l'israélien devient cliquable sur la page contact et dans le CTA d'accueil. Et
le numéro du README est à supprimer dans tous les cas.
Action `nap-telephone` au registre.

**Note.** La cohérence NAP n'est **pas** un motif de suspension documenté par
Google — la page sur le classement local demande des informations complètes et
exactes, rien de plus
(<https://support.google.com/business/answer/7091>). L'affirmation
« NAP incohérente → suspension » est de source tierce. À traiter comme une
exigence de qualité et de confiance, pas comme un risque de sanction.

---

## 6. Horaires d'ouverture — à créer de zéro

**Aucune déclaration d'horaires n'existe nulle part.** Ni `openingHours` ni
`openingHoursSpecification` dans le dépôt, aucun champ d'horaires dans le
`LodgingBusiness` de `src/lib/business-schema.ts:24-62`.

C'est bloquant à deux titres :
1. l'éligibilité repose sur un contact en personne **pendant les horaires
   déclarés** — sans horaires, le critère n'est pas démontrable ;
2. lorsque le logo ne s'affiche pas, Google demande de vérifier que **nom,
   adresse postale, catégories, téléphone et horaires** sont renseignés — les
   horaires sont donc l'un des points de contrôle de l'affichage du logo.
   → <https://support.google.com/business/answer/6103862>

**Ne pas récupérer le « 24/7 » du site pour remplir ce champ.** Les mentions
« Available 24/7 » de `src/i18n/messages/services.ts` décrivent la réactivité de
la conciergerie, pas l'accès aux locaux. Les déclarer comme horaires serait une
affirmation fausse sur un champ structuré.

Les seules données horaires existantes sont l'arrivée à 15:00 et le départ à
11:00 — et elles sont codées en dur en **quatre endroits** :
`src/lib/reservation-quote.ts:78` et `:80`, puis à nouveau dans les réponses FAQ
`src/lib/faq-data.tsx:83` (en), `:231` (fr), `:378` (he). Ce ne sont pas des
horaires d'ouverture : elles vont dans les attributs d'hébergement (§7).

→ action `gbp-horaires` au registre : obtenir les horaires réels d'accueil, les
déclarer sur la fiche **et** dans `business-schema.ts`.

---

## 7. Attributs et équipements

Les attributs disponibles dépendent des catégories choisies, et certains sont
« renseignés à partir des retours des clients » et non modifiables. Les
modifications sont examinées — « en général une dizaine de minutes, parfois
jusqu'à 30 jours ».
→ <https://support.google.com/business/answer/9049526>

### Attributs d'hébergement structurés

Si une catégorie d'hébergement est portée, l'API Lodging expose une taxonomie
bien plus riche que le sélecteur générique
(<https://developers.google.com/my-business/reference/lodging/rest/v1/Lodging>) :

| Champ | Valeur | Remarque |
|---|---|---|
| `policies.checkinTime` | `15:00` | `src/lib/reservation-quote.ts:78` |
| `policies.checkoutTime` | `11:00` | `src/lib/reservation-quote.ts:80` |
| `pools.hotTub` | `true` | **le bon emplacement pour le jacuzzi** — bien mieux que de le mettre dans le nom de la fiche, ce qui violerait la règle sur les descriptions de service |
| `services.frontDesk` | à répondre **honnêtement** | ce champ détermine le classement hôtel / location saisonnière ; une réponse complaisante désaligne la fiche de la réalité |
| `connectivity`, `families`, `pets`, `parking` | à renseigner | |
| `accessibility` | à renseigner **honnêtement** | dans un immeuble tel-avivien sans ascenseur, un « pas d'accès PMR » assumé évite un avis une étoile prévisible |

### Ce qui n'est adossé à rien

`policies.checkinTime` / `checkoutTime` n'existent dans aucun JSON-LD. Les
horaires d'arrivée atteignent le balisage **indirectement**, comme texte de
réponse FAQ : le bloc `FAQPage` de `src/app/[locale]/faq/layout.tsx:49-60`
injecte `entry.plainAnswer` en ligne 57, et ce texte vient de
`src/lib/faq-data.tsx:83` / `:231` / `:378`. À structurer proprement.

---

## 8. Photos

### Spécifications documentées

| Contrainte | Valeur |
|---|---|
| Formats | **JPG ou PNG uniquement** |
| Poids | **10 Ko minimum, 5 Mo maximum** |
| Résolution recommandée | **720 × 720 px** |
| Résolution minimale | **250 × 250 px** |
| Vidéo | **30 s max, 75 Mo max, 720p ou plus** |
| Qualité | nette, bien éclairée, sans filtre marqué ni retouche lourde |

→ <https://support.google.com/business/answer/6103862>

Aucun ratio n'est imposé. Produire à **1 200 px minimum sur le grand côté** pour
rester confortablement au-dessus du seuil après recompression par Google.

### Bibliothèque à constituer

Google appelle explicitement la photo d'extérieur : elle aide les clients à
**reconnaître** l'établissement lors de leur visite. Elle sert aussi de preuve de
signalétique en cas de revérification (§15).

| Priorité | Sujet | Source |
|---|---|---|
| 1 | **Extérieur / entrée de l'immeuble, enseigne visible** | **à produire — manque** |
| 2 | Espace événementiel dressé, puis vide | `public/hero-events-*` |
| 3 | Penthouse : séjour, chambre, terrasse, jacuzzi, vue | `public/penthouse/` |
| 4 | Studio : séjour, cuisine, salle de bain | `public/studio/` |
| 5 | Rue et quartier | à produire |

**La fréquence d'ajout de photos n'a pas d'effet établi sur la visibilité.** La
page de Google sur le classement local cite « ajoutez des photos et des vidéos »
sans aucune mention de fréquence, et les enquêtes de praticiens placent la
quantité de photos très bas parmi les facteurs. Les photos sont un investissement
ponctuel dans un jeu complet, plus un rafraîchissement saisonnier — pas une
corvée mensuelle.

---

## 9. Publications

### Ce qu'elles font, et ce qu'elles ne font pas

**Elles ne font pas monter dans le pack local.** Le seul test contrôlé publié —
Sterling Sky, une publication par semaine pendant neuf semaines, 441 mots-clés
suivis — conclut à « aucun impact mesurable sur le classement dans le pack
local », et qualifie les publications de « levier de conversion, pas de
classement » (<https://www.sterlingsky.ca/do-google-posts-impact-ranking/>).
L'enquête Whitespark 2026 les place en queue de classement. Et **la page de
Google sur le classement local ne les mentionne jamais** : elle cite la
validation, l'exactitude des informations, les réponses aux avis, les photos et
les produits (<https://support.google.com/business/answer/7091>).

Échantillon réduit, fiches inactives, fenêtre courte, pas de réplication
indépendante — mais c'est la meilleure preuve disponible, et elle va dans le même
sens que la documentation de Google.

**On publie donc pour convertir, pas pour classer.** Et on ne laisse pas la
cadence de publication manger le temps des avis et des photos, qui sont, eux,
des entrées citées par Google.

### Mécanique

| | |
|---|---|
| Types | **Update**, **Offer**, **Event** |
| Durée de vie | **archivées au bout de 6 mois** sauf plage de dates (l'ancienne expiration à 7 jours n'existe plus) |
| CTA disponibles | `BOOK`, `ORDER`, `SHOP`, `LEARN_MORE`, `SIGN_UP`, `CALL` |
| Planification | natif — champ `scheduledTime` |
| Événements | `startDate`/`startTime`/`endDate`/`endTime` — **tous requis** |

→ <https://support.google.com/business/answer/7342169> et
<https://developers.google.com/my-business/reference/rest/v4/accounts.locations.localPosts>

**Google ne publie ni limite de caractères, ni dimensions d'image pour les
publications.** Les 1 500 caractères universellement cités sont de source tierce
et introuvables dans la documentation. Les sources divergent aussi sur le seuil
de troncature — ~100 ou ~250 caractères avant « Voir plus ».
→ **Règle de travail : l'accroche dans les 90 premiers caractères**, et tout ce
qui suit est considéré comme replié.

**Deux interdits documentés :**
- aucune mention de prix, promotion ou remise **si une catégorie d'hébergement est
  portée** → <https://support.google.com/business/answer/7213077> ;
- aucun numéro de téléphone, e-mail ou identifiant social non vérifié dans le
  corps du texte : Google « peut supprimer » ces publications. Utiliser le bouton
  « Appeler », qui s'appuie sur le numéro vérifié de la fiche.

### Cadence

Hebdomadaire est le maximum défendable ; **bimensuel suffit**. Au-delà, aucun
appui probant. Le cycle mensuel prévoit **2 à 4 publications**, adossées aux
articles du mois.

### Les quatre brouillons d'août sont publiables aujourd'hui

Ils étaient en `HOLD` pour deux raisons : URL de destination non live, et
approbation humaine. **Les quatre URL renvoient 200**, vérifié le 26 octobre, et
l'approbation est acquise (§1). Le blocage était administratif, pas technique.

| # | Sujet | Destination (200 ✅) | CTA | Statut |
|---|---|---|---|---|
| 1 | Guide des quartiers | `/blog/where-to-stay-in-tel-aviv-neighborhoods-guide` | `LEARN_MORE` | **publiable** |
| 2 | Itinéraire 3 jours | `/blog/three-day-tel-aviv-itinerary-beach-carmel-market-jaffa` | `LEARN_MORE` | **publiable** |
| 3 | Événements privés | `/blog/private-events-tel-aviv-intimate-celebrations` | `BOOK` (était `LEARN_MORE` en août) | **publiable** |
| 4 | Réserver en direct | `/blog/book-tel-aviv-apartment-directly-with-confidence` | `LEARN_MORE` | **publiable** |

Les libellés trilingues rédigés en août restent valables et sont conservés dans
l'historique Git du présent fichier (commit `442145b`). **Une publication = une
langue**, jamais les trois dans le même message. Seul changement par rapport à
août : le CTA du brouillon 3 passe de « Learn more » à `BOOK`, l'intention étant
une demande de devis événementiel.

**Note — une alerte que j'avais posée à tort.** J'avais écrit que le brouillon 4
devait être réécrit parce que l'article de destination reposerait sur la
réservation directe « jusqu'à 15 % moins chère ». **C'est faux**, et la
vérification l'a établi : `content/blog/book-tel-aviv-apartment-directly-with-confidence.mdx`
ne contient ni « 15 % », ni remise, ni comparaison de prix — sa première section
s'intitule précisément « Start with the property, not the price ». Le brouillon 4
est publiable tel quel.

L'allégation des 15 %, elle, existe bel et bien — mais **ailleurs**, et plus
largement que je ne l'avais relevé : `public/llms.txt:7,24`,
`src/i18n/messages/properties.ts:37,72,116,151,193,228`, `src/lib/property-seo.ts`
dans les six descriptions de bien, et **cinq articles de blog**
(`penthouse-vs-studio-which-or-hakerem-apartment:61`,
`shabbat-friendly-stays-tel-aviv:85`, `how-far-is-kerem-hateimanim-from-the-beach:50`,
`kerem-hateimanim-neighborhood-guide:98`, `best-time-to-visit-tel-aviv:48`).
C'est un chantier de contenu à part, pas un motif de blocage de publication.

---

## 10. Avis — protocole

### État au 26 octobre : quatre avis, aucune réponse

| Avis | Âge | Contenu | Action |
|---|---|---|---|
| Daniel T. | 11 semaines | négatif sévère — « un endroit horrible qui se comporte comme une boîte de nuit au milieu d'un quartier résidentiel » | **exception §1** — réponse soumise avant publication |
| Yoann M. | — | 10/10 | réponse à ma charge |
| Julian Levit | — | positif | réponse à ma charge |
| adi ziv | — | positif | réponse à ma charge |

Trois mois sans réponse à un avis de cette nature est le plus mauvais signal
possible, pour Google comme pour le prochain lecteur. Google cite d'ailleurs la
réponse aux avis parmi les leviers de classement local, à la différence des
publications.

### Demander des avis — ce qui est autorisé

Google autorise explicitement de « solliciter ou encourager la publication d'un
contenu qui reflète une expérience authentique », **à condition qu'aucune
incitation ne soit proposée et que la note ou le contenu ne soient pas
influencés**. Un lien court ou un QR code d'avis est un moyen admis.
→ <https://support.google.com/contributionpolicy/answer/7400114> et
<https://support.google.com/business/answer/3474122>

| ✅ Autorisé | ❌ Interdit |
|---|---|
| Demander à **chaque** client au départ, dans les mêmes termes, quel qu'ait été le séjour | **Filtrer en amont** — sonder la satisfaction et n'envoyer le lien qu'aux contents : c'est du *review gating*, nommément interdit |
| Envoyer le lien ou le QR **après le départ** | Demander un avis **sur place** ou sous pression — interdit |
| Écrire dans la langue du client (EN/FR/HE) — le choix de langue n'est pas une influence | Offrir une remise, un départ tardif, une bouteille, un crédit |
| Mettre le QR dans le livret d'accueil et l'e-mail de départ | Demander de **mentionner un équipement, le jacuzzi, l'emplacement ou un membre de l'équipe par son nom** |
| | Fixer un **objectif d'avis** à un prestataire ou à l'équipe de ménage |
| | Solliciter proches, famille, anciens collègues — conflit d'intérêts |
| | Installer une tablette d'avis dans le logement |

**Sanction en cas de manquement :** la fiche peut être privée de nouveaux avis,
**les avis existants peuvent être dépubliés**, et **un avertissement public
indiquant que de faux avis ont été supprimés peut s'afficher sur la fiche**.
Pour un hébergement dont la conversion repose sur la note, le dernier point est
quasi fatal. Google prévient par e-mail et un recours existe.
→ <https://support.google.com/business/answer/14114287>

### Répondre

Google demande des réponses « professionnelles, courtoises, courtes et
simples », déconseille le remerciement générique identique pour tous, interdit
d'y placer des offres commerciales, et demande de ne pas divulguer
d'informations privées sur l'auteur.

Appliqué à l'hébergement courte durée :

- **Ne jamais contester publiquement le vécu du client.** Dire ce qui a changé
  depuis : une remédiation concrète se lit comme de la compétence par le
  prospect suivant.
- **Ne jamais révéler le logement concerné ni les dates** — information privée
  sur l'auteur, et accessoirement exposition du taux d'occupation.
- Google trace une ligne utile : reconnaître les vraies erreurs, mais « ne pas
  endosser ce qui échappe à votre contrôle ». Le bruit de rue, le chantier du
  voisin, les travaux municipaux ne sont légitimement pas de notre fait. Le dire
  une fois, factuellement, sans argumenter.
- **Répondre dans la langue de l'avis.** C'est aussi le meilleur signal
  trilingue disponible sur la fiche, et il est gratuit.
- Signaler, sans discuter, les avis de personnes n'ayant jamais séjourné —
  fréquent après une demande refusée.

---

## 11. Questions-réponses — la fonctionnalité a disparu

**On ne peut plus amorcer de questions sur la fiche.** L'API My Business Q&A a
été arrêtée le **3 novembre 2025** — « vous ne pourrez plus lire ni publier de
questions et réponses via l'API » — ainsi que les notifications associées.
→ <https://developers.google.com/my-business/content/qanda/change-log>

Vérifié de surcroît : la page d'aide de Google sur les questions-réponses
(`support.google.com/business/answer/7566214`) renvoie désormais un **404**.

**[non documenté]** Des reportings indiquent un remplacement par une
fonctionnalité « Ask Maps » générant les réponses à partir des données de la
fiche, des avis, des photos et du web. Aucun billet officiel de Google trouvé :
nom et date de lancement non confirmés.

**Ce qui remplace la tactique :** puisque les réponses sont désormais
synthétisées depuis la fiche, les avis et le site, tout ce qu'on aurait amorcé en
Q&R va maintenant dans **la description, les services, les attributs et le site**,
dans les trois langues. Les horaires, l'arrivée, le départ et l'adresse doivent
être exacts, car ce sont eux qui sont synthétisés. Les avis deviennent une source
de réponses, ce qui augmente encore la valeur d'une base d'avis authentique.

→ **À corriger dans le plan mensuel :** la revue trimestrielle
« catégories, attributs et questions-réponses » devient
« catégories et attributs ».

---

## 12. Multilingue

| Contrainte | Conséquence |
|---|---|
| Une seule fiche, pas de mécanisme par langue | Trois fiches linguistiques seraient des doublons masqués |
| **Une seule description, une seule langue** — champ libre unique (<https://support.google.com/business/answer/13682007>) | Pas de variante par langue |
| Nom en une seule écriture (§3) | Pas de doublon hébreu/latin |

**[non documenté, mais consensus praticien]** Google traduit les **champs
structurés** — catégories, attributs, services prédéfinis, horaires sont rendus
dans la langue du visiteur — mais **pas le texte libre**. La limite de
750 caractères pour la description est de source tierce ; la page de Google n'en
mentionne aucune.

**Approche retenue :**

- description en **anglais** — langue commune aux deux marchés étrangers ; trois
  langues dans un champ de ~750 caractères n'est pas viable ;
- **remplir exhaustivement les champs structurés**, puisque ce sont eux qui
  s'affichent nativement pour le visiteur hébréophone ou francophone : c'est là
  qu'est la vraie couverture multilingue ;
- **répondre à chaque avis dans sa langue** ;
- le travail multilingue réel reste porté par le site, avec `hreflang` EN/FR/HE.

---

## 13. Mesure

### Métriques de la fiche

| Métrique | À savoir |
|---|---|
| Vues | **visiteurs uniques** — une personne comptée une fois par jour |
| Recherches | **mise à jour en début de mois**, jusqu'à 5 jours de latence |
| Itinéraires | Google a **changé la méthode de comptage** — ne pas comparer de part et d'autre |
| Appels, clics site, messages | — |
| Clics sur la réservation | **hôtels uniquement** |

→ <https://support.google.com/business/answer/9918094>

**[non documenté]** La rétention communément citée est de 6 mois. Google ne
documente aucune limite. **Export mensuel en tableur dans tous les cas** : c'est
la seule donnée non récupérable rétroactivement. → `seo/releves/`.

### UTM — Google ne documente rien sur ce point

Tout ce qui suit est de la pratique praticienne. Sans marquage, les clics venus
de la fiche atterrissent dans GA4 en `organic` ou `direct`, indiscernables du
reste.

| Élément de la fiche | URL |
|---|---|
| Bouton site | `?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=website_button` |
| Lien de réservation | `?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=booking_link` |
| Publication | `?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=post_<aaaa-mm>_<slug>` |
| Publication événement | `?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=event_<slug>` |

`utm_medium=organic` plutôt que `local` : le trafic reste honnêtement classé, et
l'isolement s'obtient par un **groupe de canaux personnalisé GA4** indexé sur
`utm_campaign=gbp`. Lecture dans GA4 : Acquisition → **Campagnes manuelles**.

### ⚠️ La boucle n'est pas fermée, et c'est un travail de code

Le clic marqué atterrit sur le site, mais la conversion est une réservation
**insérée côté serveur** dans la table `reservations` de Supabase. **Les UTM
seuls ne relieront jamais les deux.** Pour fermer la boucle il faut capter les
paramètres côté client dans `BookingRangeCalendar` et les persister sur la ligne
de réservation au moment de l'envoi.

Sans ce développement, on mesurera des **clics** venus de la fiche, jamais des
**réservations**. → action `gbp-attribution` au registre.

---

## 14. Allégations à ne jamais publier sur la fiche

Relevées par le vérificateur dans le dépôt. Elles sont peut-être vraies, mais
elles ne sont **pas étayables depuis le code**, et elles relèvent toutes de
l'exception §1.

| Allégation | Emplacement | Problème |
|---|---|---|
| « note parfaite de **10 étoiles sur Booking.com** » | `src/lib/host.ts:7,29` | Booking.com note sur 10, pas en étoiles. Un « 10 parfait » est vérifiable et donc réfutable. **La chaîne la plus risquée du dépôt.** |
| **4,9/5** affiché, « Verified guest rating » | `src/i18n/messages/properties.ts:33-34` (fr `:112`, he `:189`) | **Aucun `aggregateRating`, `ratingValue` ni `reviewCount` dans tout le dépôt.** Note visible sans source, sans nombre d'avis, sans balisage. |
| « professionnels de la garde d'enfants **certifiés**, **24/7** » | `src/i18n/messages/services.ts:26,96,164` | Certification invérifiable concernant des tiers, plus une disponibilité permanente |
| « réponse sous 24 h **garantie** » | `src/i18n/messages/propertyDetails.ts:62`, `:375` (fr), `:676` (he) | Une garantie, dans les trois langues |
| « jusqu'à **15 %** moins cher qu'en passant par les plateformes » | `public/llms.txt:7,24` · `properties.ts:37,72,116,151,193,228` · `property-seo.ts` ×6 · **5 articles de blog** | Comparaison de prix à étayer. C'est l'allégation la plus répandue du site |
| « **jusqu'à 80 invités** » | `src/i18n/messages/events.ts:44,171,296` | Dans les trois langues, mais **dans aucun JSON-LD** et aucun `maximumAttendeeCapacity` |
| « ₪4 500 » | `src/lib/event-pricing-data.ts:12` | **Prix fixe, pas un « à partir de »** — le devis est `4500 + 750` sans variation de date. Toute mention reste soumise à l'exception §1 |
| « depuis **2024** » | `src/lib/host.ts:7`, `:12`, `:17`, `:29` | Aucun `foundingDate` dans tout le dépôt : la date n'est jamais déclarée en donnée structurée, seulement affirmée en texte |
| Services cachère / Shabbat | `public/llms.txt:3,7,44`, messages événements | Aucune certification n'est revendiquée, ce qui est bien — mais publier « cachère » comme **attribut** de fiche impliquerait une certification |

**Le studio n'est pas un studio.** `src/lib/property-seo.ts:44-46` déclare
**1 chambre**, 1 salle de bain, 4 personnes (`:47-48` sont les prix). Le titre
public, lui, est `Spacious & Cosy Apartment`
(`src/lib/bookable-properties.ts:14`) — c'est le mot « studio » de
`property-seo.ts:36` et `public/llms.txt:18` qui contredit la donnée. Ne pas
reporter « studio » dans un champ structuré de la fiche.

---

## 15. Validation — préserver, pas obtenir

La fiche est **validée à 100 %**, code magasin `15592430914507669223`, diagnostic
Google « tout va bien ». Cette section existe pour le cas d'une **revérification**
demandée par Google, qui est le risque réel.

Si une revérification vidéo est demandée, Google exige **une seule prise
continue, minimum 30 secondes, tournée et téléversée en direct** depuis un mobile
— les vidéos préenregistrées sont refusées — montrant trois choses :

1. **la localisation** — panneaux de rue, numéros, commerces voisins ;
2. **l'existence de l'activité** — vitrine ou **enseigne portant le nom, sur un
   support permanent, identique au nom de la fiche** ;
3. **la preuve de gestion** — un geste que seul un employé peut faire : ouvrir un
   local, accéder à une réserve, utiliser un terminal. Variante possible : permis
   d'exploitation, facture ou quittance au nom de l'entreprise.

Interdits : informations sensibles, et **les visages de tiers**.
→ <https://support.google.com/business/answer/14271705>

**Ce qui nous expose.** Chacun des trois éléments est précisément ce qu'un
hébergement courte durée n'a pas naturellement :

| Risque | Parade |
|---|---|
| **Pas d'enseigne permanente au nom de l'entreprise** — une porte avec un numéro d'appartement n'est pas une enseigne. Échec le plus fréquent pour ce type d'activité. | Filmer le lieu **avec personnel** — bureau, point d'accueil, espace événementiel — et non l'intérieur d'un logement |
| **Filmer un intérieur résidentiel** : Google voit un logement, pas un commerce — combiné à l'exclusion des biens en location, c'est un signal d'inéligibilité, pas seulement un échec de validation | Montrer un geste de gestion sur place |
| **Modifier nom, adresse ou catégorie pendant une validation** invalide un code postal en cours | Ne rien toucher pendant une procédure |

**À préparer dès maintenant, avant d'en avoir besoin :** une photo de
l'extérieur avec enseigne (§8, priorité 1), et un permis ou une facture au nom
de l'entreprise, prêts à être filmés.

**Deux points de conservation de la fiche :**
- la propriété peut être révoquée si « vous ne vous êtes pas connecté récemment »
  → **connexion au moins trimestrielle** ;
- gérer la fiche **depuis la recherche et Maps en étant connecté**. C'est ce que
  décrit la documentation actuelle, et c'est de là que doit partir une
  validation vidéo. Ne pas construire de procédure sur `business.google.com`,
  dont le statut est contradictoire selon les sources **[non documenté]**.

---

## 16. Citations et annuaires

Pas cinq backlinks équivalents : les trois premiers sont des citations ou des
profils cartographiques, les deux derniers des opportunités éditoriales qui
peuvent ne rien donner.

| # | Cible | Type | Conditions | État |
|---|---|---|---|---|
| 1 | [easy.co.il](https://easy.co.il/en) | Citation locale | **Une fiche Or Hakerem existe déjà en hébreu, sans action de notre part.** La revendiquer et corriger la NAP plutôt que créer un doublon | 🔄 à revendiquer |
| 2 | [Bing Places](https://www.bingplaces.com/) | Carto | Revendiquer un éventuel existant avant de créer ; NAP §5 | à faire |
| 3 | [Apple Business Connect](https://business.apple.com/) | Carto | Vérifier l'éligibilité Israël ; chercher avant de créer | à faire |
| 4 | [Tourist Israel](https://www.touristisrael.com/contact/) | Éditorial | Article live ; contact éditorial réel ; aucun paiement ni ancre imposée | à faire |
| 5 | [Secret Tel Aviv](https://www.secrettelaviv.com/) | Éditorial | Proposition spécifique ; pas d'automatisation, pas d'échange de liens | à faire |

**Trois obstacles identifiés le 26 octobre, à traiter avant d'ajouter des
citations :**

- **`hakeremluxuryapartments.co.il`** — « Hakerem Luxury Apartments » apparaît
  dans le SERP de marque. La requête `hakerem luxury apartments` (152
  impressions, position 5,3) est probablement **leur** marque et non la nôtre, ce
  qui change la lecture de cette ligne dans tous les rapports antérieurs. À
  instruire avant toute conclusion.
- **Booking.com, Agoda, `telavivhotelsisrael.com`** publient chacun une page sur
  le penthouse ou « Hakerem apartment » et captent une part du trafic de marque.
- **Ne jamais soumettre une URL de campagne** ou d'article comme site de
  l'entreprise dans une citation : toujours `https://www.orhakerem.com/`.

---

## 17. Journal

| Date | Événement |
|---|---|
| Août 2026 | Document initial rédigé — jamais activé, bloqué par le verrou d'approbation |
| 26 oct. 2026 | Fiche inspectée : validée 100 %, 331 interactions, 4 avis sans réponse |
| 26 oct. 2026 | Faits de la société vérifiés sur pièces — 5 orthographes d'adresse, 2 téléphones, 0 horaires, 4,9/5 non adossée |
| 26 oct. 2026 | Bonnes pratiques reprises sur documentation Google — éligibilité, règle des noms bilingues d'août 2026, suppression des Q&R |
| 26 oct. 2026 | Verrou d'approbation levé ; les quatre brouillons d'août deviennent publiables (URL vérifiées 200) |
| 26 oct. 2026 | Document audité par un vérificateur neuf : 18 corrections appliquées. Trois erreurs de fond de ma part — six orthographes d'adresse et non cinq, un **troisième** numéro de téléphone jamais corrigé dans le README, et un motif de blocage du brouillon 4 que j'avais posé à tort |
