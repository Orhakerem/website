import type { BookablePropertyId } from '@/lib/bookable-properties';
import { localizePath, type Locale } from '@/i18n/config';
import { createCanonicalUrl, SITE_URL } from '@/app/seo';
import { BUSINESS_NAP } from '@/lib/business-schema';

export interface PropertySeoMeta {
  title: string;
  description: string;
  keywords: string;
  image: string;
  imageAlt: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  priceFrom: number;
  priceTo: number;
}

const enSeo: Record<BookablePropertyId, PropertySeoMeta> = {
  'penthouse-jacuzzi': {
    title: 'Luxury Penthouse with Private Jacuzzi & Sea Views | Tel Aviv | Or Hakerem',
    description:
      'Spacious 3-bedroom penthouse with private rooftop jacuzzi, BBQ terrace and panoramic sea views. Book direct and save 15%.',
    keywords:
      'penthouse jacuzzi Tel Aviv, luxury apartments Tel Aviv, luxury penthouse Kerem HaTeimanim, sea view apartment Tel Aviv, BBQ terrace rental Tel Aviv, rooftop apartment Tel Aviv, luxury short-term rental Tel Aviv, vacation rental Tel Aviv',
    image: '/penthouse/1-jacuzzi-angle.JPEG',
    imageAlt:
      'Luxury penthouse rooftop terrace with private jacuzzi and Tel Aviv sea views at Or Hakerem',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 7,
    priceFrom: 1850,
    priceTo: 3900,
  },
  'cozy-studio': {
    title: 'Renovated Studio Apartment 2 Min from Beach | Tel Aviv | Or Hakerem',
    description:
      'Renovated studio in a historic Ottoman building, 2 minutes from Banana Beach and Carmel Market. Book direct and save 15%.',
    keywords:
      'studio apartment Tel Aviv, short-term rental Tel Aviv, vacation rental Tel Aviv, short-term rental Carmel Market, historic building apartment Tel Aviv, studio near beach Tel Aviv, cozy apartment Kerem HaTeimanim, long-term rental Tel Aviv',
    image: '/studio/lit_angle_1.jpg',
    imageAlt:
      'Cozy renovated studio apartment in historic Ottoman building, Kerem HaTeimanim Tel Aviv',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 4,
    priceFrom: 550,
    priceTo: 850,
  },
};

const frSeo: Record<BookablePropertyId, PropertySeoMeta> = {
  'penthouse-jacuzzi': {
    title: 'Penthouse de luxe avec jacuzzi privé et vue mer | Tel Aviv | Or Hakerem',
    description:
      "Penthouse de 3 chambres avec jacuzzi privé sur le toit, terrasse barbecue et vue mer. Réservez en direct, 15 % de remise.",
    keywords:
      'penthouse avec jacuzzi Tel Aviv, appartement de luxe vue mer Tel Aviv, location appartement de luxe Israël, terrasse avec barbecue Tel Aviv, appartement rooftop Tel Aviv, location vacances haut de gamme Tel Aviv, Kerem HaTeimanim',
    image: '/penthouse/1-jacuzzi-angle.JPEG',
    imageAlt: 'Terrasse sur le toit du penthouse de luxe avec jacuzzi privé et vue mer sur Tel Aviv, Or Hakerem',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 7,
    priceFrom: 1850,
    priceTo: 3900,
  },
  'cozy-studio': {
    title: 'Studio rénové à 2 min de la plage | Tel Aviv | Or Hakerem',
    description:
      "Studio rénové dans un bâtiment ottoman, à 2 minutes de Banana Beach et du marché du Carmel. Réservez en direct, -15 %.",
    keywords:
      'studio à louer Tel Aviv, location courte durée Tel Aviv, appartement pas cher Tel Aviv centre, studio proche plage Tel Aviv, appartement cosy Tel Aviv, location longue durée Tel Aviv, Kerem HaTeimanim',
    image: '/studio/lit_angle_1.jpg',
    imageAlt: 'Studio rénové chaleureux dans un bâtiment historique ottoman, Kerem HaTeimanim Tel Aviv',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 4,
    priceFrom: 550,
    priceTo: 850,
  },
};

const heSeo: Record<BookablePropertyId, PropertySeoMeta> = {
  'penthouse-jacuzzi': {
    title: 'פנטהאוז יוקרה עם ג׳קוזי פרטי ונוף לים | תל אביב | אור הכרם',
    description:
      'פנטהאוז מרווח עם 3 חדרי שינה, ג׳קוזי פרטי על הגג, מרפסת מנגל ונוף פנורמי לים. הזמינו ישירות וחסכו 15%.',
    keywords: 'פנטהאוז עם ג׳קוזי תל אביב, דירת יוקרה נוף לים, פנטהאוז כרם התימנים, מרפסת עם מנגל תל אביב, דירת גג תל אביב, 2 דקות לים, לב תל אביב',
    image: '/penthouse/1-jacuzzi-angle.JPEG',
    imageAlt: 'מרפסת גג של פנטהאוז יוקרה עם ג׳קוזי פרטי ונוף לים בתל אביב, אור הכרם',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 7,
    priceFrom: 1850,
    priceTo: 3900,
  },
  'cozy-studio': {
    title: 'סטודיו משופץ 2 דקות מהים | תל אביב | אור הכרם',
    description:
      'סטודיו משופץ בבניין עות׳מאני היסטורי, 2 דקות מבננה ביץ׳ ומשוק הכרמל. הזמינו ישירות וחסכו 15%.',
    keywords: 'סטודיו להשכרה תל אביב, דירה קרובה לים תל אביב, השכרה לטווח קצר שוק הכרמל, בניין היסטורי תל אביב, סטודיו כרם התימנים, 2 דקות לים',
    image: '/studio/lit_angle_1.jpg',
    imageAlt: 'סטודיו משופץ ונעים בבניין היסטורי עות׳מאני, כרם התימנים תל אביב',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 4,
    priceFrom: 550,
    priceTo: 850,
  },
};

const PROPERTY_SEO_BY_LOCALE: Record<Locale, Record<BookablePropertyId, PropertySeoMeta>> = {
  en: enSeo,
  fr: frSeo,
  he: heSeo,
};

export function getPropertySeo(locale: Locale): Record<BookablePropertyId, PropertySeoMeta> {
  return PROPERTY_SEO_BY_LOCALE[locale];
}

// Kept for any legacy caller that has not yet selected a locale.
export const PROPERTY_SEO = enSeo;

export function getPropertyStructuredData(id: BookablePropertyId, locale: Locale) {
  const seo = getPropertySeo(locale)[id];
  const url = createCanonicalUrl(localizePath(locale, `/properties/${id}`));
  const businessId = `${SITE_URL}/#business`;

  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${url}#lodging-business`,
    name: `Or Hakerem — ${id === 'penthouse-jacuzzi' ? 'Luxury Penthouse' : 'Spacious & Cosy Apartment'}`,
    url,
    image: `${SITE_URL}${seo.image}`,
    description: seo.description,
    inLanguage: locale,
    parentOrganization: {
      '@id': businessId,
      '@type': 'Organization',
      name: 'Or Hakerem',
      url: SITE_URL,
    },
    numberOfRooms: seo.bedrooms,
    priceRange: `₪${seo.priceFrom}–₪${seo.priceTo}`,
    makesOffer: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: seo.priceFrom,
        priceCurrency: 'ILS',
        unitText: 'NIGHT',
      },
      availability: 'https://schema.org/InStock',
      url,
      seller: {
        '@id': businessId,
      },
    },
    amenityFeature:
      id === 'penthouse-jacuzzi'
        ? [
            { '@type': 'LocationFeatureSpecification', name: 'Private Jacuzzi', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'BBQ Terrace', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Sea Views', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
          ]
        : [
            { '@type': 'LocationFeatureSpecification', name: 'Beach Access', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Fully Equipped Kitchen', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Air Conditioning', value: true },
          ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_NAP.streetAddress,
      addressLocality: BUSINESS_NAP.addressLocality,
      postalCode: BUSINESS_NAP.postalCode,
      addressCountry: BUSINESS_NAP.addressCountry,
    },
    containedInPlace: {
      '@type': 'Place',
      name: 'Kerem HaTeimanim',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tel Aviv',
        addressCountry: 'IL',
      },
    },
  };
}
