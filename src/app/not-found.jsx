export default function NotFound() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-16 text-center text-red-600">
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-600 mb-4">
        The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="inline-block px-4 py-2 rounded bg-blue-600 hover:bg-blue-800 text-white"
      >
        Go home
      </a>
    </div>
  );
}
