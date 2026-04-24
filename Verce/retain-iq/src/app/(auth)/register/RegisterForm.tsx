"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Instantiate once at module level — avoids re-creation issues inside async handlers
const supabase = createClient();

export default function RegisterForm() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [error, setError]               = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);

  const strength =
    password.length === 0 ? null :
    password.length < 8   ? "weak" :
    password.length < 12  ? "fair" : "strong";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { business_name: businessName } },
      });

      if (signUpError) {
        console.error("signUp error:", signUpError);
        throw new Error(signUpError.message);
      }

      if (!data.user) {
        throw new Error("Account could not be created. Please try again.");
      }

      // Step 2: Create business row — non-blocking failure is acceptable
      const { error: bizError } = await supabase
        .from("businesses")
        .insert({ owner_id: data.user.id, name: businessName.trim() });

      if (bizError) {
        // Log but don't block — user can set business name in settings
        console.warn("Business insert failed:", bizError.message);
      }

      // Step 3: Redirect
      router.push("/dashboard");
      router.refresh();

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      console.error("Registration failed:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="label">Business name</label>
        <input
          type="text"
          required
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Smith's Salon"
          className="input h-10"
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
          className="input h-10"
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
          className="input h-10"
        />
        {strength && (
          <div className="mt-2 flex items-center gap-2.5">
            <div className="flex gap-1 flex-1">
              {(["weak", "fair", "strong"] as const).map((l, i) => {
                const filled =
                  (strength === "weak"  && i === 0) ||
                  (strength === "fair"  && i <= 1)  ||
                  strength === "strong";
                const color =
                  strength === "weak"  ? "bg-red-400" :
                  strength === "fair"  ? "bg-yellow-400" :
                  "bg-green-500";
                return (
                  <div
                    key={l}
                    className={`h-1 flex-1 rounded-full transition-all ${filled ? color : "bg-zinc-200"}`}
                  />
                );
              })}
            </div>
            <span className={`text-xs font-medium ${
              strength === "weak" ? "text-red-500" :
              strength === "fair" ? "text-yellow-600" :
              "text-green-600"
            }`}>
              {strength}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2.5 rounded-lg">
          <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
