"use client";
import { useState } from "react";
import { submitFeedback } from "./actions";

export default function FeedbackForm({ token }: { token: string }) {
  const [rating, setRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Thank you!</h2>
        <p className="text-sm text-gray-500">Your feedback has been submitted.</p>
      </div>
    );
  }

  async function handleSubmit(formData: FormData) {
    if (!rating) return;
    formData.set("rating", rating.toString());
    formData.set("token", token);
    await submitFeedback(formData);
    setSubmitted(true);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8">
      <form action={handleSubmit} className="space-y-6">
        {/* Star rating */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3 text-center">Rate your experience</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 ${rating && star <= rating ? "text-yellow-400" : "text-gray-200"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-1.5">
            Leave a comment <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="response"
            name="response_text"
            rows={4}
            placeholder="Tell us what you thought..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!rating}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Submit feedback
        </button>
      </form>
    </div>
  );
}
