import type { Metadata } from "next";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata: Metadata = { title: "Contact" };

const REASONS = [
  { icon: "→", title: "Book a demo", body: "See RetainIQ in action. We'll walk you through setup for your specific business type." },
  { icon: "→", title: "Ask a question", body: "Not sure if it's right for you? We'll give you a straight answer." },
  { icon: "→", title: "Get help with setup", body: "Already signed up and need a hand? We'll get you running in minutes." },
];

export default function ContactPage() {
  return (
    <div className="bg-white">

      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-3">Get in touch</p>
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">We'd love to hear from you</h1>
        <p className="text-lg text-neutral-500 max-w-xl">
          Book a demo, ask a question, or just find out if RetainIQ is right for your business.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-12 items-start">

        <div>
          <div className="space-y-6 mb-10">
            {REASONS.map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0 text-brand-600 font-bold text-sm">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 mb-1">{title}</p>
                  <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50">
            <p className="text-sm font-semibold text-neutral-900 mb-1">Response time</p>
            <p className="text-sm text-neutral-500">We reply to all messages within 24 hours on business days.</p>
          </div>
        </div>

        <div className="border border-neutral-200 rounded-xl p-7">
          <h2 className="text-lg font-bold text-neutral-900 mb-6">Send us a message</h2>
          <ContactForm />
        </div>

      </section>

    </div>
  );
}
