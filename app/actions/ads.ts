'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

export async function createAd(formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || toSlug(title)

  await prisma.ad.create({
    data: {
      slug,
      title,
      description: (formData.get('description') as string) || null,
      imageUrl: (formData.get('imageUrl') as string) || null,
      linkUrl: (formData.get('linkUrl') as string) || null,
      linkText: (formData.get('linkText') as string) || null,
      type: (formData.get('type') as string) || 'inline',
      htmlContent: (formData.get('htmlContent') as string) || null,
      active: formData.get('active') === 'on',
    },
  })

  revalidatePath('/admin/ads')
  redirect('/admin/ads')
}

export async function updateAd(id: string, formData: FormData) {
  await requireAdmin()

  await prisma.ad.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || null,
      imageUrl: (formData.get('imageUrl') as string) || null,
      linkUrl: (formData.get('linkUrl') as string) || null,
      linkText: (formData.get('linkText') as string) || null,
      type: (formData.get('type') as string) || 'inline',
      htmlContent: (formData.get('htmlContent') as string) || null,
      active: formData.get('active') === 'on',
    },
  })

  revalidatePath('/admin/ads')
  redirect('/admin/ads')
}

export async function deleteAd(id: string) {
  await requireAdmin()
  await prisma.ad.delete({ where: { id } })
  revalidatePath('/admin/ads')
}

export async function toggleAdActive(id: string, active: boolean) {
  await requireAdmin()
  await prisma.ad.update({ where: { id }, data: { active } })
  revalidatePath('/admin/ads')
}
