import Link from 'next/link'
import { ExternalLink, Calendar, ArrowRight } from 'lucide-react'
import type { BlogPost, NewsArticle } from '@/types'

interface BlogCardProps {
  post: BlogPost
}

interface NewsCardProps {
  article: NewsArticle
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div
        className="rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 h-full"
        style={{
          background: 'var(--ep-card)',
          border: '1px solid var(--ep-border)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* Clickable image with hover overlay */}
        <div className="relative h-44 shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.imageUrl})` }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: 'rgba(0,0,0,0.18)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
              style={{ background: 'rgba(45,106,79,0.85)' }}
            >
              Read Story →
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: 'color-mix(in srgb, var(--ep-secondary) 12%, transparent)', color: 'var(--ep-secondary)' }}
            >
              {post.category}
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--ep-muted)' }}>
              <Calendar size={11} /> {formatDate(post.publishedAt)}
            </span>
          </div>
          <h3
            className="font-bold text-base mb-2 line-clamp-2"
            style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
          >
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed line-clamp-3 flex-1 mb-3" style={{ color: 'var(--ep-muted)' }}>
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'var(--ep-accent)' }}>By {post.author}</p>
            <span
              className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
              style={{ color: 'var(--ep-primary)' }}
            >
              Read more <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={article.url} target="_blank" rel="noopener noreferrer" className="block group">
      <div
        className="rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 h-full"
        style={{
          background: 'var(--ep-card)',
          border: '1px solid var(--ep-border)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        {article.urlToImage && (
          <div className="relative h-44 shrink-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${article.urlToImage})` }}
            />
            <div
              className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(0,0,0,0.18)' }}
            />
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: 'color-mix(in srgb, var(--ep-accent) 12%, transparent)', color: 'var(--ep-accent)' }}
            >
              {article.source.name}
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--ep-muted)' }}>
              <Calendar size={11} /> {formatDate(article.publishedAt)}
            </span>
          </div>
          <h3
            className="font-bold text-base mb-2 line-clamp-2 flex-1"
            style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
          >
            {article.title}
          </h3>
          {article.description && (
            <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--ep-muted)' }}>
              {article.description}
            </p>
          )}
          <span
            className="text-xs flex items-center gap-1 font-semibold group-hover:gap-2 transition-all"
            style={{ color: 'var(--ep-primary)' }}
          >
            Read article <ExternalLink size={11} />
          </span>
        </div>
      </div>
    </Link>
  )
}
