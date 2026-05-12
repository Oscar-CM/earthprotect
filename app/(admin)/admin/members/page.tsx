import { Badge } from '@/components/ui/badge'
import { Users, Leaf, Globe, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react'
import { updateApplicationStatus } from '@/app/actions/join'

type Application = {
  id: string; firstName: string; lastName: string; email: string
  country: string; role: string; motivation: string | null
  newsletter: boolean; status: string; notes: string | null; createdAt: Date
}

const ROLES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'volunteer', label: 'Volunteers', icon: Leaf },
  { id: 'ambassador', label: 'Ambassadors', icon: Globe },
]

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:  { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
  approved: { bg: '#dcfce7', color: '#166534', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role: filterRole = 'all' } = await searchParams

  let applications: Application[] = []
  try {
    const { prisma } = await import('@/lib/prisma')
    applications = await prisma.joinApplication.findMany({
      where: filterRole !== 'all' ? { role: filterRole } : undefined,
      orderBy: { createdAt: 'desc' },
    }) as Application[]
  } catch { /* DB not connected */ }

  const counts = { all: applications.length } as Record<string, number>

  // fetch all for tab counts when filter is active
  let allApplications = applications
  if (filterRole !== 'all') {
    try {
      const { prisma } = await import('@/lib/prisma')
      allApplications = await prisma.joinApplication.findMany({ orderBy: { createdAt: 'desc' } }) as Application[]
    } catch { /* ignore */ }
  }
  counts.all = allApplications.length
  counts.community = allApplications.filter(a => a.role === 'community').length
  counts.volunteer = allApplications.filter(a => a.role === 'volunteer').length
  counts.ambassador = allApplications.filter(a => a.role === 'ambassador').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          Members & Applications
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
          {counts.all} total · {allApplications.filter(a => a.status === 'pending').length} pending review
        </p>
      </div>

      {/* Role tabs */}
      <div className="flex flex-wrap gap-2">
        {ROLES.map(r => {
          const active = filterRole === r.id
          const count = counts[r.id] ?? 0
          return (
            <a
              key={r.id}
              href={r.id === 'all' ? '/admin/members' : `/admin/members?role=${r.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: active ? 'var(--ep-primary)' : 'var(--ep-card)',
                color: active ? 'white' : 'var(--ep-text)',
                border: `1px solid ${active ? 'var(--ep-primary)' : 'var(--ep-border)'}`,
              }}
            >
              {r.icon && <r.icon size={14} />}
              {r.label}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{
                  background: active ? 'rgba(255,255,255,0.25)' : 'var(--ep-bg2)',
                  color: active ? 'white' : 'var(--ep-muted)',
                }}
              >
                {count}
              </span>
            </a>
          )
        })}
      </div>

      {applications.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}>
          <Users size={36} className="mx-auto mb-3" style={{ color: 'var(--ep-muted)' }} />
          <p className="font-semibold" style={{ color: 'var(--ep-text)' }}>No applications yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            Applications from the Join page will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const statusStyle = STATUS_STYLES[app.status] ?? STATUS_STYLES.pending
            const roleLabel = app.role === 'community' ? 'Community Member'
              : app.role === 'volunteer' ? 'Field Volunteer'
              : app.role === 'ambassador' ? 'Brand Ambassador'
              : app.role
            const RoleIcon = app.role === 'community' ? Users
              : app.role === 'volunteer' ? Leaf
              : Globe

            return (
              <div
                key={app.id}
                className="p-5 rounded-xl"
                style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Identity */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'var(--ep-bg2)' }}
                    >
                      <RoleIcon size={18} style={{ color: 'var(--ep-primary)' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-base" style={{ color: 'var(--ep-text)' }}>
                        {app.firstName} {app.lastName}
                      </p>
                      <a
                        href={`mailto:${app.email}`}
                        className="flex items-center gap-1 text-sm hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--ep-primary)' }}
                      >
                        <Mail size={12} /> {app.email}
                      </a>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ep-muted)' }}>
                          <MapPin size={11} /> {app.country}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--ep-muted)' }}>
                          <Calendar size={11} />
                          {new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        {app.newsletter && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#dbeafe', color: '#1e40af' }}>
                            Newsletter
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Role + status */}
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      className="text-xs font-semibold"
                      style={{ background: 'color-mix(in srgb, var(--ep-primary) 12%, transparent)', color: 'var(--ep-primary)', border: 'none' }}
                    >
                      <RoleIcon size={11} className="mr-1" /> {roleLabel}
                    </Badge>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}
                    >
                      {statusStyle.label}
                    </span>
                  </div>
                </div>

                {/* Motivation */}
                {app.motivation && (
                  <div
                    className="mt-4 p-3 rounded-lg text-sm leading-relaxed"
                    style={{ background: 'var(--ep-bg2)', color: 'var(--ep-muted)' }}
                  >
                    <p className="flex items-center gap-1.5 text-xs font-semibold mb-1.5" style={{ color: 'var(--ep-text)' }}>
                      <MessageSquare size={12} /> Motivation
                    </p>
                    {app.motivation}
                  </div>
                )}

                {/* Status actions */}
                {app.status === 'pending' && (
                  <div className="flex items-center gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--ep-border)' }}>
                    <span className="text-xs font-medium mr-1" style={{ color: 'var(--ep-muted)' }}>Update status:</span>
                    <form action={async () => { 'use server'; await updateApplicationStatus(app.id, 'approved') }}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-full font-semibold transition-opacity hover:opacity-80"
                        style={{ background: '#dcfce7', color: '#166534' }}
                      >
                        ✓ Approve
                      </button>
                    </form>
                    <form action={async () => { 'use server'; await updateApplicationStatus(app.id, 'rejected') }}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-full font-semibold transition-opacity hover:opacity-80"
                        style={{ background: '#fee2e2', color: '#991b1b' }}
                      >
                        ✗ Decline
                      </button>
                    </form>
                  </div>
                )}
                {app.status !== 'pending' && (
                  <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--ep-border)' }}>
                    <form action={async () => { 'use server'; await updateApplicationStatus(app.id, 'pending') }}>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80"
                        style={{ background: 'var(--ep-bg2)', color: 'var(--ep-muted)', border: '1px solid var(--ep-border)' }}
                      >
                        Reset to pending
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
