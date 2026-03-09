import { cn } from '@/utils/cn'
import Card from './Card'

export default function StatCard({ title, value, change, changeType, icon: Icon, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-muted font-medium">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
          {change && (
            <p className={cn(
              'text-sm font-medium mt-2 flex items-center gap-1',
              changeType === 'positive' ? 'text-success' : 'text-error'
            )}>
              {changeType === 'positive' ? '↑' : '↓'} {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl', colors[color])}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  )
}