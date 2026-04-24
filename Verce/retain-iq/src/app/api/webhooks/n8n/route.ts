import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // Validate shared secret
  const incomingSecret = request.headers.get("x-webhook-secret");
  if (!WEBHOOK_SECRET || incomingSecret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event } = body;
  if (!event || typeof event !== "string") {
    return NextResponse.json({ error: "Missing event field" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  switch (event) {
    // n8n reports back a delivery/reply status update on an interaction
    case "interaction.status_update": {
      const { interaction_id, status } = body as {
        interaction_id?: string;
        status?: string;
      };

      const VALID_STATUSES = ["sent", "delivered", "replied", "failed"];
      if (!interaction_id || !status || !VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }

      const updates: Record<string, string> = { status };
      if (status === "delivered") updates.delivered_at = new Date().toISOString();
      if (status === "replied")   updates.replied_at   = new Date().toISOString();

      const { error } = await supabase
        .from("interactions")
        .update(updates)
        .eq("id", interaction_id);

      if (error) {
        console.error("interaction update error:", error);
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }

      break;
    }

    // n8n confirms a follow-up message was sent and creates the interaction record
    case "interaction.created": {
      const { business_id, customer_id, template_id, message_body, status, wa_message_id } = body as {
        business_id?:   string;
        customer_id?:   string;
        template_id?:   string;
        message_body?:  string;
        status?:        string;
        wa_message_id?: string;
      };

      if (!business_id || !customer_id) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const isSent = status !== "failed";

      const { data, error } = await supabase
        .from("interactions")
        .insert({
          business_id,
          customer_id,
          template_id:   template_id   ?? null,
          message_body:  message_body  ?? null,
          wa_message_id: wa_message_id ?? null,
          direction:     "outbound",
          status:        status ?? "sent",
          sent_at:       isSent ? new Date().toISOString() : null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("interaction insert error:", error);
        return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
      }

      // Return interaction_id so n8n can use it directly in the next step
      return NextResponse.json({ ok: true, interaction_id: data.id });
    }

    // n8n creates a feedback session after sending the follow-up
    case "feedback_session.created": {
      const { business_id, customer_id, interaction_id, token, expires_hours = 72 } = body as {
        business_id?:   string;
        customer_id?:   string;
        interaction_id?: string;
        token?:         string;
        expires_hours?: number;
      };

      if (!business_id || !customer_id || !token) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + Number(expires_hours));

      const { error } = await supabase.from("feedback_sessions").insert({
        business_id,
        customer_id,
        interaction_id: interaction_id ?? null,
        token,
        status:         "pending",
        expires_at:     expiresAt.toISOString(),
      });

      if (error) {
        console.error("feedback session insert error:", error);
        return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
      }

      break;
    }

    default:
      // Log unknown events but return 200 — don't fail n8n workflows
      console.warn("Unknown n8n event received:", event);
  }

  return NextResponse.json({ ok: true });
}
