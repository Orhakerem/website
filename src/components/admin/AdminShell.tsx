import Link from 'next/link';
import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';

import { logoutAdmin } from '@/actions/admin';

type AdminNavItem = {
  href: string;
  label: string;
};

const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/requests', label: 'Requests' },
  { href: '/admin/devis', label: 'Quotes' },
  { href: '/admin/calendar', label: 'Calendar' },
];

interface AdminShellProps {
  activePath?: string;
  children: ReactNode;
  description: string;
  title: string;
}

export default function AdminShell({
  activePath,
  children,
  description,
  title,
}: AdminShellProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <header className="mb-8 border-b border-primary/15 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-primary/70">
              Or Hakerem · Back office
            </p>
            <h1 className="mt-2 font-head text-4xl font-light tracking-h1 text-black">
              {title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-black/60">{description}</p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-primary/30 px-5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </form>
        </div>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Admin navigation">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = activePath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-primary bg-primary text-cream'
                    : 'border-primary/20 bg-white text-primary hover:border-primary/40 hover:bg-primary/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {children}
    </div>
  );
}
