'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/AppLayout'

export default function AccountPage() {
  const router = useRouter()
  const [profile, setProfile] = useState({ name: '', email: '', initials: 'U' })
  const [stats, setStats] = useState({ total: 0, published: 0, store: '' })

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      const { data: store } = await supabase.from('stores').select('store_url').eq('user_id', user.id).single()
      const { data: products } = await supabase.from('products').select('published').eq('user_id', user.id)
      const name = p?.full_name || ''
      const initials = name ? name.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() : (user.email?.[0]?.toUpperCase() || 'U')
      setProfile({ name, email: user.email || '', initials })
      setStats({ total: products?.length || 0, published: products?.filter(p => p.published).length || 0, store: store?.store_url || '' })
    }
    load()
  }, [])

  return (
    <AppLayout>
      <div style={{ maxWidth: 600 }}>
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', marginBottom: 6 }}>Account</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Your VooltFlow profile and usage overview.</p>
        </div>

        {/* Profile card */}
        <div className="card animate-fade-up delay-100" style={{ padding: '28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, background: 'var(--green-light)', border: '2px solid var(--green-mid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, color: 'var(--green-dark)', flexShrink: 0 }}>
            {profile.initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', marginBottom: 3 }}>{profile.name || 'Your Name'}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{profile.email}</div>
          </div>
          <button onClick={() => router.push('/settings')} className="btn btn-outline" style={{ marginLeft: 'auto', padding: '8px 16px', fontSize: 13, borderRadius: 9 }}>
            Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fade-up delay-200" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Products Discovered', value: stats.total },
            { label: 'Published to Store', value: stats.published },
            { label: 'Success Rate', value: stats.total ? `${Math.round((stats.published / stats.total) * 100)}%` : '—' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 28, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Store info */}
        <div className="card animate-fade-up delay-300" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Connected Store</div>
            <button onClick={() => router.push('/settings')} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }}>Edit</button>
          </div>
          {stats.store ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="status-dot" />
              <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{stats.store}</span>
            </div>
          ) : (
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>No store connected yet. <a href="/connect-store" style={{ color: 'var(--green-dark)', fontWeight: 600 }}>Connect one →</a></div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
