import { cn } from '@/utils/cn'
import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'transition-all duration-200',
            Icon && 'pl-11',
            error && 'border-error focus:ring-error/20 focus:border-error',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input