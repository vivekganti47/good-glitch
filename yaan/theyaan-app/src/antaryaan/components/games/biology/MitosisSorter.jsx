import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, CheckCircle, XCircle, Shuffle } from 'lucide-react'

/**
 * MitosisSorter - Sort mitosis stage cards into correct left-to-right order.
 *
 * Four illustrated cards: Prophase, Metaphase, Anaphase, Telophase.
 * Shown in scrambled order. Drag or click-swap to reorder.
 * Check button validates. Success: transition animation.
 */

const STAGES = [
  {
    id: 'prophase',
    name: 'Prophase',
    order: 0,
    color: '#a855f7',
    bgColor: '#a855f715',
    description: 'Chromosomes condense, nuclear envelope breaks down, spindle forms',
    renderCell: (cx, cy, w, h) => (
      <g>
        {/* Cell outline */}
        <ellipse cx={cx} cy={cy} rx={w * 0.4} ry={h * 0.35} fill="rgba(30, 41, 59, 0.4)" stroke="#a855f7" strokeWidth={1.5} opacity={0.8} />
        {/* Breaking nuclear envelope */}
        <ellipse cx={cx} cy={cy} rx={w * 0.2} ry={h * 0.18} fill="none" stroke="#a855f7" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
        {/* Condensing chromosomes - squiggly lines becoming thicker */}
        <path d={`M ${cx - 12} ${cy - 10} Q ${cx - 8} ${cy - 15} ${cx - 4} ${cy - 8} T ${cx + 4} ${cy - 12}`} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
        <path d={`M ${cx - 8} ${cy + 2} Q ${cx - 4} ${cy - 4} ${cx + 2} ${cy + 4} T ${cx + 10} ${cy}`} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
        <path d={`M ${cx - 6} ${cy + 12} Q ${cx} ${cy + 8} ${cx + 6} ${cy + 14} T ${cx + 12} ${cy + 10}`} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" />
        <path d={`M ${cx + 4} ${cy - 4} Q ${cx + 8} ${cy + 2} ${cx + 14} ${cy - 2}`} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" />
        {/* Spindle lines forming */}
        <line x1={cx - w * 0.35} y1={cy} x2={cx - w * 0.15} y2={cy} stroke="#64748b" strokeWidth={0.5} opacity={0.4} />
        <line x1={cx + w * 0.15} y1={cy} x2={cx + w * 0.35} y2={cy} stroke="#64748b" strokeWidth={0.5} opacity={0.4} />
        {/* Centrioles at poles */}
        <circle cx={cx - w * 0.35} cy={cy} r={3} fill="#64748b" opacity={0.6} />
        <circle cx={cx + w * 0.35} cy={cy} r={3} fill="#64748b" opacity={0.6} />
      </g>
    ),
  },
  {
    id: 'metaphase',
    name: 'Metaphase',
    order: 1,
    color: '#3b82f6',
    bgColor: '#3b82f615',
    description: 'Chromosomes align at the cell equator (metaphase plate)',
    renderCell: (cx, cy, w, h) => (
      <g>
        {/* Cell outline */}
        <ellipse cx={cx} cy={cy} rx={w * 0.4} ry={h * 0.35} fill="rgba(30, 41, 59, 0.4)" stroke="#3b82f6" strokeWidth={1.5} opacity={0.8} />
        {/* Metaphase plate - vertical line of chromosomes at center */}
        <line x1={cx} y1={cy - h * 0.28} x2={cx} y2={cy + h * 0.28} stroke="#475569" strokeWidth={0.5} strokeDasharray="2 2" opacity={0.4} />
        {/* Chromosomes X-shaped at center */}
        {[-18, -6, 6, 18].map((dy, i) => (
          <g key={i}>
            <line x1={cx - 5} y1={cy + dy - 5} x2={cx + 5} y2={cy + dy + 5} stroke={i < 2 ? '#ef4444' : '#3b82f6'} strokeWidth={3} strokeLinecap="round" />
            <line x1={cx + 5} y1={cy + dy - 5} x2={cx - 5} y2={cy + dy + 5} stroke={i < 2 ? '#ef4444' : '#3b82f6'} strokeWidth={3} strokeLinecap="round" />
          </g>
        ))}
        {/* Spindle fibers */}
        {[-18, -6, 6, 18].map((dy, i) => (
          <g key={`spindle-${i}`}>
            <line x1={cx - w * 0.35} y1={cy} x2={cx} y2={cy + dy} stroke="#64748b" strokeWidth={0.5} opacity={0.3} />
            <line x1={cx + w * 0.35} y1={cy} x2={cx} y2={cy + dy} stroke="#64748b" strokeWidth={0.5} opacity={0.3} />
          </g>
        ))}
        {/* Poles */}
        <circle cx={cx - w * 0.35} cy={cy} r={3} fill="#64748b" opacity={0.6} />
        <circle cx={cx + w * 0.35} cy={cy} r={3} fill="#64748b" opacity={0.6} />
      </g>
    ),
  },
  {
    id: 'anaphase',
    name: 'Anaphase',
    order: 2,
    color: '#f59e0b',
    bgColor: '#f59e0b15',
    description: 'Sister chromatids pulled apart toward opposite poles',
    renderCell: (cx, cy, w, h) => (
      <g>
        {/* Elongated cell */}
        <ellipse cx={cx} cy={cy} rx={w * 0.42} ry={h * 0.32} fill="rgba(30, 41, 59, 0.4)" stroke="#f59e0b" strokeWidth={1.5} opacity={0.8} />
        {/* Chromosomes being pulled to left pole */}
        {[-10, -2, 6, 14].map((dy, i) => (
          <line
            key={`left-${i}`}
            x1={cx - w * 0.22}
            y1={cy + dy - 4}
            x2={cx - w * 0.22}
            y2={cy + dy + 4}
            stroke={i < 2 ? '#ef4444' : '#3b82f6'}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}
        {/* Chromosomes being pulled to right pole */}
        {[-10, -2, 6, 14].map((dy, i) => (
          <line
            key={`right-${i}`}
            x1={cx + w * 0.22}
            y1={cy + dy - 4}
            x2={cx + w * 0.22}
            y2={cy + dy + 4}
            stroke={i < 2 ? '#ef4444' : '#3b82f6'}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}
        {/* Spindle fibers pulling */}
        {[-10, -2, 6, 14].map((dy, i) => (
          <g key={`fiber-${i}`}>
            <line x1={cx - w * 0.38} y1={cy} x2={cx - w * 0.22} y2={cy + dy} stroke="#64748b" strokeWidth={0.5} opacity={0.3} />
            <line x1={cx + w * 0.38} y1={cy} x2={cx + w * 0.22} y2={cy + dy} stroke="#64748b" strokeWidth={0.5} opacity={0.3} />
          </g>
        ))}
        {/* Arrows showing movement */}
        <text x={cx - w * 0.12} y={cy + 2} fill="#f59e0b" fontSize={14} textAnchor="middle" opacity={0.5}>{"<"}</text>
        <text x={cx + w * 0.12} y={cy + 2} fill="#f59e0b" fontSize={14} textAnchor="middle" opacity={0.5}>{">"}</text>
      </g>
    ),
  },
  {
    id: 'telophase',
    name: 'Telophase',
    order: 3,
    color: '#10b981',
    bgColor: '#10b98115',
    description: 'Nuclear envelopes reform, chromosomes decondense, cytokinesis begins',
    renderCell: (cx, cy, w, h) => (
      <g>
        {/* Two forming daughter cells with cleavage furrow */}
        <ellipse cx={cx - w * 0.18} cy={cy} rx={w * 0.22} ry={h * 0.32} fill="rgba(30, 41, 59, 0.4)" stroke="#10b981" strokeWidth={1.5} opacity={0.8} />
        <ellipse cx={cx + w * 0.18} cy={cy} rx={w * 0.22} ry={h * 0.32} fill="rgba(30, 41, 59, 0.4)" stroke="#10b981" strokeWidth={1.5} opacity={0.8} />
        {/* Cleavage furrow */}
        <line x1={cx} y1={cy - h * 0.35} x2={cx} y2={cy + h * 0.35} stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
        {/* Nuclear envelopes reforming */}
        <ellipse cx={cx - w * 0.18} cy={cy} rx={w * 0.1} ry={h * 0.14} fill="none" stroke="#6366f1" strokeWidth={1} opacity={0.5} />
        <ellipse cx={cx + w * 0.18} cy={cy} rx={w * 0.1} ry={h * 0.14} fill="none" stroke="#6366f1" strokeWidth={1} opacity={0.5} />
        {/* Decondensing chromosomes (thinner) */}
        {[-6, 2, 10].map((dy, i) => (
          <g key={i}>
            <line
              x1={cx - w * 0.2}
              y1={cy + dy - 3}
              x2={cx - w * 0.2}
              y2={cy + dy + 3}
              stroke={i < 2 ? '#ef4444' : '#3b82f6'}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.7}
            />
            <line
              x1={cx + w * 0.18}
              y1={cy + dy - 3}
              x2={cx + w * 0.18}
              y2={cy + dy + 3}
              stroke={i < 2 ? '#ef4444' : '#3b82f6'}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.7}
            />
          </g>
        ))}
      </g>
    ),
  },
]

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  // Ensure it's actually shuffled
  if (shuffled.every((s, i) => s.id === STAGES[i].id)) {
    ;[shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]]
  }
  return shuffled
}

function MitosisSorter({
  config,
  params,
  onComplete,
  isComplete,
  containerWidth,
  containerHeight,
}) {
  const [cards, setCards] = useState(() => shuffleArray(STAGES))
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [dragIndex, setDragIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const handleCardClick = useCallback((index) => {
    if (checked && isCorrect) return

    if (selectedCard === null) {
      setSelectedCard(index)
    } else if (selectedCard === index) {
      setSelectedCard(null)
    } else {
      // Swap cards
      setCards((prev) => {
        const next = [...prev]
        ;[next[selectedCard], next[index]] = [next[index], next[selectedCard]]
        return next
      })
      setSelectedCard(null)
      setChecked(false)
    }
  }, [selectedCard, checked, isCorrect])

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }, [])

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null)
      setDragOverIndex(null)
      return
    }
    setCards((prev) => {
      const next = [...prev]
      ;[next[dragIndex], next[dropIndex]] = [next[dropIndex], next[dragIndex]]
      return next
    })
    setDragIndex(null)
    setDragOverIndex(null)
    setChecked(false)
  }, [dragIndex])

  const handleCheck = useCallback(() => {
    const correct = cards.every((card, index) => card.order === index)
    setIsCorrect(correct)
    setChecked(true)

    if (correct && onComplete) {
      setTimeout(() => onComplete(), 1500)
    }
  }, [cards, onComplete])

  const handleShuffle = useCallback(() => {
    setCards(shuffleArray(STAGES))
    setChecked(false)
    setIsCorrect(false)
    setSelectedCard(null)
  }, [])

  const cardW = 160
  const cardH = 200

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          Sort Mitosis Stages
        </span>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <Shuffle size={12} /> Shuffle
        </button>
      </div>

      <p className="text-xs text-slate-400">
        Arrange the cards in the correct order from left to right. Click two cards to swap, or drag and drop.
      </p>

      {/* Cards row */}
      <div className="flex flex-wrap justify-center gap-3">
        {cards.map((stage, index) => {
          const isSelected = selectedCard === index
          const isDragTarget = dragOverIndex === index
          const showCorrect = checked && isCorrect
          const showWrong = checked && !isCorrect && stage.order !== index

          return (
            <motion.div
              key={stage.id}
              layout
              draggable={!checked || !isCorrect}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null) }}
              onClick={() => handleCardClick(index)}
              className={`relative rounded-xl border-2 overflow-hidden cursor-pointer select-none transition-colors ${
                isSelected
                  ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : isDragTarget
                  ? 'border-amber-500/60'
                  : showCorrect
                  ? 'border-emerald-500/60'
                  : showWrong
                  ? 'border-red-500/60'
                  : 'border-slate-700/40 hover:border-slate-600/60'
              }`}
              style={{ width: cardW, height: cardH }}
              animate={
                showCorrect
                  ? { scale: [1, 1.05, 1], transition: { delay: index * 0.15, duration: 0.4 } }
                  : showWrong
                  ? { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } }
                  : {}
              }
            >
              {/* Card background */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: stage.bgColor }}
              />

              {/* SVG Cell illustration */}
              <svg
                viewBox={`0 0 ${cardW} ${cardH * 0.6}`}
                className="relative w-full"
                style={{ height: cardH * 0.6 }}
              >
                {stage.renderCell(cardW / 2, (cardH * 0.6) / 2, cardW, cardH * 0.6)}
              </svg>

              {/* Card label */}
              <div className="relative px-3 py-2">
                <p
                  className="text-sm font-semibold text-center"
                  style={{ color: stage.color }}
                >
                  {stage.name}
                </p>
                <p className="text-[10px] text-slate-500 text-center mt-0.5 leading-tight">
                  {stage.description}
                </p>
              </div>

              {/* Order number */}
              {showCorrect && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.2, type: 'spring' }}
                  className="absolute top-2 right-2"
                >
                  <CheckCircle size={20} className="text-emerald-400" />
                </motion.div>
              )}
              {showWrong && stage.order !== index && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <XCircle size={20} className="text-red-400" />
                </motion.div>
              )}

              {/* Position indicator */}
              <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-slate-800/80 border border-slate-600/40 flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-400">{index + 1}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Check button */}
      <div className="flex justify-center gap-3">
        {(!checked || !isCorrect) && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCheck}
            className="px-6 py-2.5 rounded-lg bg-indigo-600/80 border border-indigo-500/40 text-white text-sm font-medium hover:bg-indigo-500/80 transition-colors cursor-pointer"
          >
            Check Order
          </motion.button>
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
              isCorrect
                ? 'bg-emerald-500/10 border border-emerald-500/20'
                : 'bg-red-500/10 border border-red-500/20'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">
                  Correct! Prophase, Metaphase, Anaphase, Telophase
                </span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-red-400" />
                <span className="text-sm font-medium text-red-300">
                  Not quite right. Try rearranging the cards.
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MitosisSorter
