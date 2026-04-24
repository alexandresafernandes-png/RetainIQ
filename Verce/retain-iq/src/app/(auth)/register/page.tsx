import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: "Create account — RetainIQ" };

const FEATURES = [
  { icon: "💬", text: "Automated WhatsApp follow-ups after every service" },
  { icon: "⭐", text: "Collect star ratings and written feedback effortlessly" },
  { icon: "📊", text: "Track sentiment, reply rates, and who needs attention" },
  { icon: "🔁", text: "Turn one-time customers into loyal regulars" },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex" style={{ background: "var(--bg)" }}>

      {/* ── Dark left panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 bg-zinc-900">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-white">
          Retain<span className="text-brand-400">IQ</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2 leading-snug">
              Everything you need to retain more customers
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Set up in 10 minutes. Runs automatically after that.
            </p>
          </div>
          <ul className="space-y-4">
            {FEATURES.map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="text-base leading-none mt-0.5 shrink-0">{icon}</span>
                <span className="text-zinc-300 text-sm leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-zinc-600">14-day free trial · No credit card required</p>
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
                Create your account
              </h1>
              <p className="text-[15px] text-zinc-500">
                Start your 14-day free trial — no credit card needed.
              </p>
            </div>

            <RegisterForm />

            <p className="text-sm text-zinc-500 mt-7 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
                Sign in
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
