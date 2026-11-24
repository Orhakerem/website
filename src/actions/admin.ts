'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { saveAdminQuoteHistory } from '@/actions/admin-quote-history';
import { MissingAdminAuthEnvError, verifyCredentials } from '@/lib/admin-auth';
import {
  checkAdminLoginRateLimit,
  clearAdminLoginFailures,
  registerFailedAdminLogin,
} from '@/lib/admin-login-rate-limit';
import { clearAdminSession, createAdminSession, getAdminSession } from '@/lib/admin-session';
import { getBookablePropertyCalendarSnapshot } from '@/lib/airbnb-calendar';
import {
  getAvailabilityStatusForAdminApartment,
  getAdminApartmentPropertyIds,
  getBlockedDatesForAdminApartment,
  getBlockedStayNights,
  normalizeAdminApartment,
} from '@/lib/admin-availability';
import { fetchAdminCalendarSnapshot, validateAdminCalendarStay } from '@/lib/admin-calendar';
import {
  markAdminRequestQuoteSent,
  normalizeAdminRequestSource,
  type AdminRequestSourceInput,
} from '@/lib/admin-requests';
import {
  calculateAdminQuote,
  parseAdminDateToIso,
} from '@/lib/admin-quote-calculations';
import { sanitizeForHeader, sendReservationQuoteEmail } from '@/lib/email-service';
import { buildEstimatePdfFilename, renderEstimatePdf } from '@/lib/estimate-pdf';
import { buildReservationPdfAttachment } from '@/lib/reservation-email-attachments';
import { renderReservationEmailHtml } from '@/lib/reservation-email';
import { buildReservationEmailSubject } from '@/lib/reservation-email-subject';
import { reservationQuoteSchema, type ReservationQuoteData } from '@/lib/reservation-quote';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface SendQuoteResult {
  success: boolean;
  status?: 'sent' | 'preview';
  message?: string;
  error?: string;
}

export async function loginAdmin(formData: FormData): Promise<LoginResult> {
  const email = formData.get('email')?.toString() ?? '';
  const password = formData.get('password')?.toString() ?? '';

  const clientKey =
    headers().get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-client';
  const rateLimit = checkAdminLoginRateLimit(clientKey);

  if (!rateLimit.allowed) {
    const retryMinutes = Math.max(1, Math.ceil(rateLimit.retryAfterMs / 60_000));
    return {
      success: false,
      error: `Too many failed attempts. Try again in about ${retryMinutes} min.`,
    };
  }

  try {
    if (!verifyCredentials(email, password)) {
      registerFailedAdminLogin(clientKey);
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    if (error instanceof MissingAdminAuthEnvError) {
      console.error('Admin login is not configured:', error.message);
      return {
        success: false,
        error: `Admin login is not configured on this environment (${error.envName} is missing).`,
      };
    }
    throw error;
  }

  clearAdminLoginFailures(clientKey);
  createAdminSession();
  return { success: true };
}

export async function logoutAdmin(): Promise<void> {
  clearAdminSession();
  redirect('/admin/login');
}

export async function sendReservationQuote(
  input: ReservationQuoteData,
  sourceContext?: AdminRequestSourceInput | null,
): Promise<SendQuoteResult> {
  if (!getAdminSession()) {
    return { success: false, error: 'Not authenticated' };
  }

  const parsed = reservationQuoteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid form data',
    };
  }
  const data = calculateAdminQuote(parsed.data);
  const source = sourceContext ? normalizeAdminRequestSource(sourceContext) : null;

  const checkIn = parseAdminDateToIso(data.checkInDate);
  const checkOut = parseAdminDateToIso(data.checkOutDate);

  if (checkIn && checkOut) {
    const { blockedDatesByProperty, availabilityStatusByProperty } =
      await getBookablePropertyCalendarSnapshot();
    const availabilityStatus = getAvailabilityStatusForAdminApartment(
      data.apartment,
      availabilityStatusByProperty,
    );

    if (availabilityStatus === 'error') {
      return {
        success: false,
        error: 'Calendar availability is temporarily unavailable. Refresh before sending.',
      };
    }

    const blockedDates = getBlockedDatesForAdminApartment(
      data.apartment,
      blockedDatesByProperty,
    );
    const blockedStayNights = getBlockedStayNights({ checkIn, checkOut }, blockedDates);

    if (blockedStayNights.length > 0) {
      return {
        success: false,
        error: `Selected stay includes unavailable date ${blockedStayNights[0]}.`,
      };
    }

    const calendarValidation = validateAdminCalendarStay(
      await fetchAdminCalendarSnapshot(),
      {
        propertyIds: [...getAdminApartmentPropertyIds(normalizeAdminApartment(data.apartment))],
        checkIn,
        checkOut,
      },
    );

    if (!calendarValidation.available) {
      return {
        success: false,
        error:
          calendarValidation.reasons[0] ??
          'Selected stay violates an internal calendar rule.',
      };
    }
  }

  const subject = sanitizeForHeader(buildReservationEmailSubject());

  try {
    const [html, pdf] = await Promise.all([
      renderReservationEmailHtml(),
      renderEstimatePdf(data),
    ]);

    const result = await sendReservationQuoteEmail({
      to: data.customerEmail,
      subject,
      html,
      replyTo: process.env.RECIPIENT_EMAIL?.trim() || undefined,
      attachments: [
        buildReservationPdfAttachment({
          filename: buildEstimatePdfFilename(data),
          content: pdf,
        }),
      ],
    });

    if (result.status === 'sent') {
      // The customer email is out; bookkeeping failures below must be shown
      // to the admin instead of silently logging behind a success message.
      const warnings: string[] = [];

      const historyResult = await saveAdminQuoteHistory({
        quote: data,
        resendEmailId: result.id,
        source,
      });

      if (!historyResult.success) {
        console.error('Reservation quote history save failed:', historyResult.error);
        warnings.push('the quote history was NOT saved');
      }

      try {
        await markAdminRequestQuoteSent(source);
      } catch (error) {
        console.error('Admin request status update failed:', error);
        warnings.push('the request status was NOT updated to "quote sent"');
      }

      return {
        success: true,
        status: 'sent',
        message:
          warnings.length > 0
            ? `Reservation email sent to ${data.customerEmail}, BUT ${warnings.join(' and ')}. Check Supabase and the Requests page.`
            : `Reservation email sent to ${data.customerEmail}.`,
      };
    }

    return {
      success: true,
      status: 'preview',
      message: result.reason ?? 'Email was not delivered.',
    };
  } catch (error) {
    console.error('Reservation quote send failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send reservation email',
    };
  }
}
