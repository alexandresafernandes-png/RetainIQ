import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";
 
export const metadata: Metadata = { title: "Overview" };
 
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "bg-brand-600 border-brand-600" : "bg-white border-neutral-200"}`}>
      <p className={`text-sm mb-3 ${accent ? "text-brand-200" : "text-neutral-500"}`}>{label}</p>
      <p className={`text-3xl font-bold leading-none mb-1 ${accent ? "text-white" : "text-neutral-900"}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-2 ${accent ? "text-brand-200" : "text-neutral-400"}`}>{sub}</p>
      )}
    </div>
  );
}
 
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
 
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("owner_id", user!.id)
    .single();
 
  const bid = business?.id ?? "";
 
  const [
    { count: totalCustomers },
    { count: totalSent },
    { count: replied },
    { count: feedbackCount },
    { data: recentFeedback },
    { data: recentInteractions },
  ] = await Promise.all([
    supabase.from("customers").select("*", { count: "exact", head: true }).eq("business_id", bid),
    supabase.from("interactions").select("*", { count: "exact", head: true }).eq("business_id", bid).eq("direction", "outbound"),
    supabase.from("interactions").select("*", { count: "exact", head: true }).eq("business_id", bid).eq("status", "replied"),
    supabase.from("feedback_sessions").select("*", { count: "exact", head: true }).eq("business_id", bid).eq("status", "completed"),
    supabase.from("feedback_sessions")
      .select("id, rating, sentiment, submitted_at, customers(name)")
      .eq("business_id", bid)
      .eq("status", "completed")
      .order("submitted_at", { ascending: false })
      .limit(5),
    supabase.from("interactions")
      .select("id, status, sent_at, message_body, customers(name)")
      .eq("business_id", bid)
      .eq("direction", "outbound")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
 
  const replyRate =
    totalSent && replied
      ? Math.round(((replied ?? 0) / (totalSent ?? 1)) * 100)
      : 0;
 
  const sentimentColors: Record<string, string> = {
    positive: "badge-green",
    neutral: "badge-yellow",
    negative: "badge-red",
  };
 
  const statusColors: Record<string, string> = {
    sent: "badge-blue",
    delivered: "badge-blue",
    replied: "badge-green",
    failed: "badge-red",
    pending: "badge-gray",
  };
 
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900">Overview</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {business?.name ?? "Your business"} · all time
        </p>
      </div>
 
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total customers" value={totalCustomers ?? 0} sub="Added to RetainIQ" />
        <StatCard label="Messages sent" value={totalSent ?? 0} sub="WhatsApp follow-ups" />
        <StatCard
          label="Reply rate"
          value={`${replyRate}%`}
          sub={`${replied ?? 0} of ${totalSent ?? 0} messages`}
          accent
        />
        <StatCard label="Feedback collected" value={feedbackCount ?? 0} sub="Completed responses" />
      </div>
 
      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
 
        {/* Recent feedback */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-900">Recent feedback</p>
            <Link href="/feedback" className="text-xs text-brand-600 hover:underline font-medium">
              View all
            </Link>
          </div>
 
          {recentFeedback && recentFeedback.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {recentFeedback.map((f) => {
                const raw = f.customers;
                const customer = Array.isArray(raw) ? (raw[0] ?? null) : raw;
                const customerName = (customer as { name?: string } | null)?.name;
                return (
                  <div key={f.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{customerName ?? "Customer"}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{formatDate(f.submitted_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {f.rating && (
                        <span className="text-xs text-neutral-400 font-medium">
                          {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
                        </span>
                      )}
                      {f.sentiment && (
                        <span className={`badge ${sentimentColors[f.sentiment] ?? "badge-gray"}`}>
                          {f.sentiment}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-neutral-400">No feedback yet.</p>
              <p className="text-xs text-neutral-300 mt-1">Send your first follow-up to get started.</p>
            </div>
          )}
        </div>
 
        {/* Recent messages */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-900">Recent messages</p>
            <Link href="/messages" className="text-xs text-brand-600 hover:underline font-medium">
              View all
            </Link>
          </div>
 
          {recentInteractions && recentInteractions.length > 0 ? (
            <div className="divide-y divide-neutral-100">
              {recentInteractions.map((i) => {
                const rawI = i.customers;
                const customer = Array.isArray(rawI) ? (rawI[0] ?? null) : rawI;
                const customerName = (customer as { name?: string } | null)?.name;
                return (
                  <div key={i.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="min-w-0 mr-3">
                      <p className="text-sm font-medium text-neutral-800">{customerName ?? "Customer"}</p>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate max-w-[180px]">
                        {i.message_body ?? "Follow-up message"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="text-xs text-neutral-400">{formatDate(i.sent_at)}</p>
                      <span className={`badge ${statusColors[i.status] ?? "badge-gray"}`}>
                        {i.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-neutral-400">No messages sent yet.</p>
              <Link href="/customers" className="text-xs text-brand-600 hover:underline mt-1 inline-block">
                Add a customer to start
              </Link>
            </div>
          )}
        </div>
 
      </div>
    </div>
  );
}
 
