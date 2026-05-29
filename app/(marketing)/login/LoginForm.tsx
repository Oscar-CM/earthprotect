'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'

export function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    try {
      const { signIn } = await import('next-auth/react')
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('Invalid email or password.')
        setLoading(false)
      } else {
        window.location.href = '/admin'
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: '#fee2e2', color: '#dc2626' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
          Email address
        </label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="admin@earthprotect.org" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ep-text)' }}>
          Password
        </label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="••••••••" />
      </div>
      <Button type="submit" className="w-full text-white font-semibold" disabled={loading} style={{ background: 'var(--ep-primary)', border: 'none' }}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
