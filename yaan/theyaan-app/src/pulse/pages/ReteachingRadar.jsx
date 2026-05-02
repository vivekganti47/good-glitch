import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, AlertTriangle, ChevronRight } from 'lucide-react'
import { getClass, classes } from '../data/mockClasses'
import { getTopicsForClass } from '../data/mockTopics'
import { students as allStudents } from '../data/mockStudents'
import { reteachingRecommendations } from '../data/mockInsights'
import HeatMap from '../components/HeatMap'
import ComprehensionBar from '../components/ComprehensionBar'
import TimelineChart from '../components/TimelineChart'

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

const engagementConfig = {
  active: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  passive: { label: 'Passive', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  disengaged: { label: 'Disengaged', color: 'text-red-400', bg: 'bg-red-500/15' },
}

function getScoreColor(value) {
  if (value >= 80) return '#10B981'
  if (value >= 60) return '#F59E0B'
  if (value >= 40) return '#F97316'
  return '#EF4444'
}

export default function ReteachingRadar() {
  const { classId } = useParams()
  const [selectedTopicId, setSelectedTopicId] = useState(null)

  const cls = useMemo(() => getClass(classId), [classId])

  const classTopics = useMemo(
    () => getTopicsForClass(classId),
    [classId],
  )

  const classStudents = useMemo(
    () => allStudents.filter(s => s.classIds.includes(classId)),
    [classId],
  )

  const recs = useMemo(
    () => reteachingRecommendations.filter(r => r.classId === classId),
    [classId],
  )

  // Summary stats
  const topicsTaught = useMemo(
    () => classTopics.filter(t => t.status === 'taught' || t.status === 'in-progress').length,
    [classTopics],
  )

  const needsReteaching = useMemo(
    () => classTopics.filter(t => {
      const comp = t.classComprehension[classId]
      return comp !== undefined && comp > 0 && comp < 60
    }).length,
    [classTopics, classId],
  )

  const averageComprehension = useMemo(() => {
    const withScores = classTopics.filter(t => (t.classComprehension[classId] ?? 0) > 0)
    if (withScores.length === 0) return 0
    const total = withScores.reduce((sum, t) => sum + t.classComprehension[classId], 0)
    return Math.round(total / withScores.length)
  }, [classTopics, classId])

  // Selected topic drill-down data
  const selectedTopic = useMemo(
    () => classTopics.find(t => t.id === selectedTopicId),
    [classTopics, selectedTopicId],
  )

  const studentScoresForTopic = useMemo(() => {
    if (!selectedTopicId) return []
    return classStudents
      .map(s => ({
        ...s,
        topicScore: s.scores[selectedTopicId] ?? null,
      }))
      .filter(s => s.topicScore !== null)
      .sort((a, b) => a.topicScore - b.topicScore)
  }, [classStudents, selectedTopicId])

  // Mock historical trend data for the selected topic
  const trendData = useMemo(() => {
    if (!selectedTopic) return []
    const comp = selectedTopic.classComprehension[classId] ?? 0
    if (comp === 0) return []
    const start = Math.max(10, comp - 15)
    const step = (comp - start) / 7
    return Array.from({ length: 8 }, (_, i) => {
      const base = start + step * i
      // Deterministic noise based on index and topic id length
      const noise = ((i * 7 + (selectedTopic.id.length * 3)) % 7) - 3
      return Math.round(Math.min(100, Math.max(0, base + noise)))
    })
  }, [selectedTopic, classId])

  const trendLabels = useMemo(
    () => ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
    [],
  )

  // Reteaching suggestions filtered to topics < 60%
  const urgentRecs = useMemo(
    () => recs.filter(r => r.comprehension < 60),
    [recs],
  )

  // Not found
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

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/pulse"
              className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors border border-white/10"
            >
              <ArrowLeft size={16} className="text-white/60" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Reteaching Radar
              </h1>
              <p className="text-white/40 text-sm mt-0.5">
                {cls.name} &middot; {cls.subject}
              </p>
            </div>
          </div>

          {/* Class selector tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {classes.map(c => {
              const isActive = c.id === classId
              return (
                <Link
                  key={c.id}
                  to={`/pulse/reteach/${c.id}`}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border
                    ${isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-white/[0.03] text-white/40 border-white/10 hover:bg-white/[0.06] hover:text-white/60'
                    }
                  `}
                >
                  {c.name}
                </Link>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
            Topics Taught
          </div>
          <div className="text-2xl font-black font-mono text-white">
            {topicsTaught}
          </div>
          <div className="text-xs text-white/30 mt-0.5">
            of {classTopics.length} total
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
            Needs Reteaching
          </div>
          <div className="text-2xl font-black font-mono" style={{ color: needsReteaching > 0 ? '#EF4444' : '#10B981' }}>
            {needsReteaching}
          </div>
          <div className="text-xs text-white/30 mt-0.5">
            topics below 60%
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
            Average Comprehension
          </div>
          <div className="text-2xl font-black font-mono" style={{ color: getScoreColor(averageComprehension) }}>
            {averageComprehension}%
          </div>
          <div className="text-xs text-white/30 mt-0.5">
            across all topics
          </div>
        </div>
      </motion.div>

      {/* Heat Map */}
      <motion.div
        variants={itemVariants}
        className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-emerald-400" />
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
            Topic Comprehension Map
          </h2>
        </div>
        <HeatMap
          topics={classTopics}
          classId={classId}
          onTopicClick={setSelectedTopicId}
          selectedTopicId={selectedTopicId}
        />
      </motion.div>

      {/* AI Reteaching Suggestions */}
      {urgentRecs.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">
              AI Reteaching Suggestions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentRecs.map(rec => {
              const topic = classTopics.find(t => t.id === rec.topicId)
              return (
                <motion.div
                  key={rec.topicId}
                  variants={itemVariants}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-5 border-l-4 border-l-amber-500/60"
                >
                  {/* Topic header */}
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                    <span className="text-sm font-semibold text-white/80">
                      {topic?.name || rec.topicId}
                    </span>
                    <span
                      className="ml-auto text-sm font-mono font-bold"
                      style={{ color: getScoreColor(rec.comprehension) }}
                    >
                      {rec.comprehension}%
                    </span>
                  </div>

                  {/* Struggling count */}
                  <p className="text-xs text-white/40 mb-3">
                    {rec.studentsStruggling} of {rec.totalStudents} students struggling
                  </p>

                  {/* AI suggestion */}
                  <div className="flex items-start gap-2 mb-3">
                    <Sparkles size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-white/60 leading-relaxed">
                      {rec.suggestion}
                    </p>
                  </div>

                  {/* Alternate approach */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3 mb-3">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1 font-semibold">
                      Alternate Approach
                    </p>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {rec.alternateApproach}
                    </p>
                  </div>

                  {/* Link to SmartGroups */}
                  <Link
                    to={`/pulse/groups/${classId}`}
                    className="inline-flex items-center gap-1 text-xs text-emerald-400/80 hover:text-emerald-400 transition-colors"
                  >
                    View Smart Groups <ChevronRight size={12} />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Topic Drill-Down */}
      <AnimatePresence mode="wait">
        {selectedTopic && (
          <motion.div
            key={selectedTopicId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-white/[0.03] border border-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 mb-6"
          >
            {/* Topic title and comprehension */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedTopic.name}</h3>
                <p className="text-xs text-white/40 mt-0.5">
                  {selectedTopic.status === 'in-progress' ? 'In Progress' : selectedTopic.status === 'upcoming' ? 'Upcoming' : `Chapter ${selectedTopic.chapter}`}
                  {' '}&middot; {selectedTopic.difficulty}
                </p>
              </div>
              <div className="text-right">
                <div
                  className="text-3xl font-black font-mono"
                  style={{ color: getScoreColor(selectedTopic.classComprehension[classId] ?? 0) }}
                >
                  {selectedTopic.classComprehension[classId] ?? 0}%
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">
                  Comprehension
                </p>
              </div>
            </div>

            {/* Historical trend */}
            {trendData.length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2">
                  Comprehension Trend
                </p>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                  <TimelineChart
                    data={trendData}
                    labels={trendLabels}
                    height={120}
                    color={getScoreColor(selectedTopic.classComprehension[classId] ?? 0)}
                  />
                </div>
              </div>
            )}

            {/* Student breakdown */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-3">
                Student Breakdown ({studentScoresForTopic.length} students)
              </p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {studentScoresForTopic.map(s => {
                  const eng = engagementConfig[s.engagement] || engagementConfig.passive
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2.5"
                    >
                      {/* Student name link */}
                      <Link
                        to={`/pulse/student/${s.id}`}
                        className="text-sm text-white/80 hover:text-emerald-400 transition-colors font-medium w-36 truncate shrink-0"
                      >
                        {s.name}
                      </Link>

                      {/* Score bar */}
                      <div className="flex-1 min-w-0">
                        <ComprehensionBar
                          value={s.topicScore}
                          showLabel={false}
                          height="h-1.5"
                          color={getScoreColor(s.topicScore)}
                        />
                      </div>

                      {/* Score value */}
                      <span
                        className="text-xs font-mono font-bold w-10 text-right shrink-0"
                        style={{ color: getScoreColor(s.topicScore) }}
                      >
                        {s.topicScore}%
                      </span>

                      {/* Engagement badge */}
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${eng.bg} ${eng.color} shrink-0`}>
                        {eng.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        variants={itemVariants}
        className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3"
      >
        <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-2">
          Color Legend
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-emerald-500/30" />
            <span className="text-xs text-white/40">80%+ Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500/40 border border-amber-500/30" />
            <span className="text-xs text-white/40">60-79% Adequate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-orange-500/40 border border-orange-500/30" />
            <span className="text-xs text-white/40">40-59% Needs Work</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500/40 border border-red-500/30" />
            <span className="text-xs text-white/40">&lt;40% Critical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-700/50 border border-slate-600/30" />
            <span className="text-xs text-white/40">Upcoming</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
