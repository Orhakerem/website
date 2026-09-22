import { getVenueRental } from '@/lib/event-pricing-data';
import type { Locale } from '@/i18n/config';
import type { EventsMessages } from '@/i18n/messages/events';

interface EventPricingProps {
  locale: Locale;
  t: EventsMessages['pricing'];
}

export default function EventPricing({ locale, t }: EventPricingProps) {
  const rental = getVenueRental(locale);

  return (
    <section
      id="pricing"
      className="events-pricing-section mb-6 md:mb-10"
      data-animate="fade-up"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Primary block — Venue Rental */}
        <div className="text-center mb-12" data-animate="fade-up">
          <div className="inline-block mb-4">
            <span className="text-tertiary font-semibold text-lg tracking-wider uppercase">
              {t.kicker}
            </span>
          </div>
          <h2
            className="font-head text-2xl md:text-5xl font-bold text-black mb-4 leading-tight"
            data-animate="text"
          >
            {t.heading}
          </h2>
          <p className="text-black/80 text-sm md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t.body}
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <article
            className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-secondary/30 hover:shadow-2xl transition-shadow"
            data-animate="scale"
          >
            <h3 className="font-head text-lg md:text-3xl font-bold text-black">
              {rental.label}
            </h3>
            <div className="my-6">
              <div className="flex items-baseline gap-1 flex-wrap" dir="ltr">
                <span className="font-head text-5xl md:text-6xl font-bold text-black">
                  {rental.price.toLocaleString('en-US')}
                </span>
                <span className="font-head text-3xl md:text-4xl font-bold text-black">
                  ₪
                </span>
              </div>
              <span className="block text-black/70 text-sm mt-2">
                {rental.priceSuffix}
              </span>
            </div>
            <ul className="space-y-2 text-black/80">
              {rental.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="text-tertiary" aria-hidden>
                    •
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
