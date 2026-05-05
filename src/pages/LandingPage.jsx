import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  MessageCircle,
  Globe,
  Clock,
  IndianRupee,
  ChevronDown,
  Check,
  Shield,
  Users,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import './LandingPage.css'

const STATS = [
  { icon: Globe, key: 'stat_languages' },
  { icon: Clock, key: 'stat_setup' },
  { icon: Users, key: 'stat_msmes' },
  { icon: IndianRupee, key: 'stat_cost' },
]

const STEPS = [
  { num: '01', titleKey: 'step1_title', descKey: 'step1_desc' },
  { num: '02', titleKey: 'step2_title', descKey: 'step2_desc' },
  { num: '03', titleKey: 'step3_title', descKey: 'step3_desc' },
  { num: '04', titleKey: 'step4_title', descKey: 'step4_desc' },
]

const BUSINESSES = [
  { key: 'kirana', descKey: 'kirana_desc' },
  { key: 'clinic', descKey: 'clinic_desc' },
  { key: 'coaching', descKey: 'coaching_desc' },
]

const TIERS = [
  {
    nameKey: 'starter',
    price: '₹0',
    conversations: '100',
    langs: '2',
    features: ['feature_dashboard_lite'],
    highlight: false,
  },
  {
    nameKey: 'basic',
    price: '₹299',
    conversations: '1,000',
    langs: '4',
    features: ['feature_dashboard_lite'],
    highlight: false,
  },
  {
    nameKey: 'pro',
    price: '₹999',
    conversations: '10,000',
    langs: '22',
    features: ['feature_dashboard_full', 'feature_crm'],
    highlight: true,
  },
  {
    nameKey: 'enterprise',
    price: '₹5,000+',
    conversations: 'Unlimited',
    langs: '22',
    features: ['feature_dashboard_full', 'feature_crm', 'feature_voice', 'feature_sla'],
    highlight: false,
  },
]

export default function LandingPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visibleSections, setVisibleSections] = useState(new Set())

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const isVisible = (id) => visibleSections.has(id)

  return (
    <div className="landing">
      <div className="mesh-background" />

      {/* Navigation */}
      <header className={`landing-nav ${scrolled ? 'landing-nav--scrolled glass-panel' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-nav-logo">
            <span className="landing-nav-brand gradient-text">DeployBridge</span>
          </div>

          <div className="landing-nav-actions">
            <div className="lang-toggle-landing">
              <button
                className="lang-toggle-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-expanded={langMenuOpen}
              >
                <Globe size={16} />
                <span>{i18n.language === 'hi' ? 'हिन्दी' : 'EN'}</span>
                <ChevronDown size={14} />
              </button>
              {langMenuOpen && (
                <div className="lang-dropdown-landing glass-panel">
                  <button onClick={() => { i18n.changeLanguage('en'); setLangMenuOpen(false) }}>English</button>
                  <button onClick={() => { i18n.changeLanguage('hi'); setLangMenuOpen(false) }}>हिन्दी</button>
                </div>
              )}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/setup')}
            >
              {t('landing.cta_start')}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Business, <br />
            Every Language
          </h1>
          <p className="hero-subtitle">{t('landing.hero_subtitle')}</p>

          <div className="hero-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/setup')}
            >
              {t('landing.cta_start')}
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/dashboard')}
            >
              {t('landing.cta_demo')}
            </button>
          </div>

          <div className="hero-stats glass-panel">
            {STATS.map(({ icon: Icon, key }) => (
              <div className="hero-stat" key={key}>
                <div className="stat-icon-wrap">
                  <Icon size={18} />
                </div>
                <span>{t(`landing.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Minimalist Graphic (Replacing Phone) */}
        <div className="hero-graphic">
          <img src="/hero-graphic.png" alt="DeployBridge AI" className="hero-image" />
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-how" id="how-it-works" data-animate>
        <div className={`section-inner ${isVisible('how-it-works') ? 'animate-in' : ''}`}>
          <div className="section-header-center">
            <h2 className="section-title gradient-text">{t('landing.how_it_works')}</h2>
          </div>

          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div
                className="step-card glass-panel"
                key={step.num}
                style={{ '--delay': `${i * 100}ms` }}
              >
                <div className="step-num-wrap">
                  <span className="step-num gradient-text">{step.num}</span>
                </div>
                <h3 className="step-title">{t(`landing.${step.titleKey}`)}</h3>
                <p className="step-desc">{t(`landing.${step.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section className="section section-businesses" id="businesses" data-animate>
        <div className={`section-inner ${isVisible('businesses') ? 'animate-in' : ''}`}>
          <div className="section-header-center">
            <h2 className="section-title gradient-text">{t('landing.business_types')}</h2>
          </div>

          <div className="business-grid">
            {BUSINESSES.map((biz, i) => (
              <div
                className="business-card glass-panel"
                key={biz.key}
                style={{ '--delay': `${i * 100}ms` }}
              >
                <h3 className="business-name">{t(`landing.${biz.key}`)}</h3>
                <p className="business-desc">{t(`landing.${biz.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section section-pricing" id="pricing" data-animate>
        <div className={`section-inner ${isVisible('pricing') ? 'animate-in' : ''}`}>
          <div className="pricing-header section-header-center">
            <h2 className="section-title gradient-text">{t('landing.pricing_title')}</h2>
            <p className="section-subtitle">{t('landing.pricing_subtitle')}</p>
          </div>

          <div className="pricing-grid">
            {TIERS.map((tier, i) => (
              <div
                className={`pricing-card glass-panel ${tier.highlight ? 'pricing-card--popular' : ''}`}
                key={tier.nameKey}
                style={{ '--delay': `${i * 100}ms` }}
              >
                {tier.highlight && (
                  <div className="pricing-badge">
                    <span className="pricing-badge-text">{t('pricing.popular')}</span>
                  </div>
                )}
                <h3 className="pricing-name">{t(`pricing.${tier.nameKey}`)}</h3>
                <div className="pricing-price">
                  <span className="pricing-amount">{tier.price}</span>
                  {tier.price !== '₹0' && (
                    <span className="pricing-period">{t('pricing.per_month')}</span>
                  )}
                </div>
                <div className="pricing-details">
                  <div className="pricing-detail">
                    <MessageCircle size={16} className="detail-icon" />
                    <span>{tier.conversations} {t('pricing.conversations_mo')}</span>
                  </div>
                  <div className="pricing-detail">
                    <Globe size={16} className="detail-icon" />
                    <span>{tier.langs} {t('pricing.languages')}</span>
                  </div>
                  {tier.features.map((f) => (
                    <div className="pricing-detail" key={f}>
                      <Check size={16} className="detail-icon detail-icon--check" />
                      <span>{t(`pricing.${f}`)}</span>
                    </div>
                  ))}
                </div>
                <button
                  className={`btn ${tier.highlight ? 'btn-primary' : 'btn-secondary'} pricing-cta`}
                  onClick={() => navigate('/setup')}
                >
                  {tier.price === '₹0' ? t('landing.cta_start') : t('pricing.upgrade')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section section-cta-banner" id="cta-banner" data-animate>
        <div className={`cta-banner glass-panel ${isVisible('cta-banner') ? 'animate-in' : ''}`}>
          <Shield size={48} className="cta-icon" />
          <h2 className="cta-title">Ready to automate your WhatsApp?</h2>
          <p className="cta-desc">Join thousands of Indian MSMEs growing their business with AI.</p>
          <button className="btn btn-primary btn-lg cta-btn" onClick={() => navigate('/setup')}>
            {t('landing.cta_start')}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-logo">
            <span className="landing-nav-brand gradient-text">DeployBridge</span>
          </div>
          <p className="landing-footer-tagline">{t('landing.footer_tagline')}</p>
        </div>
      </footer>
    </div>
  )
}
