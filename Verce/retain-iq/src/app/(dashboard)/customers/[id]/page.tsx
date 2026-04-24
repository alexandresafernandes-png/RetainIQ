import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/format";
 
export const metadata: Metadata = { title: "Customer" };
 
const STATUS_COLORS: Record<string, string> = {
  replied:   "badge-green",
  delivered: "badge-blue",
  sent:      "badge-blue",
  pending:   "badge-yellow",
  failed:    "badge-red",
};
 
const SENTIMENT_COLORS: Record<string, string> = {
  positive: "badge-green",
  neutral:  "badge-yellow",
  negative: "badge-red",
};
 
export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
 
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user!.id)
    .single();
 
  const bid = business?.id ?? "";
 
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("business_id", bid)
    .single();
 
  if (!customer) notFound();
 
  const [{ data: interactions }, { data: feedback }] = await Promise.all([
    supabase
      .from("interactions")
      .select("*")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("feedback_sessions")
      .select("*")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false }),
  ]);
 
  const latestFeedback = feedback?.[0] ?? null;
  const totalInteractions = interactions?.length ?? 0;
  const replied = interactions?.filter((i) => i.status === "replied").length ?? 0;
 
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-700 transition-colors mb-6"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Customers
      </Link>
 
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center">
            <span className="text-lg font-bold text-brand-600">
              {customer.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">{customer.name}</h1>
            <p className="text-sm text-neutral-500 mt-0.5">{customer.phone}</p>
          </div>
        </div>
      </div>
 
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-400 mb-1">Messages sent</p>
          <p className="text-2xl font-bold text-neutral-900">{totalInteractions}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-400 mb-1">Replies received</p>
          <p className="text-2xl font-bold text-neutral-900">{replied}</p>
        </div>
        <div className="bg-white border border-neutral-200 rounded-xl p-4">
          <p className="text-xs text-neutral-400 mb-1">Latest rating</p>
          <p className="text-2xl font-bold text-neutral-900">
            {latestFeedback?.rating ? `${latestFeedback.rating}/5` : "—"}
          </p>
        </div>
      </div>
 
      <div className="grid md:grid-cols-2 gap-6">
        {/* Info */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-neutral-900 mb-4">Details</p>
          <div className="space-y-3">
            {[
              { label: "Phone", value: customer.phone },
              { label: "Email", value: customer.email ?? "—" },
              { label: "Added", value: formatDate(customer.created_at) },
              {
                label: "Tags",
                value: customer.tags?.length ? customer.tags.join(", ") : "—",
              },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between text-sm">
                <span className="text-neutral-400 w-24 shrink-0">{label}</span>
                <span className="text-neutral-800 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
 
        {/* Latest feedback */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <p className="text-sm font-semibold text-neutral-900 mb-4">Latest feedback</p>
          {latestFeedback && latestFeedback.status === "completed" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-lg leading-none">
                  {"★".repeat(latestFeedback.rating ?? 0)}
                  {"☆".repeat(5 - (latestFeedback.rating ?? 0))}
                </span>
                {latestFeedback.sentiment && (
                  <span className={`badge ${SENTIMENT_COLORS[latestFeedback.sentiment] ?? "badge-gray"}`}>
                    {latestFeedback.sentiment}
                  </span>
                )}
              </div>
              {latestFeedback.response_text && (
                <p className="text-sm text-neutral-600 bg-neutral-50 rounded-lg p-3 leading-relaxed">
                  &ldquo;{latestFeedback.response_text}&rdquo;
                </p>
              )}
              <p className="text-xs text-neutral-400">{formatDate(latestFeedback.submitted_at)}</p>
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No feedback submitted yet.</p>
          )}
        </div>
      </div>
 
      {/* Interaction history */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden mt-6">
        <div className="px-5 py-4 border-b border-neutral-100">
          <p className="text-sm font-semibold text-neutral-900">Interaction history</p>
        </div>
 
        {interactions && interactions.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {["Date", "Message", "Status", "Direction"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {interactions.map((i) => (
                <tr key={i.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5 text-neutral-400 whitespace-nowrap">
                    {formatDate(i.sent_at ?? i.created_at)}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600 max-w-xs truncate">
                    {i.message_body ?? "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${STATUS_COLORS[i.status] ?? "badge-gray"}`}>
                      {i.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-400 capitalize">{i.direction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-neutral-400">No messages sent to this customer yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
