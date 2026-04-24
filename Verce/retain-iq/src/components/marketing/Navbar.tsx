"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-neutral-900">
            Retain<span className="text-brand-600">IQ</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/how-it-works" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">How it works</Link>
          <Link href="/pricing" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Pricing</Link>
          <Link href="/contact" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Contact</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900 px-3 py-2 transition-colors">
            Log in
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            Get started free
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-1.5">
            <span className={`block h-px bg-neutral-700 transition-all ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-px bg-neutral-700 transition-all ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-neutral-700 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-6 py-5 flex flex-col gap-4">
          <Link href="/how-it-works" className="text-sm text-neutral-700" onClick={() => setOpen(false)}>How it works</Link>
          <Link href="/pricing" className="text-sm text-neutral-700" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="/contact" className="text-sm text-neutral-700" onClick={() => setOpen(false)}>Contact</Link>
          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-3">
            <Link href="/login" className="text-sm text-neutral-700" onClick={() => setOpen(false)}>Log in</Link>
            <Link href="/register" className="btn-primary text-sm text-center" onClick={() => setOpen(false)}>Get started free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
