'use server';

import { revalidatePath } from 'next/cache';
import { ZodError } from 'zod';

import {
  saveAdminQuoteHistoryEntry,
  type AdminQuoteHistorySupabaseClient,
  type SaveAdminQuoteHistoryInput,
} from '@/lib/admin-quote-history';
import { getAdminSession } from '@/lib/admin-session';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallback;
  }

  return error instanceof Error ? error.message : fallback;
}

export async function saveAdminQuoteHistory(input: SaveAdminQuoteHistoryInput) {
  if (!getAdminSession()) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const result = await saveAdminQuoteHistoryEntry(
      input,
      getSupabaseAdminClient() as unknown as AdminQuoteHistorySupabaseClient,
    );
    revalidatePath('/admin');
    revalidatePath('/en/admin');

    return {
      success: true,
      history: result.history,
    };
  } catch (error) {
    console.error('Admin quote history save failed:', error);
    return {
      success: false,
      error: getActionErrorMessage(error, 'Failed to save admin quote history'),
    };
  }
}
