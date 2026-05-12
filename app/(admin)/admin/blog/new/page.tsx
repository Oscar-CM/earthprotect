import { createBlogPost } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewBlogPostPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/blog"
          className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
          style={{ color: 'var(--ep-muted)' }}
        >
          <ArrowLeft size={15} /> Back
        </Link>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
        >
          New Blog Post
        </h1>
      </div>

      <form action={createBlogPost} className="space-y-5">
        <Field label="Title" name="title" required placeholder="e.g. Mountain Gorilla Census Shows Record Numbers" />
        <Field label="Excerpt" name="excerpt" required multiline placeholder="A short summary shown on the blog listing page (1–2 sentences)." />
        <Field
          label="Content"
          name="content"
          required
          multiline
          rows={12}
          placeholder="Write your full article here. Use blank lines to separate paragraphs."
        />
        <Field label="Author" name="author" required placeholder="Dr. Amara Osei" />
        <Field label="Image URL" name="imageUrl" required placeholder="https://images.unsplash.com/..." />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
              Category
            </label>
            <select
              name="category"
              className="w-full rounded-md px-3 py-2 text-sm border"
              style={{
                background: 'var(--ep-bg)',
                borderColor: 'var(--ep-border)',
                color: 'var(--ep-text)',
              }}
            >
              <option value="news">News</option>
              <option value="story">Story</option>
              <option value="research">Research</option>
              <option value="update">Update</option>
            </select>
          </div>
          <Field label="Tags (comma-separated)" name="tags" placeholder="gorilla, Congo, census" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="published" name="published" className="w-4 h-4" />
          <label htmlFor="published" className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>
            Publish immediately
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            className="text-white"
            style={{ background: 'var(--ep-primary)', border: 'none' }}
          >
            Create Post
          </Button>
          <Link href="/admin/blog">
            <Button type="button" variant="outline" style={{ borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  required,
  multiline,
  rows = 4,
  placeholder,
}: {
  label: string
  name: string
  required?: boolean
  multiline?: boolean
  rows?: number
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
        {label}
        {required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      {multiline ? (
        <Textarea name={name} required={required} rows={rows} placeholder={placeholder} />
      ) : (
        <Input name={name} required={required} placeholder={placeholder} />
      )}
    </div>
  )
}
