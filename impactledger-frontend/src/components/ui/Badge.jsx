import { cn } from '@/utils/cn'

const variants = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  accent: 'bg-indigo-100 text-indigo-700',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}