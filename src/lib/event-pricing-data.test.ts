import assert from 'node:assert/strict';
import test from 'node:test';

import { LOCALES } from '@/i18n/config';

import {
  eventCleaningFee,
  eventVenueRentalPrice,
  getVenueRental,
} from './event-pricing-data';

test('exposes a single venue price in every locale', () => {
  assert.equal(eventVenueRentalPrice, 4500);

  const cleaningSuffixByLocale = {
    en: '+ cleaning fee',
    fr: '+ frais de ménage',
    he: '+ דמי ניקיון',
  } as const;

  for (const locale of LOCALES) {
    const rental = getVenueRental(locale);

    assert.equal(rental.id, 'venue');
    assert.equal(rental.price, 4500);
    assert.equal(rental.priceSuffix, cleaningSuffixByLocale[locale]);
    assert.ok(rental.label.length > 0);
  }
});

test('keeps cleaning as a separate fee on top of the venue price', () => {
  assert.equal(eventCleaningFee, 750);
  assert.equal(eventVenueRentalPrice + eventCleaningFee, 5250);
});
