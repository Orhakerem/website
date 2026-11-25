// Copies every request made on the site to the CRM (admin.45beach.com, POST /api/v1/leads),
// where the team now handles requests for both brands.
//
// Best effort, by design: the visitor's request never fails because the CRM is slow or down.
// A failure is logged (status only, never the visitor's data or the key) and the request is
// still saved and e-mailed by the site as before.
//
// The CRM also e-mails the automatic quote to the visitor (PDF + terms). Its answer says so
// (`autoQuote: 'pending'`), and the site then does not send its own: one quote, not two. When
// the CRM is certainly out (not configured, refused, unreachable) or does not take the quote
// on, the site sends its own as before; after a timeout it does not (see siteSendsOwnQuote).
//
// Environment (server only):
//   CRM_LEADS_API_KEY  CRM API key with scope `leads:write`, bound to this brand. Unset → skipped.
//   CRM_API_URL        optional, defaults to https://admin.45beach.com

export const CRM_BRAND = 'orhakerem';
const DEFAULT_CRM_URL = 'https://admin.45beach.com';
// Long enough for a cold start of the CRM (its answer has been seen to take more than 5 s).
const DEFAULT_TIMEOUT_MS = 15_000;

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
  | {
      sent: false;
      /**
       * `timeout` is ambiguous: the CRM may well have received the request and be answering
       * late (it then e-mails the quote itself). The other reasons are definite failures.
       */
      reason: 'not_configured' | 'network' | 'timeout' | `http_${number}`;
    };

/**
 * Should the site e-mail its own automatic quote? Only when it is certain the CRM will not:
 * the CRM is not configured, refused the request, could not be reached, or answered without
 * taking the quote on. After a timeout the CRM most likely has the request and sends the
 * quote; sending one from here too would give the visitor two.
 */
export function siteSendsOwnQuote(result: CrmLeadResult): boolean {
  if (result.sent) return !result.crmSendsQuote;
  return result.reason !== 'timeout';
}

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
    const name = error instanceof Error ? error.name : 'error';
    console.error(`[crm-leads] could not reach the CRM (${name})`);
    return { sent: false, reason: name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'network' };
  }
}
