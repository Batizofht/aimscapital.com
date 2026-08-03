import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-navy-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl font-bold text-white mb-2">404</div>
        <div className="w-12 h-0.5 bg-navy-400 mx-auto mb-6" />
        <p className="text-navy-200 text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-navy-600 text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-navy-500 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-block border-2 border-navy-400 text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-navy-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
