import type { Locale } from '@/i18n/config';

/**
 * Posts that have an editorially reviewed translation in every public locale.
 * Older English-only guides deliberately stay canonical in English until their
 * translations are ready.
 */
export const FULLY_TRANSLATED_BLOG_SLUGS = [
  'where-to-stay-in-tel-aviv-neighborhoods-guide',
  'three-day-tel-aviv-itinerary-beach-carmel-market-jaffa',
  'private-events-tel-aviv-intimate-celebrations',
  'book-tel-aviv-apartment-directly-with-confidence',
  'long-term-monthly-stays-tel-aviv',
  'book-direct-vs-airbnb-or-hakerem',
  'things-to-do-carmel-market-banana-beach-tel-aviv',
  'short-term-seasonal-rentals-tel-aviv',
  'small-jewish-celebrations-venue-tel-aviv',
] as const;

export function hasBlogTranslation(locale: Locale, slug: string): boolean {
  return locale === 'en' || FULLY_TRANSLATED_BLOG_SLUGS.includes(slug as (typeof FULLY_TRANSLATED_BLOG_SLUGS)[number]);
}
