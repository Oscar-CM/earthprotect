import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, ChevronRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/constants'
import { SocialShare } from '@/components/shared/SocialShare'
import { Badge } from '@/components/ui/badge'

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

async function getPost(slug: string) {
  // Try DB first
  try {
    const { prisma } = await import('@/lib/prisma')
    const dbPost = await prisma.blogPost.findUnique({ where: { slug, published: true } })
    if (dbPost) {
      return {
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        content: dbPost.content,
        author: dbPost.author,
        publishedAt: dbPost.publishedAt.toISOString().split('T')[0],
        tags: dbPost.tags,
        imageUrl: dbPost.imageUrl,
        category: dbPost.category as 'news' | 'story' | 'research' | 'update',
      }
    }
  } catch { /* fall through to static */ }

  return BLOG_POSTS.find((p) => p.slug === slug) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} — Earth Protect`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [{ url: post.imageUrl }] },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://earthprotect.org'}/blog/${post.slug}`

  const paragraphs: string[] | null = post.content
    ? (post.content.split(/\n\n+/) as string[]).filter(Boolean)
    : null

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--ep-bg)' }}>
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.imageUrl})` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-3xl mx-auto">
            <nav className="flex items-center gap-1.5 text-xs text-white/60 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight size={12} />
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <ChevronRight size={12} />
              <span className="text-white line-clamp-1">{post.title}</span>
            </nav>
            <Badge
              className="mb-3 capitalize text-xs font-bold"
              style={{ background: 'var(--ep-secondary)', color: 'white', border: 'none' }}
            >
              {post.category}
            </Badge>
            <h1
              className="text-2xl md:text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: 'var(--font-lora)' }}
            >
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6" style={{ borderBottom: '1px solid var(--ep-border)' }}>
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
            style={{ color: 'var(--ep-primary)' }}
          >
            <ArrowLeft size={15} /> Back to Blog
          </Link>
          <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--ep-muted)' }}>
            <Calendar size={14} />
            {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="text-sm font-medium" style={{ color: 'var(--ep-text)' }}>
            By {post.author}
          </span>
        </div>

        {/* Excerpt lead */}
        <p
          className="text-lg leading-relaxed font-medium mb-8"
          style={{ color: 'var(--ep-text)' }}
        >
          {post.excerpt}
        </p>

        {/* Content */}
        {paragraphs && paragraphs.length > 0 ? (
          <div className="space-y-5 mb-10">
            {paragraphs.map((para, i) => (
              <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--ep-muted)' }}>
                {para}
              </p>
            ))}
          </div>
        ) : (
          <div
            className="p-6 rounded-xl mb-10 text-center"
            style={{ background: 'var(--ep-bg2)', border: '1px solid var(--ep-border)' }}
          >
            <p className="text-3xl mb-3">📖</p>
            <p className="font-semibold mb-1" style={{ color: 'var(--ep-text)' }}>
              Full article coming soon
            </p>
            <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
              This story is being written by our conservation team. Check back shortly for the complete article.
            </p>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Tag size={14} style={{ color: 'var(--ep-muted)' }} />
            {(post.tags as string[]).map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs capitalize"
                style={{ background: 'var(--ep-bg2)', color: 'var(--ep-muted)', borderColor: 'var(--ep-border)' }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Social share */}
        <div
          className="p-5 rounded-xl mb-8"
          style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ep-text)' }}>
            Share this story
          </p>
          <SocialShare url={pageUrl} title={post.title} description={post.excerpt} />
        </div>

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: 'var(--ep-primary)' }}
        >
          <ArrowLeft size={15} /> Read more stories
        </Link>
      </div>
    </div>
  )
}
