import { cn } from '@/utils/cn'

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200/60 shadow-sm',
        hover && 'hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('p-6 pb-0', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}