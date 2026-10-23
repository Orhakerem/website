'use client';

import { type FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { sendContactEmail } from '@/actions/contact';
import LiquidGlassButton from '@/components/LiquidGlassButton';
import { Send } from 'lucide-react';

import { useLocale } from '@/i18n/useLocale';
import { homeMessages } from '@/i18n/messages/home';
import { trackMetaLead } from '@/lib/meta-events';
import { trackGaLead } from '@/lib/ga-events';

interface HomeContactFormProps {
  theme?: 'light' | 'dark';
}

export default function HomeContactForm({ theme = 'dark' }: HomeContactFormProps) {
  const locale = useLocale();
  const t = homeMessages[locale].form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLight = theme === 'light';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);

    try {
      const result = await sendContactEmail(new FormData(form));
      if (result.success) {
        trackMetaLead({
          leadType: 'contact_inquiry',
          formLocation: 'contact',
          locale,
        });
        trackGaLead({
          leadType: 'contact_inquiry',
          formLocation: 'contact',
          locale,
        });
        toast.success(t.success);
        form.reset();
      } else {
        toast.error(result.error || t.error);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast.error(t.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const cardClass = isLight
    ? 'home-contact-card relative w-full rounded-2xl border border-secondary/30 bg-white p-6 shadow-sm'
    : 'home-contact-card relative rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm';
  const labelClass = isLight
    ? 'mb-2 block text-sm font-medium text-black/80'
    : 'mb-2 block text-sm font-medium text-white/90';
  const inputClass = isLight
    ? 'h-12 w-full rounded-xl border-2 border-secondary/40 bg-white px-4 text-base text-black placeholder-primary/40 outline-none transition-colors duration-300 focus:border-primary/60 focus:ring-2 focus:ring-primary/15'
    : 'h-12 w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 text-base text-white placeholder-white/60 outline-none transition-colors duration-300 focus:border-white/35 focus:ring-2 focus:ring-white/15';
  const textareaClass = isLight
    ? 'w-full resize-none rounded-xl border-2 border-secondary/40 bg-white px-4 py-3 text-base text-black placeholder-primary/40 outline-none transition-colors duration-300 focus:border-primary/60 focus:ring-2 focus:ring-primary/15'
    : 'w-full resize-none rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder-white/60 outline-none transition-colors duration-300 focus:border-white/35 focus:ring-2 focus:ring-white/15';
  const helperClass = isLight ? 'text-black/60 text-sm mt-4 font-medium' : 'text-white/70 text-sm mt-4 font-medium';

  const containerWrap = isLight
    ? 'w-full'
    : 'max-w-2xl mx-auto';

  return (
    <div className={containerWrap} data-animate="scale" data-delay="2">
      <div className={cardClass}>
        <form onSubmit={handleSubmit} className="home-contact-form space-y-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelClass}>
                {t.nameLabel}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder={t.namePlaceholder}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                {t.emailLabel}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder={t.emailPlaceholder}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>
              {t.messageLabel}
            </label>
            <textarea
              id="message"
              name="message"
              placeholder={t.messagePlaceholder}
              rows={4}
              required
              className={textareaClass}
            ></textarea>
          </div>

          <div className="text-center">
            {isLight ? (
              <LiquidGlassButton type="submit" className="liquid-glass-btn--solid" disabled={isSubmitting}>
                {isSubmitting ? t.sending : t.send}
                <Send className="w-4 h-4" />
              </LiquidGlassButton>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="button-hover-clean inline-flex items-center rounded-full bg-gradient-to-r from-secondary to-secondary-light px-8 py-3 text-lg font-semibold text-black shadow-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="me-2">{isSubmitting ? t.sending : t.send}</span>
                <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-black text-sm">→</span>
                </div>
              </button>
            )}

            <p className={helperClass}>{t.helper}</p>
          </div>
        </form>
      </div>
    </div>
  );
}
