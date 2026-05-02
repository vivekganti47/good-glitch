import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Check, Zap } from 'lucide-react'
import useUserStore from '../../stores/userStore'

const DAILY_GOAL_XP = 50

function DailyGoal() {
  const todayXP = useUserStore((s) => s.todayXP)

  const progress = Math.min(todayXP, DAILY_GOAL_XP)
  const percentage = Math.min(100, (progress / DAILY_GOAL_XP) * 100)
  const isComplete = progress >= DAILY_GOAL_XP

  // Color transitions: gray -> amber -> green
  const progressColor = useMemo(() => {
    if (percentage >= 100) return { stroke: '#10B981', glow: 'rgba(16, 185, 129, 0.3)' }
    if (percentage >= 60) return { stroke: '#F59E0B', glow: 'rgba(245, 158, 11, 0.2)' }
    if (percentage >= 30) return { stroke: '#F59E0B', glow: 'rgba(245, 158, 11, 0.15)' }
    return { stroke: '#64748B', glow: 'transparent' }
  }, [percentage])

  // SVG arc calculations
  const size = 120
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      className="flex flex-col items-center gap-2"
    >
      {/* Circular progress */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background glow */}
        {percentage > 0 && (
          <div
            className="absolute inset-0 rounded-full blur-xl"
            style={{ background: progressColor.glow }}
          />
        )}

        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(51, 65, 85, 0.5)"
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={progressColor.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Check size={28} className="text-emerald-400" strokeWidth={3} />
                </motion.div>
                <span className="text-[10px] text-emerald-400 font-medium mt-0.5">Done!</span>
              </motion.div>
            ) : (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-bold text-white">{progress}</span>
                  <span className="text-xs text-slate-500">/ {DAILY_GOAL_XP}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Zap size={10} className="text-amber-400" />
                  <span className="text-[10px] text-slate-400">XP</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center gap-1.5">
        <Target size={14} className={isComplete ? 'text-emerald-400' : 'text-slate-400'} />
        <span className={`text-sm font-medium ${isComplete ? 'text-emerald-400' : 'text-slate-300'}`}>
          Daily Goal
        </span>
      </div>
    </motion.div>
  )
}

export default DailyGoal
