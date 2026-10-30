'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { seedCareerDefaults } from '@/lib/careers-data'
import { getStage, parseTimeline, splitLines, stageToStatus } from '@/lib/careers'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
  return session.user.name ?? session.user.email ?? 'Admin'
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

function optStr(formData: FormData, key: string) {
  return str(formData, key) || null
}

function optDate(formData: FormData, key: string) {
  const v = str(formData, key)
  return v ? new Date(v) : null
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

function refresh() {
  revalidatePath('/careers')
  revalidatePath('/admin/careers')
}

/** Send the admin back to the form with a message (redirect throws, so callers stop here). */
function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`)
}

/** Runs a write and turns a unique-constraint violation into a visible form error. */
async function saveOrFail(back: string, duplicateMessage: string, write: () => Promise<unknown>) {
  try {
    await write()
  } catch (err) {
    if ((err as { code?: string })?.code === 'P2002') fail(back, duplicateMessage)
    throw err
  }
}

export async function importCareerDefaults() {
  await requireAdmin()
  await seedCareerDefaults()
  refresh()
}

/* ── Countries ─────────────────────────────────────────────────── */

function countryData(formData: FormData) {
  return {
    name: str(formData, 'name'),
    flag: str(formData, 'flag'),
    region: str(formData, 'region'),
    focus: str(formData, 'focus'),
    languages: str(formData, 'languages'),
    verification: splitLines(formData.get('verification')),
    laws: splitLines(formData.get('laws')),
    sortOrder: parseInt(str(formData, 'sortOrder') || '0', 10) || 0,
    published: formData.get('published') === 'on',
  }
}

const DUPLICATE_COUNTRY = 'A country with that ISO code already exists.'

export async function createCareerCountry(formData: FormData) {
  await requireAdmin()
  const back = '/admin/careers/countries/new'
  const data = countryData(formData)
  if (!data.name) fail(back, 'Country name is required.')
  await saveOrFail(back, DUPLICATE_COUNTRY, () =>
    prisma.careerCountry.create({ data: { code: str(formData, 'code').toUpperCase(), ...data } }),
  )
  refresh()
  redirect('/admin/careers')
}

export async function updateCareerCountry(id: string, formData: FormData) {
  await requireAdmin()
  const back = `/admin/careers/countries/${id}`
  const data = countryData(formData)
  if (!data.name) fail(back, 'Country name is required.')
  await saveOrFail(back, DUPLICATE_COUNTRY, () =>
    prisma.careerCountry.update({ where: { id }, data: { code: str(formData, 'code').toUpperCase(), ...data } }),
  )
  refresh()
  redirect('/admin/careers')
}

/** Deleting a country also deletes its openings; applications are kept (opening link is cleared). */
export async function deleteCareerCountry(id: string) {
  await requireAdmin()
  await prisma.careerCountry.delete({ where: { id } })
  refresh()
}

/* ── Roles (reusable job descriptions) ─────────────────────────── */

function roleData(formData: FormData) {
  return {
    title: str(formData, 'title'),
    reportsTo: str(formData, 'reportsTo'),
    employmentType: str(formData, 'employmentType') || 'Full-time',
    summary: str(formData, 'summary'),
    responsibilities: splitLines(formData.get('responsibilities')),
    requirements: splitLines(formData.get('requirements')),
    niceToHave: splitLines(formData.get('niceToHave')),
    sortOrder: parseInt(str(formData, 'sortOrder') || '0', 10) || 0,
    published: formData.get('published') === 'on',
  }
}

const DUPLICATE_ROLE = 'A role with that slug already exists. Change the slug or the title.'

export async function createCareerRole(formData: FormData) {
  await requireAdmin()
  const back = '/admin/careers/roles/new'
  const data = roleData(formData)
  if (!data.title || !data.summary) fail(back, 'Title and summary are required.')
  await saveOrFail(back, DUPLICATE_ROLE, () =>
    prisma.careerRole.create({ data: { slug: str(formData, 'slug') || toSlug(data.title), ...data } }),
  )
  refresh()
  redirect('/admin/careers')
}

export async function updateCareerRole(id: string, formData: FormData) {
  await requireAdmin()
  const back = `/admin/careers/roles/${id}`
  const data = roleData(formData)
  if (!data.title || !data.summary) fail(back, 'Title and summary are required.')
  await saveOrFail(back, DUPLICATE_ROLE, () =>
    prisma.careerRole.update({ where: { id }, data: { slug: str(formData, 'slug') || toSlug(data.title), ...data } }),
  )
  refresh()
  redirect('/admin/careers')
}

/** Deleting a role also deletes its openings in every country. */
export async function deleteCareerRole(id: string) {
  await requireAdmin()
  await prisma.careerRole.delete({ where: { id } })
  refresh()
}

/* ── Openings (a role in a country) ────────────────────────────── */

/** The closing date is the last day applicants can apply, so it runs to the end of that day. */
function optEndOfDay(formData: FormData, key: string) {
  const d = optDate(formData, key)
  if (d) d.setUTCHours(23, 59, 59, 999)
  return d
}

function openingData(formData: FormData) {
  return {
    status: str(formData, 'status') || 'open',
    positions: Math.max(1, parseInt(str(formData, 'positions') || '1', 10) || 1),
    location: optStr(formData, 'location'),
    salary: optStr(formData, 'salary'),
    opensAt: optDate(formData, 'opensAt'),
    closesAt: optEndOfDay(formData, 'closesAt'),
    summaryOverride: optStr(formData, 'summaryOverride'),
    extraResponsibilities: splitLines(formData.get('extraResponsibilities')),
    extraRequirements: splitLines(formData.get('extraRequirements')),
    extraNiceToHave: splitLines(formData.get('extraNiceToHave')),
    timeline: parseTimeline(formData.get('timeline')) as unknown as Prisma.InputJsonValue,
    internalNotes: optStr(formData, 'internalNotes'),
  }
}

const DUPLICATE_OPENING = 'That role already has an opening in that country. Edit the existing opening instead.'

function checkDates(back: string, data: ReturnType<typeof openingData>) {
  if (data.opensAt && data.closesAt && data.closesAt < data.opensAt) {
    fail(back, 'The closing date must be on or after the opening date.')
  }
}

export async function createCareerOpening(formData: FormData) {
  await requireAdmin()
  const back = '/admin/careers/openings/new'
  const countryId = str(formData, 'countryId')
  const roleId = str(formData, 'roleId')
  if (!countryId || !roleId) fail(back, 'Choose a country and a role. Add them first if the lists are empty.')
  const data = openingData(formData)
  checkDates(back, data)
  await saveOrFail(back, DUPLICATE_OPENING, () => prisma.careerOpening.create({ data: { countryId, roleId, ...data } }))
  refresh()
  redirect('/admin/careers')
}

export async function updateCareerOpening(id: string, formData: FormData) {
  await requireAdmin()
  const back = `/admin/careers/openings/${id}`
  const data = openingData(formData)
  checkDates(back, data)
  await prisma.careerOpening.update({ where: { id }, data })
  refresh()
  redirect('/admin/careers')
}

export async function setCareerOpeningStatus(id: string, status: string) {
  await requireAdmin()
  await prisma.careerOpening.update({ where: { id }, data: { status } })
  refresh()
}

export async function deleteCareerOpening(id: string) {
  await requireAdmin()
  await prisma.careerOpening.delete({ where: { id } })
  refresh()
}

/* ── Applications ──────────────────────────────────────────────── */

export async function changeApplicationStage(id: string, formData: FormData) {
  const actor = await requireAdmin()
  const toStage = getStage(str(formData, 'stage')).id
  const note = optStr(formData, 'note')

  const app = await prisma.joinApplication.findUnique({ where: { id }, select: { stage: true } })
  if (!app) return

  await prisma.joinApplication.update({
    where: { id },
    data: {
      stage: toStage,
      status: stageToStatus(toStage),
      events: { create: { type: 'stage_change', fromStage: app.stage, toStage, note, actor } },
    },
  })
  revalidatePath('/admin/careers/applications')
  revalidatePath(`/admin/careers/applications/${id}`)
}

export async function addApplicationNote(id: string, formData: FormData) {
  const actor = await requireAdmin()
  const note = str(formData, 'note')
  if (!note) return
  await prisma.applicationEvent.create({ data: { applicationId: id, type: 'note', note, actor } })
  revalidatePath(`/admin/careers/applications/${id}`)
}
