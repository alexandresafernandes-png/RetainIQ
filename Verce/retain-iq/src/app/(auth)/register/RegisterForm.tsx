"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength =
    password.length === 0 ? null
    : password.length < 8 ? "weak"
    : password.length < 12 ? "fair"
    : "strong";

  const strengthColor = strength === "weak" ? "bg-red-400" : strength === "fair" ? "bg-yellow-400" : "bg-green-500";
  const strengthText  = strength === "weak" ? "text-red-500" : strength === "fair" ? "text-yellow-600" : "text-green-600";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { business_name: businessName } },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    if (!data.user)  { setError("Something went wrong. Please try again."); setLoading(false); return; }

    await supabase.from("businesses").insert({ owner_id: data.user.id, name: businessName });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label">Business name</label>
        <input
          type="text"
          required
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Smith's Salon"
          className="input"
        />
      </div>

      <div>
        <label className="label">Email address</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input"
        />
      </div>

      <div>
        <label className="label">Password</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="input"
        />
        {strength && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {["weak", "fair", "strong"].map((l, i) => (
                <div
                  key={l}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    (strength === "weak" && i === 0) ||
                    (strength === "fair" && i <= 1) ||
                    strength === "strong"
                      ? strengthColor
                      : "bg-zinc-200"
                  }`}
                />
              ))}
            </div>
            <span className={`text-xs font-medium ${strengthText}`}>{strength}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-[var(--radius-sm)]">
          <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary btn-lg w-full mt-1">
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Creating account…
          </span>
        ) : "Create account"}
      </button>

      <p className="text-xs text-zinc-400 text-center pt-1">
        By signing up you agree to our terms and privacy policy.
      </p>
    </form>
  );
}
