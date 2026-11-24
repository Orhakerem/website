import FAQ from '@/components/FAQ';
import Image from 'next/image';
import HeroAnimatedTitle from '@/components/HeroAnimatedTitle';
import HomeHeroVideo from '@/components/HomeHeroVideo';
import LiquidGlassCTA from '@/components/LiquidGlassCTA';
import HomeContactForm from '@/components/HomeContactForm';
import { ContactCard } from '@/components/ContactCard';
import { Mail, Phone, Instagram, Facebook } from 'lucide-react';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import MapEmbed from '@/components/MapEmbed';
import { isLocale, localizePath, type Locale } from '@/i18n/config';
import { homeMessages } from '@/i18n/messages/home';
import { GOOGLE_BUSINESS_PROFILE_URL } from '@/lib/business-schema';
import { getVideoStructuredData } from '@/lib/site-schema';
import { getHomeHeroVideo } from '@/lib/site-videos';

export default function Home({ params }: { params: { locale: string } }) {
  const locale: Locale = isLocale(params.locale) ? params.locale : 'en';
  const t = homeMessages[locale];
  const heroVideoSchema = getVideoStructuredData(getHomeHeroVideo(locale), localizePath(locale, '/'));

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heroVideoSchema) }}
      />
      {/* Hero Section with Video Background - No Margin Top */}
      <div className="hero-home relative w-full h-screen overflow-hidden">
        <div className="hero-home-media absolute inset-0">
          {/* Poster is the LCP image; the video loads after the page */}
          <HomeHeroVideo />
          <div className="hero-home-overlay absolute inset-0"></div>
          {/* Fallback for browsers that don't support video */}
          <div className="hero-home-fallback absolute inset-0 bg-primary"></div>
        </div>

        {/* Desktop / large tablet overlay */}
        <div className="hero-title hero-home-title">
          <HeroAnimatedTitle titles={t.hero.titles} />
        </div>

        <div className="glass-cta-wrap hero-home-cta-wrap">
          <LiquidGlassCTA href={locale === 'en' ? '/properties' : `/${locale}/properties`}>
            {t.hero.viewProperties}
          </LiquidGlassCTA>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="py-8 md:py-16 bg-cream relative overflow-hidden rounded-3xl mx-4">
        <div className="absolute inset-0">
          <div className="absolute top-6 left-6 w-16 h-16 bg-secondary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 bg-tertiary/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(152px,1fr)] items-center gap-4 sm:gap-8 lg:gap-16">
            <div className="min-w-0 text-start">
              <div className="mb-2 sm:mb-6">
                <h2 className="font-head text-2xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-3 md:mb-6">
                  {t.welcome.heading}
                </h2>
              </div>

              {/* Mobile: concise version, height ≈ video */}
              <div className="block sm:hidden max-w-3xl text-sm leading-relaxed">
                <p className="text-black/90 font-light font-body">{t.welcome.introMobile}</p>
              </div>

              {/* Desktop: full version */}
              <div className="hidden sm:block max-w-3xl space-y-6 text-lg md:text-xl">
                <p className="text-black/90 leading-relaxed font-light font-body">{t.welcome.p1Desktop}</p>

                <p className="text-black/80 leading-relaxed font-light font-body">{t.welcome.p2Desktop}</p>

                <p className="text-black/85 leading-relaxed font-light font-body">{t.welcome.p3Desktop}</p>

                <p className="text-black/85 leading-relaxed font-light font-body">{t.welcome.p4Desktop}</p>
              </div>
            </div>

            <div className="relative min-h-[170px] sm:min-h-[440px] lg:min-h-[620px] overflow-hidden rounded-md border border-primary/10 shadow-2xl" data-animate="slide-in-right">
              <Image
                src="/studio/Salon_angle_3_Zoom.jpg"
                alt={t.welcome.imageAlt}
                fill
                loading="eager"
                quality={70}
                className="object-cover"
                sizes="(max-width: 640px) 45vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* White Separator */}
      <div className="home-section-divider h-12 bg-white"></div>

      {/* Location Section */}
      <section className="home-location-section py-16 bg-primary relative overflow-hidden rounded-3xl mx-4">
        <div className="absolute inset-0">
          <div className="absolute top-6 left-6 w-16 h-16 bg-secondary/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-6 right-6 w-20 h-20 bg-tertiary/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
            <div className="w-full rounded-[5px] overflow-hidden shadow-xl border border-primary/10 order-2 lg:order-1" data-animate="zoom">
              <MapEmbed />
            </div>

            <div className="order-1 lg:order-2">
              <div className="home-location-header mb-6" data-animate="fade-up">
                <span className="text-secondary font-semibold text-lg tracking-[0.2em] uppercase block mb-3">
                  {t.location.kicker}
                </span>
                <h2 className="font-head text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight" data-animate="text" data-delay="1">
                  {t.location.heading}
                </h2>
              </div>

              <div className="home-location-content w-full" data-animate="fade-up" data-delay="2">
                <p className="text-white/90 text-lg md:text-xl leading-relaxed font-light mb-8 hidden lg:block">
                  {t.location.beforeAddress}
                  <span className="font-medium text-secondary">{t.location.address}</span>
                  {t.location.afterAddress}
                </p>

                <div className="text-center hidden lg:block" data-animate="scale" data-delay="3">
                  <LiquidGlassCTA
                    href={GOOGLE_BUSINESS_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.location.openMaps}
                  </LiquidGlassCTA>
                </div>
              </div>
            </div>

            {/* Responsive-only CTA: appears under the map (<lg) */}
            <div className="order-last text-center lg:hidden" data-animate="scale" data-delay="3">
              <LiquidGlassCTA
                href={GOOGLE_BUSINESS_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.location.openMaps}
              </LiquidGlassCTA>
            </div>
          </div>
        </div>
      </section>

     {/* White Separator */}
      <div className="home-section-divider h-12 bg-white"></div>

      {/* Contact Section */}
      <section id="contact" className="home-contact-section py-16 bg-cream relative overflow-hidden mx-4" data-animate="fade-up">
        <div className="max-w-6xl mx-auto px-3 md:px-4 relative z-10">
          <div className="text-center mb-10" data-animate="fade-up">
            <h2 className="font-head text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight" data-animate="text" data-delay="1">
              {t.contact.heading}
            </h2>
          </div>
          <ContactCard
            description={t.contact.description}
            contactInfo={[
              {
                icon: Mail,
                label: t.contact.emailLabel,
                value: 'orhakerem@45beach.com',
                href: 'mailto:orhakerem@45beach.com',
              },
              {
                icon: Phone,
                label: t.contact.phoneLabel,
                value: '+33 6 51 17 99 25 · +972 58 577 8891',
                href: 'tel:+33651179925',
              },
              {
                icon: Instagram,
                label: t.contact.instagramLabel,
                value: '@or_hakerem',
                href: 'https://www.instagram.com/or_hakerem/',
              },
              {
                icon: Facebook,
                label: t.contact.facebookLabel,
                value: 'Or Hakerem',
                href: 'https://www.facebook.com/profile.php?id=61583829025542',
              },
            ]}
          >
            <HomeContactForm theme="light" />
          </ContactCard>
        </div>
      </section>

         {/* White Separator */}
      <div className="home-section-divider h-12 bg-white"></div>

      {/* Testimonials Carousel */}
      <div data-animate="fade-up">
        <TestimonialsCarousel />
      </div>

      {/* FAQ Section */}
      <div data-animate="fade-up">
        <FAQ />
      </div>
    </div>
  );
}
