import type { Sentiment } from "@/types";

const POSITIVE_WORDS = ["great","excellent","amazing","perfect","love","happy","fantastic","wonderful","good","best","awesome","thank"];
const NEGATIVE_WORDS = ["bad","terrible","awful","horrible","worst","hate","poor","slow","rude","disappointing","never"];

export function scoreSentiment(text: string): Sentiment {
  const lower = text.toLowerCase();
  const pos = POSITIVE_WORDS.filter((w) => lower.includes(w)).length;
  const neg = NEGATIVE_WORDS.filter((w) => lower.includes(w)).length;
  if (pos > neg) return "positive";
  if (neg > pos) return "negative";
  return "neutral";
}
