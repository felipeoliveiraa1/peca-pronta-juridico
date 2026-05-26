import { createClient } from "@/lib/supabase/server";
import type { PlanId } from "@/lib/plans";

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  plan: PlanId;
  gateway_customer_id: string | null;
  trial_ends_at: string | null;
}

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, plan, gateway_customer_id, trial_ends_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[profile] failed to load", error);
    return null;
  }
  return data as ProfileRow | null;
}

export async function requireProfile(): Promise<ProfileRow> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new Error("UNAUTHENTICATED");
  }
  return profile;
}
