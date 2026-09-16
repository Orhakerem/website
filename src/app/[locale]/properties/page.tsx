import React from 'react';
import {
  Bath,
  BedDouble,
  CheckCircle,
  Clock,
  ExternalLink,
  MapPin,
  Shield,
  Users,
  UtensilsCrossed,
  Wifi,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import LiquidGlassCTA from '@/components/LiquidGlassCTA';
import { isLocale, localizePath, type Locale } from '@/i18n/config';
import { propertiesMessages, type PropertiesMessages } from '@/i18n/messages/properties';

export const dynamic = 'force-dynamic';

const STAY_HIGHLIGHT_ICONS = [Wifi, UtensilsCrossed, Shield, Clock];

const propertyMedia = {
  'penthouse-jacuzzi': {
    id: 'penthouse-jacuzzi' as const,
    image: '/penthouse/1-jacuzzi-angle.JPEG',
    maxGuests: 7,
    bedrooms: 3,
    bathrooms: 3,
  },
  'cozy-studio': {
    id: 'cozy-studio' as const,
    image: '/studio/lit_angle_1.jpg',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
  },
};

type PropertyMedia = (typeof propertyMedia)[keyof typeof propertyMedia];

function PropertyCard({
  property,
  locale,
  t,
}: {
  property: PropertyMedia;
  locale: Locale;
  t: PropertiesMessages;
}) {
  const propertyHref = localizePath(locale, `/properties/${property.id}`);
  const card = t.cards[property.id];

  return (
    <article
      data-animate="scale"
      className="property-card relative aspect-square overflow-hidden rounded-[4px] bg-white shadow-xl flex flex-col"
    >
      <Link
        href={propertyHref}
        aria-label={t.viewAria(card.title)}
        className="absolute inset-0 z-10 rounded-[4px]"
      />

      {/* Image Section - Square format - Clean without price and heart */}
      <div className="property-card-image relative flex-1 min-h-0 overflow-hidden pointer-events-none" data-animate="zoom">
        <Image
          src={property.image}
          alt={card.title}
          fill
          className="object-cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 40vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      {/* Content Section - Bottom half */}
      <div className="property-card-content pointer-events-none px-6 py-4 flex flex-col relative z-20">
        {/* Title */}
        <div className="property-card-copy mb-4 pointer-events-none">
          <h2 className="line-clamp-2 font-head text-xl font-bold text-black">
            {card.title}
          </h2>
        </div>

        {/* Property Stats - Compact */}
        <div className="property-card-stats grid grid-cols-3 gap-2 p-3 bg-cream rounded-[10px] pointer-events-none">
          <div className="text-center">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1">
              <Users className="w-3 h-3 text-black" />
            </div>
            <div className="text-xs font-semibold text-black">{property.maxGuests}</div>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1">
              <BedDouble className="w-3 h-3 text-black" />
            </div>
            <div className="text-xs font-semibold text-black">{property.bedrooms}</div>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-1">
              <Bath className="w-3 h-3 text-black" />
            </div>
            <div className="text-xs font-semibold text-black">{property.bathrooms}</div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Properties({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const t = propertiesMessages[locale];

  return (
    <div className="min-h-screen pt-28 pb-10 md:pb-20 md:pt-32" style={{ backgroundColor: '#e8e4dc' }}>
      <BreadcrumbSchema locale={params.locale} path="/properties" label="properties" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16" data-animate="fade-up">
          <h1 className="font-head text-3xl md:text-6xl font-bold text-black mb-0 leading-tight" data-animate="text">
            {t.heroTitle}
          </h1>
        </div>

        {/* Properties Grid - Square Cards */}
        <div id="properties-listing" className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8 md:mb-16 scroll-mt-32" data-animate-group="cards">
          {Object.values(propertyMedia).map((property) => (
            <PropertyCard key={property.id} property={property} locale={locale} t={t} />
          ))}
        </div>

        <section className="max-w-6xl mx-auto mb-8 md:mb-16" data-animate="fade-up">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="rounded-[10px] bg-white p-5 md:p-10 shadow-xl border border-primary/10">
              <span className="text-secondary font-semibold text-sm md:text-base tracking-[0.2em] uppercase block mb-3">
                {t.experience.kicker}
              </span>
              <h2 className="font-head text-xl md:text-4xl font-bold text-black mb-3 md:mb-5">
                {t.experience.heading}
              </h2>
              <p className="text-black/80 text-sm md:text-lg leading-relaxed">{t.experience.p1}</p>
              <p className="text-black/80 text-sm md:text-lg leading-relaxed mt-3 md:mt-5">{t.experience.p2}</p>

              <div className="mt-5 md:mt-8 rounded-[10px] bg-cream border border-primary/10 px-4 py-4 md:px-6 md:py-6">
                <h3 className="font-head text-lg md:text-2xl font-semibold text-black mb-3 md:mb-4">
                  {t.experience.onFootHeading}
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {t.experience.neighborhoodHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start text-sm md:text-base text-black/80">
                      <CheckCircle className="w-5 h-5 text-secondary me-3 mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative" data-animate="zoom">
              <div className="relative h-[240px] md:h-[540px] overflow-hidden rounded-[6px] shadow-2xl">
                <Image
                  src="/penthouse/7-vue-mer.jpg"
                  alt={t.experience.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>

              <div className="absolute -bottom-5 start-5 end-5 md:start-auto md:end-6 md:max-w-xs rounded-[10px] bg-white p-4 md:p-5 shadow-xl border border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-black">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-head text-2xl font-bold text-black">{t.experience.rating}</div>
                    <div className="text-sm text-black/70">{t.experience.ratingLabel}</div>
                  </div>
                </div>
                <p className="text-sm text-black/75 leading-relaxed">{t.experience.ratingBody}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto mb-8 md:mb-16" data-animate="fade-up">
          <div className="rounded-[10px] bg-gradient-to-r from-secondary/20 via-primary/15 to-secondary/20 border border-primary/30 px-4 py-4 md:px-8 md:py-6 text-center shadow-md">
            <p className="font-head text-base md:text-2xl font-semibold text-black">{t.directBanner}</p>
          </div>
        </div>

        <section className="max-w-6xl mx-auto mb-8 md:mb-16" data-animate="fade-up">
          <div className="text-center mb-5 md:mb-10">
            <span className="text-black font-semibold text-sm md:text-base tracking-[0.2em] uppercase block mb-3">
              {t.included.kicker}
            </span>
            <h2 className="font-head text-xl md:text-4xl font-bold text-black">
              {t.included.heading}
            </h2>
          </div>

          <div className="grid gap-5 md:gap-10 md:grid-cols-2 xl:grid-cols-4">
            {t.included.highlights.map((highlight, index) => {
              const HighlightIcon = STAY_HIGHLIGHT_ICONS[index];
              return (
              <div key={highlight.title}>
                <HighlightIcon className="w-7 h-7 text-black mb-3 md:mb-4" />
                <h3 className="font-head text-lg md:text-2xl font-semibold text-black mb-2 md:mb-3">
                  {highlight.title}
                </h3>
                <p className="text-sm md:text-base text-black/75 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
              );
            })}
          </div>
        </section>

        <div className="max-w-6xl mx-auto mb-8 md:mb-16">
          <hr className="border-t border-black/10" />
        </div>

        <section className="max-w-4xl mx-auto mb-8 md:mb-16" data-animate="fade-up">
          <div className="text-center mb-5 md:mb-10">
            <span className="text-black font-semibold text-sm md:text-base tracking-[0.2em] uppercase block mb-3">
              {t.landmarks.kicker}
            </span>
            <h2 className="font-head text-xl md:text-4xl font-bold text-black">
              {t.landmarks.heading}
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {t.landmarks.items.map((landmark) => (
              <div key={landmark.name} className="text-center">
                <MapPin className="w-5 h-5 mx-auto mb-3 text-black" />
                <h3 className="font-head text-base md:text-xl font-semibold text-black mb-1">
                  {landmark.name}
                </h3>
                <p className="text-black/70 font-medium">{landmark.distance}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto mb-8 md:mb-16">
          <hr className="border-t border-black/10" />
        </div>

        <section className="max-w-6xl mx-auto mb-8 md:mb-16" data-animate="fade-up">
          <div className="text-center mb-5 md:mb-10">
            <span className="text-black font-semibold text-sm md:text-base tracking-[0.2em] uppercase block mb-3">
              {t.platforms.kicker}
            </span>
            <h2 className="font-head text-xl md:text-4xl font-bold text-black">
              {t.platforms.heading}
            </h2>
            <p className="text-black/70 mt-3 md:mt-4 text-sm md:text-base max-w-2xl mx-auto">
              {t.platforms.body}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="text-center">
              <h3 className="font-head text-lg md:text-2xl font-semibold text-black mb-2">
                {t.cards['penthouse-jacuzzi'].title}
              </h3>
              <p className="text-black/70 text-sm mb-5">{t.platforms.penthouseAvailability}</p>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <LiquidGlassCTA
                  href="https://www.airbnb.com/rooms/1247678225456455722"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-cta--xs liquid-cta--light"
                >
                  <span>{t.platforms.viewOnAirbnb}</span>
                  <ExternalLink className="w-4 h-4 ms-2" />
                </LiquidGlassCTA>
                <LiquidGlassCTA
                  href="https://www.booking.com/hotel/il/penthouse-with-jacuzzi-bbq-2mn-from-sea-or-hakerem.fr.html?label=gen173bo-10CAsoakIycGVudGhvdXNlLXdpdGgtamFjdXp6aS1iYnEtMm1uLWZyb20tc2VhLW9yLWhha2VyZW1IM1gDaGqIAQGYATO4AQfIAQzYAQPoAQH4AQGIAgGYAgaoAgG4ArzUsNAGwAIB0gIkODQ1YTJkYmItOWI2NS00YWUwLTg4ZGEtNGUwMGJiNTAyMjZl2AIB4AIB&sid=d76cf1f6818f7b442a6ed091d7429070&dist=0&keep_landing=1&sb_price_type=total&type=total&"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-cta--xs liquid-cta--light"
                >
                  <span>{t.platforms.viewOnBooking}</span>
                  <ExternalLink className="w-4 h-4 ms-2" />
                </LiquidGlassCTA>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-head text-lg md:text-2xl font-semibold text-black mb-2">
                {t.cards['cozy-studio'].title}
              </h3>
              <p className="text-black/70 text-sm mb-5">{t.platforms.studioAvailability}</p>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                <LiquidGlassCTA
                  href="https://www.airbnb.com/rooms/1273005083237819919"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-cta--xs liquid-cta--light"
                >
                  <span>{t.platforms.viewOnAirbnb}</span>
                  <ExternalLink className="w-4 h-4 ms-2" />
                </LiquidGlassCTA>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
