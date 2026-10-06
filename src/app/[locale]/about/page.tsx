import { MapPin, Shield, UtensilsCrossed } from 'lucide-react';

import { createCanonicalUrl, SITE_URL } from '@/app/seo';
import LiquidGlassCTA from '@/components/LiquidGlassCTA';
import { isLocale, localizePath, type Locale } from '@/i18n/config';
import { aboutMessages } from '@/i18n/messages/about';

const VALUE_POINT_ICONS = [MapPin, Shield, UtensilsCrossed];

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const t = aboutMessages[locale];
  const url = createCanonicalUrl(localizePath(locale, '/about'));
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${url}#about`,
    url,
    name: t.hero.title,
    description: t.hero.body,
    inLanguage: locale,
    mainEntity: { '@id': `${SITE_URL}/#business` },
  };
  const valuePoints = t.distinct.points.map((point, index) => ({
    ...point,
    icon: VALUE_POINT_ICONS[index],
  }));

  return (
    <div className="min-h-screen pt-24 pb-10 md:pb-20" style={{ backgroundColor: '#e8e4dc' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-primary text-white"
        data-animate="fade-up"
      >
        <div className="absolute inset-0">
          <div className="absolute left-10 top-16 h-32 w-32 rounded-full bg-secondary/15 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-tertiary/15 blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 md:py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <span className="mb-3 md:mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-secondary">
              {t.hero.badge}
            </span>
            <h1 className="font-head text-2xl md:text-6xl font-bold leading-tight" data-animate="text">
              {t.hero.title}
            </h1>
            <p className="mt-3 md:mt-6 max-w-3xl text-sm md:text-lg leading-relaxed text-white/90 md:text-xl">
              {t.hero.body}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16" data-animate="fade-up">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="rounded-3xl bg-white p-5 md:p-10 shadow-xl border border-primary/10">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              {t.positioning.kicker}
            </span>
            <h2 className="mt-2 md:mt-4 font-head text-xl md:text-4xl font-bold text-black">
              {t.positioning.heading}
            </h2>
            <p className="mt-3 md:mt-6 text-sm md:text-lg leading-relaxed text-black/80">
              {t.positioning.p1}
            </p>
            <p className="mt-3 md:mt-5 text-sm md:text-lg leading-relaxed text-black/80">
              {t.positioning.p2}
            </p>
          </div>

          <div className="rounded-3xl border border-secondary/20 bg-gradient-to-br from-secondary/10 via-white to-white p-5 md:p-10 shadow-lg">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-tertiary">
              {t.trust.kicker}
            </span>
            <h2 className="mt-2 md:mt-4 font-head text-xl md:text-3xl font-bold text-black">
              {t.trust.heading}
            </h2>
            <p className="mt-3 md:mt-6 text-sm md:text-lg leading-relaxed text-black/80">
              {t.trust.p1}
            </p>
            <p className="mt-3 md:mt-5 text-sm md:text-lg leading-relaxed text-black/80">
              {t.trust.p2}
            </p>
          </div>
        </div>
      </section>

      <section className="py-4" data-animate="fade-up">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-5 md:p-10 shadow-xl border border-primary/10">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                {t.distinct.kicker}
              </span>
              <h2 className="mt-2 md:mt-4 font-head text-xl md:text-4xl font-bold text-black">
                {t.distinct.heading}
              </h2>
            </div>

            <div className="mt-5 md:mt-10 grid gap-3 md:gap-6 md:grid-cols-3">
              {valuePoints.map((point) => (
                <div
                  key={point.title}
                  className="rounded-2xl border border-primary/10 bg-cream p-4 md:p-6"
                >
                  <div className="mb-3 md:mb-4 inline-flex rounded-2xl bg-primary/10 p-2.5 md:p-3 text-black">
                    <point.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-head text-lg md:text-2xl font-semibold text-black">
                    {point.title}
                  </h3>
                  <p className="mt-2 md:mt-4 text-sm md:text-base leading-relaxed text-black/75">
                    {point.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 md:mt-8 rounded-2xl border border-secondary/20 bg-secondary/10 px-5 py-4 md:px-6 md:py-5">
              <p className="text-sm md:text-lg leading-relaxed text-black/80">
                {t.distinct.callout}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16" data-animate="fade-up">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-tertiary/10 via-white to-white p-5 md:p-10 shadow-lg border border-tertiary/10">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-tertiary">
              {t.locationStory.kicker}
            </span>
            <h2 className="mt-2 md:mt-4 font-head text-xl md:text-4xl font-bold text-black">
              {t.locationStory.heading}
            </h2>
            <p className="mt-3 md:mt-6 text-sm md:text-lg leading-relaxed text-black/80">
              {t.locationStory.p1}
            </p>
            <p className="mt-3 md:mt-5 text-sm md:text-lg leading-relaxed text-black/80">
              {t.locationStory.p2}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 md:p-10 shadow-xl border border-primary/10">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
              {t.whyUs.kicker}
            </span>
            <h2 className="mt-2 md:mt-4 font-head text-xl md:text-4xl font-bold text-black">
              {t.whyUs.heading}
            </h2>
            <p className="mt-3 md:mt-6 text-sm md:text-lg leading-relaxed text-black/80">
              {t.whyUs.p1}
            </p>
            <p className="mt-3 md:mt-5 text-sm md:text-lg leading-relaxed text-black/80">
              {t.whyUs.p2}
            </p>
          </div>
        </div>
      </section>

      <section className="py-4" data-animate="fade-up">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-light px-5 py-7 md:px-12 md:py-10 text-center text-white shadow-2xl">
            <div className="mx-auto max-w-3xl">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                {t.explore.badge}
              </span>
              <h2 className="mt-3 md:mt-5 font-head text-xl md:text-4xl font-bold">
                {t.explore.heading}
              </h2>
              <p className="mt-3 md:mt-5 text-sm md:text-lg leading-relaxed text-white/85">
                {t.explore.body}
              </p>
            </div>

            <div className="mt-5 md:mt-8 flex flex-col items-center justify-center gap-3 md:gap-4 sm:flex-row">
              <LiquidGlassCTA href={localizePath(locale, '/properties')} className="liquid-cta--sm">
                {t.explore.viewProperties}
              </LiquidGlassCTA>
              <LiquidGlassCTA href={`${localizePath(locale, '/')}#contact`} className="liquid-cta--sm">
                {t.explore.contactUs}
              </LiquidGlassCTA>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
