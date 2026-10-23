import { prisma } from '@/lib/prisma'
import {
  JOB_COUNTRIES,
  JOB_ROLES,
  openingAvailability,
  type PublicCountry,
  type TimelineEntry,
} from '@/lib/careers'

function toTimeline(value: unknown): TimelineEntry[] {
  return Array.isArray(value) ? (value as TimelineEntry[]).filter((e) => e?.date && e?.label) : []
}

/** Published countries with their visible openings, role text merged with country-specific additions. */
export async function getPublicCareers(): Promise<PublicCountry[]> {
  const countries = await prisma.careerCountry.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      openings: {
        where: { status: { not: 'draft' }, role: { published: true } },
        include: { role: true },
      },
    },
  })

  return countries.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
    region: c.region,
    focus: c.focus,
    languages: c.languages,
    verification: c.verification,
    laws: c.laws,
    openings: c.openings
      .sort((a, b) => a.role.sortOrder - b.role.sortOrder)
      .map((o) => ({
        id: o.id,
        title: o.role.title,
        reportsTo: o.role.reportsTo,
        employmentType: o.role.employmentType,
        summary: o.summaryOverride?.trim() || o.role.summary,
        responsibilities: [...o.role.responsibilities, ...o.extraResponsibilities],
        requirements: [...o.role.requirements, ...o.extraRequirements],
        niceToHave: [...o.role.niceToHave, ...o.extraNiceToHave],
        location: o.location,
        salary: o.salary,
        positions: o.positions,
        opensAt: o.opensAt?.toISOString() ?? null,
        closesAt: o.closesAt?.toISOString() ?? null,
        timeline: toTimeline(o.timeline),
        availability: openingAvailability(o.status, o.opensAt, o.closesAt),
      })),
  }))
}

/** One-off import of the original hard-coded countries, roles and openings. Safe to run repeatedly. */
export async function seedCareerDefaults() {
  const roleIds: Record<string, string> = {}
  for (const [i, r] of JOB_ROLES.entries()) {
    const data = {
      title: r.title,
      reportsTo: r.reportsTo,
      summary: r.summary,
      responsibilities: r.responsibilities,
      requirements: r.requirements,
      niceToHave: r.niceToHave,
      sortOrder: i,
    }
    const row = await prisma.careerRole.upsert({
      where: { slug: r.id },
      create: { slug: r.id, ...data },
      update: {},
    })
    roleIds[r.id] = row.id
  }

  for (const [i, c] of JOB_COUNTRIES.entries()) {
    const country = await prisma.careerCountry.upsert({
      where: { code: c.code },
      create: {
        code: c.code,
        name: c.name,
        flag: c.flag,
        region: c.region,
        focus: c.focus,
        languages: c.languages,
        verification: c.verification,
        laws: c.laws,
        sortOrder: i,
      },
      update: {},
    })
    for (const r of JOB_ROLES) {
      await prisma.careerOpening.upsert({
        where: { countryId_roleId: { countryId: country.id, roleId: roleIds[r.id] } },
        create: { countryId: country.id, roleId: roleIds[r.id] },
        update: {},
      })
    }
  }
}
