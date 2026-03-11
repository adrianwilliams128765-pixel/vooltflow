'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/AppLayout'

export default function SettingsPage() {
  const [tab, setTab] = useState<'store' | 'account'>('store')
  const [storeUrl, setStoreUrl] = useState('')
  const [consumerKey, setConsumerKey] = useState('')
  const [consumerSecret, setConsumerSecret] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      setEmail(user.email || '')
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      if (profile) setFullName(profile.full_name || '')
      const { data: store } = await supabase.from('stores').select('*').eq('user_id', user.id).single()
      if (store) { setStoreUrl(store.store_url); setConsumerKey(store.consumer_key); setConsumerSecret(store.consumer_secret) }
    }
    load()
  }, [])

  const saveStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    await supabase.from('stores').upsert({ user_id: userId, store_url: storeUrl, consumer_key: consumerKey, consumer_secret: consumerSecret, is_verified: true }, { onConflict: 'user_id' })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const saveAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').upsert({ id: userId, full_name: fullName })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const TABS = [{ key: 'store', label: 'Store Configuration' }, { key: 'account', label: 'Account' }]

  return (
    <AppLayout>
      <div style={{ maxWidth: 640 }}>
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', marginBottom: 6, color: 'var(--text-primary)' }}>Settings</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Manage your store connection and account preferences.</p>
        </div>

        {/* Tabs */}
        <div className="animate-fade-up delay-100" style={{ display: 'flex', borderBottom: '2px solid var(--border)', marginBottom: 32 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as 'store' | 'account')}
              style={{ padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'Outfit, sans-serif', color: tab === t.key ? 'var(--green-dark)' : 'var(--text-muted)', borderBottom: tab === t.key ? '2px solid var(--green)' : '2px solid transparent', marginBottom: -2, transition: 'all 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'store' && (
          <form onSubmit={saveStore} className="card animate-fade-up" style={{ padding: '28px' }}>
            <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 24, color: 'var(--text-primary)' }}>WooCommerce API Credentials</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Store URL</label>
                <input className="input" value={storeUrl} onChange={e => setStoreUrl(e.target.value)} placeholder="https://yourstore.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Consumer Key</label>
                <input className="input mono" value={consumerKey} onChange={e => setConsumerKey(e.target.value)} placeholder="ck_xxxxxxxxxxxx" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Consumer Secret</label>
                <input className="input mono" type="password" value={consumerSecret} onChange={e => setConsumerSecret(e.target.value)} placeholder="cs_xxxxxxxxxxxx" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '12px', fontSize: 14, borderRadius: 10 }}>
                {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {tab === 'account' && (
          <form onSubmit={saveAccount} className="card animate-fade-up" style={{ padding: '28px' }}>
            <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 24, color: 'var(--text-primary)' }}>Account Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Full Name</label>
                <input className="input" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Email Address</label>
                <input className="input" value={email} readOnly style={{ opacity: 0.65, cursor: 'not-allowed' }} />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>Email cannot be changed here. Contact support if needed.</p>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '12px', fontSize: 14, borderRadius: 10 }}>
                {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AppLayout>
  )
}
