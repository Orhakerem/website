'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { localizePath, stripLocalePrefix } from '@/i18n/config';
import { useLocale } from '@/i18n/useLocale';
import { commonMessages } from '@/i18n/messages/common';
import LocaleSwitcher from '@/i18n/LocaleSwitcher';
import { trackGaOutboundContact } from '@/lib/ga-events';

function Navbar() {
  const pathname = usePathname();
  const locale = useLocale();
  const basePath = stripLocalePrefix(pathname);
  const t = commonMessages[locale].nav;

  const navItems = [
    { label: t.properties, href: localizePath(locale, '/properties'), match: '/properties' },
    { label: t.services, href: localizePath(locale, '/services'), match: '/services' },
    { label: t.events, href: localizePath(locale, '/events'), match: '/events' },
    { label: t.about, href: localizePath(locale, '/about'), match: '/about' },
    { label: t.blog, href: localizePath(locale, '/blog'), match: '/blog' },
    { label: t.faq, href: localizePath(locale, '/faq'), match: '/faq' },
    { label: t.contact, href: `${localizePath(locale, '/')}#contact`, match: null },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFaded, setIsFaded] = useState(false);
  const lastScrollYRef = useRef(0);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const current = window.scrollY;
      const last = lastScrollYRef.current;

      if (current > last && current > 80) {
        setIsFaded(true);
      } else if (current < last) {
        setIsFaded(false);
      }

      lastScrollYRef.current = current;

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        setIsFaded(false);
      }, 1500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  const fadedClass = isFaded && !isMobileMenuOpen ? ' is-faded' : '';
  const isListingDetail =
    basePath.startsWith('/properties/') && basePath !== '/properties';

  const isActive = (match: string | null) => {
    if (!match) {
      return false;
    }

    return basePath === match || basePath.startsWith(`${match}/`);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`navbar-floating hidden md:block${fadedClass}`}
        role="navigation"
        aria-label={t.mainNavAria}
      >
        <div className="navbar-container-floating">
          <div className="logo-section-floating">
            <Link href={localizePath(locale, '/')} aria-label={t.homeAria} className="nav-brand-floating">
              <span className="nav-logo-slot-floating">
                <Image
                  src="/logo/Logo_beige.png"
                  alt="Or Hakerem"
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="150px"
                />
              </span>
            </Link>
          </div>

          <div className="nav-items-floating">
            {navItems.map((item) => {
              const active = isActive(item.match);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item-floating ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <LocaleSwitcher className="nav-locale-floating" />
            <a
              href="https://wa.me/message/KWYBTW2MTGO2M1"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-whatsapp-floating"
              aria-label={t.whatsappAria}
              onClick={() =>
                trackGaOutboundContact({
                  method: 'whatsapp',
                  location: 'navbar',
                  locale,
                })
              }
            >
              <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true">
                <path fill="white" d="M16 3C9.4 3 4 8.3 4 14.8c0 2.6.9 5 2.4 7L5 29l7-2.3c1.8.9 3.8 1.4 5.9 1.4 6.6 0 12-5.3 12-11.8S22.6 3 16 3zm0 21.5c-1.8 0-3.6-.5-5.2-1.5l-.4-.2-4.1 1.3 1.4-4-.3-.4c-1.1-1.6-1.6-3.4-1.6-5.2C5.8 9.1 10.4 5 16 5s10.2 4.1 10.2 9.8S21.6 24.5 16 24.5zm5.6-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.6-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-1-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9.6.3 1.1.5 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4 0-.1-.1-.2-.3-.3z"/>
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      {!isListingDetail && (
      <nav
        className={`navbar-floating md:hidden${fadedClass}`}
        role="navigation"
        aria-label={t.mainNavAria}
      >
        <div className="navbar-container-floating">
          <div className="logo-section-floating">
            <Link href={localizePath(locale, '/')} aria-label={t.homeAria} className="nav-brand-floating" onClick={closeMobileMenu}>
              <span className="nav-logo-slot-floating">
                <Image
                  src="/logo/Logo_beige.png"
                  alt="Or Hakerem"
                  fill
                  className="object-contain object-left"
                  priority
                  sizes="150px"
                />
              </span>
            </Link>
          </div>
          
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-button-floating"
            aria-label={t.toggleMenuAria}
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
      </nav>
      )}

      {isMobileMenuOpen && (
        <div
          className="mobile-overlay-floating tap-reset"
          onClick={closeMobileMenu}
        >
          <div
            className="mobile-menu-items-floating"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => {
              const active = isActive(item.match);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`mobile-nav-item-floating ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="mobile-nav-item-floating">
              <LocaleSwitcher onNavigate={closeMobileMenu} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
