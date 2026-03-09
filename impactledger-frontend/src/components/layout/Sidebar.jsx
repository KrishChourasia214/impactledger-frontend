import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Sparkles, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Sidebar({ items, userType }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-40">

      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary">
            Impact<span className="text-primary">Ledger</span>
          </span>
        </Link>
        <p className="text-xs text-text-muted mt-2 font-medium uppercase tracking-wide">
          {userType === 'ngo' ? '🏘️ NGO Portal' : '🏢 CSR Portal'}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-error transition-all w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  )
}