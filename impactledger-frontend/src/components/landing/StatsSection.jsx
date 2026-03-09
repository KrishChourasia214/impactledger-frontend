import { useEffect, useState, useRef } from 'react'

function AnimatedCounter({ end, suffix = '', prefix = '', color }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          let start = 0
          const duration = 2000
          const increment = end / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} className="text-center group">
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300">
        <p className={`text-5xl font-extrabold ${color} mb-3`}>
          {prefix}{count.toLocaleString()}{suffix}
        </p>
        </div>
    </div>
  )
}

export default function StatsSection() {
  const stats = [
    { value: 25000, suffix: ' Cr', prefix: '₹', label: 'Annual CSR Budget in India', color: 'text-primary' },
    { value: 80, suffix: '%', prefix: '', label: 'Reduction in Compliance Time', color: 'text-success' },
    { value: 3, suffix: 'x', prefix: '', label: 'NGO Discovery Rate Increase', color: 'text-accent' },
    { value: 10, suffix: ' min', prefix: '', label: 'Form 10BD Generation Time', color: 'text-secondary' },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-surface-dark to-slate-900" id="impact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary-light uppercase tracking-wider mb-3">
            Impact
          </p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Numbers That Matter
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Measurable impact through AI-powered efficiency and transparency.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <AnimatedCounter
                end={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                color={stat.color}
              />
              <p className="text-slate-400 text-sm font-medium text-center mt-3">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}