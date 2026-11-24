import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildAdminQuoteHistoryRow,
  saveAdminQuoteHistoryEntry,
  type AdminQuoteHistoryRow,
} from './admin-quote-history';
import { DEFAULT_RESERVATION_QUOTE } from './reservation-quote';

test('buildAdminQuoteHistoryRow stores searchable fields and the full quote payload', () => {
  const row = buildAdminQuoteHistoryRow({
    quote: {
      ...DEFAULT_RESERVATION_QUOTE,
      reservationNumber: 'OH-2026-ADA',
      guestName: 'Ada Lovelace',
      customerEmail: 'ada@example.com',
      apartment: 'Penthouse + Studio',
      checkInDate: '03 / 09 / 2026',
      checkOutDate: '06 / 09 / 2026',
      nights: '3',
      total: '4,250 ₪',
      currency: 'NIS (₪)',
    },
    resendEmailId: 'email_123',
    source: {
      sourceType: 'reservation',
      sourceId: 'reservation-1',
    },
  });

  assert.deepEqual(row, {
    reservation_number: 'OH-2026-ADA',
    customer_email: 'ada@example.com',
    guest_name: 'Ada Lovelace',
    apartment: 'Penthouse + Studio',
    check_in: '2026-09-03',
    check_out: '2026-09-06',
    nights: 3,
    total_amount: 4250,
    total_label: '4,250 ₪',
    currency_label: 'NIS (₪)',
    resend_email_id: 'email_123',
    send_status: 'sent',
    quote_status: 'sent',
    source_type: 'reservation',
    source_id: 'reservation-1',
    expires_at: null,
    sent_at: row.sent_at,
    quote_payload: row.quote_payload,
  } satisfies AdminQuoteHistoryRow);
  assert.match(row.sent_at, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(row.quote_payload.reservationNumber, 'OH-2026-ADA');
});

test('saveAdminQuoteHistoryEntry inserts the history row through Supabase admin', async () => {
  const { client, insertedRows } = createMockSupabase();

  const result = await saveAdminQuoteHistoryEntry(
    {
      quote: {
        ...DEFAULT_RESERVATION_QUOTE,
        reservationNumber: 'OH-2026-HISTORY',
        guestName: 'History User',
        customerEmail: 'history@example.com',
      },
      resendEmailId: 'email_history',
    },
    client,
  );

  assert.equal(insertedRows.admin_quote_history?.length, 1);
  assert.equal(
    insertedRows.admin_quote_history?.[0]?.reservation_number,
    'OH-2026-HISTORY',
  );
  assert.equal(result.history.customer_email, 'history@example.com');
});

type TableRows = Record<string, Array<Record<string, unknown>>>;

class MockSupabaseQuery {
  constructor(
    private readonly tableName: string,
    private readonly insertedRows: TableRows,
    private resultRow: Record<string, unknown> | null = null,
  ) {}

  select() {
    return this;
  }

  single() {
    return Promise.resolve({
      data: this.resultRow,
      error: null,
    });
  }

  insert(row: Record<string, unknown>) {
    this.insertedRows[this.tableName] = this.insertedRows[this.tableName] ?? [];
    this.insertedRows[this.tableName].push(row);
    this.resultRow = row;

    return this;
  }
}

function createMockSupabase() {
  const insertedRows: TableRows = {};

  return {
    insertedRows,
    client: {
      from(tableName: string) {
        return new MockSupabaseQuery(tableName, insertedRows);
      },
    },
  };
}
