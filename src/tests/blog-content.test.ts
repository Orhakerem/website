import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { SITE_URL } from '../app/seo';
import sitemap from '../app/sitemap';
import { ENABLED_LOCALES, localizePath, type Locale } from '../i18n/config';
import { getAllPosts, getAvailablePostLocales, localizeBlogHref } from '../lib/blog';

const NEW_POST_SLUGS = [
  'where-to-stay-in-tel-aviv-neighborhoods-guide',
  'three-day-tel-aviv-itinerary-beach-carmel-market-jaffa',
  'private-events-tel-aviv-intimate-celebrations',
  'book-tel-aviv-apartment-directly-with-confidence',
  'short-term-seasonal-rentals-tel-aviv',
  'small-jewish-celebrations-venue-tel-aviv',
] as const;

const UPDATED_POST_SLUGS = [
  'long-term-monthly-stays-tel-aviv',
  'book-direct-vs-airbnb-or-hakerem',
  'things-to-do-carmel-market-banana-beach-tel-aviv',
] as const;

const REQUIRED_FRONTMATTER = [
  'title',
  'description',
  'date',
  'author',
  'image',
  'imageAlt',
  'tags',
  'keywords',
] as const;

const EXPECTED_INTERNAL_DESTINATIONS: Record<(typeof NEW_POST_SLUGS)[number], string[]> = {
  'where-to-stay-in-tel-aviv-neighborhoods-guide': [
    '/blog/kerem-hateimanim-neighborhood-guide',
    '/blog/things-to-do-carmel-market-banana-beach-tel-aviv',
    '/properties/penthouse-jacuzzi',
    '/properties/cozy-studio',
    '/properties',
    '/reservation',
  ],
  'three-day-tel-aviv-itinerary-beach-carmel-market-jaffa': [
    '/blog/things-to-do-carmel-market-banana-beach-tel-aviv',
    '/blog/kerem-hateimanim-neighborhood-guide',
    '/blog/how-far-is-kerem-hateimanim-from-the-beach',
    '/blog/tel-aviv-on-shabbat-what-is-open-getting-around',
    '/properties',
    '/reservation',
  ],
  'private-events-tel-aviv-intimate-celebrations': [
    '/events#availability',
    '/blog/kerem-hateimanim-neighborhood-guide',
    '/blog/three-day-tel-aviv-itinerary-beach-carmel-market-jaffa',
    '/properties',
    '/blog/things-to-do-carmel-market-banana-beach-tel-aviv',
  ],
  'book-tel-aviv-apartment-directly-with-confidence': [
    '/properties',
    '/blog/where-to-stay-in-tel-aviv-neighborhoods-guide',
    '/reservation',
    '/blog/long-term-monthly-stays-tel-aviv',
    '/blog/book-direct-vs-airbnb-or-hakerem',
  ],
  'short-term-seasonal-rentals-tel-aviv': [
    '/blog/long-term-monthly-stays-tel-aviv',
    '/blog/book-tel-aviv-apartment-directly-with-confidence',
    '/properties/cozy-studio',
    '/properties',
    '/reservation',
  ],
  'small-jewish-celebrations-venue-tel-aviv': [
    '/blog/private-events-tel-aviv-intimate-celebrations',
    '/events',
    '/blog/shabbat-friendly-stays-tel-aviv',
    '/properties/penthouse-jacuzzi',
    '/contact',
  ],
};

test('new SEO articles are complete, long-form, and link to the site', () => {
  const posts = new Map(getAllPosts().map((post) => [post.slug, post]));

  for (const slug of NEW_POST_SLUGS) {
    const post = posts.get(slug);
    assert.ok(post, `expected ${slug} to be published`);

    for (const field of REQUIRED_FRONTMATTER.filter((field) => field !== 'tags' && field !== 'keywords')) {
      assert.equal(typeof post.frontmatter[field], 'string', `${slug} frontmatter.${field} should be a string`);
      assert.ok(post.frontmatter[field].trim(), `${slug} is missing frontmatter.${field}`);
    }

    for (const field of ['tags', 'keywords'] as const) {
      assert.ok(Array.isArray(post.frontmatter[field]), `${slug} frontmatter.${field} should be an array`);
      assert.ok(post.frontmatter[field].length > 0, `${slug} frontmatter.${field} should not be empty`);
      assert.ok(post.frontmatter[field].every((value) => typeof value === 'string' && value.trim()), `${slug} frontmatter.${field} should contain strings`);
    }

    const wordCount = post.content.trim().split(/\s+/).length;
    assert.ok(wordCount >= 1200, `${slug} should have at least 1,200 words, received ${wordCount}`);
    assert.ok(wordCount <= 1800, `${slug} should have at most 1,800 words, received ${wordCount}`);

    const internalLinks = post.content.match(/\]\(\/[^)\s]+\)/g) ?? [];
    assert.ok(
      internalLinks.length >= 4 && internalLinks.length <= 6,
      `${slug} should have 4–6 internal links, received ${internalLinks.length}`,
    );

    for (const destination of EXPECTED_INTERNAL_DESTINATIONS[slug]) {
      assert.match(post.content, new RegExp(`\\]\\(${destination.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\)`));
    }

    const imagePath = path.join(process.cwd(), 'public', post.frontmatter.image.replace(/^\//, ''));
    assert.ok(existsSync(imagePath), `${slug} image should exist at ${imagePath}`);
  }
});

test('refreshed guides declare their latest editorial review date', () => {
  const posts = new Map(getAllPosts().map((post) => [post.slug, post]));

  for (const slug of UPDATED_POST_SLUGS) {
    assert.equal(posts.get(slug)?.frontmatter.updated, '2026-07-19');
  }
});

test('new SEO articles are published in the sitemap', () => {
  const urls = new Set(sitemap().map((entry) => entry.url));

  for (const slug of NEW_POST_SLUGS) {
    assert.ok(urls.has(`${SITE_URL}/blog/${slug}`));
  }
});

test('new SEO articles have complete French and Hebrew editions with correct sitemap alternates', () => {
  const entries = sitemap();

  for (const locale of ENABLED_LOCALES) {
    const posts = new Map(getAllPosts(locale).map((post) => [post.slug, post]));

    for (const slug of NEW_POST_SLUGS) {
      const post = posts.get(slug);
      assert.ok(post, `expected ${slug} to be available in ${locale}`);
      assert.equal(post.locale, locale);
      assert.ok(post.frontmatter.title.trim(), `${slug} ${locale} title should not be empty`);
      assert.ok(post.frontmatter.description.trim(), `${slug} ${locale} description should not be empty`);
      assert.ok(post.frontmatter.imageAlt.trim(), `${slug} ${locale} imageAlt should not be empty`);

      const wordCount = post.content.trim().split(/\s+/).length;
      assert.ok(
        wordCount >= 1200 && wordCount <= 1800,
        `${slug} ${locale} should contain 1,200–1,800 words, received ${wordCount}`,
      );

      const internalLinks = post.content.match(/\]\(\/[^)\s]+\)/g) ?? [];
      assert.ok(
        internalLinks.length >= 4 && internalLinks.length <= 6,
        `${slug} ${locale} should have 4–6 internal links, received ${internalLinks.length}`,
      );

      const url = `${SITE_URL}${localizePath(locale, `/blog/${slug}`)}`;
      const entry = entries.find((candidate) => candidate.url === url);
      assert.ok(entry, `expected ${url} in sitemap`);
      assert.deepEqual(entry.alternates?.languages, {
        en: `${SITE_URL}/blog/${slug}`,
        fr: `${SITE_URL}/fr/blog/${slug}`,
        he: `${SITE_URL}/he/blog/${slug}`,
        'x-default': `${SITE_URL}/blog/${slug}`,
      });
    }
  }

  for (const slug of NEW_POST_SLUGS) {
    assert.deepEqual(getAvailablePostLocales(slug), [...ENABLED_LOCALES]);
  }
});

test('English-only legacy guides retain their English URL from translated blog content', () => {
  const legacySlug = 'kerem-hateimanim-neighborhood-guide';

  assert.deepEqual(getAvailablePostLocales(legacySlug), ['en'] satisfies Locale[]);
  assert.equal(localizeBlogHref('fr', `/blog/${legacySlug}`), `/blog/${legacySlug}`);
  assert.equal(localizeBlogHref('he', `/blog/${legacySlug}`), `/blog/${legacySlug}`);
  assert.equal(
    localizeBlogHref('fr', '/blog/where-to-stay-in-tel-aviv-neighborhoods-guide'),
    '/fr/blog/where-to-stay-in-tel-aviv-neighborhoods-guide',
  );
});
