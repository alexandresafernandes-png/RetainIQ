"use server";
import { createClient } from "@/lib/supabase/server";
import { scoreSentiment } from "@/lib/utils/sentiment";

export async function submitFeedback(formData: FormData) {
  const token = formData.get("token") as string;
  const rating = parseInt(formData.get("rating") as string, 10);
  const response_text = formData.get("response_text") as string;

  const supabase = await createClient();

  const { data: session } = await supabase
    .from("feedback_sessions")
    .select("id, status")
    .eq("token", token)
    .single();

  if (!session || session.status !== "pending") return;

  const sentiment = response_text ? scoreSentiment(response_text) : "neutral";

  await supabase
    .from("feedback_sessions")
    .update({
      rating,
      response_text: response_text || null,
      sentiment,
      status: "completed",
      submitted_at: new Date().toISOString(),
    })
    .eq("token", token);
}
