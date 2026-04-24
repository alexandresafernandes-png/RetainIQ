export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <a href="/" className="text-xl font-semibold text-gray-900">
            Retain<span className="text-green-600">IQ</span>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
