import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-10 bg-zinc-900">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-white">
          Retain<span className="text-brand-400">IQ</span>
        </Link>
        <div>
          <blockquote className="text-zinc-300 text-[15px] leading-relaxed mb-6">
            "RetainIQ helped us recover 30% more returning customers within the first month."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300">
              S
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">Sarah Mitchell</p>
              <p className="text-xs text-zinc-500">Owner, Mitchell's Salon</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} RetainIQ</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-zinc-900">
            Retain<span className="text-brand-600">IQ</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[360px]">
            <div className="mb-8">
              <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight mb-1">
                Welcome back
              </h1>
              <p className="text-sm text-zinc-500">Sign in to your RetainIQ account</p>
            </div>

            <LoginForm />

            <p className="text-center text-sm text-zinc-500 mt-6">
              No account?{" "}
              <Link href="/register" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
