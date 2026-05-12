import type { NewsArticle } from '@/types'

const QUERIES = [
  'Africa wildlife conservation endangered',
  'Africa environment protection nature',
  'African national park safari conservation',
]

export async function fetchNews(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) return []

  const query = QUERIES[Math.floor(Date.now() / 3_600_000) % QUERIES.length]

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=12`,
      {
        headers: { 'X-Api-Key': apiKey },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return (data.articles as NewsArticle[]).filter(
      (a) => a.urlToImage && a.title && !a.title.includes('[Removed]')
    )
  } catch {
    return []
  }
}
