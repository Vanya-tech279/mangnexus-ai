// Header takes its content as props rather than reading the route itself —
// that keeps it a "dumb" presentational component, and lets each page decide
// its own title/subtitle instead of maintaining a route->title map in two places.
export default function Header({ title, subtitle }) {
  return (
    <header className="app-header">
      <div>
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>
    </header>
  )
}
