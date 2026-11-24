# Citations d'annuaires locaux — Or Hakerem

**Créé le :** 25 août 2026
**Prérequis :** ✅ NAP unifiée (commit `1009e9c` + alignement `llms.txt` du 25/08)
**Objectif :** régler le problème d'entité de marque identifié dans `SEO-AUDIT-2026-08.md` §2.1

---

## ⚠️ Ce que je ne peux pas faire à votre place

Chacune de ces plateformes exige la **création d'un compte** et, pour la plupart, une **vérification par courrier postal, SMS ou appel** sur le numéro de l'établissement. Je ne crée pas de comptes et je ne soumets pas de formulaires d'inscription en votre nom.

Ce document contient donc **tout le reste** : les valeurs exactes à coller, l'ordre d'exécution, et ce qu'il faut surveiller. Comptez 15-20 minutes par plateforme.

---

## 1. Pourquoi c'est le chantier le plus rentable en ce moment

La recherche du 25 août confirme l'hypothèse de l'audit — et elle est pire que prévu. **Il existe un concurrent direct littéralement nommé « Hakerem Luxury Apartments »**, avec sa propre fiche TripAdvisor et son propre domaine (`hakeremluxuryapartments.co.il`). S'y ajoutent « Hakerem Luxury Suites », « Hakerem Apartment », « HolyGuest Hakerem St » et « Andy Warhol at Hakerem ».

Ce n'est pas une collision avec un nom de lieu générique. **C'est une collision avec des concurrents homonymes du même secteur, dans la même ville.** Cela explique précisément pourquoi la requête `hakerem luxury apartments` plafonnait en position 10,2 : Google ne sait pas de quelle entreprise on parle.

Les citations d'annuaires sont le levier standard pour cela : elles créent des occurrences cohérentes et vérifiées du triplet Nom + Adresse + Téléphone, ce qui permet à Google de séparer les entités. C'est gratuit, et le balisage `Organization` livré le 25 août est la moitié serveur de ce même travail.

**Prérequis rempli :** la NAP est maintenant identique partout dans le code. C'était le blocage.

---

## 2. Les valeurs canoniques — à coller **à l'identique** partout

> La cohérence octet-par-octet est le point clé. Une adresse écrite différemment sur deux plateformes vaut moins que pas de citation du tout.

| Champ | Valeur |
|---|---|
| **Nom** | `Or Hakerem` |
| **Nom (hébreu)** | `אור הכרם` |
| **Rue** | `35 Hakovshim Street` |
| **Ville** | `Tel Aviv-Yafo` |
| **Code postal** | `6329302` |
| **Pays** | `Israel` |
| **Adresse complète** | `35 Hakovshim Street, Tel Aviv-Yafo 6329302, Israel` |
| **Téléphone** | `+972 58 577 8891` (format local : `058-577-8891`) |
| **E-mail** | `orhakerem@45beach.com` (depuis le 24/11/2026, gestion 45Beach) |
| **Site** | `https://www.orhakerem.com/` |
| **Coordonnées** | `32.0700843, 34.7640991` |
| **Quartier** | Kerem HaTeimanim (Yemenite Quarter) |

**Catégorie principale :** Vacation home rental / location de vacances
**Catégories secondaires :** Serviced apartment · Event venue · Concierge service

**Horaires :** ne déclarez **pas** d'horaires d'ouverture au public — ce n'est pas un commerce à comptoir. Si le champ est obligatoire, utilisez les horaires de contact et mentionnez check-in 15:00 / check-out 11:00 dans la description.

**Profils sociaux à lier (les 4, systématiquement) :**
- https://www.instagram.com/or_hakerem/
- https://www.facebook.com/profile.php?id=61583829025542
- https://www.linkedin.com/company/orhakerem/
- https://www.google.com/maps?cid=11119085925362597877

### Descriptions prêtes à coller

**Courte (~150 caractères)**
> Or Hakerem — appartements de luxe en location courte durée à Kerem HaTeimanim, Tel Aviv, à deux pas du marché Carmel et de la plage.

**Longue (~350 caractères)**
> Or Hakerem propose deux appartements haut de gamme en location courte, moyenne et longue durée dans le quartier historique de Kerem HaTeimanim, à Tel Aviv : un penthouse avec jacuzzi privatif sur le toit et vue mer, et un studio rénové à 2 minutes de Banana Beach. Réception d'événements intimes, services de conciergerie et hospitalité adaptée au Shabbat. Réservation directe jusqu'à 15 % moins chère que les plateformes tierces.

**Hébreu (~150 caractères)**
> אור הכרם — דירות יוקרה להשכרה לטווח קצר בכרם התימנים, תל אביב. פנטהאוז עם ג׳קוזי פרטי על הגג ונוף לים, דקות ספורות משוק הכרמל ומהחוף.

---

## 3. Les 6 plateformes, dans l'ordre d'exécution

L'ordre compte : les deux premières sont les plus rentables et les plus rapides.

| # | Plateforme | URL d'inscription | Vérification | Effort | Pourquoi |
|---|---|---|---|---|---|
| 1 | **Bing Places** | https://www.bingplaces.com/ | Téléphone ou courrier | 15 min | Alimente Bing **et Copilot/ChatGPT**. Le trafic « AI Assistant » pèse déjà 8,4 % des sessions — c'est la citation la mieux alignée sur ce canal. Importe la fiche Google en un clic. |
| 2 | **Apple Business Connect** | https://businessconnect.apple.com/ | Apple ID + validation | 20 min | Apple Plans est le GPS par défaut de toute la clientèle iPhone, qui est exactement la clientèle voyage haut de gamme. Aucun concurrent homonyme n'y est correctement référencé. |
| 3 | **easy.co.il** | https://www.easy.co.il/ | Téléphone (IL) | 15 min | Le plus gros annuaire israélien. Indispensable pour le SEO local en hébreu, où vous êtes en position 45-63. |
| 4 | **Zap / דפי זהב** | https://www.zap.co.il/ · https://www.d.co.il/ | Téléphone (IL) | 20 min | Deuxième pilier israélien. Forte autorité de domaine locale. |
| 5 | **Foursquare** | https://foursquare.com/venue/claim | E-mail | 10 min | Alimente des dizaines d'apps tierces en cascade. Faible effort, large diffusion. |
| 6 | **Waze** | https://www.waze.com/business | Compte Waze | 10 min | Le GPS dominant en Israël. Compte surtout pour les arrivées et les livraisons de conciergerie. |

### Points de vigilance

- **Cherchez d'abord une fiche existante à revendiquer.** Sur Foursquare et Waze en particulier, un point peut déjà exister pour l'adresse. Revendiquer > créer un doublon. Un doublon est nuisible.
- **Attention aux homonymes** au moment de la recherche : « Hakerem Luxury Apartments », « Hakerem Luxury Suites », « Hakerem Apartment » sont d'autres entreprises. Ne revendiquez jamais leur fiche.
- **Ne créez aucune fiche avec une variante du nom.** `Or Hakerem`, exactement, partout — pas « Or Hakerem Luxury Apartments », pas « Or HaKerem Tel Aviv ». C'est précisément le mélange qui a créé le problème.
- **Le numéro de téléphone doit être joignable** pendant la fenêtre de vérification (appel ou SMS automatisé).

---

## 4. Après coup

1. **Attendez 2 à 4 semaines**, puis vérifiez que les fiches sont indexées : recherchez `"Or Hakerem" "35 Hakovshim"` et comptez les plateformes qui remontent.
2. **Surveillez dans GSC** la requête `hakerem luxury apartments` (position 5,6 au 22 août, contre 10,2 au 9 août) et `hakerem` (7,7 contre 9,4). Si les citations fonctionnent, ces deux-là doivent continuer à monter vers la position 1-3.
3. **Ne payez jamais** pour un service d'« amplification de citations » ou de soumission en masse. Ces réseaux génèrent des NAP incohérentes sur des annuaires sans valeur, exactement le problème qu'on cherche à régler.

---

## 5. Reliquat à traiter en même temps

Le pied de page du site affiche `35 Hakovshim Street / Tel Aviv, Israel` — **sans code postal**, alors que le schema et les citations portent `Tel Aviv-Yafo 6329302`. C'est du contenu visible, donc je ne l'ai pas modifié. Ajouter `Tel Aviv-Yafo 6329302` au pied de page rendrait la NAP parfaitement cohérente entre ce que voit un humain et ce que lit un moteur.

Fichiers concernés si vous donnez le feu vert : `src/i18n/messages/common.ts` (`footer.address1` / `address2`, ×3 locales).

---

*Voir aussi : `docs/backlink-opportunities.md` (60 prospects éditoriaux, 1 contacté) et `docs/seo-backlink-outreach.md`.*
