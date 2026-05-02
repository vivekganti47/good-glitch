import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Star,
  Sparkles,
  Trophy,
  Zap,
  BookOpen,
  HelpCircle,
  RotateCcw,
  ChevronDown,
} from 'lucide-react'
import SpaceBackground from '../components/common/SpaceBackground'
import Button from '../components/common/Button'
import ProgressBar from '../components/common/ProgressBar'
import SimulationBlock from '../components/simulations/SimulationBlock'
import SandboxBlock from '../components/simulations/SandboxBlock'
import ChallengeBlock from '../components/simulations/ChallengeBlock'
import useProgressStore from '../stores/progressStore'
import useUserStore from '../stores/userStore'
import { constellations } from '../data/constellations'

// ---------------------------------------------------------------------------
// Data imports
// ---------------------------------------------------------------------------
import { kinesisStars } from '../data/stars/kinesis-prime'
import { forceNexusStars } from '../data/stars/force-nexus'
import { momentumForgeStars } from '../data/stars/momentum-forge'
import { periodicSanctumStars } from '../data/stars/periodic-sanctum'
import { bondMatrixStars } from '../data/stars/bond-matrix'
import { moleNebulaStars } from '../data/stars/mole-nebula'
import { cellCitadelStars } from '../data/stars/cell-citadel'
import { nucleusArchiveStars } from '../data/stars/nucleus-archive'
import { membraneGatesStars } from '../data/stars/membrane-gates'

const allStars = {
  'kinesis-prime': kinesisStars || [],
  'force-nexus': forceNexusStars || [],
  'momentum-forge': momentumForgeStars || [],
  'periodic-sanctum': periodicSanctumStars || [],
  'bond-matrix': bondMatrixStars || [],
  'mole-nebula': moleNebulaStars || [],
  'cell-citadel': cellCitadelStars || [],
  'nucleus-archive': nucleusArchiveStars || [],
  'membrane-gates': membraneGatesStars || [],
}

// ---------------------------------------------------------------------------
// Scaffolding messages (5 levels)
// ---------------------------------------------------------------------------
function getScaffold(attemptCount) {
  if (attemptCount <= 1) return { level: 1, message: 'Not quite! Give it another shot.' }
  if (attemptCount === 2) return { level: 2, message: null } // show hint
  if (attemptCount === 3) return { level: 3, message: null } // break into steps
  if (attemptCount === 4) return { level: 4, message: null } // show similar example
  return { level: 5, message: null } // walk through answer
}

// ---------------------------------------------------------------------------
// Simple markdown-like text renderer
// ---------------------------------------------------------------------------
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
// BLOCK RENDERERS
// =====================================================================

// --- Text Block ---
function TextBlock({ block }) {
  const subtype = block.subtype || 'concept'

  if (subtype === 'hook') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-8"
      >
        <p className="text-xl md:text-2xl italic text-slate-200 leading-relaxed"
          style={{ textShadow: '0 0 30px rgba(251, 191, 36, 0.15)' }}
        >
          {renderFormattedText(block.content)}
        </p>
      </motion.div>
    )
  }

  if (subtype === 'example') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="border-l-4 border-indigo-500/60 pl-5 py-3 bg-indigo-950/20 rounded-r-lg"
      >
        <p className="text-slate-300 leading-relaxed">
          {renderFormattedText(block.content)}
        </p>
      </motion.div>
    )
  }

  // Default: concept
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-slate-200 leading-relaxed text-lg">
        {renderFormattedText(block.content)}
      </p>
    </motion.div>
  )
}

// --- Formula Block ---
function FormulaBlock({ block }) {
  const formulas = block.formulas || []
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-6 backdrop-blur-sm"
    >
      {block.title && (
        <h3 className="text-amber-400 font-semibold text-lg mb-4 flex items-center gap-2">
          <BookOpen size={18} />
          {block.title}
        </h3>
      )}
      <div className="space-y-3">
        {formulas.map((f, i) => {
          const isObj = typeof f === 'object' && f !== null
          const label = isObj ? f.label : null
          const expr = isObj ? (f.expression || f.formula || '') : String(f)
          const note = isObj ? f.note : null
          return (
            <div
              key={i}
              className="bg-slate-900/60 rounded-lg px-5 py-3 border border-slate-700/40"
            >
              {label && (
                <span className="text-sm text-slate-400 block mb-1">{label}</span>
              )}
              <code className="text-indigo-300 font-mono text-lg">
                {expr}
              </code>
              {note && (
                <span className="text-xs text-slate-500 block mt-1">{note}</span>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// --- Key Insight Block ---
function KeyInsightBlock({ block }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
      className="relative rounded-xl p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(251,191,36,0.04) 100%)',
      }}
    >
      {/* Gradient border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent"
        style={{
          borderImage: 'linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b) 1',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-40"
        style={{
          boxShadow: '0 0 25px rgba(245, 158, 11, 0.3), inset 0 0 25px rgba(245, 158, 11, 0.05)',
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
          <Lightbulb size={20} className="text-amber-400" />
        </div>
        <div>
          {block.title && (
            <h4 className="text-amber-300 font-bold text-sm uppercase tracking-wide mb-2">
              {block.title || 'Key Insight'}
            </h4>
          )}
          <p className="text-slate-100 font-medium text-lg leading-relaxed">
            {renderFormattedText(block.content)}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// --- Reveal Block ---
function RevealBlock({ block, onComplete }) {
  const [revealed, setRevealed] = useState(false)

  const handleReveal = () => {
    setRevealed(true)
    onComplete?.()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {block.prompt && (
        <p className="text-slate-300 mb-4">{renderFormattedText(block.prompt)}</p>
      )}
      {!revealed ? (
        <motion.button
          onClick={handleReveal}
          className="w-full py-4 rounded-xl border-2 border-dashed border-indigo-500/40 bg-indigo-500/5 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400/60 transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <ChevronDown size={18} />
          <span>{block.revealLabel || 'Tap to reveal'}</span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4 }}
          className="bg-slate-800/40 rounded-xl p-5 border border-slate-600/30"
        >
          <p className="text-slate-200 leading-relaxed">
            {renderFormattedText(block.content)}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

// --- Interactive Block ---
function InteractiveBlock({ block, attempts, onAnswer }) {
  const type = block.interactionType || 'number-input'

  if (type === 'number-input') return <NumberInputInteraction block={block} attempts={attempts} onAnswer={onAnswer} />
  if (type === 'mcq') return <MCQInteraction block={block} attempts={attempts} onAnswer={onAnswer} />
  if (type === 'slider') return <SliderInteraction block={block} attempts={attempts} onAnswer={onAnswer} />

  return <p className="text-slate-400 italic">Unknown interaction type: {type}</p>
}

function NumberInputInteraction({ block, attempts = 0, onAnswer }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (value === '') return
    const numVal = parseFloat(value)
    const correct = parseFloat(block.correctAnswer)
    const tolerance = correct === 0 ? 0.01 : Math.abs(correct * 0.01)
    const result = Math.abs(numVal - correct) <= tolerance
    setIsCorrect(result)
    setSubmitted(true)
    onAnswer?.(result)
  }

  const handleRetry = () => {
    setValue('')
    setSubmitted(false)
    setIsCorrect(false)
  }

  const scaffold = getScaffold(attempts)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <p className="text-slate-200 text-lg">{renderFormattedText(block.prompt)}</p>

      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={submitted && isCorrect}
          className="flex-1 bg-slate-800/70 border border-slate-600/50 rounded-lg px-4 py-3 text-white text-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-colors disabled:opacity-50"
          placeholder="Enter your answer..."
        />
        {block.unit && (
          <span className="text-slate-400 text-sm font-medium">{block.unit}</span>
        )}
      </div>

      {!submitted && (
        <Button onClick={handleSubmit} disabled={value === ''}>
          Check Answer
        </Button>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 border ${
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <CheckCircle2 size={20} className="text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Correct!</span>
              </>
            ) : (
              <>
                <XCircle size={20} className="text-red-400" />
                <span className="text-red-300 font-semibold">
                  {scaffold.level === 1 ? scaffold.message : 'Not quite right.'}
                </span>
              </>
            )}
          </div>

          {/* Scaffolding levels */}
          {!isCorrect && scaffold.level >= 2 && block.hint && (
            <p className="text-slate-300 text-sm mt-2">
              <span className="text-amber-400 font-medium">Hint: </span>
              {block.hint}
            </p>
          )}
          {!isCorrect && scaffold.level >= 3 && block.steps && (
            <div className="mt-3 space-y-1">
              <span className="text-sky-400 text-sm font-medium">Break it down:</span>
              {block.steps.map((step, i) => (
                <p key={i} className="text-slate-300 text-sm pl-4">
                  {i + 1}. {step}
                </p>
              ))}
            </div>
          )}
          {!isCorrect && scaffold.level >= 4 && block.similarExample && (
            <div className="mt-3 bg-slate-800/50 rounded p-3">
              <span className="text-purple-400 text-sm font-medium">Similar example:</span>
              <p className="text-slate-300 text-sm mt-1">{block.similarExample}</p>
            </div>
          )}
          {!isCorrect && scaffold.level >= 5 && (
            <div className="mt-3 bg-slate-800/50 rounded p-3 border border-amber-500/20">
              <span className="text-amber-400 text-sm font-medium">Solution walkthrough:</span>
              <p className="text-slate-300 text-sm mt-1">
                The correct answer is <span className="text-white font-mono font-semibold">{block.correctAnswer}{block.unit ? ` ${block.unit}` : ''}</span>.
              </p>
              {block.explanation && (
                <p className="text-slate-400 text-sm mt-1">{block.explanation}</p>
              )}
            </div>
          )}

          {submitted && isCorrect && block.explanation && (
            <p className="text-slate-300 text-sm mt-2">{block.explanation}</p>
          )}

          {submitted && !isCorrect && scaffold.level < 5 && (
            <Button variant="secondary" size="sm" onClick={handleRetry} className="mt-3" icon={RotateCcw}>
              Try Again
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

function MCQInteraction({ block, attempts = 0, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const options = block.options || []

  const handleSelect = (idx) => {
    if (submitted && isCorrect) return
    if (submitted) {
      // allow reselect on wrong
      setSubmitted(false)
    }
    setSelected(idx)
  }

  const handleSubmit = () => {
    if (selected === null) return
    const result = selected === block.correctIndex
    setIsCorrect(result)
    setSubmitted(true)
    onAnswer?.(result)
  }

  const scaffold = getScaffold(attempts)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <p className="text-slate-200 text-lg">{renderFormattedText(block.prompt)}</p>

      <div className="space-y-3">
        {options.map((opt, idx) => {
          let borderClass = 'border-slate-600/40 hover:border-slate-500/60'
          let bgClass = 'bg-slate-800/40 hover:bg-slate-800/60'
          if (selected === idx && !submitted) {
            borderClass = 'border-indigo-500/60'
            bgClass = 'bg-indigo-500/10'
          }
          if (submitted && idx === block.correctIndex) {
            borderClass = 'border-emerald-500/60'
            bgClass = 'bg-emerald-500/10'
          }
          if (submitted && idx === selected && !isCorrect) {
            borderClass = 'border-red-500/60'
            bgClass = 'bg-red-500/10'
          }

          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={submitted && isCorrect}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${borderClass} ${bgClass} disabled:opacity-60`}
              whileHover={!(submitted && isCorrect) ? { scale: 1.01 } : {}}
              whileTap={!(submitted && isCorrect) ? { scale: 0.99 } : {}}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full border border-slate-500/50 flex items-center justify-center text-sm text-slate-400 font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-slate-200">{opt}</span>
                {submitted && idx === block.correctIndex && (
                  <CheckCircle2 size={18} className="ml-auto text-emerald-400" />
                )}
                {submitted && idx === selected && !isCorrect && (
                  <XCircle size={18} className="ml-auto text-red-400" />
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {!submitted && (
        <Button onClick={handleSubmit} disabled={selected === null}>
          Check Answer
        </Button>
      )}

      {submitted && !isCorrect && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-4 border bg-red-500/10 border-red-500/30"
        >
          <p className="text-red-300 font-medium text-sm">
            {scaffold.level === 1 ? scaffold.message : 'Incorrect.'}
          </p>
          {scaffold.level >= 2 && block.hint && (
            <p className="text-slate-300 text-sm mt-2">
              <span className="text-amber-400 font-medium">Hint: </span>{block.hint}
            </p>
          )}
          {scaffold.level >= 5 && block.explanation && (
            <p className="text-slate-300 text-sm mt-2">{block.explanation}</p>
          )}
        </motion.div>
      )}

      {submitted && isCorrect && block.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-4 border bg-emerald-500/10 border-emerald-500/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span className="text-emerald-300 font-semibold">Correct!</span>
          </div>
          <p className="text-slate-300 text-sm">{block.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

function SliderInteraction({ block, attempts = 0, onAnswer }) {
  const min = block.min ?? 0
  const max = block.max ?? 100
  const step = block.step ?? 1
  const [value, setValue] = useState(Math.round((min + max) / 2))
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    const correct = parseFloat(block.correctAnswer)
    const tolerance = Math.abs(correct * 0.01) || step
    const result = Math.abs(value - correct) <= tolerance
    setIsCorrect(result)
    setSubmitted(true)
    onAnswer?.(result)
  }

  const handleRetry = () => {
    setSubmitted(false)
    setIsCorrect(false)
  }

  const pct = ((value - min) / (max - min)) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <p className="text-slate-200 text-lg">{renderFormattedText(block.prompt)}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>{min}{block.unit ? ` ${block.unit}` : ''}</span>
          <span className="text-indigo-300 font-mono text-lg font-bold">
            {value}{block.unit ? ` ${block.unit}` : ''}
          </span>
          <span>{max}{block.unit ? ` ${block.unit}` : ''}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            disabled={submitted && isCorrect}
            className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${pct}%, #334155 ${pct}%, #334155 100%)`,
            }}
          />
        </div>
        {block.visualLabel && (
          <p className="text-center text-sm text-slate-400">{block.visualLabel}</p>
        )}
      </div>

      {!submitted && (
        <Button onClick={handleSubmit}>Submit</Button>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg p-4 border ${
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          {isCorrect ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Correct!</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <XCircle size={18} className="text-red-400" />
                <span className="text-red-300 font-semibold">Not quite.</span>
              </div>
              {getScaffold(attempts).level >= 5 && (
                <p className="text-slate-300 text-sm mt-2">
                  The answer is <span className="font-mono font-semibold text-white">{block.correctAnswer}{block.unit ? ` ${block.unit}` : ''}</span>.
                </p>
              )}
              <Button variant="secondary" size="sm" onClick={handleRetry} className="mt-3" icon={RotateCcw}>
                Try Again
              </Button>
            </div>
          )}
          {isCorrect && block.explanation && (
            <p className="text-slate-300 text-sm mt-2">{block.explanation}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// --- Quiz Block ---
function QuizBlock({ block, attempts, onAnswer, onComplete }) {
  const questions = block.questions || []
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [qAttempts, setQAttempts] = useState({})

  const handleAnswer = (correct) => {
    const qKey = `q${currentQ}`
    const currentAttempts = (qAttempts[qKey] || 0) + 1
    setQAttempts((prev) => ({ ...prev, [qKey]: currentAttempts }))

    if (correct) {
      setScore((s) => s + 1)
      // Move to next after a short delay
      setTimeout(() => {
        if (currentQ < questions.length - 1) {
          setCurrentQ((q) => q + 1)
        } else {
          setQuizDone(true)
          onComplete?.()
        }
      }, 1200)
    }
    onAnswer?.(correct, currentQ)
  }

  const handleNextAfterWalkthrough = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1)
    } else {
      setQuizDone(true)
      onComplete?.()
    }
  }

  if (quizDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6 space-y-4"
      >
        <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center">
          <Trophy size={32} className="text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Quiz Complete!</h3>
        <p className="text-slate-300">
          You got <span className="text-amber-300 font-semibold">{score}</span> out of{' '}
          <span className="text-white font-semibold">{questions.length}</span> correct
        </p>
        <ProgressBar
          value={score}
          max={questions.length}
          color={score === questions.length ? 'emerald' : score >= questions.length / 2 ? 'amber' : 'red'}
          showPercentage
          className="max-w-xs mx-auto"
        />
      </motion.div>
    )
  }

  const question = questions[currentQ]
  if (!question) return null

  const qKey = `q${currentQ}`
  const currentQAttempts = qAttempts[qKey] || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className="text-sm text-emerald-400 font-medium">
          Score: {score}/{currentQ}
        </span>
      </div>

      <QuizQuestion
        question={question}
        attempts={currentQAttempts}
        onAnswer={handleAnswer}
        onSkip={handleNextAfterWalkthrough}
      />
    </motion.div>
  )
}

function QuizQuestion({ question, attempts, onAnswer, onSkip }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const options = question.options || []

  const handleSelect = (idx) => {
    if (submitted && isCorrect) return
    if (submitted) setSubmitted(false)
    setSelected(idx)
  }

  const handleSubmit = () => {
    if (selected === null) return
    const result = selected === question.correctIndex
    setIsCorrect(result)
    setSubmitted(true)
    onAnswer?.(result)
  }

  const handleRetry = () => {
    setSelected(null)
    setSubmitted(false)
    setIsCorrect(false)
  }

  const scaffold = getScaffold(attempts)

  return (
    <div className="space-y-4">
      <p className="text-white text-lg font-medium">{renderFormattedText(question.text)}</p>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          let style = 'border-slate-600/40 bg-slate-800/40'
          if (selected === idx && !submitted) style = 'border-indigo-500/60 bg-indigo-500/10'
          if (submitted && idx === question.correctIndex) style = 'border-emerald-500/60 bg-emerald-500/10'
          if (submitted && idx === selected && !isCorrect) style = 'border-red-500/60 bg-red-500/10'

          return (
            <motion.button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={submitted && isCorrect}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${style} disabled:opacity-60`}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full border border-slate-500/40 flex items-center justify-center text-xs text-slate-400">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-slate-200 text-sm">{opt}</span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {!submitted && (
        <Button onClick={handleSubmit} size="sm" disabled={selected === null}>
          Submit
        </Button>
      )}

      {submitted && !isCorrect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg p-3 bg-red-500/10 border border-red-500/30 space-y-2"
        >
          {scaffold.level === 1 && (
            <p className="text-red-300 text-sm">{scaffold.message}</p>
          )}
          {scaffold.level >= 2 && question.hint && (
            <p className="text-sm text-slate-300">
              <span className="text-amber-400 font-medium">Hint: </span>{question.hint}
            </p>
          )}
          {scaffold.level >= 3 && question.steps && (
            <div className="space-y-1">
              <span className="text-sky-400 text-xs font-medium">Steps:</span>
              {question.steps.map((s, i) => (
                <p key={i} className="text-slate-300 text-xs pl-3">{i + 1}. {s}</p>
              ))}
            </div>
          )}
          {scaffold.level >= 5 && (
            <div className="border-t border-red-500/20 pt-2 mt-2">
              <p className="text-amber-300 text-sm font-medium">The correct answer is: {options[question.correctIndex]}</p>
              {question.explanation && (
                <p className="text-slate-300 text-xs mt-1">{question.explanation}</p>
              )}
              <Button variant="secondary" size="sm" onClick={onSkip} className="mt-2">
                Continue
              </Button>
            </div>
          )}
          {scaffold.level < 5 && (
            <Button variant="secondary" size="sm" onClick={handleRetry} icon={RotateCcw}>
              Try Again
            </Button>
          )}
        </motion.div>
      )}

      {submitted && isCorrect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg p-3 bg-emerald-500/10 border border-emerald-500/30"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-emerald-300 font-semibold text-sm">Correct!</span>
          </div>
          {question.explanation && (
            <p className="text-slate-300 text-xs mt-1">{question.explanation}</p>
          )}
        </motion.div>
      )}
    </div>
  )
}

// =====================================================================
// COMPLETION SCREEN
// =====================================================================
function CompletionScreen({ star, constellation, earnedXP, onContinue, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* Star burst animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 12, delay: 0.2 }}
          className="relative mx-auto w-32 h-32"
        >
          <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
          <div
            className="absolute inset-2 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(245,158,11,0.1) 70%)',
              boxShadow: '0 0 60px rgba(245, 158, 11, 0.4)',
            }}
          >
            <Star size={48} className="text-amber-400" fill="currentColor" />
          </div>
          {/* Sparkle particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-400"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 6) * 70,
                y: Math.sin((i * Math.PI * 2) / 6) * 70,
              }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
              style={{ left: '50%', top: '50%', marginLeft: -4, marginTop: -4 }}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-bold text-white">Star Completed!</h1>
          <p className="text-slate-400">{star?.name || 'Lesson'}</p>
        </motion.div>

        {/* XP Earned */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap size={24} className="text-amber-400" />
            <span className="text-3xl font-bold text-amber-300">+{earnedXP} XP</span>
          </div>
          <div className="space-y-1 text-sm text-slate-400">
            <p>Base lesson XP: +25</p>
            {earnedXP > 25 && <p>Bonus XP: +{earnedXP - 25}</p>}
          </div>
        </motion.div>

        {/* Concepts mastered */}
        {star?.concepts && star.concepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-3"
          >
            <h3 className="text-sm text-slate-400 uppercase tracking-wide">Concepts Covered</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {star.concepts.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs text-indigo-300"
                >
                  {c.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col gap-3 pt-4"
        >
          <Button onClick={onContinue} icon={ChevronRight} size="lg" className="w-full justify-center">
            Continue to Next Star
          </Button>
          <Button variant="secondary" onClick={onBack} icon={ArrowLeft} size="md" className="w-full justify-center">
            Back to {constellation?.name || 'Constellation'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// =====================================================================
// MAIN COMPONENT: StarLesson
// =====================================================================
function StarLesson() {
  const { constellationId, starId } = useParams()
  const navigate = useNavigate()
  const completeStarLesson = useProgressStore((s) => s.completeStarLesson)
  const addXP = useUserStore((s) => s.addXP)

  // Find data
  const stars = allStars[constellationId] || []
  const star = stars.find((s) => s.id === starId)
  const constellation = constellations.find((c) => c.id === constellationId)
  const blocks = star?.blocks || []

  // State
  const [currentBlock, setCurrentBlock] = useState(0)
  const [blockCompleted, setBlockCompleted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [attempts, setAttempts] = useState({})
  const [lessonComplete, setLessonComplete] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)

  // Determine if block auto-completes (text, formula, keyInsight)
  const currentBlockData = blocks[currentBlock]
  const isPassiveBlock = currentBlockData
    ? ['text', 'formula', 'keyInsight'].includes(currentBlockData.type)
    : false

  // Auto-mark passive blocks as completed
  useEffect(() => {
    if (isPassiveBlock) {
      const timer = setTimeout(() => setBlockCompleted(true), 600)
      return () => clearTimeout(timer)
    }
  }, [currentBlock, isPassiveBlock])

  const handleBlockAnswer = useCallback(
    (correct, questionIdx) => {
      const blockKey = `block-${currentBlock}`
      setAttempts((prev) => ({
        ...prev,
        [blockKey]: (prev[blockKey] || 0) + 1,
      }))
      setAnswers((prev) => ({
        ...prev,
        [blockKey]: correct,
      }))
      if (correct) {
        setBlockCompleted(true)
      }
    },
    [currentBlock]
  )

  const handleBlockComplete = useCallback(() => {
    setBlockCompleted(true)
  }, [])

  const handleContinue = useCallback(() => {
    if (currentBlock < blocks.length - 1) {
      setCurrentBlock((b) => b + 1)
      setBlockCompleted(false)
    } else {
      // Lesson finished
      const score = 100 // Calculate based on quiz answers if needed
      const result = completeStarLesson(starId, constellationId, score)
      const xp = addXP(result?.xpEarned || 25)
      setEarnedXP(xp || result?.xpEarned || 25)
      setLessonComplete(true)
    }
  }, [currentBlock, blocks.length, starId, constellationId, completeStarLesson, addXP])

  const handleContinueToNext = useCallback(() => {
    if (!constellation) return navigate(`/antaryaan`)
    const starIndex = constellation.starIds?.indexOf(starId) ?? -1
    if (starIndex >= 0 && starIndex < (constellation.starIds?.length || 0) - 1) {
      const nextStarId = constellation.starIds[starIndex + 1]
      navigate(`/antaryaan/star/${constellationId}/${nextStarId}`)
      // Reset state
      setCurrentBlock(0)
      setBlockCompleted(false)
      setAnswers({})
      setAttempts({})
      setLessonComplete(false)
      setEarnedXP(0)
    } else {
      navigate(`/antaryaan/constellation/${constellationId}`)
    }
  }, [constellation, starId, constellationId, navigate])

  const handleBack = useCallback(() => {
    navigate(`/antaryaan/constellation/${constellationId}`)
  }, [navigate, constellationId])

  // Not found state
  if (!star) {
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
            <h2 className="text-2xl font-bold text-white">Star Not Found</h2>
            <p className="text-slate-400 max-w-md">
              This star lesson hasn't been charted yet. The data may still be loading or the star ID is invalid.
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
  if (lessonComplete) {
    return (
      <div className="min-h-screen relative">
        <SpaceBackground />
        <div className="relative z-10">
          <CompletionScreen
            star={star}
            constellation={constellation}
            earnedXP={earnedXP}
            onContinue={handleContinueToNext}
            onBack={handleBack}
          />
        </div>
      </div>
    )
  }

  // Render block content
  function renderBlock(block, index) {
    if (!block) return null
    const blockKey = `block-${index}`
    const blockAttempts = attempts[blockKey] || 0

    switch (block.type) {
      case 'text':
        return <TextBlock block={block} />
      case 'formula':
        return <FormulaBlock block={block} />
      case 'keyInsight':
        return <KeyInsightBlock block={block} />
      case 'reveal':
        return <RevealBlock block={block} onComplete={handleBlockComplete} />
      case 'interactive':
        return (
          <InteractiveBlock
            block={block}
            attempts={blockAttempts}
            onAnswer={(correct) => handleBlockAnswer(correct)}
          />
        )
      case 'quiz':
        return (
          <QuizBlock
            block={block}
            attempts={blockAttempts}
            onAnswer={(correct, qIdx) => handleBlockAnswer(correct, qIdx)}
            onComplete={handleBlockComplete}
          />
        )
      case 'simulation':
        return (
          <SimulationBlock
            block={block}
            onComplete={handleBlockComplete}
            onDiscovery={(discovery) => {
              // Discovery awards tracked internally; advance block on complete
            }}
          />
        )
      case 'sandbox':
        return (
          <SandboxBlock
            block={block}
            onComplete={handleBlockComplete}
            onGoalComplete={(goal) => {
              // Goals tracked internally by SandboxBlock
            }}
          />
        )
      case 'challenge':
        return (
          <ChallengeBlock
            block={block}
            onComplete={handleBlockComplete}
          />
        )
      default:
        return (
          <div className="text-slate-400 italic">
            Unknown block type: {block.type}
          </div>
        )
    }
  }

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
                {star.name}
              </h1>
              <p className="text-slate-500 text-xs">
                {constellation?.name || constellationId}
              </p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:block">
              {currentBlock + 1} / {blocks.length}
            </span>
            <div className="w-32 sm:w-48">
              <ProgressBar
                value={currentBlock + 1}
                max={blocks.length}
                color="amber"
                size="sm"
                animated
              />
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center px-4 md:px-6 py-8 overflow-y-auto">
          <div className={`w-full ${
            currentBlockData && ['simulation', 'sandbox', 'challenge'].includes(currentBlockData.type)
              ? 'max-w-4xl'
              : 'max-w-2xl'
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBlock}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                {renderBlock(currentBlockData, currentBlock)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Bar: Continue Button */}
        <AnimatePresence>
          {blockCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="border-t border-slate-700/30 bg-slate-900/60 backdrop-blur-md px-4 md:px-6 py-4"
            >
              <div className="max-w-2xl mx-auto flex justify-end">
                <Button
                  onClick={handleContinue}
                  icon={currentBlock < blocks.length - 1 ? ChevronRight : Sparkles}
                  size="lg"
                >
                  {currentBlock < blocks.length - 1 ? 'Continue' : 'Complete Lesson'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default StarLesson
