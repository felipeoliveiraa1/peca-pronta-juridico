import { redirect } from "next/navigation";
import { getCurrentProfile, type ProfileRow } from "@/lib/profile";

const DEFAULT_ADMIN_EMAILS = [
  "felipeoliveiraa1@hotmail.com",
  "ferramentas@triacompany.com.br",
];

function getAdminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const merged = new Set([
    ...DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()),
    ...fromEnv,
  ]);
  return Array.from(merged);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export function isAdmin(profile: ProfileRow | null | undefined): boolean {
  return isAdminEmail(profile?.email);
}

export async function requireAdmin(): Promise<ProfileRow> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!isAdmin(profile)) redirect("/dashboard");
  return profile;
}
