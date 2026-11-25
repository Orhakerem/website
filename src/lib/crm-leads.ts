// Copies every request made on the site to the CRM (admin.45beach.com, POST /api/v1/leads),
// where the team now handles requests for both brands.
//
// Best effort, by design: the visitor's request never fails because the CRM is slow or down.
// A failure is logged (status only, never the visitor's data or the key) and the request is
// still saved and e-mailed by the site as before.
//
// The CRM also e-mails the automatic quote to the visitor (PDF + terms). Its answer says so
// (`autoQuote: 'pending'`), and the site then does not send its own: one quote, not two. When
// the CRM cannot be reached, or does not take the quote on, the site sends its own as before.
//
// Environment (server only):
//   CRM_LEADS_API_KEY  CRM API key with scope `leads:write`, bound to this brand. Unset → skipped.
//   CRM_API_URL        optional, defaults to https://admin.45beach.com

export const CRM_BRAND = 'orhakerem';
const DEFAULT_CRM_URL = 'https://admin.45beach.com';
const DEFAULT_TIMEOUT_MS = 5000;

export type CrmLeadKind = 'reservation' | 'event' | 'general';

export interface CrmLead {
  kind: CrmLeadKind;
  guestName: string;
  guestEmail?: string | null;
  guestPhone?: string | null;
  contactMethod?: string | null;
  message?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  guestsCount?: number | null;
  eventType?: string | null;
  eventDate?: string | null;
  guestCountLabel?: string | null;
  /** Site listing id (`penthouse`, `studio`): the CRM maps it to its own unit. */
  siteListingId?: string | null;
  /** Amount shown to the visitor, for information (the CRM never computes prices). */
  totalPrice?: number | null;
  currency?: string | null;
  /** Idempotency key: the same value never creates a second request in the CRM. */
  externalRef?: string | null;
}

export type CrmLeadResult =
  | {
      sent: true;
      status: number;
      /** True when the CRM answered that it will e-mail the quote to the visitor itself. */
      crmSendsQuote: boolean;
    }
  | { sent: false; reason: 'not_configured' | 'network' | `http_${number}` };

const CONTACT_METHODS = new Set(['email', 'phone', 'whatsapp']);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** The JSON body the CRM expects: known keys only (it refuses unknown ones), empty values left out. */
export function buildCrmLeadBody(lead: CrmLead): Record<string, string | number> {
  const body: Record<string, string | number> = { brand: CRM_BRAND, kind: lead.kind };

  const text = (key: string, value: string | null | undefined, max: number, singleLine = true) => {
    const cleaned = singleLine ? (value ?? '').replace(/\s+/g, ' ').trim() : (value ?? '').trim();
    if (cleaned) body[key] = cleaned.slice(0, max);
  };
  const date = (key: string, value: string | null | undefined) => {
    const cleaned = (value ?? '').trim();
    if (ISO_DATE.test(cleaned)) body[key] = cleaned;
  };

  text('guestName', lead.guestName, 200);
  text('guestEmail', lead.guestEmail, 200);
  text('guestPhone', lead.guestPhone, 40);
  const method = (lead.contactMethod ?? '').trim().toLowerCase();
  if (CONTACT_METHODS.has(method)) body.contactMethod = method;
  text('message', lead.message, 5000, false);
  date('checkIn', lead.checkIn);
  date('checkOut', lead.checkOut);
  if (typeof lead.guestsCount === 'number' && Number.isInteger(lead.guestsCount) && lead.guestsCount >= 0 && lead.guestsCount <= 100) {
    body.guestsCount = lead.guestsCount;
  }
  text('eventType', lead.eventType, 200);
  date('eventDate', lead.eventDate);
  text('guestCountLabel', lead.guestCountLabel, 60);
  text('siteListingId', lead.siteListingId, 80);
  if (typeof lead.totalPrice === 'number' && Number.isFinite(lead.totalPrice) && lead.totalPrice >= 0) {
    body.totalPrice = lead.totalPrice;
  }
  const currency = (lead.currency ?? '').trim();
  if (/^[A-Za-z]{3}$/.test(currency)) body.currency = currency.toUpperCase();
  text('externalRef', lead.externalRef, 200);
  return body;
}

/** `{ data: { autoQuote: 'pending' } }` in the CRM's answer; anything else (old CRM, bad body) is false. */
async function readsAutoQuotePending(response: Response): Promise<boolean> {
  try {
    const body: unknown = await response.json();
    const data = (body as { data?: { autoQuote?: unknown } } | null)?.data;
    return data?.autoQuote === 'pending';
  } catch {
    return false;
  }
}

export interface CrmLeadOptions {
  fetchImpl?: typeof fetch;
  env?: Record<string, string | undefined>;
  timeoutMs?: number;
}

/** Sends the lead to the CRM. Never throws. */
export async function sendLeadToCrm(lead: CrmLead, options: CrmLeadOptions = {}): Promise<CrmLeadResult> {
  const env = options.env ?? process.env;
  const key = env.CRM_LEADS_API_KEY?.trim();
  if (!key) return { sent: false, reason: 'not_configured' };

  const base = (env.CRM_API_URL?.trim() || DEFAULT_CRM_URL).replace(/\/+$/, '');
  try {
    const response = await (options.fetchImpl ?? fetch)(`${base}/api/v1/leads`, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify(buildCrmLeadBody(lead)),
      signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error(`[crm-leads] the CRM answered ${response.status} for a ${lead.kind} lead`);
      return { sent: false, reason: `http_${response.status}` };
    }
    return { sent: true, status: response.status, crmSendsQuote: await readsAutoQuotePending(response) };
  } catch (error) {
    console.error(`[crm-leads] could not reach the CRM (${error instanceof Error ? error.name : 'error'})`);
    return { sent: false, reason: 'network' };
  }
}
