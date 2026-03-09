import { TrendingUp } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function SROIBadge({ score, confidence = 'medium' }) {
  // Color based on SROI score
  const getColor = () => {
    if (score >= 4) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (score >= 3) return 'bg-primary/10 text-primary border-primary/20'
    if (score >= 2) return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-slate-50 text-slate-600 border-slate-200'
  }

  // Confidence dots
  const confidenceIcon = {
    high: '●●●',
    medium: '●●○',
    low: '●○○',
  }

  return (
    <div className={cn('px-3 py-2 rounded-xl border flex items-center gap-2', getColor())}>
      <TrendingUp className="w-4 h-4" />
      <div className="text-right">
        <p className="text-sm font-bold">{score?.toFixed(1)}x</p>
        <p className="text-[10px] opacity-70">SROI {confidenceIcon[confidence] || '●○○'}</p>
      </div>
    </div>
  )
}