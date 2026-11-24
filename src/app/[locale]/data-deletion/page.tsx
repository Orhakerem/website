import { Trash2 } from 'lucide-react';

import { createCanonicalUrl } from '@/app/seo';
import LegalPageShell from '@/components/legal/LegalPageShell';
import { isLocale, localizePath, type Locale } from '@/i18n/config';
import DataDeletionContentEn from './content/en';
import DataDeletionContentFr from './content/fr';
import DataDeletionContentHe from './content/he';

const DATA_DELETION_CONTENT: Record<Locale, (props: { privacyHref: string }) => JSX.Element> = {
  en: DataDeletionContentEn,
  fr: DataDeletionContentFr,
  he: DataDeletionContentHe,
};

const HEADER_TEXT: Record<Locale, { title: string; subtitle: string; lastUpdated: string }> = {
  en: {
    title: 'Data Deletion Instructions',
    subtitle: 'How to ask Or Hakerem to delete the data received through Facebook Messenger, Instagram Direct, WhatsApp or email.',
    lastUpdated: 'Last updated: 24 November 2026',
  },
  fr: {
    title: 'Instructions de suppression des données',
    subtitle:
      'Comment demander à Or Hakerem de supprimer les données reçues via Facebook Messenger, Instagram Direct, WhatsApp ou par e-mail.',
    lastUpdated: 'Dernière mise à jour : 24 novembre 2026',
  },
  he: {
    title: 'הוראות מחיקת מידע',
    subtitle: 'כיצד לבקש מאור הכרם למחוק את המידע שהתקבל דרך Facebook Messenger, ‏Instagram Direct, ‏WhatsApp או באימייל.',
    lastUpdated: 'עדכון אחרון: 24 בנובמבר 2026',
  },
};

export default function DataDeletionPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const Content = DATA_DELETION_CONTENT[locale];
  const header = HEADER_TEXT[locale];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Data Deletion Instructions',
    url: createCanonicalUrl(localizePath(locale, '/data-deletion')),
    description:
      'How to ask Or Hakerem to delete the data received through Facebook Messenger, Instagram Direct, WhatsApp or email.',
  };

  return (
    <LegalPageShell
      icon={<Trash2 className="h-8 w-8 text-white" />}
      title={header.title}
      subtitle={header.subtitle}
      structuredData={structuredData}
      extraHeader={
        <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-black/50">
          {header.lastUpdated}
        </p>
      }
    >
      <Content privacyHref={localizePath(locale, '/privacy')} />
    </LegalPageShell>
  );
}
