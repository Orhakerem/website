# Rapport SEO — cycle 2026-11 — **interrompu à l'étape 4**

**Date :** 4 novembre 2026, cycle automatique de 7h, repris le même jour
**Mois analysé :** octobre 2026 — *collecté, pas encore analysé*
**Base de comparaison :** `SEO-RAPPORT-2026-10-26.md`

---

## Ce sur quoi j'ai besoin de toi — reprise du 04/11

### A. Deux refus consécutifs à l'étape 4 (intégrité) : je poursuis avec un troisième producteur ?

**Ce qui est bloqué :** l'étape 6 et toutes les suivantes : diagnostic,
application du retour arrière sur le title d'accueil, articles, publications
sur la fiche, rapport final et clôture.

**Le motif :** le premier producteur avait déclaré « non comparable » le
recoupement page par page entre GSC et GA4. C'était à tort. Le second a
corrigé la décision, en posant `integrite_donnees: true` et en écartant GA4 sur
les seules pages de destination. En revanche, il a chiffré l'écart faux :
**17 clics GSC contre 4 sessions GA4, et non 23**. L'erreur figure à quatre
endroits du relevé. Le vérificateur confirme que **la décision tient** : rien
que sur `/he`, l'écart dépasse le facteur 2 (10 contre 4), et il reste au-dessus
sur tous les périmètres corrigés. Seuls les chiffres et un libellé sont à
reprendre.

**Ce que j'ai fait en attendant :** j'ai sauvegardé tout ce qui a été vérifié
(détail en §B), sans rien appliquer sur le site.

**Ce que je recommande :** relancer un **producteur neuf**, limité à la
correction des quatre lignes et du libellé, puis enchaîner sur l'étape 6. La
règle des deux refus existe pour qu'on n'insiste pas sur un travail mal parti.
Ici, la décision est juste et seul le calcul est faux.

### B. Ce que la reprise a établi — vérifié, étape par étape

| Étape | Verdict du vérificateur | Ce qui en sort |
|---|---|---|
| 1 GSC | CONFORME | Octobre : **50 clics** (49 en sept.), **2 196 impressions (−26 %)**, position **16,2 (11,3 en sept.)** |
| 2 GA4 | CONFORME | **132 sessions** (75), Direct **42,4 %** des sessions. Événements clés : **7, dont 5 tests probables du 23/10**, donc **2 réels présumés** (3 en sept.) |
| 3 Hors-site | CONFORME | DR **2,8** (3), **936** domaines référents (−9 sur le mois). Fiche : **4 avis, note 4,0, aucun nouveau**, 0 publication, 183 vues, 10 clics vers le site, 31 itinéraires. NAP cohérente avec le code |
| 4 Intégrité | **2 × NON CONFORME** | Les dimensions « page de destination » de GA4 sont écartées (×2 et plus par rapport à GSC). Le chiffrage est à corriger |
| 5 Baselines | CONFORME | **Title d'accueil : `retour-arriere`**, pas encore appliqué |

**Les mauvaises nouvelles, en premier :**

- **🔴 L'article plage s'est effondré : 527 impressions en septembre, 2 en
  octobre.** Ses versions `/fr` et `/he` n'apparaissent dans aucune des deux
  périodes. Ça ressemble à une désindexation ou à un problème de
  canonicalisation. C'est le premier point du diagnostic à reprendre.
- **🔴 La requête de marque `or hakerem` est à 0 impression dans GSC en
  octobre**, alors qu'elle avait 6 clics en septembre et que le site est 1er
  sur la recherche de marque le 04/11. À contrôler avant toute conclusion.
- **🔴 Le rapport du 26/10 contient une erreur : il annonçait « 4 conversions
  réelles, toutes WhatsApp ».** En réalité, `contact_outbound` n'a été compté
  comme événement clé qu'à partir du 25/10, et GA4 n'a **pas** recalculé
  l'historique. Octobre compte **2 conversions réelles présumées**, toutes deux
  le 25 ou le 26/10, venues des assistants IA.
- **🔴 La baseline du title d'accueil était mal documentée.** Le cycle
  précédent écrivait « seuil franchi sur les deux mesures ». **C'est faux** :
  les impressions sont toujours sorties de la bande ±15 % (−23 %, −16 %,
  −18 %). Le verdict `retour-arriere` repose sur la règle de prudence : trois
  relevés successifs, qui se chevauchent, montrent tous des clics et un CTR
  inférieurs à l'état d'avant, à position égale ou meilleure. Il ne repose pas
  sur le seuil.
- **🟠 GA4 attribue mal les pages de destination** : `/he` reçoit 10 clics GSC
  pour 4 sessions organiques. Le « 9 s sur le penthouse » des rapports
  précédents repose sur cette dimension, il n'est donc plus fiable. La cause
  reste à diagnostiquer (redirection de langue, navigation côté client).
- **🟠 Le concurrent `hakeremluxuryapartments.co.il` passe devant nous sur
  `hakerem`** (2e contre 3e). Il occupe aussi 4 positions de la page 1 sur
  « Or Hakerem ».

**Une bonne nouvelle :** un `generate_lead` le **01/11**, le premier depuis les
correctifs du 24/10. Il reste à vérifier dans les e-mails ou dans Supabase si
c'est un vrai contact.

### C. L'arrêt du matin, à l'étape 0 — réglé

Tu as donné ton accord pour retirer `purchase` : **GA4 l'interdit**. L'option
est désactivée, parce que c'est un événement clé par défaut que Google
verrouille. Avec ton accord, la règle de la sentinelle a donc été précisée :
seul un événement clé **déjà déclenché** qui tombe à 0 déclenche une alerte
(`docs/agents-seo.md`, et la décision est consignée dans la tâche). Le détail
de l'arrêt du matin suit, pour mémoire.

---

## Pour mémoire — l'arrêt du matin

### 1. L'événement clé `purchase` a arrêté le cycle — à retirer de GA4 ?

**Ce qui est bloqué :** tout le cycle, de l'étape 1 à la clôture. Ça comprend
la collecte GSC/GA4/Ahrefs d'octobre, le verdict sur le title de la page
d'accueil (échéance **17/11**), les 3 ou 4 articles du mois et le premier lot
de publications sur la fiche Google.

**Pourquoi :** le filet de sécurité de l'étape 0 suit la règle « un événement
clé à 0 sur 30 jours = alerte, et toute alerte interrompt le cycle ».
`purchase` est déclaré événement clé dans la propriété GA4 `521216501`. Il est
à **0 sur 30 jours et ne s'est jamais déclenché**, vérifié sur toute la plage
disponible. Le site n'a pas de tunnel d'achat : il ne l'émettra jamais.
L'audit du 25 août l'avait déjà relevé et recommandait de le retirer
(`ANALYTICS-AUDIT-2026-08-25.md:87-97`). Ça n'a pas été fait.

**Rien n'est donc cassé.** Mais la règle est écrite sans exception, et elle
fait partie des deux seules choses qui m'autorisent à arrêter le cycle. Si je
la contournais parce que je la juge mal calibrée, ce serait précisément ce que
la tâche m'interdit : un garde-fou que l'agent lève quand ça l'arrange n'en
est plus un. J'ai préféré m'arrêter et te le dire.

**Ce que j'ai fait en attendant :** les cinq contrôles de l'étape 0, vérifiés
par un vérificateur indépendant (détail §2). L'arbitrage est inscrit au
registre (`ga4-purchase-cle`, échéance 10/11). Rien n'a été modifié dans GA4.

**Ce que je recommande — les deux :**
1. **Retirer `purchase` des événements clés** : GA4 → Admin → Affichage des
   données → Événements → onglet *Événements clés* → ⋮ sur `purchase` → ne
   plus marquer comme événement clé. Dix secondes. Tu peux aussi me dire de le
   faire : c'est un réglage de compte, je ne le touche pas sans ton accord.
2. **Préciser la règle** dans la tâche : « alerte si un événement clé **qui
   s'est déjà déclenché** tombe à 0 sur 30 jours ». C'est l'intention, détecter
   une mesure qui casse, et ça évite qu'une fausse alerte du même type gèle un
   autre mois. Je ne l'ai pas modifiée moi-même : c'est ta règle, et c'est moi
   qu'elle arrête.

> **Mise à jour du 04/11, après ton accord pour le retrait :** il est
> **impossible**. Dans GA4, l'option « Ne plus marquer comme événement clé »
> est désactivée pour `purchase`, et son étoile est grisée. C'est un événement
> clé par défaut que Google verrouille. Je n'ai rien modifié. **Seule la
> recommandation 2 reste possible** : préciser la règle dans la tâche.

Ensuite, **relance la tâche** (`seo-mensuel-orhakerem` → exécuter maintenant).
Elle repartira de zéro sur le mois d'octobre complet. Avant le 10/11, il reste
assez de marge pour tenir l'échéance du 17/11 sur le title d'accueil.

---

## 1. Les mauvaises nouvelles d'abord

- **🔴 Aucune donnée d'octobre n'a été relevée ni analysée.** L'interruption
  survient avant la collecte. Ce rapport ne contient ni tableau GSC, ni tableau
  GA4, ni comparaison avec le 26 octobre.
- **🔴 `node scripts/seo-check.mjs --cycle 2026-11` échoue : 9 blocages.** Le
  registre n'a pas été repris (`cycle_courant` vaut toujours `2026-10`) et
  huit actions ouvertes n'ont pas été relancées. **Le cycle n'est pas
  terminé.** Je n'ai pas redaté les actions : les redater sans les avoir
  relancées reviendrait à tromper le contrôle.
- **🟠 Rien n'a été publié** : ni sur le site, ni sur la fiche Google. Le
  premier lot de publications sur la fiche (échéance 30/11), qui attend depuis
  août, prend encore du retard.
- **🟡 Le 4,9/5 du site contredit toujours la note Google de 4,0.** Rien de
  nouveau ici, mais ce n'est toujours pas corrigé, et ce cycle n'a rien pu y
  faire.

## 2. Étape 0 — ce qui a été contrôlé

Contrôles du 04/11/2026, profil Chrome ayant accès aux outils. Verdict du
vérificateur : **CONFORME**.

| # | Contrôle | Résultat | Source | Alerte |
|---|---|---|---|---|
| 1 | Actions manuelles et sécurité | « Aucun problème détecté » sur les deux pages | gsc | non |
| 2 | Pages indexées | **74** au 23/10 contre 73 au 23/09 (+1,4 %). Rapport GSC à jour au 23/10 seulement | gsc | non |
| 3 | Événements clés sur 30 j (05/10 → 03/11) | `contact_outbound` 9 · `generate_lead` 2 · `ads_conversion_Demande_de_devis_1` 4 · **`purchase` 0** | ga4 | **oui** |
| 4 | HTTP en production | apex → www en **308**, puis **200** sur `/`, `/properties`, `/reservation`, `/events` ; www en 200 direct | curl | non |
| 5 | Sitemap | `sitemap.xml` lu le **03/11**, « Opération effectuée », 85 pages | gsc | non |

**Deux signaux à reprendre au cycle relancé, sans les interpréter ici :**

- **Un `generate_lead` le 01/11/2026.** C'est le premier depuis les correctifs
  de formulaire du 24/10. Celui du 23/10 précède les correctifs et correspond
  vraisemblablement au test connu. GA4 ne distingue pas un vrai contact d'un
  test : il faut recouper avec les e-mails Resend ou la table `reservations`.
  Si c'est un vrai lead, le seuil du 20/11 (« toujours 0 → rouvrir le
  tunnel ») est levé.
- **Les 4 `ads_conversion_Demande_de_devis_1` datent tous du 23/10**, le jour
  des tests. Ce sont très probablement des tests.

**Pour information, hors seuil :** 13 URL en 404 dont la validation est en
échec, et 4 URL bloquées par `robots.txt`. `PROBE_B_gtag_command` apparaît dans
l'historique GA4 : c'est la sonde de l'audit du 25 août, qui ne figure plus
dans le code.

## 3. Ce qui a mal tourné dans l'exécution — et ce qui est corrigé

**La première sentinelle a conclu à tort à une perte d'accès à GSC et GA4.**
Trois profils Chrome sont connectés à l'extension, et elle tournait sur un
profil qui ne voit pas les propriétés. J'ai vérifié les deux autres profils :
le premier les voit. → **Consigné dans la tâche elle-même** (section *Accès*),
pour que chaque cycle choisisse le bon profil d'emblée.

**Un refus du vérificateur venait de moi, pas du producteur.** En transmettant
la sortie, j'avais résumé le report de cycle, que la sentinelle avait pourtant
reproduit en entier. Le vérificateur a refusé à juste titre au vu de ce qu'il
avait reçu. Un producteur neuf a refait l'étape, et sa sortie a été transmise
cette fois par fichier, sans retouche. Aucune trace de ce refus ne reste dans
le résultat. Je retiens la leçon : les handoffs passent par fichier, jamais
par mon résumé.

## 4. Fichiers modifiés

| Fichier | Modification |
|---|---|
| `seo/registre-actions.yml` | + action `ga4-purchase-cle` (propriétaire, échéance 10/11, impact critique) |
| `~/.claude/scheduled-tasks/seo-mensuel-orhakerem/SKILL.md` | Section *Accès* : quel profil Chrome utiliser et comment le retrouver. **Pourquoi :** c'est un fait de procédé, pas un état du mois, et il a coûté un faux diagnostic à ce cycle |
| `SEO-RAPPORT-2026-11-04.md` | ce rapport |

**Non modifiés, volontairement :** `seo/prochain-cycle.yml`, qui reste valable
tel quel puisque le cycle n'est pas clos ; `seo/baselines.yml` ; `cycle_courant`
et les dates de relance du registre ; la règle d'alerte de la sentinelle.

## 5. Échéances qui approchent pendant l'interruption

| Échéance | Quoi | Source |
|---|---|---|
| **10/11** | Arbitrage sur `purchase` | registre `ga4-purchase-cle` |
| **17/11** | Verdict sur le title de la page d'accueil. Les deux mesures précédentes franchissaient déjà le seuil de retour arrière | `seo/baselines.yml` |
| **20/11** | Seuil `generate_lead` — voir le lead du 01/11 | `seo/prochain-cycle.yml` |
| **30/11** | Premières publications sur la fiche, photo extérieure de l'enseigne, dispositif de collecte d'avis, collision de marque, catégories de la fiche | registre |
