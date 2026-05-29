'use client'

export const dynamic = 'force-dynamic'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Something went wrong</h2>
        <button onClick={reset} style={{ padding: '0.5rem 1.5rem', background: '#2D6A4F', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
          Try again
        </button>
      </body>
    </html>
  )
}
