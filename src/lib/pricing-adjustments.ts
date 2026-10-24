import type { SupabaseClient } from '@supabase/supabase-js';

import { compareIsoDates, createDateFromIso, isIsoDateString } from './booking-dates';
import { PricingDataFetchError } from './pricing-errors';
import type { PricingNightKind } from './pricing-date-helpers';
import { SEASON_TYPES, type SeasonType } from './pricing-seasons';

export type PricingAdjustmentRuleType = 'last_minute' | 'early_booking' | 'duration';

export interface PricingAdjustmentRule {
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
  dayType: PricingNightKind | null;
  startsOn: string | null;
  endsOn: string | null;
}

export interface AppliedPricingAdjustment {
  id: string;
  name: string;
  rule_type: PricingAdjustmentRuleType;
  adjustment_basis_points: number;
}

export interface PricingAdjustmentContext {
  listingId: string;
  nightDate: string;
  checkIn: string;
  quoteDate: string;
  totalNights: number;
  seasonType: SeasonType;
  dayType: PricingNightKind;
}

export interface PricingAdjustmentApplication {
  nightlyPrice: number;
  adjustmentAmount: number;
  appliedAdjustments: AppliedPricingAdjustment[];
}

interface PricingAdjustmentRuleRow {
  id: string | number;
  listing_id: string | null;
  name: string | null;
  rule_type: string;
  is_active: boolean | null;
  priority: number | string | null;
  adjustment_basis_points: number | string;
  min_days_before_check_in: number | string | null;
  max_days_before_check_in: number | string | null;
  min_nights: number | string | null;
  max_nights: number | string | null;
  season_type: string | null;
  day_type: string | null;
  starts_on: string | null;
  ends_on: string | null;
}

const RULE_TYPES = new Set<PricingAdjustmentRuleType>([
  'last_minute',
  'early_booking',
  'duration',
]);
const DAY_TYPES = new Set<PricingNightKind>(['weekday', 'weekend']);
const SEASON_TYPE_SET = new Set<string>(SEASON_TYPES);
const DAY_IN_MS = 24 * 60 * 60 * 1000;

async function getSupabaseClient() {
  const { supabase } = await import('./supabase');

  return supabase;
}

function createFetchError(tableName: string, message: string) {
  return new PricingDataFetchError(tableName, message);
}

function assertIsoDate(value: string, fieldName: string): void {
  if (!isIsoDateString(value)) {
    throw new RangeError(`${fieldName} must be a valid ISO date in YYYY-MM-DD format.`);
  }
}

function normalizeOptionalIsoDate(value: string | null, fieldName: string) {
  if (value === null || value === '') {
    return null;
  }

  assertIsoDate(value, fieldName);
  return value;
}

function normalizeRuleType(value: string): PricingAdjustmentRuleType {
  if (RULE_TYPES.has(value as PricingAdjustmentRuleType)) {
    return value as PricingAdjustmentRuleType;
  }

  throw new RangeError(`Unsupported pricing_adjustment_rules.rule_type: ${value}`);
}

function normalizeSeasonType(value: string | null): SeasonType | null {
  if (value === null || value === '') {
    return null;
  }

  if (SEASON_TYPE_SET.has(value)) {
    return value as SeasonType;
  }

  throw new RangeError(`Unsupported pricing_adjustment_rules.season_type: ${value}`);
}

function normalizeDayType(value: string | null): PricingNightKind | null {
  if (value === null || value === '') {
    return null;
  }

  if (DAY_TYPES.has(value as PricingNightKind)) {
    return value as PricingNightKind;
  }

  throw new RangeError(`Unsupported pricing_adjustment_rules.day_type: ${value}`);
}

function normalizeInteger(value: number | string | null, fieldName: string) {
  if (value === null || value === '') {
    return null;
  }

  const normalizedValue = typeof value === 'string' ? Number(value) : value;

  if (
    typeof normalizedValue !== 'number' ||
    !Number.isInteger(normalizedValue) ||
    !Number.isFinite(normalizedValue)
  ) {
    throw new RangeError(`${fieldName} must be an integer.`);
  }

  return normalizedValue;
}

function normalizeNonNegativeInteger(value: number | string | null, fieldName: string) {
  const normalizedValue = normalizeInteger(value, fieldName);

  if (normalizedValue !== null && normalizedValue < 0) {
    throw new RangeError(`${fieldName} must be a non-negative integer.`);
  }

  return normalizedValue;
}

function normalizeListingId(value: string | null) {
  const normalizedValue = value?.trim();

  return normalizedValue || null;
}

function validateRange(
  minValue: number | null,
  maxValue: number | null,
  fieldPrefix: string,
) {
  if (minValue !== null && maxValue !== null && maxValue < minValue) {
    throw new RangeError(`${fieldPrefix} max must be greater than or equal to min.`);
  }
}

function validateDateRange(startsOn: string | null, endsOn: string | null) {
  if (startsOn && endsOn && compareIsoDates(endsOn, startsOn) < 0) {
    throw new RangeError('pricing_adjustment_rules.ends_on must be on or after starts_on.');
  }
}

export function mapPricingAdjustmentRule(row: PricingAdjustmentRuleRow): PricingAdjustmentRule {
  const minDaysBeforeCheckIn = normalizeNonNegativeInteger(
    row.min_days_before_check_in,
    'pricing_adjustment_rules.min_days_before_check_in',
  );
  const maxDaysBeforeCheckIn = normalizeNonNegativeInteger(
    row.max_days_before_check_in,
    'pricing_adjustment_rules.max_days_before_check_in',
  );
  const minNights = normalizeNonNegativeInteger(
    row.min_nights,
    'pricing_adjustment_rules.min_nights',
  );
  const maxNights = normalizeNonNegativeInteger(
    row.max_nights,
    'pricing_adjustment_rules.max_nights',
  );
  const startsOn = normalizeOptionalIsoDate(row.starts_on, 'pricing_adjustment_rules.starts_on');
  const endsOn = normalizeOptionalIsoDate(row.ends_on, 'pricing_adjustment_rules.ends_on');

  validateRange(minDaysBeforeCheckIn, maxDaysBeforeCheckIn, 'pricing_adjustment_rules.days_before_check_in');
  validateRange(minNights, maxNights, 'pricing_adjustment_rules.nights');
  validateDateRange(startsOn, endsOn);

  return {
    id: String(row.id),
    listingId: normalizeListingId(row.listing_id),
    name: row.name?.trim() || 'Pricing adjustment',
    ruleType: normalizeRuleType(row.rule_type),
    isActive: row.is_active !== false,
    priority: normalizeInteger(row.priority ?? 0, 'pricing_adjustment_rules.priority') ?? 0,
    adjustmentBasisPoints:
      normalizeInteger(
        row.adjustment_basis_points,
        'pricing_adjustment_rules.adjustment_basis_points',
      ) ?? 0,
    minDaysBeforeCheckIn,
    maxDaysBeforeCheckIn,
    minNights,
    maxNights,
    seasonType: normalizeSeasonType(row.season_type),
    dayType: normalizeDayType(row.day_type),
    startsOn,
    endsOn,
  };
}

export async function fetchActivePricingAdjustmentRules(
  client?: SupabaseClient,
): Promise<PricingAdjustmentRule[]> {
  const supabase = client ?? await getSupabaseClient();
  const { data, error } = await supabase
    .from('pricing_adjustment_rules')
    .select(
      [
        'id',
        'listing_id',
        'name',
        'rule_type',
        'is_active',
        'priority',
        'adjustment_basis_points',
        'min_days_before_check_in',
        'max_days_before_check_in',
        'min_nights',
        'max_nights',
        'season_type',
        'day_type',
        'starts_on',
        'ends_on',
      ].join(', '),
    )
    .eq('is_active', true)
    .order('priority', { ascending: false });

  if (error) {
    throw createFetchError('pricing_adjustment_rules', error.message);
  }

  return (data ?? []).map((row) =>
    mapPricingAdjustmentRule(row as unknown as PricingAdjustmentRuleRow),
  );
}

export function getDaysBeforeCheckIn(checkIn: string, quoteDate: string) {
  assertIsoDate(checkIn, 'checkIn');
  assertIsoDate(quoteDate, 'quoteDate');

  const diff = createDateFromIso(checkIn).getTime() - createDateFromIso(quoteDate).getTime();

  return Math.floor(diff / DAY_IN_MS);
}

function isWithinRange(value: number, minValue: number | null, maxValue: number | null) {
  return (minValue === null || value >= minValue) && (maxValue === null || value <= maxValue);
}

function isWithinDateRange(value: string, startsOn: string | null, endsOn: string | null) {
  return (
    (startsOn === null || compareIsoDates(value, startsOn) >= 0) &&
    (endsOn === null || compareIsoDates(value, endsOn) <= 0)
  );
}

function getRuleSpecificity(rule: PricingAdjustmentRule) {
  let specificity = 0;

  if (rule.listingId) specificity += 16;
  if (rule.seasonType) specificity += 8;
  if (rule.dayType) specificity += 8;
  if (rule.startsOn || rule.endsOn) specificity += 4;
  if (rule.minDaysBeforeCheckIn !== null || rule.maxDaysBeforeCheckIn !== null) specificity += 2;
  if (rule.minNights !== null || rule.maxNights !== null) specificity += 2;

  return specificity;
}

function compareRuleSpecificity(left: PricingAdjustmentRule, right: PricingAdjustmentRule) {
  if (left.priority !== right.priority) {
    return right.priority - left.priority;
  }

  const specificityDiff = getRuleSpecificity(right) - getRuleSpecificity(left);

  if (specificityDiff !== 0) {
    return specificityDiff;
  }

  return left.id.localeCompare(right.id);
}

function matchesPricingAdjustmentRule(
  rule: PricingAdjustmentRule,
  context: PricingAdjustmentContext,
) {
  if (!rule.isActive) {
    return false;
  }

  if (rule.listingId && rule.listingId !== context.listingId) {
    return false;
  }

  if (rule.seasonType && rule.seasonType !== context.seasonType) {
    return false;
  }

  if (rule.dayType && rule.dayType !== context.dayType) {
    return false;
  }

  if (!isWithinDateRange(context.nightDate, rule.startsOn, rule.endsOn)) {
    return false;
  }

  if (!isWithinRange(context.totalNights, rule.minNights, rule.maxNights)) {
    return false;
  }

  const daysBeforeCheckIn = getDaysBeforeCheckIn(context.checkIn, context.quoteDate);

  return isWithinRange(
    daysBeforeCheckIn,
    rule.minDaysBeforeCheckIn,
    rule.maxDaysBeforeCheckIn,
  );
}

export function selectPricingAdjustmentRules(
  rules: readonly PricingAdjustmentRule[],
  context: PricingAdjustmentContext,
) {
  const selectedRulesByType = new Map<PricingAdjustmentRuleType, PricingAdjustmentRule>();
  const matches = rules
    .filter((rule) => matchesPricingAdjustmentRule(rule, context))
    .sort(compareRuleSpecificity);

  for (const rule of matches) {
    if (!selectedRulesByType.has(rule.ruleType)) {
      selectedRulesByType.set(rule.ruleType, rule);
    }
  }

  return Array.from(selectedRulesByType.values()).sort(compareRuleSpecificity);
}

function roundCurrencyAmount(value: number) {
  return Number(value.toFixed(2));
}

export function applyPricingAdjustments(
  baseNightlyPrice: number,
  rules: readonly PricingAdjustmentRule[],
): PricingAdjustmentApplication {
  const totalBasisPoints = rules.reduce(
    (total, rule) => total + rule.adjustmentBasisPoints,
    0,
  );
  const nightlyPrice = roundCurrencyAmount(
    Math.max(0, baseNightlyPrice * (1 + totalBasisPoints / 10_000)),
  );

  return {
    nightlyPrice,
    adjustmentAmount: roundCurrencyAmount(nightlyPrice - baseNightlyPrice),
    appliedAdjustments: rules.map((rule) => ({
      id: rule.id,
      name: rule.name,
      rule_type: rule.ruleType,
      adjustment_basis_points: rule.adjustmentBasisPoints,
    })),
  };
}
