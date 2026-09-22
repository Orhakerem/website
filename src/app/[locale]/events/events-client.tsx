'use client';

import { ArrowUp, ChevronDown, Mail, Phone, X } from 'lucide-react';
import toast from 'react-hot-toast';

import React, { useState, useEffect, useRef } from 'react';

import { sendEmail } from '@/actions/email';
import BookingSingleDateCalendar from '@/components/BookingSingleDateCalendar';
import EventPricing from '@/components/EventPricing';
import LiquidGlassButton from '@/components/LiquidGlassButton';
import LiquidGlassCTA from '@/components/LiquidGlassCTA';
import { useBackToTopVisibility } from '@/hooks/useBackToTopVisibility';
import { formatIsoDate } from '@/lib/booking-dates';
import type { CalendarSyncStatus } from '@/lib/bookable-properties';
import { eventCleaningFee, getVenueRental } from '@/lib/event-pricing-data';
import { trackMetaLead } from '@/lib/meta-events';
import { trackGaLead } from '@/lib/ga-events';
import { useLocale } from '@/i18n/useLocale';
import { eventsMessages } from '@/i18n/messages/events';

interface EventsClientProps {
  blockedDates: readonly string[];
  availabilityStatus: CalendarSyncStatus;
}

export default function EventsClient({
  blockedDates,
  availabilityStatus,
}: EventsClientProps) {
  const locale = useLocale();
  const t = eventsMessages[locale];
  const eventTypes = t.eventTypes;
  const venueAmenityGroups = t.venues.amenityGroups;
  const venueRental = getVenueRental(locale);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [eventDate, setEventDate] = useState<string | null>(null);
  const showBackToTop = useBackToTopVisibility();
  const videoRef = useRef<HTMLVideoElement>(null);

  const eventQuote = eventDate
    ? {
        venuePrice: venueRental.price,
        cleaningFee: eventCleaningFee,
        total: venueRental.price + eventCleaningFee,
      }
    : null;

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay was prevented, video will show first frame
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventDate) {
      toast.error(t.form.missingDate);
      setIsDatePickerOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('property', 'Event Space Request');

      const result = await sendEmail(formData);
      if (result.success) {
        trackMetaLead({
          leadType: 'event_inquiry',
          formLocation: 'events',
          locale,
        });
        trackGaLead({
          leadType: 'event_inquiry',
          formLocation: 'events',
          locale,
        });
        toast.success(result.message || t.form.success);
        setShowForm(false);
        setIsDatePickerOpen(false);
      } else {
        toast.error(result.error || t.form.errorGeneric);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(t.form.errorSubmit);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (showForm) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showForm]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8e4dc' }}>
      {/* Video Section - Full Width */}
      <section className="hero-section relative w-full h-[55vh] min-h-[340px] md:h-[75vh] md:min-h-[600px] pt-20 bg-primary" data-animate="fade-up">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-events-2-poster.webp"
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-events-2.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/30 z-[1]"></div>

        {/* Hero Title - Positioned at bottom of video */}
        <div className="absolute bottom-[9vh] md:bottom-16 left-0 right-0 z-10">
          <div className="text-center px-4">
            <h1 className="font-head text-2xl md:text-4xl lg:text-5xl font-bold text-secondary animate-fadeInUp drop-shadow-lg" data-animate="text">
              {t.hero.title}
            </h1>
            <p className="max-w-3xl mx-auto mt-2 md:mt-4 text-sm md:text-base md:text-lg text-white/90 leading-relaxed" data-animate="fade-up">
              {t.hero.body}
            </p>
            <div className="events-hero-cta mt-4 md:mt-7 flex justify-center" data-animate="fade-up">
              <LiquidGlassCTA onClick={() => setShowForm(true)}>{t.hero.cta}</LiquidGlassCTA>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-8 md:pb-20">

        <EventPricing locale={locale} t={t.pricing} />

        {/* Availability Section - synced to penthouse calendar */}
        <section id="availability" className="events-availability-section py-6 md:py-10 mb-8 md:mb-12" data-animate="fade-up">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-5 md:mb-6" data-animate="fade-up">
              <span className="text-tertiary font-semibold text-sm md:text-base tracking-[0.2em] uppercase block mb-3">
                {t.availability.kicker}
              </span>
              <h2 className="font-head text-2xl md:text-4xl lg:text-5xl font-bold text-black leading-tight" data-animate="text">
                {t.availability.heading}
              </h2>
              <p className="mt-3 md:mt-6 text-black/80 text-sm md:text-xl leading-relaxed max-w-3xl mx-auto">
                {t.availability.body}
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <BookingSingleDateCalendar
                value={eventDate}
                blockedDates={blockedDates}
                availabilityStatus={availabilityStatus}
                desktopMonths={2}
                onChange={(nextDate) => setEventDate(nextDate)}
              />

              {eventQuote ? (
                <div className="mt-6 bg-white rounded-[10px] p-6 border border-primary/10 shadow-sm">
                  <div className="space-y-2 text-sm md:text-base text-black/80">
                    <div className="flex items-center justify-between gap-4">
                      <span>{t.availability.venueRental}</span>
                      <span className="whitespace-nowrap" dir="ltr">
                        {eventQuote.venuePrice.toLocaleString('en-US')} ₪
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>{t.availability.cleaningFee}</span>
                      <span className="whitespace-nowrap" dir="ltr">
                        {eventQuote.cleaningFee.toLocaleString('en-US')} ₪
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-primary/10 pt-3 text-black">
                      <span className="font-semibold">{t.availability.total}</span>
                      <span className="font-head text-xl font-bold whitespace-nowrap" dir="ltr">
                        {eventQuote.total.toLocaleString('en-US')} ₪
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-black/60 text-xs md:text-sm">
                    {t.availability.priceNote}
                  </p>
                </div>
              ) : null}

              <div className="mt-6 md:mt-8 text-center" data-animate="fade-up">
                <LiquidGlassButton onClick={() => setShowForm(true)}>
                  {t.availability.reserveCta}
                </LiquidGlassButton>
                <p className="mt-3 text-black/60 text-xs md:text-sm font-medium">
                  {t.availability.getQuoteCta}
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Event Spaces Section - Flat editorial */}
        <section id="venues" className="events-venues-section mb-6 md:mb-10" data-animate="fade-up">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center" data-animate="fade-up">
              <span className="text-black font-semibold text-sm md:text-base tracking-[0.2em] uppercase block mb-3">
                {t.venues.kicker}
              </span>
              <h2 className="font-head text-2xl md:text-4xl lg:text-5xl font-bold text-black leading-tight" data-animate="text">
                {t.venues.heading}
              </h2>
              <p className="mt-3 md:mt-6 text-black/80 text-sm md:text-xl leading-relaxed max-w-3xl mx-auto">
                {t.venues.body}
              </p>
            </div>

            {/* Pillars — flat 2-col split, hairline divider */}
            <div className="mt-7 md:mt-16 grid gap-6 md:grid-cols-2 md:gap-12" data-animate="fade-up">
              <div>
                <span className="text-secondary font-semibold text-xs tracking-[0.22em] uppercase block mb-3">
                  {t.venues.jewishEventsKicker}
                </span>
                <p className="text-black/80 leading-relaxed">
                  {t.venues.jewishEventsBody}
                </p>
              </div>
              <div className="md:border-s md:border-primary/15 md:ps-12">
                <span className="text-tertiary font-semibold text-xs tracking-[0.22em] uppercase block mb-3">
                  {t.venues.trustedKicker}
                </span>
                <p className="text-black/80 leading-relaxed">
                  {t.venues.trustedBody}
                </p>
              </div>
            </div>

            {/* Event types — flat chips */}
            <div className="mt-8 md:mt-20 text-center" data-animate="fade-up">
              <span className="text-black font-semibold text-sm tracking-[0.2em] uppercase block mb-3 md:mb-6">
                {t.venues.perfectForKicker}
              </span>
              <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto" data-animate-group="cards">
                {eventTypes.map((event) => (
                  <span
                    key={event}
                    className="rounded-full border border-primary/20 px-4 py-1.5 text-sm text-black/80"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>

            {/* Features & amenities — 3 clusters */}
            <div className="mt-8 md:mt-20" data-animate="fade-up">
              <div className="text-center mb-5 md:mb-10">
                <span className="text-black font-semibold text-sm tracking-[0.2em] uppercase block mb-3">
                  {t.venues.amenitiesKicker}
                </span>
                <h3 className="font-head text-lg md:text-3xl font-bold text-black">
                  {t.venues.amenitiesHeading}
                </h3>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
                {venueAmenityGroups.map((group) => (
                  <div key={group.title}>
                    <h4 className="font-head text-lg font-semibold text-black mb-4">
                      {group.title}
                    </h4>
                    <ul className="space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex gap-3 text-black/80 leading-relaxed">
                          <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-primary/40" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {showForm && (
        <div
          className="event-modal tap-reset fixed inset-0 z-50 bg-black/55 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-inquiry-title"
          onClick={() => setShowForm(false)}
        >
          <div
            className="event-form-wrap w-full flex items-start justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="event-form w-full max-w-xl overflow-y-auto rounded-2xl border border-primary/10 bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-primary/10 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-5">
                <div>
                  <h3 id="event-inquiry-title" className="font-head text-2xl font-bold text-black">
                    {t.form.title}
                  </h3>
                  <p className="mt-1 text-sm text-black/65">
                    {t.form.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setIsDatePickerOpen(false);
                  }}
                  className="tap-reset -me-1 shrink-0 p-2 text-black/55 transition hover:text-black"
                >
                  <span className="sr-only">{t.form.close}</span>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-4 py-4 sm:px-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="checkIn" value={eventDate ?? ''} />
                  <input type="hidden" name="contactMethod" value="email" />

                  <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
                    <div>
                      <label
                        htmlFor="eventType"
                        className="mb-1.5 block text-sm font-medium text-black/80"
                      >
                        {t.form.eventTypeLabel}
                      </label>
                      <select
                        id="eventType"
                        name="eventType"
                        required
                        className="h-11 w-full rounded-lg border border-primary/15 bg-white px-3 text-sm text-black focus:border-black/15 focus:ring-2 focus:ring-black/10"
                      >
                        <option value="">{t.form.selectType}</option>
                        <option value="wedding">{t.form.typeOptions.wedding}</option>
                        <option value="bar-mitzvah">{t.form.typeOptions.barMitzvah}</option>
                        <option value="brit-mila">{t.form.typeOptions.britMila}</option>
                        <option value="birthday">{t.form.typeOptions.birthday}</option>
                        <option value="bachelor">{t.form.typeOptions.bachelor}</option>
                        <option value="heena">{t.form.typeOptions.heena}</option>
                        <option value="dinner">{t.form.typeOptions.dinner}</option>
                        <option value="cocktail">{t.form.typeOptions.cocktail}</option>
                        <option value="other">{t.form.typeOptions.other}</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="guestCount"
                        className="mb-1.5 block text-sm font-medium text-black/80"
                      >
                        {t.form.guestsLabel}
                      </label>
                      <input
                        type="number"
                        id="guestCount"
                        name="guestCount"
                        required
                        min="1"
                        max="80"
                        className="h-11 w-full rounded-lg border border-primary/15 bg-white px-3 text-sm text-black focus:border-black/15 focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="mb-1.5 block text-sm font-medium text-black/80">
                      {t.form.eventDateLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen((isOpen) => !isOpen)}
                      className="tap-reset flex w-full items-center justify-between gap-3 rounded-xl border border-primary/15 bg-cream/60 px-4 py-3 text-start transition hover:border-primary/30"
                      aria-expanded={isDatePickerOpen}
                    >
                      <span>
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
                          {eventDate ? t.form.selectedDate : t.form.chooseDate}
                        </span>
                        <span className="mt-1 block font-head text-lg font-semibold text-black">
                          {eventDate ? formatIsoDate(eventDate) : t.form.addEventDate}
                        </span>
                      </span>
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>
                    {isDatePickerOpen ? (
                      <div className="mt-3">
                        <BookingSingleDateCalendar
                          value={eventDate}
                          blockedDates={blockedDates}
                          availabilityStatus={availabilityStatus}
                          onChange={(nextDate) => {
                            setEventDate(nextDate);
                            if (nextDate) {
                              setIsDatePickerOpen(false);
                            }
                          }}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-1.5 block text-sm font-medium text-black/80"
                      >
                        {t.form.nameLabel}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="h-11 w-full rounded-lg border border-primary/15 bg-white px-3 text-sm text-black focus:border-black/15 focus:ring-2 focus:ring-black/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-medium text-black/80"
                      >
                        {t.form.emailLabel}
                      </label>
                      <div className="relative">
                        <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/55" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          className="h-11 w-full rounded-lg border border-primary/15 bg-white py-2 ps-9 pe-3 text-sm text-black focus:border-black/15 focus:ring-2 focus:ring-black/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-medium text-black/80"
                      >
                        {t.form.phoneLabel}
                      </label>
                      <div className="relative">
                        <Phone className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/55" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          className="h-11 w-full rounded-lg border border-primary/15 bg-white py-2 ps-9 pe-3 text-sm text-black focus:border-black/15 focus:ring-2 focus:ring-black/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-medium text-black/80"
                    >
                      {t.form.noteLabel}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="w-full rounded-lg border border-primary/15 bg-white px-3 py-2 text-sm text-black focus:border-black/15 focus:ring-2 focus:ring-black/10"
                      placeholder={t.form.notePlaceholder}
                    ></textarea>
                  </div>

                  <div className="sticky bottom-0 -mx-4 -mb-4 flex flex-col-reverse gap-2 border-t border-primary/10 bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-5 sm:-mb-4 sm:flex-row">
                    <LiquidGlassButton
                      type="button"
                      variant="dark"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setShowForm(false);
                        setIsDatePickerOpen(false);
                      }}
                    >
                      {t.form.cancel}
                    </LiquidGlassButton>
                    <LiquidGlassButton
                      type="submit"
                      size="sm"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t.form.sending : t.form.send}
                    </LiquidGlassButton>
                  </div>
                  <p className="mt-2 text-black/70 text-sm font-medium text-center">
                    {t.form.quoteByEmail}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-secondary to-secondary-light p-4 text-black shadow-lg"
          aria-label={t.backToTopAria}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
