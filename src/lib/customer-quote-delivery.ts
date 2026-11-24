import { saveAdminQuoteHistoryEntry, type SaveAdminQuoteHistoryInput } from './admin-quote-history';
import type { AdminRequestSourceInput } from './admin-request-status';
import { markAdminRequestQuoteSent } from './admin-requests';
import { buildReservationPdfAttachment } from './reservation-email-attachments';
import { buildReservationEmailSubject } from './reservation-email-subject';
import type { ReservationQuoteData } from './reservation-quote';

type SendReservationResult =
  | {
      status: 'sent';
      id?: string;
    }
  | {
      status: 'preview';
      reason?: string;
    };

interface SendCustomerQuoteInput {
  quote: ReservationQuoteData;
  source: AdminRequestSourceInput;
}

interface CustomerQuoteEmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

interface CustomerQuoteDeliveryDependencies {
  renderHtml: () => Promise<string>;
  renderPdf: (quote: ReservationQuoteData) => Promise<Buffer>;
  buildFilename: (quote: ReservationQuoteData) => Promise<string>;
  sendEmail: (payload: CustomerQuoteEmailPayload) => Promise<SendReservationResult>;
  saveHistory: (input: SaveAdminQuoteHistoryInput) => Promise<{ success: boolean; error?: string }>;
  markQuoteSent: (source: AdminRequestSourceInput) => Promise<unknown>;
}

export type CustomerQuoteDeliveryResult =
  | {
      status: 'sent';
      emailId?: string;
      /**
       * Post-send bookkeeping failures (history save, request status update).
       * The customer email IS delivered when these are present — callers must
       * surface them to the admin instead of treating the send as failed.
       */
      warnings: string[];
    }
  | {
      status: 'preview';
      reason: string;
    };

function getDefaultDependencies(): CustomerQuoteDeliveryDependencies {
  return {
    renderHtml: async () => {
      const { renderReservationEmailHtml } = await import('./reservation-email');

      return renderReservationEmailHtml();
    },
    renderPdf: async (quote) => {
      const { renderEstimatePdf } = await import('./estimate-pdf');

      return renderEstimatePdf(quote);
    },
    buildFilename: async (quote) => {
      const { buildEstimatePdfFilename } = await import('./estimate-pdf');

      return buildEstimatePdfFilename(quote);
    },
    sendEmail: async (payload) => {
      const { sendReservationQuoteEmail } = await import('./email-service');

      return sendReservationQuoteEmail(payload);
    },
    saveHistory: async (input) => {
      await saveAdminQuoteHistoryEntry(input);

      return { success: true };
    },
    markQuoteSent: markAdminRequestQuoteSent,
  };
}

function sanitizeForHeader(value: string) {
  return value.replace(/[^\x00-\x7F]/g, '?');
}

export async function sendCustomerQuoteFromRequest(
  input: SendCustomerQuoteInput,
  dependencies: CustomerQuoteDeliveryDependencies = getDefaultDependencies(),
): Promise<CustomerQuoteDeliveryResult> {
  const subject = sanitizeForHeader(buildReservationEmailSubject());
  const [html, pdf, filename] = await Promise.all([
    dependencies.renderHtml(),
    dependencies.renderPdf(input.quote),
    dependencies.buildFilename(input.quote),
  ]);
  const result = await dependencies.sendEmail({
    to: input.quote.customerEmail,
    subject,
    html,
    replyTo: process.env.RECIPIENT_EMAIL?.trim() || undefined,
    attachments: [
      buildReservationPdfAttachment({
        filename,
        content: pdf,
      }),
    ],
  });

  if (result.status !== 'sent') {
    return {
      status: 'preview',
      reason: result.reason ?? 'Email was not delivered.',
    };
  }

  // The email is delivered at this point: bookkeeping failures below must not
  // bubble up as a send failure (that caused customers to resubmit and receive
  // duplicate quotes). Both steps always run; failures become warnings.
  const warnings: string[] = [];

  try {
    const historyResult = await dependencies.saveHistory({
      quote: input.quote,
      resendEmailId: result.id,
      source: input.source,
    });

    if (!historyResult.success) {
      throw new Error(historyResult.error ?? 'Failed to save quote history');
    }
  } catch (error) {
    console.error('Customer quote history save failed:', error);
    warnings.push(
      `Quote email was sent but saving the quote history failed (${getErrorMessage(error)}).`,
    );
  }

  try {
    await dependencies.markQuoteSent(input.source);
  } catch (error) {
    console.error('Customer quote request status update failed:', error);
    warnings.push(
      `Quote email was sent but updating the request status failed (${getErrorMessage(error)}).`,
    );
  }

  return {
    status: 'sent',
    emailId: result.id,
    warnings,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'unknown error';
}
