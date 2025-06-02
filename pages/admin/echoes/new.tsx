// pages/admin/echoes/new.tsx
import { useState } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import Layout from "@/components/Layout"
import AuthGuard from "@/components/AuthGuard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import "react-markdown-editor-lite/lib/index.css"
import MarkdownIt from "markdown-it"

const mdParser = new MarkdownIt()

// Dynamically import editor and markdown renderer to avoid SSR issues
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
})
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false })

interface FormData {
  title: string
  excerpt: string
  content: string
}

export default function CreateEchoPage() {
  const [form, setForm] = useState<FormData>({
    title: "",
    excerpt: "",
    content: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Editor onChange provides both HTML and raw text
  const handleEditorChange = ({ text }: { html: string; text: string }) => {
    setForm((prev) => ({ ...prev, content: text }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/echoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create echo")
      }
      router.push("/admin/echoes")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <Layout title="Write New Echo - EchoShock Admin">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 hover-glow">Write New Echo</h1>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-text-light p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="bg-[#1C0F0A]/80 rounded-lg p-6 backdrop-blur-sm space-y-4"
          >
            <div>
              <label className="block text-text-light mb-2">Title</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter echo title"
              />
            </div>

            <div>
              <label className="block text-text-light mb-2">Excerpt</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                className="input"
                placeholder="Enter excerpt"
                required
              />
            </div>

            <div>
              <label className="block text-text-light mb-2">
                Content (Markdown)
              </label>
              <MdEditor
                value={form.content}
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
              />
            </div>

            <div>
              <p className="block text-text-light mb-2">Preview</p>
              <div className="prose max-w-none bg-white p-4 rounded">
                <ReactMarkdown children={form.content} />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                onClick={() => router.push("/admin/echoes")}
                className="bg-transparent border border-text-light/30 hover:bg-[#FFF8F0]/10 text-text-light px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="btn">
                {loading ? "Publishing…" : "Publish Echo"}
              </Button>
            </div>
          </form>
        </div>
      </Layout>
    </AuthGuard>
  )
}
