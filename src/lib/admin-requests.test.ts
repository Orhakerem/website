import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildAdminRequestStatusRow,
  buildEventRequestRow,
  buildEventRequestSummary,
  buildQuoteDraftFromAdminRequest,
  mapAdminCustomerRequests,
  type AdminRequestStatusRow,
  type EventRequestRow,
  type ReservationRequestRow,
} from './admin-requests';

test('buildEventRequestRow normalizes public event inquiry fields for admin storage', () => {
  const row = buildEventRequestRow({
    eventType: '  Birthday dinner ',
    checkIn: '2026-09-14',
    guestCount: ' 24 guests ',
    name: ' Sarah Cohen ',
    email: ' SARAH@example.com ',
    phone: ' 050-123-4567 ',
    contactMethod: 'whatsapp',
    message: ' Need catering and table setup. ',
  });

  assert.deepEqual(row, {
    event_type: 'Birthday dinner',
    event_date: '2026-09-14',
    guest_count_label: '24 guests',
    guest_name: 'Sarah Cohen',
    guest_email: 'sarah@example.com',
    guest_phone: '050-123-4567',
    contact_method: 'whatsapp',
    message: 'Need catering and table setup.',
  });
});

test('mapAdminCustomerRequests combines reservations and events with admin status overrides', () => {
  const reservations: ReservationRequestRow[] = [
    {
      id: 'reservation-1',
      listing_id: 'penthouse',
      check_in: '2026-08-12',
      check_out: '2026-08-15',
      nights: 3,
      guest_name: 'David Levi',
      guest_email: 'david@example.com',
      guest_phone: '0500000001',
      guests_count: 2,
      total_price: 4500,
      currency: 'ILS',
      status: 'pending',
      created_at: '2026-07-02T10:00:00.000Z',
    },
  ];
  const events: EventRequestRow[] = [
    {
      id: 'event-1',
      event_type: 'Sheva brachot',
      event_date: '2026-08-20',
      guest_count_label: '40',
      guest_name: 'Miriam Azulay',
      guest_email: 'miriam@example.com',
      guest_phone: '0500000002',
      contact_method: 'email',
      message: 'Dinner setup',
      created_at: '2026-07-03T11:00:00.000Z',
    },
  ];
  const statuses: AdminRequestStatusRow[] = [
    {
      source_type: 'reservation',
      source_id: 'reservation-1',
      status: 'quote_sent',
      note: 'Sent first quote',
      updated_at: '2026-07-04T12:00:00.000Z',
    },
  ];

  const requests = mapAdminCustomerRequests({ reservations, events, statuses });

  assert.deepEqual(
    requests.map((request) => ({
      sourceType: request.sourceType,
      sourceId: request.sourceId,
      status: request.status,
      title: request.title,
      guestName: request.guestName,
      dateLabel: request.dateLabel,
      amountLabel: request.amountLabel,
      quoteHref: request.quoteHref,
    })),
    [
      {
        sourceType: 'event_request',
        sourceId: 'event-1',
        status: 'new',
        title: 'Sheva brachot',
        guestName: 'Miriam Azulay',
        dateLabel: '2026-08-20',
        amountLabel: 'ILS 5,250',
        quoteHref: '/admin/devis?sourceType=event_request&sourceId=event-1',
      },
      {
        sourceType: 'reservation',
        sourceId: 'reservation-1',
        status: 'quote_sent',
        title: 'Luxury Penthouse',
        guestName: 'David Levi',
        dateLabel: '2026-08-12 - 2026-08-15',
        amountLabel: 'ILS 4,500',
        quoteHref: '/admin/devis?sourceType=reservation&sourceId=reservation-1',
      },
    ],
  );
});

test('buildEventRequestSummary prices event requests from the public event pricing catalog', () => {
  const request = buildEventRequestSummary({
    id: 'event-quote-1',
    event_type: 'Birthday dinner',
    event_date: '2026-09-03',
    guest_count_label: '24',
    guest_name: 'Sarah Cohen',
    guest_email: 'sarah@example.com',
    guest_phone: '050-123-4567',
    contact_method: 'email',
    message: 'Need catering and table setup.',
    created_at: '2026-07-03T11:00:00.000Z',
  });

  assert.equal(request.amountLabel, 'ILS 5,250');

  const quote = buildQuoteDraftFromAdminRequest(request, {
    todayIso: '2026-07-06',
  });

  assert.equal(quote.guestName, 'Sarah Cohen');
  assert.equal(quote.customerEmail, 'sarah@example.com');
  assert.equal(quote.checkInDate, '03 / 09 / 2026');
  assert.equal(quote.checkOutDate, '04 / 09 / 2026');
  assert.deepEqual(quote.lineItems, [
    { description: 'Birthday dinner event venue rental', unit: 'Venue Rental', amount: '4,500 ₪' },
    { description: 'Cleaning fee', unit: '-', amount: '750 ₪' },
  ]);
  assert.equal(quote.total, '5,250 ₪');
});

test('prices any event date at the same venue rate plus cleaning', () => {
  const request = buildEventRequestSummary({
    id: 'event-weekday-1',
    event_type: 'Private dinner',
    event_date: '2026-09-02',
    guest_count_label: '18',
    guest_name: 'Leah Cohen',
    guest_email: 'leah@example.com',
    guest_phone: '050-123-4567',
    contact_method: 'email',
    message: '',
    created_at: '2026-07-24T10:00:00.000Z',
  });

  assert.equal(request.amountLabel, 'ILS 5,250');

  const quote = buildQuoteDraftFromAdminRequest(request, {
    todayIso: '2026-07-24',
  });

  assert.deepEqual(quote.lineItems, [
    {
      description: 'Private dinner event venue rental',
      unit: 'Venue Rental',
      amount: '4,500 ₪',
    },
    { description: 'Cleaning fee', unit: '-', amount: '750 ₪' },
  ]);
  assert.equal(quote.total, '5,250 ₪');
});

test('buildQuoteDraftFromAdminRequest prefills the existing admin devis shape', () => {
  const [request] = mapAdminCustomerRequests({
    reservations: [
      {
        id: 'reservation-1',
        listing_id: 'studio',
        check_in: '2026-09-01',
        check_out: '2026-09-04',
        nights: 3,
        guest_name: 'Noa Ben David',
        guest_email: 'noa@example.com',
        guest_phone: '0500000003',
        guests_count: 2,
        total_price: 3600,
        currency: 'ILS',
        status: 'pending',
        created_at: '2026-07-02T10:00:00.000Z',
      },
    ],
    events: [],
    statuses: [],
  });

  const quote = buildQuoteDraftFromAdminRequest(request, {
    todayIso: '2026-07-06',
  });

  assert.equal(quote.guestName, 'Noa Ben David');
  assert.equal(quote.customerEmail, 'noa@example.com');
  assert.equal(quote.contact, '0500000003');
  assert.equal(quote.apartment, 'Studio');
  assert.equal(quote.travellers, '2 guests');
  assert.equal(quote.checkInDate, '01 / 09 / 2026');
  assert.equal(quote.checkOutDate, '04 / 09 / 2026');
  assert.deepEqual(quote.lineItems, [
    { description: 'Spacious & Cosy Apartment stay', unit: '3 nights', amount: '3,600 ₪' },
  ]);
  assert.equal(quote.total, '3,600 ₪');
});

test('buildAdminRequestStatusRow validates the tracked request status', () => {
  assert.deepEqual(
    buildAdminRequestStatusRow({
      sourceType: 'event_request',
      sourceId: 'event-1',
      status: 'in_progress',
      note: 'Waiting for catering details',
    }),
    {
      source_type: 'event_request',
      source_id: 'event-1',
      status: 'in_progress',
      note: 'Waiting for catering details',
    },
  );

  assert.throws(
    () =>
      buildAdminRequestStatusRow({
        sourceType: 'event_request',
        sourceId: 'event-1',
        status: 'paid' as never,
      }),
    /Invalid enum value/,
  );
});
