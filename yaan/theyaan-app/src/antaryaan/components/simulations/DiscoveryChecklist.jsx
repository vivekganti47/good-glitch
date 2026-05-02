import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Eye, EyeOff } from 'lucide-react'

/**
 * Checklist of discoverable items in a simulation.
 *
 * Each item shows a checkbox (filled when discovered), label,
 * and hint text that can be toggled on hover or tap.
 */
function DiscoveryChecklist({ discoveries = [], isDark = true }) {
  const [expandedHint, setExpandedHint] = useState(null)

  if (discoveries.length === 0) return null

  const discoveredCount = discoveries.filter((d) => d.discovered).length
  const totalCount = discoveries.length

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className={`text-xs font-medium uppercase tracking-wider ${
          isDark ? 'text-slate-500' : 'text-slate-500'
        }`}>
          Discoveries
        </h4>
        <span className={`text-xs font-mono tabular-nums ${
          isDark ? 'text-slate-500' : 'text-slate-500'
        }`}>
          {discoveredCount}/{totalCount}
        </span>
      </div>

      {/* Progress bar */}
      <div className={`w-full h-1 rounded-full overflow-hidden ${
        isDark ? 'bg-slate-800' : 'bg-slate-200'
      }`}>
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${totalCount > 0 ? (discoveredCount / totalCount) * 100 : 0}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-1.5">
        {discoveries.map((discovery, index) => (
          <DiscoveryItem
            key={discovery.id}
            discovery={discovery}
            index={index}
            isHintExpanded={expandedHint === discovery.id}
            onToggleHint={() =>
              setExpandedHint((prev) =>
                prev === discovery.id ? null : discovery.id
              )
            }
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  )
}

function DiscoveryItem({ discovery, index, isHintExpanded, onToggleHint, isDark = true }) {
  const { id, label, hint, discovered } = discovery

  return (
    <motion.div
      className={`flex items-start gap-2.5 px-3 py-2 rounded-lg transition-colors ${
        discovered
          ? isDark
            ? 'bg-amber-500/5 border border-amber-500/15'
            : 'bg-amber-50 border border-amber-200'
          : isDark
            ? 'bg-slate-800/30 border border-slate-700/30'
            : 'bg-slate-50 border border-slate-200'
      }`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Checkbox */}
      <div className="shrink-0 mt-0.5">
        <motion.div
          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
            discovered
              ? isDark
                ? 'bg-amber-500/20 border-amber-500/40'
                : 'bg-amber-100 border-amber-300'
              : isDark
                ? 'bg-slate-800/60 border-slate-600/40'
                : 'bg-white border-slate-300'
          }`}
          animate={discovered ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence>
            {discovered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Check size={13} className={isDark ? 'text-amber-400' : 'text-amber-600'} strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Label and hint */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm leading-snug ${
              discovered
                ? isDark ? 'text-amber-200' : 'text-amber-700'
                : isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {discovered ? label : maskLabel(label)}
          </span>
        </div>

        {/* Hint toggle and content */}
        {hint && !discovered && (
          <>
            <button
              onClick={onToggleHint}
              className={`flex items-center gap-1 mt-1 text-[11px] transition-colors cursor-pointer ${
                isDark
                  ? 'text-slate-500 hover:text-slate-400'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {isHintExpanded ? (
                <>
                  <EyeOff size={11} />
                  Hide hint
                </>
              ) : (
                <>
                  <Eye size={11} />
                  Show hint
                </>
              )}
            </button>

            <AnimatePresence>
              {isHintExpanded && (
                <motion.p
                  className={`text-xs mt-1 leading-relaxed italic ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {hint}
                </motion.p>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Partially masks the discovery label to show it is undiscovered.
 * Keeps the first few characters visible as a teaser.
 */
function maskLabel(label) {
  if (!label || label.length <= 8) return '???'
  const visibleChars = Math.min(6, Math.floor(label.length * 0.3))
  return label.slice(0, visibleChars) + '...'
}

export default DiscoveryChecklist
