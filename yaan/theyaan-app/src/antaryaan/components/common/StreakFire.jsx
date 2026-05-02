import { motion } from 'framer-motion'

const sizeConfig = {
  sm: { flame: 18, text: 'text-sm', gap: 'gap-1', container: '' },
  md: { flame: 24, text: 'text-base', gap: 'gap-1.5', container: '' },
  lg: { flame: 36, text: 'text-xl', gap: 'gap-2', container: '' },
}

function StreakFire({ streak = 0, size = 'md', className = '' }) {
  const config = sizeConfig[size] || sizeConfig.md
  const isActive = streak > 0

  return (
    <div className={`inline-flex items-center ${config.gap} ${className}`}>
      {/* Flame icon */}
      <div className="relative">
        {isActive ? (
          <motion.div
            animate={{
              scale: [1, 1.1, 1.05, 1.12, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              width={config.flame}
              height={config.flame}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id={`flame-gradient-${size}`} x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="40%" stopColor="#EA580C" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FCD34D" />
                </linearGradient>
                {/* Glow filter for active streaks */}
                <filter id={`flame-glow-${size}`}>
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M12 2C12 2 7 8 7 12.5C7 15.5 9.24 18 12 18C14.76 18 17 15.5 17 12.5C17 8 12 2 12 2Z"
                fill={`url(#flame-gradient-${size})`}
                filter={streak >= 7 ? `url(#flame-glow-${size})` : undefined}
                animate={{
                  d: [
                    'M12 2C12 2 7 8 7 12.5C7 15.5 9.24 18 12 18C14.76 18 17 15.5 17 12.5C17 8 12 2 12 2Z',
                    'M12 2C12 2 6.5 7.5 6.5 12.5C6.5 15.8 9 18.2 12 18.2C15 18.2 17.5 15.8 17.5 12.5C17.5 7.5 12 2 12 2Z',
                    'M12 2C12 2 7.2 8.2 7.2 12.8C7.2 15.6 9.4 17.8 12 17.8C14.6 17.8 16.8 15.6 16.8 12.8C16.8 8.2 12 2 12 2Z',
                    'M12 2C12 2 7 8 7 12.5C7 15.5 9.24 18 12 18C14.76 18 17 15.5 17 12.5C17 8 12 2 12 2Z',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* Inner flame */}
              <motion.path
                d="M12 8C12 8 10 11 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11 12 8 12 8Z"
                fill="#FEF3C7"
                opacity={0.8}
                animate={{
                  opacity: [0.6, 0.9, 0.7, 0.85, 0.6],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          </motion.div>
        ) : (
          /* Inactive/unlit flame */
          <svg
            width={config.flame}
            height={config.flame}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C12 2 7 8 7 12.5C7 15.5 9.24 18 12 18C14.76 18 17 15.5 17 12.5C17 8 12 2 12 2Z"
              fill="#475569"
              opacity={0.5}
            />
            <path
              d="M12 8C12 8 10 11 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13C14 11 12 8 12 8Z"
              fill="#64748B"
              opacity={0.3}
            />
          </svg>
        )}
      </div>

      {/* Streak number */}
      <span
        className={`font-bold ${config.text} ${
          isActive
            ? streak >= 30
              ? 'text-amber-300'
              : streak >= 7
                ? 'text-orange-400'
                : 'text-orange-300'
            : 'text-slate-500'
        }`}
      >
        {streak}
      </span>
    </div>
  )
}

export default StreakFire
