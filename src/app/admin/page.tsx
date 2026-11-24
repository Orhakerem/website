import { redirect } from 'next/navigation';

import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminShell from '@/components/admin/AdminShell';
import { getAdminSession } from '@/lib/admin-session';
import { fetchAdminDashboardSummary, type AdminDashboardSummary } from '@/lib/admin-quote-history';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

async function getDashboardSummary(): Promise<AdminDashboardSummary> {
  try {
    return await fetchAdminDashboardSummary(getSupabaseAdminClient());
  } catch (error) {
    return {
      recentQuotes: [],
      unavailableReason: error instanceof Error ? error.message : 'Dashboard data unavailable',
    };
  }
}

export default async function AdminPage() {
  if (!getAdminSession()) {
    redirect('/admin/login');
  }

  const summary = await getDashboardSummary();

  return (
    <AdminShell
      title="Dashboard"
      description="Choose the back-office workflow you want to manage."
    >
      <AdminDashboard summary={summary} />
    </AdminShell>
  );
}
