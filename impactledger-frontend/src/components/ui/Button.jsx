import { cn } from '@/utils/cn'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30',
  secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white',
  accent: 'bg-accent text-white hover:bg-accent-light shadow-lg shadow-accent/25',
  ghost: 'bg-transparent text-text-secondary hover:bg-slate-100',
  danger: 'bg-error text-white hover:bg-red-600 shadow-lg shadow-error/25',
  success: 'bg-success text-white hover:bg-emerald-600 shadow-lg shadow-success/25',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-9 py-4 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  )
}