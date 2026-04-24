"use client";

import { useState } from "react";

const BUSINESS_TYPES = [
  "Hair salon / Barbershop",
  "Cleaning service",
  "Clinic / Therapist",
  "Gym / Studio",
  "Home services",
  "Other",
];

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to n8n webhook or email service
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-4">
          <span className="text-success text-xl">✓</span>
        </div>
        <p className="font-semibold text-neutral-900 mb-1">Message sent</p>
        <p className="text-sm text-neutral-500">We'll be in touch within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">First name</label>
          <input type="text" required placeholder="Jane" className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Last name</label>
          <input type="text" required placeholder="Smith" className="input" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Business name</label>
        <input type="text" required placeholder="Smith's Salon" className="input" />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Business type</label>
        <select required className="input bg-white">
          <option value="">Select one...</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
        <input type="email" required placeholder="jane@example.com" className="input" />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Message <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Tell us about your setup or what you'd like to know..."
          className="input resize-none"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
