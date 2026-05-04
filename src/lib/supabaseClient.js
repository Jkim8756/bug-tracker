import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const hasSupabaseConfig = Boolean(
  supabaseUrl &&
    supabaseKey &&
    !supabaseUrl.includes("your-project-id") &&
    !supabaseKey.includes("replace_me"),
);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseKey)
  : null;
