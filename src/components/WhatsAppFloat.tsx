'use client';

import { useLocale } from '@/i18n/useLocale';
import { trackGaOutboundContact } from '@/lib/ga-events';

const WHATSAPP_URL =
  'https://wa.me/message/KWYBTW2MTGO2M1';

/**
 * Client wrapper for the floating WhatsApp CTA. The root layout is a server
 * component, so the anchor lives here purely to attach the outbound-click
 * event. Markup, classes and SVG are unchanged from the original layout.
 */
export default function WhatsAppFloat({ ariaLabel }: { ariaLabel: string }) {
  const locale = useLocale();

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label={ariaLabel}
      onClick={() =>
        trackGaOutboundContact({
          method: 'whatsapp',
          location: 'floating_button',
          locale,
        })
      }
    >
      <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
        <path fill="white" d="M16 3C9.4 3 4 8.3 4 14.8c0 2.6.9 5 2.4 7L5 29l7-2.3c1.8.9 3.8 1.4 5.9 1.4 6.6 0 12-5.3 12-11.8S22.6 3 16 3zm0 21.5c-1.8 0-3.6-.5-5.2-1.5l-.4-.2-4.1 1.3 1.4-4-.3-.4c-1.1-1.6-1.6-3.4-1.6-5.2C5.8 9.1 10.4 5 16 5s10.2 4.1 10.2 9.8S21.6 24.5 16 24.5zm5.6-7.3c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.6-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-1-2.2-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9.6.3 1.1.5 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4 0-.1-.1-.2-.3-.3z"/>
      </svg>
    </a>
  );
}
