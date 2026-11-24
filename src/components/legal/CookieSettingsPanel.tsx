'use client';

import { useEffect, useState } from 'react';

import { commonMessages } from '@/i18n/messages/common';
import { useLocale } from '@/i18n/useLocale';
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  EMPTY_CONSENT_PREFERENCES,
  LEGACY_CONSENT_STORAGE_KEY,
  OPEN_CONSENT_SETTINGS_EVENT,
  resolveConsent,
  type ConsentPreferences,
} from '@/lib/consent';

/**
 * Read-only view of the visitor's current consent, for /cookies. It never
 * writes consent itself: the button opens the existing CookieConsent dialog,
 * and the view follows the `cookie-consent-changed` event it fires.
 */
export default function CookieSettingsPanel() {
  const locale = useLocale();
  const t = commonMessages[locale].cookies;
  const [prefs, setPrefs] = useState<ConsentPreferences>(EMPTY_CONSENT_PREFERENCES);

  useEffect(() => {
    const read = () => {
      try {
        setPrefs(
          resolveConsent(
            localStorage.getItem(CONSENT_STORAGE_KEY),
            localStorage.getItem(LEGACY_CONSENT_STORAGE_KEY),
          ).preferences,
        );
      } catch {
        // Storage unavailable: keep the no-consent default.
      }
    };
    read();

    const onChange = (event: Event) => setPrefs((event as CustomEvent<ConsentPreferences>).detail);
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_STORAGE_KEY) read();
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const row = (label: string, on: boolean) => (
    <li className="flex items-center justify-between gap-4 border-b border-primary/10 py-3 last:border-0">
      <span className="text-black/80">{label}</span>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
          on ? 'bg-secondary/25 text-black' : 'bg-black/[0.06] text-black/60'
        }`}
      >
        {on ? t.page.enabled : t.page.disabled}
      </span>
    </li>
  );

  return (
    <div className="rounded-2xl border border-secondary/20 bg-cream p-6 md:p-8">
      <h3 className="font-head text-2xl font-semibold text-black">{t.page.current}</h3>
      <ul className="mt-4">
        {row(t.necessaryTitle, true)}
        {row(t.analyticsTitle, prefs.analytics)}
        {row(t.marketingTitle, prefs.marketing)}
      </ul>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT))}
        className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
      >
        {t.page.open}
      </button>
    </div>
  );
}
