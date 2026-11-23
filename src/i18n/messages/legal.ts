import type { Locale } from '@/i18n/config';

const en = {
  print: 'Print',
};

export type LegalMessages = typeof en;

const fr: LegalMessages = {
  print: 'Imprimer',
};

const he: LegalMessages = {
  print: 'הדפסה',
};

export const legalMessages: Record<Locale, LegalMessages> = { en, fr, he };
