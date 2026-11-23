'use client';

import React from 'react';
import { Printer } from 'lucide-react';

import { useLocale } from '@/i18n/useLocale';
import { legalMessages } from '@/i18n/messages/legal';

interface LegalPageShellProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  extraHeader?: React.ReactNode;
  structuredData?: Record<string, unknown>;
  children: React.ReactNode;
}

export default function LegalPageShell({
  icon,
  title,
  subtitle,
  extraHeader,
  structuredData,
  children,
}: LegalPageShellProps) {
  const locale = useLocale();
  const t = legalMessages[locale];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20">
      {structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      ) : null}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-end" data-animate="fade-left">
          <button
            onClick={handlePrint}
            className="inline-flex items-center rounded-full border border-primary/15 bg-white px-4 py-2 font-semibold text-black shadow-sm transition-all duration-300"
          >
            <Printer className="me-2 h-4 w-4" />
            {t.print}
          </button>
        </div>

        <div className="rounded-3xl border border-primary/10 bg-white p-8 shadow-xl md:p-12" data-animate="fade-up">
          <div className="mb-12 text-center" data-animate="fade-up">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light">
              {icon}
            </div>
            <h1 className="font-head text-4xl font-bold text-black md:text-5xl" data-animate="text">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-black/75">
              {subtitle}
            </p>
            {extraHeader}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start text-black/80 leading-relaxed">
          <span className="mt-2 me-3 h-2 w-2 flex-shrink-0 rounded-full bg-secondary"></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CardGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-primary/10 bg-white p-5">
          <h3 className="font-semibold text-black">{item.title}</h3>
          <p className="mt-2 text-black/75 leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
