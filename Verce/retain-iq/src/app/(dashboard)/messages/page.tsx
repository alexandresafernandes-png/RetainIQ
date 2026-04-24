import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";

export const metadata: Metadata = { title: "Messages" };

const STATUS_COLORS: Record<string, string> = {
  replied:   "badge-green",
  delivered: "badge-blue",
  sent:      "badge-blue",
  pending:   "badge-yellow",
  failed:    "badge-red",
};

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user!.id)
    .single();

  const bid = business?.id ?? "";

  const { data: interactions } = await supabase
    .from("interactions")
    .select("*, customers(id, name, phone)")
    .eq("business_id", bid)
    .eq("direction", "outbound")
    .order("created_at", { ascending: false })
    .limit(100);

  const total     = interactions?.length ?? 0;
  const replied   = interactions?.filter((i) => i.status === "replied").length ?? 0;
  const delivered = interactions?.filter((i) => ["delivered", "replied"].includes(i.status)).length ?? 0;
  const failed    = interactions?.filter((i) => i.status === "failed").length ?? 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Messages</h1>
          <p className="text-sm text-neutral-500 mt-0.5">All outbound WhatsApp follow-ups.</p>
        </div>
        <Link href="/messages/templates" className="btn-secondary text-sm">
          Manage templates →
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total sent",  value: total },
          { label: "Delivered",   value: delivered },
          { label: "Replied",     value: replied },
          { label: "Failed",      value: failed },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-neutral-200 rounded-xl px-4 py-3">
            <p className="text-xs text-neutral-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {["Customer", "Message", "Sent", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {interactions && interactions.length > 0 ? (
              interactions.map((i) => {
                const customer = i.customers as { id: string; name: string; phone: string } | null;
                return (
                  <tr key={i.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-5 py-3.5">
                      {customer ? (
                        <Link
                          href={`/customers/${customer.id}`}
                          className="font-medium text-neutral-900 hover:text-brand-600 transition-colors"
                        >
                          {customer.name}
                        </Link>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                      {customer?.phone && (
                        <p className="text-xs text-neutral-400 mt-0.5">{customer.phone}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-neutral-600 max-w-xs">
                      <p className="truncate">{i.message_body ?? "—"}</p>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-400 whitespace-nowrap">
                      {formatDate(i.sent_at ?? i.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${STATUS_COLORS[i.status] ?? "badge-gray"}`}>
                        {i.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-14 text-center">
                  <p className="text-sm text-neutral-400 mb-2">No messages sent yet.</p>
                  <Link href="/customers" className="text-sm text-brand-600 hover:underline">
                    Go to Customers to trigger a follow-up
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {interactions && interactions.length > 0 && (
          <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
            <p className="text-xs text-neutral-400">{total} message{total !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>
    </div>
  );
}
