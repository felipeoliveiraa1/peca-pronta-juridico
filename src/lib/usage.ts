import { createClient } from "@/lib/supabase/server";
import { startOfCurrentMonthISO } from "@/lib/utils";
import { getPlan, type PlanId } from "@/lib/plans";

export interface UsageState {
  plan: PlanId;
  used: number;
  limit: number | null;
  remaining: number | null;
  unlimited: boolean;
}

export async function getCurrentUsage(userId: string, plan: PlanId): Promise<UsageState> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("kind", "generation")
    .gte("created_at", startOfCurrentMonthISO());

  if (error) {
    throw new Error(`usage lookup failed: ${error.message}`);
  }

  const planDef = getPlan(plan);
  const limit = planDef.monthlyGenerationLimit;
  const used = count ?? 0;
  return {
    plan,
    used,
    limit,
    remaining: limit == null ? null : Math.max(0, limit - used),
    unlimited: limit == null,
  };
}

export function exceedsLimit(state: UsageState) {
  if (state.unlimited) return false;
  return (state.remaining ?? 0) <= 0;
}
