'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

async function requireSuperAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
  const role = (session.user as { role?: string }).role
  if (role !== 'superAdmin') redirect('/admin')
}

export async function createAdminUser(formData: FormData) {
  await requireSuperAdmin()

  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    throw new Error('An admin with this email already exists.')
  }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.adminUser.create({
    data: { email, name, password: hashed, role: role === 'superAdmin' ? 'superAdmin' : 'admin' },
  })

  revalidatePath('/admin/admins')
  redirect('/admin/admins')
}

export async function updateAdminUser(id: string, formData: FormData) {
  await requireSuperAdmin()

  const session = await auth()
  const name = formData.get('name') as string
  const role = formData.get('role') as string
  const newPassword = formData.get('newPassword') as string

  const self = await prisma.adminUser.findUnique({ where: { email: session!.user!.email! } })

  const data: Record<string, string> = {
    name,
    role: role === 'superAdmin' ? 'superAdmin' : 'admin',
  }

  if (newPassword && newPassword.trim().length >= 8) {
    if (self?.id === id) {
      data.password = await bcrypt.hash(newPassword, 12)
    } else {
      data.password = await bcrypt.hash(newPassword, 12)
    }
  }

  await prisma.adminUser.update({ where: { id }, data })

  revalidatePath('/admin/admins')
  redirect('/admin/admins')
}

export async function deleteAdminUser(id: string) {
  await requireSuperAdmin()

  const session = await auth()
  const self = await prisma.adminUser.findUnique({ where: { email: session!.user!.email! } })
  if (self?.id === id) {
    throw new Error('You cannot delete your own account.')
  }

  await prisma.adminUser.delete({ where: { id } })
  revalidatePath('/admin/admins')
}
