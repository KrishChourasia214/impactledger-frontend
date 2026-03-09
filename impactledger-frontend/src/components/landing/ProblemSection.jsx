import { AlertTriangle, Clock, Eye, FileX } from 'lucide-react'
import Card, { CardContent } from '../ui/Card'

export default function ProblemSection() {
  const problems = [
    {
      icon: FileX,
      title: '₹25,000 per Form',
      description: 'Rural NGOs spend ₹15,000-25,000 on legal consultants just for Form 10BD compliance.',
      stat: '80% NGOs',
      statLabel: 'cannot afford compliance help',
      color: 'text-error',
      bg: 'bg-red-50',
    },
    {
      icon: Eye,
      title: 'Invisible NGOs',
      description: '90% of grassroots NGOs have zero visibility to CSR investors due to lack of digital presence.',
      stat: '3.3 Million',
      statLabel: 'registered NGOs in India',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: Clock,
      title: '90 Days Due Diligence',
      description: 'Corporations spend 60-90 days evaluating each NGO manually, delaying critical funding.',
      stat: '₹25,000 Cr',
      statLabel: 'annual CSR budget underutilized',
      color: 'text-primary',
      bg: 'bg-primary/5',
    },
    {
      icon: AlertTriangle,
      title: 'Trust Deficit',
      description: 'No standardized way to verify impact claims, leading to skepticism and funding hesitation.',
      stat: 'Only 10%',
      statLabel: 'NGOs receive CSR funding',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <section className="py-20 bg-slate-50" id="problem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-error uppercase tracking-wider mb-3">
            The Problem
          </p>
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            CSR Funding is Broken in India
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Despite ₹25,000 crore in mandatory CSR spending, grassroots NGOs remain invisible and overwhelmed by compliance.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem) => {
            const Icon = problem.icon
            return (
              <Card key={problem.title} hover className="text-center">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-14 h-14 ${problem.bg} rounded-2xl flex items-center justify-center mx-auto`}>
                    <Icon className={`w-7 h-7 ${problem.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">{problem.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{problem.description}</p>
                  <div className="pt-3 border-t border-slate-100">
                    <p className={`text-2xl font-bold ${problem.color}`}>{problem.stat}</p>
                    <p className="text-xs text-text-muted">{problem.statLabel}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}