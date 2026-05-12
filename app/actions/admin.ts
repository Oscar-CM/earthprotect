'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const author = formData.get('author') as string
  const category = formData.get('category') as string
  const imageUrl = formData.get('imageUrl') as string
  const tagsRaw = formData.get('tags') as string
  const published = formData.get('published') === 'on'

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt,
      content,
      author,
      category,
      imageUrl,
      tags,
      published,
      publishedAt: new Date(),
    },
  })

  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const excerpt = formData.get('excerpt') as string
  const content = formData.get('content') as string
  const author = formData.get('author') as string
  const category = formData.get('category') as string
  const imageUrl = formData.get('imageUrl') as string
  const tagsRaw = formData.get('tags') as string
  const published = formData.get('published') === 'on'

  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  await prisma.blogPost.update({
    where: { id },
    data: { title, excerpt, content, author, category, imageUrl, tags, published },
  })

  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  redirect('/admin/blog')
}

export async function deleteBlogPost(id: string) {
  await requireAdmin()
  await prisma.blogPost.delete({ where: { id } })
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
}

export async function togglePostPublished(id: string, published: boolean) {
  await requireAdmin()
  await prisma.blogPost.update({ where: { id }, data: { published } })
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
}
