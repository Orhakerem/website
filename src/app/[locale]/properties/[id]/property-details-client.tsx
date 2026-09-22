'use client';

import {
  Baby,
  Bath,
  BedDouble,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dumbbell,
  Laptop,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shirt,
  Sofa,
  Tv,
  Utensils,
  UtensilsCrossed,
  Users,
  Waves,
  Wifi,
  Wind,
  X,
} from 'lucide-react';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { sendEmail } from '@/actions/email';
import AccommodationPriceSummary, {
  isAccommodationPriceQuote,
  type AccommodationPriceQuote,
} from '@/components/AccommodationPriceSummary';
import BookingRangeCalendar from '@/components/BookingRangeCalendar';
import LiquidGlassButton from '@/components/LiquidGlassButton';
import RoomGallery from '@/components/RoomGallery';
import {
  type BookingDateRange,
  getBookingDateRangeValidationMessage,
  getNightCount,
  getTodayIsoInTimeZone,
} from '@/lib/booking-dates';
import {
  BOOKABLE_PROPERTIES,
  getBookablePropertyListingId,
  type CalendarSyncStatus,
} from '@/lib/bookable-properties';
import { localizePath } from '@/i18n/config';
import { useLocale } from '@/i18n/useLocale';
import { propertyDetailsMessages } from '@/i18n/messages/propertyDetails';
import { localizeBookingValidationMessage } from '@/i18n/messages/booking';
import { trackMetaLead } from '@/lib/meta-events';
import { trackGaLead } from '@/lib/ga-events';

interface PropertyDetailsClientProps {
  propertyId: string;
  blockedDates?: readonly string[];
  availabilityStatus?: CalendarSyncStatus;
}

/**
 * Structural, language-neutral data (images, icons, counts). Display text
 * (titles, descriptions, room/amenity/highlight names) lives in
 * propertyDetailsMessages, keyed by the same property id and positional index.
 */
const propertyMedia = {
  'penthouse-jacuzzi': {
    cleaningFee: 650,
    images: [
      '/penthouse/1-jacuzzi-angle.JPEG',
      '/penthouse/4-terrasse-ext-coucher-soleil.jpg',
      '/penthouse/salon_angle_1.JPG',
      '/penthouse/IMG_0961.jpg',
      '/penthouse/IMG_0933.jpg',
      '/penthouse/IMG_0911.jpg',
      '/penthouse/IMG_0966.jpg',
      '/penthouse/IMG_0994.jpg',
      '/penthouse/26-jacuzzi-angle-2.JPEG',
      '/penthouse/IMG_0917.jpg',
      '/penthouse/chaises_hautes_angle 1.JPG',
      '/penthouse/7-vue-mer.jpg',
      '/penthouse/salon_angle_2.JPG',
      '/penthouse/IMG_0926.jpg',
      '/penthouse/IMG_0934.jpg',
      '/penthouse/IMG_0940.jpg',
      '/penthouse/IMG_0945.jpg',
      '/penthouse/IMG_0913.jpg',
      '/penthouse/IMG_0947.jpg',
      '/penthouse/IMG_0949.jpg',
      '/penthouse/IMG_0951.jpg',
      '/penthouse/IMG_0984.jpg',
      '/penthouse/IMG_0967.jpg',
      '/penthouse/IMG_0971.jpg',
      '/penthouse/6-salle-de-bain-douche-angle-2.jpg',
      '/penthouse/15-douche.jpg',
      '/penthouse/20-toilette-lavabo-angle-1.jpg',
      '/penthouse/19-toilette-lavabo-angle-2.jpg',
      '/penthouse/chaises_hautes_angle 2.JPG',
      '/penthouse/14-espace-laverie.jpg',
      '/penthouse/24-ext-drone-4.jpg',
      '/penthouse/9-ext-drone-3.jpg',
      '/penthouse/ext_drone_5.jpg',
      '/penthouse/23-ext-drone-12.jpg',
      '/penthouse/8-ext-drone-13.jpg',
    ],
    rooms: [
      { images: [
        '/penthouse/salon_angle_1.JPG',
        '/penthouse/salon_angle_2.JPG',
        '/penthouse/IMG_0911.jpg',
        '/penthouse/IMG_0926.jpg',
      ] },
      { images: [
        '/penthouse/IMG_0933.jpg',
        '/penthouse/IMG_0934.jpg',
        '/penthouse/IMG_0940.jpg',
        '/penthouse/IMG_0945.jpg',
      ] },
      { images: [
        '/penthouse/IMG_0917.jpg',
        '/penthouse/IMG_0913.jpg',
      ] },
      { images: [
        '/penthouse/IMG_0947.jpg',
        '/penthouse/IMG_0961.jpg',
        '/penthouse/IMG_0949.jpg',
        '/penthouse/IMG_0951.jpg',
      ] },
      { images: [
        '/penthouse/IMG_0994.jpg',
        '/penthouse/IMG_0984.jpg',
      ] },
      { images: [
        '/penthouse/IMG_0966.jpg',
        '/penthouse/IMG_0967.jpg',
        '/penthouse/IMG_0971.jpg',
      ] },
      { images: [
        '/penthouse/6-salle-de-bain-douche-angle-2.jpg',
      ] },
      { images: ['/penthouse/15-douche.jpg'] },
      { images: [
        '/penthouse/20-toilette-lavabo-angle-1.jpg',
        '/penthouse/19-toilette-lavabo-angle-2.jpg',
      ] },
      { images: [
        '/penthouse/4-terrasse-ext-coucher-soleil.jpg',
        '/penthouse/chaises_hautes_angle 1.JPG',
        '/penthouse/chaises_hautes_angle 2.JPG',
        '/penthouse/7-vue-mer.jpg',
        '/penthouse/24-ext-drone-4.jpg',
        '/penthouse/9-ext-drone-3.jpg',
        '/penthouse/ext_drone_5.jpg',
        '/penthouse/23-ext-drone-12.jpg',
        '/penthouse/8-ext-drone-13.jpg',
      ] },
      { images: ['/penthouse/14-espace-laverie.jpg'] },
      { images: [
        '/penthouse/1-jacuzzi-angle.JPEG',
        '/penthouse/26-jacuzzi-angle-2.JPEG',
      ] },
    ],
    amenityIcons: [Waves, UtensilsCrossed, Bath, Wind, Coffee, Baby, Dumbbell, Shirt, Laptop, Wifi],
    highlightIcons: [Waves, Bath, MapPin],
    maxGuests: 7,
    bedrooms: 3,
    beds: 3,
    baths: 3,
  },
  'cozy-studio': {
    cleaningFee: 200,
    images: [
      '/studio/IMG_0814.jpg',
      '/studio/Salon_angle_1.jpg',
      '/studio/Cuisine_angle_1.jpg',
      '/studio/Salon_angle_3_Zoom.jpg',
      '/studio/IMG_0800.jpg',
      '/studio/Salon_angle_1_Zoom.jpg',
      '/studio/Salon_angle_4.jpg',
      '/studio/cuisine_angle_2.jpg',
      '/studio/IMG_0806.jpg',
      '/studio/lit_angle_1.jpg',
      '/studio/IMG_0821.jpg',
      '/studio/IMG_0828.jpg',
      '/studio/IMG_0825.jpg',
      '/studio/IMG_0795.jpg',
      '/studio/IMG_0809.jpg',
      '/studio/IMG_0810.jpg',
      '/studio/Canape_ouvert_angle_1.jpg',
      '/studio/Canape_ouvert_angle_2.jpg',
    ],
    rooms: [
      { images: [
        '/studio/Salon_angle_1.jpg',
        '/studio/Salon_angle_1_Zoom.jpg',
        '/studio/Salon_angle_4.jpg',
      ] },
      { images: [
        '/studio/Cuisine_angle_1.jpg',
        '/studio/cuisine_angle_2.jpg',
        '/studio/IMG_0806.jpg',
      ] },
      { images: ['/studio/Salon_angle_3_Zoom.jpg'] },
      { images: [
        '/studio/IMG_0814.jpg',
        '/studio/lit_angle_1.jpg',
        '/studio/IMG_0821.jpg',
        '/studio/IMG_0828.jpg',
        '/studio/IMG_0825.jpg',
      ] },
      { images: [
        '/studio/IMG_0800.jpg',
        '/studio/IMG_0795.jpg',
      ] },
      { images: [
        '/studio/IMG_0809.jpg',
        '/studio/IMG_0810.jpg',
      ] },
      { images: [
        '/studio/Canape_ouvert_angle_1.jpg',
        '/studio/Canape_ouvert_angle_2.jpg',
      ] },
    ],
    amenityIcons: [Waves, Wind, Coffee, UtensilsCrossed, Tv, Sofa, BedDouble, Utensils, Wifi],
    highlightIcons: [MapPin, BedDouble, Wifi],
    maxGuests: 4,
    bedrooms: 1,
    beds: 1,
    baths: 1,
  },
};

type PropertyId = keyof typeof propertyMedia;

type PriceQuote = AccommodationPriceQuote;

interface PriceQuoteResult {
  key: string;
  quote: PriceQuote;
}

type ContactMethod = 'email' | 'phone' | 'whatsapp';

interface ReservationFormErrors {
  dates?: string;
  price?: string;
  name?: string;
  email?: string;
  phone?: string;
  guestsCount?: string;
  form?: string;
}

function isPropertyId(value: string): value is PropertyId {
  return value in propertyMedia;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getPriceErrorMessage(value: unknown, fallback: string) {
  if (!isRecord(value) || !isRecord(value.error)) {
    return fallback;
  }

  return typeof value.error.message === 'string' ? value.error.message : fallback;
}

function getFormFieldValue(formData: FormData, name: string) {
  return formData.get(name)?.toString().trim() ?? '';
}

function getFirstValidationError(errors: ReservationFormErrors) {
  return (
    errors.form ??
    errors.dates ??
    errors.price ??
    errors.name ??
    errors.email ??
    errors.phone ??
    errors.guestsCount ??
    null
  );
}

export default function PropertyDetailsClient({
  propertyId,
  blockedDates = [],
  availabilityStatus = 'ready',
}: PropertyDetailsClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = propertyDetailsMessages[locale];
  const [dateRange, setDateRange] = useState<BookingDateRange>({
    checkIn: null,
    checkOut: null,
  });
  const [priceQuoteResult, setPriceQuoteResult] = useState<PriceQuoteResult | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');
  const [formErrors, setFormErrors] = useState<ReservationFormErrors>({});
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0);
  const propertyKey = isPropertyId(propertyId) ? propertyId : null;
  const property = propertyKey ? propertyMedia[propertyKey] : null;
  const text = propertyKey ? t.properties[propertyKey] : null;
  const selectedListingId = propertyKey ? getBookablePropertyListingId(propertyKey) : '';
  const selectedNights = getNightCount(dateRange);
  const todayIso = getTodayIsoInTimeZone();
  const dateValidationMessage = getBookingDateRangeValidationMessage(
    dateRange,
    todayIso,
    blockedDates,
  );
  const hasValidDateRange = dateValidationMessage === null;
  const priceRequestKey =
    selectedListingId && dateRange.checkIn && dateRange.checkOut && hasValidDateRange
      ? `${selectedListingId}|${dateRange.checkIn}|${dateRange.checkOut}`
      : '';
  const activePriceQuote =
    priceQuoteResult?.key === priceRequestKey &&
    priceQuoteResult.quote.listing_id === selectedListingId &&
    priceQuoteResult.quote.nights === selectedNights
      ? priceQuoteResult.quote
      : null;
  const propertyPageHeading = (
    <h1
      className={
        text
          ? 'font-head text-3xl font-bold text-black mb-2'
          : 'text-2xl font-bold text-black mb-4'
      }
    >
      {text ? text.title : t.ui.notFoundTitle}
    </h1>
  );

  useEffect(() => {
    if (!priceRequestKey || !dateRange.checkIn || !dateRange.checkOut || !selectedListingId) {
      setPriceQuoteResult(null);
      setPriceError(null);
      setIsPriceLoading(false);
      return;
    }

    const controller = new AbortController();
    const checkIn = dateRange.checkIn;
    const checkOut = dateRange.checkOut;

    setPriceQuoteResult(null);
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
            check_in: checkIn,
            check_out: checkOut,
          }),
          signal: controller.signal,
        });
        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(getPriceErrorMessage(payload, t.ui.priceUnexpected));
        }

        if (!isAccommodationPriceQuote(payload)) {
          throw new Error('Unexpected price response');
        }

        if (
          `${payload.listing_id}|${checkIn}|${checkOut}` !== priceRequestKey ||
          payload.nights !== selectedNights
        ) {
          throw new Error('Unexpected price response');
        }

        setPriceQuoteResult({
          key: priceRequestKey,
          quote: payload,
        });
      } catch (error) {
        if (controller.signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
          return;
        }

        console.error('Property price calculation error:', error);
        setPriceQuoteResult(null);
        setPriceError(t.ui.priceUnavailable);
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
    priceRequestKey,
    selectedListingId,
    selectedNights,
    t.ui.priceUnavailable,
    t.ui.priceUnexpected,
  ]);

  useEffect(() => {
    setHeroPhotoIndex(0);
  }, [propertyKey]);

  const anyOverlayOpen =
    isPhotosModalOpen || isAmenitiesModalOpen || isBookingSheetOpen;

  useEffect(() => {
    if (!anyOverlayOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsPhotosModalOpen(false);
      setIsAmenitiesModalOpen(false);
      setIsBookingSheetOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [anyOverlayOpen]);

  if (!property || !text) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {propertyPageHeading}
          <LiquidGlassButton onClick={() => router.push(localizePath(locale, '/properties'))}>
            {t.ui.backToProperties}
          </LiquidGlassButton>
        </div>
      </div>
    );
  }

  const clearFormError = (field: keyof ReservationFormErrors) => {
    setFormErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      delete nextErrors.form;
      return nextErrors;
    });
    setIsSubmitSuccess(false);
  };

  const handleDateRangeChange = (nextDateRange: BookingDateRange) => {
    setDateRange(nextDateRange);
    clearFormError('dates');
    clearFormError('price');
  };

  const validateReservationForm = (formData: FormData) => {
    const nextErrors: ReservationFormErrors = {};
    const guestName = getFormFieldValue(formData, 'name');
    const guestEmail = getFormFieldValue(formData, 'email');
    const guestPhone = getFormFieldValue(formData, 'phone');
    const guestsCountValue = getFormFieldValue(formData, 'guestsCount');
    const guestsCount = Number.parseInt(guestsCountValue, 10);

    if (!selectedListingId) {
      nextErrors.form = t.ui.errors.selectProperty;
    }

    if (availabilityStatus === 'error') {
      nextErrors.dates = t.ui.errors.availabilityUnavailable;
    } else if (dateValidationMessage) {
      nextErrors.dates = localizeBookingValidationMessage(locale, dateValidationMessage);
    }

    if (!nextErrors.dates) {
      if (isPriceLoading) {
        nextErrors.price = t.ui.errors.waitPriceLoading;
      } else if (priceError) {
        nextErrors.price = priceError;
      } else if (!activePriceQuote) {
        nextErrors.price = t.ui.errors.waitValidPrice;
      }
    }

    if (!guestName) {
      nextErrors.name = t.ui.errors.nameRequired;
    }

    if (!guestEmail) {
      nextErrors.email = t.ui.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
      nextErrors.email = t.ui.errors.emailInvalid;
    }

    if (!guestPhone) {
      nextErrors.phone = t.ui.errors.phoneRequired;
    }

    if (!guestsCountValue) {
      nextErrors.guestsCount = t.ui.errors.guestsRequired;
    } else if (!Number.isInteger(guestsCount) || guestsCount < 1) {
      nextErrors.guestsCount = t.ui.errors.guestsMin;
    } else if (guestsCount > property.maxGuests) {
      nextErrors.guestsCount = t.ui.errors.guestsMax(property.maxGuests);
    }

    return nextErrors;
  };

  const clearPriceEstimate = () => {
    setPriceQuoteResult(null);
    setPriceError(null);
    setIsPriceLoading(false);
  };

  const handleBookNowSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validateReservationForm(formData);
    const firstError = getFirstValidationError(nextErrors);

    setFormErrors(nextErrors);
    setIsSubmitSuccess(false);

    if (firstError) {
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await sendEmail(formData);

      if (result.success) {
        trackMetaLead({
          leadType: 'reservation_inquiry',
          formLocation: 'property_detail',
          locale,
        });
        trackGaLead({
          leadType: 'reservation_inquiry',
          formLocation: 'property_detail',
          locale,
        });
        toast.success(result.message || t.ui.successToast);
        setIsSubmitSuccess(true);
        form.reset();
        setContactMethod('email');
        setFormErrors({});
      } else {
        const errorMessage = result.error || t.ui.errors.submitFailed;
        setFormErrors({ form: errorMessage });
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Property reservation submission error:', error);
      const errorMessage = t.ui.errors.submitError;
      setFormErrors({ form: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleFormErrors = Object.values(formErrors).filter(
    (errorMessage): errorMessage is string => Boolean(errorMessage),
  );

  const reservationForm = (
    <form onSubmit={handleBookNowSubmit} noValidate className="space-y-6">
                  <input type="hidden" name="property" value={BOOKABLE_PROPERTIES[propertyKey!].title} />
                  <input type="hidden" name="listing_id" value={selectedListingId} />
                  <input type="hidden" name="checkIn" value={dateRange.checkIn ?? ''} />
                  <input type="hidden" name="checkOut" value={dateRange.checkOut ?? ''} />

                  <div className="grid grid-cols-2 overflow-hidden rounded-[10px] border border-primary/15">
                    <button
                      type="button"
                      onClick={() => {
                        setIsBookingSheetOpen(false);
                        setTimeout(() => {
                          document
                            .getElementById('select-checkin-date')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 0);
                      }}
                      className="tap-reset border-e border-primary/15 px-4 py-3 text-start transition hover:bg-primary/5"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">
                        {t.ui.form.checkIn}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {dateRange.checkIn ?? t.ui.form.addDate}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsBookingSheetOpen(false);
                        setTimeout(() => {
                          document
                            .getElementById('select-checkin-date')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 0);
                      }}
                      className="tap-reset px-4 py-3 text-start transition hover:bg-primary/5"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55">
                        {t.ui.form.checkout}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {dateRange.checkOut ?? t.ui.form.addDate}
                      </p>
                    </button>
                  </div>

                  {formErrors.dates ? (
                    <p className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {formErrors.dates}
                    </p>
                  ) : null}

                  {visibleFormErrors.length > 0 ? (
                    <div
                      role="alert"
                      className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      <p className="font-semibold">{t.ui.errors.fixHighlighted}</p>
                      <ul className="mt-2 list-disc space-y-1 ps-5">
                        {visibleFormErrors.map((errorMessage) => (
                          <li key={errorMessage}>{errorMessage}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {isSubmitSuccess ? (
                    <div
                      role="status"
                      className="rounded-[10px] border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
                    >
                      {t.ui.success}
                    </div>
                  ) : null}

                  {hasValidDateRange ? (
                    <AccommodationPriceSummary
                      nights={selectedNights}
                      quote={activePriceQuote}
                      isLoading={isPriceLoading}
                      priceError={priceError}
                      validationError={formErrors.price}
                      className="bg-white rounded-[10px] p-6 border border-primary/10 shadow-sm"
                      totalValueClassName="font-head text-xl font-bold"
                    />
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="property-reservation-name" className="block text-sm font-medium text-black/80 mb-1">
                        {t.ui.form.fullName}
                      </label>
                      <input
                        type="text"
                        id="property-reservation-name"
                        name="name"
                        autoComplete="name"
                        aria-invalid={Boolean(formErrors.name)}
                        aria-describedby={formErrors.name ? 'property-reservation-name-error' : undefined}
                        onChange={() => clearFormError('name')}
                        className="w-full rounded-[10px] border border-gray-300 px-4 py-2"
                      />
                      {formErrors.name ? (
                        <p id="property-reservation-name-error" className="mt-2 text-sm font-medium text-red-700">
                          {formErrors.name}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label htmlFor="property-reservation-email" className="block text-sm font-medium text-black/80 mb-1">
                        {t.ui.form.emailAddress}
                      </label>
                      <div className="relative">
                        <Mail className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black/60" />
                        <input
                          type="email"
                          id="property-reservation-email"
                          name="email"
                          autoComplete="email"
                          aria-invalid={Boolean(formErrors.email)}
                          aria-describedby={formErrors.email ? 'property-reservation-email-error' : undefined}
                          onChange={() => clearFormError('email')}
                          className="w-full rounded-[10px] border border-gray-300 py-2 ps-10 pe-4"
                        />
                      </div>
                      {formErrors.email ? (
                        <p id="property-reservation-email-error" className="mt-2 text-sm font-medium text-red-700">
                          {formErrors.email}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label htmlFor="property-reservation-phone" className="block text-sm font-medium text-black/80 mb-1">
                        {t.ui.form.phoneNumber}
                      </label>
                      <div className="relative">
                        <Phone className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black/60" />
                        <input
                          type="tel"
                          id="property-reservation-phone"
                          name="phone"
                          autoComplete="tel"
                          aria-invalid={Boolean(formErrors.phone)}
                          aria-describedby={formErrors.phone ? 'property-reservation-phone-error' : undefined}
                          onChange={() => clearFormError('phone')}
                          className="w-full rounded-[10px] border border-gray-300 py-2 ps-10 pe-4"
                        />
                      </div>
                      {formErrors.phone ? (
                        <p id="property-reservation-phone-error" className="mt-2 text-sm font-medium text-red-700">
                          {formErrors.phone}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label htmlFor="property-reservation-guests" className="block text-sm font-medium text-black/80 mb-1">
                        {t.ui.form.guests}
                      </label>
                      <input
                        type="number"
                        id="property-reservation-guests"
                        name="guestsCount"
                        min={1}
                        max={property.maxGuests}
                        defaultValue={1}
                        aria-invalid={Boolean(formErrors.guestsCount)}
                        aria-describedby={formErrors.guestsCount ? 'property-reservation-guests-error' : undefined}
                        onChange={() => clearFormError('guestsCount')}
                        className="w-full rounded-[10px] border border-gray-300 px-4 py-2"
                      />
                      {formErrors.guestsCount ? (
                        <p id="property-reservation-guests-error" className="mt-2 text-sm font-medium text-red-700">
                          {formErrors.guestsCount}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black/80 mb-3">
                      <span>{t.ui.form.preferredContact}</span>
                    </label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <label className={`tap-reset relative flex cursor-pointer items-center justify-center rounded-[10px] border p-4 ${contactMethod === 'email' ? 'border-black/10 bg-black/[0.03] shadow-sm' : 'border-gray-200 bg-white'}`}>
                        <input
                          type="radio"
                          name="contactMethod"
                          value="email"
                          checked={contactMethod === 'email'}
                          onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                          className="absolute opacity-0"
                        />
                        <Mail className="h-5 w-5 text-black" />
                        <span className="ms-2 text-black">{t.ui.form.contactEmail}</span>
                      </label>

                      <label className={`tap-reset relative flex cursor-pointer items-center justify-center rounded-[10px] border p-4 ${contactMethod === 'phone' ? 'border-black/10 bg-black/[0.03] shadow-sm' : 'border-gray-200 bg-white'}`}>
                        <input
                          type="radio"
                          name="contactMethod"
                          value="phone"
                          checked={contactMethod === 'phone'}
                          onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                          className="absolute opacity-0"
                        />
                        <Phone className="h-5 w-5 text-black" />
                        <span className="ms-2 text-black">{t.ui.form.contactPhone}</span>
                      </label>

                      <label className={`tap-reset relative flex cursor-pointer items-center justify-center rounded-[10px] border p-4 ${contactMethod === 'whatsapp' ? 'border-black/10 bg-black/[0.03] shadow-sm' : 'border-gray-200 bg-white'}`}>
                        <input
                          type="radio"
                          name="contactMethod"
                          value="whatsapp"
                          checked={contactMethod === 'whatsapp'}
                          onChange={(e) => setContactMethod(e.target.value as ContactMethod)}
                          className="absolute opacity-0"
                        />
                        <MessageSquare className="h-5 w-5 text-black" />
                        <span className="ms-2 text-black">{t.ui.form.contactWhatsapp}</span>
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <LiquidGlassButton type="submit" className="w-full" disabled={isSubmitting}>
                      <Calendar className="w-6 h-6 me-3" />
                      <span>{isSubmitting ? t.ui.form.sending : t.ui.form.bookNow}</span>
                    </LiquidGlassButton>

                    <p className="mt-4 text-black/70 text-sm font-medium text-center">
                      {t.ui.form.responseGuarantee}
                    </p>
                    <p className="mt-1 text-black/70 text-sm font-medium text-center">
                      {t.ui.form.quoteByEmail}
                    </p>
                  </div>
                </form>
  );

  const heroPhotos = property.images.slice(0, 5);
  const heroPhotoCount = property.images.length;
  const activeHeroPhotoIndex = heroPhotoIndex % heroPhotoCount;
  const activeHeroPhoto = property.images[activeHeroPhotoIndex] ?? property.images[0];
  const rooms = property.rooms.map((room, index) => ({
    ...text.rooms[index],
    images: room.images.map((src, imageIndex) => ({
      src,
      alt: text.rooms[index].imageAlts[imageIndex] ?? text.rooms[index].name,
    })),
  }));
  const amenities = property.amenityIcons.map((icon, index) => ({
    icon,
    ...text.amenities[index],
  }));
  const highlights = property.highlightIcons.map((icon, index) => ({
    icon,
    ...text.highlights[index],
  }));
  const amenitiesPreview = amenities.slice(0, 10);
  const quickFacts = [
    t.ui.facts.guests(property.maxGuests),
    t.ui.facts.bedrooms(property.bedrooms),
    t.ui.facts.beds(property.beds),
    t.ui.facts.baths(property.baths),
  ];
  const showPreviousHeroPhoto = () => {
    setHeroPhotoIndex((currentIndex) =>
      currentIndex === 0 ? heroPhotoCount - 1 : currentIndex - 1,
    );
  };
  const showNextHeroPhoto = () => {
    setHeroPhotoIndex((currentIndex) =>
      currentIndex === heroPhotoCount - 1 ? 0 : currentIndex + 1,
    );
  };


  return (
    <div className="property-detail-page min-h-screen pt-0 lg:pt-24 pb-32 lg:pb-20" style={{ backgroundColor: '#e8e4dc' }}>
      {/* Responsive: full-bleed photo with back button, carousel arrows + gallery counter */}
      <div className="lg:hidden relative h-[44vh] w-full overflow-hidden">
        <Image
          src={activeHeroPhoto}
          alt={t.ui.gallery.heroPhotoAlt(text.title, activeHeroPhotoIndex + 1)}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <button
          type="button"
          onClick={() => router.push(localizePath(locale, '/properties'))}
          aria-label={t.ui.backAria}
          className="tap-reset absolute top-4 start-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md"
        >
          <ChevronLeft className="h-5 w-5 text-black rtl:rotate-180" />
        </button>
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
          <button
            type="button"
            onClick={showPreviousHeroPhoto}
            aria-label={t.ui.gallery.prevPhotoAria}
            className="tap-reset pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5 text-black rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={showNextHeroPhoto}
            aria-label={t.ui.gallery.nextPhotoAria}
            className="tap-reset pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5 text-black rtl:rotate-180" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setIsPhotosModalOpen(true)}
          aria-haspopup="dialog"
          aria-label={t.ui.gallery.viewAllPhotosAria}
          className="tap-reset absolute bottom-4 end-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
        >
          {activeHeroPhotoIndex + 1} / {property.images.length}
        </button>
      </div>

      {/* Desktop: Airbnb 5-up photo grid */}
      <section className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 md:mt-6">
        <div className="relative grid aspect-[2/1] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-[6px]">
          {heroPhotos.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setIsPhotosModalOpen(true)}
              aria-label={t.ui.gallery.openGalleryAria(index + 1)}
              className={`tap-reset relative overflow-hidden bg-cream transition hover:brightness-95 ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <Image
                src={src}
                alt={t.ui.gallery.heroPhotoAlt(text.title, index + 1)}
                fill
                className="object-cover"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes={index === 0 ? '(max-width: 1280px) 50vw, 640px' : '(max-width: 1280px) 25vw, 320px'}
              />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsPhotosModalOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isPhotosModalOpen}
            className="absolute bottom-4 end-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-md transition hover:bg-cream"
          >
            {t.ui.gallery.showAllPhotos(property.images.length)}
          </button>
        </div>
      </section>

      {/* Main content + sticky booking */}
      <div className="relative z-10 -mt-6 rounded-t-[1.75rem] bg-cream shadow-[0_-8px_24px_-16px_rgba(0,0,0,0.25)] lg:mt-0 lg:rounded-none lg:shadow-none max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-14 grid gap-10 lg:gap-14 lg:grid-cols-[1.55fr_1fr]">
        {/* Left content column */}
        <div className="min-w-0">
          {/* Responsive editorial header */}
          {/* Single H1 for the page: mobile scale below lg, desktop scale from lg up. */}
          <h1 className="mt-2 font-head text-2xl font-bold text-black leading-tight lg:mt-0 lg:text-4xl">
            {text.title}
          </h1>
          <div className="lg:hidden pb-4">
            <p className="mt-2 text-sm text-black/70 leading-relaxed">
              {text.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-black/80">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 shrink-0" />
                {t.ui.facts.guests(property.maxGuests)}
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 shrink-0" />
                {t.ui.facts.bedrooms(property.bedrooms)} · {t.ui.facts.beds(property.beds)}
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 shrink-0" />
                {t.ui.facts.baths(property.baths)}
              </span>
            </div>
          </div>

          {/* 2. Title + property type subtitle (desktop) */}
          <header className="hidden lg:block">
            <p className="mt-3 text-black/70">
              {t.ui.facts.typeIn(text.propertyType, text.location)}
            </p>

            {/* 3. Quick facts */}
            <p className="mt-2 text-sm text-black/65">
              {quickFacts.join(' · ')}
            </p>
          </header>

          {/* Divider */}
          <hr className="hidden lg:block mt-10 mb-5 border-t border-primary/10" />

          {/* 5. Feature highlights */}
          <section className="hidden lg:grid grid-cols-3 gap-3 py-1">
            {highlights.map((highlight) => (
              <div key={highlight.title} className="flex flex-col gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-primary/5 text-black">
                  <highlight.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-black leading-snug">{highlight.title}</p>
              </div>
            ))}
          </section>

          <hr className="hidden lg:block mt-5 mb-10 border-t border-primary/10" />

          {/* 6. Select check-in date — inline calendar (moved above About this space) */}
          <section id="select-checkin-date">
            <h2 className="font-head text-2xl md:text-3xl font-bold text-black">
              {t.ui.sections.planYourStay}
            </h2>
            <p className="mt-2 text-black/70">
              {t.ui.sections.addTravelDates}
            </p>
            <div className="mt-6">
              <BookingRangeCalendar
                value={dateRange}
                onChange={handleDateRangeChange}
                onClearDates={clearPriceEstimate}
                blockedDates={blockedDates}
                availabilityStatus={availabilityStatus}
              />
            </div>
            {hasValidDateRange ? (
              <AccommodationPriceSummary
                nights={selectedNights}
                quote={activePriceQuote}
                isLoading={isPriceLoading}
                priceError={priceError}
                validationError={formErrors.price}
                className="lg:hidden mt-4 rounded-[10px] border border-primary/10 bg-white/80 px-4 py-3 text-sm shadow-sm"
                totalValueClassName="font-head text-lg font-bold"
              />
            ) : null}
          </section>

          <hr className="my-10 border-t border-primary/10" />

          {/* 7. About this space */}
          <section>
            <h2 className="font-head text-2xl md:text-3xl font-bold text-black">
              {t.ui.sections.aboutThisSpace}
            </h2>
            <div
              className={`mt-5 space-y-4 text-black/80 leading-relaxed ${
                isDescriptionExpanded
                  ? ''
                  : 'relative max-h-44 overflow-hidden after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-16 after:bg-gradient-to-t after:from-cream after:to-transparent'
              }`}
            >
              {text.longDescription.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded((value) => !value)}
              className="tap-reset mt-4 inline-flex items-center gap-1 text-sm font-semibold text-black underline underline-offset-4 decoration-navy/40 hover:decoration-navy"
            >
              {isDescriptionExpanded ? t.ui.sections.showLess : t.ui.sections.showMore}
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isDescriptionExpanded ? '-rotate-90' : 'rotate-90'
                }`}
              />
            </button>
          </section>

          <hr className="my-10 border-t border-primary/10" />

          {/* 8. Responsive photos by room */}
          {rooms.length ? (
            <section className="lg:hidden">
              <h2 className="font-head text-2xl font-bold text-black">
                {t.ui.gallery.photosByRoom}
              </h2>
              <div className="mt-5 space-y-5">
                {rooms.map((room) => (
                  <button
                    key={room.name}
                    type="button"
                    onClick={() => setIsPhotosModalOpen(true)}
                    className="tap-reset block w-full text-start"
                    aria-label={t.ui.gallery.viewRoomPhotosAria(room.name)}
                  >
                    <span className="flex gap-3 overflow-x-auto pb-2">
                      {room.images.slice(0, 4).map((image, index) => (
                        <span
                          key={image.src}
                          className="relative block h-24 w-32 shrink-0 overflow-hidden rounded-[6px] bg-white"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            loading="lazy"
                            sizes="128px"
                          />
                          {index === 3 && room.images.length > 4 ? (
                            <span className="absolute inset-0 grid place-items-center bg-black/45 text-xs font-semibold text-white">
                              +{room.images.length - 3}
                            </span>
                          ) : null}
                        </span>
                      ))}
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-3">
                      <span className="font-head text-base font-bold text-black">
                        {room.name}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                        {t.ui.gallery.photosCount(room.images.length)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <hr className="my-10 border-t border-primary/10 lg:hidden" />

          {/* 9. What this place offers */}
          <section>
            <h2 className="font-head text-2xl md:text-3xl font-bold text-black">
              {t.ui.sections.whatThisPlaceOffers}
            </h2>
            <div className="mt-6 grid gap-y-4 sm:grid-cols-2 sm:gap-x-8">
              {amenitiesPreview.map((amenity) => (
                <div key={amenity.name} className="flex items-center gap-4">
                  <amenity.icon className="h-5 w-5 shrink-0 text-black" />
                  <span className="text-sm text-black">{amenity.name}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsAmenitiesModalOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isAmenitiesModalOpen}
              className="tap-reset mt-8 rounded-full border border-navy/30 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-navy/5"
            >
              {t.ui.sections.showAllAmenities(amenities.length)}
            </button>
          </section>
        </div>

        {/* Right sticky booking column (lg+) */}
        <aside className="hidden lg:block self-start lg:sticky lg:top-28">
          <div>
            <div className="rounded-[10px] border border-primary/10 bg-white shadow-xl p-5 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary">
                {t.ui.bookingPanel.kicker}
              </p>
              <h2 className="mt-1 font-head text-xl font-bold text-black">
                {t.ui.bookingPanel.heading}
              </h2>
              <p className="mt-1 text-xs text-black/75">
                {t.ui.bookingPanel.subheading}
              </p>
              <div className="mt-4">
                {reservationForm}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile fixed booking bar (<lg) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-primary/10 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)]">
        <div className="flex items-center justify-between gap-4 max-w-3xl mx-auto">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              {t.ui.bookingPanel.requestToBook}
            </p>
            <p className="text-sm font-semibold text-black truncate">
              {selectedNights > 0
                ? `${t.ui.bookingPanel.nightsSummary(selectedNights)} · ${dateRange.checkIn} → ${dateRange.checkOut}`
                : t.ui.bookingPanel.addDatesForPricing}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsBookingSheetOpen(true)}
            aria-controls="booking-sheet"
            aria-expanded={isBookingSheetOpen}
            className="tap-reset shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90"
          >
            {t.ui.bookingPanel.inquire}
          </button>
        </div>
      </div>

      {/* Photos modal */}
      {isPhotosModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.ui.gallery.viewAllPhotosAria}
          className="fixed inset-0 z-50 overflow-y-auto bg-cream"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-cream/95 backdrop-blur-sm px-4 sm:px-6 py-4">
            <p className="font-head text-lg font-bold text-black">
              {t.ui.gallery.allPhotosTitle(text.title)}
            </p>
            <button
              type="button"
              onClick={() => setIsPhotosModalOpen(false)}
              aria-label={t.ui.gallery.closePhotosAria}
              className="tap-reset rounded-full bg-white p-2 text-black shadow-md transition hover:bg-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <RoomGallery rooms={rooms} />
          </div>
        </div>
      ) : null}

      {/* Amenities modal */}
      {isAmenitiesModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.ui.sections.whatThisPlaceOffers}
          className="fixed inset-0 z-[2000] grid place-items-end sm:place-items-center bg-black/50 px-0 sm:px-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsAmenitiesModalOpen(false);
            }
          }}
        >
          <div className="w-full sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-cream shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-cream/95 backdrop-blur-sm px-6 py-4">
              <p className="font-head text-lg font-bold text-black">
                {t.ui.sections.whatThisPlaceOffers}
              </p>
              <button
                type="button"
                onClick={() => setIsAmenitiesModalOpen(false)}
                aria-label={t.ui.sections.closeAmenitiesAria}
                className="tap-reset rounded-full bg-white p-2 text-black shadow-md transition hover:bg-cream"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-5">
              {amenities.map((amenity, index) => (
                <div
                  key={amenity.name}
                  className={`flex items-start gap-4 pb-5 ${
                    index < amenities.length - 1 ? 'border-b border-primary/10' : ''
                  }`}
                >
                  <amenity.icon className="h-5 w-5 shrink-0 text-black mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-black">{amenity.name}</h3>
                    <p className="mt-0.5 text-sm text-black/65">{amenity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile booking sheet */}
      {isBookingSheetOpen ? (
        <div
          id="booking-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={t.ui.bookingPanel.kicker}
          className="lg:hidden fixed inset-x-0 bottom-0 top-12 z-50 overflow-y-auto rounded-t-3xl bg-cream shadow-2xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-cream/95 backdrop-blur-sm px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                {t.ui.bookingPanel.kicker}
              </p>
              <p className="mt-0.5 font-head text-lg font-bold text-black">{t.ui.bookingPanel.heading}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsBookingSheetOpen(false)}
              aria-label={t.ui.bookingPanel.closeReservationAria}
              className="tap-reset rounded-full bg-white p-2 text-black shadow-md transition hover:bg-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="px-5 py-6 pb-12">
            {reservationForm}
          </div>
        </div>
      ) : null}
    </div>
  );
}
