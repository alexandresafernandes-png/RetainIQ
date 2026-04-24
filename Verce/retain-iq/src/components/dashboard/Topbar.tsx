import SignOutButton from "./SignOutButton";

interface TopbarProps {
  businessName: string;
  userEmail: string;
}

export default function Topbar({ businessName, userEmail }: TopbarProps) {
  const initials = businessName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "B";

  return (
    <header
      className="bg-white border-b border-zinc-100 flex items-center justify-between px-5 shrink-0"
      style={{ height: "var(--header-h)" }}
    >
      {/* Left — breadcrumb placeholder space */}
      <div />

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Business pill */}
        <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-zinc-200 bg-zinc-50">
          <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-white leading-none tracking-wide">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-semibold text-zinc-800 leading-none">{businessName}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5 leading-none">{userEmail}</p>
          </div>
        </div>

        <SignOutButton />
      </div>
    </header>
  );
}
