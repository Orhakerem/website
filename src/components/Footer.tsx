'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook, MessageCircle } from 'lucide-react';

import { localizePath } from '@/i18n/config';
import { useLocale } from '@/i18n/useLocale';
import { commonMessages } from '@/i18n/messages/common';
import LocaleSwitcher from '@/i18n/LocaleSwitcher';
import { OPEN_CONSENT_SETTINGS_EVENT } from '@/lib/consent';
import { trackGaOutboundContact } from '@/lib/ga-events';

function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/or_hakerem/', Icon: Instagram },
  { label: 'TikTok', href: 'https://www.tiktok.com/@or.hakerem', Icon: TikTok },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/orhakerem/', Icon: Linkedin },
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61583829025542', Icon: Facebook },
  { label: 'WhatsApp', href: 'https://wa.me/message/KWYBTW2MTGO2M1', Icon: MessageCircle },
];

export default function Footer() {
  const locale = useLocale();
  const t = commonMessages[locale].footer;

  const exploreLinks = [
    { label: t.home, href: localizePath(locale, '/') },
    { label: t.properties, href: localizePath(locale, '/properties') },
    { label: t.penthouse, href: localizePath(locale, '/properties/penthouse-jacuzzi'), indent: true },
    { label: t.studio, href: localizePath(locale, '/properties/cozy-studio'), indent: true },
    { label: t.events, href: localizePath(locale, '/events') },
    { label: t.about, href: localizePath(locale, '/about') },
    { label: t.faq, href: localizePath(locale, '/faq') },
  ];

  const stayLinks = [
    { label: t.services, href: localizePath(locale, '/services') },
    { label: t.reservation, href: localizePath(locale, '/reservation') },
    { label: t.contactLink, href: localizePath(locale, '/contact') },
  ];

  return (
    <footer className="site-footer bg-primary text-white relative rounded-t-3xl" aria-label={t.footerAria}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="py-8 md:py-10 grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-8 lg:gap-x-12">
          {/* Col 1 — Brand */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Link href={localizePath(locale, '/')} aria-label="Or Hakerem" className="inline-block">
              <Image
                src="/logo/Logo_beige_h1_trimmed.png"
                alt="Or Hakerem"
                width={311}
                height={198}
                className="h-20 md:h-24 w-auto object-contain"
                loading="lazy"
              />
            </Link>
            <p className="text-sm text-white/70 max-w-xs leading-snug">
              {t.tagline}
            </p>
            <ul className="flex gap-3">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Or Hakerem on ${label}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-secondary/60 hover:bg-white/5 hover:text-white"
                    onClick={
                      label === 'WhatsApp'
                        ? () =>
                            trackGaOutboundContact({
                              method: 'whatsapp',
                              location: 'footer_social',
                              locale,
                            })
                        : undefined
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 — Explore */}
          <nav aria-label={t.exploreAria}>
            <h3 className="font-head text-xs uppercase tracking-[0.18em] text-secondary mb-3">{t.explore}</h3>
            <ul className="space-y-2">
              {exploreLinks.map(({ label, href, indent }) => (
                <li key={href} className={indent ? 'ps-3 border-s border-white/10' : ''}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3 — Stay */}
          <nav aria-label={t.stayAria}>
            <h3 className="font-head text-xs uppercase tracking-[0.18em] text-secondary mb-3">{t.stay}</h3>
            <ul className="space-y-2">
              {stayLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/message/KWYBTW2MTGO2M1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                  onClick={() =>
                    trackGaOutboundContact({
                      method: 'whatsapp',
                      location: 'footer_link',
                      locale,
                    })
                  }
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {t.whatsappUs}
                </a>
              </li>
            </ul>
          </nav>

          {/* Col 4 — Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-head text-xs uppercase tracking-[0.18em] text-secondary mb-3">{t.contact}</h3>
            <address className="not-italic space-y-2 text-sm text-white/70">
              <a
                href="mailto:keremliving@gmail.com"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-secondary/80" aria-hidden="true" />
                <span>keremliving@gmail.com</span>
              </a>
              <a
                href="tel:+33651179925"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-secondary/80" aria-hidden="true" />
                <span dir="ltr">
                  +33 6 51 17 99 25 <span className="text-white/40">·</span> FR
                </span>
              </a>
              <a
                href="tel:+972585778891"
                className="flex items-start gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-secondary/80" aria-hidden="true" />
                <span dir="ltr">
                  +972 58 577 8891 <span className="text-white/40">·</span> IL
                </span>
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-secondary/80" aria-hidden="true" />
                <span>
                  {t.address1}
                  <br />
                  {t.address2}
                </span>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-secondary/20 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
            <p>{t.copyright}</p>
            <nav
              aria-label={t.legalAria}
              className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
            >
              <Link href={localizePath(locale, '/terms')} className="hover:text-white transition-colors">
                {t.terms}
              </Link>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <Link href={localizePath(locale, '/privacy')} className="hover:text-white transition-colors">
                {t.privacy}
              </Link>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <Link href={localizePath(locale, '/cancellation')} className="hover:text-white transition-colors">
                {t.cancellation}
              </Link>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT))}
                className="hover:text-white transition-colors"
              >
                {t.cookieSettings}
              </button>
            </nav>
            <LocaleSwitcher />
            <p>
              {t.madeBy}{' '}
              <a
                href="https://sitekept.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Sitekept
              </a>
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}
