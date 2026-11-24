import Link from 'next/link';
import { Cookie } from 'lucide-react';

import { createCanonicalUrl } from '@/app/seo';
import CookieSettingsPanel from '@/components/legal/CookieSettingsPanel';
import LegalPageShell from '@/components/legal/LegalPageShell';
import { isLocale, localizePath, type Locale } from '@/i18n/config';
import { commonMessages } from '@/i18n/messages/common';

const TITLE: Record<Locale, string> = {
  en: 'Cookie Settings',
  fr: 'Paramètres des cookies',
  he: 'הגדרות עוגיות',
};

const linkClass =
  'font-semibold text-primary underline underline-offset-4 transition-colors hover:text-primary-light';

export default function CookiesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const common = commonMessages[locale];
  const c = common.cookies.page;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Cookie Settings',
    url: createCanonicalUrl(localizePath(locale, '/cookies')),
    description: 'Which cookies Or Hakerem uses (Google Analytics 4, Meta Pixel) and how to change your choices.',
  };

  return (
    <LegalPageShell
      icon={<Cookie className="h-8 w-8 text-white" />}
      title={TITLE[locale]}
      subtitle={c.intro}
      structuredData={structuredData}
    >
      <section className="mb-10" data-animate="fade-up" data-delay="1">
        <CookieSettingsPanel />
      </section>

      <section className="mb-10" data-animate="fade-up">
        <h2 className="font-head text-3xl font-bold text-black">{c.tableTitle}</h2>
        <div className="mt-3 h-px w-full bg-gradient-to-r from-secondary to-transparent"></div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-primary/10 bg-white">
          <table className="w-full min-w-[560px] text-start text-sm">
            <thead className="bg-cream/60 text-black">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{c.table.name}</th>
                <th className="px-4 py-3 text-start font-semibold">{c.table.provider}</th>
                <th className="px-4 py-3 text-start font-semibold">{c.table.purpose}</th>
                <th className="px-4 py-3 text-start font-semibold">{c.table.duration}</th>
              </tr>
            </thead>
            <tbody className="text-black/80">
              {c.rows.map((r) => (
                <tr key={r.name} className="border-t border-primary/10 align-top">
                  <td dir="ltr" className="px-4 py-3 font-mono text-[13px] text-start">
                    {r.name}
                  </td>
                  <td className="px-4 py-3">{r.provider}</td>
                  <td className="px-4 py-3">{r.purpose}</td>
                  <td className="px-4 py-3">{r.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-black/80 leading-relaxed">
          {c.outro}{locale === 'he' ? '' : ' '}
          <Link href={localizePath(locale, '/privacy')} className={linkClass}>
            {common.cookies.privacyPolicy}
          </Link>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
