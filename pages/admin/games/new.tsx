import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AuthGuard from '@/components/AuthGuard'
import { createClient } from '@/utils/supabase/component'

interface FormData {
  title: string
  description: string
  game_url: string
}

export default function CreateGame() {
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    game_url: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Make sure a file is selected
      if (!file) {
        setError('Please select an image to upload')
        setLoading(false)
        return
      }

      // Upload to the 'game-images' bucket
      const fileName = `${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('game-images')
        .upload(fileName, file)

      console.error('Supabase uploadData:', uploadData)
      console.error('Supabase uploadError:', uploadError)

      if (uploadError) {
        setError(uploadError.message)
        setLoading(false)
        return
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('game-images')
        .getPublicUrl(uploadData.path)
      const publicUrl = data.publicUrl

      // Assemble payload with generated URL
      const payload = { ...form, image_url: publicUrl }

      console.log('🎯 Payload going to API:', payload)
      // POST to your API
      const response = await fetch('/api/featured-games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to create game')
      }

      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <Layout title='Add New Game - EchoShock Admin'>
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-2xl font-bold mb-6 hover-glow'>
            Add New Featured Game
          </h1>

          {error && (
            <div className='bg-red-900/50 border border-red-700 text-text-light p-4 rounded-lg mb-6'>
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className='bg-[#1C0F0A]/80 rounded-lg p-6 backdrop-blur-sm space-y-4'
          >
            <div>
              <label htmlFor='title' className='block text-text-light mb-2'>
                Game Title
              </label>
              <Input
                id='title'
                name='title'
                type='text'
                value={form.title}
                onChange={handleChange}
                required
                className='input'
                placeholder='Enter game title'
              />
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-text-light mb-2'
              >
                Description
              </label>
              <textarea
                id='description'
                name='description'
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className='input text-foreground'
                placeholder='Enter game description'
              />
            </div>

            <div>
              <label htmlFor='game_url' className='block text-text-light mb-2'>
                Game URL
              </label>
              <Input
                id='game_url'
                name='game_url'
                type='url'
                value={form.game_url}
                onChange={handleChange}
                required
                className='input'
                placeholder='https://example.com/game'
              />
            </div>
            <div>
              <label
                htmlFor='game_image'
                className='block text-text-light mb-2'
              >
                Upload Image
              </label>
              <input
                id='game_image'
                name='game_image'
                type='file'
                accept='image/*'
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className='text-text-light'
              />
            </div>
            <div className='flex justify-end space-x-4 pt-4'>
              <Button
                type='button'
                onClick={() => router.push('/admin')}
                className='bg-transparent border border-text-light/30 hover:bg-[#FFF8F0]/10 text-text-light px-4 py-2 rounded-lg transition-colors duration-300'
              >
                Cancel
              </Button>
              <Button type='submit' disabled={loading} className='btn'>
                {loading ? 'Creating...' : 'Create Game'}
              </Button>
            </div>
          </form>
        </div>
      </Layout>
    </AuthGuard>
  )
}
