import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

import {
  parseAdminDateToIso,
  parseCurrencyAmount,
} from './admin-quote-calculations';
import { compareIsoDates, isIsoDateString } from './booking-dates';
import { BOOKABLE_PROPERTIES } from './bookable-properties';
import type { PricingAdjustmentRuleType } from './pricing-adjustments';
import { reservationQuoteSchema, type ReservationQuoteData } from './reservation-quote';
import type { PricingDayType } from './pricing-engine';
import { BASE_SEASON_TYPES, SEASON_TYPES, type SeasonType } from './pricing-seasons';

export const ADMIN_PRICING_RULE_TYPES = [
  'last_minute',
  'early_booking',
  'duration',
] as const satisfies readonly PricingAdjustmentRuleType[];

export interface AdminPricingTierSnapshot {
  id: number;
  listingId: string;
  seasonType: SeasonType;
  dayType: PricingDayType;
  minNights: number;
  maxNights: number | null;
  targetPrice: number;
  isActive: boolean;
  priority: number;
}

export interface AdminPricingListingSnapshot {
  listingId: string;
  title: string;
  name: string;
  basePrice: number;
  cleaningFee: number;
  currency: string;
  isActive: boolean;
  tiers: AdminPricingTierSnapshot[];
}

export interface AdminSeasonPeriodSnapshot {
  id: number;
  name: string;
  seasonType: SeasonType;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface AdminSeasonDateOverrideSnapshot {
  id: number;
  date: string;
  seasonType: SeasonType;
  note: string;
  isActive: boolean;
}

export interface AdminPricingRuleSnapshot {
  id: string;
  listingId: string | null;
  name: string;
  ruleType: PricingAdjustmentRuleType;
  isActive: boolean;
  priority: number;
  adjustmentBasisPoints: number;
  minDaysBeforeCheckIn: number | null;
  maxDaysBeforeCheckIn: number | null;
  minNights: number | null;
  maxNights: number | null;
  seasonType: SeasonType | null;
  dayType: PricingDayType | null;
  startsOn: string | null;
  endsOn: string | null;
  notes?: string | null;
}

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

export interface AdminPricingSnapshot {
  listings: AdminPricingListingSnapshot[];
  seasonPeriods: AdminSeasonPeriodSnapshot[];
  specialDates: AdminSeasonDateOverrideSnapshot[];
  adjustmentRules: AdminPricingRuleSnapshot[];
}

export interface AdminDashboardSummary {
  recentQuotes: AdminQuoteHistorySummary[];
  activeSeasonCount: number;
  specialDateCount: number;
  activeAdjustmentRuleCount: number;
  pricingTierCount: number;
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

export interface PricingAdjustmentRuleUpsertRow {
  id?: string;
  listing_id: string | null;
  name: string;
  rule_type: PricingAdjustmentRuleType;
  is_active: boolean;
  priority: number;
  adjustment_basis_points: number;
  min_days_before_check_in: number | null;
  max_days_before_check_in: number | null;
  min_nights: number | null;
  max_nights: number | null;
  season_type: SeasonType | null;
  day_type: PricingDayType | null;
  starts_on: string | null;
  ends_on: string | null;
  notes: string | null;
}

export type PricingAdjustmentRuleInput = AdminPricingRuleInput;
export type PricingAdjustmentRuleStoredRow = PricingAdjustmentRuleUpsertRow & {
  id: string;
  created_at?: string;
  updated_at?: string;
};
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
  upsert(row: object): SupabaseWriteBuilder;
}

export interface AdminPricingSupabaseClient {
  from(tableName: string): SupabaseTableClient;
}

const DAY_TYPES = ['weekday', 'weekend'] as const;
const LISTING_IDS = Object.values(BOOKABLE_PROPERTIES).map((property) => property.listingId);
const LISTING_ID_SET = new Set<string>(LISTING_IDS);

const optionalIntegerSchema = z.preprocess(
  (value) => (value === '' || value === undefined ? null : value),
  z.coerce.number().int().nullable(),
);

const optionalIsoDateSchema = z.preprocess(
  (value) =>
    value === undefined || (typeof value === 'string' && value.trim() === '')
      ? null
      : value,
  z
    .string()
    .refine((value) => isIsoDateString(value), 'Expected YYYY-MM-DD date')
    .nullable(),
);

const nullableListingIdSchema = z.preprocess(
  (value) =>
    value === undefined || (typeof value === 'string' && value.trim() === '')
      ? null
      : value,
  z
    .string()
    .refine((value) => LISTING_ID_SET.has(value), 'Unknown listing')
    .nullable(),
);

const seasonTypeSchema = z.enum(SEASON_TYPES);
const dayTypeSchema = z.enum(DAY_TYPES);
const nullableSeasonTypeSchema = z.preprocess(
  (value) =>
    value === undefined || (typeof value === 'string' && value.trim() === '')
      ? null
      : value,
  seasonTypeSchema.nullable(),
);
const nullableDayTypeSchema = z.preprocess(
  (value) =>
    value === undefined || (typeof value === 'string' && value.trim() === '')
      ? null
      : value,
  dayTypeSchema.nullable(),
);

export const adminListingInputSchema = z.object({
  listingId: z.string().refine((value) => LISTING_ID_SET.has(value), 'Unknown listing'),
  basePrice: z.coerce.number().min(0),
  cleaningFee: z.coerce.number().min(0),
  currency: z.string().trim().min(1).max(8),
  isActive: z.boolean(),
});

export const adminPricingTierInputSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    listingId: z.string().refine((value) => LISTING_ID_SET.has(value), 'Unknown listing'),
    seasonType: seasonTypeSchema,
    dayType: dayTypeSchema,
    minNights: z.coerce.number().int().min(0),
    maxNights: optionalIntegerSchema.refine(
      (value) => value === null || value >= 0,
      'Must be non-negative',
    ),
    targetPrice: z.coerce.number().min(0),
    isActive: z.boolean().default(true),
    priority: z.coerce.number().int().min(0).default(0),
  })
  .superRefine((value, ctx) => {
    if (value.maxNights !== null && value.maxNights < value.minNights) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxNights'],
        message: 'Max nights must be greater than or equal to min nights',
      });
    }
  });

export const adminSeasonPeriodInputSchema = z
  .object({
    id: z.coerce.number().int().positive().optional(),
    name: z.string().trim().min(1),
    seasonType: seasonTypeSchema,
    startDate: z.string().refine((value) => isIsoDateString(value), 'Expected YYYY-MM-DD date'),
    endDate: z.string().refine((value) => isIsoDateString(value), 'Expected YYYY-MM-DD date'),
    isActive: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (compareIsoDates(value.endDate, value.startDate) < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'End date must be on or after start date',
      });
    }
  });

export const adminSeasonDateOverrideInputSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  date: z.string().refine((value) => isIsoDateString(value), 'Expected YYYY-MM-DD date'),
  seasonType: seasonTypeSchema,
  note: z.string().trim().optional().default(''),
  isActive: z.boolean(),
});

export const adminPricingRuleInputSchema = z
  .object({
    id: z.string().uuid().optional(),
    listingId: nullableListingIdSchema,
    name: z.string().trim().min(1),
    ruleType: z.enum(ADMIN_PRICING_RULE_TYPES),
    isActive: z.boolean().default(true),
    priority: z.coerce.number().int().min(0).default(0),
    adjustmentBasisPoints: z.coerce.number().int().min(-9900).max(100000),
    minDaysBeforeCheckIn: optionalIntegerSchema.refine(
      (value) => value === null || value >= 0,
      'Must be non-negative',
    ),
    maxDaysBeforeCheckIn: optionalIntegerSchema.refine(
      (value) => value === null || value >= 0,
      'Must be non-negative',
    ),
    minNights: optionalIntegerSchema.refine(
      (value) => value === null || value >= 0,
      'Must be non-negative',
    ),
    maxNights: optionalIntegerSchema.refine(
      (value) => value === null || value >= 0,
      'Must be non-negative',
    ),
    seasonType: nullableSeasonTypeSchema,
    dayType: nullableDayTypeSchema,
    startsOn: optionalIsoDateSchema,
    endsOn: optionalIsoDateSchema,
    notes: z.string().trim().nullable().optional().default(null),
  })
  .superRefine((value, ctx) => {
    if (
      value.minDaysBeforeCheckIn !== null &&
      value.maxDaysBeforeCheckIn !== null &&
      value.maxDaysBeforeCheckIn < value.minDaysBeforeCheckIn
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxDaysBeforeCheckIn'],
        message: 'Max days must be greater than or equal to min days',
      });
    }

    if (
      value.minNights !== null &&
      value.maxNights !== null &&
      value.maxNights < value.minNights
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxNights'],
        message: 'Max nights must be greater than or equal to min nights',
      });
    }

    if (value.startsOn && value.endsOn && compareIsoDates(value.endsOn, value.startsOn) < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endsOn'],
        message: 'End date must be on or after start date',
      });
    }
  });

export type AdminListingInput = z.input<typeof adminListingInputSchema>;
export type AdminPricingTierInput = z.input<typeof adminPricingTierInputSchema>;
export type AdminSeasonPeriodInput = z.input<typeof adminSeasonPeriodInputSchema>;
export type AdminSeasonDateOverrideInput = z.input<typeof adminSeasonDateOverrideInputSchema>;
export type AdminPricingRuleInput = z.input<typeof adminPricingRuleInputSchema>;
type ParsedAdminPricingTier = z.output<typeof adminPricingTierInputSchema>;

interface ListingRow {
  id: string;
  name: string | null;
  base_price: number | string | null;
  cleaning_fee: number | string | null;
  currency: string | null;
  is_active: boolean | null;
}

interface PricingTierRow {
  id: number | string;
  listing_id: string;
  season_type: SeasonType;
  day_type: PricingDayType;
  min_nights: number | string;
  max_nights: number | string | null;
  target_price: number | string;
  is_active: boolean | null;
  priority: number | string | null;
}

interface SeasonPeriodRow {
  id: number | string;
  name: string | null;
  season_type: SeasonType;
  start_date: string;
  end_date: string;
  is_active: boolean | null;
}

interface SeasonDateOverrideRow {
  id: number | string;
  date: string;
  season_type: SeasonType;
  note: string | null;
  is_active: boolean | null;
}

interface PricingRuleRow {
  id: string;
  listing_id: string | null;
  name: string | null;
  rule_type: PricingAdjustmentRuleType;
  is_active: boolean | null;
  priority: number | string | null;
  adjustment_basis_points: number | string;
  min_days_before_check_in: number | string | null;
  max_days_before_check_in: number | string | null;
  min_nights: number | string | null;
  max_nights: number | string | null;
  season_type: SeasonType | null;
  day_type: PricingDayType | null;
  starts_on: string | null;
  ends_on: string | null;
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

function toNumber(value: number | string | null, fallback = 0) {
  const normalizedValue = typeof value === 'string' ? Number(value) : value;

  return typeof normalizedValue === 'number' && Number.isFinite(normalizedValue)
    ? normalizedValue
    : fallback;
}

function toInteger(value: number | string | null, fallback = 0) {
  return Math.trunc(toNumber(value, fallback));
}

function toNullableInteger(value: number | string | null) {
  if (value === null || value === '') {
    return null;
  }

  return toInteger(value, 0);
}

function getListingTitle(listingId: string, name: string | null) {
  const configuredProperty = Object.values(BOOKABLE_PROPERTIES).find(
    (property) => property.listingId === listingId,
  );

  return configuredProperty?.title ?? name ?? listingId;
}

function formatSeasonDayLabel(seasonType: SeasonType, dayType: PricingDayType) {
  return `${seasonType} ${dayType}`;
}

function assertTierCoverageForCombination(
  listingTitle: string,
  seasonType: SeasonType,
  dayType: PricingDayType,
  tiers: readonly ParsedAdminPricingTier[],
) {
  const scopedTiers = tiers
    .filter((tier) => tier.seasonType === seasonType && tier.dayType === dayType)
    .sort((left, right) => left.minNights - right.minNights);
  const label = formatSeasonDayLabel(seasonType, dayType);
  let nextRequiredNightCount = 1;

  for (const tier of scopedTiers) {
    if (tier.maxNights !== null && tier.maxNights < nextRequiredNightCount) {
      continue;
    }

    if (tier.minNights > nextRequiredNightCount) {
      throw new Error(
        `${listingTitle} pricing must keep active ${label} tiers covering ${nextRequiredNightCount} night(s).`,
      );
    }

    if (tier.maxNights === null) {
      return;
    }

    nextRequiredNightCount = Math.max(nextRequiredNightCount, tier.maxNights + 1);
  }

  throw new Error(`${listingTitle} pricing must keep an active open-ended ${label} tier.`);
}

export function assertListingPricingCoverage(
  listing: AdminListingInput,
  tiers: readonly AdminPricingTierInput[],
) {
  const parsedListing = adminListingInputSchema.parse(listing);

  if (!parsedListing.isActive) {
    return;
  }

  const activeTiers = tiers
    .map((tier) =>
      adminPricingTierInputSchema.parse({
        ...tier,
        listingId: parsedListing.listingId,
      }),
    )
    .filter((tier) => tier.isActive);
  const listingTitle = getListingTitle(parsedListing.listingId, null);

  if (activeTiers.length === 0) {
    throw new Error(`${listingTitle} pricing must keep at least one active tier.`);
  }

  for (const seasonType of BASE_SEASON_TYPES) {
    for (const dayType of DAY_TYPES) {
      assertTierCoverageForCombination(listingTitle, seasonType, dayType, activeTiers);
    }
  }
}

function mapPricingTier(row: PricingTierRow): AdminPricingTierSnapshot {
  return {
    id: toInteger(row.id),
    listingId: row.listing_id,
    seasonType: row.season_type,
    dayType: row.day_type,
    minNights: toInteger(row.min_nights),
    maxNights: toNullableInteger(row.max_nights),
    targetPrice: toNumber(row.target_price),
    isActive: row.is_active !== false,
    priority: toInteger(row.priority, 0),
  };
}

function mapSeasonPeriod(row: SeasonPeriodRow): AdminSeasonPeriodSnapshot {
  return {
    id: toInteger(row.id),
    name: row.name ?? '',
    seasonType: row.season_type,
    startDate: row.start_date,
    endDate: row.end_date,
    isActive: row.is_active !== false,
  };
}

function mapSeasonDateOverride(row: SeasonDateOverrideRow): AdminSeasonDateOverrideSnapshot {
  return {
    id: toInteger(row.id),
    date: row.date,
    seasonType: row.season_type,
    note: row.note ?? '',
    isActive: row.is_active !== false,
  };
}

function mapPricingRule(row: PricingRuleRow): AdminPricingRuleSnapshot {
  return {
    id: row.id,
    listingId: row.listing_id,
    name: row.name ?? 'Pricing rule',
    ruleType: row.rule_type,
    isActive: row.is_active !== false,
    priority: toInteger(row.priority, 0),
    adjustmentBasisPoints: toInteger(row.adjustment_basis_points),
    minDaysBeforeCheckIn: toNullableInteger(row.min_days_before_check_in),
    maxDaysBeforeCheckIn: toNullableInteger(row.max_days_before_check_in),
    minNights: toNullableInteger(row.min_nights),
    maxNights: toNullableInteger(row.max_nights),
    seasonType: row.season_type,
    dayType: row.day_type,
    startsOn: row.starts_on,
    endsOn: row.ends_on,
  };
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

function throwSupabaseError(tableName: string, error: { message: string } | null) {
  if (error) {
    throw new Error(`Failed to fetch ${tableName}: ${error.message}`);
  }
}

export async function fetchAdminPricingSnapshot(
  client?: SupabaseClient,
): Promise<AdminPricingSnapshot> {
  const supabase = client ?? await getSupabaseClient();
  const [
    listingsResult,
    tiersResult,
    seasonPeriodsResult,
    specialDatesResult,
    adjustmentRulesResult,
  ] = await Promise.all([
    supabase
      .from('listings')
      .select('id, name, base_price, cleaning_fee, currency, is_active')
      .order('id', { ascending: true }),
    supabase
      .from('pricing_tiers')
      .select('id, listing_id, season_type, day_type, min_nights, max_nights, target_price, is_active, priority')
      .eq('is_active', true)
      .order('listing_id', { ascending: true })
      .order('season_type', { ascending: true })
      .order('day_type', { ascending: true })
      .order('min_nights', { ascending: true }),
    supabase
      .from('season_periods')
      .select('id, name, season_type, start_date, end_date, is_active')
      .eq('is_active', true)
      .order('start_date', { ascending: true }),
    supabase
      .from('season_date_overrides')
      .select('id, date, season_type, note, is_active')
      .eq('is_active', true)
      .order('date', { ascending: true }),
    supabase
      .from('pricing_adjustment_rules')
      .select('id, listing_id, name, rule_type, is_active, priority, adjustment_basis_points, min_days_before_check_in, max_days_before_check_in, min_nights, max_nights, season_type, day_type, starts_on, ends_on')
      .eq('is_active', true)
      .order('priority', { ascending: false }),
  ]);

  throwSupabaseError('listings', listingsResult.error);
  throwSupabaseError('pricing_tiers', tiersResult.error);
  throwSupabaseError('season_periods', seasonPeriodsResult.error);
  throwSupabaseError('season_date_overrides', specialDatesResult.error);
  throwSupabaseError('pricing_adjustment_rules', adjustmentRulesResult.error);

  const tiers = (tiersResult.data ?? []).map((row) => mapPricingTier(row as PricingTierRow));
  const listings = (listingsResult.data ?? []).map((row) => {
    const listing = row as ListingRow;

    return {
      listingId: listing.id,
      title: getListingTitle(listing.id, listing.name),
      name: listing.name ?? listing.id,
      basePrice: toNumber(listing.base_price),
      cleaningFee: toNumber(listing.cleaning_fee),
      currency: listing.currency?.trim().toUpperCase() || 'ILS',
      isActive: listing.is_active !== false,
      tiers: tiers.filter((tier) => tier.listingId === listing.id),
    };
  });

  return {
    listings,
    seasonPeriods: (seasonPeriodsResult.data ?? []).map((row) =>
      mapSeasonPeriod(row as SeasonPeriodRow),
    ),
    specialDates: (specialDatesResult.data ?? []).map((row) =>
      mapSeasonDateOverride(row as SeasonDateOverrideRow),
    ),
    adjustmentRules: (adjustmentRulesResult.data ?? []).map((row) =>
      mapPricingRule(row as PricingRuleRow),
    ),
  };
}

export async function fetchAdminDashboardSummary(
  client?: SupabaseClient,
): Promise<AdminDashboardSummary> {
  try {
    const supabase = client ?? await getSupabaseClient();
    const [quotesResult, periodsResult, specialDatesResult, rulesResult, tiersResult] =
      await Promise.all([
        supabase
          .from('admin_quote_history')
          .select('id, reservation_number, guest_name, customer_email, apartment, check_in, check_out, nights, total_label, sent_at')
          .eq('send_status', 'sent')
          .order('sent_at', { ascending: false }),
        supabase.from('season_periods').select('id').eq('is_active', true),
        supabase.from('season_date_overrides').select('id').eq('is_active', true),
        supabase.from('pricing_adjustment_rules').select('id').eq('is_active', true),
        supabase.from('pricing_tiers').select('id').eq('is_active', true),
      ]);

    if (
      quotesResult.error ||
      periodsResult.error ||
      specialDatesResult.error ||
      rulesResult.error ||
      tiersResult.error
    ) {
      throw new Error(
        quotesResult.error?.message ??
          periodsResult.error?.message ??
          specialDatesResult.error?.message ??
          rulesResult.error?.message ??
          tiersResult.error?.message ??
          'Unable to fetch dashboard data',
      );
    }

    return {
      recentQuotes: (quotesResult.data ?? []).map((row) => mapQuoteHistory(row as QuoteHistoryRow)),
      activeSeasonCount: periodsResult.data?.length ?? 0,
      specialDateCount: specialDatesResult.data?.length ?? 0,
      activeAdjustmentRuleCount: rulesResult.data?.length ?? 0,
      pricingTierCount: tiersResult.data?.length ?? 0,
    };
  } catch (error) {
    return {
      recentQuotes: [],
      activeSeasonCount: 0,
      specialDateCount: 0,
      activeAdjustmentRuleCount: 0,
      pricingTierCount: 0,
      unavailableReason: error instanceof Error ? error.message : 'Dashboard data unavailable',
    };
  }
}

export function buildListingUpdateRow(input: AdminListingInput) {
  const parsed = adminListingInputSchema.parse(input);

  return {
    id: parsed.listingId,
    base_price: parsed.basePrice,
    cleaning_fee: parsed.cleaningFee,
    currency: parsed.currency.trim().toUpperCase(),
    is_active: parsed.isActive,
  };
}

export function buildPricingTierUpdateRow(input: AdminPricingTierInput) {
  const parsed = adminPricingTierInputSchema.parse(input);

  return {
    ...(parsed.id ? { id: parsed.id } : {}),
    listing_id: parsed.listingId,
    season_type: parsed.seasonType,
    day_type: parsed.dayType,
    min_nights: parsed.minNights,
    max_nights: parsed.maxNights,
    target_price: parsed.targetPrice,
    is_active: parsed.isActive,
    priority: parsed.priority,
  };
}

export function buildSeasonPeriodRow(input: AdminSeasonPeriodInput) {
  const parsed = adminSeasonPeriodInputSchema.parse(input);

  return {
    ...(parsed.id ? { id: parsed.id } : {}),
    name: parsed.name,
    season_type: parsed.seasonType,
    start_date: parsed.startDate,
    end_date: parsed.endDate,
    is_active: parsed.isActive,
  };
}

export function buildSeasonDateOverrideRow(input: AdminSeasonDateOverrideInput) {
  const parsed = adminSeasonDateOverrideInputSchema.parse(input);

  return {
    ...(parsed.id ? { id: parsed.id } : {}),
    date: parsed.date,
    season_type: parsed.seasonType,
    note: parsed.note ?? '',
    is_active: parsed.isActive,
  };
}

export function buildPricingRuleRow(input: AdminPricingRuleInput) {
  const parsed = adminPricingRuleInputSchema.parse(input);

  return {
    ...(parsed.id ? { id: parsed.id } : {}),
    listing_id: parsed.listingId,
    name: parsed.name,
    rule_type: parsed.ruleType,
    is_active: parsed.isActive,
    priority: parsed.priority,
    adjustment_basis_points: parsed.adjustmentBasisPoints,
    min_days_before_check_in: parsed.minDaysBeforeCheckIn,
    max_days_before_check_in: parsed.maxDaysBeforeCheckIn,
    min_nights: parsed.minNights,
    max_nights: parsed.maxNights,
    season_type: parsed.seasonType,
    day_type: parsed.dayType,
    starts_on: parsed.startsOn,
    ends_on: parsed.endsOn,
    notes: parsed.notes,
  };
}

async function getSupabaseAdminPricingClient() {
  const { getSupabaseAdminClient } = await import('./supabase-admin');

  return getSupabaseAdminClient() as unknown as AdminPricingSupabaseClient;
}

function createAdminPricingError(operation: string, message: string) {
  return new Error(`Failed to ${operation}: ${message}`);
}

export function buildPricingAdjustmentRuleRow(
  input: PricingAdjustmentRuleInput,
): PricingAdjustmentRuleUpsertRow {
  return buildPricingRuleRow(input) as PricingAdjustmentRuleUpsertRow;
}

export async function savePricingAdjustmentRule(
  input: PricingAdjustmentRuleInput,
  client?: AdminPricingSupabaseClient,
) {
  const supabase = client ?? await getSupabaseAdminPricingClient();
  const row = buildPricingAdjustmentRuleRow(input);
  const { data, error } = await supabase
    .from('pricing_adjustment_rules')
    .upsert(row)
    .select('*')
    .single();

  if (error) {
    throw createAdminPricingError('save pricing adjustment rule', error.message);
  }

  return {
    rule: (data ?? row) as unknown as PricingAdjustmentRuleStoredRow,
  };
}

function parsePositiveInteger(value: string) {
  const parsedValue = Number(value.trim());

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
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
  client?: AdminPricingSupabaseClient,
) {
  const supabase = client ?? await getSupabaseAdminPricingClient();
  const row = buildAdminQuoteHistoryRow(input);
  const { data, error } = await supabase
    .from('admin_quote_history')
    .insert(row)
    .select('*')
    .single();

  if (error) {
    throw createAdminPricingError('save admin quote history', error.message);
  }

  return {
    history: (data ?? row) as unknown as AdminQuoteHistoryStoredRow,
  };
}
