import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/dashboard/SettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user!.id)
    .single();

  if (!business) return (
    <div className="max-w-xl mx-auto">
      <p className="text-sm text-neutral-400">Business not found. Please contact support.</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Configure your business profile and automation preferences.</p>
      </div>

      <SettingsForm business={business} />

      {/* Account info — read only */}
      <section className="bg-white border border-neutral-200 rounded-xl p-6 mt-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Email</span>
            <span className="text-neutral-800">{user!.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Account ID</span>
            <span className="text-neutral-400 font-mono text-xs">{user!.id.slice(0, 8)}…</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Member since</span>
            <span className="text-neutral-800">
              {new Date(user!.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
