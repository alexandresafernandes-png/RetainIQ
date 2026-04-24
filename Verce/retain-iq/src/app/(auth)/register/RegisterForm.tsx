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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    // 1. Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { business_name: businessName } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Create business row
    const { error: bizError } = await supabase
      .from("businesses")
      .insert({ owner_id: data.user.id, name: businessName });

    if (bizError) {
      setError("Account created but business setup failed. Please contact support.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const passwordStrength =
    password.length === 0
      ? null
      : password.length < 8
      ? "weak"
      : password.length < 12
      ? "fair"
      : "strong";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Business name
        </label>
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
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Email
        </label>
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
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          className="input"
        />
        {passwordStrength && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {["weak", "fair", "strong"].map((level, i) => {
                const active =
                  (passwordStrength === "weak" && i === 0) ||
                  (passwordStrength === "fair" && i <= 1) ||
                  passwordStrength === "strong";
                const color =
                  passwordStrength === "weak"
                    ? "bg-red-400"
                    : passwordStrength === "fair"
                    ? "bg-yellow-400"
                    : "bg-green-500";
                return (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      active ? color : "bg-neutral-200"
                    }`}
                  />
                );
              })}
            </div>
            <span
              className={`text-xs font-medium ${
                passwordStrength === "weak"
                  ? "text-red-500"
                  : passwordStrength === "fair"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {passwordStrength}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-2.5 mt-1"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="text-xs text-neutral-400 text-center leading-relaxed">
        By signing up you agree to our terms of service and privacy policy.
      </p>
    </form>
  );
}
