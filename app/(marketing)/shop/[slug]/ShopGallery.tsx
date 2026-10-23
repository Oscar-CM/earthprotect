'use client'

import { useState } from 'react'

export function ShopGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3">
      <div
        className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg"
        style={{ border: '1px solid var(--ep-border)' }}
      >
        <img src={images[active]} alt={alt} className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className="aspect-square rounded-lg overflow-hidden transition-opacity"
              style={{
                border: `2px solid ${i === active ? 'var(--ep-primary)' : 'var(--ep-border)'}`,
                opacity: i === active ? 1 : 0.7,
              }}
            >
              <img src={src} alt={`${alt} view ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
