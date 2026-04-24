import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TemplatesList from "@/components/dashboard/TemplatesList";

export const metadata: Metadata = { title: "Templates" };

export default async function TemplatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const bid = business?.id ?? "";

  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .eq("business_id", bid)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/messages" className="text-sm text-neutral-400 hover:text-neutral-700 transition-colors">
            Messages
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="text-sm text-neutral-600">Templates</span>
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">Message templates</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Write the WhatsApp messages sent to your customers after a service.
          Use <code className="bg-neutral-100 text-neutral-600 px-1 rounded text-xs font-mono">{"{{customer_name}}"}</code> and{" "}
          <code className="bg-neutral-100 text-neutral-600 px-1 rounded text-xs font-mono">{"{{business_name}}"}</code> as variables.
        </p>
      </div>

      <TemplatesList businessId={bid} templates={templates ?? []} />
    </div>
  );
}
