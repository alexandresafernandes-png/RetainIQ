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
    .toUpperCase();

  return (
    <header
      className="bg-white border-b border-zinc-100 flex items-center justify-end px-6 shrink-0"
      style={{ height: "var(--header-h)" }}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white leading-none">{initials}</span>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[13px] font-medium text-zinc-800 leading-none">{businessName}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-none">{userEmail}</p>
          </div>
        </div>

        <div className="w-px h-4 bg-zinc-200" />

        <SignOutButton />
      </div>
    </header>
  );
}
