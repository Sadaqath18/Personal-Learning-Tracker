import EditArticleClient from "./edit-client"

export default function EditArticlePage({ params }) {
  return <EditArticleClient id={params.id} />
}
