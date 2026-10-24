import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();

function source(filePath: string) {
  return readFileSync(join(root, filePath), 'utf8');
}

const layout = source('src/app/[locale]/layout.tsx');
const cookieConsent = source('src/components/CookieConsent.tsx');
const metaPixel = source('src/components/MetaPixel.tsx');
const metaEvents = source('src/lib/meta-events.ts');
const envExample = source('.env.example');
const commonMessages = source('src/i18n/messages/common.ts');

test('Meta Pixel is not installed directly in the public layout', () => {
  assert.match(layout, /<CookieConsent\s*\/>/);
  assert.doesNotMatch(layout, /\bMetaPixel\b/);
  assert.doesNotMatch(layout, /\bfbq\b/);
  assert.doesNotMatch(layout, /fbevents\.js/);
  assert.doesNotMatch(layout, /facebook\.com\/tr/);
});

test('analytics and marketing trackers mount independently', () => {
  assert.match(
    cookieConsent,
    /\{\s*preferences\.analytics\s*&&\s*<GoogleAnalytics\s*\/>\s*\}/,
  );
  assert.match(
    cookieConsent,
    /\{\s*preferences\.marketing\s*&&\s*<MetaPixel\s*\/>\s*\}/,
  );
  assert.doesNotMatch(
    cookieConsent,
    /preferences\.analytics\s*&&\s*preferences\.marketing\s*&&/,
  );
});

test('Meta Pixel uses the configured public ID and expected fallback', () => {
  assert.match(metaPixel, /process\.env\.NEXT_PUBLIC_META_PIXEL_ID/);
  assert.match(metaPixel, /4487337044917960/);
  assert.match(envExample, /^NEXT_PUBLIC_META_PIXEL_ID=4487337044917960$/m);
});

test('there is no noscript or tracking-image consent bypass', () => {
  for (const [name, text] of [
    ['layout', layout],
    ['CookieConsent', cookieConsent],
    ['MetaPixel', metaPixel],
  ] as const) {
    assert.doesNotMatch(text, /<noscript\b/i, `${name} contains noscript`);
    assert.doesNotMatch(
      text,
      /facebook\.com\/tr/i,
      `${name} contains the Meta tracking-image endpoint`,
    );
  }
});

test('each Pixel ID is initialized once', () => {
  const guard = metaPixel.indexOf('__orHakeremMetaPixelIds.includes(pixelId)');
  const initialize = metaPixel.indexOf("window.fbq('init', pixelId)");
  const remember = metaPixel.indexOf('__orHakeremMetaPixelIds.push(pixelId)');

  assert.ok(guard >= 0 && guard < initialize);
  assert.ok(initialize < remember);
});

test('one guarded PageView command is emitted by the Meta component', () => {
  const pageViewCommands =
    metaPixel.match(/fbq\?\.\('track', 'PageView'\)/g) ?? [];

  assert.equal(pageViewCommands.length, 1);

  const guard = metaPixel.indexOf(
    'if (window.__orHakeremMetaLastPageView === route)',
  );
  const track = metaPixel.indexOf("window.fbq?.('track', 'PageView')");
  const remember = metaPixel.indexOf(
    'window.__orHakeremMetaLastPageView = route',
  );

  assert.ok(guard >= 0 && guard < track);
  assert.ok(track < remember);
});

test('withdrawing marketing consent revokes Meta and clears its browser identifiers', () => {
  assert.match(cookieConsent, /setMetaMarketingConsent\(false\)/);
  assert.match(
    metaEvents,
    /window\.fbq\('consent', granted \? 'grant' : 'revoke'\)/,
  );
  assert.match(cookieConsent, /name === '_fbp'/);
  assert.match(cookieConsent, /name === '_fbc'/);
  assert.match(cookieConsent, /delete window\.__orHakeremMetaLastPageView/);
});

test('all locales provide accept, reject, and granular controls', () => {
  for (const key of [
    'rejectAll',
    'customize',
    'acceptAll',
    'bodyShortBeforeLink',
    'bodyShortAfterLink',
    'analyticsTitle',
    'marketingTitle',
    'back',
    'save',
    'close',
  ]) {
    assert.equal(
      (commonMessages.match(new RegExp(`\\b${key}:`, 'g')) ?? []).length,
      3,
      `${key} must exist in English, French, and Hebrew`,
    );
  }
});

const jointControllerCopy = {
  en: /joint controllers/,
  fr: /responsables conjoints/,
  he: /אחראיות משותפות/,
} as const;

for (const locale of ['en', 'fr', 'he'] as const) {
  test(`the ${locale} policy documents Meta and preference withdrawal`, () => {
    const policy = source(`src/app/[locale]/privacy/content/${locale}.tsx`);

    assert.match(policy, /Meta(?: Pixel| Platforms)|Pixel Meta/);
    assert.match(policy, jointControllerCopy[locale]);
    assert.match(policy, /facebook\.com\/legal\/terms\/businesstools/);
    assert.match(policy, /OPEN_CONSENT_SETTINGS_EVENT/);
    assert.match(policy, /window\.dispatchEvent/);
    assert.match(policy, /Google Analytics/);
  });
}

test('all localized policy headers use the new date', () => {
  const page = source('src/app/[locale]/privacy/page.tsx');

  assert.match(page, /Last updated: 23 July 2026/);
  assert.match(page, /Dernière mise à jour : 23 juillet 2026/);
  assert.match(page, /עדכון אחרון: 23 ביולי 2026/);
});
