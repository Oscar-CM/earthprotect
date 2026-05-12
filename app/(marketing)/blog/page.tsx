import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { BlogCard, NewsCard } from '@/components/cards/NewsCard'
import { fetchNews } from '@/services/newsService'
import { BLOG_POSTS } from '@/lib/constants'
import type { NewsArticle } from '@/types'

export const revalidate = 3600

export const metadata = {
  title: 'Blog & News',
  description: 'Conservation stories, research updates, and the latest African wildlife news.',
}

async function getDbPosts() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const dbPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
    }) as Array<{ slug: string; title: string; excerpt: string; content: string; author: string; publishedAt: Date; tags: string[]; imageUrl: string; category: string }>
    return dbPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      publishedAt: p.publishedAt.toISOString().split('T')[0],
      tags: p.tags,
      imageUrl: p.imageUrl,
      category: p.category as 'news' | 'story' | 'research' | 'update',
    }))
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const [newsArticles, dbPosts]: [NewsArticle[], ReturnType<typeof getDbPosts> extends Promise<infer T> ? T : never] = await Promise.all([fetchNews(), getDbPosts()])

  const dbSlugs = new Set(dbPosts.map((p) => p.slug))
  const staticPosts = BLOG_POSTS.filter((p) => !dbSlugs.has(p.slug))
  const allPosts = [...dbPosts, ...staticPosts]

  return (
    <div className="min-h-screen pt-24" style={{ background: 'var(--ep-bg)' }}>
      <div className="py-16 px-6 text-center" style={{ background: 'var(--ep-bg2)', borderBottom: '1px solid var(--ep-border)' }}>
        <div className="max-w-2xl mx-auto">
          <SectionTitle
            accent="Stories & News"
            title="From the Wild"
            subtitle="Conservation stories from the front lines, scientific research updates, and the latest news on African wildlife and environment."
            centered
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <Tabs defaultValue="stories">
          <TabsList className="mb-8">
            <TabsTrigger value="stories">
              Our Stories
              <span
                className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: 'var(--ep-primary)', color: 'white' }}
              >
                {allPosts.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="news">
              Africa Wildlife News
              {newsArticles.length > 0 && (
                <span
                  className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'var(--ep-primary)', color: 'white' }}
                >
                  {newsArticles.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stories">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news">
            {newsArticles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">📰</p>
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--ep-text)' }}>
                  News feed temporarily unavailable
                </p>
                <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>
                  Check back soon, or browse our stories above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsArticles.map((article) => (
                  <NewsCard key={article.url} article={article} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
