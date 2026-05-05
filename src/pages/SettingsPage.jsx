import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Store,
  Clock,
  Languages,
  Bell,
  CreditCard,
  Save,
  Check,
} from 'lucide-react'
import { languages } from '../data/mock'
import './SettingsPage.css'

const TABS = [
  { id: 'business', icon: Store, labelKey: 'settings.business_info' },
  { id: 'responses', icon: Clock, labelKey: 'settings.responses' },
  { id: 'languages', icon: Languages, labelKey: 'settings.languages' },
  { id: 'notifications', icon: Bell, labelKey: 'settings.notifications' },
  { id: 'subscription', icon: CreditCard, labelKey: 'settings.subscription' },
]

export default function SettingsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('business')
  const [saved, setSaved] = useState(false)
  const [businessName, setBusinessName] = useState('Kumar Medical Store')
  const [businessType, setBusinessType] = useState('Kirana Store')
  const [phone, setPhone] = useState('+91 98765 00123')
  const [address, setAddress] = useState('Shop No. 12, Main Market, Nashik')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="settings-page">
      <h1 className="settings-title">{t('settings.title')}</h1>

      <div className="settings-layout">
        {/* Tabs */}
        <nav className="settings-tabs" aria-label="Settings sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{t(tab.labelKey)}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="settings-content">
          {activeTab === 'business' && (
            <div className="settings-section">
              <h2 className="settings-section-title">{t('settings.business_info')}</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label htmlFor="business-name">Business Name</label>
                  <input
                    id="business-name"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="business-type">Business Type</label>
                  <input
                    id="business-type"
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="form-input"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">WhatsApp Number</label>
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-input form-textarea"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="settings-section">
              <h2 className="settings-section-title">{t('settings.responses')}</h2>
              <div className="settings-form">
                {['Business Hours', 'Pricing', 'Services', 'Appointment Booking', 'Order Status'].map((label) => (
                  <div className="form-group" key={label}>
                    <label>{label}</label>
                    <textarea
                      className="form-input form-textarea"
                      rows={2}
                      placeholder={`Enter your ${label.toLowerCase()} response...`}
                      defaultValue={
                        label === 'Business Hours' ? 'Mon-Sat 9 AM to 8 PM, Sunday closed' :
                        label === 'Pricing' ? 'Consultation fee ₹500, Follow-up ₹200' :
                        ''
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'languages' && (
            <div className="settings-section">
              <h2 className="settings-section-title">{t('settings.languages')}</h2>
              <p className="settings-section-desc">Select the languages your AI assistant should support.</p>
              <div className="language-toggles">
                {languages.map((lang) => (
                  <label key={lang.code} className="language-toggle">
                    <div className="language-toggle-info">
                      <span className="language-toggle-native">{lang.nameNative}</span>
                      <span className="language-toggle-name">{lang.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      defaultChecked={['hi', 'ta', 'te'].includes(lang.code)}
                    />
                    <span className="toggle-switch" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2 className="settings-section-title">{t('settings.notifications')}</h2>
              <div className="notification-options">
                {[
                  { label: 'New conversation alerts', desc: 'Get notified when a new customer messages', checked: true },
                  { label: 'Lead qualification', desc: 'Notify when a high-intent lead is detected', checked: true },
                  { label: 'Daily summary', desc: 'Receive a daily summary of all conversations', checked: false },
                  { label: 'Weekly report', desc: 'Weekly performance report via WhatsApp', checked: true },
                ].map((opt) => (
                  <label key={opt.label} className="notification-option">
                    <div>
                      <span className="notification-label">{opt.label}</span>
                      <span className="notification-desc">{opt.desc}</span>
                    </div>
                    <input type="checkbox" className="toggle-checkbox" defaultChecked={opt.checked} />
                    <span className="toggle-switch" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="settings-section">
              <h2 className="settings-section-title">{t('settings.subscription')}</h2>
              <div className="subscription-card">
                <div className="subscription-plan">
                  <span className="subscription-plan-name">Basic Plan</span>
                  <span className="subscription-plan-price">₹299/month</span>
                </div>
                <div className="subscription-details">
                  <div className="subscription-stat">
                    <span className="subscription-stat-value">847 / 1,000</span>
                    <span className="subscription-stat-label">Conversations used</span>
                    <div className="subscription-bar">
                      <div className="subscription-bar-fill" style={{ width: '84.7%' }} />
                    </div>
                  </div>
                  <div className="subscription-stat">
                    <span className="subscription-stat-value">4</span>
                    <span className="subscription-stat-label">Languages active</span>
                  </div>
                </div>
                <button className="subscription-upgrade">Upgrade to Pro</button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="settings-actions">
            <button
              className={`settings-save ${saved ? 'settings-save--saved' : ''}`}
              onClick={handleSave}
            >
              {saved ? (
                <>
                  <Check size={18} />
                  {t('settings.saved')}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {t('settings.save')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
