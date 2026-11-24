import Link from 'next/link';

import { BulletList } from '@/components/legal/LegalPageShell';

const deleted = [
  'Vos messages, pièces jointes et informations de profil reçus de Facebook, Instagram ou WhatsApp.',
  'Vos coordonnées et l’historique de vos conversations dans notre outil de gestion de la relation client.',
];

export default function DataDeletionContentFr({ privacyHref }: { privacyHref: string }) {
  return (
    <>
      <section className="mb-10" data-animate="fade-up" data-delay="1">
        <div className="rounded-2xl border border-primary/10 bg-cream/50 p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Or Hakerem est gérée par 45Beach, exploitant du site orhakerem.com et responsable du traitement. Or Hakerem utilise les informations que vous nous transmettez via Facebook Messenger, Instagram Direct et WhatsApp uniquement pour répondre à vos messages et conserver l’historique de nos échanges. Vous pouvez nous demander de les supprimer à tout moment.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Comment demander la suppression</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <ol className="list-decimal space-y-3 ps-6 text-black/80 leading-relaxed">
            <li>
              Envoyez un e-mail à{' '}
              <a href="mailto:orhakerem@45beach.com" className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light">
                orhakerem@45beach.com
              </a>{' '}
              avec pour objet « Demande de suppression de données ».
            </li>
            <li>
              Indiquez-nous le canal utilisé pour nous contacter (Facebook Messenger, Instagram, WhatsApp, e-mail ou notre site) et le nom ou nom d’utilisateur affiché sur ce canal, afin que nous puissions retrouver vos conversations.
            </li>
            <li>
              Nous accuserons réception sous 5 jours ouvrés et supprimerons vos données sous 30 jours, puis nous vous enverrons une confirmation avec un numéro de référence pour votre demande.
            </li>
          </ol>
          <p className="mt-6 text-black/80 leading-relaxed">
            Vous pouvez aussi envoyer votre demande par message à notre Page Facebook ou à notre compte Instagram (@or_hakerem).
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Ce qui est supprimé</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <BulletList items={deleted} />
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Ce que nous pouvons conserver</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Les informations que la loi nous oblige à conserver — par exemple les factures et documents comptables liés à une réservation passée — ne sont conservées que pendant la durée légale, puis supprimées.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Retirer notre accès</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Nous n’utilisons pas « Se connecter avec Facebook ». Supprimer la conversation dans votre application ou bloquer notre Page ou notre compte empêche les messages futurs mais ne supprime pas la copie que nous détenons : merci d’envoyer également la demande ci-dessus.
          </p>
        </div>
      </section>

      <section data-animate="fade-up">
        <div className="rounded-2xl border border-secondary/20 bg-cream p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Cette demande couvre à la fois Or Hakerem et 45Beach, qui partagent le même outil de gestion de la relation client. Tous les détails figurent dans notre{' '}
            <Link href={privacyHref} className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light">
              Politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
