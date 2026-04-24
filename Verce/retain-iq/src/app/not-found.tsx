import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-green-600 mb-2">404</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Page not found</h1>
        <p className="text-sm text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link href="/" className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
          Go home
        </Link>
      </div>
    </div>
  );
}
