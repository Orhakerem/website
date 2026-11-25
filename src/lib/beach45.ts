import type { Locale } from '@/i18n/config';

/*
 * 45Beach — the company that manages Or Hakerem (orhakerem.com).
 * Or Hakerem keeps its own identity; 45Beach is cited as manager in the legal
 * pages and footer, its studios are listed on /properties and its terrace is
 * promoted on /events.
 *
 * 45beach.com uses the same URL scheme as this site: English unprefixed, /fr and /he.
 */

export const BEACH45 = {
  name: '45Beach',
  site: 'https://www.45beach.com',
  siteDisplay: '45beach.com',
  streetAddress: '45 HaYarkon St',
  addressLocality: 'Tel Aviv-Yafo',
  addressCountry: 'IL',
} as const;

/** Contact + reception address for Or Hakerem since it moved under 45Beach management. */
export const CONTACT_EMAIL = 'orhakerem@45beach.com';

export const BEACH45_ADDRESS: Record<Locale, string> = {
  en: '45 HaYarkon Street, Tel Aviv-Yafo, Israel',
  fr: '45 rue HaYarkon, Tel Aviv-Yafo, Israël',
  he: 'רחוב הירקון 45, תל אביב-יפו, ישראל',
};

export function beach45Url(locale: Locale, path = '') {
  return `${BEACH45.site}${locale === 'en' ? '' : `/${locale}`}${path}`;
}

type ListingText = { name: string; tagline: string };

export type Beach45Listing = {
  number: number;
  /** Slug of the page on 45beach.com (`/apartments/<slug>`); `null` while the listing is not published there yet. */
  slug: string | null;
  /** Cover photo in /public/45beach; `null` shows the 45Beach placeholder. */
  image: string | null;
  guests: number | null;
  beds: number | null;
  /** Floor area in m²; `null` hides it on the card. */
  sizeSqm: number | null;
  airbnb: string;
  /** Booking.com page of the studio — to be filled in once the links are available. */
  booking: string | null;
  text: Record<Locale, ListingText>;
};

/** Texts and figures as published on 45beach.com (src/lib/apartments.ts there). */
export const BEACH45_LISTINGS: Beach45Listing[] = [
  {
    number: 1,
    slug: 'deluxe-studio-01',
    image: '/45beach/studio-01.jpg',
    guests: 4,
    beds: 2,
    sizeSqm: 30,
    airbnb: 'https://airbnb.com/h/the45-studio-01',
    booking: null,
    text: {
      en: { name: 'Deluxe Studio 01', tagline: 'Gallery loft · two double beds' },
      fr: { name: 'Studio Deluxe 01', tagline: 'Mezzanine · deux lits doubles' },
      he: { name: 'סטודיו דלוקס 01', tagline: 'גלריה · שתי מיטות זוגיות' },
    },
  },
  {
    number: 2,
    slug: 'studio-02',
    image: '/45beach/studio-02.jpg',
    guests: 2,
    beds: 1,
    sizeSqm: 22,
    airbnb: 'https://airbnb.com/h/the45-studio-02',
    booking: null,
    text: {
      en: { name: 'Studio 02', tagline: 'First floor · double bed' },
      fr: { name: 'Studio 02', tagline: 'Premier étage · lit double' },
      he: { name: 'סטודיו 02', tagline: 'קומה ראשונה · מיטה זוגית' },
    },
  },
  {
    number: 3,
    slug: 'studio-03',
    image: '/45beach/studio-03.jpg',
    guests: 2,
    beds: 1,
    sizeSqm: 25,
    airbnb: 'https://airbnb.com/h/the45-studio-03',
    booking: null,
    text: {
      en: { name: 'Studio 03', tagline: 'Bright studio · double bed' },
      fr: { name: 'Studio 03', tagline: 'Studio lumineux · lit double' },
      he: { name: 'סטודיו 03', tagline: 'סטודיו מואר · מיטה זוגית' },
    },
  },
  {
    number: 4,
    slug: 'studio-balcony-04',
    image: '/45beach/studio-04.jpg',
    guests: 2,
    beds: 1,
    sizeSqm: 24,
    airbnb: 'https://airbnb.com/h/the45-studio-04',
    booking: null,
    text: {
      en: { name: 'Studio 04 with Balcony', tagline: 'Sea-view balcony · double bed' },
      fr: { name: 'Studio 04 avec balcon', tagline: 'Balcon vue mer · lit double' },
      he: { name: 'סטודיו 04 עם מרפסת', tagline: 'מרפסת עם נוף לים · מיטה זוגית' },
    },
  },
  {
    number: 5,
    slug: 'studio-balcony-05',
    image: '/45beach/studio-05.jpg',
    guests: 2,
    beds: 1,
    sizeSqm: 25,
    airbnb: 'https://airbnb.com/h/the45-studio-05',
    booking: null,
    text: {
      en: { name: 'Studio 05 with Balcony', tagline: 'Sea-view balcony · double bed' },
      fr: { name: 'Studio 05 avec balcon', tagline: 'Balcon vue mer · lit double' },
      he: { name: 'סטודיו 05 עם מרפסת', tagline: 'מרפסת עם נוף לים · מיטה זוגית' },
    },
  },
  {
    number: 6,
    slug: 'deluxe-studio-balcony-06',
    image: '/45beach/studio-06.jpg',
    guests: 4,
    beds: 2,
    sizeSqm: 24,
    airbnb: 'https://airbnb.com/h/the45-studio-06',
    booking: null,
    text: {
      en: { name: 'Deluxe Studio 06 with Balcony', tagline: 'Sea-view balcony · double bed + sofa bed' },
      fr: { name: 'Studio Deluxe 06 avec balcon', tagline: 'Balcon vue mer · lit double + canapé-lit' },
      he: { name: 'סטודיו דלוקס 06 עם מרפסת', tagline: 'מרפסת עם נוף לים · מיטה זוגית + ספה נפתחת' },
    },
  },
  {
    number: 7,
    slug: 'deluxe-studio-balcony-07',
    image: '/45beach/studio-07.jpg',
    guests: 4,
    beds: 2,
    sizeSqm: 34,
    airbnb: 'https://airbnb.com/h/the45-studio-07',
    booking: null,
    text: {
      en: { name: 'Deluxe Studio 07 with Balcony', tagline: 'The largest · 34 m² · sea-view balcony' },
      fr: { name: 'Studio Deluxe 07 avec balcon', tagline: 'Le plus grand · 34 m² · balcon vue mer' },
      he: { name: 'סטודיו דלוקס 07 עם מרפסת', tagline: 'הגדול ביותר · 34 מ״ר · מרפסת עם נוף לים' },
    },
  },
  {
    number: 8,
    slug: 'deluxe-studio-08',
    image: '/45beach/studio-08.jpg',
    guests: 4,
    beds: 2,
    sizeSqm: 25,
    airbnb: 'https://airbnb.com/h/the45-studio-08',
    booking: null,
    text: {
      en: { name: 'Deluxe Studio 08', tagline: 'Double bed + sofa bed · up to 4' },
      fr: { name: 'Studio Deluxe 08', tagline: 'Lit double + canapé-lit · jusqu’à 4' },
      he: { name: 'סטודיו דלוקס 08', tagline: 'מיטה זוגית + ספה נפתחת · עד 4' },
    },
  },
  {
    number: 9,
    slug: 'studio-09',
    image: '/45beach/studio-09.jpg',
    guests: 2,
    beds: 1,
    sizeSqm: 25,
    airbnb: 'https://airbnb.com/h/the45-studio-09',
    booking: null,
    text: {
      en: { name: 'Studio 09', tagline: 'Calm studio · double bed' },
      fr: { name: 'Studio 09', tagline: 'Studio au calme · lit double' },
      he: { name: 'סטודיו 09', tagline: 'סטודיו שקט · מיטה זוגית' },
    },
  },
  {
    number: 10,
    slug: 'deluxe-studio-balcony-10',
    image: '/45beach/studio-10.jpg',
    guests: 4,
    beds: 2,
    sizeSqm: 25,
    airbnb: 'https://airbnb.com/h/the45-studio-10',
    booking: null,
    text: {
      en: { name: 'Deluxe Studio 10 with Balcony', tagline: 'Private balcony · double bed + sofa bed' },
      fr: { name: 'Studio Deluxe 10 avec balcon', tagline: 'Balcon privé · lit double + canapé-lit' },
      he: { name: 'סטודיו דלוקס 10 עם מרפסת', tagline: 'מרפסת פרטית · מיטה זוגית + ספה נפתחת' },
    },
  },
  {
    number: 11,
    slug: 'studio-terrace-11',
    // The 45beach.com page only has a placeholder visual for now: set the cover once the real photos are published.
    image: null,
    guests: 2,
    beds: 1,
    // Size not published yet (neither on 45beach.com nor on Airbnb).
    sizeSqm: null,
    airbnb: 'https://airbnb.com/h/the45-studio-11',
    booking: null,
    text: {
      en: { name: 'Studio 11 with Terrace', tagline: 'Very large terrace · double bed' },
      fr: { name: 'Studio 11 avec terrasse', tagline: 'Très grande terrasse · lit double' },
      he: { name: 'סטודיו 11 עם טרסה', tagline: 'טרסה גדולה במיוחד · מיטה זוגית' },
    },
  },
];

export function beach45ListingUrl(locale: Locale, listing: Beach45Listing) {
  return listing.slug ? beach45Url(locale, `/apartments/${listing.slug}`) : null;
}
