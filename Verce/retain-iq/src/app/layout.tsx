import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "RetainIQ", template: "%s | RetainIQ" },
  description: "Retention automation for local businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
