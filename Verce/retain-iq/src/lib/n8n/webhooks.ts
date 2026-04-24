const N8N_WEBHOOK_URL    = process.env.N8N_WEBHOOK_URL!;
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET!;

async function triggerWebhook(event: string, payload: Record<string, unknown>) {
  if (!N8N_WEBHOOK_URL) {
    console.warn("N8N_WEBHOOK_URL not set — skipping webhook");
    return;
  }

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type":     "application/json",
      "x-webhook-secret": N8N_WEBHOOK_SECRET,
    },
    body: JSON.stringify({ event, ...payload }),
  });

  if (!res.ok) {
    console.error(`n8n webhook failed: ${res.status}`);
  }
}

export async function triggerFollowUp(payload: {
  business_id:    string;
  business_name:  string;  // used in template rendering inside n8n
  customer_id:    string;
  customer_name:  string;
  customer_phone: string;
  template_body:  string;
  template_id?:   string;
  delay_hours:    number;
}) {
  return triggerWebhook("follow_up.trigger", payload);
}

export async function triggerFeedbackReceived(payload: {
  business_id:   string;
  customer_id:   string;
  customer_name: string;
  rating:        number;
  sentiment:     string;
}) {
  return triggerWebhook("feedback.received", payload);
}
