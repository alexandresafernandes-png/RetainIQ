import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CustomersTable from "@/components/dashboard/CustomersTable";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const bid = business?.id ?? "";

  // Fetch customers + their latest interaction status in one query
  const { data: customers } = await supabase
    .from("customers")
    .select(`
      *,
      interactions (
        status,
        created_at
      )
    `)
    .eq("business_id", bid)
    .order("created_at", { ascending: false });

  // Flatten: pick the most recent interaction status per customer
  const enriched = (customers ?? []).map((c) => {
    const sorted = (c.interactions ?? []).sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return {
      ...c,
      interactions: undefined,
      latest_status: sorted[0]?.status ?? null,
    };
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Customers</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Manage your customer list and send follow-ups.</p>
      </div>

      <CustomersTable businessId={bid} customers={enriched} />
    </div>
  );
}
