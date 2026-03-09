import { Upload, Brain, Handshake } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      icon: Upload,
      title: 'NGOs Upload & Speak',
      description: 'Upload handwritten receipts or use voice in Hindi/Marathi. Our AI does the rest — no typing, no English required.',
      features: ['📸 Photo Upload', '🎤 Voice Input', '🔄 Offline Support'],
      color: 'from-primary to-teal-400',
    },
    {
      step: '02',
      icon: Brain,
      title: 'AI Processes & Matches',
      description: 'Generative AI extracts data, generates compliance forms, and creates semantic profiles for intelligent matchmaking.',
      features: ['🤖 Auto Form 10BD', '🔍 Semantic Indexing', '📊 SROI Prediction'],
      color: 'from-accent to-purple-400',
    },
    {
      step: '03',
      icon: Handshake,
      title: 'CSR Discovers & Funds',
      description: 'Investors search in natural language, discover high-impact NGOs, and fund projects with full compliance assurance.',
      features: ['💡 Smart Discovery', '✅ Verified Impact', '💰 Direct Funding'],
      color: 'from-secondary to-orange-400',
    },
  ]

  return (
    <section className="py-20" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Three Steps to Impact
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            From handwritten receipts to funded projects — powered by AI, built for India.
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.step} className="relative group">

                {/* Connector line between cards */}
                {step.step !== '03' && (
                  <div className="hidden lg:block absolute top-16 right-0 w-full h-0.5 bg-gradient-to-r from-slate-200 to-slate-100 translate-x-1/2" />
                )}

                <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative z-10 h-full">

                  {/* Step number */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} text-white font-bold text-lg shadow-lg mb-6`}>
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-text-secondary leading-relaxed mb-6">{step.description}</p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2">
                    {step.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs font-medium bg-slate-50 text-text-secondary px-3 py-1.5 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}