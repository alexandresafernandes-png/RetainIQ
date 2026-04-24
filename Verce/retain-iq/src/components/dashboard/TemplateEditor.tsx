"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Template } from "@/types";

const VARIABLES = ["{{customer_name}}", "{{business_name}}"];

interface Props {
  businessId: string;
  template?: Template;
  onSaved: () => void;
  onClose: () => void;
}

export default function TemplateEditor({ businessId, template, onSaved, onClose }: Props) {
  const isEdit = !!template;
  const [name, setName] = useState(template?.name ?? "");
  const [body, setBody] = useState(template?.body ?? "");
  const [isDefault, setIsDefault] = useState(template?.is_default ?? false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function insertVariable(v: string) {
    setBody((prev) => prev + v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (isEdit) {
      const { error } = await supabase
        .from("templates")
        .update({ name: name.trim(), body: body.trim(), is_default: isDefault })
        .eq("id", template.id);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { error } = await supabase
        .from("templates")
        .insert({ business_id: businessId, name: name.trim(), body: body.trim(), is_default: isDefault });
      if (error) { setError(error.message); setLoading(false); return; }
    }

    onSaved();
    onClose();
  }

  async function handleDelete() {
    if (!template || !confirm("Delete this template?")) return;
    const supabase = createClient();
    await supabase.from("templates").delete().eq("id", template.id);
    onSaved();
    onClose();
  }

  // Live preview — replace variables with sample values
  const preview = body
    .replace(/{{customer_name}}/g, "Jane")
    .replace(/{{business_name}}/g, "Your Business");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl border border-neutral-200 shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-base font-semibold text-neutral-900">
            {isEdit ? "Edit template" : "New template"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 transition-colors text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Template name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Post-service follow-up"
                className="input"
              />
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-neutral-700">Message body</label>
                <div className="flex gap-1">
                  {VARIABLES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => insertVariable(v)}
                      className="text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded hover:bg-brand-100 transition-colors font-mono"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                required
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Hi {{customer_name}}, thanks for choosing {{business_name}}! We'd love to hear how your experience was..."
                className="input resize-none font-mono text-sm"
              />
              <p className="text-xs text-neutral-400 mt-1">{body.length} characters</p>
            </div>

            {/* Preview */}
            {body && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Preview</p>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  {/* WhatsApp bubble style */}
                  <div className="bg-[#dcf8c6] rounded-xl rounded-tl-sm px-4 py-2.5 inline-block max-w-full shadow-sm">
                    <p className="text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">{preview}</p>
                    <p className="text-[10px] text-neutral-400 text-right mt-1">12:00</p>
                  </div>
                </div>
              </div>
            )}

            {/* Default toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${isDefault ? "bg-brand-500" : "bg-neutral-300"}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isDefault ? "translate-x-4" : ""}`} />
              </div>
              <span className="text-sm text-neutral-700">Set as default template</span>
            </label>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <div>
              {isEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Saving…" : isEdit ? "Save changes" : "Create template"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
