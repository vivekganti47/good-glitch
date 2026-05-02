import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Star, TrendingUp, Sparkles } from 'lucide-react'

function AnimatedNumber({ value, duration = 600, delay = 0 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = performance.now()
      const animate = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(Math.round(eased * value))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, duration, delay])

  return <>{display}</>
}

const lineVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
}

function XPBreakdown({ baseXP = 0, bonuses = [], multiplier = 1.0, totalXP = 0 }) {
  const hasMultiplier = multiplier > 1.0
  const subtotal = baseXP + bonuses.reduce((sum, b) => sum + b.amount, 0)

  // Calculate total items for stagger animation indexing
  let lineIndex = 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-700/40 bg-gradient-to-r from-amber-900/20 to-transparent">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-400" />
          <h4 className="text-sm font-semibold text-amber-300">XP Earned</h4>
        </div>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Base XP */}
        <motion.div
          className="flex items-center justify-between"
          custom={lineIndex++}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-slate-400" />
            <span className="text-sm text-slate-300">Base XP</span>
          </div>
          <span className="text-sm font-semibold text-slate-200">
            +<AnimatedNumber value={baseXP} delay={lineIndex * 150} />
          </span>
        </motion.div>

        {/* Bonus lines */}
        {bonuses.map((bonus, idx) => {
          const currentIndex = lineIndex++
          return (
            <motion.div
              key={bonus.label + idx}
              className="flex items-center justify-between"
              custom={currentIndex}
              variants={lineVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-2">
                <Star size={14} className="text-amber-400" />
                <span className="text-sm text-slate-300">{bonus.label}</span>
              </div>
              <span className="text-sm font-semibold text-amber-400">
                +<AnimatedNumber value={bonus.amount} delay={currentIndex * 150} />
              </span>
            </motion.div>
          )
        })}

        {/* Multiplier */}
        {hasMultiplier && (
          <motion.div
            className="flex items-center justify-between pt-2 border-t border-slate-700/40"
            custom={lineIndex++}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-purple-400" />
              <span className="text-sm text-purple-300">Streak Multiplier</span>
            </div>
            <motion.span
              className="text-sm font-bold text-purple-400"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ delay: lineIndex * 0.15, duration: 0.4 }}
            >
              x{multiplier.toFixed(1)}
            </motion.span>
          </motion.div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-600/50 pt-3">
          {/* Total */}
          <motion.div
            className="flex items-center justify-between"
            custom={lineIndex++}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="text-base font-semibold text-white">Total</span>
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: lineIndex * 0.15, type: 'spring', stiffness: 300 }}
            >
              <Zap size={14} className="text-amber-400" fill="currentColor" />
              <span className="text-base font-bold text-amber-300">
                +<AnimatedNumber value={totalXP} duration={800} delay={lineIndex * 150} />
              </span>
              <span className="text-xs text-amber-400/70">XP</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default XPBreakdown
