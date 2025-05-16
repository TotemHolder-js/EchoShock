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
  // GET - Fetch all featured games
  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("featured_games")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  // POST - Create a new featured game
  if (req.method === "POST") {
    // Validate request body
    const { title, description, game_url, image_url } = req.body

    if (!title || !description || !game_url || !image_url) {
      return res.status(400).json({
        error:
          "Missing required fields. Please provide title, description, game_url, and image_url.",
      })
    }

    // Insert new game
    const { data, error } = await supabaseAdmin
      .from("featured_games")
      .insert({
        title,
        description,
        game_url,
        image_url,
      })
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(201).json(data[0])
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST"])
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
}
