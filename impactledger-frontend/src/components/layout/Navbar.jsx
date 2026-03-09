import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'
import Button from '../ui/Button'
import { cn } from '@/utils/cn'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Impact', href: '#impact' },
    { label: 'For NGOs', href: '#ngo' },
    { label: 'For Corporates', href: '#csr' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">
              Impact<span className="text-primary">Ledger</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button size="sm" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-4 py-2 text-text-secondary hover:text-primary rounded-lg hover:bg-slate-50"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-100 flex gap-3">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button size="sm" className="flex-1" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}