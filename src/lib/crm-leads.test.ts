import assert from 'node:assert/strict';
import test from 'node:test';

import { buildCrmLeadBody, sendLeadToCrm, type CrmLead } from './crm-leads';

const RESERVATION: CrmLead = {
  kind: 'reservation',
  guestName: '  Dana   Levi ',
  guestEmail: 'dana@example.test',
  guestPhone: '+972 50 000 0000',
  contactMethod: 'WhatsApp',
  checkIn: '2027-03-10',
  checkOut: '2027-03-14',
  guestsCount: 2,
  siteListingId: 'penthouse',
  totalPrice: 4200,
  currency: 'ils',
  externalRef: 'reservation:11111111-1111-4111-8111-111111111111',
};

test('buildCrmLeadBody: reservation — brand, cleaned values, known keys only', () => {
  assert.deepEqual(buildCrmLeadBody(RESERVATION), {
    brand: 'orhakerem',
    kind: 'reservation',
    guestName: 'Dana Levi',
    guestEmail: 'dana@example.test',
    guestPhone: '+972 50 000 0000',
    contactMethod: 'whatsapp',
    checkIn: '2027-03-10',
    checkOut: '2027-03-14',
    guestsCount: 2,
    siteListingId: 'penthouse',
    totalPrice: 4200,
    currency: 'ILS',
    externalRef: 'reservation:11111111-1111-4111-8111-111111111111',
  });
});

test('buildCrmLeadBody: event — empty and invalid values are left out, long ones cut', () => {
  const body = buildCrmLeadBody({
    kind: 'event',
    guestName: 'Noa',
    guestEmail: '',
    guestPhone: null,
    contactMethod: 'carrier pigeon',
    message: `  first line\nsecond line  ${'x'.repeat(6000)}`,
    eventType: 'Birthday',
    eventDate: '10/03/2027',
    checkIn: undefined,
    guestsCount: 2.5,
    guestCountLabel: '20-30 guests',
    totalPrice: Number.NaN,
    currency: 'shekels',
  });
  assert.deepEqual(Object.keys(body).sort(), ['brand', 'eventType', 'guestCountLabel', 'guestName', 'kind', 'message']);
  assert.equal((body.message as string).length, 5000);
  assert.match(body.message as string, /^first line\nsecond line/);
});

test('sendLeadToCrm: no key → skipped without any request', async () => {
  let called = false;
  const result = await sendLeadToCrm(RESERVATION, {
    env: {},
    fetchImpl: async () => {
      called = true;
      return new Response('{}');
    },
  });
  assert.deepEqual(result, { sent: false, reason: 'not_configured' });
  assert.equal(called, false);
});

test('sendLeadToCrm: posts the body with the bearer key to the CRM', async () => {
  const calls: { url: string; init: RequestInit }[] = [];
  const result = await sendLeadToCrm(RESERVATION, {
    env: { CRM_LEADS_API_KEY: ' crm_test_key ', CRM_API_URL: 'https://crm.example.test/' },
    fetchImpl: async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return new Response('{"data":{}}', { status: 201 });
    },
  });
  assert.deepEqual(result, { sent: true, status: 201 });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://crm.example.test/api/v1/leads');
  assert.equal(calls[0].init.method, 'POST');
  assert.equal((calls[0].init.headers as Record<string, string>).authorization, 'Bearer crm_test_key');
  assert.deepEqual(JSON.parse(String(calls[0].init.body)), buildCrmLeadBody(RESERVATION));

  const defaults = await sendLeadToCrm(RESERVATION, {
    env: { CRM_LEADS_API_KEY: 'k' },
    fetchImpl: async (url) => {
      calls.push({ url: String(url), init: {} });
      return new Response('{}', { status: 200 });
    },
  });
  assert.deepEqual(defaults, { sent: true, status: 200 });
  assert.equal(calls[1].url, 'https://admin.45beach.com/api/v1/leads');
});

test('sendLeadToCrm: a refusal or an outage never throws', async () => {
  const env = { CRM_LEADS_API_KEY: 'k' };
  const original = console.error;
  const logged: string[] = [];
  console.error = (...args: unknown[]) => {
    logged.push(args.map(String).join(' '));
  };
  try {
    assert.deepEqual(await sendLeadToCrm(RESERVATION, { env, fetchImpl: async () => new Response('{}', { status: 403 }) }), {
      sent: false,
      reason: 'http_403',
    });
    assert.deepEqual(
      await sendLeadToCrm(RESERVATION, {
        env,
        fetchImpl: async () => {
          throw new TypeError('fetch failed');
        },
      }),
      { sent: false, reason: 'network' },
    );
  } finally {
    console.error = original;
  }
  assert.equal(logged.length, 2);
  for (const line of logged) {
    assert.ok(!line.includes('dana@example.test') && !line.includes('Dana'), 'logs carry no visitor data');
  }
});
