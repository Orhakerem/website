'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Layers3,
  Percent,
  Plus,
  Trash2,
} from 'lucide-react';

import { compareIsoDates, isIsoDateString } from '@/lib/booking-dates';
import type { AdminAvailabilitySnapshot } from '@/lib/admin-availability';
import type {
  AdminListingInput,
  AdminPricingRuleInput,
  AdminPricingSnapshot,
  AdminPricingTierInput,
  AdminSeasonDateOverrideInput,
  AdminSeasonPeriodInput,
} from '@/lib/admin-pricing';
import type { PricingAdjustmentRuleType } from '@/lib/pricing-adjustments';
import type { PricingDayType } from '@/lib/pricing-engine';
import type { SeasonType } from '@/lib/pricing-seasons';

import AdminPricingSimulator from './AdminPricingSimulator';
import {
  ADMIN_INPUT_CLASS,
  AdminField,
  AdminIconButton,
  AdminPanel,
  AdminPill,
  AdminSaveButton,
  AdminSelect,
  AdminTextarea,
  AdminToggle,
  type AdminSectionSaveState,
} from './admin-ui';

type ScopedSeasonType = SeasonType | 'all';
type ScopedDayType = PricingDayType | 'all';

export interface AdminSaveListingPricesInput {
  listing: AdminListingInput;
  tiers: AdminPricingTierInput[];
}

export interface AdminSaveSeasonPeriodsInput {
  periods: AdminSeasonPeriodInput[];
}

export interface AdminSaveSpecialDatesInput {
  specialDates: AdminSeasonDateOverrideInput[];
}

export interface AdminSavePricingRulesInput {
  rules: AdminPricingRuleInput[];
}

export interface AdminPricingSimulationInput {
  listingId: string;
  checkIn: string;
  checkOut: string;
}

export interface AdminPricingSimulationNight {
  date: string;
  dayType: PricingDayType;
  seasonType: SeasonType;
  basePrice: number;
  adjustmentAmount: number;
  adjustmentBasisPoints: number;
  finalPrice: number;
  adjustmentNames: string[];
}

export interface AdminPricingSimulationQuote {
  listingId: string;
  listingTitle: string;
  currency: string;
  nights: number;
  nightTotal: number;
  baseNightTotal: number;
  adjustmentTotal: number;
  cleaningFee: number;
  totalPrice: number;
  nightlyBreakdown: AdminPricingSimulationNight[];
}

export type AdminPricingActionResult =
  | {
      success: true;
      message?: string;
      snapshot: AdminPricingSnapshot;
    }
  | {
      success: false;
      error: string;
    };

export type AdminPricingSimulationResult =
  | {
      success: true;
      quote: AdminPricingSimulationQuote;
    }
  | {
      success: false;
      error: string;
    };

export interface AdminPricingActions {
  saveListingPrices(input: AdminSaveListingPricesInput): Promise<AdminPricingActionResult>;
  saveSeasonPeriods(input: AdminSaveSeasonPeriodsInput): Promise<AdminPricingActionResult>;
  saveSpecialDates(input: AdminSaveSpecialDatesInput): Promise<AdminPricingActionResult>;
  savePricingRules(input: AdminSavePricingRulesInput): Promise<AdminPricingActionResult>;
  runSimulation(input: AdminPricingSimulationInput): Promise<AdminPricingSimulationResult>;
}

interface AdminPricingEditorProps {
  snapshot: AdminPricingSnapshot;
  availabilitySnapshot: AdminAvailabilitySnapshot;
  actions?: Partial<AdminPricingActions>;
}

interface ListingDraft {
  listingId: string;
  title: string;
  name: string;
  basePrice: string;
  cleaningFee: string;
  currency: string;
  isActive: boolean;
  tiers: TierDraft[];
}

interface TierDraft {
  clientId: string;
  id?: number;
  seasonType: SeasonType;
  dayType: PricingDayType;
  minNights: string;
  maxNights: string;
  targetPrice: string;
  priority: string;
  isActive: boolean;
}

interface SeasonPeriodDraft {
  clientId: string;
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  seasonType: SeasonType;
  isActive: boolean;
}

interface SpecialDateDraft {
  clientId: string;
  id?: number;
  date: string;
  seasonType: SeasonType;
  note: string;
  isActive: boolean;
}

interface RuleDraft {
  clientId: string;
  id?: string;
  listingId: string;
  name: string;
  ruleType: PricingAdjustmentRuleType;
  adjustmentPercent: string;
  minDaysBeforeCheckIn: string;
  maxDaysBeforeCheckIn: string;
  minNights: string;
  maxNights: string;
  seasonType: ScopedSeasonType;
  dayType: ScopedDayType;
  startsOn: string;
  endsOn: string;
  priority: string;
  isActive: boolean;
}

interface ValidationResult<T> {
  payload: T;
  errors: string[];
}

const SEASON_OPTIONS = [
  { value: 'current', label: 'Current' },
  { value: 'low', label: 'Low' },
  { value: 'high', label: 'High' },
  { value: 'p1', label: 'P1' },
  { value: 'p2', label: 'P2' },
  { value: 'p3', label: 'P3' },
  { value: 'p4', label: 'P4' },
  { value: 'p5', label: 'P5' },
  { value: 'p6', label: 'P6' },
  { value: 'p7', label: 'P7 (New Year)' },
] as const;

const DAY_OPTIONS = [
  { value: 'weekday', label: 'Weekday' },
  { value: 'weekend', label: 'Weekend' },
] as const;

const RULE_TYPE_OPTIONS = [
  { value: 'last_minute', label: 'Last minute' },
  { value: 'early_booking', label: 'Early booking' },
  { value: 'duration', label: 'Duration' },
] as const;

const SCOPED_SEASON_OPTIONS = [
  { value: 'all', label: 'All seasons' },
  ...SEASON_OPTIONS,
] as const;

const SCOPED_DAY_OPTIONS = [
  { value: 'all', label: 'All days' },
  ...DAY_OPTIONS,
] as const;

function createClientId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createPersistedClientId(prefix: string, id: string | number | undefined, index: number) {
  return id ? `${prefix}-${id}` : `${prefix}-initial-${index}`;
}

function formatDraftNumber(value: number | null | undefined) {
  return value === null || value === undefined ? '' : String(value);
}

function formatPercentFromBasisPoints(value: number) {
  const percent = value / 100;

  return Number.isInteger(percent) ? String(percent) : String(percent);
}

function parseRequiredNumber(
  value: string,
  label: string,
  errors: string[],
  options: { integer?: boolean; min?: number } = {},
) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    errors.push(`${label} is required.`);
    return 0;
  }

  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    errors.push(`${label} must be a number.`);
    return 0;
  }

  if (options.integer && !Number.isInteger(parsedValue)) {
    errors.push(`${label} must be a whole number.`);
  }

  if (typeof options.min === 'number' && parsedValue < options.min) {
    errors.push(`${label} must be at least ${options.min}.`);
  }

  return parsedValue;
}

function parseOptionalInteger(value: string, label: string, errors: string[]) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  return parseRequiredNumber(normalizedValue, label, errors, {
    integer: true,
    min: 0,
  });
}

function parseOptionalDate(value: string, label: string, errors: string[]) {
  if (!value.trim()) {
    return null;
  }

  if (!isIsoDateString(value)) {
    errors.push(`${label} must use YYYY-MM-DD.`);
  }

  return value;
}

function validateDate(value: string, label: string, errors: string[]) {
  if (!value.trim()) {
    errors.push(`${label} is required.`);
    return;
  }

  if (!isIsoDateString(value)) {
    errors.push(`${label} must use YYYY-MM-DD.`);
  }
}

function validateDateRange(
  startDate: string | null,
  endDate: string | null,
  label: string,
  errors: string[],
) {
  if (startDate && endDate && compareIsoDates(endDate, startDate) < 0) {
    errors.push(`${label} end date must be on or after start date.`);
  }
}

function toListingDraft(listing: AdminPricingSnapshot['listings'][number]): ListingDraft {
  return {
    listingId: listing.listingId,
    title: listing.title,
    name: listing.name,
    basePrice: formatDraftNumber(listing.basePrice),
    cleaningFee: formatDraftNumber(listing.cleaningFee),
    currency: listing.currency,
    isActive: listing.isActive,
    tiers: listing.tiers.map((tier, index) => ({
      clientId: createPersistedClientId(`tier-${listing.listingId}`, tier.id, index),
      id: tier.id,
      seasonType: tier.seasonType,
      dayType: tier.dayType,
      minNights: formatDraftNumber(tier.minNights),
      maxNights: formatDraftNumber(tier.maxNights),
      targetPrice: formatDraftNumber(tier.targetPrice),
      priority: formatDraftNumber(tier.priority),
      isActive: tier.isActive,
    })),
  };
}

function toSeasonPeriodDraft(
  period: AdminPricingSnapshot['seasonPeriods'][number],
  index: number,
): SeasonPeriodDraft {
  return {
    clientId: createPersistedClientId('season-period', period.id, index),
    id: period.id,
    name: period.name,
    startDate: period.startDate,
    endDate: period.endDate,
    seasonType: period.seasonType,
    isActive: period.isActive,
  };
}

function toSpecialDateDraft(
  specialDate: AdminPricingSnapshot['specialDates'][number],
  index: number,
): SpecialDateDraft {
  return {
    clientId: createPersistedClientId('special-date', specialDate.id, index),
    id: specialDate.id,
    date: specialDate.date,
    seasonType: specialDate.seasonType,
    note: specialDate.note,
    isActive: specialDate.isActive,
  };
}

function toRuleDraft(rule: AdminPricingSnapshot['adjustmentRules'][number], index: number): RuleDraft {
  return {
    clientId: createPersistedClientId('pricing-rule', rule.id, index),
    id: rule.id,
    listingId: rule.listingId ?? 'all',
    name: rule.name,
    ruleType: rule.ruleType,
    adjustmentPercent: formatPercentFromBasisPoints(rule.adjustmentBasisPoints),
    minDaysBeforeCheckIn: formatDraftNumber(rule.minDaysBeforeCheckIn),
    maxDaysBeforeCheckIn: formatDraftNumber(rule.maxDaysBeforeCheckIn),
    minNights: formatDraftNumber(rule.minNights),
    maxNights: formatDraftNumber(rule.maxNights),
    seasonType: rule.seasonType ?? 'all',
    dayType: rule.dayType ?? 'all',
    startsOn: rule.startsOn ?? '',
    endsOn: rule.endsOn ?? '',
    priority: formatDraftNumber(rule.priority),
    isActive: rule.isActive,
  };
}

function createEmptyTierDraft(): TierDraft {
  return {
    clientId: createClientId('tier'),
    seasonType: 'current',
    dayType: 'weekday',
    minNights: '1',
    maxNights: '',
    targetPrice: '',
    priority: '0',
    isActive: true,
  };
}

function createEmptySeasonPeriodDraft(): SeasonPeriodDraft {
  return {
    clientId: createClientId('season-period'),
    name: '',
    startDate: '',
    endDate: '',
    seasonType: 'high',
    isActive: true,
  };
}

function createEmptySpecialDateDraft(): SpecialDateDraft {
  return {
    clientId: createClientId('special-date'),
    date: '',
    seasonType: 'high',
    note: '',
    isActive: true,
  };
}

function createEmptyRuleDraft(listingId = 'all'): RuleDraft {
  return {
    clientId: createClientId('pricing-rule'),
    listingId,
    name: '',
    ruleType: 'last_minute',
    adjustmentPercent: '',
    minDaysBeforeCheckIn: '',
    maxDaysBeforeCheckIn: '',
    minNights: '',
    maxNights: '',
    seasonType: 'all',
    dayType: 'all',
    startsOn: '',
    endsOn: '',
    priority: '0',
    isActive: true,
  };
}

function buildListingPayload(draft: ListingDraft): ValidationResult<AdminSaveListingPricesInput> {
  const errors: string[] = [];
  const basePrice = parseRequiredNumber(`${draft.basePrice}`, `${draft.title} base price`, errors, {
    min: 0,
  });
  const cleaningFee = parseRequiredNumber(
    `${draft.cleaningFee}`,
    `${draft.title} cleaning fee`,
    errors,
    { min: 0 },
  );

  if (!draft.currency.trim()) {
    errors.push(`${draft.title} currency is required.`);
  }

  const tiers = draft.tiers.map((tier, index) => {
    const rowLabel = `${draft.title} tier ${index + 1}`;
    const minNights = parseRequiredNumber(tier.minNights, `${rowLabel} minimum nights`, errors, {
      integer: true,
      min: 0,
    });
    const maxNights = parseOptionalInteger(tier.maxNights, `${rowLabel} maximum nights`, errors);
    const targetPrice = parseRequiredNumber(tier.targetPrice, `${rowLabel} nightly price`, errors, {
      min: 0,
    });
    const priority = parseRequiredNumber(tier.priority, `${rowLabel} priority`, errors, {
      integer: true,
      min: 0,
    });

    if (maxNights !== null && maxNights < minNights) {
      errors.push(`${rowLabel} maximum nights must be at least minimum nights.`);
    }

    return {
      id: tier.id,
      listingId: draft.listingId,
      seasonType: tier.seasonType,
      dayType: tier.dayType,
      minNights,
      maxNights,
      targetPrice,
      isActive: tier.isActive,
      priority,
    };
  });

  return {
    payload: {
      listing: {
        listingId: draft.listingId,
        basePrice,
        cleaningFee,
        currency: draft.currency.trim().toUpperCase(),
        isActive: draft.isActive,
      },
      tiers,
    },
    errors,
  };
}

function buildSeasonPeriodsPayload(
  drafts: readonly SeasonPeriodDraft[],
): ValidationResult<AdminSaveSeasonPeriodsInput> {
  const errors: string[] = [];
  const periods = drafts.map((draft, index) => {
    const label = draft.name.trim() || `Season period ${index + 1}`;

    if (!draft.name.trim()) {
      errors.push(`${label} name is required.`);
    }
    validateDate(draft.startDate, `${label} start date`, errors);
    validateDate(draft.endDate, `${label} end date`, errors);
    validateDateRange(draft.startDate, draft.endDate, label, errors);

    return {
      id: draft.id,
      name: draft.name.trim(),
      seasonType: draft.seasonType,
      startDate: draft.startDate,
      endDate: draft.endDate,
      isActive: draft.isActive,
    };
  });

  return { payload: { periods }, errors };
}

function buildSpecialDatesPayload(
  drafts: readonly SpecialDateDraft[],
): ValidationResult<AdminSaveSpecialDatesInput> {
  const errors: string[] = [];
  const specialDates = drafts.map((draft, index) => {
    validateDate(draft.date, `Special date ${index + 1}`, errors);

    return {
      id: draft.id,
      date: draft.date,
      seasonType: draft.seasonType,
      note: draft.note.trim(),
      isActive: draft.isActive,
    };
  });

  return { payload: { specialDates }, errors };
}

function buildRulesPayload(drafts: readonly RuleDraft[]): ValidationResult<AdminSavePricingRulesInput> {
  const errors: string[] = [];
  const rules = drafts.map((draft, index) => {
    const label = draft.name.trim() || `Pricing rule ${index + 1}`;

    if (!draft.name.trim()) {
      errors.push(`${label} name is required.`);
    }

    const adjustmentPercent = parseRequiredNumber(
      draft.adjustmentPercent,
      `${label} adjustment percent`,
      errors,
    );
    const minDaysBeforeCheckIn = parseOptionalInteger(
      draft.minDaysBeforeCheckIn,
      `${label} minimum days before check-in`,
      errors,
    );
    const maxDaysBeforeCheckIn = parseOptionalInteger(
      draft.maxDaysBeforeCheckIn,
      `${label} maximum days before check-in`,
      errors,
    );
    const minNights = parseOptionalInteger(draft.minNights, `${label} minimum nights`, errors);
    const maxNights = parseOptionalInteger(draft.maxNights, `${label} maximum nights`, errors);
    const startsOn = parseOptionalDate(draft.startsOn, `${label} start date`, errors);
    const endsOn = parseOptionalDate(draft.endsOn, `${label} end date`, errors);
    const priority = parseRequiredNumber(draft.priority, `${label} priority`, errors, {
      integer: true,
      min: 0,
    });

    if (
      minDaysBeforeCheckIn !== null &&
      maxDaysBeforeCheckIn !== null &&
      maxDaysBeforeCheckIn < minDaysBeforeCheckIn
    ) {
      errors.push(`${label} maximum days before check-in must be at least minimum days.`);
    }

    if (minNights !== null && maxNights !== null && maxNights < minNights) {
      errors.push(`${label} maximum nights must be at least minimum nights.`);
    }

    validateDateRange(startsOn, endsOn, label, errors);

    return {
      id: draft.id,
      listingId: draft.listingId === 'all' ? null : draft.listingId,
      name: draft.name.trim(),
      ruleType: draft.ruleType,
      isActive: draft.isActive,
      priority,
      adjustmentBasisPoints: Math.round(adjustmentPercent * 100),
      minDaysBeforeCheckIn,
      maxDaysBeforeCheckIn,
      minNights,
      maxNights,
      seasonType: draft.seasonType === 'all' ? null : draft.seasonType,
      dayType: draft.dayType === 'all' ? null : draft.dayType,
      startsOn,
      endsOn,
    };
  });

  return { payload: { rules }, errors };
}

function getSectionState(saveStates: Record<string, AdminSectionSaveState>, sectionKey: string) {
  return saveStates[sectionKey] ?? 'idle';
}

function buildComparable(value: unknown) {
  return JSON.stringify(value);
}

function omitClientIds<T extends { clientId: string }>(items: readonly T[]) {
  return items.map((item) => {
    const { clientId, ...comparableItem } = item;
    void clientId;

    return comparableItem;
  });
}

function toComparableListingDraft(listing: ListingDraft) {
  return {
    ...listing,
    tiers: omitClientIds(listing.tiers),
  };
}

function getPendingDiffs(
  snapshot: AdminPricingSnapshot,
  listingDrafts: readonly ListingDraft[],
  seasonPeriodDrafts: readonly SeasonPeriodDraft[],
  specialDateDrafts: readonly SpecialDateDraft[],
  ruleDrafts: readonly RuleDraft[],
) {
  const diffs: string[] = [];

  for (const listing of listingDrafts) {
    const original = snapshot.listings.find((candidate) => candidate.listingId === listing.listingId);

    if (
      original &&
      buildComparable(toComparableListingDraft(toListingDraft(original))) !==
        buildComparable(toComparableListingDraft(listing))
    ) {
      diffs.push(`${listing.title}: listing prices changed`);
    }
  }

  if (
    buildComparable(omitClientIds(snapshot.seasonPeriods.map(toSeasonPeriodDraft))) !==
    buildComparable(omitClientIds(seasonPeriodDrafts))
  ) {
    diffs.push('Season periods changed');
  }

  if (
    buildComparable(omitClientIds(snapshot.specialDates.map(toSpecialDateDraft))) !==
    buildComparable(omitClientIds(specialDateDrafts))
  ) {
    diffs.push('Special date overrides changed');
  }

  if (
    buildComparable(omitClientIds(snapshot.adjustmentRules.map(toRuleDraft))) !==
    buildComparable(omitClientIds(ruleDrafts))
  ) {
    diffs.push('Pricing adjustment rules changed');
  }

  return diffs;
}

function getListingOptions(snapshot: AdminPricingSnapshot) {
  return [
    { value: 'all', label: 'All listings' },
    ...snapshot.listings.map((listing) => ({
      value: listing.listingId,
      label: listing.title,
    })),
  ];
}

export default function AdminPricingEditor({
  snapshot,
  availabilitySnapshot,
  actions,
}: AdminPricingEditorProps) {
  const [currentSnapshot, setCurrentSnapshot] = useState(snapshot);
  const [listingDrafts, setListingDrafts] = useState<ListingDraft[]>(() =>
    snapshot.listings.map(toListingDraft),
  );
  const [seasonPeriodDrafts, setSeasonPeriodDrafts] = useState<SeasonPeriodDraft[]>(() =>
    snapshot.seasonPeriods.map(toSeasonPeriodDraft),
  );
  const [specialDateDrafts, setSpecialDateDrafts] = useState<SpecialDateDraft[]>(() =>
    snapshot.specialDates.map(toSpecialDateDraft),
  );
  const [ruleDrafts, setRuleDrafts] = useState<RuleDraft[]>(() =>
    snapshot.adjustmentRules.map(toRuleDraft),
  );
  const [saveStates, setSaveStates] = useState<Record<string, AdminSectionSaveState>>({});

  const listingOptions = useMemo(() => getListingOptions(currentSnapshot), [currentSnapshot]);
  const pendingDiffs = useMemo(
    () =>
      getPendingDiffs(
        currentSnapshot,
        listingDrafts,
        seasonPeriodDrafts,
        specialDateDrafts,
        ruleDrafts,
      ),
    [currentSnapshot, listingDrafts, ruleDrafts, seasonPeriodDrafts, specialDateDrafts],
  );

  function applySnapshot(nextSnapshot: AdminPricingSnapshot, sectionKey: string) {
    setCurrentSnapshot(nextSnapshot);

    if (sectionKey.startsWith('listing:')) {
      const listingId = sectionKey.slice('listing:'.length);
      const savedListing = nextSnapshot.listings.find((listing) => listing.listingId === listingId);

      if (savedListing) {
        setListingDrafts((current) =>
          current.map((listing) =>
            listing.listingId === listingId ? toListingDraft(savedListing) : listing,
          ),
        );
      }
      return;
    }

    if (sectionKey === 'seasons') {
      setSeasonPeriodDrafts(nextSnapshot.seasonPeriods.map(toSeasonPeriodDraft));
      return;
    }

    if (sectionKey === 'special-dates') {
      setSpecialDateDrafts(nextSnapshot.specialDates.map(toSpecialDateDraft));
      return;
    }

    if (sectionKey === 'pricing-rules') {
      setRuleDrafts(nextSnapshot.adjustmentRules.map(toRuleDraft));
    }
  }

  function setSectionState(sectionKey: string, state: AdminSectionSaveState) {
    setSaveStates((current) => ({ ...current, [sectionKey]: state }));
  }

  async function runSave<T>(
    sectionKey: string,
    validation: ValidationResult<T>,
    save: ((input: T) => Promise<AdminPricingActionResult>) | undefined,
  ) {
    if (!save) {
      setSectionState(sectionKey, 'error');
      toast.error('Save action is not configured.');
      return;
    }

    if (validation.errors.length > 0) {
      setSectionState(sectionKey, 'error');
      // Show every validation problem, not just the first one, so a single
      // save attempt is enough to know everything that needs fixing.
      toast.error(
        validation.errors.length === 1
          ? validation.errors[0]
          : `${validation.errors.length} problems:\n• ${validation.errors.join('\n• ')}`,
        { duration: 6000 },
      );
      return;
    }

    setSectionState(sectionKey, 'saving');

    try {
      const result = await save(validation.payload);

      if (!result.success) {
        setSectionState(sectionKey, 'error');
        toast.error(result.error);
        return;
      }

      applySnapshot(result.snapshot, sectionKey);
      setSectionState(sectionKey, 'saved');
      toast.success(result.message ?? 'Pricing section saved.');
    } catch (error) {
      console.error('Admin pricing save failed:', error);
      setSectionState(sectionKey, 'error');
      toast.error('Failed to save pricing section.');
    }
  }

  function updateListing(
    listingId: string,
    updater: (listing: ListingDraft) => ListingDraft,
  ) {
    setListingDrafts((current) =>
      current.map((listing) => (listing.listingId === listingId ? updater(listing) : listing)),
    );
    setSectionState(`listing:${listingId}`, 'idle');
  }

  function updateTier(
    listingId: string,
    clientId: string,
    updater: (tier: TierDraft) => TierDraft,
  ) {
    updateListing(listingId, (listing) => ({
      ...listing,
      tiers: listing.tiers.map((tier) => (tier.clientId === clientId ? updater(tier) : tier)),
    }));
  }

  function saveListing(listing: ListingDraft) {
    return runSave(
      `listing:${listing.listingId}`,
      buildListingPayload(listing),
      actions?.saveListingPrices,
    );
  }

  function updateSeasonPeriod(clientId: string, updater: (period: SeasonPeriodDraft) => SeasonPeriodDraft) {
    setSeasonPeriodDrafts((current) =>
      current.map((period) => (period.clientId === clientId ? updater(period) : period)),
    );
    setSectionState('seasons', 'idle');
  }

  function updateSpecialDate(clientId: string, updater: (specialDate: SpecialDateDraft) => SpecialDateDraft) {
    setSpecialDateDrafts((current) =>
      current.map((specialDate) =>
        specialDate.clientId === clientId ? updater(specialDate) : specialDate,
      ),
    );
    setSectionState('special-dates', 'idle');
  }

  function updateRule(clientId: string, updater: (rule: RuleDraft) => RuleDraft) {
    setRuleDrafts((current) =>
      current.map((rule) => (rule.clientId === clientId ? updater(rule) : rule)),
    );
    setSectionState('pricing-rules', 'idle');
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <AdminPricingSimulator
          snapshot={currentSnapshot}
          availabilitySnapshot={availabilitySnapshot}
          runSimulation={actions?.runSimulation}
        />

        <AdminPanel title="Pending diff" eyebrow="Review" icon={CheckCircle2}>
          {pendingDiffs.length > 0 ? (
            <ul className="space-y-2 text-sm text-black/70">
              {pendingDiffs.map((diff) => (
                <li key={diff} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {diff}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-black/60">No pending changes against the saved snapshot.</p>
          )}
        </AdminPanel>
      </div>

      <AdminPanel title="Listing price matrix" eyebrow="Prices" icon={CircleDollarSign}>
        <div className="space-y-6">
          {listingDrafts.map((listing) => (
            <div key={listing.listingId} className="overflow-hidden rounded-xl border border-primary/10">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-primary/10 bg-cream/45 px-4 py-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/60">
                    {listing.listingId}
                  </p>
                  <h3 className="mt-1 font-head text-xl font-light text-black">{listing.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {getSectionState(saveStates, `listing:${listing.listingId}`) === 'idle' ? (
                    <AdminPill tone="neutral">Section save</AdminPill>
                  ) : null}
                  <AdminSaveButton
                    state={getSectionState(saveStates, `listing:${listing.listingId}`)}
                    onClick={() => saveListing(listing)}
                    disabled={!actions?.saveListingPrices}
                  />
                </div>
              </div>

              <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
                <AdminField
                  label="Base price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={listing.basePrice}
                  onChange={(value) =>
                    updateListing(listing.listingId, (current) => ({ ...current, basePrice: value }))
                  }
                />
                <AdminField
                  label="Cleaning fee"
                  type="number"
                  min={0}
                  step="0.01"
                  value={listing.cleaningFee}
                  onChange={(value) =>
                    updateListing(listing.listingId, (current) => ({ ...current, cleaningFee: value }))
                  }
                />
                <AdminField
                  label="Currency"
                  value={listing.currency}
                  onChange={(value) =>
                    updateListing(listing.listingId, (current) => ({ ...current, currency: value }))
                  }
                />
                <div className="flex items-end">
                  <AdminToggle
                    label="Listing active"
                    checked={listing.isActive}
                    onChange={(checked) =>
                      updateListing(listing.listingId, (current) => ({
                        ...current,
                        isActive: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[58rem] text-left text-sm">
                  <thead className="bg-white text-[10px] uppercase tracking-[0.18em] text-black/45">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Season</th>
                      <th className="px-4 py-3 font-semibold">Day</th>
                      <th className="px-4 py-3 font-semibold">Min nights</th>
                      <th className="px-4 py-3 font-semibold">Max nights</th>
                      <th className="px-4 py-3 font-semibold">Nightly price</th>
                      <th className="px-4 py-3 font-semibold">Active</th>
                      <th className="px-4 py-3 text-right font-semibold">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {listing.tiers.map((tier) => (
                      <tr key={tier.clientId}>
                        <td className="px-4 py-3">
                          <select
                            aria-label="Tier season"
                            value={tier.seasonType}
                            onChange={(event) =>
                              updateTier(listing.listingId, tier.clientId, (current) => ({
                                ...current,
                                seasonType: event.target.value as SeasonType,
                              }))
                            }
                            className={ADMIN_INPUT_CLASS}
                          >
                            {SEASON_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            aria-label="Tier day type"
                            value={tier.dayType}
                            onChange={(event) =>
                              updateTier(listing.listingId, tier.clientId, (current) => ({
                                ...current,
                                dayType: event.target.value as PricingDayType,
                              }))
                            }
                            className={ADMIN_INPUT_CLASS}
                          >
                            {DAY_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            aria-label="Tier minimum nights"
                            type="number"
                            min={0}
                            step={1}
                            value={tier.minNights}
                            onChange={(event) =>
                              updateTier(listing.listingId, tier.clientId, (current) => ({
                                ...current,
                                minNights: event.target.value,
                              }))
                            }
                            className={ADMIN_INPUT_CLASS}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            aria-label="Tier maximum nights"
                            type="number"
                            min={0}
                            step={1}
                            placeholder="Open"
                            value={tier.maxNights}
                            onChange={(event) =>
                              updateTier(listing.listingId, tier.clientId, (current) => ({
                                ...current,
                                maxNights: event.target.value,
                              }))
                            }
                            className={ADMIN_INPUT_CLASS}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            aria-label="Tier nightly price"
                            type="number"
                            min={0}
                            step="0.01"
                            value={tier.targetPrice}
                            onChange={(event) =>
                              updateTier(listing.listingId, tier.clientId, (current) => ({
                                ...current,
                                targetPrice: event.target.value,
                              }))
                            }
                            className={ADMIN_INPUT_CLASS}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <AdminToggle
                            label="Active"
                            checked={tier.isActive}
                            onChange={(checked) =>
                              updateTier(listing.listingId, tier.clientId, (current) => ({
                                ...current,
                                isActive: checked,
                              }))
                            }
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <AdminIconButton
                              label="Remove tier"
                              icon={Trash2}
                              tone="danger"
                              onClick={() =>
                                updateListing(listing.listingId, (current) => ({
                                  ...current,
                                  tiers: current.tiers.filter(
                                    (candidate) => candidate.clientId !== tier.clientId,
                                  ),
                                }))
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-primary/10 px-4 py-3">
                <button
                  type="button"
                  onClick={() =>
                    updateListing(listing.listingId, (current) => ({
                      ...current,
                      tiers: [...current.tiers, createEmptyTierDraft()],
                    }))
                  }
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-secondary/50 px-4 py-2 text-sm font-medium text-primary/80 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add tier
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>

      <AdminPanel
        title="Seasons"
        eyebrow="Periods"
        icon={Layers3}
        action={
          <AdminSaveButton
            state={getSectionState(saveStates, 'seasons')}
            onClick={() =>
              runSave(
                'seasons',
                buildSeasonPeriodsPayload(seasonPeriodDrafts),
                actions?.saveSeasonPeriods,
              )
            }
            disabled={!actions?.saveSeasonPeriods}
          />
        }
      >
        <div className="space-y-3">
          {seasonPeriodDrafts.map((period) => (
            <div
              key={period.clientId}
              className="grid gap-3 rounded-xl border border-secondary/25 bg-cream/35 p-3 lg:grid-cols-[1.1fr_9rem_9rem_9rem_auto_auto]"
            >
              <AdminField
                label="Name"
                value={period.name}
                onChange={(value) => updateSeasonPeriod(period.clientId, (current) => ({ ...current, name: value }))}
              />
              <AdminField
                label="Start"
                type="date"
                value={period.startDate}
                onChange={(value) =>
                  updateSeasonPeriod(period.clientId, (current) => ({ ...current, startDate: value }))
                }
              />
              <AdminField
                label="End"
                type="date"
                value={period.endDate}
                onChange={(value) =>
                  updateSeasonPeriod(period.clientId, (current) => ({ ...current, endDate: value }))
                }
              />
              <AdminSelect
                label="Season"
                value={period.seasonType}
                onChange={(value) =>
                  updateSeasonPeriod(period.clientId, (current) => ({
                    ...current,
                    seasonType: value as SeasonType,
                  }))
                }
                options={SEASON_OPTIONS}
              />
              <div className="flex items-end">
                <AdminToggle
                  label="Active"
                  checked={period.isActive}
                  onChange={(checked) =>
                    updateSeasonPeriod(period.clientId, (current) => ({
                      ...current,
                      isActive: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-end">
                <AdminIconButton
                  label="Remove season"
                  icon={Trash2}
                  tone="danger"
                  onClick={() => {
                    setSectionState('seasons', 'idle');
                    setSeasonPeriodDrafts((current) =>
                      current.filter((candidate) => candidate.clientId !== period.clientId),
                    );
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setSectionState('seasons', 'idle');
            setSeasonPeriodDrafts((current) => [...current, createEmptySeasonPeriodDraft()]);
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-secondary/50 px-4 py-2 text-sm font-medium text-primary/80 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add season
        </button>
      </AdminPanel>

      <AdminPanel
        title="Special dates"
        eyebrow="Overrides"
        icon={CalendarDays}
        action={
          <AdminSaveButton
            state={getSectionState(saveStates, 'special-dates')}
            onClick={() =>
              runSave(
                'special-dates',
                buildSpecialDatesPayload(specialDateDrafts),
                actions?.saveSpecialDates,
              )
            }
            disabled={!actions?.saveSpecialDates}
          />
        }
      >
        <div className="space-y-3">
          {specialDateDrafts.map((specialDate) => (
            <div
              key={specialDate.clientId}
              className="grid gap-3 rounded-xl border border-secondary/25 bg-cream/35 p-3 lg:grid-cols-[9rem_9rem_1fr_auto_auto]"
            >
              <AdminField
                label="Date"
                type="date"
                value={specialDate.date}
                onChange={(value) =>
                  updateSpecialDate(specialDate.clientId, (current) => ({ ...current, date: value }))
                }
              />
              <AdminSelect
                label="Season"
                value={specialDate.seasonType}
                onChange={(value) =>
                  updateSpecialDate(specialDate.clientId, (current) => ({
                    ...current,
                    seasonType: value as SeasonType,
                  }))
                }
                options={SEASON_OPTIONS}
              />
              <AdminTextarea
                label="Note"
                rows={1}
                value={specialDate.note}
                onChange={(value) =>
                  updateSpecialDate(specialDate.clientId, (current) => ({ ...current, note: value }))
                }
              />
              <div className="flex items-end">
                <AdminToggle
                  label="Active"
                  checked={specialDate.isActive}
                  onChange={(checked) =>
                    updateSpecialDate(specialDate.clientId, (current) => ({
                      ...current,
                      isActive: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-end">
                <AdminIconButton
                  label="Remove special date"
                  icon={Trash2}
                  tone="danger"
                  onClick={() => {
                    setSectionState('special-dates', 'idle');
                    setSpecialDateDrafts((current) =>
                      current.filter((candidate) => candidate.clientId !== specialDate.clientId),
                    );
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setSectionState('special-dates', 'idle');
            setSpecialDateDrafts((current) => [...current, createEmptySpecialDateDraft()]);
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-secondary/50 px-4 py-2 text-sm font-medium text-primary/80 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add date
        </button>
      </AdminPanel>

      <AdminPanel
        title="Pricing rules"
        eyebrow="Adjustments"
        icon={Percent}
        action={
          <AdminSaveButton
            state={getSectionState(saveStates, 'pricing-rules')}
            onClick={() =>
              runSave('pricing-rules', buildRulesPayload(ruleDrafts), actions?.savePricingRules)
            }
            disabled={!actions?.savePricingRules}
          />
        }
      >
        <div className="overflow-x-auto rounded-xl border border-primary/10">
          <table className="w-full min-w-[76rem] text-left text-sm">
            <thead className="bg-white text-[10px] uppercase tracking-[0.18em] text-black/45">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Listing</th>
                <th className="px-4 py-3 font-semibold">Percent</th>
                <th className="px-4 py-3 font-semibold">Days min</th>
                <th className="px-4 py-3 font-semibold">Days max</th>
                <th className="px-4 py-3 font-semibold">Nights min</th>
                <th className="px-4 py-3 font-semibold">Nights max</th>
                <th className="px-4 py-3 font-semibold">Season</th>
                <th className="px-4 py-3 font-semibold">Day</th>
                <th className="px-4 py-3 font-semibold">Start</th>
                <th className="px-4 py-3 font-semibold">End</th>
                <th className="px-4 py-3 font-semibold">Active</th>
                <th className="px-4 py-3 text-right font-semibold">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {ruleDrafts.map((rule) => (
                <tr key={rule.clientId}>
                  <td className="px-4 py-3">
                    <input
                      aria-label="Rule name"
                      value={rule.name}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({ ...current, name: event.target.value }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label="Rule type"
                      value={rule.ruleType}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          ruleType: event.target.value as PricingAdjustmentRuleType,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    >
                      {RULE_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label="Rule listing"
                      value={rule.listingId}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          listingId: event.target.value,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    >
                      {listingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      aria-label="Rule percent"
                      type="number"
                      step="0.01"
                      value={rule.adjustmentPercent}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          adjustmentPercent: event.target.value,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      aria-label="Rule minimum days before check-in"
                      type="number"
                      min={0}
                      step={1}
                      value={rule.minDaysBeforeCheckIn}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          minDaysBeforeCheckIn: event.target.value,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      aria-label="Rule maximum days before check-in"
                      type="number"
                      min={0}
                      step={1}
                      value={rule.maxDaysBeforeCheckIn}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          maxDaysBeforeCheckIn: event.target.value,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      aria-label="Rule minimum nights"
                      type="number"
                      min={0}
                      step={1}
                      value={rule.minNights}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          minNights: event.target.value,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      aria-label="Rule maximum nights"
                      type="number"
                      min={0}
                      step={1}
                      value={rule.maxNights}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          maxNights: event.target.value,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label="Rule season"
                      value={rule.seasonType}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          seasonType: event.target.value as ScopedSeasonType,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    >
                      {SCOPED_SEASON_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label="Rule day"
                      value={rule.dayType}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          dayType: event.target.value as ScopedDayType,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    >
                      {SCOPED_DAY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      aria-label="Rule start date"
                      type="date"
                      value={rule.startsOn}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          startsOn: event.target.value,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      aria-label="Rule end date"
                      type="date"
                      value={rule.endsOn}
                      onChange={(event) =>
                        updateRule(rule.clientId, (current) => ({
                          ...current,
                          endsOn: event.target.value,
                        }))
                      }
                      className={ADMIN_INPUT_CLASS}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <AdminToggle
                      label="Active"
                      checked={rule.isActive}
                      onChange={(checked) =>
                        updateRule(rule.clientId, (current) => ({ ...current, isActive: checked }))
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <AdminIconButton
                        label="Remove rule"
                        icon={Trash2}
                        tone="danger"
                        onClick={() => {
                          setSectionState('pricing-rules', 'idle');
                          setRuleDrafts((current) =>
                            current.filter((candidate) => candidate.clientId !== rule.clientId),
                          );
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => {
            setSectionState('pricing-rules', 'idle');
            setRuleDrafts((current) => [
              ...current,
              createEmptyRuleDraft(currentSnapshot.listings[0]?.listingId ?? 'all'),
            ]);
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-secondary/50 px-4 py-2 text-sm font-medium text-primary/80 transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add rule
        </button>
      </AdminPanel>
    </div>
  );
}
