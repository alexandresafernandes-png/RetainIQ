import Link from "next/link";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

const STEPS = [
  {
    n: "01",
    title: "Mark a service complete",
    body: "One click when a job is done. RetainIQ handles everything from there.",
  },
  {
    n: "02",
    title: "WhatsApp follow-up sent automatically",
    body: "A personalised message goes out at the right time — 24h, 48h, whenever you set.",
  },
  {
    n: "03",
    title: "Feedback collected and tracked",
    body: "Customers rate their experience. You see scores, sentiment, and who needs attention.",
  },
];

const INDUSTRIES = ["Hair salons", "Cleaning services", "Dental clinics", "Beauty studios", "Gyms & studios", "Home services"];

const STATS = [
  { value: "3×", label: "More feedback collected vs manual follow-up" },
  { value: "68%", label: "Average reply rate on WhatsApp messages" },
  { value: "10 min", label: "Average setup time" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-brand-100">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
              Built for local service businesses
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-neutral-900 leading-[1.1] tracking-tight mb-6">
              Keep customers coming back —{" "}
              <span className="text-brand-600">without the manual work</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-500 leading-relaxed max-w-2xl mb-10">
              RetainIQ sends WhatsApp follow-ups after every service, collects feedback automatically, and shows you exactly who needs attention — all in one dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="btn-primary text-base px-7 py-3">
                Start free trial
              </Link>
              <Link href="/how-it-works" className="btn-secondary text-base px-7 py-3">
                See how it works
              </Link>
            </div>

            <p className="text-sm text-neutral-400 mt-4">No credit card required · 14-day free trial</p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-y border-neutral-100 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={value} className="flex flex-col">
                <span className="text-3xl font-bold text-neutral-900 mb-1">{value}</span>
                <span className="text-sm text-neutral-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Industries */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-5">Works for</p>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((name) => (
              <span key={name} className="text-sm bg-white border border-neutral-200 text-neutral-600 px-4 py-2 rounded-full">
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-xl mb-14">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">How it works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Set it up once. It runs on autopilot.
            </h2>
            <p className="text-neutral-500">
              No technical knowledge needed. Most businesses are up and running in under 10 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(({ n, title, body }) => (
              <div key={n} className="bg-white border border-neutral-200 rounded-xl p-7 relative overflow-hidden">
                <p className="text-6xl font-bold text-neutral-100 absolute -top-2 -right-1 leading-none select-none">{n}</p>
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
                    <span className="text-xs font-bold text-brand-600">{n}</span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/how-it-works" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
              See the full flow →
            </Link>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="bg-neutral-50 border-y border-neutral-200">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">Dashboard</p>
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                Everything you need to retain customers
              </h2>
              <p className="text-neutral-500 mb-8">
                One clean dashboard shows you your reply rate, customer sentiment, and who needs a follow-up — without digging through spreadsheets.
              </p>
              <ul className="space-y-4">
                {[
                  "See who replied and who hasn't",
                  "Track feedback scores and sentiment",
                  "Manage message templates",
                  "Add customers and trigger follow-ups in seconds",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-neutral-700">
                    <span className="w-5 h-5 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-brand-600 text-xs">✓</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dashboard preview card */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Customers", value: "248" },
                  { label: "Reply rate", value: "71%" },
                  { label: "Avg. rating", value: "4.3★" },
                  { label: "Positive", value: "89%" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-neutral-50 rounded-lg p-4">
                    <p className="text-xs text-neutral-400 mb-1">{label}</p>
                    <p className="text-xl font-bold text-neutral-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { name: "Sarah Mitchell", status: "replied", rating: "5★" },
                  { name: "James Cooper", status: "pending", rating: "—" },
                  { name: "Priya Patel", status: "replied", rating: "4★" },
                ].map(({ name, status, rating }) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0 text-sm">
                    <span className="font-medium text-neutral-800">{name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400">{rating}</span>
                      <span className={`badge ${status === "replied" ? "badge-green" : "badge-yellow"}`}>{status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Ready to retain more customers?
          </h2>
          <p className="text-neutral-500 mb-10 max-w-xl mx-auto">
            Join local businesses using RetainIQ to automate follow-ups and turn one-time customers into regulars.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-primary text-base px-8 py-3">
              Start your free trial
            </Link>
            <Link href="/contact" className="btn-secondary text-base px-8 py-3">
              Book a demo
            </Link>
          </div>
          <p className="text-sm text-neutral-400 mt-5">14-day free trial · No contracts · Cancel anytime</p>
        </section>

      </main>
      <Footer />
    </div>
  );
}
