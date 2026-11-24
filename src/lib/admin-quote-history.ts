import type { SupabaseClient } from '@supabase/supabase-js';

import {
  parseAdminDateToIso,
  parseCurrencyAmount,
} from './admin-quote-calculations';
import { reservationQuoteSchema, type ReservationQuoteData } from './reservation-quote';

export interface AdminQuoteHistorySummary {
  id: string;
  reservationNumber: string;
  guestName: string;
  customerEmail: string;
  apartment: string;
  checkIn: string | null;
  checkOut: string | null;
  nights: number | null;
  totalLabel: string;
  sentAt: string | null;
}

export interface AdminDashboardSummary {
  recentQuotes: AdminQuoteHistorySummary[];
  unavailableReason?: string;
}

export interface AdminQuoteHistoryRow {
  reservation_number: string;
  customer_email: string;
  guest_name: string;
  apartment: string;
  check_in: string | null;
  check_out: string | null;
  nights: number | null;
  total_amount: number;
  total_label: string;
  currency_label: string;
  resend_email_id: string | null;
  send_status: 'sent';
  quote_status: 'sent';
  source_type: 'reservation' | 'event_request' | null;
  source_id: string | null;
  expires_at: string | null;
  sent_at: string;
  quote_payload: ReservationQuoteData;
}

export interface SaveAdminQuoteHistoryInput {
  quote: ReservationQuoteData;
  resendEmailId?: string | null;
  source?: {
    sourceType: 'reservation' | 'event_request';
    sourceId: string;
  } | null;
  expiresAt?: string | null;
}

export type AdminQuoteHistoryStoredRow = AdminQuoteHistoryRow & {
  id?: string;
  created_at?: string;
};

interface SupabaseWriteResult {
  data: Record<string, unknown> | null;
  error: { message: string } | null;
}

interface SupabaseWriteBuilder {
  select(columns?: string): SupabaseWriteBuilder;
  single(): Promise<SupabaseWriteResult>;
}

interface SupabaseTableClient {
  insert(row: object): SupabaseWriteBuilder;
}

export interface AdminQuoteHistorySupabaseClient {
  from(tableName: string): SupabaseTableClient;
}

interface QuoteHistoryRow {
  id: string;
  reservation_number: string;
  guest_name: string;
  customer_email: string;
  apartment: string;
  check_in: string | null;
  check_out: string | null;
  nights: number | string | null;
  total_label: string | null;
  sent_at: string | null;
}

function toNullableInteger(value: number | string | null) {
  if (value === null || value === '') {
    return null;
  }

  const normalizedValue = typeof value === 'string' ? Number(value) : value;

  return Number.isFinite(normalizedValue) ? Math.trunc(normalizedValue) : 0;
}

function parsePositiveInteger(value: string) {
  const parsedValue = Number(value.trim());

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function mapQuoteHistory(row: QuoteHistoryRow): AdminQuoteHistorySummary {
  return {
    id: row.id,
    reservationNumber: row.reservation_number,
    guestName: row.guest_name,
    customerEmail: row.customer_email,
    apartment: row.apartment,
    checkIn: row.check_in,
    checkOut: row.check_out,
    nights: toNullableInteger(row.nights),
    totalLabel: row.total_label ?? '',
    sentAt: row.sent_at,
  };
}

async function getSupabaseClient() {
  const { supabase } = await import('./supabase');

  return supabase;
}

async function getSupabaseAdminWriteClient() {
  const { getSupabaseAdminClient } = await import('./supabase-admin');

  return getSupabaseAdminClient() as unknown as AdminQuoteHistorySupabaseClient;
}

export async function fetchAdminDashboardSummary(
  client?: SupabaseClient,
): Promise<AdminDashboardSummary> {
  try {
    const supabase = client ?? await getSupabaseClient();
    const quotesResult = await supabase
      .from('admin_quote_history')
      .select('id, reservation_number, guest_name, customer_email, apartment, check_in, check_out, nights, total_label, sent_at')
      .eq('send_status', 'sent')
      .order('sent_at', { ascending: false });

    if (quotesResult.error) {
      throw new Error(quotesResult.error.message);
    }

    return {
      recentQuotes: (quotesResult.data ?? []).map((row) => mapQuoteHistory(row as QuoteHistoryRow)),
    };
  } catch (error) {
    return {
      recentQuotes: [],
      unavailableReason: error instanceof Error ? error.message : 'Dashboard data unavailable',
    };
  }
}

export function buildAdminQuoteHistoryRow(input: SaveAdminQuoteHistoryInput): AdminQuoteHistoryRow {
  const { quote, resendEmailId } = input;
  const parsedQuote = reservationQuoteSchema.parse(quote);

  return {
    reservation_number: parsedQuote.reservationNumber.trim(),
    customer_email: parsedQuote.customerEmail.trim(),
    guest_name: parsedQuote.guestName.trim(),
    apartment: parsedQuote.apartment,
    check_in: parseAdminDateToIso(parsedQuote.checkInDate),
    check_out: parseAdminDateToIso(parsedQuote.checkOutDate),
    nights: parsePositiveInteger(parsedQuote.nights),
    total_amount: parseCurrencyAmount(parsedQuote.total),
    total_label: parsedQuote.total,
    currency_label: parsedQuote.currency.trim() || 'NIS',
    resend_email_id: resendEmailId?.trim() || null,
    send_status: 'sent',
    quote_status: 'sent',
    source_type: input.source?.sourceType ?? null,
    source_id: input.source?.sourceId ?? null,
    expires_at: input.expiresAt?.trim() || null,
    sent_at: new Date().toISOString(),
    quote_payload: parsedQuote,
  };
}

export async function saveAdminQuoteHistoryEntry(
  input: SaveAdminQuoteHistoryInput,
  client?: AdminQuoteHistorySupabaseClient,
) {
  const supabase = client ?? await getSupabaseAdminWriteClient();
  const row = buildAdminQuoteHistoryRow(input);
  const { data, error } = await supabase
    .from('admin_quote_history')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to save admin quote history: ${error.message}`);
  }

  return {
    history: (data ?? row) as unknown as AdminQuoteHistoryStoredRow,
  };
}
