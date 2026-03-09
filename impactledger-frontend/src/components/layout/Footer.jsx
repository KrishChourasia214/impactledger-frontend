import { Sparkles, Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-surface-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Impact<span className="text-primary-light">Ledger</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered platform bridging rural NGOs with CSR investors for transparent, impactful funding.
            </p>
          </div>

          {/* For NGOs */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">
              For NGOs
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#" className="hover:text-primary-light transition-colors">Register Your NGO</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Upload Receipts</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Generate Form 10BD</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Voice Data Entry</a></li>
            </ul>
          </div>

          {/* For Corporates */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">
              For Corporates
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#" className="hover:text-primary-light transition-colors">Discover NGOs</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Impact Analytics</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">SROI Predictions</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">CSR Compliance</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-400 mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2025 ImpactLedger. Built for AI for Bharat Hackathon.
          </p>
          <p className="text-sm text-slate-500">
            Powered by AWS AI Services
          </p>
        </div>
      </div>
    </footer>
  )
}