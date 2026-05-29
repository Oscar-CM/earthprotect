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

export async function createShopItem(formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  const slug = (formData.get('slug') as string) || toSlug(name)
  const tags = ((formData.get('tags') as string) || '')
    .split(',').map(s => s.trim()).filter(Boolean)

  await prisma.shopItem.create({
    data: {
      slug,
      name,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrl: formData.get('imageUrl') as string,
      category: formData.get('category') as string,
      tags,
      inStock: formData.get('inStock') === 'on',
      proceedsNote: (formData.get('proceedsNote') as string) || '100% supports wildlife conservation',
      published: formData.get('published') === 'on',
    },
  })

  revalidatePath('/shop')
  revalidatePath('/admin/shop')
  redirect('/admin/shop')
}

export async function updateShopItem(id: string, formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  const tags = ((formData.get('tags') as string) || '')
    .split(',').map(s => s.trim()).filter(Boolean)

  await prisma.shopItem.update({
    where: { id },
    data: {
      name,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      imageUrl: formData.get('imageUrl') as string,
      category: formData.get('category') as string,
      tags,
      inStock: formData.get('inStock') === 'on',
      proceedsNote: (formData.get('proceedsNote') as string) || '100% supports wildlife conservation',
      published: formData.get('published') === 'on',
    },
  })

  revalidatePath('/shop')
  revalidatePath('/admin/shop')
  redirect('/admin/shop')
}

export async function deleteShopItem(id: string) {
  await requireAdmin()
  await prisma.shopItem.delete({ where: { id } })
  revalidatePath('/shop')
  revalidatePath('/admin/shop')
}

export async function toggleShopItemPublished(id: string, published: boolean) {
  await requireAdmin()
  await prisma.shopItem.update({ where: { id }, data: { published } })
  revalidatePath('/shop')
  revalidatePath('/admin/shop')
}
