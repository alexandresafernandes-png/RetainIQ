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
    <div
      className={`rounded-[var(--radius-lg)] border p-5 ${
        accent
          ? "bg-brand-600 border-brand-700"
          : "bg-white border-zinc-200"
      }`}
    >
      <p className={`text-xs font-medium uppercase tracking-widest mb-3 ${accent ? "text-brand-200" : "text-zinc-400"}`}>
        {label}
      </p>
      <p className={`text-[28px] font-semibold leading-none tracking-tight ${accent ? "text-white" : "text-zinc-900"}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-2 ${accent ? "text-brand-200" : "text-zinc-400"}`}>{sub}</p>
      )}
    </div>
  );
}

const SENTIMENT_BADGE: Record<string, string> = {
  positive: "badge-green",
  neutral:  "badge-yellow",
  negative: "badge-red",
};
const STATUS_BADGE: Record<string, string> = {
  sent:      "badge-blue",
  delivered: "badge-blue",
  replied:   "badge-green",
  failed:    "badge-red",
  pending:   "badge-gray",
};

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
      .eq("business_id", bid).eq("status", "completed")
      .order("submitted_at", { ascending: false }).limit(5),
    supabase.from("interactions")
      .select("id, status, sent_at, message_body, customers(name)")
      .eq("business_id", bid).eq("direction", "outbound")
      .order("created_at", { ascending: false }).limit(5),
  ]);

  const replyRate = totalSent && replied
    ? Math.round(((replied ?? 0) / (totalSent ?? 1)) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">Overview</h1>
        <p className="page-sub">{business?.name ?? "Your business"}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Customers"  value={totalCustomers ?? 0}  sub="Total added" />
        <StatCard label="Sent"       value={totalSent ?? 0}       sub="WhatsApp messages" />
        <StatCard label="Reply rate" value={`${replyRate}%`}       sub={`${replied ?? 0} replied`} accent />
        <StatCard label="Feedback"   value={feedbackCount ?? 0}   sub="Responses collected" />
      </div>

      {/* Activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent feedback */}
        <div className="bg-white border border-zinc-200 rounded-[var(--radius-lg)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
            <p className="text-[13px] font-semibold text-zinc-800">Recent feedback</p>
            <Link href="/feedback" className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors">
              View all →
            </Link>
          </div>

          {recentFeedback && recentFeedback.length > 0 ? (
            <div className="divide-y divide-zinc-50">
              {recentFeedback.map((f) => {
                const raw = f.customers;
                const customer = Array.isArray(raw) ? (raw[0] ?? null) : raw;
                const name = (customer as { name?: string } | null)?.name;
                return (
                  <div key={f.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-zinc-800">{name ?? "Customer"}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{formatDate(f.submitted_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {f.rating && (
                        <span className="text-xs text-amber-400 font-medium tracking-tight">
                          {"★".repeat(f.rating)}
                          <span className="text-zinc-200">{"★".repeat(5 - f.rating)}</span>
                        </span>
                      )}
                      {f.sentiment && (
                        <span className={`badge ${SENTIMENT_BADGE[f.sentiment] ?? "badge-gray"}`}>
                          {f.sentiment}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-zinc-400">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <p className="empty-title">No feedback yet</p>
              <p className="empty-body">Send a follow-up to collect your first response.</p>
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div className="bg-white border border-zinc-200 rounded-[var(--radius-lg)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
            <p className="text-[13px] font-semibold text-zinc-800">Recent messages</p>
            <Link href="/messages" className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors">
              View all →
            </Link>
          </div>

          {recentInteractions && recentInteractions.length > 0 ? (
            <div className="divide-y divide-zinc-50">
              {recentInteractions.map((i) => {
                const rawI = i.customers;
                const customer = Array.isArray(rawI) ? (rawI[0] ?? null) : rawI;
                const name = (customer as { name?: string } | null)?.name;
                return (
                  <div key={i.id} className="flex items-center justify-between px-5 py-3">
                    <div className="min-w-0 mr-3">
                      <p className="text-[13px] font-medium text-zinc-800">{name ?? "Customer"}</p>
                      <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-[180px]">
                        {i.message_body ?? "Follow-up message"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className="text-xs text-zinc-400">{formatDate(i.sent_at)}</p>
                      <span className={`badge ${STATUS_BADGE[i.status] ?? "badge-gray"}`}>
                        {i.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-zinc-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="empty-title">No messages sent</p>
              <p className="empty-body mt-1">
                <Link href="/customers" className="text-brand-600 hover:underline">Add a customer</Link> to start.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
