import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  Phone,
  Clock,
  Filter,
  ChevronRight,
} from 'lucide-react'
import { fetchConversations } from '../lib/api'
import './ConversationsPage.css'

export default function ConversationsPage() {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedConv, setSelectedConv] = useState(null)

  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await fetchConversations()
        setConversations(data)
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = conversations.filter((c) => {
    if (search) {
      const q = search.toLowerCase()
      return (
        c.customerName.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.intentLabel.toLowerCase().includes(q)
      )
    }
    return true
  })

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="conversations-page">
      {loading && <div className="conversations-loading" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>Loading Conversations...</div>}
      {/* Left panel: List */}
      <div className={`conv-list-panel ${selectedConv ? 'conv-list-panel--hidden-mobile' : ''}`}>
        <div className="conv-list-header">
          <h2 className="conv-list-title sans-header">{t('conversations.title')}</h2>
          <div className="conv-search">
            <Search size={14} />
            <input
              type="text"
              placeholder={t('conversations.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="conv-search-input"
            />
          </div>
        </div>

        <div className="conv-filters">
          {['all', 'today', 'week', 'month'].map((f) => (
            <button
              key={f}
              className={`conv-filter ${filter === f ? 'conv-filter--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {t(`conversations.filter_${f}`)}
            </button>
          ))}
        </div>

        <div className="conv-list">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              className={`conv-item ${selectedConv?.id === conv.id ? 'conv-item--active' : ''}`}
              onClick={() => setSelectedConv(conv)}
            >
              <div className="conv-item-info">
                <div className="conv-item-top">
                  <span className="conv-item-name">{conv.customerName}</span>
                  <span className="conv-item-time">{formatTime(conv.timestamp)}</span>
                </div>
                <p className="conv-item-summary">{conv.summary}</p>
                <div className="conv-item-meta">
                  <span className="conv-item-tag">{conv.intentLabel}</span>
                  <span className="conv-item-lang">{conv.language}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel: Detail */}
      <div className={`conv-detail-panel ${selectedConv ? 'conv-detail-panel--visible' : ''}`}>
        {selectedConv ? (
          <>
            <div className="conv-detail-header">
              <button
                className="conv-detail-back"
                onClick={() => setSelectedConv(null)}
                aria-label="Back to list"
              >
                <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div className="conv-detail-user">
                <span className="conv-detail-name sans-header">{selectedConv.customerName}</span>
                <span className="conv-detail-phone">{selectedConv.customerPhone}</span>
              </div>
              <div className="conv-detail-meta">
                <span className={`conv-tag conv-tag--status conv-tag--${selectedConv.status}`}>
                  {selectedConv.status}
                </span>
              </div>
            </div>

            <div className="conv-detail-info-bar">
              <div className="conv-detail-info-item">
                <Filter size={12} />
                <span>{selectedConv.intentLabel}</span>
              </div>
              <div className="conv-detail-info-item">
                <Phone size={12} />
                <span>{selectedConv.language}</span>
              </div>
              <div className="conv-detail-info-item">
                <Clock size={12} />
                <span>{selectedConv.duration}</span>
              </div>
            </div>

            <div className="conv-detail-summary">
              <h4>Summary</h4>
              <p>{i18n.language === 'hi' ? selectedConv.summaryHi : selectedConv.summary}</p>
            </div>

            <div className="conv-detail-messages">
              {selectedConv.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`detail-msg ${msg.from === 'customer' ? 'detail-msg--customer' : 'detail-msg--bot'}`}
                >
                  <p>{msg.text}</p>
                  <span className="detail-msg-time">{msg.time}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="conv-detail-empty">
            <MessageSquareIcon />
            <p>Select a conversation to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

function MessageSquareIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" style={{ color: 'var(--color-neutral-300)' }}>
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  )
}
