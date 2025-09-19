import Link from "next/link";

export default async function BlogPage() {
  let articles = [];

  try {
    const res = await fetch("http://localhost:3000/api/articles", {
      cache: "no-store",
    });

    const data = await res.json();
    articles = Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blog Articles</h1>
      {articles.length === 0 ? (
        <p>No articles available.</p>
      ) : (
        <ul className="space-y-2">
          {articles.map((article, index) => (
            <li key={article.id ?? index}>
              <Link
                href={`/blog/${article.id}`}
                className="text-blue-600 underline hover:text-blue-800"
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <a
        href="/blog/create"
        className="inline-block mb-4 text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700"
      >
        + Create Article
      </a>
    </div>
  );
}
