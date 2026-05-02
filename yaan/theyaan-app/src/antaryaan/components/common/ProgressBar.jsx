import { motion } from 'framer-motion'

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

const colorGradients = {
  indigo: 'from-indigo-600 to-indigo-400',
  purple: 'from-purple-600 to-purple-400',
  emerald: 'from-emerald-600 to-emerald-400',
  amber: 'from-amber-600 to-amber-400',
  red: 'from-red-600 to-red-400',
  blue: 'from-blue-600 to-blue-400',
  sky: 'from-sky-600 to-sky-400',
  pink: 'from-pink-600 to-pink-400',
}

const colorBg = {
  indigo: 'bg-indigo-950/50',
  purple: 'bg-purple-950/50',
  emerald: 'bg-emerald-950/50',
  amber: 'bg-amber-950/50',
  red: 'bg-red-950/50',
  blue: 'bg-blue-950/50',
  sky: 'bg-sky-950/50',
  pink: 'bg-pink-950/50',
}

function ProgressBar({
  value = 0,
  max = 100,
  color = 'indigo',
  label = '',
  showPercentage = false,
  size = 'md',
  animated = true,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const gradient = colorGradients[color] || colorGradients.indigo
  const bgColor = colorBg[color] || colorBg.indigo
  const heightClass = sizeClasses[size] || sizeClasses.md

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-slate-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-slate-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${bgColor} rounded-full overflow-hidden ${heightClass}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? { duration: 0.8, ease: 'easeOut', delay: 0.1 }
              : { duration: 0 }
          }
        >
          {/* Shimmer effect for animated bars */}
          {animated && percentage > 0 && (
            <div className="w-full h-full relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  animation: 'shimmer 2s infinite',
                }}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Inline keyframes for shimmer */}
      {animated && (
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      )}
    </div>
  )
}

export default ProgressBar
