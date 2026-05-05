import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Globe,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import './AppLayout.css'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { path: '/conversations', icon: MessageSquare, labelKey: 'nav.conversations' },
  { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
  { path: '/pricing', icon: CreditCard, labelKey: 'nav.pricing' },
]

export default function AppLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang)
    setLangMenuOpen(false)
  }

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="oklch(0.65 0.18 72)" />
                <path d="M7 14L12 9L17 14L12 19Z" fill="white" opacity="0.9" />
                <path d="M11 14L16 9L21 14L16 19Z" fill="white" opacity="0.6" />
              </svg>
            </div>
            <div className="sidebar-logo-text">
              <span className="sidebar-brand">DeployBridge</span>
              <span className="sidebar-sub">by Sarvam AI</span>
            </div>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={() => {}}>
            <HelpCircle size={20} />
            <span>{t('nav.help')}</span>
          </button>
          <button className="sidebar-link" onClick={() => {}}>
            <LogOut size={20} />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="app-main">
        <header className="topbar">
          <button
            className="topbar-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <div className="topbar-spacer" />

          <div className="topbar-actions">
            <div className="lang-switcher">
              <button
                className="lang-switcher-btn"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-expanded={langMenuOpen}
                aria-haspopup="listbox"
              >
                <Globe size={16} />
                <span>{i18n.language === 'hi' ? 'हिन्दी' : 'English'}</span>
                <ChevronDown size={14} />
              </button>
              {langMenuOpen && (
                <div className="lang-menu" role="listbox">
                  <button
                    className={`lang-option ${i18n.language === 'en' ? 'lang-option--active' : ''}`}
                    onClick={() => toggleLanguage('en')}
                    role="option"
                    aria-selected={i18n.language === 'en'}
                  >
                    English
                  </button>
                  <button
                    className={`lang-option ${i18n.language === 'hi' ? 'lang-option--active' : ''}`}
                    onClick={() => toggleLanguage('hi')}
                    role="option"
                    aria-selected={i18n.language === 'hi'}
                  >
                    हिन्दी
                  </button>
                </div>
              )}
            </div>

            <div className="topbar-avatar" aria-label="User profile">
              <span>RS</span>
            </div>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
