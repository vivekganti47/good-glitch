import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Menu, X, Search, ChevronDown, ChevronRight,
  Atom, FlaskConical, Dna, Circle, CheckCircle2
} from 'lucide-react'
import useProgressStore from '../../stores/progressStore'
import usePlannerStore from '../../stores/plannerStore'
import useThemeStore from '../../stores/themeStore'

const subjectConfig = {
  physics: {
    id: 'physics',
    name: 'Physics',
    icon: Atom,
    color: '#F59E0B',
    galaxyId: 'newtonian-dominion',
  },
  chemistry: {
    id: 'chemistry',
    name: 'Chemistry',
    icon: FlaskConical,
    color: '#10B981',
    galaxyId: 'elemental-expanse',
  },
  biology: {
    id: 'biology',
    name: 'Biology',
    icon: Dna,
    color: '#8B5CF6',
    galaxyId: 'living-nexus',
  },
}

const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  closed: {
    x: -320,
    opacity: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

const listVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
}

const itemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -10 },
}

function TopicItem({ topic, onClick, isDark }) {
  const statusColors = {
    mastered: '#10B981',
    practicing: '#F59E0B',
    'needs-focus': '#EF4444',
    'not-started': '#6B7280',
  }

  const statusIcons = {
    mastered: CheckCircle2,
    practicing: Circle,
    'needs-focus': Circle,
    'not-started': Circle,
  }

  const StatusIcon = statusIcons[topic.status] || Circle
  const color = statusColors[topic.status] || '#6B7280'

  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
        transition-colors group ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'
        }`}
    >
      <StatusIcon
        className="w-4 h-4 shrink-0"
        style={{ color }}
        fill={topic.status === 'mastered' ? color : 'none'}
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate transition-colors ${
          isDark
            ? 'text-white/80 group-hover:text-white'
            : 'text-slate-700 group-hover:text-slate-900'
        }`}>
          {topic.name}
        </p>
        <p className={`text-xs truncate ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          {topic.constellationName}
        </p>
      </div>
      {topic.accuracy > 0 && (
        <span
          className="text-xs px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {topic.accuracy}%
        </span>
      )}
    </motion.button>
  )
}

function SubjectSection({ subject, topics, isExpanded, onToggle, onTopicClick, isDark }) {
  const config = subjectConfig[subject]
  const Icon = config.icon

  const stats = useMemo(() => ({
    mastered: topics.filter(t => t.status === 'mastered').length,
    practicing: topics.filter(t => t.status === 'practicing').length,
    needsFocus: topics.filter(t => t.status === 'needs-focus' || t.status === 'not-started').length,
  }), [topics])

  return (
    <div className={`border-b last:border-0 ${isDark ? 'border-white/5' : 'border-slate-200/80'}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
          isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
        }`}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color: config.color }} />
        </div>
        <div className="flex-1 text-left">
          <p className={`font-medium ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
            {config.name}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-500">{stats.mastered}</span>
            <span className={isDark ? 'text-white/20' : 'text-slate-300'}>|</span>
            <span className="text-amber-500">{stats.practicing}</span>
            <span className={isDark ? 'text-white/20' : 'text-slate-300'}>|</span>
            <span className="text-red-500">{stats.needsFocus}</span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={listVariants}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-0.5">
              {topics.map((topic) => (
                <TopicItem
                  key={topic.id}
                  topic={topic}
                  onClick={() => onTopicClick(topic)}
                  isDark={isDark}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MasteryStatsFooter({ stats, isDark }) {
  return (
    <div className={`p-4 border-t ${
      isDark
        ? 'border-white/10 bg-white/[0.02]'
        : 'border-slate-200 bg-slate-50/80'
    }`}>
      <p className={`text-xs uppercase tracking-wider mb-3 font-medium ${
        isDark ? 'text-white/40' : 'text-slate-500'
      }`}>
        Overall Progress
      </p>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-500">{stats.mastered}</div>
          <div className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Mastered</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-amber-500">{stats.practicing}</div>
          <div className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Practicing</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-500">{stats.needsFocus + stats.notStarted}</div>
          <div className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>To Learn</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`mt-3 h-2 rounded-full overflow-hidden flex ${
        isDark ? 'bg-white/10' : 'bg-slate-200'
      }`}>
        <div
          className="h-full bg-emerald-500"
          style={{ width: `${(stats.mastered / stats.total) * 100}%` }}
        />
        <div
          className="h-full bg-amber-500"
          style={{ width: `${(stats.practicing / stats.total) * 100}%` }}
        />
        <div
          className="h-full bg-red-500"
          style={{ width: `${(stats.needsFocus / stats.total) * 100}%` }}
        />
      </div>
      <p className={`text-xs mt-2 text-center ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
        {stats.total} total topics
      </p>
    </div>
  )
}

export default function TopicSidebar() {
  const navigate = useNavigate()
  const [searchFilter, setSearchFilter] = useState('')
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  const {
    sidebarOpen,
    toggleSidebar,
    expandedSubjects,
    toggleSubjectExpanded,
  } = usePlannerStore()

  const {
    getTopicsBySubject,
    getMasteryStats,
    initDemoMastery,
  } = useProgressStore()

  // Initialize demo data on first render
  useMemo(() => {
    initDemoMastery()
  }, [initDemoMastery])

  const topicsBySubject = useMemo(() => getTopicsBySubject(), [getTopicsBySubject])
  const masteryStats = useMemo(() => getMasteryStats(), [getMasteryStats])

  // Filter topics by search
  const filteredTopics = useMemo(() => {
    if (!searchFilter.trim()) return topicsBySubject

    const query = searchFilter.toLowerCase()
    return {
      physics: topicsBySubject.physics.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.constellationName.toLowerCase().includes(query)
      ),
      chemistry: topicsBySubject.chemistry.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.constellationName.toLowerCase().includes(query)
      ),
      biology: topicsBySubject.biology.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.constellationName.toLowerCase().includes(query)
      ),
    }
  }, [topicsBySubject, searchFilter])

  const handleTopicClick = (topic) => {
    navigate(`/antaryaan/constellation/${topic.constellationId}`)
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-50 p-2.5 rounded-xl border
          transition-all duration-300 backdrop-blur-sm
          ${isDark
            ? 'bg-white/10 border-white/10 hover:bg-white/15'
            : 'bg-white/80 border-slate-200 hover:bg-white shadow-sm'
          }
          ${sidebarOpen ? 'left-[296px] top-20' : 'left-4 top-20'}`}
        style={{
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {sidebarOpen ? (
          <X className={`w-5 h-5 ${isDark ? 'text-white/70' : 'text-slate-600'}`} />
        ) : (
          <Menu className={`w-5 h-5 ${isDark ? 'text-white/70' : 'text-slate-600'}`} />
        )}
      </button>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className={`fixed left-0 top-14 bottom-0 w-80 z-40
                backdrop-blur-xl border-r flex flex-col overflow-hidden ${
                  isDark
                    ? 'bg-[#0A0E1A]/95 border-white/10'
                    : 'bg-white/95 border-slate-200 shadow-lg'
                }`}
            >
              {/* Header */}
              <div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <h2 className={`text-lg font-bold mb-3 ${isDark ? 'text-white/90' : 'text-slate-800'}`}>
                  All Topics
                </h2>

                {/* Search */}
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-white/30' : 'text-slate-400'
                  }`} />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search topics..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg
                      text-sm transition-colors
                      focus:outline-none ${
                        isDark
                          ? 'bg-white/5 border border-white/10 text-white/80 placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.07]'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:border-slate-300 focus:bg-white'
                      }`}
                  />
                </div>

                {/* Legend */}
                <div className={`flex items-center gap-4 mt-3 text-xs ${
                  isDark ? 'text-white/40' : 'text-slate-500'
                }`}>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Mastered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Practicing</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span>To Learn</span>
                  </div>
                </div>
              </div>

              {/* Subject Sections */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {['physics', 'chemistry', 'biology'].map((subject) => (
                  <SubjectSection
                    key={subject}
                    subject={subject}
                    topics={filteredTopics[subject]}
                    isExpanded={expandedSubjects.includes(subject)}
                    onToggle={() => toggleSubjectExpanded(subject)}
                    onTopicClick={handleTopicClick}
                    isDark={isDark}
                  />
                ))}
              </div>

              {/* Stats Footer */}
              <MasteryStatsFooter stats={masteryStats} isDark={isDark} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
