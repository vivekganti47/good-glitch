import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, BookOpen, CheckCircle2, XCircle, ChevronRight,
  Zap, RotateCcw, Brain, Sparkles, Clock, AlertCircle, Trophy
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useUserStore from '../stores/userStore'
import useProgressStore from '../stores/progressStore'
import SpaceBackground from '../components/common/SpaceBackground'

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const cardFlip = {
  front: { rotateY: 0, opacity: 1 },
  back: { rotateY: 180, opacity: 0 },
}

// --- Mastery Level Config ---

const MASTERY_CONFIG = {
  learning: { label: 'Learning', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  practicing: { label: 'Practicing', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
  mastered: { label: 'Mastered', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  legendary: { label: 'Legendary', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)' },
}

// --- Sample Review Questions ---
// In production, these would come from a question bank keyed by concept ID.
// For now, generate placeholder questions per concept.

function getReviewQuestion(conceptId) {
  const conceptName = conceptId.replace(/-/g, ' ')

  const templates = [
    {
      question: `Which statement best describes the core principle of ${conceptName}?`,
      options: [
        `It explains the fundamental relationship in ${conceptName}`,
        `It only applies to theoretical scenarios`,
        `It contradicts the principles of classical mechanics`,
        `It was recently disproven`,
      ],
      correctIndex: 0,
    },
    {
      question: `In the context of ${conceptName}, what is the most important factor to consider?`,
      options: [
        `The temperature of the system`,
        `The underlying relationship between variables`,
        `The color of the substance`,
        `The time of day`,
      ],
      correctIndex: 1,
    },
    {
      question: `Which of the following is a direct application of ${conceptName}?`,
      options: [
        `Cooking recipes`,
        `Weather forecasting`,
        `Solving problems using the core principles of ${conceptName}`,
        `Social media algorithms`,
      ],
      correctIndex: 2,
    },
  ]

  // Pick a pseudo-random template based on concept string
  const hash = conceptId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return templates[hash % templates.length]
}

// --- Sub-components ---

function ConceptListItem({ concept, onSelect }) {
  const masteryConfig = MASTERY_CONFIG[concept.level] || MASTERY_CONFIG.learning
  const lastReviewDate = concept.lastReview
    ? new Date(concept.lastReview).toLocaleDateString()
    : 'Never'

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(concept)}
      className="flex items-center gap-4 rounded-xl border border-white/8 p-4 cursor-pointer
        hover:border-white/15 transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      {/* Mastery indicator */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: masteryConfig.bg }}
      >
        <Brain className="w-5 h-5" style={{ color: masteryConfig.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-white capitalize">
          {concept.id.replace(/-/g, ' ')}
        </h4>
        <div className="flex items-center gap-3 mt-1 text-xs text-white/35">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last: {lastReviewDate}
          </span>
          <span className="flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            {concept.totalReviews} reviews
          </span>
        </div>
      </div>

      {/* Mastery badge */}
      <div
        className="px-2.5 py-1 rounded-lg text-xs font-medium shrink-0"
        style={{ background: masteryConfig.bg, color: masteryConfig.color }}
      >
        {masteryConfig.label}
      </div>

      <ChevronRight className="w-4 h-4 text-white/20 shrink-0" />
    </motion.div>
  )
}

function ReviewQuiz({ concept, question, onAnswer }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [answered, setAnswered] = useState(false)
  const isCorrect = selectedIndex === question.correctIndex

  const handleSelect = (index) => {
    if (answered) return
    setSelectedIndex(index)
    setAnswered(true)
  }

  const handleNext = () => {
    onAnswer(isCorrect)
  }

  const conceptName = concept.id.replace(/-/g, ' ')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Concept name */}
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400/80">
          Reviewing
        </span>
        <h2 className="text-xl font-bold text-white capitalize mt-1">{conceptName}</h2>
      </div>

      {/* Question */}
      <div
        className="rounded-2xl border border-white/10 p-6"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <p className="text-base text-white/80 font-medium leading-relaxed mb-6">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let borderColor = 'rgba(255,255,255,0.08)'
            let bgColor = 'rgba(255,255,255,0.02)'
            let textColor = 'rgba(255,255,255,0.7)'

            if (answered) {
              if (index === question.correctIndex) {
                borderColor = 'rgba(52, 211, 153, 0.5)'
                bgColor = 'rgba(52, 211, 153, 0.08)'
                textColor = '#34D399'
              } else if (index === selectedIndex && !isCorrect) {
                borderColor = 'rgba(239, 68, 68, 0.5)'
                bgColor = 'rgba(239, 68, 68, 0.08)'
                textColor = '#EF4444'
              }
            } else if (index === selectedIndex) {
              borderColor = 'rgba(99, 102, 241, 0.5)'
              bgColor = 'rgba(99, 102, 241, 0.08)'
            }

            return (
              <motion.button
                key={index}
                whileHover={!answered ? { scale: 1.01 } : {}}
                whileTap={!answered ? { scale: 0.99 } : {}}
                onClick={() => handleSelect(index)}
                className="w-full text-left rounded-xl border p-4 transition-all duration-200 flex items-center gap-3"
                style={{ borderColor, background: bgColor }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: answered && index === question.correctIndex
                      ? 'rgba(52, 211, 153, 0.2)'
                      : answered && index === selectedIndex && !isCorrect
                        ? 'rgba(239, 68, 68, 0.2)'
                        : 'rgba(255,255,255,0.05)',
                    color: textColor,
                  }}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-sm" style={{ color: textColor }}>
                  {option}
                </span>
                {answered && index === question.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                )}
                {answered && index === selectedIndex && !isCorrect && (
                  <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Result + Next */}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
              isCorrect
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/15 text-red-400 border border-red-500/20'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Correct! Keep it up.
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Not quite. Review the concept again.
              </>
            )}
          </div>

          <div>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-indigo-500 to-violet-500 text-white
                hover:from-indigo-400 hover:to-violet-400 transition-all duration-200
                shadow-lg shadow-indigo-500/20"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function ReviewComplete({ results, totalConcepts, navigate }) {
  const correctCount = results.filter((r) => r.correct).length
  const accuracy = totalConcepts > 0 ? Math.round((correctCount / totalConcepts) * 100) : 0
  const totalXPEarned = results.reduce((sum, r) => sum + r.xpEarned, 0)
  const levelsGained = results.filter((r) => r.leveledUp).length

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center space-y-6 py-8"
    >
      {/* Trophy */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20
          border border-indigo-400/30 flex items-center justify-center"
      >
        <Trophy className="w-10 h-10 text-indigo-400" />
      </motion.div>

      <div>
        <h2
          className="text-2xl font-extrabold mb-2"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #C7D2FE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Review Complete!
        </h2>
        <p className="text-sm text-white/40">Great job strengthening your knowledge</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        <div className="rounded-xl bg-white/5 border border-white/8 p-4">
          <div className="text-2xl font-bold text-white">{accuracy}%</div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">Accuracy</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/8 p-4">
          <div className="text-2xl font-bold text-yellow-400">+{totalXPEarned}</div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">XP Earned</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/8 p-4">
          <div className="text-2xl font-bold text-emerald-400">{levelsGained}</div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">Level Ups</div>
        </div>
      </div>

      {/* Per-concept results */}
      <div className="space-y-2 max-w-sm mx-auto text-left">
        {results.map((result) => {
          const config = MASTERY_CONFIG[result.newLevel] || MASTERY_CONFIG.learning
          return (
            <div
              key={result.conceptId}
              className="flex items-center gap-3 rounded-lg border border-white/5 p-3"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              {result.correct ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span className="text-sm text-white/70 flex-1 capitalize truncate">
                {result.conceptId.replace(/-/g, ' ')}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded"
                style={{ background: config.bg, color: config.color }}
              >
                {config.label}
              </span>
              {result.leveledUp && (
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => navigate('/antaryaan')}
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-white/60
            hover:bg-white/10 transition-colors border border-white/10"
        >
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  )
}

// --- Main Component ---

export default function ReviewPage() {
  const navigate = useNavigate()
  const { addXP } = useUserStore()
  const { getDueReviewConcepts, updateConceptMastery } = useProgressStore()

  const dueConcepts = useMemo(() => getDueReviewConcepts(), [getDueReviewConcepts])

  const [mode, setMode] = useState('list') // 'list' | 'quiz' | 'complete'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewQueue, setReviewQueue] = useState([])
  const [results, setResults] = useState([])

  const startReview = useCallback(() => {
    if (dueConcepts.length === 0) return
    setReviewQueue([...dueConcepts])
    setCurrentIndex(0)
    setResults([])
    setMode('quiz')
  }, [dueConcepts])

  const startSingleReview = useCallback((concept) => {
    setReviewQueue([concept])
    setCurrentIndex(0)
    setResults([])
    setMode('quiz')
  }, [])

  const handleAnswer = useCallback((wasCorrect) => {
    const concept = reviewQueue[currentIndex]
    const result = updateConceptMastery(concept.id, wasCorrect)

    // Add XP
    const baseXP = wasCorrect ? 10 : 3
    const xpEarned = baseXP + (result?.xpEarned || 0)
    addXP(xpEarned)

    const newResult = {
      conceptId: concept.id,
      correct: wasCorrect,
      xpEarned,
      leveledUp: result?.leveledUp || false,
      newLevel: result?.newLevel || concept.level,
    }

    const updatedResults = [...results, newResult]
    setResults(updatedResults)

    if (currentIndex + 1 < reviewQueue.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setMode('complete')
    }
  }, [reviewQueue, currentIndex, results, updateConceptMastery, addXP])

  const currentConcept = reviewQueue[currentIndex]
  const currentQuestion = currentConcept ? getReviewQuestion(currentConcept.id) : null

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-20 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* --- Back Button --- */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => navigate('/antaryaan')}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </motion.div>

          {/* --- Header --- */}
          <motion.div variants={itemVariants}>
            <h1
              className="text-3xl font-extrabold mb-1"
              style={{
                background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 50%, #C084FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Spaced Review
            </h1>
            <p className="text-sm text-white/40">
              Strengthen your memory with scientifically-timed review sessions
            </p>
          </motion.div>

          {/* --- Content Area --- */}
          <AnimatePresence mode="wait">
            {mode === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Due count summary */}
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl border p-4 flex items-center justify-between"
                  style={{
                    borderColor: dueConcepts.length > 0 ? 'rgba(129, 140, 248, 0.2)' : 'rgba(255,255,255,0.08)',
                    background: dueConcepts.length > 0
                      ? 'linear-gradient(135deg, rgba(129, 140, 248, 0.06) 0%, transparent 100%)'
                      : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: dueConcepts.length > 0
                          ? 'rgba(129, 140, 248, 0.15)'
                          : 'rgba(255,255,255,0.05)',
                      }}
                    >
                      {dueConcepts.length > 0 ? (
                        <AlertCircle className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {dueConcepts.length > 0
                          ? `${dueConcepts.length} concept${dueConcepts.length > 1 ? 's' : ''} due for review`
                          : 'All caught up!'
                        }
                      </p>
                      <p className="text-xs text-white/35">
                        {dueConcepts.length > 0
                          ? 'Review now to strengthen long-term retention'
                          : 'No concepts need review right now. Come back later.'
                        }
                      </p>
                    </div>
                  </div>

                  {dueConcepts.length > 0 && (
                    <button
                      onClick={startReview}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold shrink-0
                        bg-gradient-to-r from-indigo-500 to-violet-500 text-white
                        hover:from-indigo-400 hover:to-violet-400 transition-all duration-200
                        shadow-lg shadow-indigo-500/20"
                    >
                      Review All
                    </button>
                  )}
                </motion.div>

                {/* Concept list */}
                {dueConcepts.length > 0 && (
                  <motion.div variants={itemVariants} className="space-y-2">
                    <h3 className="text-sm font-semibold text-white/60 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-white/30" />
                      Concepts Due
                    </h3>
                    {dueConcepts.map((concept) => (
                      <ConceptListItem
                        key={concept.id}
                        concept={concept}
                        onSelect={startSingleReview}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Empty state */}
                {dueConcepts.length === 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="text-center py-12"
                  >
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20
                        flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Sparkles className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-white/70 mb-2">You're all caught up!</h3>
                    <p className="text-sm text-white/35 mb-6 max-w-xs mx-auto">
                      Complete more star lessons to unlock concepts for spaced review.
                      Your brain will thank you later.
                    </p>
                    <button
                      onClick={() => navigate('/antaryaan')}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-white/60
                        hover:bg-white/10 transition-colors border border-white/10"
                    >
                      Back to Dashboard
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {mode === 'quiz' && currentConcept && currentQuestion && (
              <motion.div
                key={`quiz-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Progress indicator */}
                <motion.div variants={itemVariants} className="mb-6">
                  <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                    <span>Question {currentIndex + 1} of {reviewQueue.length}</span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      {results.filter((r) => r.correct).length} correct
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIndex) / reviewQueue.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>

                <ReviewQuiz
                  concept={currentConcept}
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                />
              </motion.div>
            )}

            {mode === 'complete' && (
              <ReviewComplete
                key="complete"
                results={results}
                totalConcepts={reviewQueue.length}
                navigate={navigate}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
