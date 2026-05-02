import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  X,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  BookOpen,
  RotateCcw,
} from 'lucide-react'
import Button from './Button'

const SCAFFOLD_MESSAGES = {
  0: null,
  1: { type: 'encourage', icon: RotateCcw },
  2: { type: 'hint', icon: Lightbulb },
  3: { type: 'steps', icon: ArrowRight },
  4: { type: 'example', icon: BookOpen },
  5: { type: 'walkthrough', icon: BookOpen },
}

function QuizQuestion({
  question = {},
  type = 'mcq',
  options = [],
  onAnswer,
  showFeedback = true,
  scaffoldLevel = 0,
}) {
  const [selected, setSelected] = useState(null)
  const [multiSelected, setMultiSelected] = useState([])
  const [numericalValue, setNumericalValue] = useState('')
  const [matchSelections, setMatchSelections] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [attempts, setAttempts] = useState(0)

  const correctAnswer = question.correctAnswer
  const explanation = question.explanation || ''

  // MCQ - single answer
  const handleMCQSelect = useCallback(
    (optionIndex) => {
      if (submitted) return
      setSelected(optionIndex)
    },
    [submitted]
  )

  // MCQ-Multi - toggle
  const handleMultiToggle = useCallback(
    (optionIndex) => {
      if (submitted) return
      setMultiSelected((prev) =>
        prev.includes(optionIndex)
          ? prev.filter((i) => i !== optionIndex)
          : [...prev, optionIndex]
      )
    },
    [submitted]
  )

  // Match - select pairing
  const handleMatchSelect = useCallback(
    (leftIndex, rightIndex) => {
      if (submitted) return
      setMatchSelections((prev) => ({
        ...prev,
        [leftIndex]: rightIndex,
      }))
    },
    [submitted]
  )

  // Submit answer
  const handleSubmit = useCallback(() => {
    let correct = false
    let answerData = null

    switch (type) {
      case 'mcq':
        correct = selected === correctAnswer
        answerData = selected
        break
      case 'numerical': {
        const numVal = parseFloat(numericalValue)
        const tolerance = question.tolerance || 0.01
        const target =
          typeof correctAnswer === 'number'
            ? correctAnswer
            : parseFloat(correctAnswer)
        correct = Math.abs(numVal - target) <= tolerance
        answerData = numVal
        break
      }
      case 'mcq-multi': {
        const sortedSelected = [...multiSelected].sort()
        const sortedCorrect = [...(Array.isArray(correctAnswer) ? correctAnswer : [])].sort()
        correct =
          sortedSelected.length === sortedCorrect.length &&
          sortedSelected.every((v, i) => v === sortedCorrect[i])
        answerData = multiSelected
        break
      }
      case 'match': {
        const correctMatches = question.correctMatches || {}
        correct = Object.keys(correctMatches).every(
          (key) => matchSelections[key] === correctMatches[key]
        )
        answerData = matchSelections
        break
      }
      default:
        break
    }

    setSubmitted(true)
    setIsCorrect(correct)
    setAttempts((prev) => prev + 1)

    if (onAnswer) {
      onAnswer({
        correct,
        answer: answerData,
        attempts: attempts + 1,
      })
    }
  }, [
    type,
    selected,
    numericalValue,
    multiSelected,
    matchSelections,
    correctAnswer,
    question,
    attempts,
    onAnswer,
  ])

  // Reset for retry
  const handleRetry = useCallback(() => {
    setSubmitted(false)
    setIsCorrect(null)
    setSelected(null)
    setMultiSelected([])
    setNumericalValue('')
    setMatchSelections({})
  }, [])

  // Check if can submit
  const canSubmit = (() => {
    switch (type) {
      case 'mcq':
        return selected !== null
      case 'numerical':
        return numericalValue.trim() !== ''
      case 'mcq-multi':
        return multiSelected.length > 0
      case 'match':
        return Object.keys(matchSelections).length > 0
      default:
        return false
    }
  })()

  // Get current scaffold info
  const scaffold = SCAFFOLD_MESSAGES[Math.min(scaffoldLevel, 5)]

  return (
    <div className="w-full space-y-4">
      {/* Question text */}
      <div className="space-y-2">
        <p className="text-lg text-white font-medium leading-relaxed">
          {question.text || question.question || ''}
        </p>
        {question.image && (
          <img
            src={question.image}
            alt="Question illustration"
            className="max-w-full rounded-lg border border-slate-700/50"
          />
        )}
      </div>

      {/* Answer area based on type */}
      <div className="space-y-3">
        {type === 'mcq' && (
          <MCQOptions
            options={options}
            selected={selected}
            onSelect={handleMCQSelect}
            submitted={submitted}
            correctAnswer={correctAnswer}
          />
        )}

        {type === 'mcq-multi' && (
          <MCQMultiOptions
            options={options}
            selected={multiSelected}
            onToggle={handleMultiToggle}
            submitted={submitted}
            correctAnswer={correctAnswer}
          />
        )}

        {type === 'numerical' && (
          <NumericalInput
            value={numericalValue}
            onChange={setNumericalValue}
            submitted={submitted}
            isCorrect={isCorrect}
            unit={question.unit || ''}
            placeholder={question.placeholder || 'Enter your answer'}
          />
        )}

        {type === 'match' && (
          <MatchQuestion
            leftItems={question.leftItems || []}
            rightItems={question.rightItems || []}
            selections={matchSelections}
            onSelect={handleMatchSelect}
            submitted={submitted}
            correctMatches={question.correctMatches || {}}
          />
        )}
      </div>

      {/* Submit / Retry */}
      <div className="flex items-center gap-3">
        {!submitted ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
            icon={ArrowRight}
          >
            Check Answer
          </Button>
        ) : (
          !isCorrect && (
            <Button variant="secondary" onClick={handleRetry} icon={RotateCcw}>
              Try Again
            </Button>
          )
        )}
      </div>

      {/* Feedback area */}
      <AnimatePresence>
        {submitted && showFeedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {/* Correct / Wrong feedback */}
            <FeedbackBanner isCorrect={isCorrect} />

            {/* Explanation */}
            {isCorrect && explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-3 p-4 rounded-lg bg-slate-800/60 border border-slate-700/40"
              >
                <p className="text-sm text-slate-300">{explanation}</p>
              </motion.div>
            )}

            {/* Scaffolding help */}
            {!isCorrect && scaffold && (
              <ScaffoldHelp
                level={scaffoldLevel}
                scaffold={scaffold}
                question={question}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== Sub-components ===== */

function MCQOptions({ options, selected, onSelect, submitted, correctAnswer }) {
  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const isSelected = selected === index
        const isCorrectOption = index === correctAnswer
        const showResult = submitted

        let stateClasses = 'border-slate-700/50 hover:border-slate-500/70 bg-slate-800/30'
        if (isSelected && !showResult) {
          stateClasses = 'border-indigo-500/60 bg-indigo-500/10'
        }
        if (showResult && isCorrectOption) {
          stateClasses = 'border-emerald-500/60 bg-emerald-500/10'
        }
        if (showResult && isSelected && !isCorrectOption) {
          stateClasses = 'border-red-500/60 bg-red-500/10'
        }

        return (
          <motion.button
            key={index}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${stateClasses} ${
              submitted ? 'cursor-default' : 'cursor-pointer'
            }`}
            onClick={() => onSelect(index)}
            whileHover={submitted ? {} : { scale: 1.01 }}
            whileTap={submitted ? {} : { scale: 0.99 }}
            animate={
              showResult && isSelected && !isCorrectOption
                ? { x: [0, -6, 6, -4, 4, 0] }
                : showResult && isCorrectOption
                  ? { scale: [1, 1.03, 1] }
                  : {}
            }
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md bg-slate-700/50 text-sm font-medium text-slate-300">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-slate-200 text-sm">
                {typeof option === 'string' ? option : option.text || option.label || ''}
              </span>
              {showResult && isCorrectOption && (
                <Check size={16} className="ml-auto text-emerald-400" />
              )}
              {showResult && isSelected && !isCorrectOption && (
                <X size={16} className="ml-auto text-red-400" />
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

function MCQMultiOptions({ options, selected, onToggle, submitted, correctAnswer }) {
  const correctSet = new Set(Array.isArray(correctAnswer) ? correctAnswer : [])

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500">Select all that apply</p>
      {options.map((option, index) => {
        const isSelected = selected.includes(index)
        const isCorrectOption = correctSet.has(index)
        const showResult = submitted

        let stateClasses = 'border-slate-700/50 hover:border-slate-500/70 bg-slate-800/30'
        if (isSelected && !showResult) {
          stateClasses = 'border-indigo-500/60 bg-indigo-500/10'
        }
        if (showResult && isCorrectOption) {
          stateClasses = 'border-emerald-500/60 bg-emerald-500/10'
        }
        if (showResult && isSelected && !isCorrectOption) {
          stateClasses = 'border-red-500/60 bg-red-500/10'
        }

        return (
          <motion.button
            key={index}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${stateClasses} ${
              submitted ? 'cursor-default' : 'cursor-pointer'
            }`}
            onClick={() => onToggle(index)}
            whileTap={submitted ? {} : { scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-slate-600 bg-transparent'
                }`}
              >
                {isSelected && <Check size={12} className="text-white" />}
              </span>
              <span className="text-slate-200 text-sm">
                {typeof option === 'string' ? option : option.text || option.label || ''}
              </span>
              {showResult && isCorrectOption && (
                <Check size={16} className="ml-auto text-emerald-400" />
              )}
              {showResult && isSelected && !isCorrectOption && (
                <X size={16} className="ml-auto text-red-400" />
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

function NumericalInput({
  value,
  onChange,
  submitted,
  isCorrect,
  unit,
  placeholder,
}) {
  return (
    <motion.div
      className="flex items-center gap-2"
      animate={
        submitted && !isCorrect
          ? { x: [0, -6, 6, -4, 4, 0] }
          : submitted && isCorrect
            ? { scale: [1, 1.02, 1] }
            : {}
      }
      transition={{ duration: 0.4 }}
    >
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={submitted && isCorrect}
        placeholder={placeholder}
        className={`flex-1 px-4 py-3 rounded-lg border bg-slate-800/50 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
          submitted && isCorrect
            ? 'border-emerald-500/60'
            : submitted && !isCorrect
              ? 'border-red-500/60'
              : 'border-slate-700/50'
        }`}
      />
      {unit && (
        <span className="text-sm text-slate-400 font-medium px-2">{unit}</span>
      )}
    </motion.div>
  )
}

function MatchQuestion({
  leftItems,
  rightItems,
  selections,
  onSelect,
  submitted,
  correctMatches,
}) {
  const [activeLeft, setActiveLeft] = useState(null)

  const handleLeftClick = (index) => {
    if (submitted) return
    setActiveLeft(index)
  }

  const handleRightClick = (index) => {
    if (submitted || activeLeft === null) return
    onSelect(activeLeft, index)
    setActiveLeft(null)
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500">Click a left item, then its matching right item</p>
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-2">
          {leftItems.map((item, index) => {
            const isActive = activeLeft === index
            const hasMatch = selections[index] !== undefined
            const isCorrectMatch =
              submitted && selections[index] === correctMatches[index]
            const isWrongMatch =
              submitted && hasMatch && selections[index] !== correctMatches[index]

            return (
              <button
                key={index}
                onClick={() => handleLeftClick(index)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                  isActive
                    ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-200'
                    : isCorrectMatch
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                      : isWrongMatch
                        ? 'border-red-500/60 bg-red-500/10 text-red-200'
                        : hasMatch
                          ? 'border-sky-500/40 bg-sky-500/5 text-sky-200'
                          : 'border-slate-700/50 bg-slate-800/30 text-slate-200 hover:border-slate-500/70'
                } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {typeof item === 'string' ? item : item.text || item.label || ''}
              </button>
            )
          })}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {rightItems.map((item, index) => {
            const isMatched = Object.values(selections).includes(index)

            return (
              <button
                key={index}
                onClick={() => handleRightClick(index)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                  isMatched
                    ? 'border-sky-500/40 bg-sky-500/5 text-sky-200'
                    : 'border-slate-700/50 bg-slate-800/30 text-slate-200 hover:border-slate-500/70'
                } ${submitted || activeLeft === null ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {typeof item === 'string' ? item : item.text || item.label || ''}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function FeedbackBanner({ isCorrect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
        isCorrect
          ? 'bg-emerald-500/10 border border-emerald-500/30'
          : 'bg-red-500/10 border border-red-500/30'
      }`}
    >
      {isCorrect ? (
        <>
          <Check size={18} className="text-emerald-400" />
          <span className="text-emerald-300 font-medium">Correct!</span>
        </>
      ) : (
        <>
          <X size={18} className="text-red-400" />
          <span className="text-red-300 font-medium">Not quite right</span>
        </>
      )}
    </motion.div>
  )
}

function ScaffoldHelp({ level, scaffold, question }) {
  if (!scaffold) return null

  const content = (() => {
    switch (scaffold.type) {
      case 'encourage':
        return (
          <p className="text-sm text-amber-200">
            Not quite! Give it another shot. You're close!
          </p>
        )
      case 'hint':
        return (
          <div className="space-y-1">
            <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">Hint</p>
            <p className="text-sm text-slate-300">
              {question.hint || 'Think about the key concepts involved.'}
            </p>
          </div>
        )
      case 'steps':
        return (
          <div className="space-y-2">
            <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              Break it down
            </p>
            {question.steps ? (
              <ol className="list-decimal list-inside space-y-1">
                {question.steps.map((step, i) => (
                  <li key={i} className="text-sm text-slate-300">
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-300">
                Try breaking the problem into smaller parts.
              </p>
            )}
          </div>
        )
      case 'example':
        return (
          <div className="space-y-2">
            <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              Worked Example
            </p>
            <div className="p-3 rounded-md bg-slate-900/60 border border-slate-700/30">
              <p className="text-sm text-slate-300 font-mono">
                {question.workedExample || 'Review the formula and try substituting the values.'}
              </p>
            </div>
          </div>
        )
      case 'walkthrough':
        return (
          <div className="space-y-2">
            <p className="text-xs font-medium text-amber-400 uppercase tracking-wider">
              Full Walkthrough
            </p>
            <div className="p-3 rounded-md bg-slate-900/60 border border-slate-700/30 space-y-2">
              <p className="text-sm text-slate-300">
                {question.walkthrough || question.explanation || 'Let us work through this step by step.'}
              </p>
              {question.correctAnswer !== undefined && (
                <p className="text-sm text-emerald-300 font-medium">
                  The answer is:{' '}
                  {Array.isArray(question.correctAnswer)
                    ? question.correctAnswer.join(', ')
                    : String(question.correctAnswer)}
                </p>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  })()

  if (!content) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20"
    >
      <div className="flex items-start gap-2">
        <scaffold.icon size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">{content}</div>
      </div>
    </motion.div>
  )
}

export default QuizQuestion
