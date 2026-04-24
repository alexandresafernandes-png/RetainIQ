"use client";

import { useState } from "react";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

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
      <div className="py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="font-semibold text-zinc-900 mb-1">Thank you!</p>
        <p className="text-sm text-zinc-500">Your feedback means a lot.</p>
      </div>
    );
  }

  const display = hovered ?? rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Stars */}
      <div>
        <p className="text-sm font-medium text-zinc-700 mb-4 text-center">How would you rate your experience?</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = display !== null && n <= display;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                aria-label={`Rate ${n} out of 5`}
              >
                <svg
                  width="38"
                  height="38"
                  viewBox="0 0 24 24"
                  fill={filled ? "#f59e0b" : "none"}
                  stroke={filled ? "#f59e0b" : "#d4d4d8"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-100"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </button>
            );
          })}
        </div>
        <div className="h-5 flex items-center justify-center mt-1">
          {(hovered || rating) && (
            <p className="text-xs font-medium text-zinc-500">
              {LABELS[hovered ?? rating ?? 0]}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100" />

      {/* Text */}
      <div>
        <label className="label">
          Tell us more <span className="text-zinc-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What went well? What could be better?"
          className="input resize-none text-sm"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-[var(--radius-sm)]">
          <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!rating || loading}
        className="btn-primary btn-lg w-full"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Submitting…
          </span>
        ) : "Submit feedback"}
      </button>
    </form>
  );
}
