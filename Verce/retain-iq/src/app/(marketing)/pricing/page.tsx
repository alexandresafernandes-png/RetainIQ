import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Pricing" };

const PLANS = [
  {
    name: "Starter",
    price: "£29",
    period: "/month",
    description: "For solo operators getting started with retention.",
    features: [
      "Up to 100 customers",
      "WhatsApp follow-ups",
      "Feedback collection",
      "1 message template",
      "Basic dashboard",
    ],
    cta: "Start free trial",
    href: "/register",
    highlight: false,
  },
  {
    name: "Growth",
    price: "£79",
    period: "/month",
    description: "For established businesses ready to systematise retention.",
    features: [
      "Up to 500 customers",
      "WhatsApp follow-ups",
      "Feedback + sentiment tracking",
      "5 message templates",
      "Full dashboard + analytics",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/register",
    highlight: true,
  },
  {
    name: "Pro",
    price: "£149",
    period: "/month",
    description: "For multi-location businesses with serious retention goals.",
    features: [
      "Unlimited customers",
      "WhatsApp follow-ups",
      "Advanced sentiment analytics",
      "Unlimited templates",
      "CSV import",
      "Dedicated support",
    ],
    cta: "Book a demo",
    href: "/contact",
    highlight: false,
  },
];

const COMPARISON = [
  { feature: "Customers", starter: "100", growth: "500", pro: "Unlimited" },
  { feature: "Message templates", starter: "1", growth: "5", pro: "Unlimited" },
  { feature: "WhatsApp follow-ups", starter: "✓", growth: "✓", pro: "✓" },
  { feature: "Feedback collection", starter: "✓", growth: "✓", pro: "✓" },
  { feature: "Sentiment tracking", starter: "—", growth: "✓", pro: "✓" },
  { feature: "CSV import", starter: "—", growth: "—", pro: "✓" },
  { feature: "Priority support", starter: "—", growth: "✓", pro: "✓" },
  { feature: "Dedicated support", starter: "—", growth: "—", pro: "✓" },
];

export default function PricingPage() {
  return (
    <div className="bg-white">

      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">Pricing</p>
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Simple, honest pricing</h1>
        <p className="text-lg text-neutral-500">
          No setup fees. No contracts. 14-day free trial on every plan.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 flex flex-col ${
                plan.highlight
                  ? "border-brand-400 ring-1 ring-brand-400 shadow-sm shadow-brand-100"
                  : "border-neutral-200"
              }`}
            >
              {plan.highlight && (
                <div className="mb-4">
                  <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full border border-brand-100">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-bold text-neutral-900 mb-1">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                  <span className="text-neutral-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-neutral-500">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-neutral-700">
                    <span className="text-success font-bold mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Full comparison</h2>
        <div className="border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-neutral-500 w-1/2">Feature</th>
                {PLANS.map((p) => (
                  <th key={p.name} className={`px-4 py-3 font-semibold text-center ${p.highlight ? "text-brand-700" : "text-neutral-700"}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {COMPARISON.map(({ feature, starter, growth, pro }) => (
                <tr key={feature} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3 text-neutral-700">{feature}</td>
                  <td className="px-4 py-3 text-center text-neutral-500">{starter}</td>
                  <td className={`px-4 py-3 text-center ${growth === "✓" ? "text-success font-medium" : "text-neutral-500"}`}>{growth}</td>
                  <td className={`px-4 py-3 text-center ${pro === "✓" || pro === "Unlimited" ? "text-success font-medium" : "text-neutral-500"}`}>{pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">Not sure which plan?</h2>
          <p className="text-neutral-500 mb-8">Book a quick demo and we'll help you choose the right fit.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-primary px-8 py-3 text-base">Start free trial</Link>
            <Link href="/contact" className="btn-secondary px-8 py-3 text-base">Talk to us</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
