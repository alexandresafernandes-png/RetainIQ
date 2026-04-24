import SignOutButton from "./SignOutButton";

interface TopbarProps {
  businessName: string;
  userEmail: string;
}

export default function Topbar({ businessName, userEmail }: TopbarProps) {
  // Get initials for avatar
  const initials = businessName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0">
      <div />

      <div className="flex items-center gap-4">
        {/* Business badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-brand-100 flex items-center justify-center">
            <span className="text-xs font-bold text-brand-700">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-neutral-800 leading-none">{businessName}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{userEmail}</p>
          </div>
        </div>

        <div className="w-px h-5 bg-neutral-200" />

        <SignOutButton />
      </div>
    </header>
  );
}
