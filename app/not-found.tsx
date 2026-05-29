export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f9fafb' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: 700, color: '#1B4332', marginBottom: '0.5rem' }}>404</h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>Page not found</p>
        <a href="/" style={{ padding: '0.75rem 2rem', background: '#2D6A4F', color: 'white', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
          Go home
        </a>
      </body>
    </html>
  )
}
