'use client';

import { Mail, MessageSquare, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { sendEmail } from '@/actions/email';
import { localizePath } from '@/i18n/config';
import { useLocale } from '@/i18n/useLocale';
import { reservationMessages } from '@/i18n/messages/reservation';
import { propertiesMessages } from '@/i18n/messages/properties';
import AccommodationPriceSummary, {
  isAccommodationPriceQuote,
  type AccommodationPriceQuote,
} from '@/components/AccommodationPriceSummary';
import BookingRangeCalendar from '@/components/BookingRangeCalendar';
import LiquidGlassButton from '@/components/LiquidGlassButton';
import {
  type BookingDateRange,
  getBookingDateRangeValidationMessage,
  getNightCount,
  getTodayIsoInTimeZone,
  sanitizeBookingDateRange,
} from '@/lib/booking-dates';
import {
  BOOKABLE_PROPERTY_OPTIONS,
  type BookablePropertyId,
  type PropertyAvailabilityStatusMap,
  type PropertyBlockedDatesMap,
  getBookablePropertyListingId,
  getBookablePropertyIdFromLabel,
  getBookablePropertyTitle,
} from '@/lib/bookable-properties';
import { trackMetaLead } from '@/lib/meta-events';
import { trackGaLead } from '@/lib/ga-events';

interface ReservationFormProps {
  initialSearchParams?: { [key: string]: string | string[] | undefined };
  embedded?: boolean;
  showIntro?: boolean;
  availabilityByProperty?: PropertyBlockedDatesMap;
  availabilityStatusByProperty?: PropertyAvailabilityStatusMap;
}

const EMPTY_SEARCH_PARAMS: { [key: string]: string | string[] | undefined } = {};
const EMPTY_BLOCKED_DATES: string[] = [];
const EMPTY_AVAILABILITY_BY_PROPERTY = {
  'penthouse-jacuzzi': EMPTY_BLOCKED_DATES,
  'cozy-studio': EMPTY_BLOCKED_DATES,
} as PropertyBlockedDatesMap;
const EMPTY_AVAILABILITY_STATUS_BY_PROPERTY = {
  'penthouse-jacuzzi': 'ready',
  'cozy-studio': 'ready',
} as PropertyAvailabilityStatusMap;

function getSingleSearchParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : value?.[0];
}

function areDateRangesEqual(left: BookingDateRange, right: BookingDateRange) {
  return left.checkIn === right.checkIn && left.checkOut === right.checkOut;
}

type PriceQuote = AccommodationPriceQuote;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getPriceErrorMessage(value: unknown) {
  if (!isRecord(value) || !isRecord(value.error)) {
    return 'Unable to calculate price';
  }

  return typeof value.error.message === 'string'
    ? value.error.message
    : 'Unable to calculate price';
}

export default function ReservationForm({
  initialSearchParams = EMPTY_SEARCH_PARAMS,
  embedded = false,
  showIntro = true,
  availabilityByProperty = EMPTY_AVAILABILITY_BY_PROPERTY,
  availabilityStatusByProperty = EMPTY_AVAILABILITY_STATUS_BY_PROPERTY,
}: ReservationFormProps) {
  const locale = useLocale();
  const t = reservationMessages[locale];
  const propertyLabels = propertiesMessages[locale].cards;
  const todayIso = getTodayIsoInTimeZone();
  const initialProperty = getSingleSearchParam(initialSearchParams?.property);
  const initialCheckIn = getSingleSearchParam(initialSearchParams?.checkIn);
  const initialCheckOut = getSingleSearchParam(initialSearchParams?.checkOut);
  const initialPropertyId = getBookablePropertyIdFromLabel(initialProperty) ?? '';
  const initialBlockedDates =
    initialPropertyId === ''
      ? EMPTY_BLOCKED_DATES
      : availabilityByProperty[initialPropertyId as BookablePropertyId] ?? EMPTY_BLOCKED_DATES;
  const [propertyId, setPropertyId] = useState<BookablePropertyId | ''>(initialPropertyId);
  const [dateRange, setDateRange] = useState<BookingDateRange>(() =>
    sanitizeBookingDateRange(
      initialCheckIn,
      initialCheckOut,
      todayIso,
      true,
      initialBlockedDates,
    ),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [contactMethod, setContactMethod] = useState('email');
  const [priceQuote, setPriceQuote] = useState<PriceQuote | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const selectedBlockedDates =
    propertyId === ''
      ? EMPTY_BLOCKED_DATES
      : availabilityByProperty[propertyId] ?? EMPTY_BLOCKED_DATES;
  const selectedAvailabilityStatus =
    propertyId === '' ? 'ready' : availabilityStatusByProperty[propertyId] ?? 'ready';
  const propertyTitle = propertyId === '' ? '' : getBookablePropertyTitle(propertyId);
  const selectedListingId =
    propertyId === '' ? '' : getBookablePropertyListingId(propertyId);
  const nights = getNightCount(dateRange);
  const dateValidationMessage = getBookingDateRangeValidationMessage(
    dateRange,
    todayIso,
    selectedBlockedDates,
  );
  const hasValidDateSelection = dateValidationMessage === null;
  const activePriceQuote =
    priceQuote && priceQuote.listing_id === selectedListingId && priceQuote.nights === nights
      ? priceQuote
      : null;

  useEffect(() => {
    setDateRange(
      sanitizeBookingDateRange(
        initialCheckIn,
        initialCheckOut,
        todayIso,
        true,
        initialBlockedDates,
      ),
    );
    setPropertyId(initialPropertyId);
  }, [initialBlockedDates, initialCheckIn, initialCheckOut, initialPropertyId, todayIso]);

  useEffect(() => {
    setDateRange((currentRange) => {
      const nextRange = sanitizeBookingDateRange(
        currentRange.checkIn,
        currentRange.checkOut,
        todayIso,
        true,
        selectedBlockedDates,
      );

      return areDateRangesEqual(currentRange, nextRange) ? currentRange : nextRange;
    });
  }, [selectedBlockedDates, todayIso]);

  useEffect(() => {
    if (
      !selectedListingId ||
      !dateRange.checkIn ||
      !dateRange.checkOut ||
      !hasValidDateSelection
    ) {
      setPriceQuote(null);
      setPriceError(null);
      setIsPriceLoading(false);
      return;
    }

    const controller = new AbortController();

    setPriceQuote(null);
    setPriceError(null);
    setIsPriceLoading(true);

    async function calculatePrice() {
      try {
        const response = await fetch('/api/calculate-price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            listing_id: selectedListingId,
            check_in: dateRange.checkIn,
            check_out: dateRange.checkOut,
          }),
          signal: controller.signal,
        });
        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(getPriceErrorMessage(payload));
        }

        if (!isAccommodationPriceQuote(payload)) {
          throw new Error('Unexpected price response');
        }

        if (payload.listing_id !== selectedListingId || payload.nights !== nights) {
          throw new Error('Unexpected price response');
        }

        setPriceQuote(payload);
      } catch (error) {
        if (controller.signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
          return;
        }

        console.error('Price calculation error:', error);
        setPriceQuote(null);
        setPriceError(t.errors.priceUnavailable);
      } finally {
        if (!controller.signal.aborted) {
          setIsPriceLoading(false);
        }
      }
    }

    calculatePrice();

    return () => controller.abort();
  }, [
    dateRange.checkIn,
    dateRange.checkOut,
    hasValidDateSelection,
    nights,
    selectedListingId,
    t.errors.priceUnavailable,
  ]);

  const clearPriceEstimate = () => {
    setPriceQuote(null);
    setPriceError(null);
    setIsPriceLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!propertyId) {
      toast.error(t.errors.selectPropertyFirst);
      return;
    }

    if (selectedAvailabilityStatus === 'error') {
      toast.error(t.errors.availabilityUnavailable);
      return;
    }

    if (!selectedListingId) {
      toast.error(t.errors.selectValidProperty);
      return;
    }

    if (dateValidationMessage) {
      toast.error(dateValidationMessage);
      return;
    }

    if (isPriceLoading) {
      toast.error(t.errors.waitPriceLoading);
      return;
    }

    if (priceError) {
      toast.error(priceError);
      return;
    }

    if (!activePriceQuote) {
      toast.error(t.errors.waitValidPrice);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendEmail(new FormData(e.currentTarget));
      if (result.success) {
        trackMetaLead({
          leadType: 'reservation_inquiry',
          formLocation: 'reservation',
          locale,
        });
        trackGaLead({
          leadType: 'reservation_inquiry',
          formLocation: 'reservation',
          locale,
        });
        toast.success(result.message || t.errors.successToast);
        setIsSuccess(true);
      } else {
        toast.error(result.error || t.errors.submitFailed);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(t.errors.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    const successCard = (
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-primary/10 text-center">
        <h2 className="font-head text-2xl font-bold text-black mb-4">
          {t.successTitle}
        </h2>
        <p className="text-black/80 mb-6">
          {t.successBody}
        </p>
        {embedded && (
          <Link
            href={localizePath(locale, '/properties')}
            className="button-hover-clean inline-block bg-secondary text-black px-6 py-2 rounded-md font-semibold transition"
          >
            {t.backToProperties}
          </Link>
        )}
      </div>
    );

    if (embedded) {
      return successCard;
    }

    return (
      <div className="min-h-screen pt-24 pb-20 bg-cream">
        <div className="reservation-container max-w-2xl mx-auto px-4">
          {successCard}
        </div>
      </div>
    );
  }

  const formCard = (
    <div
      className={`bg-white rounded-3xl shadow-xl border border-primary/10 ${embedded ? 'p-6 md:p-8' : 'p-8 rounded-lg border-0 shadow-lg'}`}
      data-animate="scale"
    >
      {showIntro ? (
        <>
          {embedded ? (
            <h2 className="font-head text-3xl font-bold text-black mb-2" data-animate="text">
              {t.title}
            </h2>
          ) : (
            <h1 className="font-head text-3xl font-bold text-black mb-2" data-animate="text">
              {t.title}
            </h1>
          )}
          <p className="text-black/80 mb-8" data-animate="fade-up" data-delay="1">
            {t.intro}
          </p>
        </>
      ) : null}

      <form onSubmit={handleSubmit} className="reservation-form space-y-6" data-animate="fade-up" data-delay="2">
        <input type="hidden" name="property" value={propertyTitle} />
        <input type="hidden" name="listing_id" value={selectedListingId} />
        <input type="hidden" name="checkIn" value={dateRange.checkIn ?? ''} />
        <input type="hidden" name="checkOut" value={dateRange.checkOut ?? ''} />
        <input type="hidden" name="guestsCount" value="1" />

        <div>
          <label htmlFor="property" className="block text-sm font-medium text-black/80 mb-1">
            {t.propertyLabel}
          </label>
          <select
            id="property"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value as BookablePropertyId | '')}
            required
            className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 transition-colors focus:border-black/15 focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            <option value="" disabled>{t.selectProperty}</option>
            {BOOKABLE_PROPERTY_OPTIONS.map((propertyOption) => (
              <option key={propertyOption.id} value={propertyOption.id}>
                {propertyLabels[propertyOption.id].title}
              </option>
            ))}
          </select>
        </div>

        <BookingRangeCalendar
          value={dateRange}
          onChange={setDateRange}
          onClearDates={clearPriceEstimate}
          blockedDates={selectedBlockedDates}
          availabilityStatus={selectedAvailabilityStatus}
          collapseOnMobile
        />

        <AccommodationPriceSummary
          nights={nights}
          quote={activePriceQuote}
          isLoading={isPriceLoading}
          priceError={priceError}
          className="rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm text-black"
        />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-black/80 mb-1">
            {t.fullName}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black/80 mb-1">
            {t.emailAddress}
          </label>
          <div className="relative">
            <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/60" />
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-black/80 mb-1">
            {t.phoneNumber}
          </label>
          <div className="relative">
            <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/60" />
            {/*
              Phone is only required when the visitor actually asked to be reached
              by phone or WhatsApp. Demanding a number for an email-first enquiry
              is a well-known drop-off on a first contact.
            */}
            <input
              type="tel"
              id="phone"
              name="phone"
              required={contactMethod === 'phone' || contactMethod === 'whatsapp'}
              className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black/80 mb-3">
            <span>{t.preferredContact}</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`tap-reset relative flex cursor-pointer items-center justify-center rounded-md border p-4 ${contactMethod === 'email' ? 'border-black/10 bg-black/[0.03] shadow-sm' : 'border-gray-200 bg-white'}`}>
              <input
                type="radio"
                name="contactMethod"
                value="email"
                checked={contactMethod === 'email'}
                onChange={(e) => setContactMethod(e.target.value)}
                className="absolute opacity-0"
              />
              <Mail className="h-5 w-5 text-black" />
              <span className="ms-2 text-black">{t.contactEmail}</span>
            </label>

            <label className={`tap-reset relative flex cursor-pointer items-center justify-center rounded-md border p-4 ${contactMethod === 'phone' ? 'border-black/10 bg-black/[0.03] shadow-sm' : 'border-gray-200 bg-white'}`}>
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={contactMethod === 'phone'}
                onChange={(e) => setContactMethod(e.target.value)}
                className="absolute opacity-0"
              />
              <Phone className="h-5 w-5 text-black" />
              <span className="ms-2 text-black">{t.contactPhone}</span>
            </label>

            <label className={`tap-reset relative flex cursor-pointer items-center justify-center rounded-md border p-4 ${contactMethod === 'whatsapp' ? 'border-black/10 bg-black/[0.03] shadow-sm' : 'border-gray-200 bg-white'}`}>
              <input
                type="radio"
                name="contactMethod"
                value="whatsapp"
                checked={contactMethod === 'whatsapp'}
                onChange={(e) => setContactMethod(e.target.value)}
                className="absolute opacity-0"
              />
              <MessageSquare className="h-5 w-5 text-black" />
              <span className="ms-2 text-black">{t.contactWhatsapp}</span>
            </label>
          </div>
        </div>

        <LiquidGlassButton type="submit" className="w-full liquid-glass-btn--solid" disabled={isSubmitting}>
          <span>
            {isSubmitting ? t.sending : t.send}
          </span>
        </LiquidGlassButton>
      </form>
    </div>
  );

  if (embedded) {
    return formCard;
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-cream">
      <div className="reservation-container max-w-2xl mx-auto px-4">
        {formCard}
      </div>
    </div>
  );
}
