'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, full_name: name })
      router.push('/connect-store')
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: 40 }} className="animate-fade-up">
        <div style={{ width: 64, height: 64, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 10 }}>Check your email</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6 }}>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>
      {/* Right panel (visual) — flipped from login */}
      <div style={{ width: 480, background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, left: -60, width: 300, height: 300, background: 'rgba(22,198,90,0.12)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ fontWeight: 900, fontSize: 42, letterSpacing: '-0.04em', color: '#fff', marginBottom: 8, lineHeight: 1.1 }}>
            Start your<br /><span style={{ color: 'var(--green)' }}>affiliate journey</span>
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginTop: 16, marginBottom: 44, lineHeight: 1.65 }}>
            Set up in under 2 minutes. Connect your WooCommerce store and start discovering products today.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { value: '2 min', label: 'Setup time' },
              { value: '29+', label: 'Products per search' },
              { value: '3 sec', label: 'To publish' },
              { value: '100%', label: 'Automated' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px' }}>
                <div style={{ fontWeight: 800, fontSize: 24, color: 'var(--green)', letterSpacing: '-0.03em' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 48, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'var(--green)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)' }}>VooltFlow</span>
          </Link>

          <div className="animate-fade-up">
            <h1 style={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', marginBottom: 6 }}>Create your account</h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 36 }}>Free to start. No credit card required.</p>

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Full name</label>
                <input className="input" type="text" placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Email address</label>
                <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Password</label>
                <input className="input" type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#dc2626' }}>{error}</div>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4, borderRadius: 11 }}>
                {loading
                  ? <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                  : 'Create Free Account'}
              </button>

              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                By signing up you agree to our <a href="#" style={{ color: 'var(--green-dark)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--green-dark)' }}>Privacy Policy</a>.
              </p>
            </form>

            <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 24 }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--green-dark)', fontWeight: 700 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
