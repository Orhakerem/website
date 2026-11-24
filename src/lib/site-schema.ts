import type { Locale } from '@/i18n/config';
import { SITE_URL } from '@/app/seo';
import { BEACH45 } from '@/lib/beach45';
import { BUSINESS_NAME, BUSINESS_NAP, SOCIAL_PROFILES } from '@/lib/business-schema';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Standalone `Organization`. Until now the brand only existed nested inside
 * the `LodgingBusiness`, which gave Google no stable entity to attach the
 * name "Or Hakerem" to — the site ranked ~9th on its own brand query.
 */
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: BUSINESS_NAME,
    alternateName: ['Or HaKerem', 'אור הכרם'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo/Logo_beige.png`,
    },
    image: `${SITE_URL}/og-image.jpg`,
    telephone: BUSINESS_NAP.telephone,
    email: BUSINESS_NAP.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_NAP.streetAddress,
      addressLocality: BUSINESS_NAP.addressLocality,
      postalCode: BUSINESS_NAP.postalCode,
      addressCountry: BUSINESS_NAP.addressCountry,
    },
    sameAs: SOCIAL_PROFILES,
    // Or Hakerem keeps its own brand but is managed by 45Beach.
    parentOrganization: {
      '@type': 'Organization',
      name: BEACH45.name,
      url: BEACH45.site,
    },
  };
}

/**
 * `WebSite` node. No `SearchAction` on purpose: the site has no search page,
 * and declaring a sitelinks searchbox that does not exist is a spam signal.
 */
export function getWebSiteStructuredData(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: BUSINESS_NAME,
    inLanguage: locale,
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export type BreadcrumbTrailItem = {
  name: string;
  /** Site-relative, already localized (e.g. `/fr/properties`). */
  path: string;
};

/**
 * `BreadcrumbList` for any page. The blog built its own inline; this is the
 * shared version so the rest of the site stops shipping breadcrumb-less pages.
 */
export function getBreadcrumbStructuredData(trail: readonly BreadcrumbTrailItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, `${SITE_URL}/`).toString(),
    })),
  };
}

export type SiteVideo = {
  name: string;
  description: string;
  /** Site-relative path to the poster image. */
  thumbnailPath: string;
  /** Site-relative path to the mp4. */
  contentPath: string;
  /**
   * ISO 8601 date-time the video was published, **with a timezone offset**.
   * A date alone (`2025-05-18`) is what Search Console flags as "missing
   * timezone" / "incorrect date and time value" for `uploadDate`.
   */
  uploadDate: string;
  /** ISO 8601 duration, e.g. `PT4S`. */
  duration: string;
};

/**
 * `VideoObject` for the hero videos. Search Console reported 0 indexed / 6
 * discovered videos because neither hero carried any video markup.
 */
export function getVideoStructuredData(video: SiteVideo, pagePath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: [new URL(video.thumbnailPath, `${SITE_URL}/`).toString()],
    contentUrl: new URL(video.contentPath, `${SITE_URL}/`).toString(),
    uploadDate: video.uploadDate,
    duration: video.duration,
    embedUrl: new URL(pagePath, `${SITE_URL}/`).toString(),
    publisher: { '@id': ORGANIZATION_ID },
  };
}
