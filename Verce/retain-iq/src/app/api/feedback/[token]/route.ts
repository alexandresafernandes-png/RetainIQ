import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { scoreSentiment } from "@/lib/utils/sentiment";
import { triggerFeedbackReceived } from "@/lib/n8n/webhooks";

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  // Parse body
  let rating: number;
  let response_text: string | null;

  try {
    const body = await request.json();
    rating = Number(body.rating);
    response_text = body.response_text ?? null;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Fetch session
  const { data: session } = await supabase
    .from("feedback_sessions")
    .select("id, status, expires_at, business_id, customer_id, customers(name)")
    .eq("token", params.token)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  if (session.status !== "pending") {
    return NextResponse.json({ error: "Feedback already submitted" }, { status: 409 });
  }

  if (session.expires_at && new Date(session.expires_at) < new Date()) {
    await supabase
      .from("feedback_sessions")
      .update({ status: "expired" })
      .eq("id", session.id);
    return NextResponse.json({ error: "Link has expired" }, { status: 410 });
  }

  // Score sentiment
  const sentiment = scoreSentiment(response_text ?? "", rating);

  // Save to DB
  const { error: updateError } = await supabase
    .from("feedback_sessions")
    .update({
      rating,
      response_text,
      sentiment,
      status:       "completed",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", session.id);

  if (updateError) {
    console.error("feedback update error:", updateError);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }

  // Notify n8n (fire and forget — don't block response)
  const customer = session.customers as { name: string } | null;
  triggerFeedbackReceived({
    business_id:   session.business_id,
    customer_id:   session.customer_id,
    customer_name: customer?.name ?? "Customer",
    rating,
    sentiment,
  }).catch((err) => console.error("n8n notify failed:", err));

  return NextResponse.json({ ok: true });
}
