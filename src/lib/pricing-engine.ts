import type { SupabaseClient } from '@supabase/supabase-js';

import { compareIsoDates, getTodayIsoInTimeZone } from './booking-dates';
import {
  getNightsBetween,
  getPricingNightKind,
  type PricingNightKind,
} from './pricing-date-helpers';
import {
  applyPricingAdjustments,
  fetchActivePricingAdjustmentRules,
  selectPricingAdjustmentRules,
  type AppliedPricingAdjustment,
  type PricingAdjustmentRule,
} from './pricing-adjustments';
import {
  fetchActiveSeasonRules,
  isPeriodSeasonType,
  resolveSeasonTypeForDate,
  SEASON_TYPES,
  type SeasonRules,
  type SeasonType,
} from './pricing-seasons';
import {
  PricingDataFetchError,
  PricingListingNotFoundError,
  PricingTierNotFoundError,
} from './pricing-errors';

export type PricingDayType = PricingNightKind;

export interface PricingQuoteInput {
  listingId: string;
  checkIn: string;
  checkOut: string;
  quoteDate?: string;
}

export interface PricingListing {
  id: string;
  cleaningFee: number;
  currency: string;
}

export interface PricingTier {
  listingId: string;
  seasonType: SeasonType;
  dayType: PricingDayType;
  minNights: number;
  maxNights: number | null;
  targetPrice: number;
}

export interface NightlyPricingBreakdown {
  date: string;
  day_type: PricingDayType;
  season_type: SeasonType;
  base_nightly_price?: number;
  nightly_price: number;
  adjustment_amount?: number;
  pricing_adjustments?: AppliedPricingAdjustment[];
  pricing_tier: {
    season_type: SeasonType;
    day_type: PricingDayType;
    min_nights: number;
    max_nights: number | null;
    target_price: number;
  };
}

export interface PricingBreakdown {
  available: true;
  listing_id: string;
  nights: number;
  nightly_breakdown: NightlyPricingBreakdown[];
  base_night_total?: number;
  night_total: number;
  adjustment_total?: number;
  cleaning_fee: number;
  total_price: number;
  currency: string;
  pricing_adjustments?: AppliedPricingAdjustment[];
}

interface ListingRow {
  id: string;
  cleaning_fee: number | string | null;
  currency: string | null;
}

interface PricingTierRow {
  listing_id: string;
  season_type: string;
  day_type: string;
  min_nights: number | string;
  max_nights: number | string | null;
  target_price: number | string;
}

const DAY_TYPES = new Set<PricingDayType>(['weekday', 'weekend']);
const DEFAULT_CURRENCY = 'ILS';

async function getSupabaseClient() {
  const { supabase } = await import('./supabase');

  return supabase;
}

function createFetchError(tableName: string, message: string) {
  return new PricingDataFetchError(tableName, message);
}

function normalizeCurrency(value: string | null) {
  const normalizedValue = value?.trim().toUpperCase();

  return normalizedValue || DEFAULT_CURRENCY;
}

function normalizeMoney(value: number | string | null, fieldName: string) {
  const normalizedValue = typeof value === 'string' ? Number(value) : value;

  if (typeof normalizedValue !== 'number' || !Number.isFinite(normalizedValue) || normalizedValue < 0) {
    throw new RangeError(`${fieldName} must be a non-negative number.`);
  }

  return roundCurrencyAmount(normalizedValue);
}

function normalizeNightCount(value: number | string | null, fieldName: string) {
  if (value === null) {
    return null;
  }

  const normalizedValue = typeof value === 'string' ? Number(value) : value;

  if (
    typeof normalizedValue !== 'number' ||
    !Number.isInteger(normalizedValue) ||
    normalizedValue < 0
  ) {
    throw new RangeError(`${fieldName} must be a non-negative integer.`);
  }

  return normalizedValue;
}

function normalizeSeasonType(value: string): SeasonType {
  if ((SEASON_TYPES as readonly string[]).includes(value)) {
    return value as SeasonType;
  }

  throw new RangeError(`Unsupported pricing_tiers.season_type: ${value}`);
}

function normalizeDayType(value: string): PricingDayType {
  if (DAY_TYPES.has(value as PricingDayType)) {
    return value as PricingDayType;
  }

  throw new RangeError(`Unsupported pricing_tiers.day_type: ${value}`);
}

function mapListing(row: ListingRow): PricingListing {
  return {
    id: row.id,
    cleaningFee: normalizeMoney(row.cleaning_fee, 'listings.cleaning_fee'),
    currency: normalizeCurrency(row.currency),
  };
}

function mapPricingTier(row: PricingTierRow): PricingTier {
  const minNights = normalizeNightCount(row.min_nights, 'pricing_tiers.min_nights');
  const maxNights = normalizeNightCount(row.max_nights, 'pricing_tiers.max_nights');

  if (minNights === null) {
    throw new RangeError('pricing_tiers.min_nights must not be null.');
  }

  if (maxNights !== null && maxNights < minNights) {
    throw new RangeError('pricing_tiers.max_nights must be greater than or equal to min_nights.');
  }

  return {
    listingId: row.listing_id,
    seasonType: normalizeSeasonType(row.season_type),
    dayType: normalizeDayType(row.day_type),
    minNights,
    maxNights,
    targetPrice: normalizeMoney(row.target_price, 'pricing_tiers.target_price'),
  };
}

function matchesStayLength(tier: PricingTier, totalNights: number) {
  return (
    tier.minNights <= totalNights &&
    (tier.maxNights === null || tier.maxNights >= totalNights)
  );
}

function compareTierSpecificity(left: PricingTier, right: PricingTier) {
  if (left.minNights !== right.minNights) {
    return right.minNights - left.minNights;
  }

  const leftMaxNights = left.maxNights ?? Number.POSITIVE_INFINITY;
  const rightMaxNights = right.maxNights ?? Number.POSITIVE_INFINITY;

  return leftMaxNights - rightMaxNights;
}

function roundCurrencyAmount(value: number) {
  return Number(value.toFixed(2));
}

export function selectPricingTier(
  tiers: readonly PricingTier[],
  options: {
    listingId: string;
    seasonType: SeasonType;
    dayType: PricingDayType;
    totalNights: number;
  },
) {
  const matches = tiers.filter(
    (tier) =>
      tier.listingId === options.listingId &&
      tier.seasonType === options.seasonType &&
      tier.dayType === options.dayType &&
      matchesStayLength(tier, options.totalNights),
  );

  const selectedTier = [...matches].sort(compareTierSpecificity)[0];

  if (!selectedTier) {
    throw new PricingTierNotFoundError(
      options.listingId,
      options.seasonType,
      options.dayType,
      options.totalNights,
    );
  }

  return selectedTier;
}

export function buildPricingBreakdown(
  input: PricingQuoteInput,
  listing: PricingListing,
  pricingTiers: readonly PricingTier[],
  seasonRules: SeasonRules,
  pricingAdjustmentRules: readonly PricingAdjustmentRule[] = [],
): PricingBreakdown {
  const nights = getNightsBetween(input.checkIn, input.checkOut);
  const quoteDate = input.quoteDate ?? getTodayIsoInTimeZone();

  if (nights.length === 0 || compareIsoDates(input.checkOut, input.checkIn) <= 0) {
    throw new RangeError('checkOut must be after checkIn.');
  }

  const nightlyBreakdown = nights.map<NightlyPricingBreakdown>((date) => {
    const dayType = getPricingNightKind(date);
    const seasonType = resolveSeasonTypeForDate(date, seasonRules);
    const tierOptions = {
      listingId: listing.id,
      dayType,
      totalNights: nights.length,
    };
    let pricingTier: PricingTier;

    try {
      pricingTier = selectPricingTier(pricingTiers, { ...tierOptions, seasonType });
    } catch (error) {
      // Period seasons (p1..p6) are global; a listing that has no tiers for one prices it as 'current'.
      if (!(error instanceof PricingTierNotFoundError) || !isPeriodSeasonType(seasonType)) {
        throw error;
      }

      pricingTier = selectPricingTier(pricingTiers, { ...tierOptions, seasonType: 'current' });
    }
    const selectedAdjustments = selectPricingAdjustmentRules(pricingAdjustmentRules, {
      listingId: listing.id,
      nightDate: date,
      checkIn: input.checkIn,
      quoteDate,
      totalNights: nights.length,
      seasonType,
      dayType,
    });
    const adjustmentResult = applyPricingAdjustments(
      pricingTier.targetPrice,
      selectedAdjustments,
    );

    const night: NightlyPricingBreakdown = {
      date,
      day_type: dayType,
      season_type: seasonType,
      nightly_price: adjustmentResult.nightlyPrice,
      pricing_tier: {
        season_type: pricingTier.seasonType,
        day_type: pricingTier.dayType,
        min_nights: pricingTier.minNights,
        max_nights: pricingTier.maxNights,
        target_price: pricingTier.targetPrice,
      },
    };

    if (adjustmentResult.appliedAdjustments.length > 0) {
      night.base_nightly_price = pricingTier.targetPrice;
      night.adjustment_amount = adjustmentResult.adjustmentAmount;
      night.pricing_adjustments = adjustmentResult.appliedAdjustments;
    }

    return night;
  });

  const baseNightTotal = roundCurrencyAmount(
    nightlyBreakdown.reduce(
      (total, night) => total + (night.base_nightly_price ?? night.nightly_price),
      0,
    ),
  );
  const nightTotal = roundCurrencyAmount(
    nightlyBreakdown.reduce((total, night) => total + night.nightly_price, 0),
  );
  const adjustmentTotal = roundCurrencyAmount(nightTotal - baseNightTotal);
  const cleaningFee = roundCurrencyAmount(listing.cleaningFee);
  const appliedAdjustments = Array.from(
    new Map(
      nightlyBreakdown
        .flatMap((night) => night.pricing_adjustments ?? [])
        .map((adjustment) => [adjustment.id, adjustment]),
    ).values(),
  );

  const breakdown: PricingBreakdown = {
    available: true,
    listing_id: listing.id,
    nights: nights.length,
    nightly_breakdown: nightlyBreakdown,
    night_total: nightTotal,
    cleaning_fee: cleaningFee,
    total_price: roundCurrencyAmount(nightTotal + cleaningFee),
    currency: listing.currency,
  };

  if (appliedAdjustments.length > 0) {
    breakdown.base_night_total = baseNightTotal;
    breakdown.adjustment_total = adjustmentTotal;
    breakdown.pricing_adjustments = appliedAdjustments;
  }

  return breakdown;
}

export async function fetchPricingListing(
  listingId: string,
  client?: SupabaseClient,
): Promise<PricingListing> {
  const supabase = client ?? await getSupabaseClient();
  const { data, error } = await supabase
    .from('listings')
    .select('id, cleaning_fee, currency')
    .eq('id', listingId)
    .maybeSingle();

  if (error) {
    throw createFetchError('listings', error.message);
  }

  if (!data) {
    throw new PricingListingNotFoundError(listingId);
  }

  return mapListing(data as ListingRow);
}

export async function fetchPricingTiers(
  listingId: string,
  client?: SupabaseClient,
): Promise<PricingTier[]> {
  const supabase = client ?? await getSupabaseClient();
  const { data, error } = await supabase
    .from('pricing_tiers')
    .select('listing_id, season_type, day_type, min_nights, max_nights, target_price')
    .eq('is_active', true)
    .eq('listing_id', listingId);

  if (error) {
    throw createFetchError('pricing_tiers', error.message);
  }

  return (data ?? []).map((row) => mapPricingTier(row as PricingTierRow));
}

export async function getPricingBreakdown(
  input: PricingQuoteInput,
  client?: SupabaseClient,
): Promise<PricingBreakdown> {
  const supabase = client ?? await getSupabaseClient();
  const [listing, pricingTiers, seasonRules, pricingAdjustmentRules] = await Promise.all([
    fetchPricingListing(input.listingId, supabase),
    fetchPricingTiers(input.listingId, supabase),
    fetchActiveSeasonRules(supabase),
    fetchActivePricingAdjustmentRules(supabase),
  ]);

  return buildPricingBreakdown(
    input,
    listing,
    pricingTiers,
    seasonRules,
    pricingAdjustmentRules,
  );
}
