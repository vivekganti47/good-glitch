import { motion } from 'framer-motion'
import { Flame, Star, Crown, Trophy, Sparkles, Zap } from 'lucide-react'

const badgeConfig = {
  xp: {
    colors: 'from-amber-500 to-yellow-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    textColor: 'text-amber-400',
    icon: Zap,
  },
  streak: {
    colors: 'from-orange-500 to-red-400',
    bg: 'bg-orange-500/10 border-orange-500/30',
    textColor: 'text-orange-400',
    icon: Flame,
  },
  mastery: {
    colors: 'from-purple-500 to-violet-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
    textColor: 'text-purple-400',
    icon: Crown,
  },
  level: {
    colors: 'from-indigo-500 to-blue-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
    textColor: 'text-indigo-400',
    icon: Star,
  },
  achievement: {
    colors: 'from-emerald-500 to-green-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    textColor: 'text-emerald-400',
    icon: Trophy,
  },
}

function Badge({
  type = 'xp',
  label = '',
  value = '',
  icon: CustomIcon,
  pulse = false,
  size = 'md',
  className = '',
}) {
  const config = badgeConfig[type] || badgeConfig.xp
  const IconComponent = CustomIcon || config.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  }

  return (
    <motion.div
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      initial={pulse ? { scale: 0.8, opacity: 0 } : false}
      animate={
        pulse
          ? {
              scale: [0.8, 1.1, 1],
              opacity: [0, 1, 1],
            }
          : {}
      }
      transition={
        pulse
          ? { duration: 0.5, ease: 'easeOut' }
          : {}
      }
    >
      {/* Icon with gradient-colored glow */}
      <span className={`flex items-center ${config.textColor}`}>
        <IconComponent size={iconSizes[size] || 14} />
      </span>

      {/* Value */}
      {value !== '' && value !== null && (
        <span className={`font-semibold ${config.textColor}`}>{value}</span>
      )}

      {/* Label */}
      {label && <span className="text-slate-300">{label}</span>}

      {/* Pulse animation ring for new badges */}
      {pulse && (
        <motion.div
          className={`absolute inset-0 rounded-full border ${config.bg}`}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: 2 }}
          style={{ position: 'absolute' }}
        />
      )}
    </motion.div>
  )
}

export { badgeConfig }
export default Badge
