import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import useUserStore from '../../stores/userStore'
import AchievementBadge, { BADGES } from './AchievementBadge'

const allBadgeIds = Object.keys(BADGES)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
}

function AchievementGrid() {
  const badges = useUserStore((s) => s.badges)
  const unlockedCount = badges.length
  const totalCount = allBadgeIds.length

  // Sort: unlocked first, then locked
  const sortedBadgeIds = [...allBadgeIds].sort((a, b) => {
    const aUnlocked = badges.includes(a)
    const bUnlocked = badges.includes(b)
    if (aUnlocked && !bUnlocked) return -1
    if (!aUnlocked && bUnlocked) return 1
    return 0
  })

  const completionPercentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Trophy size={18} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Achievements</h3>
              <p className="text-xs text-slate-400">
                {unlockedCount} / {totalCount} Unlocked
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-amber-400">{completionPercentage}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
      </div>

      {/* Badge Grid */}
      <motion.div
        className="p-5 grid grid-cols-4 sm:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedBadgeIds.map((badgeId) => (
          <motion.div key={badgeId} variants={itemVariants}>
            <AchievementBadge
              badgeId={badgeId}
              unlocked={badges.includes(badgeId)}
              size="md"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default AchievementGrid
