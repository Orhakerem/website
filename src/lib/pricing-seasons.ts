import type { SupabaseClient } from '@supabase/supabase-js';

import { compareIsoDates, isIsoDateString } from './booking-dates';
import { PricingDataFetchError } from './pricing-errors';

// 'current' | 'low' | 'high' are the base seasons every listing must price.
// 'p1'..'p7' are dated pricing periods; a listing without tiers for one falls back to 'current'.
export const BASE_SEASON_TYPES = ['current', 'low', 'high'] as const;
export const PERIOD_SEASON_TYPES = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'] as const;
export const SEASON_TYPES = [...BASE_SEASON_TYPES, ...PERIOD_SEASON_TYPES] as const;

export type SeasonType = (typeof SEASON_TYPES)[number];

export function isPeriodSeasonType(value: SeasonType) {
  return (PERIOD_SEASON_TYPES as readonly string[]).includes(value);
}

export interface SeasonDateOverride {
  date: string;
  seasonType: SeasonType;
}

export interface SeasonPeriod {
  name: string | null;
  startDate: string;
  endDate: string;
  seasonType: SeasonType;
}

export interface SeasonRules {
  dateOverrides: readonly SeasonDateOverride[];
  periods: readonly SeasonPeriod[];
}

interface SeasonDateOverrideRow {
  date: string;
  season_type: string;
}

interface SeasonPeriodRow {
  name: string | null;
  start_date: string;
  end_date: string;
  season_type: string;
}

const SEASON_TYPE_SET = new Set<string>(SEASON_TYPES);

function assertIsoDate(value: string, fieldName: string): void {
  if (!isIsoDateString(value)) {
    throw new RangeError(`${fieldName} must be a valid ISO date in YYYY-MM-DD format.`);
  }
}

function normalizeSeasonType(value: string): SeasonType {
  if (SEASON_TYPE_SET.has(value)) {
    return value as SeasonType;
  }

  throw new RangeError(`Unsupported season type: ${value}`);
}

function mapSeasonDateOverride(row: SeasonDateOverrideRow): SeasonDateOverride {
  assertIsoDate(row.date, 'season_date_overrides.date');

  return {
    date: row.date,
    seasonType: normalizeSeasonType(row.season_type),
  };
}

function mapSeasonPeriod(row: SeasonPeriodRow): SeasonPeriod {
  assertIsoDate(row.start_date, 'season_periods.start_date');
  assertIsoDate(row.end_date, 'season_periods.end_date');

  if (compareIsoDates(row.end_date, row.start_date) < 0) {
    throw new RangeError('season_periods.end_date must be on or after start_date.');
  }

  return {
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    seasonType: normalizeSeasonType(row.season_type),
  };
}

async function getSupabaseClient() {
  const { supabase } = await import('./supabase');

  return supabase;
}

function createFetchError(tableName: string, message: string) {
  return new PricingDataFetchError(tableName, message);
}

export async function fetchActiveSeasonDateOverrides(
  client?: SupabaseClient,
): Promise<SeasonDateOverride[]> {
  const supabase = client ?? await getSupabaseClient();
  const { data, error } = await supabase
    .from('season_date_overrides')
    .select('date, season_type')
    .eq('is_active', true)
    .order('date', { ascending: true });

  if (error) {
    throw createFetchError('season_date_overrides', error.message);
  }

  return (data ?? []).map(mapSeasonDateOverride);
}

export async function fetchActiveSeasonPeriods(
  client?: SupabaseClient,
): Promise<SeasonPeriod[]> {
  const supabase = client ?? await getSupabaseClient();
  const { data, error } = await supabase
    .from('season_periods')
    .select('name, start_date, end_date, season_type')
    .eq('is_active', true)
    .order('start_date', { ascending: true });

  if (error) {
    throw createFetchError('season_periods', error.message);
  }

  return (data ?? []).map(mapSeasonPeriod);
}

export async function fetchActiveSeasonRules(client?: SupabaseClient): Promise<SeasonRules> {
  const supabase = client ?? await getSupabaseClient();
  const [dateOverrides, periods] = await Promise.all([
    fetchActiveSeasonDateOverrides(supabase),
    fetchActiveSeasonPeriods(supabase),
  ]);

  return {
    dateOverrides,
    periods,
  };
}

export function resolveSeasonTypeForDate(date: string, rules: SeasonRules): SeasonType {
  assertIsoDate(date, 'date');

  const override = rules.dateOverrides.find((candidate) => candidate.date === date);

  if (override) {
    return override.seasonType;
  }

  const period = rules.periods.find(
    (candidate) =>
      compareIsoDates(candidate.startDate, date) <= 0 &&
      compareIsoDates(candidate.endDate, date) >= 0,
  );

  return period?.seasonType ?? 'current';
}

export async function getSeasonTypeForDate(
  date: string,
  client?: SupabaseClient,
): Promise<SeasonType> {
  const rules = await fetchActiveSeasonRules(client);

  return resolveSeasonTypeForDate(date, rules);
}
