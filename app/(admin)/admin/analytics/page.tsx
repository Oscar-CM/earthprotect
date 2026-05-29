export const dynamic = 'force-dynamic'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Users, Eye, TrendingUp, Globe, Calendar, BarChart2, Monitor } from 'lucide-react'

type VisitRow = { path: string; visitorHash: string; referrer: string | null; userAgent: string | null; createdAt: Date }

async function getAnalytics() {
  const { prisma } = await import('@/lib/prisma')

  const now = new Date()
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0)
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7)
  const monthStart = new Date(now); monthStart.setDate(now.getDate() - 30)

  const [allVisits, todayVisits, weekVisits, monthVisits] = await Promise.all([
    prisma.pageVisit.findMany({ orderBy: { createdAt: 'desc' } }) as Promise<VisitRow[]>,
    prisma.pageVisit.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.pageVisit.count({ where: { createdAt: { gte: monthStart } } }),
  ])

  const total = allVisits.length
  const uniqueAll = new Set(allVisits.map((v) => v.visitorHash)).size
  const uniqueMonth = new Set(allVisits.filter((v) => v.createdAt >= monthStart).map((v) => v.visitorHash)).size
  const uniqueWeek = new Set(allVisits.filter((v) => v.createdAt >= weekStart).map((v) => v.visitorHash)).size
  const uniqueToday = new Set(allVisits.filter((v) => v.createdAt >= todayStart).map((v) => v.visitorHash)).size

  // Top pages
  const pageCounts: Record<string, number> = {}
  for (const v of allVisits) pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Top referrers
  const refCounts: Record<string, number> = {}
  for (const v of allVisits) {
    if (v.referrer) {
      try {
        const host = new URL(v.referrer).hostname.replace('www.', '')
        refCounts[host] = (refCounts[host] ?? 0) + 1
      } catch { /* ignore */ }
    }
  }
  const topReferrers = Object.entries(refCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)

  // Daily chart — last 30 days
  const daily: Record<string, { views: number; unique: Set<string> }> = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    daily[d.toISOString().slice(0, 10)] = { views: 0, unique: new Set() }
  }
  for (const v of allVisits.filter((v) => v.createdAt >= monthStart)) {
    const key = v.createdAt.toISOString().slice(0, 10)
    if (daily[key]) {
      daily[key].views++
      daily[key].unique.add(v.visitorHash)
    }
  }
  const chartData = Object.entries(daily).map(([date, d]) => ({ date, views: d.views, unique: d.unique.size }))
  const maxViews = Math.max(...chartData.map((d) => d.views), 1)

  // Device breakdown
  let mobile = 0, desktop = 0, tablet = 0
  for (const v of allVisits) {
    const ua = (v.userAgent ?? '').toLowerCase()
    if (/mobile/i.test(ua) && !/tablet|ipad/i.test(ua)) mobile++
    else if (/tablet|ipad/i.test(ua)) tablet++
    else desktop++
  }

  // Recent visits
  const recent = allVisits.slice(0, 20)

  return { total, uniqueAll, uniqueMonth, uniqueWeek, uniqueToday, todayVisits, weekVisits, monthVisits, topPages, topReferrers, chartData, maxViews, mobile, desktop, tablet, recent }
}

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: number | string; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="p-5 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--ep-muted)' }}>{label}</p>
        <Icon size={16} style={{ color }} />
      </div>
      <p className="text-3xl font-bold" style={{ color: 'var(--ep-text)' }}>{value.toLocaleString()}</p>
      {sub && <p className="text-xs mt-1" style={{ color: 'var(--ep-muted)' }}>{sub}</p>}
    </div>
  )
}

export default async function AnalyticsPage() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (role !== 'superAdmin') redirect('/admin')

  let data: Awaited<ReturnType<typeof getAnalytics>> | null = null
  let error: string | null = null
  try {
    data = await getAnalytics()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load analytics'
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>Analytics</h1>
        <div className="p-8 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <p style={{ color: 'var(--ep-muted)' }}>{error ?? 'No data yet. Visit tracking starts automatically once visitors browse the site.'}</p>
        </div>
      </div>
    )
  }

  const { total, uniqueAll, uniqueMonth, uniqueWeek, uniqueToday, todayVisits, weekVisits, monthVisits, topPages, topReferrers, chartData, maxViews, mobile, desktop, tablet, recent } = data

  const deviceTotal = mobile + desktop + tablet || 1

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>Analytics</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
          Real-time visitor insights — Super Admin only
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Page Views" value={total} sub="All time" icon={Eye} color="#0284c7" />
        <StatCard label="Unique Visitors" value={uniqueAll} sub="All time" icon={Users} color="#7c3aed" />
        <StatCard label="Views This Month" value={monthVisits} sub={`${uniqueMonth} unique`} icon={Calendar} color="#059669" />
        <StatCard label="Views Today" value={todayVisits} sub={`${uniqueToday} unique`} icon={TrendingUp} color="#dc2626" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--ep-text)' }}>{weekVisits}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--ep-muted)' }}>Views this week</p>
          <p className="text-xs" style={{ color: 'var(--ep-primary)' }}>{uniqueWeek} unique</p>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--ep-text)' }}>
            {total > 0 ? Math.round((uniqueAll / total) * 100) : 0}%
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--ep-muted)' }}>Unique visitor ratio</p>
        </div>
        <div className="p-4 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <p className="text-2xl font-bold" style={{ color: 'var(--ep-text)' }}>
            {monthVisits > 0 ? (monthVisits / 30).toFixed(1) : '0'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--ep-muted)' }}>Avg views / day</p>
          <p className="text-xs" style={{ color: 'var(--ep-primary)' }}>last 30 days</p>
        </div>
      </div>

      {/* 30-day chart */}
      <div className="p-5 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} style={{ color: 'var(--ep-primary)' }} />
          <h2 className="font-semibold text-sm" style={{ color: 'var(--ep-text)' }}>Daily Traffic — Last 30 Days</h2>
          <div className="flex items-center gap-4 ml-auto text-xs" style={{ color: 'var(--ep-muted)' }}>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'var(--ep-primary)' }} />Views</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{ background: 'var(--ep-secondary)' }} />Unique</span>
          </div>
        </div>
        <div className="flex items-end gap-1" style={{ height: '120px' }}>
          {chartData.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              <div
                className="w-full rounded-sm transition-opacity group-hover:opacity-80"
                style={{ height: `${Math.round((d.views / maxViews) * 100)}px`, background: 'var(--ep-primary)', minHeight: d.views > 0 ? '2px' : '0' }}
              />
              <div
                className="w-full rounded-sm"
                style={{ height: `${Math.round((d.unique / maxViews) * 100)}px`, background: 'var(--ep-secondary)', minHeight: d.unique > 0 ? '2px' : '0', marginTop: '-100%', opacity: 0.6 }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                {d.date.slice(5)}: {d.views}v / {d.unique}u
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--ep-muted)' }}>
          <span>{chartData[0]?.date.slice(5)}</span>
          <span>{chartData[14]?.date.slice(5)}</span>
          <span>{chartData[29]?.date.slice(5)}</span>
        </div>
      </div>

      {/* Top pages + referrers */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--ep-text)' }}>
            <Eye size={14} style={{ color: 'var(--ep-primary)' }} /> Top Pages
          </h2>
          {topPages.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>No data yet</p>
          ) : (
            <div className="space-y-2">
              {topPages.map(([path, count]) => (
                <div key={path} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--ep-text)' }}>{path}</p>
                    <div
                      className="h-1.5 rounded-full mt-1"
                      style={{ width: `${(count / (topPages[0]?.[1] ?? 1)) * 100}%`, background: 'var(--ep-primary)', opacity: 0.7 }}
                    />
                  </div>
                  <span className="text-xs font-bold shrink-0" style={{ color: 'var(--ep-primary)' }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--ep-text)' }}>
            <Globe size={14} style={{ color: 'var(--ep-primary)' }} /> Top Referrers
          </h2>
          {topReferrers.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>No referrer data yet — direct traffic or no one has shared yet.</p>
          ) : (
            <div className="space-y-2">
              {topReferrers.map(([host, count]) => (
                <div key={host} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--ep-text)' }}>{host}</p>
                    <div
                      className="h-1.5 rounded-full mt-1"
                      style={{ width: `${(count / (topReferrers[0]?.[1] ?? 1)) * 100}%`, background: 'var(--ep-secondary)', opacity: 0.8 }}
                    />
                  </div>
                  <span className="text-xs font-bold shrink-0" style={{ color: 'var(--ep-secondary)' }}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Device breakdown */}
      <div className="p-5 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2" style={{ color: 'var(--ep-text)' }}>
          <Monitor size={14} style={{ color: 'var(--ep-primary)' }} /> Device Breakdown
        </h2>
        <div className="flex gap-4">
          {[
            { label: 'Desktop', count: desktop, color: '#0284c7' },
            { label: 'Mobile', count: mobile, color: '#7c3aed' },
            { label: 'Tablet', count: tablet, color: '#059669' },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex-1 text-center p-3 rounded-xl" style={{ background: 'var(--ep-bg2)' }}>
              <p className="text-2xl font-bold" style={{ color }}>{Math.round((count / deviceTotal) * 100)}%</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ep-muted)' }}>{label}</p>
              <p className="text-xs font-semibold" style={{ color: 'var(--ep-text)' }}>{count.toLocaleString()} visits</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent visits */}
      <div className="p-5 rounded-xl" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
        <h2 className="font-semibold text-sm mb-4" style={{ color: 'var(--ep-text)' }}>Recent Visits</h2>
        {recent.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--ep-muted)' }}>No visits yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ep-border)' }}>
                  {['Time', 'Page', 'Visitor', 'Referrer'].map((h) => (
                    <th key={h} className="text-left pb-2 pr-4 font-semibold" style={{ color: 'var(--ep-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((v, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--ep-border)' }}>
                    <td className="py-2 pr-4 whitespace-nowrap" style={{ color: 'var(--ep-muted)' }}>
                      {new Date(v.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2 pr-4 max-w-[180px] truncate font-medium" style={{ color: 'var(--ep-text)' }}>{v.path}</td>
                    <td className="py-2 pr-4 font-mono" style={{ color: 'var(--ep-muted)' }}>{v.visitorHash}</td>
                    <td className="py-2 max-w-[140px] truncate" style={{ color: 'var(--ep-muted)' }}>
                      {v.referrer ? (() => { try { return new URL(v.referrer).hostname } catch { return v.referrer } })() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
