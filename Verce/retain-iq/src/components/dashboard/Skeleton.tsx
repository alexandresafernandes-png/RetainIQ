// Lightweight CSS-only skeleton primitives — no dependencies

export function SkeletonLine({ w = "100%", h = "14px", className = "" }: {
  w?: string; h?: string; className?: string;
}) {
  return (
    <div
      className={`rounded animate-pulse bg-zinc-100 ${className}`}
      style={{ width: w, height: h }}
    />
  );
}

export function SkeletonCard({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-zinc-200 rounded-[var(--radius-lg)] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto w-full animate-pulse">
      {/* Page header */}
      <div className="mb-6">
        <div className="h-5 w-32 rounded bg-zinc-200 mb-2" />
        <div className="h-3.5 w-48 rounded bg-zinc-100" />
      </div>
      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-[var(--radius-lg)] p-5">
            <div className="h-3 w-20 rounded bg-zinc-100 mb-4" />
            <div className="h-7 w-16 rounded bg-zinc-200 mb-2" />
            <div className="h-3 w-24 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
      {/* Content area */}
      <div className="grid lg:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-[var(--radius-lg)] overflow-hidden">
            <div className="px-5 py-3.5 border-b border-zinc-100 flex justify-between">
              <div className="h-4 w-28 rounded bg-zinc-200" />
              <div className="h-4 w-14 rounded bg-zinc-100" />
            </div>
            <div className="divide-y divide-zinc-50">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="h-3.5 w-32 rounded bg-zinc-200 mb-1.5" />
                    <div className="h-3 w-20 rounded bg-zinc-100" />
                  </div>
                  <div className="h-5 w-16 rounded-full bg-zinc-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto w-full animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-5 w-28 rounded bg-zinc-200 mb-2" />
          <div className="h-3.5 w-44 rounded bg-zinc-100" />
        </div>
        <div className="h-8 w-28 rounded-lg bg-zinc-200" />
      </div>
      <div className="bg-white border border-zinc-200 rounded-[var(--radius-lg)] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {[...Array(cols)].map((_, i) => (
            <div key={i} className="h-3 rounded bg-zinc-200" style={{ width: i === 0 ? "60%" : "80%" }} />
          ))}
        </div>
        {/* Rows */}
        {[...Array(rows)].map((_, r) => (
          <div key={r} className="px-4 py-3.5 border-b border-zinc-50 last:border-0 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {[...Array(cols)].map((_, c) => (
              <div key={c} className="h-3.5 rounded bg-zinc-100" style={{ width: c === 0 ? "70%" : c === cols - 1 ? "50%" : "85%" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto w-full animate-pulse">
      <div className="mb-6">
        <div className="h-5 w-24 rounded bg-zinc-200 mb-2" />
        <div className="h-3.5 w-64 rounded bg-zinc-100" />
      </div>
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border border-zinc-200 rounded-[var(--radius-lg)] p-6">
            <div className="h-4 w-32 rounded bg-zinc-200 mb-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <div key={j}>
                  <div className="h-3 w-24 rounded bg-zinc-100 mb-2" />
                  <div className="h-10 rounded-lg bg-zinc-100 w-full max-w-sm" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
