import { useParams, Link } from 'react-router-dom'
import { useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Sparkles, Activity, ChevronRight } from 'lucide-react'
import { getClass } from '../data/mockClasses'
import { students as allStudents } from '../data/mockStudents'
import { getTopic } from '../data/mockTopics'
import { aiSuggestions } from '../data/mockInsights'
import usePulseStore from '../stores/pulseStore'
import StudentCard from '../components/StudentCard'
import ComprehensionBar from '../components/ComprehensionBar'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function getPulseColor(engagement) {
  if (engagement > 70) return { ring: '#10B981', glow: 'rgba(16,185,129,0.15)' }
  if (engagement >= 50) return { ring: '#F59E0B', glow: 'rgba(245,158,11,0.15)' }
  return { ring: '#EF4444', glow: 'rgba(239,68,68,0.15)' }
}

function getUrgencyBorder(urgency) {
  if (urgency === 'high') return 'border-l-red-500'
  if (urgency === 'medium') return 'border-l-amber-500'
  return 'border-l-emerald-500'
}

const emotionIndicators = {
  confident: { label: 'Confident', color: 'text-emerald-400' },
  neutral: { label: 'Neutral', color: 'text-slate-400' },
  frustrated: { label: 'Frustrated', color: 'text-red-400' },
  confused: { label: 'Confused', color: 'text-amber-400' },
}

export default function ClassroomPulse() {
  const { classId } = useParams()
  const setSelectedClass = usePulseStore((s) => s.setSelectedClass)

  useEffect(() => { setSelectedClass(classId) }, [classId, setSelectedClass])

  const cls = useMemo(() => getClass(classId), [classId])
  const classStudents = useMemo(
    () => allStudents.filter(s => s.classIds.includes(classId)),
    [classId],
  )
  const currentTopic = useMemo(
    () => (cls ? getTopic(cls.currentTopic) : null),
    [cls],
  )
  const suggestions = useMemo(
    () => aiSuggestions[classId] || [],
    [classId],
  )
  const avgComprehension = useMemo(() => {
    if (classStudents.length === 0) return 0
    const total = classStudents.reduce((sum, s) => sum + s.comprehension, 0)
    return Math.round(total / classStudents.length)
  }, [classStudents])
  const flaggedStudents = useMemo(
    () => classStudents.filter(s => s.comprehension < 50),
    [classStudents],
  )
  const avgEngagement = useMemo(() => {
    if (!classStudents.length) return 0
    const engMap = { active: 100, passive: 50, disengaged: 10 }
    const total = classStudents.reduce((sum, s) => sum + (engMap[s.engagement] ?? 50), 0)
    return Math.round(total / classStudents.length)
  }, [classStudents])

  if (!cls) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Class not found</h2>
          <p className="text-white/50 mb-6">No class exists with ID "{classId}".</p>
          <Link
            to="/pulse"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors text-sm font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const pulseColor = getPulseColor(avgEngagement)

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Bar */}
      <motion.div
        variants={itemVariants}
        className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Class info */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{cls.name}</h1>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium border border-emerald-500/20">
              {cls.subject}
            </span>
            <span className="text-white/40 text-sm">
              {classStudents.length} students
            </span>
          </div>

          {/* Right: Topic + comprehension + links */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-3">
              {currentTopic && (
                <span className="text-sm text-white/60">
                  {currentTopic.name}
                </span>
              )}
              <div className="w-32">
                <ComprehensionBar value={avgComprehension} showLabel={false} height="h-2" />
              </div>
              <span className="text-sm font-mono font-semibold" style={{ color: avgComprehension >= 80 ? '#10B981' : avgComprehension >= 60 ? '#F59E0B' : '#EF4444' }}>
                {avgComprehension}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to={`/pulse/groups/${classId}`}
                className="text-xs text-emerald-400/80 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                Groups <ChevronRight size={12} />
              </Link>
              <Link
                to={`/pulse/reteach/${classId}`}
                className="text-xs text-emerald-400/80 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                Reteach <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Class Pulse Visualization */}
          <motion.div
            variants={itemVariants}
            className="bg-white/[0.03] border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Activity size={18} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                Class Pulse
              </h2>
            </div>
            <div className="flex flex-col items-center py-6">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Outermost ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 opacity-20"
                  style={{ borderColor: pulseColor.ring }}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Middle ring */}
                <motion.div
                  className="absolute inset-4 rounded-full border-2 opacity-40"
                  style={{ borderColor: pulseColor.ring }}
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Inner ring */}
                <motion.div
                  className="absolute inset-8 rounded-full border-2 opacity-60"
                  style={{ borderColor: pulseColor.ring }}
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Center dot */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center z-10"
                  style={{ backgroundColor: pulseColor.glow, boxShadow: `0 0 30px ${pulseColor.glow}` }}
                >
                  <Activity size={20} style={{ color: pulseColor.ring }} />
                </div>
              </div>
              <p className="mt-5 text-sm text-white/50">
                Class Energy:{' '}
                <span className="font-semibold font-mono" style={{ color: pulseColor.ring }}>
                  {avgEngagement}% Engaged
                </span>
              </p>
            </div>
          </motion.div>

          {/* Student Grid */}
          <motion.div variants={itemVariants}>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
              Students
            </h2>
            <motion.div
              className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {classStudents.map(s => (
                <motion.div key={s.id} variants={itemVariants}>
                  <StudentCard student={s} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Topic Progress */}
          {currentTopic && (
            <motion.div
              variants={itemVariants}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-4"
            >
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
                Topic Progress
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">{currentTopic.name}</span>
                  <span className="text-xs font-mono text-white/50">
                    {currentTopic.periodsUsed} of {currentTopic.estimatedPeriods} periods
                  </span>
                </div>
                <ComprehensionBar
                  value={Math.round((currentTopic.periodsUsed / currentTopic.estimatedPeriods) * 100)}
                  showLabel={false}
                  height="h-1.5"
                  color="#6366F1"
                />
                {cls.nextTopic && (
                  <p className="text-xs text-white/40 mt-1">
                    Next: {getTopic(cls.nextTopic)?.name || cls.nextTopic}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* AI Suggestions */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                AI Suggestions
              </h2>
            </div>
            <div className="space-y-3">
              {suggestions.map(sug => (
                <motion.div
                  key={sug.id}
                  variants={itemVariants}
                  className={`bg-white/[0.03] border border-white/10 rounded-xl p-3.5 border-l-4 ${getUrgencyBorder(sug.urgency)}`}
                >
                  <p className="text-xs text-white/70 leading-relaxed">{sug.text}</p>
                  {sug.studentId && (
                    <Link
                      to={`/pulse/student/${sug.studentId}`}
                      className="inline-flex items-center gap-1 mt-2 text-[11px] text-emerald-400/80 hover:text-emerald-400 transition-colors"
                    >
                      View Profile <ChevronRight size={10} />
                    </Link>
                  )}
                </motion.div>
              ))}
              {suggestions.length === 0 && (
                <p className="text-xs text-white/30 text-center py-4">No suggestions at this time.</p>
              )}
            </div>
          </motion.div>

          {/* Flagged Students */}
          {flaggedStudents.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-red-400" />
                <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                  Flagged Students
                </h2>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl divide-y divide-white/5">
                {flaggedStudents.map(s => {
                  const emo = emotionIndicators[s.emotion] || emotionIndicators.neutral
                  return (
                    <Link
                      key={s.id}
                      to={`/pulse/student/${s.id}`}
                      className="flex items-center justify-between p-3 hover:bg-white/[0.03] transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm text-white/80 font-medium">{s.name}</span>
                        <span className={`text-[10px] ${emo.color}`}>{emo.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-red-400">{s.comprehension}%</span>
                        <ChevronRight size={12} className="text-white/20" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
