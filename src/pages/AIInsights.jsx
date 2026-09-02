import { useState } from 'react'
import {
  Sparkles,
  Mountain,
  AlertTriangle,
  CheckCircle2,
  Gauge,
  Layers3,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import { miningZones, productionSites } from '../data/mockData'

// Same tone conventions used on ZoneAnalysis / ProductionRisk, kept here so
// badges and finding cards read identically no matter which page a level
// badge appears on: "High Potential" and "Low Risk" are always the good
// (green) tone, "Low Potential" and "High Risk" are always the bad (rust) one.
const POTENTIAL_TONE = { High: 'low', Medium: 'medium', Low: 'high' }
const RISK_TONE = { Low: 'low', Medium: 'medium', High: 'high' }

// ---------------------------------------------------------------------------
// Cross-module analysis: pairs each region's strongest zone with its riskiest
// site so the page can show the "EXPLORE + PREDICT" story in one sentence —
// exactly the kind of synthesis the AI Insights layer is meant to produce,
// rather than just listing the two modules' outputs side by side.
// ---------------------------------------------------------------------------
function buildCombinedInsights() {
  const regions = {}
  miningZones.forEach((z) => {
    regions[z.region] = regions[z.region] || {}
    regions[z.region].zones = [...(regions[z.region].zones || []), z]
  })
  productionSites.forEach((s) => {
    regions[s.region] = regions[s.region] || {}
    regions[s.region].sites = [...(regions[s.region].sites || []), s]
  })

  return Object.entries(regions)
    .filter(([, r]) => r.zones && r.sites)
    .map(([region, r]) => {
      const topZone = [...r.zones].sort((a, b) => b.result.score - a.result.score)[0]
      const riskiestSite = [...r.sites].sort((a, b) => b.result.score - a.result.score)[0]
      return { region, zone: topZone, site: riskiestSite }
    })
}

const FILTERS = [
  { id: 'all', label: 'All Findings', icon: Sparkles },
  { id: 'zone', label: 'Zone Analysis', icon: Mountain },
  { id: 'risk', label: 'Production Risk', icon: AlertTriangle },
]

export default function AIInsights() {
  const [filter, setFilter] = useState('all')

  const combinedInsights = buildCombinedInsights()

  const zoneFindings = miningZones.map((z) => ({
    id: z.id,
    type: 'zone',
    title: z.name,
    region: z.region,
    level: z.result.potential,
    tone: POTENTIAL_TONE[z.result.potential],
    confidence: z.result.confidence,
    text: z.result.insight,
    points: z.result.indicators.slice(0, 2),
  }))

  const riskFindings = productionSites.map((s) => ({
    id: s.id,
    type: 'risk',
    title: s.name,
    region: s.region,
    level: s.result.risk,
    tone: RISK_TONE[s.result.risk],
    confidence: s.result.confidence,
    text: s.result.insight,
    points: s.result.factors.slice(0, 2),
  }))

  const allFindings = [...zoneFindings, ...riskFindings]
  const findings = filter === 'all' ? allFindings : allFindings.filter((f) => f.type === filter)

  const positiveSignals =
    miningZones.filter((z) => z.result.potential === 'High').length +
    productionSites.filter((s) => s.result.risk === 'Low').length
  const flaggedRisks = productionSites.filter((s) => s.result.risk !== 'Low').length
  const avgConfidence = Math.round(
    allFindings.reduce((sum, f) => sum + f.confidence, 0) / allFindings.length
  )

  return (
    <>
      <Header title="AI Insights" subtitle="Combined findings from both models" />

      <div className="stat-grid">
        <StatCard
          icon={Layers3}
          label="Total Insights"
          value={allFindings.length}
          hint="Zone + production models"
        />
        <StatCard
          icon={TrendingUp}
          label="Positive Signals"
          value={positiveSignals}
          hint="High potential zones + low-risk sites"
          tone="low"
        />
        <StatCard
          icon={ShieldAlert}
          label="Flagged Risks"
          value={flaggedRisks}
          hint="Sites at medium or high risk"
          tone="high"
        />
        <StatCard
          icon={Gauge}
          label="Avg. Confidence"
          value={`${avgConfidence}%`}
          hint="Across all findings"
          tone="medium"
        />
      </div>

      <div className="panel">
        <div className="panel-title">
          <Sparkles size={15} strokeWidth={2} />
          Cross-Module Analysis
        </div>
        <div className="combined-grid">
          {combinedInsights.map(({ region, zone, site }) => (
            <div className="combined-card" key={region}>
              <div className="combined-card-header">
                <div className="combined-card-icon">
                  <Sparkles size={16} strokeWidth={1.75} />
                </div>
                <div className="combined-card-region">{region}</div>
              </div>
              <div className="combined-card-badges">
                <span className={`combined-badge combined-badge-${POTENTIAL_TONE[zone.result.potential]}`}>
                  <Mountain size={12} strokeWidth={2} />
                  {zone.name} — {zone.result.potential} Potential
                </span>
                <span className={`combined-badge combined-badge-${RISK_TONE[site.result.risk]}`}>
                  <AlertTriangle size={12} strokeWidth={2} />
                  {site.name} — {site.result.risk} Risk
                </span>
              </div>
              <p className="combined-card-text">
                {zone.name} shows {zone.result.potential.toLowerCase()} manganese potential
                (score {zone.result.score}/100), but production conditions at nearby{' '}
                {site.name} indicate {site.result.risk.toLowerCase()} shortfall risk — driven
                primarily by {site.result.factors[0].toLowerCase()}.
              </p>
            </div>
          ))}
        </div>
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

      <div className="finding-list">
        {findings.map((f) => (
          <div className="finding-card" key={`${f.type}-${f.id}`}>
            <div className="finding-card-top">
              <div className="finding-card-title-group">
                <span className={`insight-tag insight-tag-${f.type}`}>
                  {f.type === 'zone' ? 'Zone Analysis' : 'Production Risk'}
                </span>
                <span className="finding-card-title">{f.title}</span>
                <span className="finding-card-region">{f.region}</span>
              </div>
              <div className="finding-card-top-right">
                <span className={`combined-badge combined-badge-${f.tone}`}>
                  {f.level} {f.type === 'zone' ? 'Potential' : 'Risk'}
                </span>
                <span className="finding-card-confidence">
                  <Gauge size={12} strokeWidth={2} />
                  {f.confidence}% confidence
                </span>
              </div>
            </div>

            <p className="finding-card-text">{f.text}</p>

            <div className="finding-card-points">
              {f.points.map((point) => (
                <div className="finding-point" key={point}>
                  {f.type === 'zone' ? (
                    <CheckCircle2 size={14} strokeWidth={2} className="finding-point-icon-low" />
                  ) : (
                    <AlertTriangle size={14} strokeWidth={2} className="finding-point-icon-high" />
                  )}
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}