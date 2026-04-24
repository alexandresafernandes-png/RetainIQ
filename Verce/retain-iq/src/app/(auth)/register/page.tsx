import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between p-10 bg-zinc-900">
        <Link href="/" className="text-[15px] font-semibold tracking-tight text-white">
          Retain<span className="text-brand-400">IQ</span>
        </Link>
        <div className="space-y-4">
          {[
            { icon: "💬", text: "Automated WhatsApp follow-ups after every service" },
            { icon: "⭐", text: "Collect feedback with a link — no app needed" },
            { icon: "📊", text: "See sentiment, reply rates, and who needs attention" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">{icon}</span>
              <p className="text-zinc-300 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-600">14-day free trial · No credit card required</p>
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
                Create your account
              </h1>
              <p className="text-sm text-zinc-500">Start your 14-day free trial</p>
            </div>

            <RegisterForm />

            <p className="text-center text-sm text-zinc-500 mt-6">
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
