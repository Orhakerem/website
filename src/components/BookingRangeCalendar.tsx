'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  DayPicker,
  type DateRange,
  type Modifiers,
  type OnSelectHandler,
} from 'react-day-picker';
import { enUS as dayPickerEn, fr as dayPickerFr, he as dayPickerHe } from 'react-day-picker/locale';

import React, { useEffect, useMemo, useState } from 'react';

import { useResponsiveCalendarLayout } from '@/hooks/useResponsiveCalendarLayout';
import {
  addNights,
  BUSINESS_TIME_ZONE,
  type BookingDateRange,
  compareIsoDates,
  createDateFromIso,
  formatIsoDate,
  getFirstBlockedDateAfter,
  getNightCount,
  getTodayIsoInTimeZone,
  sanitizeBookingDateRange,
  toIsoDateString,
} from '@/lib/booking-dates';
import { addMonthsUtc, isSameMonthUtc, startOfMonthUtc } from '@/lib/calendar-months';
import type { CalendarSyncStatus } from '@/lib/bookable-properties';
import { isRtl, type Locale } from '@/i18n/config';
import { useLocale } from '@/i18n/useLocale';
import { bookingMessages, DISPLAY_LOCALE } from '@/i18n/messages/booking';

const DAY_PICKER_LOCALES: Record<Locale, typeof dayPickerEn> = {
  en: dayPickerEn,
  fr: dayPickerFr,
  he: dayPickerHe,
};

interface BookingRangeCalendarProps {
  value: BookingDateRange;
  onChange: (range: BookingDateRange) => void;
  onClearDates?: () => void;
  blockedDates?: readonly string[];
  availabilityStatus?: CalendarSyncStatus;
}

type ActiveField = 'checkIn' | 'checkOut';

export default function BookingRangeCalendar({
  value,
  onChange,
  onClearDates,
  blockedDates = [],
  availabilityStatus = 'ready',
}: BookingRangeCalendarProps) {
  const locale = useLocale();
  const t = bookingMessages[locale].calendar;
  const { rootRef, numberOfMonths } = useResponsiveCalendarLayout();
  const todayIso = getTodayIsoInTimeZone();
  const todayMonth = useMemo(
    () => startOfMonthUtc(createDateFromIso(todayIso)),
    [todayIso],
  );
  const blockedDateSet = useMemo(() => new Set(blockedDates), [blockedDates]);
  const displayValue = useMemo(
    () => sanitizeBookingDateRange(value.checkIn, value.checkOut, todayIso, false, blockedDates),
    [blockedDates, todayIso, value.checkIn, value.checkOut],
  );
  const [activeField, setActiveField] = useState<ActiveField>(() =>
    value.checkIn ? 'checkOut' : 'checkIn',
  );
  /*
    On mobile the grid is rendered but hidden until the visitor taps Check-in or
    Check-out: expanded by default it costs a full screen before the name, email
    and phone fields are reachable. Initialising from `value` keeps server and
    client markup identical, and desktop is unaffected (CSS-only collapse).
  */
  const [calendarRevealed, setCalendarRevealed] = useState<boolean>(() => Boolean(value.checkIn));
  const [month, setMonth] = useState<Date>(() =>
    startOfMonthUtc(createDateFromIso(value.checkIn ?? todayIso)),
  );

  useEffect(() => {
    setMonth(startOfMonthUtc(createDateFromIso(displayValue.checkIn ?? todayIso)));
  }, [displayValue.checkIn, todayIso]);

  useEffect(() => {
    if (
      value.checkIn !== displayValue.checkIn ||
      value.checkOut !== displayValue.checkOut
    ) {
      onChange(displayValue);
    }
  }, [displayValue, onChange, value.checkIn, value.checkOut]);

  useEffect(() => {
    if (!displayValue.checkIn) {
      setActiveField('checkIn');
      return;
    }

    if (!displayValue.checkOut) {
      setActiveField('checkOut');
    }
  }, [displayValue.checkIn, displayValue.checkOut]);

  const selectedRange = useMemo(() => {
    if (!displayValue.checkIn) {
      return undefined;
    }

    return {
      from: createDateFromIso(displayValue.checkIn),
      to: createDateFromIso(displayValue.checkOut ?? displayValue.checkIn),
    };
  }, [displayValue.checkIn, displayValue.checkOut]);
  const maxCheckOutIso = useMemo(() => {
    if (!displayValue.checkIn) {
      return null;
    }

    return getFirstBlockedDateAfter(displayValue.checkIn, blockedDates);
  }, [blockedDates, displayValue.checkIn]);

  // DayPicker only treats selected range as controlled when onSelect is defined.
  const keepDayPickerSelectionControlled: OnSelectHandler<DateRange | undefined> = () =>
    undefined;

  const handleFieldFocus = (field: ActiveField) => {
    setCalendarRevealed(true);

    if (field === 'checkOut' && !displayValue.checkIn) {
      setActiveField('checkIn');
      setMonth(todayMonth);
      return;
    }

    setActiveField(field);

    if (field === 'checkOut' && displayValue.checkIn) {
      setMonth(startOfMonthUtc(createDateFromIso(displayValue.checkIn)));
      return;
    }

    setMonth(startOfMonthUtc(createDateFromIso(displayValue.checkIn ?? todayIso)));
  };

  const handleDayClick = (date: Date, modifiers: Modifiers) => {
    const clickedIso = toIsoDateString(date);
    const clickedMonth = startOfMonthUtc(createDateFromIso(clickedIso));
    const isSelectedCheckIn = clickedIso === displayValue.checkIn;
    const isSelectedCheckOut = clickedIso === displayValue.checkOut;
    const isInsideSelectedRange = Boolean(
      displayValue.checkIn &&
        displayValue.checkOut &&
        compareIsoDates(clickedIso, displayValue.checkIn) > 0 &&
        compareIsoDates(clickedIso, displayValue.checkOut) < 0,
    );

    if (isSelectedCheckIn) {
      onChange({ checkIn: null, checkOut: null });
      onClearDates?.();
      setActiveField('checkIn');
      setMonth(clickedMonth);

      return;
    }

    if (isSelectedCheckOut && displayValue.checkIn) {
      onChange({ checkIn: displayValue.checkIn, checkOut: null });
      onClearDates?.();
      setActiveField('checkOut');
      setMonth(clickedMonth);

      return;
    }

    if (isInsideSelectedRange) {
      onChange({ checkIn: clickedIso, checkOut: null });
      onClearDates?.();
      setActiveField('checkOut');
      setMonth(clickedMonth);

      return;
    }

    if (modifiers.disabled) {
      return;
    }

    if (!displayValue.checkIn || activeField === 'checkIn') {
      const nextCheckOut =
        displayValue.checkOut && compareIsoDates(displayValue.checkOut, clickedIso) > 0
          ? displayValue.checkOut
          : addNights(clickedIso, 1);

      onChange({
        checkIn: clickedIso,
        checkOut: nextCheckOut,
      });
      setActiveField('checkOut');
      setMonth(startOfMonthUtc(createDateFromIso(clickedIso)));

      return;
    }

    if (compareIsoDates(clickedIso, displayValue.checkIn) <= 0) {
      onChange({
        checkIn: clickedIso,
        checkOut: addNights(clickedIso, 1),
      });
      setActiveField('checkOut');
      setMonth(startOfMonthUtc(createDateFromIso(clickedIso)));

      return;
    }

    onChange({
      checkIn: displayValue.checkIn,
      checkOut: clickedIso,
    });
  };

  const clearDates = () => {
    onChange({ checkIn: null, checkOut: null });
    onClearDates?.();
    setActiveField('checkIn');
    setMonth(todayMonth);
  };

  const goToPreviousMonth = () => {
    setMonth((currentMonth) => {
      const previousMonth = addMonthsUtc(currentMonth, -1);
      return previousMonth < todayMonth ? todayMonth : previousMonth;
    });
  };

  const goToNextMonth = () => {
    setMonth((currentMonth) => addMonthsUtc(currentMonth, 1));
  };

  const nights = getNightCount(displayValue);
  const hasSelection = Boolean(displayValue.checkIn && displayValue.checkOut);
  const canGoToPreviousMonth = !isSameMonthUtc(month, todayMonth);
  const canUseBlockedBoundaryAsCheckout = Boolean(
    displayValue.checkIn &&
      activeField === 'checkOut' &&
      maxCheckOutIso &&
      blockedDateSet.has(maxCheckOutIso),
  );
  const disabledDays = (date: Date) => {
    const isoDate = toIsoDateString(date);
    const isSelectedDate = Boolean(
      isoDate === displayValue.checkIn ||
        isoDate === displayValue.checkOut ||
        (
          displayValue.checkIn &&
          displayValue.checkOut &&
          compareIsoDates(isoDate, displayValue.checkIn) > 0 &&
          compareIsoDates(isoDate, displayValue.checkOut) < 0
        ),
    );

    if (compareIsoDates(isoDate, todayIso) < 0) {
      return true;
    }

    if (isSelectedDate) {
      return false;
    }

    if (!displayValue.checkIn || activeField === 'checkIn') {
      return blockedDateSet.has(isoDate);
    }

    if (compareIsoDates(isoDate, displayValue.checkIn) <= 0) {
      return true;
    }

    if (maxCheckOutIso && compareIsoDates(isoDate, maxCheckOutIso) > 0) {
      return true;
    }

    return false;
  };
  const unavailableDays = (date: Date) => blockedDateSet.has(toIsoDateString(date));

  const checkInLabel = displayValue.checkIn
    ? formatIsoDate(displayValue.checkIn, DISPLAY_LOCALE[locale])
    : t.addDate;
  const checkOutLabel = displayValue.checkOut
    ? formatIsoDate(displayValue.checkOut, DISPLAY_LOCALE[locale])
    : t.addDate;
  const stayLabel = hasSelection ? t.nightsCount(nights) : '—';
  const navHintLabel =
    activeField === 'checkOut' && displayValue.checkIn ? t.pickCheckOut : t.pickCheckIn;

  return (
    <div ref={rootRef} className="w-full">
      <div className="overflow-hidden rounded-[14px] border border-primary/15 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {availabilityStatus === 'ready' ? null : (
          <p className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900">
            {availabilityStatus === 'error' ? t.availabilityError : t.availabilityStale}
          </p>
        )}

        <div className="grid grid-cols-2 divide-x rtl:divide-x-reverse divide-primary/10 border-b border-primary/10 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => handleFieldFocus('checkIn')}
            aria-pressed={activeField === 'checkIn'}
            className={`tap-reset px-4 py-4 text-start transition sm:px-5 ${
              activeField === 'checkIn' ? 'bg-primary/[0.04]' : 'hover:bg-primary/[0.02]'
            }`}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
              {t.checkIn}
            </span>
            <span className="mt-1.5 block font-head text-base font-semibold text-black sm:text-lg">
              {checkInLabel}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleFieldFocus('checkOut')}
            aria-pressed={activeField === 'checkOut'}
            className={`tap-reset px-4 py-4 text-start transition sm:px-5 ${
              activeField === 'checkOut' ? 'bg-primary/[0.04]' : 'hover:bg-primary/[0.02]'
            }`}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
              {t.checkOut}
            </span>
            <span className="mt-1.5 block font-head text-base font-semibold text-black sm:text-lg">
              {checkOutLabel}
            </span>
          </button>

          <div className="col-span-2 border-t border-primary/10 px-4 py-4 sm:col-span-1 sm:border-t-0 sm:px-5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
              {t.stay}
            </span>
            <span className="mt-1.5 block font-head text-base font-semibold text-black sm:text-lg">
              {stayLabel}
            </span>
          </div>
        </div>

        {canUseBlockedBoundaryAsCheckout ? (
          <p className="border-b border-primary/10 bg-cream/40 px-5 py-3 text-xs text-black/65">
            {t.blockedBoundaryNote}
          </p>
        ) : null}

        <div
          className="booking-calendar-panel px-3 pt-4 pb-2 sm:px-6 sm:pt-6"
          data-revealed={calendarRevealed ? 'true' : 'false'}
        >
          <div className="mb-3 flex items-center justify-between px-1 sm:mb-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-black/55">
              {navHintLabel}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goToPreviousMonth}
                disabled={!canGoToPreviousMonth}
                aria-label={t.prevMonthAria}
                className="tap-reset inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-white text-black transition hover:bg-cream/60 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={goToNextMonth}
                aria-label={t.nextMonthAria}
                className="tap-reset inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/15 bg-white text-black transition hover:bg-cream/60"
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>

          <DayPicker
            mode="range"
            locale={DAY_PICKER_LOCALES[locale]}
            dir={isRtl(locale) ? 'rtl' : 'ltr'}
            month={month}
            onMonthChange={(nextMonth) => setMonth(startOfMonthUtc(nextMonth))}
            onDayClick={handleDayClick}
            onSelect={keepDayPickerSelectionControlled}
            selected={selectedRange}
            numberOfMonths={numberOfMonths}
            pagedNavigation
            showOutsideDays
            timeZone={BUSINESS_TIME_ZONE}
            defaultMonth={todayMonth}
            startMonth={todayMonth}
            hideNavigation
            disabled={disabledDays}
            modifiers={{
              unavailable: unavailableDays,
            }}
            modifiersClassNames={{
              unavailable: 'booking-calendar-unavailable',
            }}
            className="booking-calendar-root w-full"
            classNames={{
              months: 'flex flex-col gap-6 md:flex-row md:gap-6',
              month: 'w-full max-w-[20rem] mx-auto space-y-3',
              month_caption: 'flex h-9 items-center justify-center',
              caption_label: 'font-head text-base font-semibold text-black',
              weekdays: 'grid grid-cols-7 gap-1',
              weekday:
                'text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45',
              week: 'grid grid-cols-7 gap-1',
              day: 'booking-calendar-day',
              day_button:
                'booking-calendar-day-button tap-reset flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 sm:h-11 sm:w-11',
              disabled: 'booking-calendar-disabled',
              outside: 'booking-calendar-outside',
              today: 'booking-calendar-today',
              selected: 'booking-calendar-selected',
              range_start: 'booking-calendar-range-start',
              range_middle: 'booking-calendar-range-middle',
              range_end: 'booking-calendar-range-end',
            }}
          />
        </div>

        {hasSelection ? (
          <div className="flex items-center justify-end border-t border-primary/10 bg-cream/40 px-5 py-3">
            <button
              type="button"
              onClick={clearDates}
              className="tap-reset inline-flex items-center gap-1.5 text-sm font-semibold text-black underline underline-offset-4 decoration-black/30 hover:decoration-black"
            >
              <X className="h-3.5 w-3.5" />
              {t.clearDates}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
