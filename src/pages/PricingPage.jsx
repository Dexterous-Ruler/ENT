import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Check, MessageCircle, Globe, ArrowRight, X } from 'lucide-react'
import './PricingPage.css'

const TIERS = [
  { id: 'starter', nameKey: 'pricing.starter', price: '₹0', conversations: '100', langs: '2',
    features: [
      { text: 'Basic setup wizard', ok: true }, { text: 'Dashboard Lite', ok: true },
      { text: 'Email support', ok: true }, { text: 'CRM Sync', ok: false },
      { text: 'Custom voice', ok: false }, { text: 'On-premise', ok: false },
    ], highlight: false },
  { id: 'basic', nameKey: 'pricing.basic', price: '₹299', conversations: '1,000', langs: '4',
    features: [
      { text: 'Full setup wizard', ok: true }, { text: 'Dashboard Lite', ok: true },
      { text: 'Priority support', ok: true }, { text: 'Lead tracking', ok: true },
      { text: 'CRM Sync', ok: false }, { text: 'Custom voice', ok: false },
    ], highlight: false },
  { id: 'pro', nameKey: 'pricing.pro', price: '₹999', conversations: '10,000', langs: '22',
    features: [
      { text: 'Full setup wizard', ok: true }, { text: 'Full Dashboard', ok: true },
      { text: 'Phone + chat support', ok: true }, { text: 'Lead scoring', ok: true },
      { text: 'CRM Sync', ok: true }, { text: 'Custom voice', ok: false },
    ], highlight: true },
  { id: 'enterprise', nameKey: 'pricing.enterprise', price: '₹5,000+', conversations: 'Unlimited', langs: '22',
    features: [
      { text: 'White-label', ok: true }, { text: 'Custom reports', ok: true },
      { text: 'Dedicated manager', ok: true }, { text: 'Lead scoring', ok: true },
      { text: 'CRM Sync', ok: true }, { text: 'Custom voice', ok: true },
    ], highlight: false },
]

export default function PricingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="pricing-page">
      <header className="pp-nav">
        <div className="pp-nav-inner">
          <div className="pp-logo" onClick={() => navigate('/')}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="oklch(0.65 0.18 72)" />
              <path d="M7 14L12 9L17 14L12 19Z" fill="white" opacity="0.9" />
              <path d="M11 14L16 9L21 14L16 19Z" fill="white" opacity="0.6" />
            </svg>
            <span>DeployBridge</span>
          </div>
          <button className="pp-cta" onClick={() => navigate('/setup')}>
            {t('landing.cta_start')}<ArrowRight size={16} />
          </button>
        </div>
      </header>
      <div className="pp-content">
        <h1 className="pp-title">{t('pricing.title')}</h1>
        <p className="pp-subtitle">{t('pricing.subtitle')}</p>
        <div className="pp-grid">
          {TIERS.map((tier) => (
            <div key={tier.id} className={`pp-card ${tier.highlight ? 'pp-card--pop' : ''}`}>
              {tier.highlight && <div className="pp-badge">{t('pricing.popular')}</div>}
              <h2 className="pp-plan">{t(tier.nameKey)}</h2>
              <div className="pp-price"><span className="pp-amount">{tier.price}</span>
                {tier.price !== '₹0' && <span className="pp-period">{t('pricing.per_month')}</span>}
              </div>
              <div className="pp-limits">
                <div className="pp-limit"><MessageCircle size={14} /><span>{tier.conversations} {t('pricing.conversations_mo')}</span></div>
                <div className="pp-limit"><Globe size={14} /><span>{tier.langs} {t('pricing.languages')}</span></div>
              </div>
              <div className="pp-features">
                {tier.features.map((f) => (
                  <div key={f.text} className={`pp-feat ${!f.ok ? 'pp-feat--no' : ''}`}>
                    {f.ok ? <Check size={14} className="feat-y" /> : <X size={14} className="feat-n" />}
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
              <button className={`pp-action ${tier.highlight ? 'pp-action--pri' : ''}`}
                onClick={() => navigate('/setup')}>
                {tier.price === '₹0' ? t('landing.cta_start') : tier.id === 'enterprise' ? t('pricing.contact_sales') : t('pricing.upgrade')}
              </button>
            </div>
          ))}
        </div>
        <div className="roi-section">
          <h3>Save ₹5,000/month on staff costs</h3>
          <p>A typical MSME spends ₹5,000 to ₹15,000/month answering calls. DeployBridge handles this 24/7 in every language.</p>
          <div className="roi-row">
            <div className="roi-card roi-old"><span className="roi-label">Manual staff</span><span className="roi-val">₹8,000/mo</span><span className="roi-det">8 hrs/day, 1 language</span></div>
            <div className="roi-vs">vs</div>
            <div className="roi-card roi-new"><span className="roi-label">DeployBridge</span><span className="roi-val">₹299/mo</span><span className="roi-det">24/7, 4 languages</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
