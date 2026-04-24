import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
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
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">Welcome back</h1>
            <p className="text-sm text-neutral-500">Sign in to your account</p>
          </div>

          <div className="bg-white border border-neutral-200 rounded-xl p-7">
            <LoginForm />
          </div>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-600 font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
