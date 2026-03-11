'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/AppLayout'

const NICHES = ['Smart Watches', 'Wireless Earbuds', 'Phone Accessories', 'Home Security', 'Fitness Gear', 'Kitchen Gadgets', 'Pet Products', 'Gaming Accessories', 'Beauty Tools', 'Baby Products']

export default function DashboardPage() {
  const router = useRouter()
  const [niche, setNiche] = useState('')
  const [userName, setUserName] = useState('')
  const [stats, setStats] = useState({ total: 0, published: 0, thisWeek: 0 })

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      if (profile?.full_name) setUserName(profile.full_name.split(' ')[0])
      const { data: products } = await supabase.from('products').select('published, created_at').eq('user_id', user.id)
      if (products) {
        const week = new Date(); week.setDate(week.getDate() - 7)
        setStats({
          total: products.length,
          published: products.filter(p => p.published).length,
          thisWeek: products.filter(p => new Date(p.created_at) > week).length,
        })
      }
    }
    load()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!niche.trim()) return
    router.push(`/products?niche=${encodeURIComponent(niche.trim())}`)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <AppLayout>
      <div style={{ maxWidth: 900 }}>
        {/* Header */}
        <div className="animate-fade-up" style={{ marginBottom: 36 }}>
          <h1 style={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>
            {greeting}{userName ? `, ${userName}` : ''} 👋
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>What niche are you exploring today?</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="animate-fade-up delay-100">
          <div style={{ display: 'flex', gap: 10, background: 'var(--bg)', border: '2px solid var(--border-mid)', borderRadius: 14, padding: '8px 8px 8px 20px', transition: 'border-color 0.2s', boxShadow: 'var(--shadow-sm)' }}
            onFocus={() => {}} >
            <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <input
              type="text"
              value={niche}
              onChange={e => setNiche(e.target.value)}
              placeholder="e.g. Smart Watches, Wireless Earbuds, Kitchen Gadgets..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', background: 'transparent' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '11px 24px', borderRadius: 10, fontSize: 14, flexShrink: 0 }}>
              Discover Products
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </form>

        {/* Trending niches */}
        <div className="animate-fade-up delay-200" style={{ marginTop: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Trending niches</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {NICHES.map(n => (
              <button key={n} onClick={() => { setNiche(n); router.push(`/products?niche=${encodeURIComponent(n)}`) }}
                style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 100, padding: '6px 14px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--green)'; el.style.color = 'var(--green-dark)'; el.style.background = 'var(--green-light)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-secondary)'; el.style.background = 'var(--bg)' }}
              >{n}</button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-up delay-300" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48 }}>
          {[
            { label: 'Products Discovered', value: stats.total, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, color: 'var(--green)' },
            { label: 'Published to Store', value: stats.published, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2m-4 4-4-4 4-4m0 4H9"/></svg>, color: '#3b82f6' },
            { label: 'Found This Week', value: stats.thisWeek, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{s.label}</div>
                <div style={{ width: 36, height: 36, background: s.color + '18', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: 36, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Quick tip */}
        <div className="animate-fade-up delay-400" style={{ marginTop: 24, background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 20, height: 20, background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17h.01"/><path d="M12 11a1 1 0 0 1 1 1v3"/></svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--green-dark)', marginBottom: 3 }}>Pro tip</div>
            <div style={{ fontSize: 13, color: 'var(--green-dark)', opacity: 0.8, lineHeight: 1.55 }}>
              Every product discovered comes with a real YouTube Short proving it&apos;s already trending — click &quot;View Details&quot; on any product to see it and the auto-generated affiliate link before publishing.
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
