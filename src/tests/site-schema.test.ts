import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { SITE_URL } from '../app/seo';
import { BUSINESS_NAP, getBusinessStructuredData } from '../lib/business-schema';
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  getBreadcrumbStructuredData,
  getOrganizationStructuredData,
  getVideoStructuredData,
  getWebSiteStructuredData,
} from '../lib/site-schema';
import { getEventVideos } from '../lib/event-videos';
import { getEventsHeroVideo, getHomeHeroVideo } from '../lib/site-videos';

const LOCALES = ['en', 'fr', 'he'] as const;
const PUBLIC_DIR = path.join(process.cwd(), 'public');

test('the standalone Organization carries the canonical NAP', () => {
  const organization = getOrganizationStructuredData();

  assert.equal(organization['@id'], ORGANIZATION_ID);
  assert.equal(organization.url, SITE_URL);
  assert.equal(organization.telephone, BUSINESS_NAP.telephone);
  assert.equal(organization.email, BUSINESS_NAP.email);
  assert.equal(organization.address.streetAddress, BUSINESS_NAP.streetAddress);
  assert.ok(organization.sameAs.length > 0);
});

test('the business node points back at the Organization entity', () => {
  for (const locale of LOCALES) {
    const business = getBusinessStructuredData(locale, 'A localized description.');
    assert.equal(business.parentOrganization['@id'], ORGANIZATION_ID);
  }
});

test('the WebSite node is localized, published by the Organization, and declares no fake search', () => {
  for (const locale of LOCALES) {
    const website = getWebSiteStructuredData(locale);

    assert.equal(website['@id'], WEBSITE_ID);
    assert.equal(website.inLanguage, locale);
    assert.equal(website.publisher['@id'], ORGANIZATION_ID);
    assert.ok(!('potentialAction' in website));
  }
});

test('breadcrumb items are absolute, ordered URLs', () => {
  const schema = getBreadcrumbStructuredData([
    { name: 'Accueil', path: '/fr' },
    { name: 'Logements', path: '/fr/properties' },
  ]);

  assert.deepEqual(
    schema.itemListElement.map((entry) => [entry.position, entry.item]),
    [
      [1, `${SITE_URL}/fr`],
      [2, `${SITE_URL}/fr/properties`],
    ],
  );
});

test('site videos are localized and point at files that exist', () => {
  for (const locale of LOCALES) {
    for (const [video, page] of [
      [getHomeHeroVideo(locale), '/'],
      [getEventsHeroVideo(locale), '/events'],
      ...getEventVideos(locale).map((video) => [video, '/events'] as const),
    ] as const) {
      const schema = getVideoStructuredData(video, page);

      assert.equal(schema['@type'], 'VideoObject');
      assert.ok(schema.name.length > 0);
      assert.ok(schema.description.length > 0);
      // Search Console rejects a bare date here: uploadDate must be a full
      // ISO 8601 date-time carrying a timezone offset.
      assert.match(
        schema.uploadDate,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/,
      );
      assert.match(schema.duration, /^PT\d+S$/);
      assert.equal(schema.publisher['@id'], ORGANIZATION_ID);
      assert.ok(existsSync(path.join(PUBLIC_DIR, video.contentPath)));
      assert.ok(existsSync(path.join(PUBLIC_DIR, video.thumbnailPath)));
    }
  }
});

test('hero video copy differs per locale', () => {
  const names = LOCALES.map((locale) => getHomeHeroVideo(locale).name);
  assert.equal(new Set(names).size, LOCALES.length);
});

test('event videos have unique slugs, a preview, and stay within their weight budget', () => {
  const videos = getEventVideos('en');
  assert.equal(new Set(videos.map((video) => video.slug)).size, videos.length);

  const size = (file: string) => statSync(path.join(PUBLIC_DIR, file)).size;
  for (const video of videos) {
    assert.ok(size(video.contentPath) <= 5 * 1024 * 1024, video.slug);
    assert.ok(size(video.previewPath) <= 350 * 1024, video.slug);
    assert.ok(size(video.thumbnailPath) <= 90 * 1024, video.slug);
  }
});

test('event video copy differs per locale', () => {
  const [en, fr, he] = LOCALES.map((locale) => getEventVideos(locale));
  en.forEach((video, index) => {
    assert.equal(new Set([video.name, fr[index].name, he[index].name]).size, LOCALES.length);
  });
});
