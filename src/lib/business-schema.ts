import type { Locale } from '@/i18n/config';
import { SITE_URL } from '@/app/seo';

export const BUSINESS_NAME = 'Or Hakerem';
export const GOOGLE_BUSINESS_PROFILE_URL = 'https://www.google.com/maps?cid=11119085925362597877';

export const BUSINESS_NAP = {
  streetAddress: '35 HaKovshim St',
  addressLocality: 'Tel Aviv-Yafo',
  postalCode: '6329302',
  addressCountry: 'IL',
  telephone: '+972585778891',
  email: 'keremliving@gmail.com',
} as const;

export const SOCIAL_PROFILES = [
  GOOGLE_BUSINESS_PROFILE_URL,
  'https://www.instagram.com/or_hakerem/',
  'https://www.tiktok.com/@or.hakerem',
  'https://www.facebook.com/profile.php?id=61583829025542',
  'https://www.linkedin.com/company/orhakerem/',
] as const;

export function getBusinessStructuredData(locale: Locale, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE_URL}/#business`,
    name: BUSINESS_NAME,
    url: SITE_URL,
    description,
    inLanguage: locale,
    image: `${SITE_URL}/og-image.jpg`,
    logo: `${SITE_URL}/logo/Logo_beige.png`,
    telephone: BUSINESS_NAP.telephone,
    email: BUSINESS_NAP.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_NAP.streetAddress,
      addressLocality: BUSINESS_NAP.addressLocality,
      postalCode: BUSINESS_NAP.postalCode,
      addressCountry: BUSINESS_NAP.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 32.0700843,
      longitude: 34.7640991,
    },
    areaServed: {
      '@type': 'City',
      name: 'Tel Aviv-Yafo',
      address: { '@type': 'PostalAddress', addressCountry: 'IL' },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS_NAP.telephone,
      contactType: 'customer service',
      availableLanguage: ['English', 'French', 'Hebrew'],
    },
    sameAs: SOCIAL_PROFILES,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  };
}
