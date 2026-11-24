import { BedDouble, ExternalLink, Maximize2, Users } from 'lucide-react';
import Image from 'next/image';

import type { Locale } from '@/i18n/config';
import type { PropertiesMessages } from '@/i18n/messages/properties';
import { BEACH45_LISTINGS, beach45ListingUrl, beach45Url, type Beach45Listing } from '@/lib/beach45';

type Props = { locale: Locale; t: PropertiesMessages['beach45'] };

const platformLinkClass =
  'inline-flex items-center justify-center gap-1.5 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black transition-colors hover:border-black/40';

function ListingCover({ listing, name }: { listing: Beach45Listing; name: string }) {
  if (listing.image) {
    return (
      <Image
        src={listing.image}
        alt={name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-cream">
      <Image src="/45beach/45beach-mark.svg" alt="" width={64} height={64} className="opacity-60" />
    </div>
  );
}

function ListingCard({ listing, locale, t }: { listing: Beach45Listing } & Props) {
  const { name, tagline } = listing.text[locale];
  const href = beach45ListingUrl(locale, listing);

  const body = (
    <>
      <div className="relative aspect-[3/2] overflow-hidden bg-cream">
        <ListingCover listing={listing} name={name} />
        {!href ? (
          <span className="absolute top-3 start-3 rounded-full bg-black/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white">
            {t.comingSoon}
          </span>
        ) : null}
      </div>
      <div className="px-5 pt-4">
        <h3 className="font-head text-lg font-bold text-black flex items-center gap-2">
          <span className="line-clamp-1">{name}</span>
          {href ? <ExternalLink className="h-3.5 w-3.5 shrink-0 text-black/40" aria-hidden="true" /> : null}
        </h3>
        <p className="mt-1 text-sm text-black/65 line-clamp-1">{tagline}</p>
        {listing.guests !== null ? (
          <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-black/75">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <dt className="sr-only">{t.guests}</dt>
              <dd>{listing.guests}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <BedDouble className="h-3.5 w-3.5" aria-hidden="true" />
              <dt className="sr-only">{t.beds}</dt>
              <dd>{listing.beds}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
              <dt className="sr-only">{t.size}</dt>
              <dd dir="ltr">{listing.sizeSqm} m²</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </>
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-[6px] bg-white shadow-lg">
      {href ? (
        <a href={href} target="_blank" rel="noopener" aria-label={t.viewAria(name)} className="block">
          {body}
        </a>
      ) : (
        <div>{body}</div>
      )}

      {/* Platform links — Booking.com appears once `booking` is filled in src/lib/beach45.ts */}
      <div className="mt-auto flex flex-wrap gap-2 px-5 pb-5 pt-4">
        <a href={listing.airbnb} target="_blank" rel="noopener noreferrer" className={platformLinkClass}>
          {t.airbnb}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
        {listing.booking ? (
          <a href={listing.booking} target="_blank" rel="noopener noreferrer" className={platformLinkClass}>
            {t.booking}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default function Beach45Listings({ locale, t }: Props) {
  return (
    <section id="studios-45beach" className="max-w-6xl mx-auto mb-8 md:mb-16 scroll-mt-32" data-animate="fade-up">
      <div className="text-center mb-6 md:mb-10">
        <span className="text-black font-semibold text-sm md:text-base tracking-[0.2em] uppercase block mb-3">
          {t.kicker}
        </span>
        <h2 className="font-head text-xl md:text-4xl font-bold text-black">{t.heading}</h2>
        <p className="text-black/70 mt-3 md:mt-4 text-sm md:text-base max-w-2xl mx-auto">{t.body}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BEACH45_LISTINGS.map((listing) => (
          <ListingCard key={listing.number} listing={listing} locale={locale} t={t} />
        ))}
      </div>

      <p className="mt-6 md:mt-8 text-center">
        <a
          href={beach45Url(locale, '/apartments')}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 text-sm font-semibold text-black underline underline-offset-4 hover:text-black/70"
        >
          {t.allListings}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </p>
    </section>
  );
}
