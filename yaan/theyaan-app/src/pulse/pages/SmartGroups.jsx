import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, BarChart3, Shuffle, Sparkles, ArrowLeft } from 'lucide-react'
import usePulseStore from '../stores/pulseStore'
import { getClass } from '../data/mockClasses'
import { getStudent } from '../data/mockStudents'
import { groupingSuggestions } from '../data/mockInsights'
import StudentCard from '../components/StudentCard'

const modes = [
  { key: 'peer-tutoring', label: 'Peer Tutoring', Icon: Users },
  { key: 'skill-level', label: 'Skill Level', Icon: BarChart3 },
  { key: 'mixed-ability', label: 'Mixed Ability', Icon: Shuffle },
]

const accentColors = [
  { border: 'border-emerald-500/40', bg: 'bg-emerald-500/10', text: 'text-emerald-300' },
  { border: 'border-sky-500/40', bg: 'bg-sky-500/10', text: 'text-sky-300' },
  { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-300' },
  { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-300' },
  { border: 'border-pink-500/40', bg: 'bg-pink-500/10', text: 'text-pink-300' },
  { border: 'border-orange-500/40', bg: 'bg-orange-500/10', text: 'text-orange-300' },
]

const accentGradients = [
  'from-emerald-500/60 to-emerald-500/0',
  'from-sky-500/60 to-sky-500/0',
  'from-amber-500/60 to-amber-500/0',
  'from-purple-500/60 to-purple-500/0',
  'from-pink-500/60 to-pink-500/0',
  'from-orange-500/60 to-orange-500/0',
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function SmartGroups() {
  const { classId } = useParams()
  const { groupingMode, setGroupingMode } = usePulseStore()

  const classData = getClass(classId)
  const groups = groupingSuggestions[groupingMode] || []
  const isPeerTutoring = groupingMode === 'peer-tutoring'

  // Collect unique students across all groups for this mode
  const uniqueStudentIds = new Set()
  groups.forEach((g) => g.students.forEach((id) => uniqueStudentIds.add(id)))

  // Collect unique topics
  const uniqueTopics = [...new Set(groups.map((g) => g.topic))]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              to={`/pulse/classroom/${classId}`}
              className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors border border-white/10"
            >
              <ArrowLeft size={16} className="text-white/60" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Smart Groups
              </h1>
              {classData && (
                <p className="text-white/40 text-sm mt-0.5">
                  {classData.name} &middot; {classData.subject}
                </p>
              )}
            </div>
          </div>
          {classData && (
            <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-sm text-white/60">
              {classData.name}
            </div>
          )}
        </motion.div>

        {/* Mode Toggle */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-8">
          {modes.map(({ key, label, Icon }) => {
            const isActive = groupingMode === key
            return (
              <button
                key={key}
                onClick={() => setGroupingMode(key)}
                className={`
                  flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
                  transition-all duration-200 border
                  ${isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-white/[0.03] text-white/40 border-white/10 hover:bg-white/[0.06] hover:text-white/60'
                  }
                `}
              >
                <Icon size={16} />
                {label}
              </button>
            )
          })}
        </motion.div>

        {/* Groups Grid */}
        {groups.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          >
            {groups.map((group, i) => {
              const colorIdx = i % 6
              const accent = accentColors[colorIdx]
              const gradient = accentGradients[colorIdx]
              const students = group.students
                .map((id) => getStudent(id))
                .filter(Boolean)

              return (
                <motion.div
                  key={group.id}
                  variants={itemVariants}
                  className={`
                    relative overflow-hidden rounded-2xl
                    bg-white/[0.03] border border-white/10
                    backdrop-blur-sm p-4
                    hover:border-white/20 transition-all duration-300
                  `}
                >
                  {/* Colored top accent bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient}`}
                  />

                  {/* Group number and topic */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-sm font-semibold ${accent.text}`}>
                      {isPeerTutoring ? `Pair ${i + 1}` : `Group ${i + 1}`}
                    </h3>
                    <span className="bg-emerald-500/10 text-emerald-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize">
                      {group.topic.replace(/-/g, ' ')}
                    </span>
                  </div>

                  {/* Students */}
                  <div className="flex flex-wrap gap-2 mb-1">
                    {students.map((s) => (
                      <StudentCard
                        key={s.id}
                        student={s}
                        size="sm"
                        showIndicators={false}
                      />
                    ))}
                  </div>

                  {/* AI Reasoning */}
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t border-white/5">
                    <Sparkles size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-white/50 leading-relaxed italic">
                      {group.reasoning}
                    </p>
                  </div>

                  {/* Predicted Benefit */}
                  <div className="bg-emerald-500/10 text-emerald-300 text-[11px] font-medium px-3 py-1 rounded-full mt-3 inline-block">
                    {group.predictedBenefit}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
              <Users size={28} className="text-white/20" />
            </div>
            <h3 className="text-white/60 text-lg font-medium mb-1">
              No groups available
            </h3>
            <p className="text-white/30 text-sm max-w-sm">
              There are no grouping suggestions for the current mode yet. Try selecting a different grouping strategy above.
            </p>
          </motion.div>
        )}

        {/* Summary Stats Bar */}
        {groups.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white/[0.03] border border-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          >
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Users size={14} className="text-emerald-400" />
              <span>
                <span className="text-white/80 font-medium">{groups.length}</span>{' '}
                {isPeerTutoring ? 'pairs' : 'groups'} created
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Sparkles size={14} className="text-emerald-400" />
              <span>
                Covers{' '}
                <span className="text-white/80 font-medium">{uniqueStudentIds.size}</span>{' '}
                students
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50">
              <BarChart3 size={14} className="text-emerald-400" />
              <span>
                Based on{' '}
                <span className="text-white/80 font-medium">
                  {uniqueTopics.length > 1 ? 'multiple topics' : uniqueTopics[0]?.replace(/-/g, ' ') || 'analysis'}
                </span>
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
