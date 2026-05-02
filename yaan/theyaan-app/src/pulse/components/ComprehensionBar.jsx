import { motion } from 'framer-motion'

function getColor(value) {
  if (value >= 80) return '#10B981'
  if (value >= 60) return '#F59E0B'
  return '#EF4444'
}

export default function ComprehensionBar({ label, value, color, showLabel = true, height = 'h-2' }) {
  const barColor = color || getColor(value)

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-white/60 truncate">{label}</span>
          <span className="text-sm font-semibold font-mono ml-2" style={{ color: barColor }}>{value}%</span>
        </div>
      )}
      <div className={`w-full ${height} rounded-full bg-white/10 overflow-hidden`}>
        <motion.div
          className={`${height} rounded-full`}
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
