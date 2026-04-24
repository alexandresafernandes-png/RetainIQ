// Pass-through — each auth page owns its full-screen layout
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
