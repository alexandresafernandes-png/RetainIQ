import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";

export const metadata: Metadata = { title: "Overview — RetainIQ" };

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

function Stat({
  label, value, sub, trend, accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
      <p className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${accent ? "text-zinc-500" : "text-zinc-400"}`}>
        {label}
      </p>
      <p className={`text-[32px] font-semibold leading-none tracking-tight mb-1.5 ${accent ? "text-white" : "text-zinc-900"}`}>
        {value}
      </p>
      <div className="flex items-center gap-2">
        {sub && <p className={`text-[12px] ${accent ? "text-zinc-500" : "text-zinc-400"}`}>{sub}</p>}
        {trend && <span className="text-[11px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{trend}</span>}
      </div>
    </div>
  );
}

function SectionHeader({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
      <p className="text-[13px] font-semibold text-zinc-900">{title}</p>
      <Link href={href} className="text-[12px] text-zinc-400 hover:text-zinc-700 font-medium transition-colors flex items-center gap-1">
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </Link>
    </div>
  );
}

function EmptyRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
      <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-3 text-zinc-300">
        {icon}
      </div>
      <p className="text-[13px] text-zinc-400">{text}</p>
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
      .eq("business_id", bid).eq("status", "completed")
      .order("submitted_at", { ascending: false }).limit(6),
    supabase.from("interactions")
      .select("id, status, sent_at, message_body, customers(name)")
      .eq("business_id", bid).eq("direction", "outbound")
      .order("created_at", { ascending: false }).limit(6),
  ]);

  const replyRate = totalSent && replied
    ? Math.round(((replied ?? 0) / (totalSent ?? 1)) * 100)
    : 0;

  const isEmpty = (totalCustomers ?? 0) === 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[17px] font-semibold text-zinc-900 tracking-tight">Overview</h1>
          <p className="text-[13px] text-zinc-400 mt-0.5">{business?.name ?? "Your business"}</p>
        </div>
        {isEmpty && (
          <Link href="/customers" className="btn-primary text-[13px]">
            + Add first customer
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Stat label="Customers" value={totalCustomers ?? 0} sub="Total in system" />
        <Stat label="Sent" value={totalSent ?? 0} sub="Follow-ups sent" />
        <Stat
          label="Reply rate"
          value={`${replyRate}%`}
          sub={`${replied ?? 0} of ${totalSent ?? 0} replied`}
          accent
        />
        <Stat label="Feedback" value={feedbackCount ?? 0} sub="Responses received" />
      </div>

      {/* Empty state */}
      {isEmpty ? (
        <div className="bg-white border border-zinc-200 border-dashed rounded-xl p-14 text-center">
          <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p className="text-[14px] font-semibold text-zinc-700 mb-1">Add your first customer</p>
          <p className="text-[13px] text-zinc-400 mb-5 max-w-xs mx-auto">
            Add customers and trigger WhatsApp follow-ups to start collecting feedback.
          </p>
          <Link href="/customers" className="btn-primary">
            Add customer
          </Link>
        </div>
      ) : (
        /* Activity grid */
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Recent feedback */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <SectionHeader title="Recent feedback" href="/feedback" label="All feedback" />

            {recentFeedback && recentFeedback.length > 0 ? (
              <div className="divide-y divide-zinc-50">
                {recentFeedback.map((f) => {
                  const raw = f.customers;
                  const customer = Array.isArray(raw) ? (raw[0] ?? null) : raw;
                  const name = (customer as { name?: string } | null)?.name;
                  return (
                    <div key={f.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50/60 transition-colors">
                      <div className="min-w-0 mr-3">
                        <p className="text-[13px] font-medium text-zinc-900 truncate">{name ?? "Customer"}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{formatDate(f.submitted_at)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {f.rating && (
                          <span className="text-[12px] font-medium text-amber-500 tracking-tight">
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
              <EmptyRow
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                text="No feedback collected yet"
              />
            )}
          </div>

          {/* Recent messages */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            <SectionHeader title="Recent messages" href="/messages" label="All messages" />

            {recentInteractions && recentInteractions.length > 0 ? (
              <div className="divide-y divide-zinc-50">
                {recentInteractions.map((i) => {
                  const rawI = i.customers;
                  const customer = Array.isArray(rawI) ? (rawI[0] ?? null) : rawI;
                  const name = (customer as { name?: string } | null)?.name;
                  return (
                    <div key={i.id} className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50/60 transition-colors">
                      <div className="min-w-0 mr-3">
                        <p className="text-[13px] font-medium text-zinc-900 truncate">{name ?? "Customer"}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5 truncate max-w-[160px]">
                          {i.message_body ?? "Follow-up message"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <p className="text-[11px] text-zinc-400">{formatDate(i.sent_at)}</p>
                        <span className={`badge ${STATUS_BADGE[i.status] ?? "badge-gray"}`}>
                          {i.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyRow
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
                text="No messages sent yet"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
