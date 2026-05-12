export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { deleteBlogPost, togglePostPublished } from '@/app/actions/admin'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

type BlogPost = {
  id: string; slug: string; title: string; author: string; category: string
  published: boolean; createdAt: Date
}

export default async function AdminBlogPage() {
  let posts: BlogPost[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } }) as BlogPost[]
  } catch {
    // DB not connected yet
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
          >
            Blog Posts
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            {posts.length} post{posts.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/admin/blog/new">
          <Button
            className="flex items-center gap-1.5 text-white"
            style={{ background: 'var(--ep-primary)', border: 'none' }}
          >
            <Plus size={16} /> New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center"
          style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
        >
          <p className="text-4xl mb-3">📝</p>
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>No posts yet</p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--ep-muted)' }}>
            Create your first blog post to share conservation stories.
          </p>
          <Link href="/admin/blog/new">
            <Button
              className="text-white"
              style={{ background: 'var(--ep-primary)', border: 'none' }}
            >
              Create first post
            </Button>
          </Link>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--ep-border)' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ep-muted)' }}>Title</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell" style={{ color: 'var(--ep-muted)' }}>Author</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell" style={{ color: 'var(--ep-muted)' }}>Category</th>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--ep-muted)' }}>Status</th>
                <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--ep-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  style={{ background: 'var(--ep-card)', borderBottom: '1px solid var(--ep-border)' }}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium truncate max-w-xs" style={{ color: 'var(--ep-text)' }}>
                      {post.title}
                    </p>
                    <p className="text-xs mt-0.5 truncate max-w-xs" style={{ color: 'var(--ep-muted)' }}>
                      /{post.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: 'var(--ep-muted)' }}>
                    {post.author}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {post.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <form
                      action={async () => {
                        'use server'
                        await togglePostPublished(post.id, !post.published)
                      }}
                    >
                      <button
                        type="submit"
                        className="flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity"
                        style={{ color: post.published ? '#059669' : 'var(--ep-muted)' }}
                      >
                        {post.published ? (
                          <><Eye size={13} /> Published</>
                        ) : (
                          <><EyeOff size={13} /> Draft</>
                        )}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <button
                          className="p-1.5 rounded hover:opacity-70 transition-opacity"
                          style={{ color: 'var(--ep-muted)' }}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                      </Link>
                      <form
                        action={async () => {
                          'use server'
                          await deleteBlogPost(post.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 rounded hover:opacity-70 transition-opacity"
                          style={{ color: '#dc2626' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
