import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const BADGES = {
  'getting-started': { name: 'Getting Started', icon: '\u{1F31F}', description: '3-day streak', color: '#F59E0B' },
  'week-warrior': { name: 'Week Warrior', icon: '\u{2694}\uFE0F', description: '7-day streak', color: '#EF4444' },
  'fortnight-fighter': { name: 'Fortnight Fighter', icon: '\u{1F6E1}\uFE0F', description: '14-day streak', color: '#8B5CF6' },
  'monthly-master': { name: 'Monthly Master', icon: '\u{1F451}', description: '30-day streak', color: '#F59E0B' },
  'dedicated-explorer': { name: 'Dedicated Explorer', icon: '\u{1F680}', description: '60-day streak', color: '#3B82F6' },
  'century-club': { name: 'Century Club', icon: '\u{1F4AF}', description: '100-day streak', color: '#10B981' },
  'kinesis-navigator': { name: 'Kinesis Navigator', icon: '\u{1F9ED}', description: 'Master Kinesis Prime', color: '#F59E0B' },
  'force-initiate': { name: 'Force Initiate', icon: '\u{26A1}', description: 'Master Force Nexus', color: '#EA580C' },
  'energy-master': { name: 'Energy Master', icon: '\u{1F4AB}', description: 'Master Momentum Forge', color: '#FCD34D' },
  'periodic-scholar': { name: 'Periodic Scholar', icon: '\u{1F52C}', description: 'Master Periodic Sanctum', color: '#3B82F6' },
  'bond-architect': { name: 'Bond Architect', icon: '\u{1F517}', description: 'Master Bond Matrix', color: '#06B6D4' },
  'mole-master': { name: 'Mole Master', icon: '\u{2697}\uFE0F', description: 'Master Mole Nebula', color: '#A855F7' },
  'cell-architect': { name: 'Cell Architect', icon: '\u{1F9EC}', description: 'Master Cell Citadel', color: '#10B981' },
  'division-expert': { name: 'Division Expert', icon: '\u{1F504}', description: 'Master Nucleus Archive', color: '#14B8A6' },
  'membrane-master': { name: 'Membrane Master', icon: '\u{1FAE7}', description: 'Master Membrane Gates', color: '#F472B6' },
  'ancient-navigator': { name: 'Ancient Navigator', icon: '\u{1F5FA}\uFE0F', description: 'Complete a Side Quest', color: '#F59E0B' },
  'graph-reader': { name: 'Graph Reader', icon: '\u{1F4CA}', description: 'Master motion graphs', color: '#6366F1' },
  'perfect-score': { name: 'Perfect Score', icon: '\u{1F48E}', description: '100% on a planet', color: '#3B82F6' },
  'speed-demon': { name: 'Speed Demon', icon: '\u{26A1}', description: 'Complete lesson in record time', color: '#EF4444' },
  'first-star': { name: 'First Star', icon: '\u{2B50}', description: 'Complete your first lesson', color: '#FBBF24' },
}

const sizeMap = {
  sm: {
    container: 'w-14 h-14',
    icon: 'text-xl',
    ring: 'w-14 h-14',
    label: 'text-[10px]',
    showLabel: false,
  },
  md: {
    container: 'w-20 h-20',
    icon: 'text-2xl',
    ring: 'w-20 h-20',
    label: 'text-xs',
    showLabel: true,
  },
  lg: {
    container: 'w-28 h-28',
    icon: 'text-4xl',
    ring: 'w-28 h-28',
    label: 'text-sm',
    showLabel: true,
  },
}

function AchievementBadge({ badgeId, unlocked = false, size = 'md' }) {
  const badge = BADGES[badgeId]
  if (!badge) return null

  const sizeConfig = sizeMap[size] || sizeMap.md

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      {/* Badge circle */}
      <div className="relative">
        <motion.div
          className={`${sizeConfig.container} rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300`}
          style={{
            background: unlocked
              ? `radial-gradient(circle at 30% 30%, ${badge.color}40, ${badge.color}15)`
              : 'rgba(51, 65, 85, 0.4)',
            border: unlocked
              ? `2px solid ${badge.color}`
              : '2px solid rgba(71, 85, 105, 0.5)',
          }}
        >
          {/* Glow effect for unlocked */}
          {unlocked && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: `0 0 15px ${badge.color}50, 0 0 30px ${badge.color}20`,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Icon */}
          <span
            className={`${sizeConfig.icon} relative z-10 ${unlocked ? '' : 'grayscale opacity-30'}`}
            style={{ filter: unlocked ? 'none' : 'grayscale(1) brightness(0.5)' }}
          >
            {badge.icon}
          </span>

          {/* Lock overlay for locked badges */}
          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 rounded-full">
              <Lock size={size === 'lg' ? 20 : size === 'sm' ? 10 : 14} className="text-slate-500" />
            </div>
          )}
        </motion.div>

        {/* Shine effect for unlocked */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 40%, ${badge.color}30 50%, transparent 60%)`,
            }}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}
      </div>

      {/* Label */}
      {sizeConfig.showLabel && (
        <div className="text-center max-w-[80px]">
          <p className={`${sizeConfig.label} font-medium ${unlocked ? 'text-slate-200' : 'text-slate-500'} leading-tight truncate`}>
            {badge.name}
          </p>
          {size === 'lg' && (
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
              {badge.description}
            </p>
          )}
        </div>
      )}
    </motion.div>
  )
}

export { BADGES }
export default AchievementBadge
