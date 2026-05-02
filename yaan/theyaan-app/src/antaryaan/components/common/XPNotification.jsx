import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Flame } from 'lucide-react'

function XPNotification({ amount = 0, multiplier = 1, show = false }) {
  const finalAmount = multiplier > 1 ? Math.round(amount * multiplier) : amount

  return (
    <AnimatePresence>
      {show && amount > 0 && (
        <motion.div
          className="fixed top-24 right-8 z-50 flex flex-col items-end gap-1 pointer-events-none"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Main XP display */}
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-md"
            initial={{ x: 30 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Zap size={20} className="text-amber-400 fill-amber-400" />
            <span className="text-xl font-bold text-amber-300">
              +{finalAmount} XP
            </span>
          </motion.div>

          {/* Multiplier bonus display */}
          {multiplier > 1 && (
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20"
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Flame size={14} className="text-orange-400" />
              <span className="text-sm font-medium text-orange-300">
                x{multiplier} Streak Bonus!
              </span>
            </motion.div>
          )}

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400"
              initial={{
                opacity: 0.8,
                x: Math.random() * 40 - 20,
                y: 0,
              }}
              animate={{
                opacity: 0,
                y: -(40 + Math.random() * 60),
                x: Math.random() * 80 - 40,
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                delay: 0.1 + i * 0.08,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default XPNotification
