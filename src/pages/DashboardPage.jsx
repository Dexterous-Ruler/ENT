import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Users,
  Globe,
  Zap,
  TrendingUp,
  ArrowRight,
  Phone,
  Share2,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { fetchConversations, fetchMetrics } from '../lib/api'
import './DashboardPage.css'

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [period, setPeriod] = useState('today')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [convs, metricsData] = await Promise.all([
          fetchConversations(),
          fetchMetrics()
        ])
        setData({
          conversations: convs,
          metrics: metricsData.metrics,
          intentData: metricsData.intentData,
          weeklyTrend: metricsData.weeklyTrend
        })
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !data) {
    return <div className="dashboard-loading">Loading Dashboard...</div>
  }

  const metrics = data.metrics[period]
  const metricKeys = [
    { key: 'totalConversations', label: 'Total Conversations' },
    { key: 'activeLeads', label: 'Active Leads' },
    { key: 'languagesUsed', label: 'Languages Used' },
    { key: 'responseRate', label: 'Response Rate' },
  ]

  const formatTimeAgo = (date) => {
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    return `${hrs}h ago`
  }

  // Soothing Sarvam pastel palette for charts
  const intentColors = ['#d8b4fe', '#c4b5fd', '#a78bfa', '#e0e7ff', '#ffedd5']

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">{t('dashboard.welcome')}</h1>
          <p className="dashboard-number sans-header">
            <Phone size={14} />
            +91 95083 09957
          </p>
        </div>

        <div className="period-tabs">
          {['today', 'week', 'month'].map((p) => (
            <button
              key={p}
              className={`period-tab ${period === p ? 'period-tab--active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {t(`dashboard.${p === 'week' ? 'this_week' : p === 'month' ? 'this_month' : p}`)}
            </button>
          ))}
        </div>
      </div>

      <hr className="dashboard-divider" />

      {/* Metrics */}
      <div className="metrics-grid">
        {metricKeys.map(({ key, label }) => {
          const value = metrics[key]
          return (
            <div className="metric-card" key={key}>
              <span className="metric-label sans-header">{label}</span>
              <span className="metric-value">
                {key === 'responseRate' ? `${value}%` : value.toLocaleString()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Weekly Trend */}
        <div className="chart-card chart-card--wide">
          <div className="chart-header">
            <h3 className="chart-title">Weekly Trend</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.weeklyTrend} barSize={32} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-neutral-200)" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-neutral-600)', fontSize: 12, fontFamily: 'Inter' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-neutral-600)', fontSize: 12, fontFamily: 'Inter' }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: 'var(--color-neutral-100)' }}
                  contentStyle={{
                    background: 'var(--color-neutral-0)',
                    border: '1px solid var(--color-neutral-300)',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontFamily: 'Inter',
                  }}
                />
                <Bar
                  dataKey="conversations"
                  fill="var(--color-neutral-950)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intent Breakdown */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">{t('dashboard.customer_intents')}</h3>
          </div>
          <div className="chart-container chart-container--pie">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data.intentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.intentData.map((entry, i) => (
                    <Cell key={i} fill={intentColors[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-neutral-0)',
                    border: '1px solid var(--color-neutral-300)',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontFamily: 'Inter',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {data.intentData.map((entry, i) => (
                <div className="pie-legend-item" key={entry.name}>
                  <span className="pie-dot" style={{ background: intentColors[i] }} />
                  <span className="pie-label sans-header">{entry.name}</span>
                  <span className="pie-value">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="conversations-section">
        <div className="conversations-header">
          <h3 className="conversations-title">{t('dashboard.recent_conversations')}</h3>
          <button className="view-all-btn" onClick={() => navigate('/conversations')}>
            {t('dashboard.view_all')}
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="conversations-list">
          {data.conversations.slice(0, 4).map((conv) => (
            <div className="conversation-row" key={conv.id} onClick={() => navigate('/conversations')}>
              <div className="conv-info">
                <div className="conv-top">
                  <span className="conv-name">{conv.customerName}</span>
                  <span className="conv-time">{formatTimeAgo(conv.timestamp)}</span>
                </div>
                <p className="conv-summary">{conv.summary}</p>
                <div className="conv-tags">
                  <span className="conv-tag conv-tag--intent">{conv.intentLabel}</span>
                  <span className="conv-tag conv-tag--lang">{conv.language}</span>
                  <span className={`conv-tag conv-tag--status conv-tag--${conv.status}`}>
                    {conv.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action: Share Number */}
      <div className="share-banner">
        <div className="share-banner-text">
          <h3 className="sans-header">Share your WhatsApp number</h3>
          <p>Print it on your visiting card, shop board, or social media</p>
        </div>
        <button className="btn btn-primary share-banner-btn">
          {t('dashboard.share_number')}
        </button>
      </div>
    </div>
  )
}
