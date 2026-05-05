import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import ConversationsPage from './pages/ConversationsPage'
import SettingsPage from './pages/SettingsPage'
import PricingPage from './pages/PricingPage'
import AppLayout from './components/Layout/AppLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<OnboardingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
