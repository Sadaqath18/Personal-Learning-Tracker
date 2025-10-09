"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-4">
            {error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
