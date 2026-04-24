import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "How It Works" };

const STEPS = [
  {
    n: "01",
    title: "Add your customers",
    body: "Import a CSV or add customers manually. You only need a name and phone number to start.",
  },
  {
    n: "02",
    title: "Pick a message template",
    body: "Choose a ready-made WhatsApp template or write your own. Use variables like {{customer_name}} and {{business_name}}.",
  },
  {
    n: "03",
    title: "Mark a service complete",
    body: "Trigger a follow-up with one click when a job is done. Set the delay — 24h, 48h, or custom.",
  },
  {
    n: "04",
    title: "WhatsApp message is sent automatically",
    body: "The customer receives a personalised message at exactly the right time. No manual work.",
  },
  {
    n: "05",
    title: "Customer submits feedback",
    body: "They tap a link in the message and rate their experience in 30 seconds. No app needed.",
  },
  {
    n: "06",
    title: "You track and act on it",
    body: "See ratings, sentiment, and reply rates in your dashboard. Follow up personally where it matters.",
  },
];

const FAQS = [
  {
    q: "Do my customers need to install anything?",
    a: "No. Everything happens over WhatsApp — they already have it.",
  },
  {
    q: "How long does setup take?",
    a: "Most businesses are up and running in under 10 minutes.",
  },
  {
    q: "Can I customise the messages?",
    a: "Yes. You can write your own templates and use variables to personalise each message.",
  },
  {
    q: "What if a customer doesn't reply?",
    a: "You'll see them marked as pending in your dashboard. You can choose to follow up manually or set an automatic reminder.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-white">

      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">The process</p>
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">How RetainIQ works</h1>
        <p className="text-lg text-neutral-500">
          Six steps. Set up once. Runs automatically after that.
        </p>
      </section>

      {/* Steps */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="space-y-3">
          {STEPS.map(({ n, title, body }) => (
            <div key={n} className="flex gap-5 border border-neutral-200 rounded-xl p-6 bg-white hover:border-brand-200 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-brand-600">{n}</span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-10">Common questions</h2>
          <div className="space-y-6">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="border-b border-neutral-200 pb-6 last:border-0 last:pb-0">
                <p className="font-semibold text-neutral-900 mb-2">{q}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to try it?</h2>
        <p className="text-neutral-500 mb-8">14-day free trial. No credit card required.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="btn-primary px-8 py-3 text-base">Start free trial</Link>
          <Link href="/contact" className="btn-secondary px-8 py-3 text-base">Book a demo</Link>
        </div>
      </section>

    </div>
  );
}
