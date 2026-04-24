"use client";

import { useState } from "react";

export default function FeedbackForm({ token }: { token: string }) {
  const [rating, setRating]   = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) return;
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/feedback/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, response_text: text.trim() || null }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2f9e44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="font-semibold text-neutral-900 mb-1">Thank you!</p>
        <p className="text-sm text-neutral-500">Your feedback helps us improve.</p>
      </div>
    );
  }

  const display = hovered ?? rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star rating */}
      <div>
        <p className="text-sm font-medium text-neutral-700 mb-3 text-center">How would you rate your experience?</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(null)}
              className="transition-transform hover:scale-110 focus:outline-none"
              aria-label={`Rate ${n} out of 5`}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill={display !== null && n <= display ? "#fbbf24" : "none"}
                stroke={display !== null && n <= display ? "#fbbf24" : "#d1d5db"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>
        {rating && (
          <p className="text-center text-sm text-neutral-400 mt-2">
            {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
          </p>
        )}
      </div>

      {/* Text response */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Tell us more{" "}
          <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What went well? What could be improved?"
          className="input resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!rating || loading}
        className="btn-primary w-full py-3 disabled:opacity-40"
      >
        {loading ? "Submitting…" : "Submit feedback"}
      </button>
    </form>
  );
}
