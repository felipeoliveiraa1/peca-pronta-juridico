import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ChatWidget } from "@/components/dashboard/chat-widget";
import { getCurrentProfile } from "@/lib/profile";
import { getCurrentUsage } from "@/lib/usage";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const usage = await getCurrentUsage(profile.id, profile.plan);
  const admin = isAdmin(profile);

  return (
    <div className="flex min-h-screen bg-ink-100/50">
      <Sidebar />
      <div className="flex w-full min-w-0 flex-col">
        <Topbar
          email={profile.email}
          plan={profile.plan}
          usedThisMonth={usage.used}
          monthLimit={usage.limit}
          isAdmin={admin}
        />
        <main className="flex-1 p-4 pb-24 lg:p-8 lg:pb-24">{children}</main>
      </div>
      <ChatWidget />
    </div>
  );
}
