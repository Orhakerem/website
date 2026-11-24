import Link from 'next/link';

import { BulletList } from '@/components/legal/LegalPageShell';

const deleted = [
  'Your messages, attachments and profile information received from Facebook, Instagram or WhatsApp.',
  'Your contact details and conversation history in our customer management tool.',
];

export default function DataDeletionContentEn({ privacyHref }: { privacyHref: string }) {
  return (
    <>
      <section className="mb-10" data-animate="fade-up" data-delay="1">
        <div className="rounded-2xl border border-primary/10 bg-cream/50 p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Or Hakerem is managed by 45Beach, the operator of orhakerem.com and the data controller. Or Hakerem uses the information you share with us through Facebook Messenger, Instagram Direct and WhatsApp only to answer your messages and to keep the history of our exchanges. You can ask us to delete it at any time.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">How to request deletion</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <ol className="list-decimal space-y-3 ps-6 text-black/80 leading-relaxed">
            <li>
              Send an email to{' '}
              <a href="mailto:orhakerem@45beach.com" className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light">
                orhakerem@45beach.com
              </a>{' '}
              with the subject “Data deletion request”.
            </li>
            <li>
              Tell us which channel you used to contact us (Facebook Messenger, Instagram, WhatsApp, email or our website) and the name or username shown on that channel, so we can find your conversations.
            </li>
            <li>
              We will confirm receipt within 5 business days and delete your data within 30 days, then send you a confirmation with a reference number for your request.
            </li>
          </ol>
          <p className="mt-6 text-black/80 leading-relaxed">
            You can also send the request as a message to our Facebook Page or Instagram account (@or_hakerem).
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">What is deleted</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <BulletList items={deleted} />
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">What we may keep</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            Information we are legally required to keep — for example invoices and accounting records related to a past booking — is kept only for the period required by law and then deleted.
          </p>
        </div>
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">Removing our access</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            We do not use “Log in with Facebook”. Deleting the conversation in your app or blocking our Page or account stops future messages but does not delete the copy we hold, so please also send us the request above.
          </p>
        </div>
      </section>

      <section data-animate="fade-up">
        <div className="rounded-2xl border border-secondary/20 bg-cream p-6 md:p-8">
          <p className="text-black/80 leading-relaxed">
            This request covers both Or Hakerem and 45Beach, which share the same customer management tool. Full details are in our{' '}
            <Link href={privacyHref} className="font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
