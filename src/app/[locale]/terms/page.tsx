import { FileText } from 'lucide-react';

import LegalPageShell from '@/components/legal/LegalPageShell';
import ManagementNotice from '@/components/legal/ManagementNotice';
import { isLocale, localizePath, type Locale } from '@/i18n/config';
import TermsContentEn from './content/en';
import TermsContentFr from './content/fr';
import TermsContentHe from './content/he';

const TERMS_CONTENT: Record<Locale, (props: { cancellationHref: string }) => JSX.Element> = {
  en: TermsContentEn,
  fr: TermsContentFr,
  he: TermsContentHe,
};

const HEADER_TEXT: Record<Locale, { title: string; subtitle: string }> = {
  en: {
    title: 'Terms & Conditions',
    subtitle: 'Please review the following booking, payment, stay, and responsibility terms for Or Hakerem.',
  },
  fr: {
    title: 'Conditions Générales',
    subtitle:
      "Merci de consulter les conditions de réservation, de paiement, de séjour et de responsabilité d'Or Hakerem.",
  },
  he: {
    title: 'תנאי שימוש',
    subtitle: 'אנא עיינו בתנאי ההזמנה, התשלום, השהות והאחריות של אור הכרם.',
  },
};

export default function TermsPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const Content = TERMS_CONTENT[locale];
  const header = HEADER_TEXT[locale];

  return (
    <LegalPageShell icon={<FileText className="h-8 w-8 text-white" />} title={header.title} subtitle={header.subtitle}>
      <ManagementNotice locale={locale} />
      <Content cancellationHref={localizePath(locale, '/cancellation')} />
    </LegalPageShell>
  );
}
