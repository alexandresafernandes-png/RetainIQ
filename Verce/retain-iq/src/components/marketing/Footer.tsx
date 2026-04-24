import Link from "next/link";

const LINKS = {
  Product: [
    { label: "How it works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "Contact", href: "/contact" },
    { label: "Book a demo", href: "/contact" },
  ],
  Account: [
    { label: "Log in", href: "/login" },
    { label: "Sign up", href: "/register" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <p className="font-bold text-xl tracking-tight text-neutral-900 mb-3">
            Retain<span className="text-brand-600">IQ</span>
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
            Automated WhatsApp follow-ups and feedback collection for local service businesses.
          </p>
        </div>

        {Object.entries(LINKS).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">{group}</p>
            <ul className="space-y-3">
              {items.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">© {new Date().getFullYear()} RetainIQ. All rights reserved.</p>
          <p className="text-xs text-neutral-400">Built for local businesses.</p>
        </div>
      </div>
    </footer>
  );
}
