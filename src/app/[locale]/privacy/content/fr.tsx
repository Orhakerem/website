/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { BulletList, CardGrid } from '@/components/legal/LegalPageShell';
import { OPEN_CONSENT_SETTINGS_EVENT } from '@/lib/consent';

const dataYouProvide = [
  {
    title: 'Formulaire de contact',
    body: 'Votre nom, votre adresse e-mail et le contenu de votre message.',
  },
  {
    title: 'Demandes de réservation',
    body: 'Votre nom, e-mail, numéro de téléphone, mode de contact préféré, le logement choisi, vos dates d’arrivée et de départ, ainsi que le nombre de voyageurs.',
  },
  {
    title: 'Demandes concernant les événements',
    body: 'Votre nom, e-mail, numéro de téléphone, mode de contact préféré, type d’événement, date de l’événement, nombre de voyageurs attendus, et tout détail optionnel que vous partagez.',
  },
  {
    title: 'Messages que vous nous envoyez',
    body: 'Lorsque vous nous contactez via Facebook Messenger, Instagram Direct, WhatsApp ou par e-mail, nous recevons votre nom ou nom d’utilisateur tel qu’il apparaît sur ce service, l’identifiant que ce service vous attribue pour notre Page ou notre compte, votre photo de profil lorsqu’elle est disponible, ainsi que le contenu de vos messages et de leurs pièces jointes.',
  },
];

const dataCollectedAutomatically = [
  'Les pages que vous consultez et votre parcours sur le site',
  "Le type de navigateur, l'appareil et le système d'exploitation",
  'La localisation approximative déduite de votre adresse IP',
  'Le site ou la source qui vous a orienté vers nous',
  'Vos interactions avec nos campagnes publicitaires Meta et Google lorsque vous acceptez les cookies publicitaires',
];

const howWeUse = [
  'Répondre à vos demandes et messages',
  'Traiter, confirmer et gérer vos demandes de réservation et d’événement',
  'Vous contacter via le moyen que vous avez choisi au sujet de votre demande',
  'Faire fonctionner, sécuriser, maintenir et améliorer le site',
  "Mesurer l'efficacité de nos publicités et créer des audiences pertinentes lorsque vous y consentez",
  'Respecter nos obligations légales, fiscales et comptables',
  'Répondre aux messages que vous nous envoyez sur Messenger, Instagram, WhatsApp ou par e-mail, et conserver l’historique de nos échanges',
];

const legalBases = [
  {
    title: "L'exécution d'un contrat",
    body: 'Le traitement de votre demande de réservation ou d’événement et les démarches entreprises à votre demande avant la conclusion d’un contrat.',
  },
  {
    title: 'Le consentement',
    body: 'Le chargement des cookies analytiques Google Analytics et des technologies publicitaires Meta et Google Ads, que nous n’activons qu’après votre choix explicite pour chaque catégorie. Vous pouvez modifier ou retirer votre consentement à tout moment.',
  },
  {
    title: 'Nos intérêts légitimes',
    body: 'Assurer la sécurité du site, comprendre son utilisation, l’améliorer et répondre aux demandes générales.',
  },
  {
    title: 'Une obligation légale',
    body: 'Conserver certains documents lorsque la législation fiscale et comptable applicable l’exige.',
  },
];

const processors = [
  {
    title: 'Resend',
    body: 'Envoie les notifications par e-mail générées par nos formulaires de contact, de réservation et d’événement, ainsi que les e-mails que nous vous envoyons depuis notre outil de gestion de la relation client.',
  },
  {
    title: 'Supabase',
    body: 'Stocke de manière sécurisée les demandes de réservation afin que nous puissions gérer et suivre votre réservation. Il stocke également l’historique des conversations de notre outil de gestion de la relation client, hébergé dans l’Union européenne (Francfort).',
  },
  {
    title: 'Google Analytics (Google LLC)',
    body: "Fournit des statistiques agrégées d'utilisation du site via des cookies et technologies similaires.",
  },
  {
    title: 'Google Ads (Google LLC)',
    body: "Mesure les réservations et demandes générées par nos campagnes de recherche et display et constitue des audiences de remarketing. Google agit en qualité de responsable de traitement indépendant pour une partie de ces traitements, conformément à ses propres conditions publicitaires.",
  },
  {
    title: 'Meta Platforms',
    body: "Fournit le Pixel Meta. Selon la finalité, Meta peut traiter certaines données pour notre compte ou agir avec nous en qualité de responsable conjoint pour la collecte et la transmission de données d’événement utilisées pour le ciblage et l’amélioration publicitaires. Meta achemine également les messages que vous échangez avec nous sur Facebook Messenger et Instagram Direct.",
  },
  {
    title: 'WhatsApp (Meta)',
    body: 'Achemine les messages que vous échangez avec nous sur WhatsApp.',
  },
  {
    title: 'Vercel',
    body: 'Héberge le site et traite les journaux de serveur et de sécurité standards.',
  },
  {
    title: 'Hostinger',
    body: 'Héberge nos boîtes de réception e-mail.',
  },
];

const dataRetention = [
  "Les messages de contact et de demande sont conservés uniquement le temps nécessaire pour traiter votre demande, plus une période de suivi raisonnable.",
  'Les données de réservation sont conservées pour la gestion des réservations et pour répondre aux exigences légales et comptables.',
  'Les données analytiques sont conservées selon les paramètres de conservation de Google Analytics.',
  'Les données de conversion et de remarketing Google Ads sont conservées selon les durées définies par Google, et l’appartenance à une liste de remarketing expire au terme de la durée maximale autorisée par Google Ads.',
  'Selon les Conditions des outils Meta Business, Meta peut conserver les données d’événement pendant deux ans au maximum et les audiences créées à partir de ces données jusqu’à leur suppression dans les outils du compte.',
  'Les conversations reçues via Messenger, Instagram, WhatsApp ou par e-mail sont conservées le temps nécessaire au traitement de votre demande et de toute réservation qui en découle, plus une période de suivi raisonnable. Elles sont supprimées dans les 30 jours suivant une demande de suppression, à l’exception des documents que la loi nous oblige à conserver.',
];

const gdprRights = [
  'Accéder aux données personnelles que nous détenons à votre sujet',
  'Demander la rectification de données inexactes ou incomplètes',
  'Demander l’effacement de vos données',
  'Demander la limitation du traitement, ou vous y opposer',
  'Demander la portabilité des données que vous nous avez fournies',
  'Retirer votre consentement à tout moment, sans affecter les traitements déjà effectués',
  'Introduire une réclamation auprès de votre autorité locale de protection des données',
];

export default function PrivacyContentFr({
  termsHref,
  cancellationHref,
  dataDeletionHref,
}: {
  termsHref: string;
  cancellationHref: string;
  dataDeletionHref: string;
}) {
  return (
    <>
      <section className="mb-10" data-animate="fade-up" data-delay="1">
        <h2 className="font-head text-3xl font-bold text-black">Qui sommes-nous</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <div className="space-y-4 text-black/80 leading-relaxed">
            <p>
              Or Hakerem (« nous », « notre » ou « l'entreprise ») propose des hébergements de
              luxe de courte durée à Tel Aviv et exploite le site orhakerem.com. Or Hakerem est gérée
              par 45Beach (45beach.com, 45 rue HaYarkon, Tel Aviv-Yafo), qui assure pour son compte la
              gestion du site, des réservations et des demandes. Or Hakerem, sous la gestion de 45Beach,
              est le responsable du traitement des données personnelles décrites dans cette politique.
            </p>
            <p>
              Vous pouvez nous contacter pour toute question relative à la confidentialité à{' '}
              <a
                href="mailto:orhakerem@45beach.com"
                className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
              >
                orhakerem@45beach.com
              </a>{' '}
              ou par courrier au 35 rue Hakovshim, Tel Aviv, Israël. Si vous réservez via Airbnb,
              votre séjour est également régi par la politique de confidentialité propre à Airbnb.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up" data-delay="2">
        <h2 className="font-head text-3xl font-bold text-black">Les informations que nous collectons</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-primary/10 bg-cream/50 p-6 md:p-8">
            <h3 className="font-head text-2xl font-semibold text-black">Les informations que vous nous fournissez</h3>
            <p className="mt-2 text-black/75 leading-relaxed">
              Nous ne recevons ces informations que lorsque vous choisissez de nous les envoyer via l'un de nos formulaires.
            </p>
            <div className="mt-6">
              <CardGrid items={dataYouProvide} />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
            <h3 className="font-head text-2xl font-semibold text-black">
              Les informations collectées automatiquement
            </h3>
            <p className="mt-2 text-black/75 leading-relaxed">
              Selon vos choix de consentement, nos prestataires de mesure d’audience et de publicité
              peuvent collecter des informations techniques limitées via des cookies et technologies
              similaires :
            </p>
            <div className="mt-5">
              <BulletList items={dataCollectedAutomatically} />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up" data-delay="3">
        <h2 className="font-head text-3xl font-bold text-black">Cookies, mesure d’audience et publicité</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <div className="space-y-4 text-black/80 leading-relaxed">
            <p>
              Nous utilisons Google Analytics 4 pour comprendre comment les visiteurs utilisent le
              site afin de l'améliorer. Google Analytics dépose des cookies et traite les
              informations techniques décrites ci-dessus. Ces cookies analytiques ne se chargent
              que si vous acceptez séparément la catégorie « Mesure d’audience ».
            </p>
            <p>
              Avec votre consentement distinct pour la catégorie « Publicité », nous utilisons
              également le Pixel Meta. Il nous permet de mesurer les actions réalisées après une
              interaction avec nos publicités et de créer des audiences pertinentes sur les
              services Meta. Le Pixel peut traiter des informations techniques, l’adresse IP,
              l’adresse de la page, des identifiants de navigateur et des informations relatives à
              la campagne. Nous n’envoyons pas à Meta le contenu de vos formulaires via le Pixel.
            </p>
            <p>
              Ce même consentement à la catégorie « Publicité » couvre Google Ads. Nous diffusons des
              campagnes sur le réseau de recherche et le réseau display, et la balise Google Ads nous
              permet de mesurer les réservations et demandes consécutives à un clic sur une annonce et
              de présenter des annonces pertinentes aux personnes ayant déjà visité le site
              (remarketing). Lorsque notre propriété Google Analytics est associée à Google Ads, les
              données analytiques peuvent également servir à constituer ces audiences. Nous
              n’envoyons pas à Google le contenu de vos formulaires.
            </p>
            <p>
              Vous pouvez modifier ou retirer votre choix à tout moment via le bouton ci-dessous,
              refuser ou supprimer les cookies dans les paramètres de votre navigateur, vous
              désinscrire de Google Analytics sur l'ensemble des sites via le{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
              >
                module de désactivation de Google
              </a>
              , désactiver la publicité personnalisée dans vos{' '}
              <a
                href="https://myadcenter.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
              >
                paramètres publicitaires Google
              </a>
              , ou ajuster vos{' '}
              <a
                href="https://www.facebook.com/settings?tab=ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
              >
                préférences publicitaires Meta
              </a>
              . Le blocage des cookies n'affecte pas votre capacité à naviguer sur le site ou à nous contacter.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT))}
            className="mt-6 inline-flex items-center rounded-full border border-primary/15 bg-white px-5 py-2.5 font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5"
          >
            Gérer les préférences de cookies
          </button>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Comment nous utilisons vos informations</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <BulletList items={howWeUse} />
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Messages reçus via les plateformes de Meta</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Nous utilisons un outil privé de gestion de la relation client pour lire et traiter, en
            un seul endroit, les messages envoyés aux Pages Facebook, aux comptes Instagram, au
            numéro WhatsApp et aux adresses e-mail de 45Beach et d’Or Hakerem. Les données reçues des
            plateformes de Meta (Facebook, Instagram et WhatsApp) servent uniquement à vous répondre
            et à conserver l’historique de nos échanges avec vous. Nous ne les vendons pas, nous ne
            les utilisons ni à des fins publicitaires ni pour du profilage, et nous ne les partageons
            avec personne d’autre que les prestataires listés ci-dessous. Vous pouvez nous demander de
            les supprimer à tout moment — consultez nos{' '}
            <Link href={dataDeletionHref} className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light">
              Instructions de suppression des données
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Base légale du traitement</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-cream/50 p-6 md:p-8">
          <p className="text-black/75 leading-relaxed">
            Lorsque le Règlement général sur la protection des données de l'UE ou du Royaume-Uni
            s'applique, nous nous appuyons sur les bases légales suivantes :
          </p>
          <div className="mt-6">
            <CardGrid items={legalBases} />
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Partage et services tiers</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Nous ne vendons pas vos données personnelles. Selon le service et la finalité, les tiers
            peuvent traiter les données pour notre compte, agir comme responsables indépendants ou
            agir avec nous en qualité de responsables conjoints. Pour certains traitements des
            outils Meta Business soumis au RGPD, Or Hakerem et Meta Platforms Ireland Limited sont
            responsables conjoints de la collecte et de la transmission des données d’événement.
            Pour en savoir plus, consultez les{' '}
            <a
              href="https://www.facebook.com/legal/terms/businesstools/preview"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
            >
              Conditions des outils Meta Business
            </a>
            .
          </p>
          <div className="mt-6">
            <CardGrid items={processors} />
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Transferts internationaux de données</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Certains de nos prestataires sont situés en dehors d'Israël et de l'Espace économique
            européen, notamment aux États-Unis. Lorsque vos données sont transférées à
            l'international, nous nous appuyons sur des garanties appropriées offertes par ces
            prestataires, notamment des clauses contractuelles types et des mécanismes d'adéquation reconnus.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Conservation des données</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <BulletList items={dataRetention} />
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Vos droits</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h3 className="font-head text-2xl font-semibold text-black">Si vous résidez dans l'EEE ou au Royaume-Uni</h3>
            <p className="mt-2 text-black/75 leading-relaxed">
              En vertu du RGPD, vous avez le droit de :
            </p>
            <div className="mt-5">
              <BulletList items={gdprRights} />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-6">
            <h3 className="font-head text-2xl font-semibold text-black">Si vous résidez en Israël</h3>
            <div className="mt-2 space-y-4 text-black/75 leading-relaxed">
              <p>
                En vertu de la loi israélienne sur la protection de la vie privée, vous avez le
                droit de consulter les données personnelles que nous détenons à votre sujet dans
                notre base de données et de demander leur correction ou mise à jour.
              </p>
              <p>
                Pour exercer l'un de ces droits, écrivez-nous à{' '}
                <a
                  href="mailto:orhakerem@45beach.com"
                  className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
                >
                  orhakerem@45beach.com
                </a>
                . Nous répondrons dans les délais requis par la loi applicable. Pour les données reçues via Facebook, Instagram ou WhatsApp, vous pouvez également suivre nos{' '}
                <Link href={dataDeletionHref} className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light">
                  Instructions de suppression des données
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Sécurité des données</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Nous prenons des mesures techniques et organisationnelles raisonnables pour protéger
            vos données personnelles et nous nous appuyons sur des prestataires réputés pour les
            stocker et les traiter de manière sécurisée. Cependant, aucune méthode de transmission
            sur internet ou de stockage électronique n'est totalement sécurisée, et nous ne
            pouvons garantir une sécurité absolue.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Confidentialité des mineurs</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Le site est destiné aux adultes. Nous ne collectons pas sciemment de données
            personnelles auprès d'enfants de moins de 16 ans. Si vous pensez qu'un enfant nous a
            fourni des données personnelles, merci de nous contacter afin que nous puissions les supprimer.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Liens vers des sites tiers</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Notre site renvoie vers des services externes tels qu'Airbnb, WhatsApp, Instagram,
            LinkedIn et Facebook. Nous ne sommes pas responsables des pratiques de confidentialité
            de ces services, et nous vous encourageons à consulter leurs propres politiques de confidentialité.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Modifications de cette politique</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Nous pouvons mettre à jour cette politique de temps à autre pour refléter des
            changements dans nos pratiques ou pour des raisons légales. Le cas échéant, nous
            mettrons à jour la date de « Dernière mise à jour » en haut de cette page.
          </p>
        </div>
      </section>

      <section data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Nous contacter</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <div className="rounded-2xl border border-secondary/20 bg-cream p-6">
            <h3 className="font-head text-2xl font-semibold text-black">Or Hakerem</h3>
            <address className="mt-4 not-italic space-y-2 text-black/80 leading-relaxed">
              <p>35 rue Hakovshim, Tel Aviv, Israël</p>
              <p>
                Gérée par{' '}
                <a
                  href="https://www.45beach.com/fr"
                  target="_blank"
                  rel="noopener"
                  className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
                >
                  45Beach
                </a>{' '}
                — 45 rue HaYarkon, Tel Aviv-Yafo, Israël
              </p>
              <p>
                E-mail :{' '}
                <a
                  href="mailto:orhakerem@45beach.com"
                  className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
                >
                  orhakerem@45beach.com
                </a>
              </p>
              <p dir="ltr">
                Téléphone :{' '}
                <a href="tel:+972585778891" className="font-semibold text-primary hover:text-primary-light">
                  +972 58 577 8891
                </a>{' '}
                (IL) ·{' '}
                <a href="tel:+33651179925" className="font-semibold text-primary hover:text-primary-light">
                  +33 6 51 17 99 25
                </a>{' '}
                (FR)
              </p>
            </address>
          </div>

          <p className="mt-6 text-black/80 leading-relaxed">
            Voir également nos{' '}
            <Link
              href={termsHref}
              className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
            >
              Conditions Générales
            </Link>{' '}
            et notre{' '}
            <Link
              href={cancellationHref}
              className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light"
            >
              Politique d'annulation et de remboursement
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
