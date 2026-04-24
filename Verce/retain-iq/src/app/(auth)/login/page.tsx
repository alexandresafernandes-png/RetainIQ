import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in — RetainIQ" };

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex" style={{ background: "var(--bg)" }}>

      {/* ── Dark left panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 bg-zinc-900">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-white">
          Retain<span className="text-brand-400">IQ</span>
        </Link>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
            <span className="text-xs text-zinc-400 font-medium">Trusted by 200+ local businesses</span>
          </div>
          <blockquote className="text-zinc-200 text-[17px] font-light leading-relaxed">
            "RetainIQ helped us recover 30% more returning customers within the first month — on autopilot."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-zinc-300">
              SM
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">Sarah Mitchell</p>
              <p className="text-xs text-zinc-500">Owner, Mitchell&apos;s Salon</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} RetainIQ. All rights reserved.</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Mobile header */}
        <div className="lg:hidden flex items-center px-6 py-5 border-b border-zinc-100">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-zinc-900">
            Retain<span className="text-brand-600">IQ</span>
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[440px]">

            <div className="mb-9">
              <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight leading-tight mb-2">
                Welcome back
              </h1>
              <p className="text-[15px] text-zinc-500">
                Sign in to your RetainIQ account
              </p>
            </div>

            <LoginForm />

            <p className="text-sm text-zinc-500 mt-7 text-center">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
                Start free trial
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
