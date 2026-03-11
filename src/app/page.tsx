'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const NAV_LINKS = ['Features', 'Pricing', 'About']

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    ),
    title: 'AI Product Discovery',
    desc: 'Our engine scans Amazon, Jumia, and Konga simultaneously — filtering by rating, reviews, and price to surface only high-potential products.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>
      </svg>
    ),
    title: 'Affiliate Link Generation',
    desc: 'Automatically builds proper affiliate URLs with your Amazon tag and platform IDs — every product ready to earn the moment it goes live.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>
      </svg>
    ),
    title: 'Viral Video Matching',
    desc: 'For each product discovered, VooltFlow finds a real YouTube Short proving the product is already trending — so you know what converts.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    title: 'One-Click WooCommerce Publishing',
    desc: 'Review the product, hit publish. VooltFlow downloads the image, writes the description, and creates the listing on your store automatically.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    title: 'AI-Written Descriptions',
    desc: 'GPT-4o writes punchy, conversion-optimised WooCommerce descriptions for every product — formatted in HTML, ready to publish.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Quality Filtering',
    desc: 'Only products with ≥4.0 stars, ≥20 reviews, and the right price range make it through — no junk, no guesswork.',
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mo',
    desc: 'Perfect for getting started',
    cta: 'Start Free Trial',
    features: ['50 products / month', 'Basic AI discovery', 'Amazon affiliate links', 'Email support'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/mo',
    desc: 'Most popular for serious stores',
    cta: 'Get Started Now',
    features: ['500 products / month', 'All 3 marketplaces', 'YouTube viral matching', 'Priority support', 'Custom affiliate IDs'],
    highlight: true,
  },
  {
    name: 'Empire',
    price: '$199',
    period: '/mo',
    desc: 'For scaling affiliate empires',
    cta: 'Contact Sales',
    features: ['Unlimited products', 'Full API access', 'Multiple stores', 'Dedicated account manager', 'Custom workflows'],
    highlight: false,
  },
]

const STATS = [
  { value: '2,400+', label: 'Store owners' },
  { value: '180K+', label: 'Products published' },
  { value: '3 sec', label: 'Avg. discovery time' },
  { value: '94%', label: 'Quality pass rate' },
]

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="page-wrapper" style={{ background: '#fff', overflowX: 'hidden' }}>

      {/* ─── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '0 48px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, background: 'var(--green)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>VooltFlow</span>
          </div>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="hidden-mobile">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', transition: 'color 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{link}</a>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/login" className="btn btn-ghost" style={{ fontSize: 14 }}>Log in</Link>
            <Link href="/signup" className="btn btn-primary" style={{ fontSize: 14, padding: '9px 20px' }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 140, paddingBottom: 100, paddingLeft: 48, paddingRight: 48, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle green radial glow behind text */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse at center, rgba(22,198,90,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative' }}>
          {/* Pill badge */}
          <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--green-light)', border: '1px solid var(--green-mid)', borderRadius: 100, padding: '6px 14px', marginBottom: 28, fontSize: 12, fontWeight: 700, color: 'var(--green-dark)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <div className="status-dot" style={{ width: 6, height: 6 }} />
            AI-Powered Affiliate Automation
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100" style={{ fontWeight: 900, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.06, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 24 }}>
            Automate Your
            <br />
            <span style={{ color: 'var(--green)', position: 'relative' }}>
              Affiliate Empire
              {/* Underline decoration */}
              <svg style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 8 }} viewBox="0 0 400 8" fill="none" preserveAspectRatio="none">
                <path d="M0 7 Q100 1 200 5 Q300 9 400 3" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
              </svg>
            </span>
          </h1>

          <p className="animate-fade-up delay-200" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
            VooltFlow discovers high-conversion affiliate products across Amazon, Jumia, and Konga — then publishes them to your WooCommerce store with AI-written copy, in seconds.
          </p>

          {/* CTA row */}
          <div className="animate-fade-up delay-300" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 56 }}>
            <Link href="/signup" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 12 }}>
              Start for Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <a href="#features" className="btn btn-outline" style={{ fontSize: 16, padding: '13px 28px', borderRadius: 12 }}>
              See How It Works
            </a>
          </div>

          {/* Social proof */}
          <div className="animate-fade-up delay-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-muted)', fontSize: 13 }}>
            <div style={{ display: 'flex' }}>
              {['#22c55e','#16a34a','#15803d','#166534'].map((c, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{String.fromCharCode(65+i)}</span>
                </div>
              ))}
            </div>
            <span>Trusted by <strong style={{ color: 'var(--text-primary)', fontWeight: 700 }}>2,400+</strong> store owners</span>
          </div>
        </div>

        {/* ─── Dashboard preview card ─── */}
        <div className="animate-fade-up delay-500" style={{ maxWidth: 900, margin: '72px auto 0', position: 'relative' }}>
          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 20, padding: '20px', boxShadow: '0 24px 80px rgba(0,0,0,0.10)' }}>
            {/* Window chrome */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
              <div style={{ flex: 1, background: 'var(--border)', borderRadius: 6, height: 28, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                app.vooltflow.com/products
              </div>
            </div>
            {/* Mock dashboard content */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '20px' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--text-primary)', marginBottom: 3 }}>Results for: <span style={{ color: 'var(--green)' }}>Tech</span></div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>AI found 29 high-potential products</div>
                </div>
                <div className="btn btn-primary" style={{ fontSize: 13, padding: '9px 18px', pointerEvents: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Refresh Engine
                </div>
              </div>
              {/* Mock product grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {[
                  { name: 'Amazon Fire TV Stick 4K', price: '$39.99', rating: '4.8', platform: 'Amazon', color: '#fff7ed' },
                  { name: 'Echo Dot Smart Speaker', price: '$49.99', rating: '4.9', platform: 'Amazon', color: '#f0fdf4' },
                  { name: 'Samsung 27" Monitor', price: '$59.99', rating: '4.7', platform: 'Amazon', color: '#fff7ed' },
                  { name: 'Logitech MX Master 3S', price: '$79.99', rating: '4.8', platform: 'Amazon', color: '#f0fdf4' },
                ].map((p, i) => (
                  <div key={i} className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: 10 }}>
                    <div style={{ height: 100, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <div style={{ fontSize: 32 }}>📦</div>
                      <div className="badge badge-orange" style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, padding: '2px 7px' }}>{p.platform}</div>
                    </div>
                    <div style={{ padding: '10px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--green)', marginBottom: 6 }}>{p.price}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>⭐ {p.rating} · 9.2K reviews</div>
                      <div style={{ width: '100%', background: 'var(--green)', borderRadius: 7, padding: '7px', fontSize: 11, fontWeight: 700, color: '#fff', textAlign: 'center' }}>Publish to Store</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="animate-float" style={{ position: 'absolute', top: 30, right: -20, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', boxShadow: 'var(--shadow-md)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>⚡</span> Published in 3 seconds
          </div>
          <div className="animate-float delay-300" style={{ position: 'absolute', bottom: 40, left: -20, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', boxShadow: 'var(--shadow-md)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="status-dot" />
            <span>29 products found</span>
          </div>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '64px 48px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0 24px', borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontWeight: 900, fontSize: 36, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge badge-green" style={{ marginBottom: 16, fontSize: 12 }}>How It Works</div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(30px, 4vw, 48px)', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>Everything you need to<br />run on autopilot</h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>From discovery to published listing in under a minute. No manual work required.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <div style={{ width: 46, height: 46, background: 'var(--green-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-dark)', marginBottom: 18 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─────────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: '100px 48px', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge badge-green" style={{ marginBottom: 16 }}>Pricing</div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(30px, 4vw, 48px)', letterSpacing: '-0.03em', marginBottom: 12 }}>Choose your growth plan</h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Start free. Scale as you grow. No hidden fees.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch' }}>
            {PLANS.map((plan, i) => (
              <div key={i} style={{
                background: plan.highlight ? 'var(--text-primary)' : 'var(--bg)',
                border: plan.highlight ? 'none' : '1.5px solid var(--border)',
                borderRadius: 18, padding: '32px',
                color: plan.highlight ? '#fff' : 'var(--text-primary)',
                boxShadow: plan.highlight ? '0 20px 60px rgba(13,31,20,0.20)' : 'none',
                position: 'relative', display: 'flex', flexDirection: 'column',
              }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--green)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '5px 14px', borderRadius: 100, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Most Popular
                  </div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, opacity: plan.highlight ? 0.7 : 1, color: plan.highlight ? '#fff' : 'var(--text-secondary)' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontWeight: 900, fontSize: 44, letterSpacing: '-0.04em' }}>{plan.price}</span>
                    <span style={{ fontSize: 15, opacity: 0.6 }}>{plan.period}</span>
                  </div>
                  <div style={{ fontSize: 14, opacity: plan.highlight ? 0.65 : 0.7 }}>{plan.desc}</div>
                </div>

                <Link href="/signup" style={{
                  display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10,
                  background: plan.highlight ? 'var(--green)' : 'var(--text-primary)',
                  color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 28,
                  transition: 'opacity 0.15s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                >{plan.cta}</Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.highlight ? 'var(--green)' : 'var(--green)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                      <span style={{ opacity: plan.highlight ? 0.85 : 1 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 48px', textAlign: 'center', background: 'var(--green)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.03em', color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>
            Ready to automate your affiliate store?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 40 }}>
            Join thousands of store owners using VooltFlow to scale their affiliate income on autopilot.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: 'var(--green-dark)', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 16, textDecoration: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
              Get Started Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: '#fff', padding: '13px 28px', borderRadius: 12, fontWeight: 600, fontSize: 16, textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)' }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.55)', padding: '56px 48px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, background: 'var(--green)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>VooltFlow</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>The world&apos;s most advanced AI automation platform for WooCommerce affiliate stores.</p>
            </div>
            {[
              { title: 'Product', links: ['AI Discovery', 'Auto-Publish', 'Pricing', 'Changelog'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                    >{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13 }}>© 2025 VooltFlow Inc. All rights reserved.</span>
            <span style={{ fontSize: 13 }}>Built for affiliate entrepreneurs 🚀</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
