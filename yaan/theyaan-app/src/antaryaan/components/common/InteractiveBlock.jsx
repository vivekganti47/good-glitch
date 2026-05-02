import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight, GripVertical } from 'lucide-react'
import Button from './Button'

function InteractiveBlock({ type = 'number-input', data = {} }) {
  switch (type) {
    case 'number-input':
      return <NumberInputBlock data={data} />
    case 'slider':
      return <SliderBlock data={data} />
    case 'drag-drop':
      return <DragDropBlock data={data} />
    case 'select':
      return <SelectBlock data={data} />
    default:
      return (
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm">
          Unknown interactive block type: {type}
        </div>
      )
  }
}

/* ===== Number Input Block ===== */
function NumberInputBlock({ data }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [attempts, setAttempts] = useState(0)

  const {
    prompt = 'Enter your answer:',
    correctAnswer,
    tolerance = 0.01,
    unit = '',
    placeholder = 'Your answer',
    feedback = {},
  } = data

  const handleSubmit = useCallback(() => {
    const numVal = parseFloat(value)
    if (isNaN(numVal)) return

    const target =
      typeof correctAnswer === 'number' ? correctAnswer : parseFloat(correctAnswer)
    const correct = Math.abs(numVal - target) <= tolerance
    setIsCorrect(correct)
    setSubmitted(true)
    setAttempts((prev) => prev + 1)
  }, [value, correctAnswer, tolerance])

  const handleRetry = useCallback(() => {
    setSubmitted(false)
    setIsCorrect(null)
    setValue('')
  }, [])

  return (
    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-3">
      <p className="text-sm text-slate-300">{prompt}</p>

      <motion.div
        className="flex items-center gap-2"
        animate={
          submitted && !isCorrect ? { x: [0, -5, 5, -3, 3, 0] } : {}
        }
        transition={{ duration: 0.35 }}
      >
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={submitted && isCorrect}
          placeholder={placeholder}
          className={`flex-1 px-4 py-2.5 rounded-lg border bg-slate-900/50 text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
            submitted && isCorrect
              ? 'border-emerald-500/50'
              : submitted && !isCorrect
                ? 'border-red-500/50'
                : 'border-slate-700/50'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !submitted) handleSubmit()
          }}
        />
        {unit && <span className="text-sm text-slate-400">{unit}</span>}

        {!submitted ? (
          <Button
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            disabled={value.trim() === ''}
            icon={ArrowRight}
          >
            Check
          </Button>
        ) : !isCorrect ? (
          <Button size="sm" variant="secondary" onClick={handleRetry}>
            Retry
          </Button>
        ) : null}
      </motion.div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <InlineFeedback
              isCorrect={isCorrect}
              correctText={feedback.correct || 'Great job!'}
              wrongText={
                feedback.wrong ||
                (attempts >= 2
                  ? `The correct answer is ${correctAnswer}${unit ? ' ' + unit : ''}.`
                  : 'Not quite. Try again!')
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== Slider Block ===== */
function SliderBlock({ data }) {
  const {
    prompt = 'Adjust the slider:',
    min = 0,
    max = 100,
    step = 1,
    defaultValue = 50,
    correctValue,
    tolerance = 2,
    unit = '',
    labels = {},
    showValue = true,
    visualFn, // function name to describe what changes visually
  } = data

  const [value, setValue] = useState(defaultValue)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  const handleSubmit = useCallback(() => {
    if (correctValue !== undefined) {
      const correct = Math.abs(value - correctValue) <= tolerance
      setIsCorrect(correct)
    }
    setSubmitted(true)
  }, [value, correctValue, tolerance])

  return (
    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-3">
      <p className="text-sm text-slate-300">{prompt}</p>

      <div className="space-y-2">
        {/* Slider */}
        <div className="flex items-center gap-3">
          {labels.min && (
            <span className="text-xs text-slate-500">{labels.min}</span>
          )}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              setValue(parseFloat(e.target.value))
              if (submitted) {
                setSubmitted(false)
                setIsCorrect(null)
              }
            }}
            className="flex-1 h-2 rounded-full appearance-none bg-slate-700 accent-indigo-500 cursor-pointer"
          />
          {labels.max && (
            <span className="text-xs text-slate-500">{labels.max}</span>
          )}
        </div>

        {/* Value display */}
        {showValue && (
          <div className="flex items-center justify-between">
            <span className="text-lg font-mono font-bold text-indigo-300">
              {value}
              {unit ? ` ${unit}` : ''}
            </span>
            {correctValue !== undefined && !submitted && (
              <Button size="sm" variant="primary" onClick={handleSubmit}>
                Check
              </Button>
            )}
          </div>
        )}

        {/* Visual description */}
        {visualFn && (
          <p className="text-xs text-slate-500 italic">{visualFn}</p>
        )}
      </div>

      <AnimatePresence>
        {submitted && isCorrect !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <InlineFeedback
              isCorrect={isCorrect}
              correctText="Perfect!"
              wrongText={`Try adjusting closer to ${correctValue}${unit ? ' ' + unit : ''}.`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== Drag and Drop Block ===== */
function DragDropBlock({ data }) {
  const {
    prompt = 'Drag items to the correct zones:',
    items = [],
    zones = [],
    correctMapping = {}, // { itemIndex: zoneIndex }
  } = data

  const [placements, setPlacements] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState({})
  const [dragItem, setDragItem] = useState(null)

  const handleDrop = useCallback(
    (zoneIndex) => {
      if (submitted || dragItem === null) return
      setPlacements((prev) => ({ ...prev, [dragItem]: zoneIndex }))
      setDragItem(null)
    },
    [submitted, dragItem]
  )

  const handleSubmit = useCallback(() => {
    const itemResults = {}
    Object.keys(correctMapping).forEach((itemIdx) => {
      itemResults[itemIdx] =
        placements[itemIdx] === correctMapping[itemIdx]
    })
    setResults(itemResults)
    setSubmitted(true)
  }, [placements, correctMapping])

  const handleReset = useCallback(() => {
    setPlacements({})
    setResults({})
    setSubmitted(false)
    setDragItem(null)
  }, [])

  // Items not yet placed
  const unplacedItems = items
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => placements[index] === undefined)

  return (
    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-4">
      <p className="text-sm text-slate-300">{prompt}</p>

      {/* Unplaced items pool */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg bg-slate-900/30 border border-dashed border-slate-700/50">
        {unplacedItems.length === 0 && !submitted && (
          <span className="text-xs text-slate-600 self-center">
            All items placed
          </span>
        )}
        {unplacedItems.map(({ item, index }) => (
          <motion.button
            key={index}
            className={`px-3 py-1.5 rounded-md text-sm border cursor-grab ${
              dragItem === index
                ? 'border-indigo-500/60 bg-indigo-500/15 text-indigo-200'
                : 'border-slate-600/50 bg-slate-700/30 text-slate-200 hover:border-slate-500'
            }`}
            onClick={() => setDragItem(dragItem === index ? null : index)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            layout
          >
            <div className="flex items-center gap-1.5">
              <GripVertical size={12} className="text-slate-500" />
              <span>{typeof item === 'string' ? item : item.text || item.label || ''}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Drop zones */}
      <div className="grid grid-cols-2 gap-3">
        {zones.map((zone, zoneIndex) => {
          const placedHere = Object.entries(placements)
            .filter(([, zIdx]) => zIdx === zoneIndex)
            .map(([itemIdx]) => parseInt(itemIdx))

          return (
            <div
              key={zoneIndex}
              className={`p-3 rounded-lg border-2 border-dashed min-h-[80px] transition-colors ${
                dragItem !== null
                  ? 'border-indigo-500/40 bg-indigo-500/5'
                  : 'border-slate-700/40 bg-slate-900/20'
              }`}
              onClick={() => handleDrop(zoneIndex)}
            >
              <p className="text-xs font-medium text-slate-400 mb-2">
                {typeof zone === 'string' ? zone : zone.label || zone.text || `Zone ${zoneIndex + 1}`}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {placedHere.map((itemIdx) => (
                  <motion.span
                    key={itemIdx}
                    className={`px-2 py-1 rounded text-xs border ${
                      submitted
                        ? results[itemIdx]
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                          : 'border-red-500/50 bg-red-500/10 text-red-300'
                        : 'border-slate-600/50 bg-slate-700/30 text-slate-200'
                    }`}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={(e) => {
                      if (submitted) return
                      e.stopPropagation()
                      // Remove from zone
                      setPlacements((prev) => {
                        const next = { ...prev }
                        delete next[itemIdx]
                        return next
                      })
                    }}
                  >
                    {typeof items[itemIdx] === 'string'
                      ? items[itemIdx]
                      : items[itemIdx]?.text || items[itemIdx]?.label || ''}
                  </motion.span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!submitted ? (
          <Button
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            disabled={Object.keys(placements).length === 0}
            icon={Check}
          >
            Check
          </Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

/* ===== Select Block ===== */
function SelectBlock({ data }) {
  const {
    prompt = 'Select the correct option:',
    options = [],
    correctAnswer,
    feedback = {},
  } = data

  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [attempts, setAttempts] = useState(0)

  const handleSelect = useCallback(
    (index) => {
      if (submitted && isCorrect) return
      setSelected(index)
      setSubmitted(false)
      setIsCorrect(null)
    },
    [submitted, isCorrect]
  )

  const handleSubmit = useCallback(() => {
    const correct = selected === correctAnswer
    setIsCorrect(correct)
    setSubmitted(true)
    setAttempts((prev) => prev + 1)
  }, [selected, correctAnswer])

  return (
    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-3">
      <p className="text-sm text-slate-300">{prompt}</p>

      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isSelected = selected === index
          const isCorrectOpt = submitted && index === correctAnswer
          const isWrongSelected = submitted && isSelected && index !== correctAnswer

          let classes = 'border-slate-700/50 bg-slate-800/30 text-slate-200 hover:border-slate-500'
          if (isSelected && !submitted) {
            classes = 'border-indigo-500/60 bg-indigo-500/10 text-indigo-200'
          }
          if (isCorrectOpt) {
            classes = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
          }
          if (isWrongSelected) {
            classes = 'border-red-500/60 bg-red-500/10 text-red-200'
          }

          return (
            <motion.button
              key={index}
              className={`px-4 py-2 rounded-lg border text-sm transition-colors cursor-pointer ${classes}`}
              onClick={() => handleSelect(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {typeof option === 'string' ? option : option.text || option.label || ''}
              {isCorrectOpt && <Check size={14} className="inline ml-1" />}
              {isWrongSelected && <X size={14} className="inline ml-1" />}
            </motion.button>
          )
        })}
      </div>

      {selected !== null && !(submitted && isCorrect) && (
        <Button size="sm" variant="primary" onClick={handleSubmit} icon={ArrowRight}>
          Check
        </Button>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <InlineFeedback
              isCorrect={isCorrect}
              correctText={feedback.correct || 'Correct!'}
              wrongText={feedback.wrong || 'Not quite. Try another option.'}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ===== Inline Feedback ===== */
function InlineFeedback({ isCorrect, correctText, wrongText }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
        isCorrect
          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
          : 'bg-red-500/10 border border-red-500/20 text-red-300'
      }`}
    >
      {isCorrect ? <Check size={14} /> : <X size={14} />}
      <span>{isCorrect ? correctText : wrongText}</span>
    </div>
  )
}

export default InteractiveBlock
