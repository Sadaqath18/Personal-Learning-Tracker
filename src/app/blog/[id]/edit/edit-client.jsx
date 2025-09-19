'use client'
import { useState, useEffect } from "react"

export default function EditArticleClient({ id }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch(`/api/articles?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setTitle(data.title)
          setContent(data.content)
        }
      })
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    const res = await fetch(`/api/articles?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
    const data = await res.json()
    setMessage(res.ok ? data.message : data.error)
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/articles?id=${id}`, { method: "DELETE" })
    const data = await res.json()
    setMessage(res.ok ? data.message : data.error)
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border px-3 py-2 rounded h-32"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  )
}
