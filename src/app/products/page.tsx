'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/AppLayout'

// ─── TYPES ─────────────────────────────────────────────────────────────────
export type Product = {
  id?: string
  platform: string
  product_name: string
  price: string
  product_link: string        // raw Google Shopping link
  affiliate_link: string      // built by Affiliate Generator node
  image_url: string
  rating: string
  reviews: string
  youtube_link: string        // from YouTube Search node
  video_title?: string        // from Parse YouTube Data node
  video_context?: string      // from Parse YouTube Data node
  published?: boolean
  created_at?: string
}

type PublishState = 'idle' | 'confirming' | 'publishing' | 'success' | 'error'

// ─── STAR RATING ───────────────────────────────────────────────────────────
function Stars({ rating, size = 13 }: { rating: string; size?: number }) {
  const r = Math.round(parseFloat(rating) || 0)
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= r ? '#f59e0b' : '#e5e7eb'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span style={{ fontSize: size - 2, color: 'var(--text-muted)', marginLeft: 4, fontWeight: 500 }}>{parseFloat(rating).toFixed(1)}</span>
    </div>
  )
}

// ─── PRODUCT CARD ──────────────────────────────────────────────────────────
function ProductCard({ product, onPublish, onSkip }: { product: Product; onPublish: () => void; onSkip: () => void }) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  const goToDetail = () => {
    const encoded = encodeURIComponent(JSON.stringify(product))
    router.push(`/product?data=${encoded}`)
  }

  const reviews = parseInt(product.reviews) || 0
  const reviewLabel = reviews >= 1000 ? `${(reviews/1000).toFixed(1)}K` : String(reviews)

  return (
    <div
      className="card card-interactive"
      style={{ borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 190, overflow: 'hidden', background: 'var(--bg-subtle)' }}>
        {product.image_url && product.image_url !== 'No Image' ? (
          <img
            src={product.image_url} alt={product.product_name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.4s ease' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border-mid)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
        )}

        {/* Platform badge */}
        <div className="badge badge-orange" style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, letterSpacing: '0.05em', backdropFilter: 'blur(8px)' }}>
          {product.platform}
        </div>

        {/* YouTube indicator */}
        {product.youtube_link && product.youtube_link !== 'No video found' && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.65)', borderRadius: 6, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(8px)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#ff4444"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.3 2.8 12 2.8 12 2.8s-4.3 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 21.6 12 21.6 12 21.6s4.3 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg>
            <span style={{ color: '#fff', fontSize: 10, fontWeight: 600 }}>Viral Short</span>
          </div>
        )}

        {product.published && (
          <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'var(--green)', borderRadius: 6, padding: '3px 9px', fontSize: 10, fontWeight: 700, color: '#fff' }}>
            ✓ Published
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.35, marginBottom: 10, minHeight: 38, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.product_name}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--green-dark)', letterSpacing: '-0.02em' }}>{product.price}</span>
          <Stars rating={product.rating} />
        </div>

        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{reviewLabel} reviews</div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, marginTop: 'auto' }}>
          <button onClick={goToDetail}
            className="btn btn-outline"
            style={{ flex: 1, padding: '9px 12px', fontSize: 13, borderRadius: 9, justifyContent: 'center' }}
          >
            View Details
          </button>
          <button onClick={onSkip}
            className="btn btn-ghost"
            style={{ padding: '9px 14px', fontSize: 13, borderRadius: 9, color: 'var(--text-muted)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.background = '#fef2f2' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            Skip
          </button>
        </div>

        {!product.published && (
          <button onClick={onPublish} className="btn btn-primary"
            style={{ width: '100%', padding: '11px', fontSize: 14, borderRadius: 9, justifyContent: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2m-4 4-4-4 4-4m0 4H9"/></svg>
            Publish to Store
          </button>
        )}
      </div>
    </div>
  )
}

// ─── PUBLISH MODAL ─────────────────────────────────────────────────────────
function PublishModal({ product, state, storeUrl, onConfirm, onCancel }: {
  product: Product; state: PublishState; storeUrl: string; onConfirm: () => void; onCancel: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0)
  const steps = ['Generating AI description…', 'Downloading product image…', 'Uploading to WordPress media…', 'Creating WooCommerce listing…']

  useEffect(() => {
    if (state !== 'publishing') { setProgress(0); setStep(0); return }
    const p = setInterval(() => setProgress(v => v >= 100 ? 100 : v + 1.2), 80)
    const s = setInterval(() => setStep(v => Math.min(v + 1, steps.length - 1)), 2200)
    return () => { clearInterval(p); clearInterval(s) }
  }, [state])

  const circ = 2 * Math.PI * 40

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget && state === 'confirming') onCancel() }}>
      <div className="card animate-scale-in" style={{ width: '100%', maxWidth: 460, padding: '40px', textAlign: 'center' }}>

        {state === 'confirming' && <>
          <div style={{ width: 56, height: 56, background: 'var(--green-light)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--green-dark)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2m-4 4-4-4 4-4m0 4H9"/></svg>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', marginBottom: 10 }}>Publish to WooCommerce?</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{product.product_name.slice(0, 60)}{product.product_name.length > 60 ? '…' : ''}</strong>
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>
            Will be published to <strong style={{ color: 'var(--text-primary)' }}>{storeUrl || 'your store'}</strong> with an AI-generated description.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onCancel} className="btn btn-outline" style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>Cancel</button>
            <button onClick={onConfirm} className="btn btn-primary" style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>Publish Now</button>
          </div>
        </>}

        {state === 'publishing' && <>
          <h2 style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', marginBottom: 6 }}>Publishing…</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>Your product is being set up in WooCommerce</p>
          <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 28px' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e8ede9" strokeWidth="6"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--green)" strokeWidth="6"
                strokeDasharray={circ} strokeDashoffset={circ - (progress/100)*circ}
                strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', transition: 'stroke-dashoffset 0.1s linear' }}/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {Math.round(progress)}%
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: i === step ? 'var(--green-light)' : 'transparent', border: `1px solid ${i === step ? 'var(--green-mid)' : 'transparent'}`, transition: 'all 0.25s', textAlign: 'left' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: i < step ? 'var(--green)' : i === step ? 'var(--green-light)' : 'var(--border)', border: i === step ? '2px solid var(--green-mid)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i < step
                    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    : i === step
                    ? <div className="animate-spin" style={{ width: 8, height: 8, border: '1.5px solid var(--green-mid)', borderTopColor: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />
                    : null}
                </div>
                <span style={{ fontSize: 13, color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
              </div>
            ))}
          </div>
        </>}

        {state === 'success' && <>
          <div style={{ width: 60, height: 60, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Published! 🎉</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
            <strong>{product.product_name.slice(0, 60)}</strong> is now live on your WooCommerce store.
          </p>
          <button onClick={onCancel} className="btn btn-primary" style={{ width: '100%', padding: '13px', justifyContent: 'center' }}>Done</button>
        </>}

        {state === 'error' && <>
          <div style={{ width: 60, height: 60, background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Publishing Failed</h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Check your WooCommerce credentials in Store Settings.</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onCancel} className="btn btn-outline" style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>Cancel</button>
            <button onClick={onConfirm} className="btn btn-primary" style={{ flex: 1, padding: '12px', justifyContent: 'center' }}>Retry</button>
          </div>
        </>}
      </div>
    </div>
  )
}

// ─── SKELETON ──────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="card" style={{ borderRadius: 14, overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 190 }} />
      <div style={{ padding: 16 }}>
        <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 16 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="skeleton" style={{ height: 20, width: 70 }} />
          <div className="skeleton" style={{ height: 14, width: 80 }} />
        </div>
        <div className="skeleton" style={{ height: 36, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 40 }} />
      </div>
    </div>
  )
}

// ─── MAIN CONTENT ──────────────────────────────────────────────────────────
function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const niche = searchParams.get('niche') || ''

  const [phase, setPhase] = useState<'loading' | 'discovering' | 'results'>('loading')
  const [products, setProducts] = useState<Product[]>([])
  const [skipped, setSkipped] = useState<Set<string>>(new Set())
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [publishState, setPublishState] = useState<PublishState>('idle')
  const [storeUrl, setStoreUrl] = useState('')
  const [userId, setUserId] = useState('')
  const [searchInput, setSearchInput] = useState(niche)
  const [discoveryPct, setDiscoveryPct] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data: store } = await supabase.from('stores').select('store_url').eq('user_id', user.id).single()
      if (store) setStoreUrl(store.store_url)

      if (niche) {
        runDiscovery(niche, user.id)
      } else {
        // Load recent products from DB
        const { data } = await supabase.from('products').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30)
        setProducts(data || [])
        setPhase('results')
      }
    }
    init()
  }, [niche])

  const runDiscovery = async (query: string, uid: string) => {
    setPhase('discovering')
    setDiscoveryPct(0)
    setError('')

    const ticker = setInterval(() => setDiscoveryPct(p => p >= 88 ? 88 : p + Math.random() * 4), 350)

    try {
      const url = process.env.NEXT_PUBLIC_N8N_DISCOVERY_WEBHOOK
      if (!url) throw new Error('Discovery webhook not configured')

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: query, user_id: uid }),
      })

      if (!res.ok) throw new Error(`Webhook error ${res.status}`)
      const raw = await res.json()

      // The webhook returns an array of products directly (Respond to Webhook → all incoming items)
      const list: Product[] = Array.isArray(raw) ? raw : raw.products || []

      clearInterval(ticker)
      setDiscoveryPct(100)

      // Save to Supabase
      const supabase = createClient()
      if (list.length > 0) {
        const rows = list.map(p => ({
          user_id: uid,
          platform: p.platform || 'Amazon',
          product_name: p.product_name || '',
          price: p.price || '',
          product_link: p.product_link || '',
          affiliate_link: p.affiliate_link || p.product_link || '',
          image_url: p.image_url || '',
          rating: String(p.rating || '0'),
          reviews: String(p.reviews || '0'),
          youtube_link: p.youtube_link || '',
          video_title: p.video_title || '',
          video_context: p.video_context || '',
          published: false,
        }))
        await supabase.from('products').insert(rows).select()
      }

      setTimeout(() => { setProducts(list); setPhase('results') }, 400)
    } catch (err) {
      clearInterval(ticker)
      setDiscoveryPct(100)
      setError(err instanceof Error ? err.message : 'Discovery failed')
      // Fall back to DB products
      const supabase = createClient()
      const { data } = await supabase.from('products').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(30)
      setTimeout(() => { setProducts(data || []); setPhase('results') }, 400)
    }
  }

  const handlePublish = async () => {
    if (!selectedProduct) return
    setPublishState('publishing')
    try {
      const url = process.env.NEXT_PUBLIC_N8N_PUBLISHER_WEBHOOK
      if (url) {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_name: selectedProduct.product_name,
            price: selectedProduct.price,
            affiliate_link: selectedProduct.affiliate_link || selectedProduct.product_link,
            image_url: selectedProduct.image_url,
            youtube_link: selectedProduct.youtube_link,
            platform: selectedProduct.platform,
            user_id: userId,
          }),
        })
      }
      // Mark published in DB
      if (selectedProduct.id) {
        const supabase = createClient()
        await supabase.from('products').update({ published: true, published_at: new Date().toISOString() }).eq('id', selectedProduct.id)
        setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, published: true } : p))
      }
      await new Promise(r => setTimeout(r, 8000))
      setPublishState('success')
    } catch {
      setPublishState('error')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return
    router.push(`/products?niche=${encodeURIComponent(searchInput.trim())}`)
  }

  const visible = products.filter(p => !skipped.has(p.id || p.product_name))

  return (
    <AppLayout>
      <div style={{ maxWidth: 1100 }}>

        {/* ── DISCOVERING ── */}
        {phase === 'discovering' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 32 }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" strokeWidth="5"/>
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--green)" strokeWidth="5"
                  strokeDasharray={2*Math.PI*48} strokeDashoffset={(2*Math.PI*48) - (discoveryPct/100)*(2*Math.PI*48)}
                  strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dashoffset 0.35s ease' }}/>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{Math.round(discoveryPct)}%</span>
              </div>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.03em', marginBottom: 10, color: 'var(--text-primary)' }}>
              Scanning marketplaces for <span style={{ color: 'var(--green)' }}>{niche}</span>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.6 }}>
              Searching Amazon, Jumia, and Konga simultaneously. Filtering by quality score, finding viral YouTube references…
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
              {['Amazon', 'Jumia', 'Konga'].map((m, i) => (
                <div key={m} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 600, color: discoveryPct > (i+1)*25 ? 'var(--green-dark)' : 'var(--text-muted)', transition: 'color 0.3s' }}>
                  {discoveryPct > (i+1)*25 ? '✓ ' : ''}{m}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {phase === 'results' && (
          <div className="animate-fade-in">
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ cursor: 'pointer', fontWeight: 500 }} onClick={() => router.push('/dashboard')}>Home</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                <span>Discovery</span>
                {niche && <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{niche}</span>
                </>}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <h1 style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', marginBottom: 4, color: 'var(--text-primary)' }}>
                    {niche ? <>Results for: <span style={{ color: 'var(--green)' }}>{niche}</span></> : 'Your Products'}
                  </h1>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    {visible.length > 0 ? `${visible.length} high-potential products found` : 'No products yet'}
                  </p>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 28, alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg style={{ position: 'absolute', left: 14, color: 'var(--text-muted)', flexShrink: 0 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input className="input" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search a new niche..." style={{ paddingLeft: 40 }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '11px 22px', flexShrink: 0, borderRadius: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Refresh Engine
              </button>
            </form>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '14px 18px', fontSize: 14, color: '#dc2626', marginBottom: 20 }}>
                {error} — Showing previously discovered products instead.
              </div>
            )}

            {visible.length === 0 ? (
              <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 10 }}>No products here yet</h3>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24 }}>
                  {niche ? `Try a different niche or check your n8n webhook configuration.` : 'Search for a niche on the Dashboard to discover products.'}
                </p>
                <button onClick={() => router.push('/dashboard')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
                {visible.map((product, i) => (
                  <ProductCard
                    key={product.id || product.product_name + i}
                    product={product}
                    onPublish={() => { setSelectedProduct(product); setPublishState('confirming') }}
                    onSkip={() => setSkipped(prev => new Set([...prev, product.id || product.product_name]))}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── LOADING SKELETONS ── */}
        {phase === 'loading' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {/* ── PUBLISH MODAL ── */}
        {selectedProduct && publishState !== 'idle' && (
          <PublishModal
            product={selectedProduct}
            state={publishState}
            storeUrl={storeUrl}
            onConfirm={handlePublish}
            onCancel={() => { setPublishState('idle'); setSelectedProduct(null) }}
          />
        )}
      </div>
    </AppLayout>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20, maxWidth: 1100 }}>
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </AppLayout>
    }>
      <ProductsContent />
    </Suspense>
  )
}
