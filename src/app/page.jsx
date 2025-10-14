import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Personal Learning Tracker
        </h1>
        <p className="text-slate-300 text-lg md:text-xl">
          Track your learning progress, set goals, stay consistent, and
          visualize your growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold"
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
