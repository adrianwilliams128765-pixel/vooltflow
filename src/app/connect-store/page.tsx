'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/AppLayout'

export default function ConnectStorePage() {
  const router = useRouter()
  const [storeUrl, setStoreUrl] = useState('')
  const [consumerKey, setConsumerKey] = useState('')
  const [consumerSecret, setConsumerSecret] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data } = await supabase.from('stores').select('*').eq('user_id', user.id).single()
        if (data) { setStoreUrl(data.store_url); setConsumerKey(data.consumer_key); setConsumerSecret(data.consumer_secret) }
      }
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      let url = storeUrl.trim().toLowerCase()
      if (!url.startsWith('http')) url = 'https://' + url
      url = url.replace(/\/$/, '')

      const supabase = createClient()
      const { error } = await supabase.from('stores').upsert({
        user_id: userId, store_url: url,
        consumer_key: consumerKey.trim(),
        consumer_secret: consumerSecret.trim(),
        is_verified: true,
      }, { onConflict: 'user_id' })

      if (error) throw error
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save store credentials')
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div style={{ maxWidth: 600 }}>
        <div className="animate-fade-up">
          <div className="badge badge-green" style={{ marginBottom: 14 }}>Store Setup</div>
          <h1 style={{ fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', marginBottom: 8, color: 'var(--text-primary)' }}>Connect your WooCommerce store</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 36, lineHeight: 1.6 }}>
            VooltFlow needs your WooCommerce API credentials to publish products directly to your store.
          </p>
        </div>

        {/* How to get keys */}
        <div className="card animate-fade-up delay-100" style={{ padding: '20px 24px', marginBottom: 28, background: 'var(--green-light)', border: '1px solid var(--green-mid)' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--green-dark)', marginBottom: 10 }}>How to find your API keys</div>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'Go to your WordPress admin → WooCommerce → Settings → Advanced → REST API',
              'Click "Add key" and set permissions to Read/Write',
              'Copy the Consumer Key and Consumer Secret below',
            ].map((step, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--green-dark)', lineHeight: 1.5 }}>{step}</li>
            ))}
          </ol>
        </div>

        <form onSubmit={handleSave} className="card animate-fade-up delay-200" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Store URL</label>
              <input className="input" type="text" placeholder="https://yourstore.com" value={storeUrl} onChange={e => setStoreUrl(e.target.value)} required />
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 5 }}>Your WordPress site URL, e.g. https://store.voolt360.com</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Consumer Key</label>
              <input className="input mono" type="text" placeholder="ck_xxxxxxxxxxxxxxxxxxxx" value={consumerKey} onChange={e => setConsumerKey(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Consumer Secret</label>
              <input className="input mono" type="password" placeholder="cs_xxxxxxxxxxxxxxxxxxxx" value={consumerSecret} onChange={e => setConsumerSecret(e.target.value)} required />
            </div>

            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', fontSize: 14, color: '#dc2626' }}>{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '13px', fontSize: 15, borderRadius: 11 }}>
              {loading
                ? <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} />
                : <>Save & Connect Store</>}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
