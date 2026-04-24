"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Business } from "@/types";

export default function SettingsForm({ business }: { business: Business }) {
  const [name, setName]             = useState(business.name);
  const [phone, setPhone]           = useState(business.phone ?? "");
  const [whatsappId, setWhatsappId] = useState(business.whatsapp_id ?? "");
  const [delayHours, setDelayHours] = useState(String(business.delay_hours ?? 24));
  const [status, setStatus]         = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError]           = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("businesses")
      .update({
        name:        name.trim(),
        phone:       phone.trim() || null,
        whatsapp_id: whatsappId.trim() || null,
        delay_hours: parseInt(delayHours, 10) || 24,
      })
      .eq("id", business.id);

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Business details */}
      <section className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Business details</h2>
        <div className="space-y-4 max-w-sm">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Business name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Contact phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7700 900000"
              className="input"
            />
            <p className="text-xs text-neutral-400 mt-1">Your business contact number.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">WhatsApp sender ID</label>
            <input
              type="text"
              value={whatsappId}
              onChange={(e) => setWhatsappId(e.target.value)}
              placeholder="+44 7700 900000"
              className="input"
            />
            <p className="text-xs text-neutral-400 mt-1">
              The WhatsApp Business number messages are sent from. Must be registered in WhatsApp Business API.
            </p>
          </div>
        </div>
      </section>

      {/* Automation */}
      <section className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-neutral-900 mb-1">Automation</h2>
        <p className="text-xs text-neutral-400 mb-4">Controls when follow-up messages are triggered.</p>
        <div className="max-w-sm">
          <label className="block text-sm font-medium text-neutral-700 mb-1">Follow-up delay</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={168}
              value={delayHours}
              onChange={(e) => setDelayHours(e.target.value)}
              className="input w-24"
            />
            <span className="text-sm text-neutral-500">hours after service</span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Min 1h · Max 168h (7 days). Default is 24h.
          </p>
        </div>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="btn-primary px-6 py-2.5"
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
