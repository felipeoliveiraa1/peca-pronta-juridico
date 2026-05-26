import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getCurrentProfile } from "@/lib/profile";
import { getCurrentUsage } from "@/lib/usage";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const usage = await getCurrentUsage(profile.id, profile.plan);

  return (
    <div className="flex min-h-screen bg-ink-100/50">
      <Sidebar />
      <div className="flex w-full min-w-0 flex-col">
        <Topbar
          email={profile.email}
          plan={profile.plan}
          usedThisMonth={usage.used}
          monthLimit={usage.limit}
        />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
