import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="p-6">
        <Link href="/" className="font-bold text-xl tracking-tight text-neutral-900">
          Retain<span className="text-brand-600">IQ</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">
              Create your account
            </h1>
            <p className="text-sm text-neutral-500">
              14-day free trial · No credit card required
            </p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-7">
            <RegisterForm />
          </div>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
