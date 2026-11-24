export const CONSENT_SCHEMA_VERSION = 2 as const;
export const CONSENT_POLICY_VERSION = '2026-07-23';
export const CONSENT_STORAGE_KEY = 'or-hakerem-consent-v2';
export const LEGACY_CONSENT_STORAGE_KEY = 'cookie-consent';
export const OPEN_CONSENT_SETTINGS_EVENT = 'open-cookie-settings';
/** Fired by CookieConsent after each preference update (detail: ConsentPreferences), so /cookies can reflect it. */
export const CONSENT_CHANGED_EVENT = 'cookie-consent-changed';

export type ConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
};

export type ConsentSource = 'explicit' | 'legacy-granted' | 'legacy-denied';

export type StoredConsent = {
  schemaVersion: typeof CONSENT_SCHEMA_VERSION;
  policyVersion: typeof CONSENT_POLICY_VERSION;
  preferences: ConsentPreferences;
  decidedAt: string;
  source: ConsentSource;
};

export type ResolvedConsent = {
  preferences: ConsentPreferences;
  mustPrompt: boolean;
  storedConsent: StoredConsent | null;
  migratedLegacy: boolean;
};

export const EMPTY_CONSENT_PREFERENCES: ConsentPreferences = {
  analytics: false,
  marketing: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasBooleanPreferences(value: unknown): value is ConsentPreferences {
  return (
    isRecord(value) &&
    typeof value.analytics === 'boolean' &&
    typeof value.marketing === 'boolean'
  );
}

export function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;

  try {
    const value: unknown = JSON.parse(raw);

    if (
      !isRecord(value) ||
      value.schemaVersion !== CONSENT_SCHEMA_VERSION ||
      value.policyVersion !== CONSENT_POLICY_VERSION ||
      !hasBooleanPreferences(value.preferences) ||
      typeof value.decidedAt !== 'string' ||
      typeof value.source !== 'string' ||
      !['explicit', 'legacy-granted', 'legacy-denied'].includes(value.source)
    ) {
      return null;
    }

    return value as StoredConsent;
  } catch {
    return null;
  }
}

export function createStoredConsent(
  preferences: ConsentPreferences,
  source: ConsentSource = 'explicit',
  decidedAt = new Date().toISOString(),
): StoredConsent {
  return {
    schemaVersion: CONSENT_SCHEMA_VERSION,
    policyVersion: CONSENT_POLICY_VERSION,
    preferences: { ...preferences },
    decidedAt,
    source,
  };
}

export function resolveConsent(
  currentRaw: string | null,
  legacyRaw: string | null,
  now = new Date().toISOString(),
): ResolvedConsent {
  const current = parseStoredConsent(currentRaw);

  if (current) {
    return {
      preferences: current.preferences,
      mustPrompt: current.source === 'legacy-granted',
      storedConsent: current,
      migratedLegacy: false,
    };
  }

  if (legacyRaw === 'granted') {
    const migrated = createStoredConsent(
      { analytics: true, marketing: false },
      'legacy-granted',
      now,
    );

    return {
      preferences: migrated.preferences,
      mustPrompt: true,
      storedConsent: migrated,
      migratedLegacy: true,
    };
  }

  if (legacyRaw === 'denied') {
    const migrated = createStoredConsent(
      EMPTY_CONSENT_PREFERENCES,
      'legacy-denied',
      now,
    );

    return {
      preferences: migrated.preferences,
      mustPrompt: false,
      storedConsent: migrated,
      migratedLegacy: true,
    };
  }

  return {
    preferences: EMPTY_CONSENT_PREFERENCES,
    mustPrompt: true,
    storedConsent: null,
    migratedLegacy: false,
  };
}
