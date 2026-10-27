import assert from 'node:assert/strict';
import test from 'node:test';

import { SITE_URL } from '../app/seo';
import {
  BUSINESS_HOURS,
  BUSINESS_NAME,
  BUSINESS_NAP,
  GOOGLE_BUSINESS_PROFILE_URL,
  getBusinessStructuredData,
} from '../lib/business-schema';

test('shared business schema uses the verified Google profile and canonical NAP', () => {
  for (const locale of ['en', 'fr', 'he'] as const) {
    const schema = getBusinessStructuredData(locale, 'A localized description.');

    assert.equal(schema.name, BUSINESS_NAME);
    assert.equal(schema['@id'], `${SITE_URL}/#business`);
    assert.equal(schema.url, SITE_URL);
    assert.equal(schema.inLanguage, locale);
    assert.equal(schema.telephone, BUSINESS_NAP.telephone);
    assert.equal(schema.address.streetAddress, '35 HaKovshim St');
    assert.equal(schema.address.addressLocality, 'Tel Aviv-Yafo');
    assert.equal(schema.address.postalCode, '6329302');
    assert.ok(schema.sameAs.includes(GOOGLE_BUSINESS_PROFILE_URL));
  }

  assert.equal(BUSINESS_NAME, 'Or Hakerem');
  assert.equal(GOOGLE_BUSINESS_PROFILE_URL, 'https://www.google.com/maps?cid=11119085925362597877');
});

test('business schema declares the reception hours Google needs', () => {
  const schema = getBusinessStructuredData('en', 'A localized description.');
  const spec = schema.openingHoursSpecification;

  assert.equal(spec.length, BUSINESS_HOURS.length);
  for (const slot of spec) {
    assert.equal(slot['@type'], 'OpeningHoursSpecification');
    assert.ok(slot.dayOfWeek.length > 0);
    for (const day of slot.dayOfWeek) {
      assert.match(day, /^https:\/\/schema\.org\/[A-Z][a-z]+$/);
    }
  }

  // Every day of the week is accounted for exactly once: a missing day reads as
  // "hours unknown", which is what we are fixing.
  const days = spec.flatMap((slot) => slot.dayOfWeek);
  assert.equal(days.length, 7);
  assert.equal(new Set(days).size, 7);

  const sundayToThursday = spec.find((slot) => slot.dayOfWeek.length === 5);
  assert.ok(sundayToThursday);
  assert.equal(sundayToThursday.opens, '08:00');
  assert.equal(sundayToThursday.closes, '19:00');

  const friday = spec.find((slot) => slot.dayOfWeek.includes('https://schema.org/Friday'));
  assert.ok(friday);
  assert.equal(friday.closes, '12:00');

  // Shabbat: opens === closes is how a closed day is expressed.
  const saturday = spec.find((slot) => slot.dayOfWeek.includes('https://schema.org/Saturday'));
  assert.ok(saturday);
  assert.equal(saturday.opens, saturday.closes);
});

test('business schema declares every phone number the site makes clickable', () => {
  const schema = getBusinessStructuredData('en', 'A localized description.');
  const declared = schema.contactPoint.map((point) => point.telephone);

  // The contact page and the footer both expose these two as tel: links, so a
  // caller must never reach a number the structured data does not declare.
  assert.ok(declared.includes(BUSINESS_NAP.telephone));
  assert.ok(declared.includes(BUSINESS_NAP.telephoneFr));
  assert.equal(schema.telephone, BUSINESS_NAP.telephone);
});
