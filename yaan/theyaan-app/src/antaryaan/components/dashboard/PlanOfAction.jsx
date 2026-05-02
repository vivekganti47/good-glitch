import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Calendar, CalendarDays, CalendarRange, Clock, Play, RefreshCw,
  ChevronLeft, ChevronRight, Sparkles, Target, CheckCircle2,
  Atom, FlaskConical, Dna
} from 'lucide-react'
import useProgressStore from '../../stores/progressStore'
import usePlannerStore from '../../stores/plannerStore'
import useThemeStore from '../../stores/themeStore'

const viewModes = [
  { id: 'day', label: 'Day', icon: Calendar },
  { id: 'week', label: 'Week', icon: CalendarDays },
  { id: 'month', label: 'Month', icon: CalendarRange },
]

const subjectIcons = {
  physics: Atom,
  chemistry: FlaskConical,
  biology: Dna,
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Dna,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// --- Day View ---
function DayView({ plan, onStartLesson, isDark }) {
  const hasContent = plan.reviews.length > 0 || plan.newLessons.length > 0

  if (!hasContent) {
    return (
      <motion.div
        variants={itemVariants}
        className="text-center py-12"
      >
        <CheckCircle2 className={`w-12 h-12 mx-auto mb-3 ${
          isDark ? 'text-emerald-400/40' : 'text-emerald-500/50'
        }`} />
        <p className={isDark ? 'text-white/60' : 'text-slate-600'}>
          You're all caught up for today!
        </p>
        <p className={`text-sm mt-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
          Start exploring new topics
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Time estimate */}
      <motion.div
        variants={itemVariants}
        className={`flex items-center gap-2 text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}
      >
        <Clock className="w-4 h-4" />
        <span>Estimated time: <strong className={isDark ? 'text-white/80' : 'text-slate-700'}>
          {plan.estimatedMinutes} min
        </strong></span>
      </motion.div>

      {/* Due Reviews */}
      {plan.reviews.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="w-4 h-4 text-violet-500" />
            <span className={`text-sm font-medium ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>
              Due for Review
            </span>
          </div>
          <div className="space-y-2">
            {plan.reviews.map((item, i) => (
              <div
                key={`review-${i}`}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  isDark
                    ? 'bg-violet-500/10 border-violet-500/20'
                    : 'bg-violet-50 border-violet-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-violet-500/20' : 'bg-violet-100'
                  }`}>
                    <RefreshCw className="w-4 h-4 text-violet-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
                      {item.name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                      {item.estimatedMinutes} min review
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onStartLesson(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isDark
                      ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
                      : 'bg-violet-100 text-violet-600 hover:bg-violet-200'
                  }`}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* New Lessons */}
      {plan.newLessons.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className={`text-sm font-medium ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
              Today's Lessons
            </span>
          </div>
          <div className="space-y-2">
            {plan.newLessons.map((item, i) => {
              const SubjectIcon = subjectIcons[item.subject] || Target
              return (
                <div
                  key={`lesson-${i}`}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                    isDark
                      ? 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <SubjectIcon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
                        {item.name}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                        {item.constellationName} &middot; {item.estimatedMinutes} min
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStartLesson(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isDark
                        ? 'bg-white/10 text-white/80 hover:bg-white/15'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    Start
                  </button>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// --- Week View ---
function WeekView({ weekPlan, selectedDate, onSelectDay, isDark }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Week strip */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2">
        {weekPlan.map((day) => {
          const isSelected = day.date === selectedDate
          const SubjectIcon = subjectIcons[day.primarySubject] || Target
          const subjectColors = {
            physics: '#F59E0B',
            chemistry: '#10B981',
            biology: '#8B5CF6',
          }
          const color = subjectColors[day.primarySubject] || '#6B7280'

          return (
            <button
              key={day.date}
              onClick={() => onSelectDay(day.date)}
              className={`flex-shrink-0 w-20 p-3 rounded-xl border transition-all duration-200
                ${isSelected
                  ? isDark
                    ? 'bg-white/10 border-white/30'
                    : 'bg-slate-100 border-slate-300'
                  : isDark
                    ? 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }
                ${day.isToday ? 'ring-2 ring-amber-500/40' : ''}`}
            >
              <p className={`text-xs font-medium mb-1 ${
                day.isToday
                  ? 'text-amber-500'
                  : isDark ? 'text-white/50' : 'text-slate-500'
              }`}>
                {day.dayName}
              </p>
              <p className={`text-lg font-bold mb-2 ${
                isSelected
                  ? isDark ? 'text-white' : 'text-slate-800'
                  : isDark ? 'text-white/70' : 'text-slate-600'
              }`}>
                {day.dayNumber}
              </p>
              <div
                className="w-6 h-6 mx-auto rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <SubjectIcon className="w-3 h-3" style={{ color }} />
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                {day.plannedTopics} topics
              </p>
            </button>
          )
        })}
      </motion.div>

      {/* Week summary */}
      <motion.div
        variants={itemVariants}
        className={`p-4 rounded-xl border ${
          isDark
            ? 'bg-white/[0.03] border-white/10'
            : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          This Week's Focus
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {['physics', 'chemistry', 'biology'].map((subject) => {
            const SubjectIcon = subjectIcons[subject]
            const colors = { physics: '#F59E0B', chemistry: '#10B981', biology: '#8B5CF6' }
            const names = { physics: 'Physics', chemistry: 'Chemistry', biology: 'Biology' }
            const daysWithSubject = weekPlan.filter(d => d.primarySubject === subject).length

            return (
              <div key={subject} className="text-center">
                <div
                  className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${colors[subject]}15` }}
                >
                  <SubjectIcon className="w-5 h-5" style={{ color: colors[subject] }} />
                </div>
                <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                  {names[subject]}
                </p>
                <p className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                  {daysWithSubject} days
                </p>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

// --- Month View ---
function MonthView({ calendar, milestones, onSelectDay, onPrevMonth, onNextMonth, isDark }) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Month navigation */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
          }`}
        >
          <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-slate-500'}`} />
        </button>
        <h3 className={`text-lg font-bold ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
          {calendar.monthName} {calendar.year}
        </h3>
        <button
          onClick={onNextMonth}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
          }`}
        >
          <ChevronRight className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-slate-500'}`} />
        </button>
      </motion.div>

      {/* Calendar grid */}
      <motion.div variants={itemVariants}>
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((name) => (
            <div key={name} className={`text-center text-xs py-2 ${
              isDark ? 'text-white/40' : 'text-slate-500'
            }`}>
              {name}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendar.days.map((day, i) => {
            if (day.empty) {
              return <div key={`empty-${i}`} className="aspect-square" />
            }

            const hasMilestone = milestones.some(m => m.targetDate === day.date)

            return (
              <button
                key={day.date}
                onClick={() => onSelectDay(day.date)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center
                  text-sm transition-all duration-200 relative
                  ${day.isToday
                    ? isDark
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-amber-100 border border-amber-300 text-amber-700'
                    : day.isSelected
                      ? isDark
                        ? 'bg-white/15 border border-white/30 text-white'
                        : 'bg-slate-200 border border-slate-300 text-slate-800'
                      : day.isPast
                        ? isDark
                          ? 'text-white/30 hover:bg-white/5'
                          : 'text-slate-400 hover:bg-slate-50'
                        : isDark
                          ? 'text-white/70 hover:bg-white/10'
                          : 'text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {day.dayNumber}
                {hasMilestone && (
                  <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <motion.div variants={itemVariants}>
          <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
            Upcoming Milestones
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {milestones.slice(0, 4).map((milestone) => (
              <div
                key={milestone.constellationId}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  isDark
                    ? 'bg-white/[0.03] border-white/10'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${milestone.color}20` }}
                  >
                    <Target className="w-4 h-4" style={{ color: milestone.color }} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
                      {milestone.constellationName}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                      Target: {new Date(milestone.targetDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: milestone.color }}>
                    {milestone.progress}%
                  </p>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                    {milestone.completedStars}/{milestone.totalStars}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// --- Main Component ---
export default function PlanOfAction() {
  const navigate = useNavigate()
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  const {
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,
    generateDailyPlan,
    generateWeeklyPlan,
    generateMonthlyMilestones,
    getMonthCalendar,
    prevMonth,
    nextMonth,
  } = usePlannerStore()

  const progressStore = useProgressStore()

  const dailyPlan = useMemo(
    () => generateDailyPlan(progressStore),
    [generateDailyPlan, progressStore]
  )

  const weeklyPlan = useMemo(
    () => generateWeeklyPlan(progressStore),
    [generateWeeklyPlan, progressStore]
  )

  const monthlyMilestones = useMemo(
    () => generateMonthlyMilestones(progressStore),
    [generateMonthlyMilestones, progressStore]
  )

  const monthCalendar = useMemo(() => getMonthCalendar(), [getMonthCalendar, selectedDate])

  const handleStartLesson = (item) => {
    if (item.type === 'review') {
      navigate('/antaryaan/review')
    } else if (item.starId) {
      navigate(`/antaryaan/star/${item.constellationId}/${item.starId}`)
    }
  }

  const handleSelectDay = (date) => {
    setSelectedDate(date)
    setViewMode('day')
  }

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDark
          ? 'border-white/10'
          : 'border-slate-200 shadow-sm'
      }`}
      style={{
        background: isDark
          ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
          : 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)'
      }}
    >
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDark ? 'border-white/10' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isDark
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
              : 'bg-gradient-to-br from-amber-100 to-orange-100'
          }`}>
            <Target className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
          </div>
          <div>
            <h2 className={`font-bold ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
              Your Learning Plan
            </h2>
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-slate-100 border-slate-200'
        }`}>
          {viewModes.map((mode) => {
            const Icon = mode.icon
            const isActive = viewMode === mode.id
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  transition-all duration-200
                  ${isActive
                    ? isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-white text-slate-800 shadow-sm'
                    : isDark
                      ? 'text-white/50 hover:text-white/70'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {mode.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {viewMode === 'day' && (
            <motion.div
              key="day"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DayView plan={dailyPlan} onStartLesson={handleStartLesson} isDark={isDark} />
            </motion.div>
          )}

          {viewMode === 'week' && (
            <motion.div
              key="week"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <WeekView
                weekPlan={weeklyPlan}
                selectedDate={selectedDate}
                onSelectDay={handleSelectDay}
                isDark={isDark}
              />
            </motion.div>
          )}

          {viewMode === 'month' && (
            <motion.div
              key="month"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <MonthView
                calendar={monthCalendar}
                milestones={monthlyMilestones}
                onSelectDay={handleSelectDay}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
                isDark={isDark}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
