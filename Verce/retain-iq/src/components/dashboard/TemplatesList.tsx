"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateEditor from "./TemplateEditor";
import type { Template } from "@/types";

interface Props {
  businessId: string;
  templates: Template[];
}

export default function TemplatesList({ businessId, templates }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<Template | null>(null);
  const [creating, setCreating] = useState(false);

  function handleSaved() {
    router.refresh();
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-neutral-500">
          {templates.length} template{templates.length !== 1 ? "s" : ""}
        </p>
        <button onClick={() => setCreating(true)} className="btn-primary">
          + New template
        </button>
      </div>

      {/* Cards */}
      {templates.length > 0 ? (
        <div className="space-y-4">
          {templates.map((t) => {
            const preview = t.body
              .replace(/{{customer_name}}/g, "Jane")
              .replace(/{{business_name}}/g, "Your Business");

            return (
              <div key={t.id} className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900">{t.name}</p>
                    {t.is_default && <span className="badge-blue badge">Default</span>}
                  </div>
                  <button
                    onClick={() => setEditing(t)}
                    className="text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>

                {/* WhatsApp preview */}
                <div className="bg-neutral-50 rounded-lg p-3">
                  <div className="bg-[#dcf8c6] rounded-xl rounded-tl-sm px-3 py-2 inline-block max-w-full shadow-sm">
                    <p className="text-sm text-neutral-800 whitespace-pre-wrap leading-relaxed">{preview}</p>
                    <p className="text-[10px] text-neutral-400 text-right mt-0.5">preview</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <p className="text-xs text-neutral-400 font-mono">{t.body.length} chars</p>
                  {t.body.includes("{{customer_name}}") && (
                    <span className="text-xs text-neutral-400 font-mono bg-neutral-100 px-1.5 py-0.5 rounded">{"{{customer_name}}"}</span>
                  )}
                  {t.body.includes("{{business_name}}") && (
                    <span className="text-xs text-neutral-400 font-mono bg-neutral-100 px-1.5 py-0.5 rounded">{"{{business_name}}"}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 border-dashed rounded-xl py-16 text-center">
          <p className="text-sm text-neutral-400 mb-3">No templates yet.</p>
          <button onClick={() => setCreating(true)} className="btn-primary text-sm">
            Create your first template
          </button>
        </div>
      )}

      {/* Modals */}
      {creating && (
        <TemplateEditor
          businessId={businessId}
          onSaved={handleSaved}
          onClose={() => setCreating(false)}
        />
      )}
      {editing && (
        <TemplateEditor
          businessId={businessId}
          template={editing}
          onSaved={handleSaved}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
