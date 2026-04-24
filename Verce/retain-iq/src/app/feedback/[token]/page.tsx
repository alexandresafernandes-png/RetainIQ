import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FeedbackForm from "./FeedbackForm";
 
export const dynamic = "force-dynamic";
 
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
 
function StateCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <Shell>
      <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
        <p className="text-4xl mb-4">{icon}</p>
        <p className="font-semibold text-neutral-900 mb-1">{title}</p>
        <p className="text-sm text-neutral-500">{body}</p>
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
        icon="✅"
        title="Already submitted"
        body="You've already sent feedback for this visit. Thank you!"
      />
    );
  }
 
  if (
    session.status === "expired" ||
    (session.expires_at && new Date(session.expires_at) < new Date())
  ) {
    return (
      <StateCard
        icon="⏰"
        title="Link expired"
        body="This feedback link is no longer active."
      />
    );
  }
 
  const business  = session.businesses as { name: string } | null;
  const customer  = session.customers  as { name: string } | null;
 
  return (
    <Shell>
      {/* Header */}
      <div className="text-center mb-6">
        <p className="font-bold text-xl tracking-tight text-neutral-900 mb-4">
          Retain<span className="text-brand-600">IQ</span>
        </p>
        <h1 className="text-lg font-semibold text-neutral-900 mb-1">
          How was your visit to {business?.name ?? "the business"}?
        </h1>
        {customer?.name && (
          <p className="text-sm text-neutral-500">
            Hi {customer.name}, this takes less than 30 seconds.
          </p>
        )}
      </div>
 
      {/* Form card */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <FeedbackForm token={token} />
      </div>
 
      <p className="text-center text-xs text-neutral-300 mt-6">
        Powered by RetainIQ
      </p>
    </Shell>
  );
}
 
