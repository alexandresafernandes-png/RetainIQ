"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const supabase = createClient();

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("signIn error:", signInError.message);
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        console.error("No session returned — email may not be confirmed.");
        setError("Login failed: no session returned. Check your email is confirmed.");
        setLoading(false);
        return;
      }

      // Success — log for debugging
      console.log("Login success. User:", data.user?.email);
      console.log("Session expires:", data.session.expires_at);

      // Keep loading true — user is being redirected, no need to reset
      try {
        router.replace("/dashboard");
        router.refresh();
      } catch (navErr) {
        console.warn("router.replace failed, falling back to window.location:", navErr);
      }

      // Fallback — fires after a short delay if router.replace didn't navigate
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      console.error("Login exception:", message);
      setError(message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="label">Email address</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input h-10"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="label mb-0">Password</label>
          <Link href="/contact" className="text-xs text-brand-600 hover:text-brand-700 transition-colors">
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="input h-10"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2.5 rounded-lg">
          <svg className="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full h-10 text-[14px] mt-1"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Signing in…
          </span>
        ) : "Sign in"}
      </button>

    </form>
  );
}
