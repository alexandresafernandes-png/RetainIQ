import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FeedbackForm from "./FeedbackForm";

export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-16" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-[400px]">{children}</div>
    </main>
  );
}

function StateCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Shell>
      <div className="bg-white border border-zinc-200 rounded-[var(--radius-lg)] p-10 text-center shadow-sm">
        <div className="flex items-center justify-center mb-4">{icon}</div>
        <p className="font-semibold text-zinc-900 text-[15px] mb-1">{title}</p>
        <p className="text-sm text-zinc-500">{body}</p>
      </div>
    </Shell>
  );
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("feedback_sessions")
    .select("id, status, expires_at, businesses(name), customers(name)")
    .eq("token", token)
    .single();

  if (!session) notFound();

  if (session.status === "completed") {
    return (
      <StateCard
        icon={
          <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        }
        title="Already submitted"
        body="You've already shared feedback for this visit. Thank you!"
      />
    );
  }

  if (
    session.status === "expired" ||
    (session.expires_at && new Date(session.expires_at) < new Date())
  ) {
    return (
      <StateCard
        icon={
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
        }
        title="Link expired"
        body="This feedback link is no longer active."
      />
    );
  }

  const rawBusiness = session.businesses;
  const rawCustomer = session.customers;
  const business = (Array.isArray(rawBusiness) ? rawBusiness[0] ?? null : rawBusiness) as { name?: string } | null;
  const customer = (Array.isArray(rawCustomer) ? rawCustomer[0] ?? null : rawCustomer) as { name?: string } | null;

  return (
    <Shell>
      {/* Branding */}
      <div className="text-center mb-6">
        <p className="text-[13px] font-semibold tracking-tight text-zinc-400 mb-5">
          Retain<span className="text-brand-600">IQ</span>
        </p>
        <h1 className="text-[20px] font-semibold text-zinc-900 tracking-tight mb-1">
          How was your experience?
        </h1>
        {customer?.name ? (
          <p className="text-sm text-zinc-500">
            Hi {customer.name} — share your feedback about {business?.name ?? "your visit"}.
          </p>
        ) : (
          <p className="text-sm text-zinc-500">
            Share your feedback about {business?.name ?? "your visit"}.
          </p>
        )}
      </div>

      {/* Form */}
      <div className="bg-white border border-zinc-200 rounded-[var(--radius-lg)] p-6 shadow-sm">
        <FeedbackForm token={token} />
      </div>

      <p className="text-center text-[11px] text-zinc-300 mt-5">
        Powered by RetainIQ
      </p>
    </Shell>
  );
}
