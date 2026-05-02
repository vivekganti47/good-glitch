import { motion } from 'framer-motion'
import { Shield, Crown, Gem, Diamond, Sparkles } from 'lucide-react'

const leagueDefs = {
  bronze: {
    name: 'Bronze',
    color: '#CD7F32',
    bg: 'from-amber-800/40 to-amber-700/20',
    border: '#CD7F32',
    icon: Shield,
    textColor: 'text-amber-500',
  },
  silver: {
    name: 'Silver',
    color: '#C0C0C0',
    bg: 'from-slate-500/40 to-slate-400/20',
    border: '#C0C0C0',
    icon: Shield,
    textColor: 'text-slate-300',
  },
  gold: {
    name: 'Gold',
    color: '#FFD700',
    bg: 'from-yellow-600/40 to-yellow-500/20',
    border: '#FFD700',
    icon: Crown,
    textColor: 'text-yellow-400',
  },
  platinum: {
    name: 'Platinum',
    color: '#A5D8FF',
    bg: 'from-sky-600/40 to-sky-500/20',
    border: '#A5D8FF',
    icon: Gem,
    textColor: 'text-sky-300',
  },
  diamond: {
    name: 'Diamond',
    color: '#60A5FA',
    bg: 'from-blue-600/40 to-blue-500/20',
    border: '#60A5FA',
    icon: Diamond,
    textColor: 'text-blue-400',
  },
  champion: {
    name: 'Champion',
    color: '#A855F7',
    bg: 'from-purple-600/40 to-purple-500/20',
    border: '#A855F7',
    icon: Crown,
    textColor: 'text-purple-400',
  },
}

const sizeConfig = {
  sm: {
    container: 'w-7 h-7',
    icon: 12,
    showLabel: false,
    labelClass: '',
  },
  md: {
    container: 'w-10 h-10',
    icon: 18,
    showLabel: true,
    labelClass: 'text-xs',
  },
}

function LeagueBadge({ league = 'bronze', size = 'md' }) {
  const def = leagueDefs[league] || leagueDefs.bronze
  const config = sizeConfig[size] || sizeConfig.md
  const IconComponent = def.icon
  const isChampion = league === 'champion'

  return (
    <motion.div
      className="inline-flex items-center gap-1.5"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {/* Badge circle/shield */}
      <div className="relative">
        <div
          className={`${config.container} rounded-full flex items-center justify-center relative overflow-hidden`}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${def.color}30, ${def.color}10)`,
            border: `2px solid ${def.border}`,
            boxShadow: `0 0 8px ${def.color}25`,
          }}
        >
          <IconComponent
            size={config.icon}
            style={{ color: def.color }}
            className="relative z-10"
          />

          {/* Sparkle for champion */}
          {isChampion && (
            <motion.div
              className="absolute top-0 right-0"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={size === 'sm' ? 6 : 8} style={{ color: def.color }} />
            </motion.div>
          )}
        </div>

        {/* Subtle glow for higher leagues */}
        {(league === 'diamond' || league === 'champion') && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 12px ${def.color}30` }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      {/* League name label */}
      {config.showLabel && (
        <span className={`font-semibold ${def.textColor} ${config.labelClass}`}>
          {def.name}
        </span>
      )}
    </motion.div>
  )
}

export { leagueDefs }
export default LeagueBadge
