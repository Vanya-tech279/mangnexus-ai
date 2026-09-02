import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Mountain,
  AlertTriangle,
  Sparkles,
  ClipboardList,
  Database,
  CircleDot,
} from 'lucide-react'

// Each entry maps a route to its label + icon. Keeping this as one array
// (instead of six separate <NavLink> blocks) means adding a page later is
// a one-line change here, not a hunt through JSX.
const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/zone-analysis', label: 'Zone Analysis', icon: Mountain },
  { to: '/production-risk', label: 'Production Risk', icon: AlertTriangle },
  { to: '/ai-insights', label: 'AI Insights', icon: Sparkles },
  { to: '/action-center', label: 'Action Center', icon: ClipboardList },
  { to: '/data-hub', label: 'Data Hub', icon: Database },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <div className="brand-name">MangNexus AI</div>
          <div className="brand-tagline">AI Mining Intelligence</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-item${isActive ? ' nav-item-active' : ''}`}
          >
            <Icon size={18} strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-status">
        <CircleDot size={13} className="status-dot" strokeWidth={2.5} />
        <span>System Operational</span>
      </div>
    </aside>
  )
}
