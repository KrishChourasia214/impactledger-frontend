import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Play, Sparkles, TrendingUp, Shield } from 'lucide-react'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'

const DEMO_VIDEO_EMBED_URL = 'https://drive.google.com/file/d/1GgrorkejQN2-XIDARQqHTuwNnq7ujfu-/preview'

export default function HeroSection() {
  const navigate = useNavigate()
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-accent/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="primary" className="px-4 py-2">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered CSR Platform
            </Badge>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight">
              Bridging{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Rural NGOs
              </span>{' '}
              with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">
                CSR Impact
              </span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed max-w-xl">
              ImpactLedger uses Generative AI to automate compliance, enable semantic discovery,
              and provide voice-first interfaces — making CSR funding accessible to every
              grassroots organization in India.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" icon={ArrowRight} onClick={() => navigate('/register')}>
                Get Started Free
              </Button>
              <Button variant="secondary" size="lg" icon={Play} onClick={() => setDemoModalOpen(true)}>
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm text-text-muted">DPDP Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm text-text-muted">Powered by AWS</span>
              </div>
            </div>
          </div>

          {/* Right Visual - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-slate-200/50 p-2 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Mock Dashboard */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 space-y-4">
                {/* Header bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="h-4 w-32 bg-slate-200 rounded-full" />
                </div>

                {/* Mock stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'NGOs Found', value: '2,847', color: 'text-primary' },
                    { label: 'SROI Score', value: '4.2x', color: 'text-success' },
                    { label: 'Match Rate', value: '89%', color: 'text-accent' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Mock chart area */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div className="flex items-end gap-2 h-24">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 95, 75, 88, 92].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary to-primary-light rounded-t-sm opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mt-2 text-center">Impact Growth Over 12 Months</p>
                </div>

                {/* Mock NGO card */}
                <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    💧
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">Water Warriors Foundation</p>
                    <p className="text-xs text-text-muted">Maharashtra • 89% match</p>
                  </div>
                  <div className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-lg">
                    SROI 4.2x
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge - top left */}
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-slate-100">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">📸</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">Receipt Scanned</p>
                <p className="text-xs text-success">AI Processed ✓</p>
              </div>
            </div>

            {/* Floating badge - bottom right */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-slate-100">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎤</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-primary">Voice Input</p>
                <p className="text-xs text-accent">Hindi • Marathi</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Watch Demo Video Modal */}
      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title="Watch Demo"
        size="video"
      >
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
          <iframe
            src={DEMO_VIDEO_EMBED_URL}
            title="ImpactLedger Demo"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </Modal>
    </section>
  )
}