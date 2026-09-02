// `tone` maps to the status colors defined in index.css (low / medium / high),
// defaulting to the neutral gold accent when a card isn't reporting a risk level.
const TONE_CLASS = {
  neutral: '',
  low: 'stat-card-low',
  medium: 'stat-card-medium',
  high: 'stat-card-high',
}

export default function StatCard({ icon: Icon, label, value, hint, tone = 'neutral' }) {
  return (
    <div className={`stat-card ${TONE_CLASS[tone]}`}>
      <div className="stat-card-icon">{Icon && <Icon size={18} strokeWidth={1.75} />}</div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {hint && <div className="stat-card-hint">{hint}</div>}
    </div>
  )
}
