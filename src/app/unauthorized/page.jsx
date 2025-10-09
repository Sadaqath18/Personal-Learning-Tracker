export default function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-12 text-center">
      <h1 className="text-xl font-semibold mb-2">Unauthorized</h1>
      <p className="text-gray-600">
        You do not have permission to access this page.
      </p>
    </div>
  );
}