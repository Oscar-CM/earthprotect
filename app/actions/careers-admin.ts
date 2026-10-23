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

export async function createCareerCountry(formData: FormData) {
  await requireAdmin()
  await prisma.careerCountry.create({
    data: { code: str(formData, 'code').toUpperCase(), ...countryData(formData) },
  })
  refresh()
  redirect('/admin/careers')
}

export async function updateCareerCountry(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.careerCountry.update({
    where: { id },
    data: { code: str(formData, 'code').toUpperCase(), ...countryData(formData) },
  })
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

export async function createCareerRole(formData: FormData) {
  await requireAdmin()
  const data = roleData(formData)
  await prisma.careerRole.create({ data: { slug: str(formData, 'slug') || toSlug(data.title), ...data } })
  refresh()
  redirect('/admin/careers')
}

export async function updateCareerRole(id: string, formData: FormData) {
  await requireAdmin()
  const data = roleData(formData)
  await prisma.careerRole.update({ where: { id }, data: { slug: str(formData, 'slug') || toSlug(data.title), ...data } })
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

function openingData(formData: FormData) {
  return {
    status: str(formData, 'status') || 'open',
    positions: Math.max(1, parseInt(str(formData, 'positions') || '1', 10) || 1),
    location: optStr(formData, 'location'),
    salary: optStr(formData, 'salary'),
    opensAt: optDate(formData, 'opensAt'),
    closesAt: optDate(formData, 'closesAt'),
    summaryOverride: optStr(formData, 'summaryOverride'),
    extraResponsibilities: splitLines(formData.get('extraResponsibilities')),
    extraRequirements: splitLines(formData.get('extraRequirements')),
    extraNiceToHave: splitLines(formData.get('extraNiceToHave')),
    timeline: parseTimeline(formData.get('timeline')) as unknown as Prisma.InputJsonValue,
    internalNotes: optStr(formData, 'internalNotes'),
  }
}

export async function createCareerOpening(formData: FormData) {
  await requireAdmin()
  await prisma.careerOpening.create({
    data: { countryId: str(formData, 'countryId'), roleId: str(formData, 'roleId'), ...openingData(formData) },
  })
  refresh()
  redirect('/admin/careers')
}

export async function updateCareerOpening(id: string, formData: FormData) {
  await requireAdmin()
  await prisma.careerOpening.update({ where: { id }, data: openingData(formData) })
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
