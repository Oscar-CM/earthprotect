export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { updateAd } from '@/app/actions/ads'
import { AdForm } from '../../_components/AdForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ad = await prisma.ad.findUnique({ where: { id } })
  if (!ad) notFound()

  const action = updateAd.bind(null, id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/ads" className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--ep-muted)' }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}>
          Edit Ad
        </h1>
      </div>
      <AdForm
        action={action}
        defaultValues={{
          slug: ad.slug,
          title: ad.title,
          description: ad.description,
          imageUrl: ad.imageUrl,
          linkUrl: ad.linkUrl,
          linkText: ad.linkText,
          type: ad.type,
          htmlContent: ad.htmlContent,
          active: ad.active,
        }}
      />
    </div>
  )
}
