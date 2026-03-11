'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 48, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'var(--green)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>VooltFlow</span>
          </Link>

          <div className="animate-fade-up">
            <h1 style={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', marginBottom: 6, color: 'var(--text-primary)' }}>Welcome back</h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 36 }}>Sign in to your account to continue</p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Email address</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                  <Link href="/forgot-password" style={{ fontSize: 13, color: 'var(--green-dark)', fontWeight: 600 }}>Forgot password?</Link>
                </div>
                <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4, borderRadius: 11 }}>
                {loading ? <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} /> : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 28 }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ color: 'var(--green-dark)', fontWeight: 700 }}>Create one free</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 480, background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'rgba(22,198,90,0.12)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, background: 'rgba(22,198,90,0.08)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(22,198,90,0.15)', border: '1px solid rgba(22,198,90,0.3)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', color: 'var(--green)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 24, color: '#fff', marginBottom: 14, letterSpacing: '-0.02em' }}>Power on autopilot</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 40 }}>Every second you&apos;re not using VooltFlow, your competitors are discovering and publishing products.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['AI finds trending products automatically', 'YouTube viral proof for every product', 'One-click WooCommerce publishing'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                <div style={{ width: 22, height: 22, background: 'var(--green)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
