'use client'

import type { ReactNode } from 'react'

/** Submit button that asks for confirmation first. Use inside a <form action={...}>. */
export function ConfirmButton({
  message, children, className, style,
}: {
  message: string; children: ReactNode; className?: string; style?: React.CSSProperties
}) {
  return (
    <button
      type="submit"
      className={className}
      style={style}
      onClick={(e) => { if (!window.confirm(message)) e.preventDefault() }}
    >
      {children}
    </button>
  )
}
