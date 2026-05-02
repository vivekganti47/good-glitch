import { motion } from 'framer-motion'

/**
 * Live value display strip for simulation readouts.
 *
 * Shows a horizontal row of small cards with monospace font numbers,
 * formatted to specified decimal places.
 */

function formatValue(value, format) {
  if (value === null || value === undefined) return '--'

  if (typeof format === 'function') {
    return format(value)
  }

  if (typeof format === 'string') {
    // Support format strings like '0.00', '0.000', etc.
    const decimals = (format.split('.')[1] || '').length
    return Number(value).toFixed(decimals)
  }

  if (typeof format === 'number') {
    return Number(value).toFixed(format)
  }

  // Auto format: integers stay as-is, floats get 2 decimal places
  if (Number.isInteger(value)) {
    return String(value)
  }
  return Number(value).toFixed(2)
}

function SimulationReadouts({ readouts = [], isDark = true }) {
  if (readouts.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className={`text-xs font-medium uppercase tracking-wider ${
        isDark ? 'text-slate-500' : 'text-slate-500'
      }`}>
        Live Readouts
      </h4>

      <div className="flex flex-wrap gap-2">
        {readouts.map((readout) => (
          <ReadoutCard key={readout.key} readout={readout} isDark={isDark} />
        ))}
      </div>
    </div>
  )
}

function ReadoutCard({ readout, isDark = true }) {
  const { label, value, unit = '', format } = readout
  const displayValue = formatValue(value, format)

  return (
    <motion.div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
        isDark
          ? 'bg-slate-800/60 border-slate-700/40'
          : 'bg-white border-slate-200'
      }`}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <span className={`text-xs whitespace-nowrap ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}>
        {label}
      </span>
      <div className="flex items-baseline gap-0.5">
        <motion.span
          key={displayValue}
          className={`font-mono text-sm font-semibold tabular-nums ${
            isDark ? 'text-slate-100' : 'text-slate-800'
          }`}
          initial={{ opacity: 0.6, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {displayValue}
        </motion.span>
        {unit && (
          <span className={`text-[10px] font-mono ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {unit}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default SimulationReadouts
