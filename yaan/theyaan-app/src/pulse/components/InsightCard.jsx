import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, TrendingUp, Users, ChevronRight } from 'lucide-react'

const iconMap = {
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  Users,
}

const priorityStyles = {
  high: 'border-l-red-500/60',
  medium: 'border-l-amber-500/60',
  low: 'border-l-emerald-500/60',
}

const iconColors = {
  attention: 'text-red-400',
  reteach: 'text-amber-400',
  positive: 'text-emerald-400',
  grouping: 'text-sky-400',
}

export default function InsightCard({ type, icon, title, description, priority, actionLabel, actionRoute }) {
  const Icon = iconMap[icon] || AlertTriangle
  const borderClass = priorityStyles[priority] || priorityStyles.medium

  return (
    <div className={`p-4 bg-white/[0.03] border border-white/10 border-l-4 ${borderClass} rounded-xl`}>
      <div className="flex items-start gap-3 mb-2">
        <div className={`mt-0.5 ${iconColors[type] || 'text-white/40'}`}>
          <Icon size={16} />
        </div>
        <h4 className="text-sm font-semibold text-white/90 leading-tight">{title}</h4>
      </div>
      <p className="text-xs text-white/40 leading-relaxed mb-3 ml-7">{description}</p>
      {actionLabel && actionRoute && (
        <Link
          to={actionRoute}
          className="ml-7 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {actionLabel}
          <ChevronRight size={12} />
        </Link>
      )}
    </div>
  )
}
