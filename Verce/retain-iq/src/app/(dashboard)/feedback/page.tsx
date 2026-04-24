import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Feedback" };

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "badge-green",
  neutral:  "badge-yellow",
  negative: "badge-red",
};

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-neutral-300">—</span>;
  return (
    <span className="text-sm tracking-tight">
      <span className="text-yellow-400">{"★".repeat(rating)}</span>
      <span className="text-neutral-200">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default async function FeedbackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const bid = business?.id ?? "";

  const { data: sessions } = await supabase
    .from("feedback_sessions")
    .select("*, customers(id, name, phone)")
    .eq("business_id", bid)
    .eq("status", "completed")
    .order("submitted_at", { ascending: false });

  const total    = sessions?.length ?? 0;
  const positive = sessions?.filter((s) => s.sentiment === "positive").length ?? 0;
  const neutral  = sessions?.filter((s) => s.sentiment === "neutral").length ?? 0;
  const negative = sessions?.filter((s) => s.sentiment === "negative").length ?? 0;
  const avgRating =
    total > 0
      ? (sessions!.reduce((sum, s) => sum + (s.rating ?? 0), 0) / total).toFixed(1)
      : "—";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-900">Feedback</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Customer responses to your follow-up messages.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total responses", value: total },
          { label: "Avg. rating",     value: avgRating ? `${avgRating} / 5` : "—" },
          { label: "Positive",        value: positive },
          { label: "Negative",        value: negative },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-neutral-200 rounded-xl px-4 py-3">
            <p className="text-xs text-neutral-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Sentiment bar */}
      {total > 0 && (
        <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
            <span>Sentiment breakdown</span>
            <span>{total} responses</span>
          </div>
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
            {positive > 0 && (
              <div
                className="bg-green-400 rounded-full"
                style={{ width: `${(positive / total) * 100}%` }}
              />
            )}
            {neutral > 0 && (
              <div
                className="bg-yellow-300 rounded-full"
                style={{ width: `${(neutral / total) * 100}%` }}
              />
            )}
            {negative > 0 && (
              <div
                className="bg-red-400 rounded-full"
                style={{ width: `${(negative / total) * 100}%` }}
              />
            )}
          </div>
          <div className="flex gap-5 mt-2 text-xs text-neutral-400">
            <span><span className="text-green-500 font-medium">{positive}</span> positive</span>
            <span><span className="text-yellow-500 font-medium">{neutral}</span> neutral</span>
            <span><span className="text-red-500 font-medium">{negative}</span> negative</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {["Customer", "Rating", "Sentiment", "Response", "Date"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {sessions && sessions.length > 0 ? (
              sessions.map((s) => {
                const customer = s.customers as { id: string; name: string; phone: string } | null;
                return (
                  <tr key={s.id} className="hover:bg-neutral-50 transition-colors align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium text-neutral-900">{customer?.name ?? "—"}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{customer?.phone ?? ""}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Stars rating={s.rating} />
                    </td>
                    <td className="px-5 py-4">
                      {s.sentiment ? (
                        <span className={`badge ${SENTIMENT_COLORS[s.sentiment] ?? "badge-gray"}`}>
                          {s.sentiment}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      {s.response_text ? (
                        <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
                          &ldquo;{s.response_text}&rdquo;
                        </p>
                      ) : (
                        <span className="text-neutral-300 text-sm">No text response</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-neutral-400 whitespace-nowrap">
                      {formatDate(s.submitted_at)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center">
                  <p className="text-sm text-neutral-400">No feedback collected yet.</p>
                  <p className="text-xs text-neutral-300 mt-1">Send follow-up messages to start collecting responses.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {sessions && sessions.length > 0 && (
          <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
            <p className="text-xs text-neutral-400">{total} response{total !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>
    </div>
  );
}
