'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { isLocale, localizePath, type Locale } from '@/i18n/config';
import { contactMessages } from '@/i18n/messages/contact';
import { trackGaOutboundContact } from '@/lib/ga-events';

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const t = contactMessages[locale];

  return (
    <div className="min-h-screen pt-24 pb-10 md:pb-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Back Navigation */}
        <div className="mb-5 md:mb-8" data-animate="fade-right">
          <Link
            href={localizePath(locale, '/')}
            className="inline-flex items-center rounded-full border border-primary/20 bg-white/80 px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg font-semibold text-black shadow-lg transition-all duration-300"
          >
            <div className="relative me-3">
              <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
            </div>
            <Home className="w-5 h-5 me-2 opacity-70" />
            <span className="relative z-10">{t.backToHome}</span>
          </Link>
        </div>

        {/* Contact Section */}
        <section className="py-8 md:py-20 bg-gradient-to-br from-primary via-primary to-primary-light relative overflow-hidden rounded-3xl" data-animate="fade-up">
          {/* Background decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-tertiary/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 animate-pulse"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-5 md:mb-8" data-animate="fade-up">
              <h1 className="font-head text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight" data-animate="text" data-delay="1">
                {t.heading}
              </h1>
              <p className="text-white/90 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed" data-animate="fade-up" data-delay="2">
                {t.body}
              </p>
            </div>
            <ContactForm
              variant="default"
            />
          </div>
        </section>

        {/* Additional Contact Information */}
        <section className="mt-8 md:mt-16 bg-white rounded-2xl shadow-xl p-5 md:p-12" data-animate="fade-up">
          <div className="text-center mb-5 md:mb-8">
            <h2 className="font-head text-xl md:text-3xl font-bold text-black mb-3 md:mb-4" data-animate="text">
              {t.otherWays.heading}
            </h2>
            <p className="text-black/80 text-sm md:text-lg">
              {t.otherWays.subheading}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-animate-group="cards">
            {/* Email */}
            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-full mb-3 md:mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-head text-base md:text-xl font-bold text-black mb-2">{t.otherWays.emailTitle}</h3>
              <a 
                href="mailto:keremliving@gmail.com"
                className="font-medium text-black/80"
              >
                keremliving@gmail.com
              </a>
            </div>

            {/* Phone / WhatsApp */}
            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-tertiary to-tertiary-light rounded-full mb-3 md:mb-4">
                <span className="text-2xl text-white">📞</span>
              </div>
              <h3 className="font-head text-base md:text-xl font-bold text-black mb-2">{t.otherWays.phoneTitle}</h3>
              <div className="space-y-3">
                <a 
                  href="tel:+33651179925"
                  className="block font-medium text-black/80"
                  dir="ltr"
                >
                  +33 6 51 17 99 25
                </a>
                <a 
                  href="https://wa.me/message/KWYBTW2MTGO2M1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-secondary to-secondary-light px-5 py-2.5 font-semibold text-black shadow-lg transition-all duration-300"
                  dir="ltr"
                  onClick={() =>
                    trackGaOutboundContact({
                      method: 'whatsapp',
                      location: 'contact_page',
                      locale,
                    })
                  }
                >
                  {t.otherWays.whatsappCta}
                </a>
              </div>
            </div>

            {/* Instagram */}
            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-cream to-white rounded-xl border border-secondary/20">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-primary-light rounded-full mb-3 md:mb-4">
                <span className="text-2xl text-white">📱</span>
              </div>
              <h3 className="font-head text-base md:text-xl font-bold text-black mb-2">{t.otherWays.socialTitle}</h3>
              <a 
                href="https://www.instagram.com/or_hakerem/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-black/80"
              >
                @or_hakerem
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
