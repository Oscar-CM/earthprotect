export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { updateBlogPost } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Megaphone } from 'lucide-react'
import Link from 'next/link'

type AdRow = { id: string; slug: string; title: string; active: boolean }

async function getAds(): Promise<AdRow[]> {
  try {
    return await prisma.ad.findMany({ orderBy: { title: 'asc' } }) as AdRow[]
  } catch { return [] }
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, ads] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    getAds(),
  ])
  if (!post) notFound()

  const action = updateBlogPost.bind(null, id)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/blog" className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--ep-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          Edit Post
        </h1>
      </div>

      {/* Embed ad reference */}
      {ads.length > 0 && (
        <div className="p-4 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Megaphone size={15} style={{ color: 'var(--ep-primary)' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--ep-text)' }}>Embed Ads in Content</p>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--ep-muted)' }}>
            Paste a shortcode on its own paragraph line inside the Content field to display an ad at that position.
          </p>
          <div className="flex flex-wrap gap-2">
            {ads.map((ad: AdRow) => (
              <div key={ad.id} className="flex items-center gap-1.5">
                <code
                  className="text-xs px-2 py-1 rounded font-mono select-all"
                  style={{ background: 'var(--ep-bg2)', color: ad.active ? 'var(--ep-primary)' : 'var(--ep-muted)' }}
                >
                  {`{{ad:${ad.slug}}}`}
                </code>
                <span className="text-xs" style={{ color: 'var(--ep-muted)' }}>{ad.title}</span>
                {!ad.active && <span className="text-[10px] px-1 rounded" style={{ background: '#fef9c3', color: '#854d0e' }}>inactive</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <form action={action} className="space-y-5">
        <Field label="Title" name="title" required defaultValue={post.title} />
        <Field label="Excerpt" name="excerpt" required multiline defaultValue={post.excerpt} />
        <Field
          label="Content"
          name="content"
          required
          multiline
          rows={14}
          defaultValue={post.content}
          placeholder={`Write your article here. Use blank lines between paragraphs.\n\nTo embed an ad, paste {{ad:your-slug}} on its own line.`}
        />
        <Field label="Author" name="author" required defaultValue={post.author} />
        <Field label="Image URL" name="imageUrl" required defaultValue={post.imageUrl} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>Category</label>
            <select
              name="category"
              defaultValue={post.category}
              className="w-full rounded-md px-3 py-2 text-sm border"
              style={{ background: 'var(--ep-bg)', borderColor: 'var(--ep-border)', color: 'var(--ep-text)' }}
            >
              <option value="news">News</option>
              <option value="story">Story</option>
              <option value="research">Research</option>
              <option value="update">Update</option>
            </select>
          </div>
          <Field label="Tags (comma-separated)" name="tags" defaultValue={post.tags.join(', ')} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="published" name="published" defaultChecked={post.published} className="w-4 h-4" />
          <label htmlFor="published" className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>Published</label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="text-white" style={{ background: 'var(--ep-primary)', border: 'none' }}>
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
  label, name, required, multiline, rows = 4, placeholder, defaultValue,
}: {
  label: string; name: string; required?: boolean; multiline?: boolean
  rows?: number; placeholder?: string; defaultValue?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
        {label}{required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      {multiline ? (
        <Textarea name={name} required={required} rows={rows} placeholder={placeholder} defaultValue={defaultValue} />
      ) : (
        <Input name={name} required={required} placeholder={placeholder} defaultValue={defaultValue} />
      )}
    </div>
  )
}
