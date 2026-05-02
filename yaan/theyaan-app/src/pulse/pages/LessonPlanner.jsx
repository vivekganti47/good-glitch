import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Clock,
  Target,
  Users,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Printer,
} from 'lucide-react'
import { lessonTemplates } from '../data/mockInsights'
import { topics } from '../data/mockTopics'
import ComprehensionBar from '../components/ComprehensionBar'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.4, ease: 'easeOut' },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
}

// Map template topics to topic IDs for data lookup
const templateTopicMap = {
  'template-01': 'quadratic-equations',
  'template-02': 'trigonometry',
  'template-03': 'calculus-intro',
  'template-04': 'newtons-laws',
}

function getRelatedTopic(template) {
  const topicId = templateTopicMap[template.id]
  return topics.find((t) => t.id === topicId)
}

export default function LessonPlanner() {
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const [showGenerated, setShowGenerated] = useState(false)
  const [diffTab, setDiffTab] = useState('advanced')
  const [saved, setSaved] = useState(false)

  // Auto-trigger generation on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowGenerated(true), 500)
    return () => clearTimeout(timer)
  }, [])

  function handleTemplateSelect(index) {
    setSelectedTemplate(index)
    setShowGenerated(false)
    setDiffTab('advanced')
    setTimeout(() => setShowGenerated(true), 300)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const template = lessonTemplates[selectedTemplate]
  const relatedTopic = getRelatedTopic(template)
  const availableTopics = topics.filter((t) => t.status !== 'upcoming')

  return (
    <motion.div
      className="px-4 sm:px-6 py-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen size={28} className="text-emerald-400" />
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Lesson Planner
          </h1>
        </div>
        <p className="text-white/40 text-sm ml-[40px]">
          AI-powered lesson design
        </p>
      </motion.div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="flex-1 lg:w-2/3 min-w-0">
          {/* Topic Selector */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
              Available Topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {availableTopics.map((topic) => {
                const isRelated =
                  relatedTopic && topic.id === relatedTopic.id
                return (
                  <span
                    key={topic.id}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                      isRelated
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 bg-white/[0.03] text-white/50'
                    }`}
                  >
                    {topic.name}
                  </span>
                )
              })}
            </div>
          </motion.div>

          {/* Generated Lesson Plan */}
          <AnimatePresence mode="wait">
            {showGenerated && (
              <motion.div
                key={template.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Topic Header */}
                <motion.div
                  custom={0}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-5 bg-white/[0.03] border border-white/10 rounded-xl mb-4"
                >
                  <h2
                    className="text-xl font-bold text-white mb-3"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    {template.topic}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-full">
                      <Clock size={12} />
                      {template.duration} min
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium text-white/60 bg-white/[0.06] rounded-full">
                      Grade {template.grade}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium text-white/60 bg-white/[0.06] rounded-full">
                      {template.subject}
                    </span>
                  </div>
                </motion.div>

                {/* Learning Objectives */}
                <motion.div
                  custom={1}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-5 bg-white/[0.03] border border-white/10 rounded-xl mb-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Target size={18} className="text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Learning Objectives
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {template.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle
                          size={16}
                          className="text-emerald-400 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-sm text-white/70">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Warm-Up Activity */}
                <motion.div
                  custom={2}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-5 bg-white/[0.03] border border-white/10 rounded-xl mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-amber-400" />
                      <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                        Warm-Up Activity
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium text-amber-400 bg-amber-500/10 rounded-full">
                      {template.warmUp.duration} min
                    </span>
                  </div>
                  <p className="text-sm text-white/70">
                    {template.warmUp.activity}
                  </p>
                </motion.div>

                {/* Main Content Phases */}
                <motion.div
                  custom={3}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-4"
                >
                  <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                    Main Content Phases
                  </h3>
                  <div className="space-y-3">
                    {template.mainContent.map((phase, i) => (
                      <div
                        key={i}
                        className="p-5 bg-white/[0.03] border border-white/10 rounded-xl"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-2xl font-black font-mono text-emerald-400/30 leading-none">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-bold text-white">
                                {phase.phase}
                              </h4>
                              <span className="px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 rounded-full">
                                {phase.duration} min
                              </span>
                            </div>
                            <p className="text-sm text-white/60">
                              {phase.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Assessment */}
                <motion.div
                  custom={4}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-5 bg-white/[0.03] border border-white/10 rounded-xl mb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target size={18} className="text-blue-400" />
                      <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                        Assessment
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium text-blue-400 bg-blue-500/10 rounded-full">
                      {template.assessment.duration} min
                    </span>
                  </div>
                  <p className="text-sm text-white/70">
                    {template.assessment.method}
                  </p>
                </motion.div>

                {/* Differentiation */}
                <motion.div
                  custom={5}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-5 bg-white/[0.03] border border-white/10 rounded-xl mb-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={18} className="text-purple-400" />
                    <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Differentiation
                    </h3>
                  </div>
                  {/* Tabs */}
                  <div className="flex gap-1 mb-4 bg-white/[0.04] rounded-lg p-1">
                    <button
                      onClick={() => setDiffTab('advanced')}
                      className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        diffTab === 'advanced'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      Advanced Students
                    </button>
                    <button
                      onClick={() => setDiffTab('struggling')}
                      className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        diffTab === 'struggling'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      Struggling Students
                    </button>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={diffTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm text-white/70"
                    >
                      {template.differentiation[diffTab]}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>

                {/* Data Insight */}
                <motion.div
                  custom={6}
                  variants={sectionVariants}
                  initial="hidden"
                  animate="visible"
                  className="p-5 bg-white/[0.03] border-l-2 border-emerald-500 border-t border-r border-b border-t-white/10 border-r-white/10 border-b-white/10 rounded-xl mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={18} className="text-emerald-400" />
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                      AI Data Insight
                    </h3>
                  </div>
                  <p className="text-sm text-white/70">
                    {template.dataInsight}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-80 flex-shrink-0">
          {/* Template Selector */}
          <motion.div
            variants={itemVariants}
            className="p-5 bg-white/[0.03] border border-white/10 rounded-xl mb-4"
          >
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
              Lesson Templates
            </h3>
            <div className="space-y-2">
              {lessonTemplates.map((tmpl, index) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTemplate === index
                      ? 'border-emerald-500/50 bg-emerald-500/[0.08]'
                      : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold text-white truncate pr-2">
                      {tmpl.topic}
                    </h4>
                    <ChevronRight
                      size={12}
                      className={
                        selectedTemplate === index
                          ? 'text-emerald-400'
                          : 'text-white/20'
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/40">
                      {tmpl.duration} min
                    </span>
                    <span className="text-[10px] text-white/30">|</span>
                    <span className="text-[10px] text-white/40">
                      Grade {tmpl.grade}
                    </span>
                    <span className="text-[10px] text-white/30">|</span>
                    <span className="text-[10px] text-white/40">
                      {tmpl.subject}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Performance Context */}
          <motion.div
            variants={itemVariants}
            className="p-5 bg-white/[0.03] border border-white/10 rounded-xl"
          >
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">
              Student Data
            </h3>
            {relatedTopic ? (
              <>
                <p className="text-xs text-white/30 mb-4">
                  Class comprehension for{' '}
                  <span className="text-white/50">{relatedTopic.name}</span>
                </p>
                <div className="space-y-3">
                  {Object.entries(relatedTopic.classComprehension).map(
                    ([classId, value]) => (
                      <ComprehensionBar
                        key={classId}
                        label={`Class ${classId}`}
                        value={value}
                      />
                    )
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-white/30">
                No related topic data available.
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <motion.div
        variants={itemVariants}
        className="sticky bottom-0 left-0 right-0 mt-6 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-[#0A0E1A]/90 backdrop-blur-xl border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white/60 bg-white/[0.05] border border-white/10 rounded-lg transition-colors hover:bg-white/[0.08] hover:text-white/80"
          >
            <Printer size={16} />
            Print Lesson Plan
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg transition-colors hover:bg-emerald-500"
          >
            <AnimatePresence mode="wait">
              {saved ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <CheckCircle size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <BookOpen size={16} />
                </motion.span>
              )}
            </AnimatePresence>
            {saved ? 'Saved!' : 'Save Plan'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
