"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddCustomerModal from "./AddCustomerModal";
import { formatDate } from "@/lib/utils/format";
import type { Customer } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  replied:   "badge-green",
  delivered: "badge-blue",
  sent:      "badge-blue",
  pending:   "badge-yellow",
  failed:    "badge-red",
};

interface CustomerRow extends Customer {
  latest_status?: string | null;
}

interface Props {
  businessId: string;
  customers: CustomerRow[];
}

export default function CustomersTable({ businessId, customers }: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-sm"
          />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary ml-auto">
          + Add customer
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {["Name", "Phone", "Email", "Added", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-neutral-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/customers/${c.id}`)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-brand-600">
                          {c.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-neutral-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">{c.phone}</td>
                  <td className="px-5 py-3.5 text-neutral-400">{c.email ?? "—"}</td>
                  <td className="px-5 py-3.5 text-neutral-400">{formatDate(c.created_at)}</td>
                  <td className="px-5 py-3.5">
                    {c.latest_status ? (
                      <span className={`badge ${STATUS_COLORS[c.latest_status] ?? "badge-gray"}`}>
                        {c.latest_status}
                      </span>
                    ) : (
                      <span className="badge-gray badge">No contact</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-14 text-center">
                  {search ? (
                    <p className="text-sm text-neutral-400">No customers match &ldquo;{search}&rdquo;</p>
                  ) : (
                    <div>
                      <p className="text-sm text-neutral-400 mb-3">No customers yet.</p>
                      <button onClick={() => setShowModal(true)} className="btn-primary text-sm">
                        Add your first customer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
            <p className="text-xs text-neutral-400">{filtered.length} customer{filtered.length !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>

      {showModal && (
        <AddCustomerModal
          onAdded={() => router.refresh()}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
