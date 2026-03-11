'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppLayout from '@/components/AppLayout'
import type { Product } from '../products/page'

type PublishState = 'idle' | 'publishing' | 'success' | 'error'

function Stars({ rating }: { rating: string }) {
  const r = Math.round(parseFloat(rating) || 0)
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i <= r ? '#f59e0b' : '#e5e7eb'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span style={{ fontSize: 14, color: 'var(--text-secondary)', marginLeft: 5, fontWeight: 600 }}>
        {parseFloat(rating).toFixed(1)} / 5
      </span>
    </div>
  )
}

function ProductDetailContent() {
  const params = useSearchParams()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [storeUrl, setStoreUrl] = useState('')
  const [userId, setUserId] = useState('')
  const [publishState, setPublishState] = useState<PublishState>('idle')
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(0)
  const [copied, setCopied] = useState(false)

  const steps = [
    'Generating AI description with GPT-4o…',
    'Downloading product image…',
    'Uploading image to WordPress media…',
    'Creating WooCommerce listing…',
  ]

  useEffect(() => {
    const raw = params.get('data')
    if (!raw) { router.back(); return }
    try { setProduct(JSON.parse(decodeURIComponent(raw))) }
    catch { router.back() }

    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data: store } = await supabase.from('stores').select('store_url').eq('user_id', user.id).single()
      if (store) setStoreUrl(store.store_url)
    }
    load()
  }, [params, router])

  const handlePublish = async () => {
    if (!product) return
    setPublishState('publishing')
    setProgress(0)
    setStep(0)

    const ticker = setInterval(() => setProgress(p => p >= 100 ? 100 : p + 1), 90)
    const stepper = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 2200)

    try {
      const url = process.env.NEXT_PUBLIC_N8N_PUBLISHER_WEBHOOK
      if (url) {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_name: product.product_name,
            price: product.price,
            affiliate_link: product.affiliate_link || product.product_link,
            image_url: product.image_url,
            youtube_link: product.youtube_link,
            platform: product.platform,
            user_id: userId,
          }),
        })
      }
      if (product.id) {
        const supabase = createClient()
        await supabase.from('products').update({ published: true, published_at: new Date().toISOString() }).eq('id', product.id)
        setProduct(p => p ? { ...p, published: true } : p)
      }
      await new Promise(r => setTimeout(r, 9000))
      clearInterval(ticker)
      clearInterval(stepper)
      setProgress(100)
      setPublishState('success')
    } catch {
      clearInterval(ticker)
      clearInterval(stepper)
      setPublishState('error')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(product?.affiliate_link || product?.product_link || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const circ = 2 * Math.PI * 40

  if (!product) return (
    <AppLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />
      </div>
    </AppLayout>
  )

  const reviews = parseInt(product.reviews) || 0
  const reviewLabel = reviews >= 1000 ? `${(reviews/1000).toFixed(1)}K` : String(reviews)
  const affiliateUrl = product.affiliate_link || product.product_link || ''
  const hasVideo = product.youtube_link && product.youtube_link !== 'No video found'

  return (
    <AppLayout>
      <div style={{ maxWidth: 1060 }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'var(--text-muted)' }} className="animate-fade-up">
          <span style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }} onClick={() => router.push('/dashboard')}>Home</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          <span style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--text-secondary)' }} onClick={() => router.back()}>Products</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Review &amp; Publish</span>
        </div>

        {/* Page header */}
        <div className="animate-fade-up delay-100" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', marginBottom: 6, color: 'var(--text-primary)' }}>Review &amp; Publish</h1>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Review product details, check the viral reference, then publish to your store.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => router.back()} className="btn btn-outline" style={{ padding: '10px 18px', fontSize: 14, borderRadius: 10 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back
            </button>
            {product.published ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600, color: 'var(--green-dark)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Published
              </div>
            ) : (
              <button onClick={handlePublish} disabled={publishState === 'publishing'} className="btn btn-primary" style={{ padding: '10px 22px', fontSize: 14, borderRadius: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2m-4 4-4-4 4-4m0 4H9"/></svg>
                Publish to Store
              </button>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="animate-fade-up delay-200" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Product image */}
            <div className="card" style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '1/1', position: 'relative' }}>
              {product.image_url && product.image_url !== 'No Image' ? (
                <img src={product.image_url} alt={product.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-subtle)' }}>
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--border-mid)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
              )}
              <div className="badge badge-orange" style={{ position: 'absolute', top: 14, left: 14, fontSize: 11, backdropFilter: 'blur(8px)' }}>
                {product.platform}
              </div>
              <div style={{ position: 'absolute', top: 14, right: 14, background: 'var(--green)', color: '#fff', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
                HIGH POTENTIAL
              </div>
            </div>

            {/* YouTube viral reference */}
            <div className="card" style={{ padding: '20px', borderRadius: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.3 2.8 12 2.8 12 2.8s-4.3 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 21.6 12 21.6 12 21.6s4.3 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Viral Reference · YouTube Short</span>
              </div>

              {hasVideo ? (
                <>
                  <a href={product.youtube_link} target="_blank" rel="noopener noreferrer"
                    className="card"
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px', borderRadius: 12, textDecoration: 'none', transition: 'all 0.2s', marginBottom: 12 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ef4444'; (e.currentTarget as HTMLElement).style.background = '#fff5f5' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)' }}
                  >
                    <div style={{ width: 44, height: 44, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>
                        {product.video_title || 'Watch YouTube Short'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click to open in YouTube</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
                  </a>
                  {product.video_context && (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, fontStyle: 'italic' }}>
                      &ldquo;{product.video_context.slice(0, 140)}{product.video_context.length > 140 ? '…' : ''}&rdquo;
                    </p>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 14 }}>
                  No viral reference found for this product
                </div>
              )}
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="card" style={{ padding: '16px', textAlign: 'center', borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Reviews</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{reviewLabel}</div>
              </div>
              <div className="card" style={{ padding: '16px', textAlign: 'center', borderRadius: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Rating</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--green-dark)', letterSpacing: '-0.02em' }}>{parseFloat(product.rating).toFixed(1)}/5</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Price & Name */}
            <div className="card" style={{ padding: '28px', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 900, fontSize: 40, color: 'var(--green-dark)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {product.price}
                </span>
                <Stars rating={product.rating} />
              </div>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                {product.product_name}
              </h2>
            </div>

            {/* AI description notice */}
            <div className="card" style={{ padding: '24px', borderRadius: 16, background: 'var(--green-light)', border: '1px solid var(--green-mid)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, background: 'var(--green)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-dark)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI-Generated Optimized Description</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--green-dark)', lineHeight: 1.65, marginBottom: 14, opacity: 0.85 }}>
                When you publish, GPT-4o automatically writes a punchy, SEO-optimised WooCommerce description in HTML — tailored for conversion and viral reach on TikTok and YouTube Shorts.
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['SEO Optimised', 'HTML Formatted', 'Conversion Focused', 'Viral-Ready'].map(t => (
                  <span key={t} style={{ background: 'rgba(22,198,90,0.15)', border: '1px solid rgba(22,198,90,0.3)', borderRadius: 100, padding: '3px 11px', fontSize: 11, fontWeight: 700, color: 'var(--green-dark)' }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Affiliate link */}
            <div className="card" style={{ padding: '24px', borderRadius: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Source Affiliate Link</div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-subtle)', border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ padding: '0 14px', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </div>
                <input readOnly value={affiliateUrl} className="mono"
                  style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '12px 0', fontSize: 12, color: 'var(--text-secondary)', minWidth: 0 }} />
                <button onClick={handleCopy}
                  style={{ background: copied ? 'var(--green)' : 'var(--bg)', border: 'none', borderLeft: '1px solid var(--border)', padding: '12px 20px', fontSize: 12, fontWeight: 700, color: copied ? '#fff' : 'var(--green-dark)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s', flexShrink: 0 }}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <a href={affiliateUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 13, color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
              >
                Open source product page
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
              </a>
            </div>

            {/* Publish CTA block */}
            {!product.published && (
              <div style={{ background: 'var(--text-primary)', borderRadius: 16, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 4 }}>Ready to go live?</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                    Publishing to: <span style={{ color: 'var(--green)', fontWeight: 600 }}>{storeUrl || 'your store'}</span>
                  </div>
                </div>
                <button onClick={handlePublish} disabled={publishState === 'publishing'} className="btn"
                  style={{ background: 'var(--green)', color: '#fff', padding: '13px 28px', fontSize: 15, borderRadius: 11, fontWeight: 700, boxShadow: '0 4px 20px rgba(22,198,90,0.4)', flexShrink: 0, opacity: publishState === 'publishing' ? 0.7 : 1 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2m-4 4-4-4 4-4m0 4H9"/></svg>
                  Publish to Store
                </button>
              </div>
            )}

            {publishState === 'error' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#dc2626' }}>Publishing failed. Check your WooCommerce credentials in Store Settings.</span>
                <button onClick={handlePublish} style={{ background: '#ef4444', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Retry</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── PUBLISHING OVERLAY ── */}
      {(publishState === 'publishing' || publishState === 'success') && (
        <div className="overlay">
          <div className="card animate-scale-in" style={{ width: '100%', maxWidth: 460, padding: '44px', textAlign: 'center' }}>

            {publishState === 'publishing' && <>
              <h2 style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em', marginBottom: 6 }}>Publishing to WooCommerce</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Your n8n workflow is handling this automatically…</p>
              <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 32px' }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="5"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--green)" strokeWidth="5"
                    strokeDasharray={circ} strokeDashoffset={circ - (progress/100)*circ}
                    strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px', transition: 'stroke-dashoffset 0.1s linear' }}/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                  {Math.round(progress)}%
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {steps.map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, background: i === step ? 'var(--green-light)' : 'transparent', border: `1px solid ${i === step ? 'var(--green-mid)' : 'transparent'}`, transition: 'all 0.25s', textAlign: 'left' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < step ? 'var(--green)' : i === step ? 'var(--green-light)' : 'var(--border)' }}>
                      {i < step
                        ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        : i === step
                        ? <div className="animate-spin" style={{ width: 9, height: 9, border: '1.5px solid var(--green-mid)', borderTopColor: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />
                        : null}
                    </div>
                    <span style={{ fontSize: 13, color: i <= step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
                  </div>
                ))}
              </div>
            </>}

            {publishState === 'success' && <>
              <div style={{ width: 64, height: 64, background: 'var(--green-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 10 }}>Published! 🎉</h2>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
                <strong>{product.product_name.slice(0, 60)}</strong> is now live on <span style={{ color: 'var(--green-dark)' }}>{storeUrl}</span>
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => router.push('/products')} className="btn btn-outline" style={{ flex: 1, padding: '13px', justifyContent: 'center' }}>Find More</button>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '13px', justifyContent: 'center', textDecoration: 'none' }}>View Store</a>
              </div>
            </>}
          </div>
        </div>
      )}
    </AppLayout>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <AppLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div className="animate-spin" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />
        </div>
      </AppLayout>
    }>
      <ProductDetailContent />
    </Suspense>
  )
}
