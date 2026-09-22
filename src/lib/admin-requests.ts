import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

import {
  calculateAdminQuote,
  formatIsoDateForAdmin,
} from './admin-quote-calculations';
import { getBookablePropertyIdFromListingId, getBookablePropertyTitle } from './bookable-properties';
import { addNights } from './booking-dates';
import { eventCleaningFee, getVenueRental } from './event-pricing-data';
import { DEFAULT_RESERVATION_QUOTE, type ReservationQuoteData } from './reservation-quote';
import {
  ADMIN_REQUEST_SOURCE_TYPES,
  ADMIN_REQUEST_STATUSES,
  type AdminRequestSourceInput,
  type AdminRequestSourceType,
  type AdminRequestStatus,
  type AdminRequestStatusInput,
} from './admin-request-status';
import type { EventData } from '../validation';

export { ADMIN_REQUEST_SOURCE_TYPES, ADMIN_REQUEST_STATUSES };
export type { AdminRequestSourceInput, AdminRequestSourceType, AdminRequestStatus, AdminRequestStatusInput };

export interface AdminRequestStatusRow {
  source_type: AdminRequestSourceType;
  source_id: string;
  status: AdminRequestStatus;
  note: string | null;
  updated_at?: string | null;
}

export interface ReservationRequestRow {
  id: string;
  listing_id: string;
  check_in: string;
  check_out: string;
  nights: number | string | null;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guests_count: number | string | null;
  total_price: number | string | null;
  currency: string | null;
  status: string | null;
  created_at: string | null;
}

export interface EventRequestRow {
  id: string;
  event_type: string;
  event_date: string;
  guest_count_label: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  contact_method: string;
  message: string | null;
  created_at: string | null;
}

export interface AdminCustomerRequestSummary {
  sourceType: AdminRequestSourceType;
  sourceId: string;
  kind: 'reservation' | 'event';
  status: AdminRequestStatus;
  statusNote: string;
  title: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  contactMethod: string;
  dateLabel: string;
  detailLabel: string;
  amountLabel: string;
  createdAt: string | null;
  quoteHref: string;
  reservation?: ReservationRequestRow;
  event?: EventRequestRow;
}

export interface AdminCustomerRequestsInput {
  reservations: readonly ReservationRequestRow[];
  events: readonly EventRequestRow[];
  statuses: readonly AdminRequestStatusRow[];
}

export interface AdminRequestQuoteDraft {
  request: AdminCustomerRequestSummary;
  quote: ReservationQuoteData;
  source: AdminRequestSourceInput;
}

const adminRequestSourceSchema = z.object({
  sourceType: z.enum(ADMIN_REQUEST_SOURCE_TYPES),
  sourceId: z.string().trim().min(1),
});

const adminRequestStatusInputSchema = adminRequestSourceSchema.extend({
  status: z.enum(ADMIN_REQUEST_STATUSES),
  note: z.string().trim().optional().default(''),
});

function trim(value: string | null | undefined) {
  return value?.trim() ?? '';
}

function normalizeEmail(value: string) {
  return trim(value).toLowerCase();
}

function toNumber(value: number | string | null | undefined) {
  const parsedValue = typeof value === 'string' ? Number(value) : value;

  return typeof parsedValue === 'number' && Number.isFinite(parsedValue) ? parsedValue : null;
}

function formatAmountLabel(currency: string | null | undefined, amount: number | string | null | undefined) {
  const parsedAmount = toNumber(amount);

  if (parsedAmount === null) {
    return 'Needs quote';
  }

  return `${trim(currency) || 'ILS'} ${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(parsedAmount)}`;
}

function formatShekelAmount(amount: number | string | null | undefined) {
  const parsedAmount = toNumber(amount);

  if (parsedAmount === null) {
    return '';
  }

  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(parsedAmount)} ₪`;
}

function getEventPriceBreakdown() {
  const rental = getVenueRental('en');
  const venuePrice = rental.price;
  const total = venuePrice + eventCleaningFee;

  return {
    rentalLabel: rental.label,
    venuePrice,
    cleaningFee: eventCleaningFee,
    total,
  };
}

function formatGuests(value: number | string | null | undefined) {
  const parsedValue = toNumber(value);

  if (!parsedValue) {
    return '';
  }

  return `${parsedValue} ${parsedValue === 1 ? 'guest' : 'guests'}`;
}

function getReservationTitle(row: ReservationRequestRow) {
  const propertyId = getBookablePropertyIdFromListingId(row.listing_id);

  return propertyId ? getBookablePropertyTitle(propertyId) : row.listing_id;
}

function getReservationAdminApartment(row: ReservationRequestRow) {
  const propertyId = getBookablePropertyIdFromListingId(row.listing_id);

  if (propertyId === 'cozy-studio') {
    return 'Studio';
  }

  return 'Penthouse';
}

function getStatusMap(statuses: readonly AdminRequestStatusRow[]) {
  return new Map(
    statuses.map((status) => [`${status.source_type}:${status.source_id}`, status]),
  );
}

function getStatusForSource(
  statusMap: Map<string, AdminRequestStatusRow>,
  sourceType: AdminRequestSourceType,
  sourceId: string,
) {
  return statusMap.get(`${sourceType}:${sourceId}`) ?? null;
}

function sanitizeStatus(value: string | null | undefined): AdminRequestStatus {
  return ADMIN_REQUEST_STATUSES.includes(value as AdminRequestStatus)
    ? value as AdminRequestStatus
    : 'new';
}

export function buildEventRequestRow(input: EventData) {
  return {
    event_type: trim(input.eventType),
    event_date: trim(input.checkIn),
    guest_count_label: trim(input.guestCount),
    guest_name: trim(input.name),
    guest_email: normalizeEmail(input.email),
    guest_phone: trim(input.phone),
    contact_method: trim(input.contactMethod),
    message: trim(input.message) || null,
  };
}

export function buildAdminRequestStatusRow(input: AdminRequestStatusInput) {
  const parsed = adminRequestStatusInputSchema.parse(input);

  return {
    source_type: parsed.sourceType,
    source_id: parsed.sourceId,
    status: parsed.status,
    note: parsed.note || null,
  };
}

export function normalizeAdminRequestSource(input: {
  sourceType?: string | null;
  sourceId?: string | null;
}): AdminRequestSourceInput | null {
  const parsed = adminRequestSourceSchema.safeParse({
    sourceType: input.sourceType,
    sourceId: input.sourceId,
  });

  return parsed.success ? parsed.data : null;
}

export function mapAdminCustomerRequests({
  reservations,
  events,
  statuses,
}: AdminCustomerRequestsInput): AdminCustomerRequestSummary[] {
  const statusMap = getStatusMap(statuses);
  const mappedReservations = reservations.map((reservation) =>
    buildReservationRequestSummary(
      reservation,
      getStatusForSource(statusMap, 'reservation', reservation.id),
    ),
  );
  const mappedEvents = events.map((event) =>
    buildEventRequestSummary(event, getStatusForSource(statusMap, 'event_request', event.id)),
  );

  return [...mappedReservations, ...mappedEvents].sort((left, right) =>
    String(right.createdAt ?? '').localeCompare(String(left.createdAt ?? '')),
  );
}

export function buildReservationRequestSummary(
  reservation: ReservationRequestRow,
  status: AdminRequestStatusRow | null = null,
): AdminCustomerRequestSummary {
  return {
    sourceType: 'reservation',
    sourceId: reservation.id,
    kind: 'reservation',
    status: status?.status ?? sanitizeStatus(reservation.status),
    statusNote: status?.note ?? '',
    title: getReservationTitle(reservation),
    guestName: trim(reservation.guest_name),
    guestEmail: normalizeEmail(reservation.guest_email),
    guestPhone: trim(reservation.guest_phone),
    contactMethod: '',
    dateLabel: `${reservation.check_in} - ${reservation.check_out}`,
    detailLabel: formatGuests(reservation.guests_count),
    amountLabel: formatAmountLabel(reservation.currency, reservation.total_price),
    createdAt: reservation.created_at,
    quoteHref: `/admin/devis?sourceType=reservation&sourceId=${reservation.id}`,
    reservation,
  };
}

export function buildEventRequestSummary(
  event: EventRequestRow,
  status: AdminRequestStatusRow | null = null,
): AdminCustomerRequestSummary {
  const price = getEventPriceBreakdown();

  return {
    sourceType: 'event_request',
    sourceId: event.id,
    kind: 'event',
    status: status?.status ?? 'new',
    statusNote: status?.note ?? '',
    title: trim(event.event_type),
    guestName: trim(event.guest_name),
    guestEmail: normalizeEmail(event.guest_email),
    guestPhone: trim(event.guest_phone),
    contactMethod: trim(event.contact_method),
    dateLabel: event.event_date,
    detailLabel: event.guest_count_label,
    amountLabel: `ILS ${new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(price.total)}`,
    createdAt: event.created_at,
    quoteHref: `/admin/devis?sourceType=event_request&sourceId=${event.id}`,
    event,
  };
}

export function buildQuoteDraftFromAdminRequest(
  request: AdminCustomerRequestSummary,
  options: { todayIso?: string } = {},
): ReservationQuoteData {
  const today = options.todayIso ? formatIsoDateForAdmin(options.todayIso) : '';
  const reservation = request.reservation;
  const event = request.event;
  const checkInIso = reservation?.check_in ?? event?.event_date ?? '';
  const checkOutIso = reservation?.check_out ?? (event?.event_date ? addNights(event.event_date, 1) : '');
  const totalAmount = reservation ? formatShekelAmount(reservation.total_price) : '';
  const title = reservation ? getReservationTitle(reservation) : request.title;
  const unit = reservation?.nights ? `${reservation.nights} ${Number(reservation.nights) === 1 ? 'night' : 'nights'}` : '';
  const eventPrice = event ? getEventPriceBreakdown() : null;

  return calculateAdminQuote({
    ...DEFAULT_RESERVATION_QUOTE,
    reservationNumber: `OH-${request.sourceId.slice(0, 8).toUpperCase()}`,
    issuedOn: today,
    guestName: request.guestName,
    contact: request.guestPhone,
    apartment: reservation ? getReservationAdminApartment(reservation) : 'Penthouse',
    travellers: reservation ? formatGuests(reservation.guests_count) : request.detailLabel,
    orderDate: today,
    checkInDate: checkInIso ? formatIsoDateForAdmin(checkInIso) : '',
    checkOutDate: checkOutIso ? formatIsoDateForAdmin(checkOutIso) : '',
    currency: 'NIS (₪)',
    lineItems: eventPrice
      ? [
          {
            description: `${title} event venue rental`,
            unit: eventPrice.rentalLabel,
            amount: formatShekelAmount(eventPrice.venuePrice),
          },
          {
            description: 'Cleaning fee',
            unit: '-',
            amount: formatShekelAmount(eventPrice.cleaningFee),
          },
        ]
      : [
          {
            description: `${title} stay`,
            unit,
            amount: totalAmount,
          },
        ],
    paymentMethod: '',
    depositPaid: '',
    paidOn: '',
    customerEmail: request.guestEmail,
  }) as ReservationQuoteData;
}

async function getAdminRequestsClient() {
  const { getSupabaseAdminClient } = await import('./supabase-admin');

  return getSupabaseAdminClient();
}

export async function saveEventRequest(input: EventData, client?: SupabaseClient) {
  const supabase = client ?? await getAdminRequestsClient();
  const row = buildEventRequestRow(input);
  const { data, error } = await supabase
    .from('event_requests')
    .insert(row)
    .select('id, event_type, event_date, guest_count_label, guest_name, guest_email, guest_phone, contact_method, message, created_at')
    .single();

  if (error) {
    throw new Error(`Failed to save event request: ${error.message}`);
  }

  return { request: data as EventRequestRow };
}

export async function fetchAdminCustomerRequests(client?: SupabaseClient) {
  const supabase = client ?? await getAdminRequestsClient();
  const [reservationsResult, eventsResult, statusesResult] = await Promise.all([
    supabase
      .from('reservations')
      .select('id, listing_id, check_in, check_out, nights, guest_name, guest_email, guest_phone, guests_count, total_price, currency, status, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('event_requests')
      .select('id, event_type, event_date, guest_count_label, guest_name, guest_email, guest_phone, contact_method, message, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('admin_request_statuses')
      .select('source_type, source_id, status, note, updated_at')
      .order('updated_at', { ascending: false }),
  ]);

  if (reservationsResult.error || eventsResult.error || statusesResult.error) {
    throw new Error(
      reservationsResult.error?.message ??
        eventsResult.error?.message ??
        statusesResult.error?.message ??
        'Admin requests unavailable',
    );
  }

  return mapAdminCustomerRequests({
    reservations: reservationsResult.data ?? [],
    events: eventsResult.data ?? [],
    statuses: statusesResult.data ?? [],
  });
}

export async function fetchAdminRequestQuoteDraft(
  source: AdminRequestSourceInput,
  client?: SupabaseClient,
): Promise<AdminRequestQuoteDraft | null> {
  const supabase = client ?? await getAdminRequestsClient();
  const { data: statusesData } = await supabase
    .from('admin_request_statuses')
    .select('source_type, source_id, status, note, updated_at')
    .eq('source_type', source.sourceType)
    .eq('source_id', source.sourceId);

  const tableName = source.sourceType === 'reservation' ? 'reservations' : 'event_requests';
  const columns =
    source.sourceType === 'reservation'
      ? 'id, listing_id, check_in, check_out, nights, guest_name, guest_email, guest_phone, guests_count, total_price, currency, status, created_at'
      : 'id, event_type, event_date, guest_count_label, guest_name, guest_email, guest_phone, contact_method, message, created_at';
  const { data, error } = await supabase
    .from(tableName)
    .select(columns)
    .eq('id', source.sourceId)
    .single();

  if (error || !data) {
    return null;
  }

  // Light runtime check of the fields the summaries below actually read, so a
  // schema drift fails loudly (the page shows the error) instead of rendering
  // a half-empty quote from a blind cast.
  const record = data as unknown as Record<string, unknown>;
  const requiredColumns =
    source.sourceType === 'reservation'
      ? ['id', 'check_in', 'check_out', 'guest_name', 'guest_email']
      : ['id', 'event_type', 'event_date', 'guest_name', 'guest_email'];
  const missingColumns = requiredColumns.filter((column) => record[column] == null);

  if (missingColumns.length > 0) {
    throw new Error(
      `Request row ${source.sourceType}:${source.sourceId} is missing expected columns: ${missingColumns.join(', ')}`,
    );
  }

  const [request] = mapAdminCustomerRequests({
    reservations: source.sourceType === 'reservation' ? [data as unknown as ReservationRequestRow] : [],
    events: source.sourceType === 'event_request' ? [data as unknown as EventRequestRow] : [],
    statuses: (statusesData ?? []) as AdminRequestStatusRow[],
  });

  return request
    ? {
        request,
        quote: buildQuoteDraftFromAdminRequest(request),
        source,
      }
    : null;
}

export async function saveAdminRequestStatus(input: AdminRequestStatusInput, client?: SupabaseClient) {
  const supabase = client ?? await getAdminRequestsClient();
  const row = buildAdminRequestStatusRow(input);
  const { error } = await supabase
    .from('admin_request_statuses')
    .upsert(row, { onConflict: 'source_type,source_id' });

  if (error) {
    throw new Error(`Failed to save admin request status: ${error.message}`);
  }

  return { status: row };
}

export async function markAdminRequestQuoteSent(
  source: AdminRequestSourceInput | null | undefined,
  client?: SupabaseClient,
) {
  if (!source) {
    return null;
  }

  return saveAdminRequestStatus(
    {
      ...source,
      status: 'quote_sent',
      note: 'Quote sent to customer.',
    },
    client,
  );
}
