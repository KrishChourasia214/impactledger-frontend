import { FileSearch, Brain, Mic, Wifi, TrendingUp, Shield } from 'lucide-react'
import Card, { CardContent } from '../ui/Card'

export default function FeaturesSection() {
  const features = [
    {
      icon: FileSearch,
      title: 'AI Compliance Automation',
      description: 'Upload handwritten receipts and let AI generate Form 10BD, annual reports, and tax documents automatically.',
      tag: 'AWS Textract + Bedrock',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Brain,
      title: 'Semantic Matchmaking',
      description: 'CSR investors search in natural language. Our vector engine finds NGOs by impact stories, not just keywords.',
      tag: 'Vector Search + AI',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: Mic,
      title: 'Voice-First Interface',
      description: 'NGO workers speak in Hindi, Marathi, or Tamil. AI transcribes, translates, and structures the data.',
      tag: 'AWS Transcribe + Polly',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      icon: Wifi,
      title: 'Offline-First Design',
      description: 'Works on 2G/3G networks. Capture data offline, sync when connected. Built for rural India.',
      tag: 'Progressive Web App',
      color: 'bg-cyan-100 text-cyan-700',
    },
    {
      icon: TrendingUp,
      title: 'Predictive SROI',
      description: 'AI predicts Social Return on Investment before funding, helping corporations maximize impact.',
      tag: 'Machine Learning',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      icon: Shield,
      title: 'DPDP Compliant Security',
      description: 'End-to-end encryption, data localization in India, and complete audit trails for 7 years.',
      tag: 'AWS KMS + WAF',
      color: 'bg-purple-100 text-purple-700',
    },
  ]

  return (
    <section className="py-20 bg-slate-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            AI That Powers Real Impact
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Every feature is designed with two users in mind: the NGO worker in a village and the CSR head in a boardroom.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} hover>
                <CardContent className="p-8 space-y-4">
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">{feature.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                  <span className="inline-block text-xs font-semibold bg-slate-100 text-text-muted px-3 py-1.5 rounded-full">
                    {feature.tag}
                  </span>
                </CardContent>
              </Card>
            )
          })}
        </div>

      </div>
    </section>
  )
}