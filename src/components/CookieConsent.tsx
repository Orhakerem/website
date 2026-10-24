'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Cookie, X } from 'lucide-react';

import GoogleAnalytics from '@/components/GoogleAnalytics';
import MetaPixel from '@/components/MetaPixel';
import { localizePath } from '@/i18n/config';
import { commonMessages } from '@/i18n/messages/common';
import { useLocale } from '@/i18n/useLocale';
import {
  CONSENT_STORAGE_KEY,
  EMPTY_CONSENT_PREFERENCES,
  LEGACY_CONSENT_STORAGE_KEY,
  OPEN_CONSENT_SETTINGS_EVENT,
  createStoredConsent,
  resolveConsent,
  type ConsentPreferences,
} from '@/lib/consent';
import { setMetaMarketingConsent } from '@/lib/meta-events';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-J0Q3G9CZWW';

function expireFirstPartyCookie(name: string) {
  const expired = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const host = window.location.hostname;
  const hostParts = host.split('.');
  const rootDomain = hostParts.length > 2 ? hostParts.slice(-2).join('.') : host;
  const domains = new Set([host, `.${host}`, rootDomain, `.${rootDomain}`]);

  document.cookie = `${name}=; expires=${expired}; path=/`;

  domains.forEach((domain) => {
    document.cookie = `${name}=; expires=${expired}; path=/; domain=${domain}`;
  });
}

function clearCookies(matches: (name: string) => boolean) {
  document.cookie.split(';').forEach((entry) => {
    const name = entry.split('=')[0]?.trim();
    if (name && matches(name)) {
      expireFirstPartyCookie(name);
    }
  });
}

function enableAnalytics() {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = false;
}

function disableAnalytics() {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
  clearCookies(name => name.startsWith('_ga') || name === '_gid' || name === '_gat');
}

function grantMarketingConsent() {
  setMetaMarketingConsent(true);
}

function revokeMarketingConsent() {
  setMetaMarketingConsent(false);
  delete window.__orHakeremMetaLastPageView;
  clearCookies(name => name === '_fbp' || name === '_fbc');
}

function applyTrackerPreferences(
  previous: ConsentPreferences,
  next: ConsentPreferences,
) {
  if (next.analytics) {
    enableAnalytics();
  } else if (previous.analytics || !next.analytics) {
    disableAnalytics();
  }

  if (next.marketing) {
    grantMarketingConsent();
  } else if (previous.marketing || !next.marketing) {
    revokeMarketingConsent();
  }
}

export default function CookieConsent() {
  const locale = useLocale();
  const t = commonMessages[locale].cookies;
  const preferencesRef = useRef<ConsentPreferences>(EMPTY_CONSENT_PREFERENCES);
  const [mounted, setMounted] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(
    EMPTY_CONSENT_PREFERENCES,
  );
  const [draft, setDraft] = useState<ConsentPreferences>(EMPTY_CONSENT_PREFERENCES);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [canDismiss, setCanDismiss] = useState(false);

  const updatePreferences = useCallback(
    (next: ConsentPreferences, persist: boolean) => {
      applyTrackerPreferences(preferencesRef.current, next);
      preferencesRef.current = next;
      setPreferences(next);
      setDraft(next);

      if (!persist) return;

      try {
        localStorage.setItem(
          CONSENT_STORAGE_KEY,
          JSON.stringify(createStoredConsent(next)),
        );
        localStorage.removeItem(LEGACY_CONSENT_STORAGE_KEY);
      } catch {
        // Storage may be unavailable in private mode. The choice still applies
        // to the current page session.
      }
    },
    [],
  );

  useEffect(() => {
    setMounted(true);

    let currentRaw: string | null = null;
    let legacyRaw: string | null = null;

    try {
      currentRaw = localStorage.getItem(CONSENT_STORAGE_KEY);
      legacyRaw = localStorage.getItem(LEGACY_CONSENT_STORAGE_KEY);
    } catch {
      // Keep the default no-consent state and show the banner.
    }

    const resolved = resolveConsent(currentRaw, legacyRaw);

    if (resolved.migratedLegacy && resolved.storedConsent) {
      try {
        localStorage.setItem(
          CONSENT_STORAGE_KEY,
          JSON.stringify(resolved.storedConsent),
        );
        localStorage.removeItem(LEGACY_CONSENT_STORAGE_KEY);
      } catch {
        // The in-memory migration below still protects the current session.
      }
    }

    updatePreferences(resolved.preferences, false);
    setBannerOpen(resolved.mustPrompt);
    setCanDismiss(false);

    const openHandler = () => {
      setDraft(preferencesRef.current);
      setCustomizing(true);
      setCanDismiss(true);
      setBannerOpen(true);
    };

    const storageHandler = (event: StorageEvent) => {
      if (event.key !== CONSENT_STORAGE_KEY) return;

      const next = resolveConsent(event.newValue, null);
      updatePreferences(next.preferences, false);
      setBannerOpen(next.mustPrompt);
      setCustomizing(false);
      setCanDismiss(false);
    };

    window.addEventListener(OPEN_CONSENT_SETTINGS_EVENT, openHandler);
    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener(OPEN_CONSENT_SETTINGS_EVENT, openHandler);
      window.removeEventListener('storage', storageHandler);
    };
  }, [updatePreferences]);

  const closeSettings = useCallback(() => {
    setDraft(preferencesRef.current);
    setBannerOpen(false);
    setCustomizing(false);
    setCanDismiss(false);
  }, []);

  useEffect(() => {
    if (!bannerOpen || !canDismiss) return;

    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSettings();
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [bannerOpen, canDismiss, closeSettings]);

  const finish = (next: ConsentPreferences) => {
    updatePreferences(next, true);
    setBannerOpen(false);
    setCustomizing(false);
    setCanDismiss(false);
  };

  if (!mounted) return null;

  return (
    <>
      {preferences.analytics && <GoogleAnalytics />}
      {preferences.marketing && <MetaPixel />}

      {bannerOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t.dialogAria}
          className="fixed bottom-3 start-3 end-3 z-[10000] rounded-2xl border border-primary/10 bg-white p-4 shadow-xl sm:bottom-5 sm:start-5 sm:end-auto sm:max-w-xl sm:p-5"
        >
          {canDismiss && (
            <button
              type="button"
              onClick={closeSettings}
              aria-label={t.close}
              className="absolute end-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          <div className="flex flex-col gap-4">
            <div className={`flex items-start gap-3 ${canDismiss ? 'pe-9' : ''}`}>
              <span className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Cookie className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-head text-base font-semibold text-black">{t.title}</p>
                {/*
                  Two paragraphs, one per breakpoint, swapped in CSS rather than
                  by measuring the viewport in JS: that keeps server and client
                  markup identical. The short copy keeps both named services and
                  the policy link — only the sentence listing the three options
                  is dropped, since the buttons below already state them.
                */}
                <p className="mt-1 text-sm leading-relaxed text-black/70 sm:hidden">
                  {t.bodyShortBeforeLink}
                  <Link
                    href={localizePath(locale, '/privacy')}
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary-light"
                  >
                    {t.privacyPolicy}
                  </Link>
                  {t.bodyShortAfterLink}
                </p>
                <p className="mt-1 hidden text-sm leading-relaxed text-black/70 sm:block">
                  {t.bodyBeforeLink}
                  <Link
                    href={localizePath(locale, '/privacy')}
                    className="font-semibold text-primary underline underline-offset-2 hover:text-primary-light"
                  >
                    {t.privacyPolicy}
                  </Link>
                  {t.bodyAfterLink}
                </p>
              </div>
            </div>

            {customizing ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4 rounded-xl border border-primary/10 bg-cream/40 p-3">
                    <div>
                      <p className="text-sm font-semibold text-black">{t.necessaryTitle}</p>
                      <p className="mt-1 text-xs leading-relaxed text-black/60">
                        {t.necessaryDescription}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked
                      disabled
                      aria-label={t.necessaryTitle}
                      className="mt-1 h-5 w-5 accent-primary"
                    />
                  </div>

                  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-primary/10 p-3">
                    <span>
                      <span className="block text-sm font-semibold text-black">
                        {t.analyticsTitle}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-black/60">
                        {t.analyticsDescription}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.analytics}
                      onChange={event =>
                        setDraft(current => ({
                          ...current,
                          analytics: event.target.checked,
                        }))
                      }
                      className="mt-1 h-5 w-5 accent-primary"
                    />
                  </label>

                  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-primary/10 p-3">
                    <span>
                      <span className="block text-sm font-semibold text-black">
                        {t.marketingTitle}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-black/60">
                        {t.marketingDescription}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={draft.marketing}
                      onChange={event =>
                        setDraft(current => ({
                          ...current,
                          marketing: event.target.checked,
                        }))
                      }
                      className="mt-1 h-5 w-5 accent-primary"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setCustomizing(false)}
                    className="rounded-full border border-primary/20 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                  >
                    {t.back}
                  </button>
                  <button
                    type="button"
                    onClick={() => finish(draft)}
                    className="rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                  >
                    {t.save}
                  </button>
                </div>
              </>
            ) : (
              /*
                Reject and Accept share one row and identical styling, so
                refusing stays exactly as easy as consenting. Customize sits
                below as a secondary control: stacking all three full-width
                made the banner 412px tall on a 375x812 phone — half the
                screen — and gave the most prominent button to the option
                that commits to nothing.
              */
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => finish(EMPTY_CONSENT_PREFERENCES)}
                    className="rounded-full border border-primary/20 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                  >
                    {t.rejectAll}
                  </button>
                  <button
                    type="button"
                    onClick={() => finish({ analytics: true, marketing: true })}
                    className="rounded-full border border-primary/20 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                  >
                    {t.acceptAll}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(preferencesRef.current);
                    setCustomizing(true);
                  }}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-primary underline underline-offset-2 transition-colors hover:bg-primary/5"
                >
                  {t.customize}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
