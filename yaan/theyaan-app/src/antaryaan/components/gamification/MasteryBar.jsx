import { motion } from 'framer-motion'
import { Lock, BookOpen, Dumbbell, CheckCircle2, Star } from 'lucide-react'

const levelConfig = {
  locked: {
    color: 'from-slate-600 to-slate-500',
    bg: 'bg-slate-800/50',
    textColor: 'text-slate-500',
    borderColor: 'border-slate-600/50',
    icon: Lock,
    label: 'Locked',
    glowColor: 'transparent',
  },
  learning: {
    color: 'from-yellow-500 to-amber-400',
    bg: 'bg-yellow-950/30',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-600/40',
    icon: BookOpen,
    label: 'Learning',
    glowColor: 'rgba(234, 179, 8, 0.15)',
  },
  practicing: {
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-950/30',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-600/40',
    icon: Dumbbell,
    label: 'Practicing',
    glowColor: 'rgba(249, 115, 22, 0.15)',
  },
  mastered: {
    color: 'from-emerald-500 to-green-400',
    bg: 'bg-emerald-950/30',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-600/40',
    icon: CheckCircle2,
    label: 'Mastered',
    glowColor: 'rgba(16, 185, 129, 0.15)',
  },
  legendary: {
    color: 'from-yellow-400 to-amber-300',
    bg: 'bg-yellow-950/30',
    textColor: 'text-yellow-300',
    borderColor: 'border-yellow-500/50',
    icon: Star,
    label: 'Legendary',
    glowColor: 'rgba(251, 191, 36, 0.2)',
  },
}

function MasteryBar({ level = 'locked', label = '', percentage = 0 }) {
  const config = levelConfig[level] || levelConfig.locked
  const IconComponent = config.icon
  const clampedPercentage = Math.min(100, Math.max(0, percentage))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border ${config.borderColor} p-3 ${config.bg}`}
      style={{ boxShadow: config.glowColor !== 'transparent' ? `0 0 20px ${config.glowColor}` : 'none' }}
    >
      <div className="flex items-center gap-3">
        {/* Level icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            level === 'legendary'
              ? 'bg-gradient-to-br from-yellow-400/20 to-amber-500/20 ring-1 ring-yellow-400/40'
              : level === 'locked'
                ? 'bg-slate-700/50'
                : `bg-gradient-to-br ${config.color.replace('from-', 'from-').replace('to-', 'to-')}/10`
          }`}
          style={
            level !== 'locked' && level !== 'legendary'
              ? { background: `linear-gradient(135deg, ${config.glowColor}, transparent)` }
              : {}
          }
        >
          <IconComponent
            size={16}
            className={config.textColor}
          />
          {level === 'legendary' && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(251, 191, 36, 0.2), transparent)',
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-slate-200 font-medium truncate">
              {label}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-xs font-medium ${config.textColor}`}>
                {config.label}
              </span>
              {level !== 'locked' && (
                <span className="text-xs text-slate-500">
                  {clampedPercentage}%
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${config.color} rounded-full relative`}
              initial={{ width: 0 }}
              animate={{ width: level === 'locked' ? '0%' : `${clampedPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            >
              {/* Shimmer for mastered+ */}
              {(level === 'mastered' || level === 'legendary') && clampedPercentage > 0 && (
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export { levelConfig }
export default MasteryBar
