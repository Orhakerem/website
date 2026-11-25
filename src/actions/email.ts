'use server';

import { ZodError } from 'zod';

import { reservationSchema, eventSchema } from '@/validation';
import { getPropertyAvailability } from '@/lib/airbnb-calendar';
import {
  compareIsoDates,
  getBookingDateRangeValidationMessage,
  getTodayIsoInTimeZone,
  isIsoDateString,
} from '@/lib/booking-dates';
import {
  getBookablePropertyIdFromLabel,
  getBookablePropertyListingId,
} from '@/lib/bookable-properties';
import { getEmailConfig, sanitizeForHeader, sendResendEmail } from '@/lib/email-service';
import {
  ReservationAvailabilityError,
  savePendingReservationRequest,
} from '@/lib/reservation-requests';
import {
  type AdminCustomerRequestSummary,
  buildEventRequestSummary,
  buildQuoteDraftFromAdminRequest,
  buildReservationRequestSummary,
  saveEventRequest,
  type ReservationRequestRow,
} from '@/lib/admin-requests';
import { sendCustomerQuoteFromRequest } from '@/lib/customer-quote-delivery';
import { type CrmLeadResult, sendLeadToCrm, siteSendsOwnQuote } from '@/lib/crm-leads';

function getSafeValidationErrorMessage(error: ZodError) {
  return error.issues[0]?.message ?? 'Please check the reservation details and try again.';
}

/**
 * Best-effort internal alert when the automatic customer quote fails after the
 * request itself was saved. The customer must NOT see this as a failure (their
 * request is recorded); the admin handles the quote manually instead.
 */
async function reportAutoQuoteIssue(
  config: Parameters<typeof sendResendEmail>[0],
  requestLabel: string,
  issues: string[],
) {
  try {
    await sendResendEmail(config, {
      subject: sanitizeForHeader(`Action needed: automatic quote issue — ${requestLabel}`),
      html: `
        <h2>Automatic quote issue</h2>
        <p>The customer request (${requestLabel}) was saved, but the automatic quote hit a problem:</p>
        <ul>${issues.map((issue) => `<li>${issue}</li>`).join('')}</ul>
        <p>Review it in the back office (Requests page) and send the quote manually from the Quotes page if needed.</p>
      `.trim(),
      replyTo: config.recipientEmail,
    });
  } catch (error) {
    console.error('Auto-quote issue notification failed:', error);
  }
}

function isReservationInsertError(error: unknown) {
  return error instanceof Error && error.message.startsWith('Failed to save reservation request:');
}

async function getEventDateValidationMessage(checkIn: string) {
  if (!isIsoDateString(checkIn)) {
    return 'Please choose a valid event date.';
  }

  if (compareIsoDates(checkIn, getTodayIsoInTimeZone()) < 0) {
    return 'Please choose a current or future event date.';
  }

  const availability = await getPropertyAvailability('penthouse-jacuzzi');

  if (availability.status === 'error') {
    return 'Airbnb availability is temporarily unavailable. Please try again in a moment.';
  }

  if (availability.blockedDates.includes(checkIn)) {
    return 'That event date is unavailable on Airbnb. Please choose another date.';
  }

  return null;
}

export async function sendEmail(formData: FormData) {
  try {
    // Extract and sanitize common form fields
    const property = formData.get('property')?.toString().trim() || '';
    const name = formData.get('name')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const phone = formData.get('phone')?.toString().trim() || '';
    const contactMethod = formData.get('contactMethod')?.toString().trim() || '';

    // Determine if this is an event request
    const isEvent = property === 'Event Space Request';

    let validatedData;
    let emailContent: string;
    let subject: string;

    if (isEvent) {
      // Validate event data
      const eventData = {
        eventType: formData.get('eventType')?.toString().trim() || '',
        checkIn: formData.get('checkIn')?.toString().trim() || '',
        guestCount: formData.get('guestCount')?.toString().trim() || '',
        name,
        email,
        phone,
        contactMethod,
        message: formData.get('message')?.toString().trim(),
      };

      validatedData = eventSchema.parse(eventData);

      const eventDateValidationMessage = await getEventDateValidationMessage(validatedData.checkIn);

      if (eventDateValidationMessage) {
        return {
          success: false,
          error: eventDateValidationMessage,
        };
      }

      const { config, error: configError } = getEmailConfig();

      if (!config) {
        return {
          success: false,
          error: configError,
        };
      }

      let eventRequest: AdminCustomerRequestSummary;
      let crmLead: CrmLeadResult | null = null;

      try {
        const savedEvent = await saveEventRequest(validatedData);
        eventRequest = buildEventRequestSummary(savedEvent.request);
        // The team handles requests in the CRM: copy it there (best effort, never blocks).
        crmLead = await sendLeadToCrm({
          kind: 'event',
          guestName: validatedData.name,
          guestEmail: validatedData.email,
          guestPhone: validatedData.phone,
          contactMethod: validatedData.contactMethod,
          message: validatedData.message,
          eventType: validatedData.eventType,
          eventDate: validatedData.checkIn,
          guestCountLabel: validatedData.guestCount,
          siteListingId: 'penthouse',
          externalRef: `event_request:${savedEvent.request.id}`,
        });
      } catch (error) {
        console.error('Event request persistence failed:', error);
        return {
          success: false,
          error: 'Unable to save event request. Please try again.',
        };
      }

      // Sanitize validated data for use in headers
      const sanitizedEmail = sanitizeForHeader(validatedData.email);

      subject = sanitizeForHeader(`New Event Inquiry - ${validatedData.eventType}`);
      emailContent = `
        <h2>New Event Inquiry</h2>
        <p><strong>Event Type:</strong> ${validatedData.eventType}</p>
        <p><strong>Event Date:</strong> ${validatedData.checkIn}</p>
        <p><strong>Expected Guests:</strong> ${validatedData.guestCount}</p>
        <p><strong>Guest Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
        <p><strong>Preferred Contact Method:</strong> ${validatedData.contactMethod}</p>
        ${validatedData.message ? `<p><strong>Additional Details:</strong> ${validatedData.message}</p>` : ''}
      `.trim();

      const { error } = await sendResendEmail(config, {
        subject,
        html: emailContent,
        replyTo: sanitizedEmail,
      });

      if (error) {
        console.error('Resend API error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // The CRM took the quote on (it e-mails it to the visitor with the PDF and the terms),
      // or probably did (it answered too late): do not send a second one from here.
      if (crmLead && !siteSendsOwnQuote(crmLead)) {
        return {
          success: true,
          message: 'Email sent successfully!'
        };
      }

      // The request is saved and the internal inquiry email is out: from here
      // on, auto-quote problems are reported to the admin, never to the
      // customer (a "try again" here caused duplicate submissions).
      try {
        const quoteResult = await sendCustomerQuoteFromRequest({
          quote: buildQuoteDraftFromAdminRequest(eventRequest),
          source: {
            sourceType: 'event_request',
            sourceId: eventRequest.sourceId,
          },
        });

        if (quoteResult.status === 'sent' && quoteResult.warnings.length > 0) {
          await reportAutoQuoteIssue(
            config,
            `event request from ${sanitizeForHeader(validatedData.name)}`,
            quoteResult.warnings,
          );
        }
      } catch (error) {
        console.error('Event quote delivery failed:', error);
        await reportAutoQuoteIssue(
          config,
          `event request from ${sanitizeForHeader(validatedData.name)}`,
          [
            'The automatic quote email could not be sent to the customer. The request is still in the inbox with status "new" — send the quote manually.',
          ],
        );
      }

      return {
        success: true,
        message: 'Email sent successfully!'
      };
    } else {
      const { config, error: configError } = getEmailConfig();

      if (!config) {
        return {
          success: false,
          error: configError,
        };
      }

      // Validate reservation data
      const reservationData = {
        property,
        listingId: formData.get('listing_id')?.toString().trim() || '',
        checkIn: formData.get('checkIn')?.toString().trim() || '',
        checkOut: formData.get('checkOut')?.toString().trim() || '',
        guestsCount: formData.get('guestsCount')?.toString().trim() || undefined,
        name,
        email,
        phone,
        contactMethod,
      };

      validatedData = reservationSchema.parse(reservationData);

      const propertyId = getBookablePropertyIdFromLabel(validatedData.property);

      if (!propertyId) {
        return {
          success: false,
          error: 'Please select a valid property',
        };
      }

      const listingId = getBookablePropertyListingId(propertyId);

      if (validatedData.listingId !== listingId) {
        return {
          success: false,
          error: 'Please select a valid property before sending your request.',
        };
      }

      const availability = await getPropertyAvailability(propertyId);

      if (availability.status === 'error') {
        return {
          success: false,
          error: 'Airbnb availability is temporarily unavailable. Please try again in a moment.',
        };
      }

      const dateValidationMessage = getBookingDateRangeValidationMessage(
        {
          checkIn: validatedData.checkIn,
          checkOut: validatedData.checkOut,
        },
        undefined,
        availability.blockedDates,
      );

      if (dateValidationMessage) {
        return {
          success: false,
          error: dateValidationMessage,
        };
      }

      let reservationRequest: AdminCustomerRequestSummary;
      let crmLead: CrmLeadResult | null = null;

      try {
        const savedReservation = await savePendingReservationRequest({
          listingId,
          checkIn: validatedData.checkIn,
          checkOut: validatedData.checkOut,
          guestName: validatedData.name,
          guestEmail: validatedData.email,
          guestPhone: validatedData.phone,
          guestsCount: validatedData.guestsCount,
        });
        reservationRequest = buildReservationRequestSummary(
          savedReservation.request as ReservationRequestRow,
        );
        // The team handles requests in the CRM: copy it there (best effort, never blocks).
        crmLead = await sendLeadToCrm({
          kind: 'reservation',
          guestName: validatedData.name,
          guestEmail: validatedData.email,
          guestPhone: validatedData.phone,
          contactMethod: validatedData.contactMethod,
          checkIn: validatedData.checkIn,
          checkOut: validatedData.checkOut,
          guestsCount: validatedData.guestsCount,
          siteListingId: listingId,
          totalPrice: savedReservation.request.total_price,
          currency: savedReservation.request.currency,
          externalRef: `reservation:${savedReservation.request.id}`,
        });
      } catch (error) {
        console.error('Reservation persistence failed:', error);

        return {
          success: false,
          error:
            error instanceof ReservationAvailabilityError
              ? error.message
              : isReservationInsertError(error)
                ? 'Unable to save reservation request. Please try again.'
                : 'Unable to generate and send the reservation quote. Please try again.',
        };
      }

      // Sanitize validated data for use in headers
      const sanitizedEmail = sanitizeForHeader(validatedData.email);

      subject = sanitizeForHeader(`New Booking Request for ${validatedData.property}`);
      emailContent = `
        <h2>New Booking Request</h2>
        <p><strong>Property:</strong> ${validatedData.property}</p>
        <p><strong>Check-in:</strong> ${validatedData.checkIn}</p>
        <p><strong>Check-out:</strong> ${validatedData.checkOut}</p>
        <p><strong>Guest Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
        <p><strong>Preferred Contact Method:</strong> ${validatedData.contactMethod}</p>
      `.trim();

      const { error } = await sendResendEmail(config, {
        subject,
        html: emailContent,
        replyTo: sanitizedEmail,
      });

      if (error) {
        console.error('Resend API error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // The CRM took the quote on (it e-mails it to the visitor with the PDF and the terms),
      // or probably did (it answered too late): do not send a second one from here.
      if (crmLead && !siteSendsOwnQuote(crmLead)) {
        return {
          success: true,
          message: 'Email sent successfully!'
        };
      }

      // Same contract as the event path: the reservation is saved, so quote
      // problems go to the admin, not back to the customer.
      try {
        const quoteResult = await sendCustomerQuoteFromRequest({
          quote: buildQuoteDraftFromAdminRequest(reservationRequest),
          source: {
            sourceType: 'reservation',
            sourceId: reservationRequest.sourceId,
          },
        });

        if (quoteResult.status === 'sent' && quoteResult.warnings.length > 0) {
          await reportAutoQuoteIssue(
            config,
            `reservation request from ${sanitizeForHeader(validatedData.name)}`,
            quoteResult.warnings,
          );
        }
      } catch (error) {
        console.error('Reservation quote delivery failed:', error);
        await reportAutoQuoteIssue(
          config,
          `reservation request from ${sanitizeForHeader(validatedData.name)}`,
          [
            'The automatic quote email could not be sent to the customer. The request is still in the inbox with status "new" — send the quote manually.',
          ],
        );
      }

      return {
        success: true,
        message: 'Email sent successfully!'
      };
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    const errorMessage =
      error instanceof ZodError
        ? getSafeValidationErrorMessage(error)
        : 'Failed to send email. Please try again.';
    return {
      success: false,
      error: errorMessage
    };
  }
}
