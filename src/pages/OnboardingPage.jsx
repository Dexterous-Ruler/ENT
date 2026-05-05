import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Phone,
  Globe,
  ChevronDown,
} from 'lucide-react'
import { businessTypes, languages } from '../data/mock'
import './OnboardingPage.css'

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [selectedLanguages, setSelectedLanguages] = useState(['hi'])
  const [responses, setResponses] = useState({
    hours: '',
    pricing: '',
    services: '',
    booking: '',
    status: '',
  })
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const stepLabels = [
    t('onboarding.step_business'),
    t('onboarding.step_languages'),
    t('onboarding.step_responses'),
    t('onboarding.step_preview'),
    t('onboarding.step_launch'),
  ]

  const canProceed = () => {
    if (step === 0) return selectedBusiness !== null
    if (step === 1) return selectedLanguages.length > 0
    if (step === 2) return responses.hours.length > 0 || responses.services.length > 0
    return true
  }

  const toggleLanguage = (code) => {
    setSelectedLanguages((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    )
  }

  const updateResponse = (key, value) => {
    setResponses((prev) => ({ ...prev, [key]: value }))
  }

  const selectedBusinessData = businessTypes.find((b) => b.id === selectedBusiness)

  return (
    <div className="onboarding">
      {/* Header */}
      <header className="onboarding-header">
        <div className="onboarding-header-inner">
          <div className="onboarding-logo" onClick={() => navigate('/')}>
            <span>DeployBridge</span>
          </div>

          <div className="onboarding-header-actions">
            <div className="lang-toggle-landing">
              <button
                className="lang-toggle-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
              >
                <Globe size={14} />
                <span>{i18n.language === 'hi' ? 'हिन्दी' : 'EN'}</span>
                <ChevronDown size={12} />
              </button>
              {langMenuOpen && (
                <div className="lang-dropdown-landing">
                  <button onClick={() => { i18n.changeLanguage('en'); setLangMenuOpen(false) }}>English</button>
                  <button onClick={() => { i18n.changeLanguage('hi'); setLangMenuOpen(false) }}>हिन्दी</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="onboarding-progress">
        <div className="progress-steps">
          {stepLabels.map((label, i) => (
            <div
              key={i}
              className={`progress-step ${i === step ? 'progress-step--active' : ''} ${i < step ? 'progress-step--done' : ''}`}
            >
              <div className="progress-dot">
                {i < step ? <Check size={12} /> : <span>{i + 1}</span>}
              </div>
              <span className="progress-label">{label}</span>
            </div>
          ))}
        </div>
        <div className="progress-line" />
      </div>

      {/* Content */}
      <main className="onboarding-content">
        {/* Step 0: Business Type */}
        {step === 0 && (
          <div className="onboarding-step" key="step-0">
            <h2 className="onboarding-question">{t('onboarding.select_business')}</h2>
            <div className="business-type-grid">
              {businessTypes.map((biz) => (
                <button
                  key={biz.id}
                  className={`business-type-card ${selectedBusiness === biz.id ? 'business-type-card--selected' : ''}`}
                  onClick={() => setSelectedBusiness(biz.id)}
                  aria-pressed={selectedBusiness === biz.id}
                >
                  <span className="business-type-name sans-header">
                    {i18n.language === 'hi' ? biz.nameHi : biz.name}
                  </span>
                  <span className="business-type-desc">
                    {i18n.language === 'hi' ? biz.descriptionHi : biz.description}
                  </span>
                  {selectedBusiness === biz.id && (
                    <div className="business-type-check">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Languages */}
        {step === 1 && (
          <div className="onboarding-step" key="step-1">
            <h2 className="onboarding-question">{t('onboarding.select_languages')}</h2>
            <div className="language-grid">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`language-chip ${selectedLanguages.includes(lang.code) ? 'language-chip--selected' : ''}`}
                  onClick={() => toggleLanguage(lang.code)}
                  aria-pressed={selectedLanguages.includes(lang.code)}
                >
                  <span className="language-native sans-header">{lang.nameNative}</span>
                  <span className="language-english">{lang.name}</span>
                  {selectedLanguages.includes(lang.code) && (
                    <div className="language-check">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Responses */}
        {step === 2 && (
          <div className="onboarding-step" key="step-2">
            <h2 className="onboarding-question">{t('onboarding.configure_responses')}</h2>
            <div className="responses-form">
              {[
                { key: 'hours', label: t('onboarding.response_hours'), placeholder: t('onboarding.hours_placeholder') },
                { key: 'pricing', label: t('onboarding.response_pricing'), placeholder: t('onboarding.pricing_placeholder') },
                { key: 'services', label: t('onboarding.response_services'), placeholder: t('onboarding.services_placeholder') },
                { key: 'booking', label: t('onboarding.response_booking'), placeholder: t('onboarding.booking_placeholder') },
                { key: 'status', label: t('onboarding.response_status'), placeholder: t('onboarding.status_placeholder') },
              ].map((field) => (
                <div className="response-field" key={field.key}>
                  <label className="response-label sans-header" htmlFor={`response-${field.key}`}>
                    {field.label}
                  </label>
                  <textarea
                    id={`response-${field.key}`}
                    className="response-textarea"
                    placeholder={field.placeholder}
                    value={responses[field.key]}
                    onChange={(e) => updateResponse(field.key, e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="onboarding-step" key="step-3">
            <h2 className="onboarding-question">{t('onboarding.preview_title')}</h2>
            <p className="onboarding-desc">{t('onboarding.preview_desc')}</p>

            <div className="preview-container">
              <div className="preview-phone">
                <div className="phone-notch" />
                <div className="wa-header">
                  <div className="wa-header-info">
                    <span className="wa-header-name">
                      {selectedBusinessData
                        ? (i18n.language === 'hi' ? selectedBusinessData.nameHi : selectedBusinessData.name)
                        : 'Your Business'}
                    </span>
                    <span className="wa-header-status">AI Assistant</span>
                  </div>
                </div>
                <div className="wa-chat">
                  <div className="wa-msg wa-msg--received">
                    <p>Kya aapke yahan appointment mil sakti hai?</p>
                  </div>
                  <div className="wa-msg wa-msg--sent">
                    <p>
                      {responses.booking
                        ? responses.booking
                        : 'Bilkul! Apna preferred date aur time batayein, hum confirm kar denge.'}
                    </p>
                  </div>
                  <div className="wa-msg wa-msg--received">
                    <p>Timing kya hai?</p>
                  </div>
                  <div className="wa-msg wa-msg--sent">
                    <p>
                      {responses.hours
                        ? responses.hours
                        : 'Mon-Sat 9 AM to 8 PM, Sunday closed.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="preview-info">
                <h3 className="sans-header">What your customers will see</h3>
                <ul className="preview-checklist">
                  <li><Check size={16} /> Instant responses in their language</li>
                  <li><Check size={16} /> Your actual business information</li>
                  <li><Check size={16} /> Professional, 24/7 availability</li>
                  <li><Check size={16} /> No app download needed</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Launch */}
        {step === 4 && (
          <div className="onboarding-step onboarding-step--launch" key="step-4">
            <h2 className="onboarding-question">{t('onboarding.launch_title')}</h2>
            <p className="onboarding-desc">{t('onboarding.launch_desc')}</p>

            <div className="launch-number">
              <span className="launch-number-label sans-header">{t('common.whatsapp_number')}</span>
              <span className="launch-number-value">+91 98765 00123</span>
            </div>

            <div className="launch-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/dashboard')}
              >
                {t('onboarding.finish')}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      {step < 4 && (
        <footer className="onboarding-footer">
          <div className="onboarding-footer-inner">
            <button
              className="btn btn-secondary"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              <ArrowLeft size={16} />
              {t('onboarding.back')}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setStep(Math.min(TOTAL_STEPS - 1, step + 1))}
              disabled={!canProceed()}
            >
              {t('onboarding.next')}
              <ArrowRight size={16} />
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}
