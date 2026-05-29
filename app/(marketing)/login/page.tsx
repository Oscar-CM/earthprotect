import { Shield } from 'lucide-react'
import { LoginForm } from './LoginForm'

export const metadata = { title: 'Admin Sign In — Earth Protect' }

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--ep-bg)' }}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl"
        style={{ background: 'var(--ep-card)', border: '1px solid var(--ep-border)' }}
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: 'var(--ep-primary)' }}
          >
            <Shield size={28} className="text-white" />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-lora)', color: 'var(--ep-text)' }}
          >
            Earth Protect Admin
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--ep-muted)' }}>
            Sign in to manage your conservation platform
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
