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
import { createClient } from "@/utils/supabase/component"
import { getNextFridayNoon } from "@/utils/date_calc"

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
  isGlade: boolean
  thumbnail_url: string
}

export default function CreateEchoPage() {
  const [form, setForm] = useState<FormData>({
    title: "",
    excerpt: "",
    content: "",
    isGlade: false,
    thumbnail_url: ""
  })
  const [loading, setLoading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
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
      let thumbnailUrl = ""

      if (thumbnailFile) {
        const supabase = createClient()
        const filePath = `thumbnails/${Date.now()}_${thumbnailFile.name}`
        const { data, error } = await supabase.storage
          .from("echo-images")
          .upload(filePath, thumbnailFile)

        if (error || !data) {
          throw new Error("Failed to upload thumbnail image")
        }

        const { data: urlData } = supabase.storage
          .from("echo-images")
          .getPublicUrl(filePath)

        thumbnailUrl = urlData.publicUrl
      }

      const payload = {
        ...form,
        publish_date: form.isGlade
          ? getNextFridayNoon()
          : new Date().toISOString(),
        thumbnail_url: thumbnailUrl || null,
      }

      console.log("🖼️ Thumbnail URL:", thumbnailUrl)
      console.log("📦 Payload:", payload)

      const response = await fetch("/api/echoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        {/* Expanded layout with padding instead of fixed width */}
        <div className="px-6 py-12">
          <h1 className="text-3xl font-bold mb-8 hover-glow">Write New Echo</h1>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-text-light p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#1C0F0A]/80 rounded-lg p-6 backdrop-blur-sm space-y-6"
          >
            {/* Title */}
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

            {/* Excerpt */}
            <div>
              <label className="block text-text-light mb-2">Excerpt</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={2}
                className="input text-foreground"
                placeholder="Enter excerpt"
                required
              />
            </div>

            {/* Markdown Editor */}
            <div>
              <label className="block text-text-light mb-2">
                Content (Markdown)
              </label>
              <MdEditor
                value={form.content}
                style={{ height: "400px" }}
                renderHTML={(text) => mdParser.render(text)}
                onChange={handleEditorChange}
                config={{
                  view: {
                    menu: true,
                    md: true,
                    html: false,
                  },
                }}
                onImageUpload={async (file: File) => {
                  const supabase = createClient()
                  const filePath = `${Date.now()}_${file.name}`
                  const { data, error } = await supabase.storage
                    .from("echo-images")
                    .upload(filePath, file)

                  if (error || !data) {
                    console.error("Image upload error:", error)
                    throw new Error("Failed to upload image")
                  }

                  const { data: urlData } = supabase.storage
                    .from("echo-images")
                    .getPublicUrl(data.path)

                  return urlData.publicUrl
                }}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isGlade"
                checked={form.isGlade}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isGlade: e.target.checked }))
                }
                className="accent-pink-500"
              />
              <label htmlFor="isGlade" className="text-text-light">
                Glade Echo?
              </label>
            </div>

            <div>
              <label className="block text-text-light mb-2">
                Thumbnail Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="text-text-light"
              />
            </div>

            {/* Buttons */}
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

          {/* --- PREVIEW --- */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 hover-glow">Preview</h2>
            <div className="prose prose-invert max-w-none bg-[#1C0F0A]/80 p-6 rounded-lg">
              <ReactMarkdown>{form.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </Layout>
    </AuthGuard>
  )
}
