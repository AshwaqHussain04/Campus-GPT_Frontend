export default function TestimonialCard({ name, role, quote }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-avatar">{name.charAt(0)}</div>
      <div>
        <h3>{name}</h3>
        <p className="testimonial-role">{role}</p>
      </div>
      <p className="testimonial-quote">“{quote}”</p>
    </article>
  )
}
