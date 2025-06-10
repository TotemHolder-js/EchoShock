import { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET - Fetch all echoes
  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("echoes")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  // DELETE - Remove an echo by ID
  if (req.method === "DELETE") {
    const { id } = req.body

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "`id` must be a string (UUID)." })
    }

    const { error } = await supabaseAdmin.from("echoes").delete().eq("id", id)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ message: "Deleted successfully" })
  }
  // POST - Create a new echo
  if (req.method === "POST") {
    const { title, excerpt, content, publish_date, thumbnail_url } = req.body

    if (!title || !excerpt || !content) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide title, excerpt, and content.",
      })
    }

    const { data, error } = await supabaseAdmin
      .from("echoes")
      .insert({
        title,
        excerpt,
        content,
        publish_date,
        thumbnail_url,
      })
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(201).json(data[0])
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST", "DELETE"])
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}
