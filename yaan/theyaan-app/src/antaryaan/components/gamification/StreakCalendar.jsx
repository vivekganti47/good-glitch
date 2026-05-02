import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Snowflake } from 'lucide-react'
import useUserStore from '../../stores/userStore'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function getLastSevenDays() {
  const days = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    days.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.getDay(), // 0=Sun, 1=Mon, ...
      dayLabel: DAY_LABELS[date.getDay() === 0 ? 6 : date.getDay() - 1],
      isToday: i === 0,
    })
  }
  return days
}

function StreakCalendar() {
  const currentStreak = useUserStore((s) => s.currentStreak)
  const lastActivityDate = useUserStore((s) => s.lastActivityDate)
  const streakFreezes = useUserStore((s) => s.streakFreezes)

  const days = useMemo(() => getLastSevenDays(), [])

  // Determine active days based on streak and lastActivityDate.
  // We simulate: if the user has a streak of N and last activity was on date X,
  // then dates from (X - N + 1) through X were active days.
  const activeDays = useMemo(() => {
    if (!lastActivityDate || currentStreak === 0) return new Set()

    const active = new Set()
    const lastDate = new Date(lastActivityDate)

    for (let i = 0; i < currentStreak && i < 7; i++) {
      const d = new Date(lastDate)
      d.setDate(d.getDate() - i)
      active.add(d.toISOString().split('T')[0])
    }
    return active
  }, [lastActivityDate, currentStreak])

  // Simulated streak freeze days (for display purposes, we track if freeze was used)
  // The freeze indicator shows when streakFreezes < max (2) - i.e., a freeze was consumed
  const freezeUsed = streakFreezes < 2

  const today = new Date().toISOString().split('T')[0]
  const isActiveToday = lastActivityDate === today

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Streak count header */}
      <div className="flex items-center gap-2">
        <Flame
          size={18}
          className={currentStreak > 0 ? 'text-orange-400' : 'text-slate-600'}
          fill={currentStreak > 0 ? 'currentColor' : 'none'}
        />
        <span className="text-sm font-semibold text-slate-200">
          {currentStreak} day streak
        </span>
        {streakFreezes > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-full">
            <Snowflake size={10} />
            {streakFreezes}
          </span>
        )}
      </div>

      {/* 7-day circles */}
      <div className="flex items-center gap-2">
        {days.map((day, idx) => {
          const isActive = activeDays.has(day.date)
          const isTodayCircle = day.isToday

          return (
            <motion.div
              key={day.date}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.06, type: 'spring', stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-1"
            >
              {/* Day label */}
              <span className="text-[10px] text-slate-500 font-medium">
                {day.dayLabel}
              </span>

              {/* Circle */}
              <div className="relative">
                <motion.div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg'
                      : 'bg-transparent border-2 border-slate-600/60'
                    }
                  `}
                  style={
                    isActive
                      ? { boxShadow: '0 0 12px rgba(249, 115, 22, 0.3)' }
                      : {}
                  }
                  whileHover={{ scale: 1.1 }}
                >
                  {isActive ? (
                    <Flame size={16} className="text-white" fill="currentColor" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </motion.div>

                {/* Today pulsing border */}
                {isTodayCircle && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: isActiveToday
                        ? 'rgba(249, 115, 22, 0.6)'
                        : 'rgba(148, 163, 184, 0.4)',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 0, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default StreakCalendar
