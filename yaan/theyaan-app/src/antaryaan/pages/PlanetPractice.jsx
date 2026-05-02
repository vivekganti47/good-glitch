import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Zap,
  Trophy,
  RotateCcw,
  Target,
  TrendingUp,
  HelpCircle,
} from 'lucide-react'
import SpaceBackground from '../components/common/SpaceBackground'
import Button from '../components/common/Button'
import ProgressBar from '../components/common/ProgressBar'
import useProgressStore from '../stores/progressStore'
import useUserStore from '../stores/userStore'
import { constellations } from '../data/constellations'

// ---------------------------------------------------------------------------
// Data imports
// ---------------------------------------------------------------------------
import { kinesisPlanets } from '../data/planets/kinesis-prime'
import { forceNexusPlanets } from '../data/planets/force-nexus'
import { momentumForgePlanets } from '../data/planets/momentum-forge'
import { periodicSanctumPlanets } from '../data/planets/periodic-sanctum'
import { bondMatrixPlanets } from '../data/planets/bond-matrix'
import { moleNebulaPlanets } from '../data/planets/mole-nebula'
import { cellCitadelPlanets } from '../data/planets/cell-citadel'
import { nucleusArchivePlanets } from '../data/planets/nucleus-archive'
import { membraneGatesPlanets } from '../data/planets/membrane-gates'

const allPlanets = {
  'kinesis-prime': kinesisPlanets || [],
  'force-nexus': forceNexusPlanets || [],
  'momentum-forge': momentumForgePlanets || [],
  'periodic-sanctum': periodicSanctumPlanets || [],
  'bond-matrix': bondMatrixPlanets || [],
  'mole-nebula': moleNebulaPlanets || [],
  'cell-citadel': cellCitadelPlanets || [],
  'nucleus-archive': nucleusArchivePlanets || [],
  'membrane-gates': membraneGatesPlanets || [],
}

// ---------------------------------------------------------------------------
// Scaffolding
// ---------------------------------------------------------------------------
function getScaffold(attemptCount) {
  if (attemptCount <= 1) return { level: 1, message: 'Not quite! Try again.' }
  if (attemptCount === 2) return { level: 2 }
  if (attemptCount === 3) return { level: 3 }
  if (attemptCount === 4) return { level: 4 }
  return { level: 5 }
}

function renderFormattedText(text) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="font-semibold text-amber-300">
          {part.slice(2, -2)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

// =====================================================================
// PROBLEM RENDERERS
// =====================================================================

function MCQProblem({ problem, onSubmit, disabled }) {
  const [selected, setSelected] = useState(null)
  const options = problem.options || []

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {options.map((opt, idx) => {
          let borderClass = 'border-slate-600/40 hover:border-slate-500/60'
          let bgClass = 'bg-slate-800/40 hover:bg-slate-800/60'
          if (selected === idx) {
            borderClass = 'border-indigo-500/60'
            bgClass = 'bg-indigo-500/10'
          }

          return (
            <motion.button
              key={idx}
              onClick={() => !disabled && setSelected(idx)}
              disabled={disabled}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${borderClass} ${bgClass} disabled:opacity-50`}
              whileHover={!disabled ? { scale: 1.01 } : {}}
              whileTap={!disabled ? { scale: 0.99 } : {}}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full border border-slate-500/50 flex items-center justify-center text-sm text-slate-400 font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-slate-200">{opt}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <Button
        onClick={() => onSubmit(selected)}
        disabled={selected === null || disabled}
        size="lg"
        className="w-full justify-center"
      >
        Check Answer
      </Button>
    </div>
  )
}

function NumericalProblem({ problem, onSubmit, disabled }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (value === '') return
    onSubmit(parseFloat(value))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-slate-800/70 border border-slate-600/50 rounded-lg px-4 py-3 text-white text-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors disabled:opacity-50"
          placeholder="Enter your answer..."
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        {problem.unit && (
          <span className="text-slate-400 font-medium text-sm">{problem.unit}</span>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={value === '' || disabled}
        size="lg"
        className="w-full justify-center"
      >
        Check Answer
      </Button>
    </div>
  )
}

function MCQMultiProblem({ problem, onSubmit, disabled }) {
  const [selected, setSelected] = useState(new Set())
  const options = problem.options || []

  const toggleOption = (idx) => {
    if (disabled) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400 italic">Select all correct answers</p>
      <div className="space-y-3">
        {options.map((opt, idx) => {
          const isSelected = selected.has(idx)
          let borderClass = 'border-slate-600/40 hover:border-slate-500/60'
          let bgClass = 'bg-slate-800/40 hover:bg-slate-800/60'
          if (isSelected) {
            borderClass = 'border-indigo-500/60'
            bgClass = 'bg-indigo-500/10'
          }

          return (
            <motion.button
              key={idx}
              onClick={() => toggleOption(idx)}
              disabled={disabled}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${borderClass} ${bgClass} disabled:opacity-50`}
              whileHover={!disabled ? { scale: 1.01 } : {}}
              whileTap={!disabled ? { scale: 0.99 } : {}}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-500/30'
                      : 'border-slate-500/50 bg-transparent'
                  }`}
                >
                  {isSelected && <CheckCircle2 size={14} className="text-indigo-300" />}
                </span>
                <span className="text-slate-200">{opt}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <Button
        onClick={() => onSubmit([...selected].sort())}
        disabled={selected.size === 0 || disabled}
        size="lg"
        className="w-full justify-center"
      >
        Check Answer
      </Button>
    </div>
  )
}

function MatchProblem({ problem, onSubmit, disabled }) {
  const leftItems = problem.leftColumn || []
  const rightItems = problem.rightColumn || []
  const [matches, setMatches] = useState({})
  const [selectedLeft, setSelectedLeft] = useState(null)

  const handleLeftClick = (idx) => {
    if (disabled) return
    setSelectedLeft(idx)
  }

  const handleRightClick = (idx) => {
    if (disabled || selectedLeft === null) return
    setMatches((prev) => ({
      ...prev,
      [selectedLeft]: idx,
    }))
    setSelectedLeft(null)
  }

  const handleClear = () => {
    setMatches({})
    setSelectedLeft(null)
  }

  const allMatched = Object.keys(matches).length === leftItems.length

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400 italic">Match items from left to right columns</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-slate-500 font-medium">Column A</span>
          {leftItems.map((item, idx) => {
            const isMatched = idx in matches
            const isSelected = selectedLeft === idx

            return (
              <motion.button
                key={idx}
                onClick={() => handleLeftClick(idx)}
                disabled={disabled}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                  isSelected
                    ? 'border-indigo-500/60 bg-indigo-500/15'
                    : isMatched
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-slate-600/40 bg-slate-800/40 hover:border-slate-500/60'
                } disabled:opacity-50`}
                whileTap={!disabled ? { scale: 0.98 } : {}}
              >
                <span className="text-slate-200">{item}</span>
                {isMatched && (
                  <span className="text-emerald-400 text-xs ml-2">
                    {'→'} {rightItems[matches[idx]]}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wide text-slate-500 font-medium">Column B</span>
          {rightItems.map((item, idx) => {
            const isUsed = Object.values(matches).includes(idx)

            return (
              <motion.button
                key={idx}
                onClick={() => handleRightClick(idx)}
                disabled={disabled || selectedLeft === null}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                  isUsed
                    ? 'border-emerald-500/40 bg-emerald-500/10 opacity-60'
                    : selectedLeft !== null
                      ? 'border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10'
                      : 'border-slate-600/40 bg-slate-800/40'
                } disabled:opacity-50`}
                whileTap={!disabled && selectedLeft !== null ? { scale: 0.98 } : {}}
              >
                <span className="text-slate-200">{item}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={() => onSubmit(matches)}
          disabled={!allMatched || disabled}
          size="lg"
          className="flex-1 justify-center"
        >
          Check Matches
        </Button>
        {Object.keys(matches).length > 0 && (
          <Button variant="secondary" size="lg" onClick={handleClear} icon={RotateCcw}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}

// =====================================================================
// FEEDBACK OVERLAY
// =====================================================================
function FeedbackOverlay({ isCorrect, problem, attempts, onNext, onRetry, xpGained }) {
  const scaffold = getScaffold(attempts)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl p-5 border mt-6 ${
        isCorrect
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-red-500/10 border-red-500/30'
      }`}
    >
      {isCorrect ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            >
              <CheckCircle2 size={28} className="text-emerald-400" />
            </motion.div>
            <div>
              <span className="text-emerald-300 font-bold text-lg">Correct!</span>
              {xpGained > 0 && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="ml-3 text-amber-400 font-semibold"
                >
                  +{xpGained} XP
                </motion.span>
              )}
            </div>
          </div>
          {problem.solution && (
            <p className="text-slate-300 text-sm">{problem.solution}</p>
          )}
          <Button onClick={onNext} icon={ChevronRight} className="mt-2">
            Next Problem
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ x: -4 }}
              animate={{ x: [0, -4, 4, -4, 4, 0] }}
              transition={{ duration: 0.4 }}
            >
              <XCircle size={24} className="text-red-400" />
            </motion.div>
            <span className="text-red-300 font-semibold">
              {scaffold.level === 1 ? 'Not quite! Try again.' : 'Incorrect.'}
            </span>
          </div>

          {scaffold.level >= 2 && problem.hint && (
            <p className="text-slate-300 text-sm">
              <span className="text-amber-400 font-medium">Hint: </span>
              {problem.hint}
            </p>
          )}

          {scaffold.level >= 3 && problem.steps && (
            <div className="space-y-1">
              <span className="text-sky-400 text-sm font-medium">Step by step:</span>
              {problem.steps.map((step, i) => (
                <p key={i} className="text-slate-300 text-sm pl-4">
                  {i + 1}. {step}
                </p>
              ))}
            </div>
          )}

          {scaffold.level >= 4 && problem.similarExample && (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <span className="text-purple-400 text-sm font-medium">Similar example:</span>
              <p className="text-slate-300 text-sm mt-1">{problem.similarExample}</p>
            </div>
          )}

          {scaffold.level >= 5 && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-500/20">
              <span className="text-amber-400 text-sm font-medium">Solution walkthrough:</span>
              <p className="text-slate-300 text-sm mt-1">
                {problem.solution || `The correct answer is: ${JSON.stringify(problem.correctAnswer)}`}
              </p>
              <Button onClick={onNext} icon={ChevronRight} variant="secondary" size="sm" className="mt-2">
                Continue
              </Button>
            </div>
          )}

          {scaffold.level < 5 && (
            <Button variant="secondary" size="sm" onClick={onRetry} icon={RotateCcw}>
              Try Again
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )
}

// =====================================================================
// COMPLETION SCREEN
// =====================================================================
function PracticeCompletion({ planet, constellation, score, total, accuracy, earnedXP, onRetry, onBack }) {
  const starCount = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 40 ? 1 : 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* Trophy animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.2 }}
          className="relative mx-auto w-28 h-28"
        >
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              background: accuracy >= 70
                ? 'radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.05) 70%)'
                : 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(245,158,11,0.05) 70%)',
              boxShadow: accuracy >= 70
                ? '0 0 50px rgba(16,185,129,0.3)'
                : '0 0 50px rgba(245,158,11,0.3)',
            }}
          >
            <Trophy
              size={44}
              className={accuracy >= 70 ? 'text-emerald-400' : 'text-amber-400'}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-white">Practice Complete!</h1>
          <p className="text-slate-400">{planet?.name || 'Practice Session'}</p>
        </motion.div>

        {/* Star rating */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-2"
        >
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: s <= starCount ? 1 : 0.6, rotate: 0 }}
              transition={{ delay: 0.7 + s * 0.15, type: 'spring', stiffness: 200 }}
            >
              <Star
                size={36}
                className={
                  s <= starCount ? 'text-amber-400' : 'text-slate-600'
                }
                fill={s <= starCount ? 'currentColor' : 'none'}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-slate-800/60 border border-slate-600/30 rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Score</p>
              <p className="text-2xl font-bold text-white">{score}/{total}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-white">{Math.round(accuracy)}%</p>
            </div>
          </div>

          <ProgressBar
            value={accuracy}
            max={100}
            color={accuracy >= 80 ? 'emerald' : accuracy >= 50 ? 'amber' : 'red'}
            showPercentage
            size="md"
          />
        </motion.div>

        {/* XP Earned */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5"
        >
          <div className="flex items-center justify-center gap-3">
            <Zap size={22} className="text-amber-400" />
            <span className="text-2xl font-bold text-amber-300">+{earnedXP} XP</span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col gap-3 pt-2"
        >
          {accuracy < 70 && (
            <Button onClick={onRetry} icon={RotateCcw} size="lg" className="w-full justify-center">
              Try Again
            </Button>
          )}
          <Button
            variant={accuracy >= 70 ? 'primary' : 'secondary'}
            onClick={onBack}
            icon={ArrowLeft}
            size="lg"
            className="w-full justify-center"
          >
            Back to {constellation?.name || 'Constellation'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// =====================================================================
// TIMER COMPONENT
// =====================================================================
function Timer({ running }) {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((t) => t + 1)
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60

  return (
    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
      <Clock size={14} />
      <span className="font-mono">
        {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  )
}

// =====================================================================
// MAIN COMPONENT: PlanetPractice
// =====================================================================
function PlanetPractice() {
  const { constellationId, planetId } = useParams()
  const navigate = useNavigate()
  const completePlanetPractice = useProgressStore((s) => s.completePlanetPractice)
  const addXP = useUserStore((s) => s.addXP)

  // Find data
  const planets = allPlanets[constellationId] || []
  const planet = planets.find((p) => p.id === planetId)
  const constellation = constellations.find((c) => c.id === constellationId)
  const problems = planet?.problems || []

  // State
  const [currentProblem, setCurrentProblem] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0)
  const [consecutiveWrong, setConsecutiveWrong] = useState(0)
  const [currentDifficulty, setCurrentDifficulty] = useState(2)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [problemAttempts, setProblemAttempts] = useState(0)
  const [practiceComplete, setPracticeComplete] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)
  const [xpGained, setXpGained] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)

  const problem = problems[currentProblem]

  // Check answer correctness based on problem type
  const checkAnswer = useCallback(
    (answer) => {
      if (!problem) return false

      switch (problem.type) {
        case 'mcq':
          return answer === problem.correctIndex

        case 'numerical': {
          const correct = parseFloat(problem.correctAnswer)
          const tolerance = correct === 0 ? 0.01 : Math.abs(correct * 0.01)
          return Math.abs(answer - correct) <= tolerance
        }

        case 'mcq-multi': {
          const correctSet = new Set(problem.correctIndices || [])
          const answerSet = new Set(answer || [])
          if (correctSet.size !== answerSet.size) return false
          for (const v of correctSet) {
            if (!answerSet.has(v)) return false
          }
          return true
        }

        case 'match': {
          const correctMatches = problem.correctMatches || {}
          for (const [key, val] of Object.entries(correctMatches)) {
            if (answer[key] !== val) return false
          }
          return Object.keys(answer).length === Object.keys(correctMatches).length
        }

        default:
          return false
      }
    },
    [problem]
  )

  const handleSubmit = useCallback(
    (answer) => {
      const correct = checkAnswer(answer)
      const newAttempts = problemAttempts + 1
      setProblemAttempts(newAttempts)

      if (correct) {
        setScore((s) => s + 1)
        setConsecutiveCorrect((c) => c + 1)
        setConsecutiveWrong(0)

        // Adaptive difficulty
        if (consecutiveCorrect + 1 >= 3) {
          setCurrentDifficulty((d) => Math.min(5, d + 1))
          setConsecutiveCorrect(0)
        }

        // XP per problem
        const baseXP = 5
        const firstAttemptBonus = newAttempts === 1 ? 3 : 0
        const xp = baseXP + firstAttemptBonus
        setXpGained(xp)
      } else {
        setConsecutiveWrong((c) => c + 1)
        setConsecutiveCorrect(0)

        if (consecutiveWrong + 1 >= 2) {
          setCurrentDifficulty((d) => Math.max(1, d - 1))
          setConsecutiveWrong(0)
        }
        setXpGained(0)
      }

      setLastResult(correct)
      setShowFeedback(true)
      setAnswers((prev) => [...prev, { index: currentProblem, correct, attempts: newAttempts }])
    },
    [checkAnswer, problemAttempts, consecutiveCorrect, consecutiveWrong, currentProblem]
  )

  const handleNext = useCallback(() => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem((p) => p + 1)
      setShowFeedback(false)
      setLastResult(null)
      setProblemAttempts(0)
      setXpGained(0)
    } else {
      // Practice complete
      setTimerRunning(false)
      const finalAccuracy = problems.length > 0 ? (score / problems.length) * 100 : 0
      const result = completePlanetPractice(planetId, constellationId, score, finalAccuracy)
      const totalXP = addXP(result?.xpEarned || 40)
      setEarnedXP(totalXP || result?.xpEarned || 40)
      setPracticeComplete(true)
    }
  }, [currentProblem, problems.length, score, planetId, constellationId, completePlanetPractice, addXP])

  const handleRetry = useCallback(() => {
    setShowFeedback(false)
    setLastResult(null)
  }, [])

  const handleRetryPractice = useCallback(() => {
    setCurrentProblem(0)
    setScore(0)
    setAnswers([])
    setConsecutiveCorrect(0)
    setConsecutiveWrong(0)
    setCurrentDifficulty(2)
    setShowFeedback(false)
    setLastResult(null)
    setProblemAttempts(0)
    setPracticeComplete(false)
    setEarnedXP(0)
    setXpGained(0)
    setTimerRunning(true)
  }, [])

  const handleBack = useCallback(() => {
    navigate(`/antaryaan/constellation/${constellationId}`)
  }, [navigate, constellationId])

  // Not found state
  if (!planet) {
    return (
      <div className="min-h-screen relative">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <HelpCircle size={48} className="text-slate-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Planet Not Found</h2>
            <p className="text-slate-400 max-w-md">
              This practice planet hasn't been discovered yet. The data may still be loading.
            </p>
            <Button onClick={() => navigate(-1)} icon={ArrowLeft} variant="secondary">
              Go Back
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Completion screen
  if (practiceComplete) {
    const finalAccuracy = problems.length > 0 ? (score / problems.length) * 100 : 0
    return (
      <div className="min-h-screen relative">
        <SpaceBackground />
        <div className="relative z-10">
          <PracticeCompletion
            planet={planet}
            constellation={constellation}
            score={score}
            total={problems.length}
            accuracy={finalAccuracy}
            earnedXP={earnedXP}
            onRetry={handleRetryPractice}
            onBack={handleBack}
          />
        </div>
      </div>
    )
  }

  // Render problem input based on type
  function renderProblemInput() {
    if (!problem) return null
    const disabled = showFeedback && lastResult === true

    switch (problem.type) {
      case 'mcq':
        return <MCQProblem problem={problem} onSubmit={handleSubmit} disabled={disabled} />
      case 'numerical':
        return <NumericalProblem problem={problem} onSubmit={handleSubmit} disabled={disabled} />
      case 'mcq-multi':
        return <MCQMultiProblem problem={problem} onSubmit={handleSubmit} disabled={disabled} />
      case 'match':
        return <MatchProblem problem={problem} onSubmit={handleSubmit} disabled={disabled} />
      default:
        return <p className="text-slate-400 italic">Unknown problem type: {problem.type}</p>
    }
  }

  // Difficulty indicator
  const difficultyLabels = ['', 'Easy', 'Medium', 'Hard', 'Expert', 'Master']
  const difficultyColors = ['', 'text-emerald-400', 'text-sky-400', 'text-amber-400', 'text-orange-400', 'text-red-400']

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-700/30 bg-slate-900/40 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleBack}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">
                {planet.name}
              </h1>
              <p className="text-slate-500 text-xs">
                {constellation?.name || constellationId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Timer running={timerRunning} />
            <div className="hidden sm:flex items-center gap-2">
              <Target size={14} className={difficultyColors[currentDifficulty]} />
              <span className={`text-xs font-medium ${difficultyColors[currentDifficulty]}`}>
                {difficultyLabels[currentDifficulty]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">
                {currentProblem + 1}/{problems.length}
              </span>
              <div className="w-24 sm:w-36">
                <ProgressBar
                  value={currentProblem + 1}
                  max={problems.length}
                  color="indigo"
                  size="sm"
                  animated
                />
              </div>
            </div>
          </div>
        </motion.header>

        {/* Score strip */}
        <div className="px-4 md:px-6 py-2 border-b border-slate-800/30 bg-slate-900/20">
          <div className="max-w-2xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-slate-400">
                Score: <span className="text-white font-semibold">{score}</span>
              </span>
              {consecutiveCorrect > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-amber-400 flex items-center gap-1"
                >
                  <TrendingUp size={14} />
                  {consecutiveCorrect} streak
                </motion.span>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:hidden">
              <Target size={12} className={difficultyColors[currentDifficulty]} />
              <span className={`text-xs ${difficultyColors[currentDifficulty]}`}>
                {difficultyLabels[currentDifficulty]}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center px-4 md:px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProblem}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Problem difficulty badge */}
                {problem?.difficulty && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      problem.difficulty <= 2
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : problem.difficulty <= 3
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {['', 'Basic', 'Easy', 'Medium', 'Hard', 'Expert'][problem.difficulty] || 'Medium'}
                    </span>
                  </div>
                )}

                {/* Problem text */}
                <div>
                  <p className="text-white text-lg font-medium leading-relaxed">
                    {renderFormattedText(problem?.text || problem?.prompt || 'Problem text missing')}
                  </p>
                  {problem?.context && (
                    <p className="text-slate-400 text-sm mt-2">{problem.context}</p>
                  )}
                </div>

                {/* Problem input */}
                {!showFeedback && renderProblemInput()}

                {/* Feedback */}
                {showFeedback && (
                  <FeedbackOverlay
                    isCorrect={lastResult}
                    problem={problem}
                    attempts={problemAttempts}
                    onNext={handleNext}
                    onRetry={handleRetry}
                    xpGained={xpGained}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanetPractice
