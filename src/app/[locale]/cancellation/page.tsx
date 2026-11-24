import { FileText } from 'lucide-react';

import { createCanonicalUrl } from '@/app/seo';
import LegalPageShell from '@/components/legal/LegalPageShell';
import ManagementNotice from '@/components/legal/ManagementNotice';
import { isLocale, localizePath, type Locale } from '@/i18n/config';
import CancellationContentEn from './content/en';
import CancellationContentFr from './content/fr';
import CancellationContentHe from './content/he';

const CANCELLATION_CONTENT: Record<Locale, () => JSX.Element> = {
  en: CancellationContentEn,
  fr: CancellationContentFr,
  he: CancellationContentHe,
};

const HEADER_TEXT: Record<Locale, { title: string; subtitle: string }> = {
  en: {
    title: 'Cancellation & Refund Policy',
    subtitle:
      'Please review the cancellation, refund, payment, and voucher terms that apply to direct bookings at Or Hakerem.',
  },
  fr: {
    title: "Politique d'annulation et de remboursement",
    subtitle:
      "Merci de consulter les conditions d'annulation, de remboursement, de paiement et de bon d'achat applicables aux réservations directes chez Or Hakerem.",
  },
  he: {
    title: 'מדיניות ביטולים והחזרים',
    subtitle:
      'אנא עיינו בתנאי הביטול, ההחזר, התשלום והשוברים החלים על הזמנות ישירות באור הכרם.',
  },
};

export default function CancellationPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const Content = CANCELLATION_CONTENT[locale];
  const header = HEADER_TEXT[locale];

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Cancellation & Refund Policy',
    url: createCanonicalUrl(localizePath(locale, '/cancellation')),
    description:
      'Or Hakerem cancellation and refund policy for short-term stays in Tel Aviv, including deposit schedules, non-refundable conditions, and voucher terms.',
  };

  return (
    <LegalPageShell
      icon={<FileText className="h-8 w-8 text-white" />}
      title={header.title}
      subtitle={header.subtitle}
      structuredData={structuredData}
    >
      <ManagementNotice locale={locale} />
      <Content />
    </LegalPageShell>
  );
}
