import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, CheckCircle, Zap, AlertTriangle } from 'lucide-react'

/**
 * PumpSimulator - Interactive Na+/K+ ATPase pump cycle game.
 *
 * SVG illustration of a pump protein spanning a cell membrane.
 * 6-step cycle with 2-3 action buttons per step (only one correct).
 * Wrong presses flash red; correct presses animate to next step.
 * Score tracked via onScore prop. Repeatable after completing a cycle.
 */

const PUMP_STEPS = [
  {
    id: 0,
    title: 'Step 1: Bind 3 Na+ inside',
    description: 'Three Na+ ions from the cytoplasm bind to the pump protein.',
    correctAction: 'bind-na',
    buttons: ['bind-na', 'bind-k', 'release-na'],
    pumpState: 'open-inside',
    naInside: 3, naOutside: 0, kInside: 0, kOutside: 0,
    hasATP: false, hasPhosphate: false,
  },
  {
    id: 1,
    title: 'Step 2: ATP binds & phosphorylates',
    description: 'ATP binds and is hydrolyzed. Phosphate attaches to the pump.',
    correctAction: 'add-atp',
    buttons: ['add-atp', 'dephosphorylate', 'release-na'],
    pumpState: 'open-inside',
    naInside: 3, naOutside: 0, kInside: 0, kOutside: 0,
    hasATP: true, hasPhosphate: true,
  },
  {
    id: 2,
    title: 'Step 3: Conformational change',
    description: 'Phosphorylation flips the pump open to the extracellular side.',
    correctAction: 'change-shape',
    buttons: ['change-shape', 'release-na'],
    pumpState: 'open-outside',
    naInside: 3, naOutside: 0, kInside: 0, kOutside: 0,
    hasATP: false, hasPhosphate: true,
  },
  {
    id: 3,
    title: 'Step 4: Release 3 Na+ outside',
    description: 'The pump releases 3 Na+ into the extracellular fluid.',
    correctAction: 'release-na',
    buttons: ['release-na', 'bind-k', 'add-atp'],
    pumpState: 'open-outside',
    naInside: 0, naOutside: 3, kInside: 0, kOutside: 0,
    hasATP: false, hasPhosphate: true,
  },
  {
    id: 4,
    title: 'Step 5: Bind 2 K+ outside',
    description: 'Two K+ ions from outside bind to the pump.',
    correctAction: 'bind-k',
    buttons: ['bind-k', 'bind-na', 'dephosphorylate'],
    pumpState: 'open-outside',
    naInside: 0, naOutside: 3, kInside: 0, kOutside: 2,
    hasATP: false, hasPhosphate: true,
  },
  {
    id: 5,
    title: 'Step 6: Dephosphorylate & release K+',
    description: 'Pi detaches. Pump reverts shape. 2 K+ released into cytoplasm.',
    correctAction: 'dephosphorylate',
    buttons: ['dephosphorylate', 'change-shape', 'add-atp'],
    pumpState: 'open-inside',
    naInside: 0, naOutside: 3, kInside: 2, kOutside: 0,
    hasATP: false, hasPhosphate: false,
  },
]

const ACTION_MAP = {
  'bind-na': { label: 'Bind 3 Na+', color: '#ef4444' },
  'add-atp': { label: 'Add ATP', color: '#fbbf24' },
  'change-shape': { label: 'Change Shape', color: '#818cf8' },
  'release-na': { label: 'Release Na+', color: '#ef4444' },
  'bind-k': { label: 'Bind 2 K+', color: '#a855f7' },
  'dephosphorylate': { label: 'Dephosphorylate', color: '#10b981' },
}

function PumpSimulator({
  params,
  onParamChange,
  isPlaying,
  onScore,
  onComplete,
  isComplete,
  mode,
  config,
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [wrongAction, setWrongAction] = useState(null)
  const [cycleComplete, setCycleComplete] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [score, setScore] = useState(0)
  const [errors, setErrors] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  const stepData = PUMP_STEPS[currentStep] || PUMP_STEPS[0]

  const stepButtons = useMemo(() => {
    return stepData.buttons.map((id) => ({ id, ...ACTION_MAP[id] }))
  }, [stepData])

  const handleAction = useCallback((actionId) => {
    if (cycleComplete || animating) return

    if (actionId === stepData.correctAction) {
      setAnimating(true)
      setWrongAction(null)

      const pts = 10
      setScore((s) => s + pts)
      if (onScore) onScore(pts)

      setCompletedSteps((prev) => [...prev, currentStep])

      setTimeout(() => {
        const nextStep = currentStep + 1
        if (nextStep >= PUMP_STEPS.length) {
          setCycleComplete(true)
          setCycles((c) => c + 1)
          if (onComplete) setTimeout(() => onComplete(), 800)
        } else {
          setCurrentStep(nextStep)
        }
        setAnimating(false)
      }, 600)
    } else {
      setWrongAction(actionId)
      setErrors((e) => e + 1)
      setTimeout(() => setWrongAction(null), 800)
    }
  }, [currentStep, stepData, cycleComplete, animating, onScore, onComplete])

  const handleReset = useCallback(() => {
    setCurrentStep(0)
    setCycleComplete(false)
    setAnimating(false)
    setWrongAction(null)
    setScore(0)
    setErrors(0)
    setCycles(0)
    setCompletedSteps([])
  }, [])

  const handleNextCycle = useCallback(() => {
    setCurrentStep(0)
    setCycleComplete(false)
    setAnimating(false)
    setWrongAction(null)
    setCompletedSteps([])
  }, [])

  // SVG layout constants
  const vw = 700
  const vh = 420
  const memY = vh * 0.5
  const memH = 50
  const pumpCx = vw / 2
  const pumpW = 80
  const pumpH = 120
  const isOpenOutside = stepData.pumpState === 'open-outside'

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 uppercase tracking-wider">
            Na+/K+ ATPase Pump
          </span>
          <span className="font-mono text-sm font-semibold text-indigo-300 tabular-nums">
            Step {Math.min(currentStep + 1, PUMP_STEPS.length)}/{PUMP_STEPS.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Score: <span className="text-emerald-400 font-semibold">{score}</span>
          </span>
          {cycles > 0 && (
            <span className="text-xs text-slate-500">
              Cycles: <span className="text-indigo-400 font-semibold">{cycles}</span>
            </span>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="flex items-center gap-1">
        {PUMP_STEPS.map((step, i) => {
          const done = completedSteps.includes(i)
          const active = i === currentStep && !cycleComplete
          return (
            <div key={step.id} className="flex items-center gap-1 flex-1">
              <motion.div
                className={`h-2 flex-1 rounded-full ${
                  done
                    ? 'bg-emerald-500'
                    : active
                    ? 'bg-indigo-500'
                    : 'bg-slate-800'
                }`}
                animate={active ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }}
                transition={active ? { duration: 1.5, repeat: Infinity } : {}}
              />
            </div>
          )
        })}
      </div>

      {/* Step info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
        >
          <p className="text-xs text-indigo-300 font-semibold">{stepData.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{stepData.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* SVG illustration */}
      <div
        className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40"
        style={{ minHeight: 280, maxHeight: 450 }}
      >
        <svg
          viewBox={`0 0 ${vw} ${vh}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full"
        >
          <rect width={vw} height={vh} fill="#0A0E1A" opacity={0.6} />

          {/* Region labels */}
          <text x={40} y={38} fill="rgba(148,163,184,0.5)" fontSize={13} fontWeight={600} fontFamily="system-ui,sans-serif">
            EXTRACELLULAR
          </text>
          <text x={40} y={vh - 18} fill="rgba(148,163,184,0.5)" fontSize={13} fontWeight={600} fontFamily="system-ui,sans-serif">
            INTRACELLULAR (Cytoplasm)
          </text>

          {/* Membrane band */}
          <rect x={0} y={memY - memH / 2} width={vw} height={memH} fill="rgba(14,165,233,0.1)" />

          {/* Phospholipid pattern */}
          {Array.from({ length: 35 }, (_, i) => {
            const px = i * 20 + 10
            if (Math.abs(px - pumpCx) < pumpW / 2 + 5) return null
            return (
              <g key={i}>
                <circle cx={px} cy={memY - memH / 2 + 8} r={4} fill="none" stroke="rgba(14,165,233,0.3)" strokeWidth={1} />
                <line x1={px} y1={memY - memH / 2 + 12} x2={px} y2={memY} stroke="rgba(14,165,233,0.15)" strokeWidth={1} />
                <circle cx={px + 10} cy={memY + memH / 2 - 8} r={4} fill="none" stroke="rgba(14,165,233,0.3)" strokeWidth={1} />
                <line x1={px + 10} y1={memY + memH / 2 - 12} x2={px + 10} y2={memY} stroke="rgba(14,165,233,0.15)" strokeWidth={1} />
              </g>
            )
          })}

          {/* Pump protein */}
          <motion.g
            animate={{ scaleY: isOpenOutside ? -1 : 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            style={{ transformOrigin: `${pumpCx}px ${memY}px` }}
          >
            {/* Pump body */}
            <rect
              x={pumpCx - pumpW / 2} y={memY - pumpH / 2}
              width={pumpW} height={pumpH} rx={12}
              fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.6)" strokeWidth={2}
            />
            {/* Funnel opening (open side) */}
            <path
              d={`M ${pumpCx - 20} ${memY + pumpH / 2 - 5} L ${pumpCx - 20} ${memY + pumpH / 2 + 15} Q ${pumpCx} ${memY + pumpH / 2 + 25} ${pumpCx + 20} ${memY + pumpH / 2 + 15} L ${pumpCx + 20} ${memY + pumpH / 2 - 5}`}
              fill="rgba(10,14,26,0.8)" stroke="rgba(99,102,241,0.5)" strokeWidth={2}
            />
            {/* Closed top */}
            <path
              d={`M ${pumpCx - pumpW / 2} ${memY - pumpH / 2 + 12} Q ${pumpCx} ${memY - pumpH / 2 - 8} ${pumpCx + pumpW / 2} ${memY - pumpH / 2 + 12}`}
              fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.4)" strokeWidth={1.5}
            />
            {/* Binding sites */}
            {[0, 1, 2].map((i) => (
              <circle
                key={`site-${i}`}
                cx={pumpCx - 15 + i * 15} cy={memY + 8} r={6}
                fill="rgba(30,41,59,0.6)" stroke="rgba(148,163,184,0.3)"
                strokeWidth={1} strokeDasharray="2 2"
              />
            ))}
            {/* Phosphate group */}
            {stepData.hasPhosphate && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <circle
                  cx={pumpCx + pumpW / 2 - 5} cy={memY} r={8}
                  fill="rgba(251,191,36,0.3)" stroke="#fbbf24" strokeWidth={1.5}
                />
                <text
                  x={pumpCx + pumpW / 2 - 5} y={memY + 3.5}
                  textAnchor="middle" fill="#fbbf24" fontSize={9} fontWeight={700}
                  fontFamily="system-ui,sans-serif"
                >
                  Pi
                </text>
              </motion.g>
            )}
          </motion.g>

          {/* Pump label */}
          <text
            x={pumpCx} y={memY - 3} textAnchor="middle"
            fill="rgba(129,140,248,0.7)" fontSize={9} fontWeight={600}
            fontFamily="system-ui,sans-serif"
          >
            Na+/K+ ATPase
          </text>

          {/* Na+ ions inside cell (approaching pump) */}
          {stepData.naInside > 0 && !isOpenOutside && (
            <g>
              {Array.from({ length: stepData.naInside }, (_, i) => (
                <motion.g
                  key={`na-in-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <circle
                    cx={pumpCx - 15 + i * 15}
                    cy={memY + pumpH / 2 + 30 + i * 5}
                    r={9} fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth={1.5}
                  />
                  <text
                    x={pumpCx - 15 + i * 15}
                    y={memY + pumpH / 2 + 33 + i * 5}
                    textAnchor="middle" fill="#ef4444" fontSize={8} fontWeight={700}
                    fontFamily="system-ui,sans-serif"
                  >
                    Na+
                  </text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Na+ bound in pump */}
          {stepData.naInside > 0 && currentStep >= 1 && !isOpenOutside && (
            <g>
              {Array.from({ length: stepData.naInside }, (_, i) => (
                <motion.circle
                  key={`na-bound-${i}`}
                  cx={pumpCx - 15 + i * 15} cy={memY + 8} r={5}
                  fill="#ef4444"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                />
              ))}
            </g>
          )}

          {/* Na+ released outside */}
          {stepData.naOutside > 0 && (
            <g>
              {Array.from({ length: stepData.naOutside }, (_, i) => (
                <motion.g
                  key={`na-out-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <circle
                    cx={pumpCx - 15 + i * 15}
                    cy={memY - pumpH / 2 - 35 - i * 5}
                    r={9} fill="rgba(239,68,68,0.3)" stroke="#ef4444" strokeWidth={1.5}
                  />
                  <text
                    x={pumpCx - 15 + i * 15}
                    y={memY - pumpH / 2 - 32 - i * 5}
                    textAnchor="middle" fill="#ef4444" fontSize={8} fontWeight={700}
                    fontFamily="system-ui,sans-serif"
                  >
                    Na+
                  </text>
                </motion.g>
              ))}
            </g>
          )}

          {/* K+ outside (waiting to bind) */}
          {currentStep >= 4 && stepData.kOutside > 0 && (
            <g>
              {Array.from({ length: stepData.kOutside }, (_, i) => (
                <motion.g
                  key={`k-out-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <circle
                    cx={pumpCx + 20 + i * 20}
                    cy={memY - pumpH / 2 - 30}
                    r={9} fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth={1.5}
                  />
                  <text
                    x={pumpCx + 20 + i * 20}
                    y={memY - pumpH / 2 - 27}
                    textAnchor="middle" fill="#a855f7" fontSize={8} fontWeight={700}
                    fontFamily="system-ui,sans-serif"
                  >
                    K+
                  </text>
                </motion.g>
              ))}
            </g>
          )}

          {/* K+ released inside */}
          {stepData.kInside > 0 && (
            <g>
              {Array.from({ length: stepData.kInside }, (_, i) => (
                <motion.g
                  key={`k-in-${i}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <circle
                    cx={pumpCx + 20 + i * 20}
                    cy={memY + pumpH / 2 + 35}
                    r={9} fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth={1.5}
                  />
                  <text
                    x={pumpCx + 20 + i * 20}
                    y={memY + pumpH / 2 + 38}
                    textAnchor="middle" fill="#a855f7" fontSize={8} fontWeight={700}
                    fontFamily="system-ui,sans-serif"
                  >
                    K+
                  </text>
                </motion.g>
              ))}
            </g>
          )}

          {/* ATP molecule */}
          {stepData.hasATP && (
            <motion.g initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <rect
                x={pumpCx + pumpW / 2 + 15} y={memY + 15}
                width={35} height={18} rx={4}
                fill="rgba(251,191,36,0.2)" stroke="#fbbf24" strokeWidth={1.5}
              />
              <text
                x={pumpCx + pumpW / 2 + 32} y={memY + 28}
                textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight={700}
                fontFamily="system-ui,sans-serif"
              >
                ATP
              </text>
            </motion.g>
          )}

          {/* Ion counter panel */}
          <rect x={20} y={65} width={140} height={80} rx={8} fill="rgba(15,23,42,0.8)" stroke="rgba(51,65,85,0.4)" strokeWidth={1} />
          <text x={40} y={84} fill="#94a3b8" fontSize={10} fontFamily="system-ui,sans-serif" fontWeight={600}>
            Ion Counter
          </text>
          <text x={40} y={102} fill="#ef4444" fontSize={9} fontFamily="system-ui,sans-serif">
            Na+ out: {stepData.naOutside} | in: {stepData.naInside}
          </text>
          <text x={40} y={116} fill="#a855f7" fontSize={9} fontFamily="system-ui,sans-serif">
            K+ out: {stepData.kOutside} | in: {stepData.kInside}
          </text>
          <text x={40} y={134} fill="#fbbf24" fontSize={9} fontFamily="system-ui,sans-serif">
            ATP: {stepData.hasATP ? '1' : '0'} | Pi: {stepData.hasPhosphate ? '1' : '0'}
          </text>

          {/* Conformation indicator */}
          <rect x={vw - 170} y={65} width={150} height={40} rx={8} fill="rgba(15,23,42,0.8)" stroke="rgba(99,102,241,0.3)" strokeWidth={1} />
          <text x={vw - 155} y={83} fill="#818cf8" fontSize={9} fontFamily="system-ui,sans-serif" fontWeight={600}>
            Pump Conformation:
          </text>
          <text
            x={vw - 155} y={97}
            fill={isOpenOutside ? '#f59e0b' : '#10b981'}
            fontSize={10} fontFamily="system-ui,sans-serif" fontWeight={700}
          >
            {isOpenOutside ? 'Open to OUTSIDE' : 'Open to INSIDE'}
          </text>

          {/* Error flash overlay */}
          <AnimatePresence>
            {wrongAction && (
              <motion.rect
                width={vw} height={vh}
                fill="rgba(239,68,68,0.08)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Action buttons (2-3 per step) */}
      {!cycleComplete && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Choose the correct action:
          </h4>
          <div className="flex flex-wrap gap-2">
            {stepButtons.map((btn) => {
              const isWrong = wrongAction === btn.id
              return (
                <motion.button
                  key={btn.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAction(btn.id)}
                  disabled={animating}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border disabled:opacity-50 ${
                    isWrong
                      ? 'bg-red-500/20 border-red-500/40 text-red-300'
                      : 'bg-slate-800/60 border-slate-700/40 text-slate-300 hover:border-slate-600/60 hover:bg-slate-700/50'
                  }`}
                  animate={isWrong ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: isWrong ? '#ef4444' : btn.color }}
                  />
                  {btn.label}
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {/* Wrong action feedback */}
      <AnimatePresence>
        {wrongAction && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-xs text-red-300">
              Wrong step! {stepData.description.split('.')[0]}.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cycle complete */}
      <AnimatePresence>
        {cycleComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-2 py-2">
              <CheckCircle size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">
                Pump cycle complete!
              </span>
            </div>
            <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
              <p className="text-xs text-slate-400 text-center">
                One full cycle: <span className="text-red-400 font-medium">3 Na+ pumped out</span>,{' '}
                <span className="text-purple-400 font-medium">2 K+ pumped in</span>,{' '}
                <span className="text-amber-400 font-medium">1 ATP consumed</span>.
                This maintains the electrochemical gradient for nerve impulses.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className="text-xs text-slate-500">
                Score: <span className="text-emerald-400 font-semibold">{score}</span>
                {errors > 0 && (
                  <> | Errors: <span className="text-red-400 font-semibold">{errors}</span></>
                )}
              </span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNextCycle}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/80 border border-indigo-500/40 text-white text-xs font-medium hover:bg-indigo-500/80 transition-colors cursor-pointer"
              >
                <Zap size={12} /> Run Another Cycle
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PumpSimulator
