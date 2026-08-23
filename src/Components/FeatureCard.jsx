import { Link } from 'react-router-dom'

export default function FeatureCard({ icon, title, description, to = '/chat' }) {
  return (
    <article className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={to} className="text-link">
        Learn more
      </Link>
    </article>
  )
}
