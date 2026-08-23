import { useEffect, useState } from 'react'

export default function StatCard({ value, label, suffix = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let frame
    const duration = 900
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setCount(Math.round(progress * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <article className="stat-card">
      <strong>
        {count}
        {suffix}
      </strong>
      <span>{label}</span>
    </article>
  )
}
