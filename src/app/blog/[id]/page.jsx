export default async function BlogDetail({ params }) {
  const { id } = params // no need for await here
  let article = null

  try {
    const res = await fetch(`http://localhost:3000/api/articles?id=${id}`, {
      cache: "no-store",
    })
    if (res.ok) {
      article = await res.json()
    }
  } catch (error) {
    console.error("Error fetching article:", error)
  }

  if (!article) {
    return <div className="p-6">Article not found.</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
      <p>{article.content}</p>
      <a
        href={`/blog/${article.id}/edit`}
        className="text-yellow-600 underline hover:text-yellow-800"
      >
        Edit Article
      </a>
    </div>
  )
}
