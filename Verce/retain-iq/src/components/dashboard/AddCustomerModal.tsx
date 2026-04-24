"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  businessId: string;
  onAdded: () => void;
  onClose: () => void;
}

export default function AddCustomerModal({ businessId, onAdded, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("customers").insert({
      business_id: businessId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
    });

    if (error) {
      setError(error.code === "23505" ? "A customer with this phone number already exists." : error.message);
      setLoading(false);
      return;
    }

    onAdded();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-neutral-200 shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-neutral-900">Add customer</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Phone number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44 7700 900000"
              className="input"
            />
            <p className="text-xs text-neutral-400 mt-1">Include country code. Used to send WhatsApp messages.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="input"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5">
              {loading ? "Adding…" : "Add customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
