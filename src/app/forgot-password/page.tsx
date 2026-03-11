'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` })
    if (error) { setError(error.message); setLoading(false) }
    else { setSent(true); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)', padding: 24 }}>
      <div className="card animate-fade-up" style={{ width: '100%', maxWidth: 420, padding: '48px 40px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40, textDecoration: 'none' }}>
          <div style={{ width: 30, height: 30, background: 'var(--green)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>VooltFlow</span>
        </Link>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Email sent!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>Check your inbox for a password reset link.</p>
            <Link href="/login" className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center', display: 'flex' }}>Back to Sign In</Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', marginBottom: 8 }}>Reset password</h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>Enter your email and we&apos;ll send you a reset link.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Email address</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#dc2626' }}>{error}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '13px', fontSize: 15, borderRadius: 11 }}>
                {loading ? <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} /> : 'Send Reset Link'}
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 24 }}>
              <Link href="/login" style={{ color: 'var(--green-dark)', fontWeight: 700 }}>← Back to Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
