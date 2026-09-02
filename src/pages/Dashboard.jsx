import {
  Mountain,
  Sparkles,
  AlertTriangle,
  Gauge,
  CloudRain,
  ArrowUpRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import Header from '../components/Header'
import StatCard from '../components/StatCard'
import {
  dashboardStats,
  weatherAlert,
  productionTrend,
  zoneBreakdown,
  recentInsights,
} from '../data/mockData'

// Shared dark tooltip so Recharts doesn't render its default white box
// against our charcoal theme.
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      {label && <div className="chart-tooltip-label">{label}</div>}
      {payload.map((entry) => (
        <div key={entry.dataKey ?? entry.name} className="chart-tooltip-row">
          <span
            className="chart-tooltip-dot"
            style={{ background: entry.color ?? entry.payload?.color }}
          />
          <span>{entry.name}</span>
          <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const totalZones = zoneBreakdown.reduce((sum, z) => sum + z.value, 0)

  return (
    <>
      <Header title="Dashboard" subtitle="Mining intelligence overview" />

      <div className="stat-grid">
        <StatCard
          icon={Mountain}
          label="Zones Analysed"
          value={dashboardStats.totalZonesAnalysed}
          hint="+12 this month"
        />
        <StatCard
          icon={Sparkles}
          label="High Potential Zones"
          value={dashboardStats.highPotentialZones}
          hint={`${Math.round((dashboardStats.highPotentialZones / totalZones) * 100)}% of analysed zones`}
          tone="low"
        />
        <StatCard
          icon={AlertTriangle}
          label="Active High-Risk Sites"
          value={dashboardStats.activeHighRiskSites}
          hint="Requires attention"
          tone="high"
        />
        <StatCard
          icon={Gauge}
          label="Avg. Model Confidence"
          value={`${dashboardStats.avgModelConfidence}%`}
          hint="Across both AI models"
          tone="medium"
        />
      </div>

      <div className="alert-banner">
        <CloudRain size={20} strokeWidth={1.75} />
        <div>
          <div className="alert-banner-title">
            {weatherAlert.level} Weather Alert — {weatherAlert.region}
          </div>
          <div className="alert-banner-message">{weatherAlert.message}</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-title">Production: Actual vs Target</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={productionTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c1922f" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#c1922f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#24352c" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#9caa9f', fontSize: 12 }}
                axisLine={{ stroke: '#24352c' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9caa9f', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#6b7a70"
                strokeDasharray="4 4"
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#dcb567"
                strokeWidth={2}
                fill="url(#actualFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <div className="panel-title">Zone Potential Breakdown</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={zoneBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                strokeWidth={0}
              >
                {zoneBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="zone-legend">
            {zoneBreakdown.map((z) => (
              <div key={z.name} className="zone-legend-item">
                <span className="zone-legend-dot" style={{ background: z.color }} />
                <span className="zone-legend-label">{z.name}</span>
                <span className="zone-legend-value">{z.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Recent AI Insights</div>
        <div className="insights-list">
          {recentInsights.map((insight) => (
            <div key={insight.id} className="insight-item">
              <span className={`insight-tag insight-tag-${insight.type}`}>
                {insight.type === 'zone' ? 'Zone Analysis' : 'Production Risk'}
              </span>
              <div className="insight-body">
                <div className="insight-title">{insight.title}</div>
                <div className="insight-summary">{insight.summary}</div>
              </div>
              <div className="insight-confidence">
                <ArrowUpRight size={14} strokeWidth={2} />
                {insight.confidence}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
