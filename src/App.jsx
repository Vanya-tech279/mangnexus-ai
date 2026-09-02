import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ZoneAnalysis from './pages/ZoneAnalysis'
import ProductionRisk from './pages/ProductionRisk'
import AIInsights from './pages/AIInsights'
import ActionCenter from './pages/ActionCenter'
import DataHub from './pages/DataHub'

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      {/* This wrapper is what makes the sidebar "fixed" — it's offset by
          the sidebar's width and holds every routed page. Without it, each
          page would render underneath the sidebar instead of beside it. */}
      <main className="app-content contour-field">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/zone-analysis" element={<ZoneAnalysis />} />
          <Route path="/production-risk" element={<ProductionRisk />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/action-center" element={<ActionCenter />} />
          <Route path="/data-hub" element={<DataHub />} />
        </Routes>
      </main>
    </div>
  )
}
