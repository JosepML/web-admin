import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oadmqwtnxpbotxcgzaoo.supabase.co").trim().replace(/\/+$/, "");
const SUPABASE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_cuj1iVbaEM0X_C9YiYV7eQ_FgwCxbbo").trim();

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde un Server Component: las cookies se refrescan en el middleware.
          }
        },
      },
    },
  );
}
