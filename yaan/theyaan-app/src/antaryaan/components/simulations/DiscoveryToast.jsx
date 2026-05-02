import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Zap } from 'lucide-react'

/**
 * Animated toast notification for simulation discoveries.
 *
 * Slides in from the right with a golden glow effect, shows the
 * discovery label with a lightbulb icon and XP badge.
 * Auto-dismisses after 3 seconds.
 */
function DiscoveryToast({ discovery, xpAmount = 5, onDismiss, show = true }) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (!discovery || !show) return

    // Auto-dismiss after 3 seconds
    timerRef.current = setTimeout(() => {
      if (onDismiss) onDismiss(discovery.id)
    }, 3000)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [discovery, show, onDismiss])

  return (
    <AnimatePresence>
      {discovery && show && (
        <motion.div
          key={discovery.id}
          className="fixed top-20 right-4 z-50 pointer-events-auto max-w-sm"
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 18,
            mass: 0.8,
          }}
        >
          {/* Outer glow container */}
          <div className="relative">
            {/* Golden glow background */}
            <div
              className="absolute inset-0 rounded-xl blur-xl opacity-30"
              style={{
                background: 'radial-gradient(ellipse, rgba(251, 191, 36, 0.5), rgba(245, 158, 11, 0.2), transparent)',
              }}
            />

            {/* Toast content */}
            <div className="relative flex items-start gap-3 px-4 py-3 rounded-xl bg-slate-800/90 border border-amber-500/30 backdrop-blur-md shadow-lg shadow-amber-500/10">
              {/* Lightbulb icon with glow */}
              <div className="shrink-0 mt-0.5">
                <div className="relative">
                  <Lightbulb
                    size={22}
                    className="text-amber-400"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))' }}
                  />
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: '0 0 0 0 rgba(251, 191, 36, 0.4)',
                    }}
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(251, 191, 36, 0.4)',
                        '0 0 0 8px rgba(251, 191, 36, 0)',
                      ],
                    }}
                    transition={{ duration: 1.2, repeat: 2 }}
                  />
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-amber-400/80 uppercase tracking-wider">
                  Discovery!
                </p>
                <p className="text-sm font-medium text-slate-100 mt-0.5 leading-snug">
                  {discovery.label}
                </p>
              </div>

              {/* XP badge */}
              <div className="shrink-0">
                <motion.div
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/25"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                >
                  <Zap size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-300">
                    +{xpAmount} XP
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Floating particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-amber-400/80"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: '50%',
                }}
                initial={{ opacity: 0.8, y: 0, x: 0 }}
                animate={{
                  opacity: 0,
                  y: -(20 + Math.random() * 40),
                  x: (Math.random() - 0.5) * 30,
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.5,
                  delay: 0.2 + i * 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DiscoveryToast
