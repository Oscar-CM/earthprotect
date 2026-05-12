export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { updateBlogPost } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) notFound()

  const action = updateBlogPost.bind(null, id)

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
          Edit Post
        </h1>
      </div>

      <form action={action} className="space-y-5">
        <Field label="Title" name="title" required defaultValue={post.title} />
        <Field label="Excerpt" name="excerpt" required multiline defaultValue={post.excerpt} />
        <Field
          label="Content"
          name="content"
          required
          multiline
          rows={12}
          defaultValue={post.content}
        />
        <Field label="Author" name="author" required defaultValue={post.author} />
        <Field label="Image URL" name="imageUrl" required defaultValue={post.imageUrl} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
              Category
            </label>
            <select
              name="category"
              defaultValue={post.category}
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
          <Field
            label="Tags (comma-separated)"
            name="tags"
            defaultValue={post.tags.join(', ')}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            name="published"
            defaultChecked={post.published}
            className="w-4 h-4"
          />
          <label htmlFor="published" className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>
            Published
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            className="text-white"
            style={{ background: 'var(--ep-primary)', border: 'none' }}
          >
            Save Changes
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
  defaultValue,
}: {
  label: string
  name: string
  required?: boolean
  multiline?: boolean
  rows?: number
  placeholder?: string
  defaultValue?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
        {label}
        {required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      {multiline ? (
        <Textarea
          name={name}
          required={required}
          rows={rows}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      ) : (
        <Input
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      )}
    </div>
  )
}
