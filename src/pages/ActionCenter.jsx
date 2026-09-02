import { useState } from 'react'
import {
  ListChecks,
  Mountain,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Gauge,
} from 'lucide-react'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import { miningZones, productionSites } from '../data/mockData'

// Same tone/label conventions as AIInsights.jsx, kept identical so a "High
// Risk" or "High Potential" badge reads the same color no matter which page
// it appears on.
const RISK_TONE = { Low: 'low', Medium: 'medium', High: 'high' }
const POTENTIAL_TONE = { High: 'low', Medium: 'medium', Low: 'high' }

const FILTERS = [
  { id: 'all', label: 'All Actions', icon: ListChecks },
  { id: 'zone', label: 'Zone Analysis', icon: Mountain },
  { id: 'site', label: 'Production Risk', icon: AlertTriangle },
]

// ---------------------------------------------------------------------------
// Turns the two models' outputs into one flat, priority-ordered list of
// "next step" groups. Production sites contribute their existing corrective
// -action list; zones contribute their single recommendation as a one-item
// list, so both render through the same action-list markup. Sorting by the
// model's own score means the most urgent site or most promising zone always
// surfaces first, regardless of type.
// ---------------------------------------------------------------------------
function buildActionGroups() {
  const siteGroups = productionSites.map((s) => ({
    type: 'site',
    id: s.id,
    name: s.name,
    region: s.region,
    tone: RISK_TONE[s.result.risk],
    badge: `${s.result.risk} Risk`,
    priority: s.result.score,
    actions: s.result.actions,
  }))

  const zoneGroups = miningZones.map((z) => ({
    type: 'zone',
    id: z.id,
    name: z.name,
    region: z.region,
    tone: POTENTIAL_TONE[z.result.potential],
    badge: `${z.result.potential} Potential`,
    priority: z.result.score,
    actions: [z.result.recommendation],
  }))

  return [...siteGroups, ...zoneGroups].sort((a, b) => b.priority - a.priority)
}

export default function ActionCenter() {
  const [filter, setFilter] = useState('all')
  const [completed, setCompleted] = useState(() => new Set())

  const groups = buildActionGroups()
  const visibleGroups = filter === 'all' ? groups : groups.filter((g) => g.type === filter)

  const totalActions = groups.reduce((sum, g) => sum + g.actions.length, 0)
  const highPriorityGroups = groups.filter((g) => g.badge.startsWith('High')).length
  const completedCount = completed.size
  const openCount = totalActions - completedCount

  function toggleAction(key) {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <>
      <Header
        title="Action Center"
        subtitle="Recommended next steps, prioritized across every zone and site"
      />

      <div className="stat-grid">
        <StatCard
          icon={ListChecks}
          label="Total Actions"
          value={totalActions}
          hint="Across zone + production models"
        />
        <StatCard
          icon={ShieldAlert}
          label="High Priority"
          value={highPriorityGroups}
          hint="High risk sites + high potential zones"
          tone="high"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedCount}
          hint="Marked as actioned"
          tone="low"
        />
        <StatCard
          icon={Gauge}
          label="Open"
          value={openCount}
          hint="Still awaiting action"
          tone="medium"
        />
      </div>

      <div className="insight-tabs">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`insight-tab${filter === id ? ' insight-tab-active' : ''}`}
            onClick={() => setFilter(id)}
          >
            <Icon size={13} strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      {visibleGroups.map((group) => (
        <div className="panel" key={`${group.type}-${group.id}`}>
          <div className="finding-card-top action-group-header">
            <div className="finding-card-title-group">
              <span className={`insight-tag insight-tag-${group.type === 'zone' ? 'zone' : 'risk'}`}>
                {group.type === 'zone' ? 'Zone Analysis' : 'Production Risk'}
              </span>
              <span className="finding-card-title">{group.name}</span>
              <span className="finding-card-region">{group.region}</span>
            </div>
            <div className="finding-card-top-right">
              <span className={`combined-badge combined-badge-${group.tone}`}>{group.badge}</span>
            </div>
          </div>

          <ol className="action-list">
            {group.actions.map((action, i) => {
              const key = `${group.type}-${group.id}-${i}`
              const done = completed.has(key)
              return (
                <li className={`action-item${done ? ' action-item-done' : ''}`} key={key}>
                  <button
                    type="button"
                    className="action-item-index"
                    onClick={() => toggleAction(key)}
                    aria-pressed={done}
                    aria-label={done ? 'Mark action as not done' : 'Mark action as done'}
                  >
                    {done ? <CheckCircle2 size={13} strokeWidth={2.5} /> : i + 1}
                  </button>
                  <span>{action}</span>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </>
  )
}