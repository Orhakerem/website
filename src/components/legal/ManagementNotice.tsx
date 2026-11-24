import type { Locale } from '@/i18n/config';
import { BEACH45, BEACH45_ADDRESS, CONTACT_EMAIL } from '@/lib/beach45';

/*
 * Legal notice shown at the top of /terms, /privacy and /cancellation:
 * Or Hakerem keeps its identity but is managed by 45Beach.
 */

const TEXT: Record<
  Locale,
  {
    heading: string;
    intro: string;
    publisherLabel: string;
    publisher: string;
    managerLabel: string;
    websiteLabel: string;
    emailLabel: string;
    hostLabel: string;
    host: string;
  }
> = {
  en: {
    heading: 'Legal notice',
    intro:
      'Or Hakerem is managed by 45Beach. The Or Hakerem brand, its apartments and its services remain unchanged; 45Beach manages the website orhakerem.com, direct bookings and event requests. In these terms, “Or Hakerem”, “we” and “the company” refer to Or Hakerem as managed by 45Beach.',
    publisherLabel: 'Website',
    publisher: 'Or Hakerem — orhakerem.com',
    managerLabel: 'Managed by',
    websiteLabel: 'Website:',
    emailLabel: 'Email',
    hostLabel: 'Hosting',
    host: 'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA',
  },
  fr: {
    heading: 'Mentions légales',
    intro:
      'Or Hakerem est gérée par 45Beach. La marque Or Hakerem, ses logements et ses services restent inchangés ; 45Beach assure la gestion du site orhakerem.com, des réservations directes et des demandes d’événement. Dans les présentes, « Or Hakerem », « nous » et « l’entreprise » désignent Or Hakerem sous la gestion de 45Beach.',
    publisherLabel: 'Site',
    publisher: 'Or Hakerem — orhakerem.com',
    managerLabel: 'Gestion',
    websiteLabel: 'Site web :',
    emailLabel: 'E-mail',
    hostLabel: 'Hébergement',
    host: 'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis',
  },
  he: {
    heading: 'מידע משפטי',
    intro:
      'אור הכרם מנוהלת על ידי 45Beach. המותג אור הכרם, הדירות והשירותים שלו נשארים ללא שינוי; 45Beach מנהלת את האתר orhakerem.com, את ההזמנות הישירות ואת פניות האירועים. במסמכים אלה, ״אור הכרם״, ״אנחנו״ ו״החברה״ מתייחסים לאור הכרם בניהול 45Beach.',
    publisherLabel: 'אתר',
    publisher: 'אור הכרם — orhakerem.com',
    managerLabel: 'ניהול',
    websiteLabel: 'אתר אינטרנט:',
    emailLabel: 'דוא״ל',
    hostLabel: 'אחסון',
    host: 'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA',
  },
};

const linkClass =
  'font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light';

export default function ManagementNotice({ locale }: { locale: Locale }) {
  const t = TEXT[locale];

  return (
    <section id="legal-notice" className="mb-10" data-animate="fade-up">
      <h2 className="font-head text-3xl font-bold text-black">{t.heading}</h2>
      <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

      <div className="mt-8 rounded-2xl border border-primary/10 bg-white p-6 md:p-8">
        <p className="text-black/80 leading-relaxed">{t.intro}</p>

        <dl className="mt-6 grid gap-4 rounded-2xl border border-secondary/20 bg-cream p-6 text-black/80 leading-relaxed sm:grid-cols-[auto_1fr] sm:gap-x-8">
          <dt className="font-semibold text-black">{t.publisherLabel}</dt>
          <dd>{t.publisher}</dd>

          <dt className="font-semibold text-black">{t.managerLabel}</dt>
          <dd>
            <strong className="text-black">{BEACH45.name}</strong> — {BEACH45_ADDRESS[locale]}
            <br />
            {t.websiteLabel}{' '}
            <a href={BEACH45.site} target="_blank" rel="noopener" className={linkClass}>
              {BEACH45.siteDisplay}
            </a>
          </dd>

          <dt className="font-semibold text-black">{t.emailLabel}</dt>
          <dd>
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
              {CONTACT_EMAIL}
            </a>
          </dd>

          <dt className="font-semibold text-black">{t.hostLabel}</dt>
          <dd>{t.host}</dd>
        </dl>
      </div>
    </section>
  );
}
