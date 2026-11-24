'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { faqData, type FAQCategory, type FAQEntry } from '@/lib/faq-data';
import { useLocale } from '@/i18n/useLocale';
import { faqMessages } from '@/i18n/messages/faq';

export default function FAQPage() {
  const locale = useLocale();
  const t = faqMessages[locale];
  const [openKey, setOpenKey] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const order: FAQCategory[] = [];
    const map = new Map<FAQCategory, FAQEntry[]>();
    for (const entry of faqData[locale]) {
      if (!map.has(entry.category)) {
        order.push(entry.category);
        map.set(entry.category, []);
      }
      map.get(entry.category)!.push(entry);
    }
    return order.map((category) => ({ category, items: map.get(category)! }));
  }, [locale]);

  return (
    <div className="relative min-h-screen bg-cream">
      <section className="relative overflow-hidden bg-primary pt-20 pb-6 sm:pt-24 sm:pb-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.55) 0, transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.35) 0, transparent 40%)',
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-head font-bold leading-[1.05] text-white text-3xl sm:text-4xl lg:text-5xl">
            {t.headingBefore}
            <span className="italic font-normal text-white/85">{t.headingItalic}</span>
            {t.headingAfter}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
            {t.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {grouped.map((group) => {
            return (
              <section
                key={group.category}
                id={`cat-${group.category}`}
                className="scroll-mt-28 flex flex-col rounded-[1.75rem] border border-primary/10 bg-white shadow-[0_18px_50px_rgba(83,45,36,0.08)]"
              >
                <header className="flex items-start gap-4 border-b border-primary/10 px-6 py-6 sm:px-7">
                  <div className="flex-1">
                    <h2 className="font-head text-2xl font-bold text-black sm:text-[1.7rem]">
                      {t.categories[group.category].label}
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-black/65">
                      {t.categories[group.category].description}
                    </p>
                  </div>
                </header>

                <ul className="flex-1 divide-y divide-primary/10 px-6 sm:px-7">
                  {group.items.map((faq, index) => {
                    const key = `${group.category}-${index}`;
                    const isOpen = openKey === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          className="tap-reset group flex w-full items-start gap-4 py-4 text-start"
                          onClick={() => setOpenKey(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-${key}`}
                        >
                          <span className="flex-1 font-head text-base font-semibold leading-snug text-black sm:text-[17px]">
                            {faq.question}
                          </span>
                          <span
                            className={`mt-1 flex shrink-0 items-center justify-center text-black transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          >
                            <ChevronDown className="h-5 w-5" />
                          </span>
                        </button>
                        <div
                          id={`faq-${key}`}
                          className={`grid overflow-hidden transition-all duration-500 ease-out ${
                            isOpen ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0'
                          }`}
                        >
                          <div className="min-h-0">
                            <div className="border-s-2 border-primary/15 ps-4 text-[15px] leading-7 text-black/75">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-10 rounded-[1.75rem] border border-primary/10 bg-white px-6 py-8 text-center shadow-[0_18px_50px_rgba(83,45,36,0.08)] sm:px-10 sm:py-10">
          <p className="font-head text-xl text-black sm:text-2xl">{t.notFoundTitle}</p>
          <p className="mt-2 text-sm text-black/65 sm:text-base">
            {t.notFoundBefore}
            <a
              href="mailto:orhakerem@45beach.com"
              className="font-semibold text-black underline-offset-4 hover:underline"
            >
              orhakerem@45beach.com
            </a>
            {t.notFoundAfter}
          </p>
        </div>
      </div>
    </div>
  );
}
