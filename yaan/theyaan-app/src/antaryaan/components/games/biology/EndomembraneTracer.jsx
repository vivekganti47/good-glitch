import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'

/**
 * EndomembraneTracer - Trace the protein secretory pathway by clicking
 * organelles in the correct order.
 *
 * Path: Ribosome -> Rough ER -> Golgi -> Vesicle -> Cell Membrane
 * Correct click draws golden trail. Wrong click flashes red.
 */

const PATHWAY_STEPS = [
  {
    id: 'ribosome',
    name: 'Ribosome',
    description: 'Protein synthesis begins here on the ribosome',
    cx: 420,
    cy: 220,
    color: '#10b981',
  },
  {
    id: 'roughER',
    name: 'Rough ER',
    description: 'Protein enters the ER lumen for folding and modification',
    cx: 480,
    cy: 260,
    color: '#8b5cf6',
  },
  {
    id: 'golgi',
    name: 'Golgi Apparatus',
    description: 'Protein is further modified, sorted, and packaged',
    cx: 320,
    cy: 300,
    color: '#f59e0b',
  },
  {
    id: 'vesicle',
    name: 'Secretory Vesicle',
    description: 'Protein packaged into a transport vesicle',
    cx: 220,
    cy: 220,
    color: '#f97316',
  },
  {
    id: 'membrane',
    name: 'Cell Membrane',
    description: 'Vesicle fuses with membrane, protein released outside',
    cx: 160,
    cy: 140,
    color: '#0ea5e9',
  },
]

function EndomembraneTracer({
  config,
  params,
  onComplete,
  isComplete,
  containerWidth,
  containerHeight,
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [wrongClick, setWrongClick] = useState(null)
  const [completed, setCompleted] = useState(false)

  const vw = 700
  const vh = 450

  const handleOrganelleClick = useCallback((stepIndex) => {
    if (completed) return

    if (stepIndex === currentStep) {
      // Correct click
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      setWrongClick(null)

      if (nextStep >= PATHWAY_STEPS.length) {
        setCompleted(true)
        if (onComplete) {
          setTimeout(() => onComplete(), 1000)
        }
      }
    } else {
      // Wrong click
      setWrongClick(stepIndex)
      setTimeout(() => setWrongClick(null), 600)
    }
  }, [currentStep, completed, onComplete])

  const handleReset = useCallback(() => {
    setCurrentStep(0)
    setWrongClick(null)
    setCompleted(false)
  }, [])

  // Build trail path segments
  const trailSegments = useMemo(() => {
    const segments = []
    for (let i = 0; i < currentStep; i++) {
      if (i + 1 < PATHWAY_STEPS.length) {
        segments.push({
          from: PATHWAY_STEPS[i],
          to: PATHWAY_STEPS[i + 1],
          index: i,
        })
      }
    }
    return segments
  }, [currentStep])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 uppercase tracking-wider">
            Secretory Pathway
          </span>
          <span className="font-mono text-sm font-semibold text-amber-300 tabular-nums">
            Step {Math.min(currentStep + 1, PATHWAY_STEPS.length)}/{PATHWAY_STEPS.length}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
          animate={{ width: `${(currentStep / PATHWAY_STEPS.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Instruction */}
      {!completed && currentStep < PATHWAY_STEPS.length && (
        <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
          <p className="text-xs text-slate-400">
            Click the <span className="text-amber-300 font-medium">{PATHWAY_STEPS[currentStep].name}</span> to
            trace the next step in the protein secretory pathway.
          </p>
        </div>
      )}

      {/* SVG Cell */}
      <div className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40" style={{ minHeight: 280, maxHeight: 450 }}>
        <svg
          viewBox={`0 0 ${vw} ${vh}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full"
        >
          <rect width={vw} height={vh} fill="#0A0E1A" opacity={0.6} />

          {/* Defs for glow and arrow */}
          <defs>
            <filter id="endo-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="endo-arrow"
              markerWidth="8"
              markerHeight="6"
              refX="8"
              refY="3"
              orient="auto"
            >
              <path d="M 0 0 L 8 3 L 0 6 Z" fill="#fbbf24" />
            </marker>
            <filter id="endo-red-glow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feFlood floodColor="#ef4444" floodOpacity="0.6" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Cell outline */}
          <ellipse
            cx={350}
            cy={250}
            rx={300}
            ry={190}
            fill="rgba(30, 41, 59, 0.2)"
            stroke="rgba(14, 165, 233, 0.3)"
            strokeWidth={2}
          />

          {/* Golden trail for completed steps */}
          {trailSegments.map((seg, i) => {
            const pathD = `M ${seg.from.cx} ${seg.from.cy} L ${seg.to.cx} ${seg.to.cy}`
            return (
              <g key={`trail-${i}`}>
                {/* Glow line */}
                <line
                  x1={seg.from.cx}
                  y1={seg.from.cy}
                  x2={seg.to.cx}
                  y2={seg.to.cy}
                  stroke="rgba(251, 191, 36, 0.3)"
                  strokeWidth={8}
                  strokeLinecap="round"
                />
                {/* Main line */}
                <line
                  x1={seg.from.cx}
                  y1={seg.from.cy}
                  x2={seg.to.cx}
                  y2={seg.to.cy}
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  markerEnd="url(#endo-arrow)"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="200"
                    to="0"
                    dur="0.6s"
                    fill="freeze"
                  />
                  <animate
                    attributeName="stroke-dasharray"
                    from="0 200"
                    to="200 0"
                    dur="0.6s"
                    fill="freeze"
                  />
                </line>
                {/* Protein icon traveling */}
                <circle r={4} fill="#fbbf24">
                  <animateMotion
                    path={pathD}
                    dur="0.5s"
                    fill="freeze"
                  />
                </circle>
              </g>
            )
          })}

          {/* Organelles */}
          {PATHWAY_STEPS.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep && !completed
            const isWrong = wrongClick === index
            const isClickable = !completed

            return (
              <g
                key={step.id}
                onClick={() => handleOrganelleClick(index)}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
              >
                {/* Organelle shapes */}
                {step.id === 'ribosome' && (
                  <g>
                    <circle
                      cx={step.cx}
                      cy={step.cy}
                      r={22}
                      fill={step.color + '20'}
                      stroke={step.color}
                      strokeWidth={isCompleted ? 2.5 : isCurrent ? 2.5 : 1.5}
                      filter={isWrong ? 'url(#endo-red-glow)' : isCurrent ? 'url(#endo-glow)' : undefined}
                    />
                    {/* Two subunits */}
                    <ellipse cx={step.cx} cy={step.cy - 5} rx={14} ry={8} fill={step.color + '30'} stroke={step.color} strokeWidth={0.8} />
                    <ellipse cx={step.cx} cy={step.cy + 5} rx={16} ry={10} fill={step.color + '20'} stroke={step.color} strokeWidth={0.8} />
                  </g>
                )}

                {step.id === 'roughER' && (
                  <g>
                    <rect
                      x={step.cx - 45}
                      y={step.cy - 30}
                      width={90}
                      height={60}
                      rx={8}
                      fill={step.color + '10'}
                      stroke={step.color}
                      strokeWidth={isCompleted ? 2.5 : isCurrent ? 2.5 : 1.5}
                      filter={isWrong ? 'url(#endo-red-glow)' : isCurrent ? 'url(#endo-glow)' : undefined}
                    />
                    {[0, 1, 2].map((i) => (
                      <g key={i}>
                        <path
                          d={`M ${step.cx - 35} ${step.cy - 18 + i * 16} Q ${step.cx} ${step.cy - 26 + i * 16} ${step.cx + 35} ${step.cy - 18 + i * 16}`}
                          fill="none" stroke={step.color} strokeWidth={1.5}
                        />
                        {[-25, -8, 8, 25].map((off, j) => (
                          <circle key={j} cx={step.cx + off} cy={step.cy - 20 + i * 16} r={2} fill={step.color} opacity={0.6} />
                        ))}
                      </g>
                    ))}
                  </g>
                )}

                {step.id === 'golgi' && (
                  <g>
                    <rect
                      x={step.cx - 50}
                      y={step.cy - 35}
                      width={100}
                      height={70}
                      rx={8}
                      fill="transparent"
                      stroke="transparent"
                      strokeWidth={1}
                      filter={isWrong ? 'url(#endo-red-glow)' : isCurrent ? 'url(#endo-glow)' : undefined}
                    />
                    {[0, 1, 2, 3].map((i) => (
                      <path
                        key={i}
                        d={`M ${step.cx - 40} ${step.cy - 22 + i * 14} Q ${step.cx} ${step.cy - 14 + i * 14} ${step.cx + 40} ${step.cy - 22 + i * 14}`}
                        fill={step.color + '10'}
                        stroke={step.color}
                        strokeWidth={isCompleted ? 2.5 : isCurrent ? 2.5 : 1.5}
                      />
                    ))}
                    <circle cx={step.cx + 45} cy={step.cy - 15} r={6} fill={step.color + '30'} stroke={step.color} strokeWidth={1} />
                    <circle cx={step.cx + 48} cy={step.cy + 20} r={5} fill={step.color + '30'} stroke={step.color} strokeWidth={1} />
                  </g>
                )}

                {step.id === 'vesicle' && (
                  <g>
                    <circle
                      cx={step.cx}
                      cy={step.cy}
                      r={25}
                      fill={step.color + '15'}
                      stroke={step.color}
                      strokeWidth={isCompleted ? 2.5 : isCurrent ? 2.5 : 1.5}
                      filter={isWrong ? 'url(#endo-red-glow)' : isCurrent ? 'url(#endo-glow)' : undefined}
                    />
                    {/* Cargo dots inside */}
                    {[0, 72, 144, 216, 288].map((a) => {
                      const rad = (a * Math.PI) / 180
                      return <circle key={a} cx={step.cx + 10 * Math.cos(rad)} cy={step.cy + 10 * Math.sin(rad)} r={2.5} fill={step.color} opacity={0.5} />
                    })}
                  </g>
                )}

                {step.id === 'membrane' && (
                  <g>
                    {/* Membrane section */}
                    <path
                      d={`M ${step.cx - 60} ${step.cy} Q ${step.cx - 30} ${step.cy - 40} ${step.cx} ${step.cy - 45} Q ${step.cx + 30} ${step.cy - 40} ${step.cx + 60} ${step.cy}`}
                      fill={step.color + '10'}
                      stroke={step.color}
                      strokeWidth={isCompleted ? 3 : isCurrent ? 3 : 2}
                      filter={isWrong ? 'url(#endo-red-glow)' : isCurrent ? 'url(#endo-glow)' : undefined}
                    />
                    {/* Phospholipids */}
                    {[-40, -20, 0, 20, 40].map((off, i) => {
                      const angle = Math.atan2(-40, off) * 0.3
                      const bx = step.cx + off
                      const by = step.cy - 25 + Math.abs(off) * 0.15
                      return (
                        <g key={i}>
                          <circle cx={bx} cy={by - 4} r={3} fill={step.color} opacity={0.4} />
                          <line x1={bx} y1={by - 1} x2={bx} y2={by + 8} stroke={step.color} strokeWidth={1} opacity={0.3} />
                        </g>
                      )
                    })}
                  </g>
                )}

                {/* Step number badge */}
                <circle
                  cx={step.cx + 20}
                  cy={step.cy - 25}
                  r={10}
                  fill={isCompleted ? '#16a34a' : isCurrent ? '#fbbf24' : '#334155'}
                  stroke={isCompleted ? '#22c55e' : isCurrent ? '#f59e0b' : '#475569'}
                  strokeWidth={1.5}
                />
                <text
                  x={step.cx + 20}
                  y={step.cy - 21}
                  textAnchor="middle"
                  fill={isCompleted || isCurrent ? '#0f172a' : '#94a3b8'}
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="system-ui, sans-serif"
                >
                  {index + 1}
                </text>

                {/* Label */}
                <text
                  x={step.cx}
                  y={step.cy + (step.id === 'membrane' ? 15 : 40)}
                  textAnchor="middle"
                  fill={isCompleted ? step.color : isCurrent ? '#fbbf24' : '#64748b'}
                  fontSize={11}
                  fontWeight={isCompleted || isCurrent ? 600 : 400}
                  fontFamily="system-ui, sans-serif"
                >
                  {step.name}
                </text>

                {/* Completion check */}
                {isCompleted && (
                  <g>
                    <circle cx={step.cx - 20} cy={step.cy - 25} r={8} fill="#16a34a" />
                    <path
                      d={`M ${step.cx - 24} ${step.cy - 25} L ${step.cx - 21} ${step.cy - 22} L ${step.cx - 16} ${step.cy - 28}`}
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {/* Wrong flash */}
                {isWrong && (
                  <circle
                    cx={step.cx}
                    cy={step.cy}
                    r={35}
                    fill="rgba(239, 68, 68, 0.2)"
                    stroke="rgba(239, 68, 68, 0.6)"
                    strokeWidth={2}
                  >
                    <animate attributeName="opacity" from="1" to="0" dur="0.6s" fill="freeze" />
                    <animate attributeName="r" from="35" to="50" dur="0.6s" fill="freeze" />
                  </circle>
                )}
              </g>
            )
          })}

          {/* Protein icon at start */}
          {currentStep === 0 && (
            <g>
              <circle cx={PATHWAY_STEPS[0].cx} cy={PATHWAY_STEPS[0].cy - 40} r={8} fill="#fbbf24" opacity={0.8}>
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text
                x={PATHWAY_STEPS[0].cx}
                y={PATHWAY_STEPS[0].cy - 36}
                textAnchor="middle"
                fill="#0f172a"
                fontSize={9}
                fontWeight={700}
                fontFamily="system-ui, sans-serif"
              >
                P
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Step description */}
      <AnimatePresence mode="wait">
        {currentStep > 0 && currentStep <= PATHWAY_STEPS.length && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20"
          >
            <p className="text-xs text-amber-200">
              <span className="font-semibold">Step {currentStep}:</span>{' '}
              {PATHWAY_STEPS[currentStep - 1].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 py-2"
          >
            <CheckCircle size={16} className="text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">
              Secretory pathway complete!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EndomembraneTracer
