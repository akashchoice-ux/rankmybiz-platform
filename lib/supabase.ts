// @ts-nocheck — @supabase/ssr not yet installed; this file activates in Phase 3
import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client — use in Client Components
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
