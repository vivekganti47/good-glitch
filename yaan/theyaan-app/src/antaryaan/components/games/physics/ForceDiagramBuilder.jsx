import { useState, useCallback, useRef, useMemo, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, RotateCcw, ChevronRight } from 'lucide-react'

/* ================================================================
   ForceDiagramBuilder
   ================================================================
   A free-body-diagram sandbox.  The player drags force arrows from
   a palette onto a block, rotates / scales them, and hits Verify.
   ================================================================ */

const DEG = Math.PI / 180
const RAD = 180 / Math.PI

// ---- default scenarios if none supplied via config ----
const DEFAULT_SCENARIOS = [
  {
    id: 'flat-surface',
    goalId: 'flat-surface-fbd',
    description: '5 kg block on a flat surface (no friction)',
    surfaceAngle: 0,
    forces: [
      { type: 'Weight', direction: 270, relativeMagnitude: 1 },
      { type: 'Normal', direction: 90, relativeMagnitude: 1 },
    ],
  },
  {
    id: 'inclined-plane',
    goalId: 'inclined-plane-fbd',
    description: '5 kg block on a 30\u00b0 incline with friction \u03bc=0.3',
    surfaceAngle: 30,
    forces: [
      { type: 'Weight', direction: 270, relativeMagnitude: 1 },
      { type: 'Normal', direction: 120, relativeMagnitude: 0.866 },
      { type: 'Friction', direction: 30, relativeMagnitude: 0.26 },
    ],
  },
  {
    id: 'hanging-mass',
    goalId: 'hanging-mass-fbd',
    description: '2 kg mass hanging from a string',
    surfaceAngle: null,
    forces: [
      { type: 'Weight', direction: 270, relativeMagnitude: 1 },
      { type: 'Tension', direction: 90, relativeMagnitude: 1 },
    ],
  },
]

// force colour map
const FORCE_COLORS = {
  Weight: '#e2e8f0',   // white / slate-200
  Normal: '#22d3ee',   // cyan-400
  Friction: '#fb923c', // orange-400
  Tension: '#facc15',  // yellow-400
  Applied: '#4ade80',  // green-400
}

const FORCE_TYPES = ['Weight', 'Normal', 'Friction', 'Tension', 'Applied']

// minimum arrow visual length in SVG units
const MIN_ARROW_LEN = 30
const MAX_ARROW_LEN = 130
const DEFAULT_ARROW_LEN = 70

// tolerance for direction check (degrees)
const ANGLE_TOLERANCE = 15
// tolerance for relative magnitude check (ratio)
const MAG_TOLERANCE = 0.30

// ---- SVG viewBox constants ----
const VB_W = 800
const VB_H = 500

// ---- helpers ----
function normAngle(a) {
  return ((a % 360) + 360) % 360
}

function angleDiff(a, b) {
  let d = normAngle(a) - normAngle(b)
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return Math.abs(d)
}

function polarToXY(cx, cy, angle, length) {
  const rad = angle * DEG
  return {
    x: cx + length * Math.cos(rad),
    y: cy - length * Math.sin(rad), // SVG y is inverted
  }
}

function xyToAngle(cx, cy, px, py) {
  // returns angle in degrees, 0=right, 90=up (physics convention)
  return normAngle(Math.atan2(-(py - cy), px - cx) * RAD)
}

function xyToLength(cx, cy, px, py) {
  return Math.sqrt((px - cx) ** 2 + (py - cy) ** 2)
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

/* ================================================================
   Component
   ================================================================ */
function ForceDiagramBuilder({
  config = {},
  params = {},
  onParamChange,
  onGoalAchieved,
  onComplete,
  isComplete = false,
  containerWidth = 800,
  containerHeight = 500,
}) {
  const markerId = useId().replace(/:/g, '_')
  const scenarios = config.scenarios || DEFAULT_SCENARIOS

  // scenario state
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const scenario = scenarios[scenarioIdx]

  // placed arrows: { id, type, angle, length }
  const [arrows, setArrows] = useState([])

  // interaction state
  const [dragging, setDragging] = useState(null) // { id, mode: 'place' | 'tip' }
  const [verification, setVerification] = useState(null) // null | { results: [] }
  const [completedGoals, setCompletedGoals] = useState(new Set())

  const svgRef = useRef(null)

  // block center
  const blockCX = VB_W * 0.52
  const blockCY = VB_H * 0.48

  // surface geometry
  const surfAngle = scenario.surfaceAngle ?? null
  const hasSurface = surfAngle !== null

  /* ---- pointer helpers ---- */
  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: ((clientX - rect.left) / rect.width) * VB_W,
      y: ((clientY - rect.top) / rect.height) * VB_H,
    }
  }, [])

  /* ---- palette drag start ---- */
  const handlePaletteDragStart = useCallback((forceType) => {
    const newId = uid()
    const newArrow = { id: newId, type: forceType, angle: 0, length: DEFAULT_ARROW_LEN }
    setArrows((prev) => [...prev, newArrow])
    setDragging({ id: newId, mode: 'tip' })
    setVerification(null)
  }, [])

  /* ---- tip drag on placed arrow ---- */
  const handleTipDragStart = useCallback((arrowId) => {
    setDragging({ id: arrowId, mode: 'tip' })
    setVerification(null)
  }, [])

  /* ---- pointer move ---- */
  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging) return
      e.preventDefault()
      const pt = getSVGPoint(e)
      const angle = xyToAngle(blockCX, blockCY, pt.x, pt.y)
      const length = Math.min(MAX_ARROW_LEN, Math.max(MIN_ARROW_LEN, xyToLength(blockCX, blockCY, pt.x, pt.y)))
      setArrows((prev) =>
        prev.map((a) =>
          a.id === dragging.id ? { ...a, angle, length } : a
        )
      )
    },
    [dragging, getSVGPoint, blockCX, blockCY]
  )

  /* ---- pointer up ---- */
  const handlePointerUp = useCallback(() => {
    setDragging(null)
  }, [])

  /* ---- remove arrow ---- */
  const removeArrow = useCallback((id) => {
    setArrows((prev) => prev.filter((a) => a.id !== id))
    setVerification(null)
  }, [])

  /* ---- reset ---- */
  const handleReset = useCallback(() => {
    setArrows([])
    setVerification(null)
  }, [])

  /* ---- verification ---- */
  const handleVerify = useCallback(() => {
    const required = scenario.forces
    const placed = [...arrows]

    // find the max relative magnitude in expected for normalization
    const maxExpMag = Math.max(...required.map((f) => f.relativeMagnitude), 0.001)
    // find max placed arrow length for normalization
    const maxPlacedLen = Math.max(...placed.map((a) => a.length), 0.001)

    const results = []
    const matchedPlacedIds = new Set()

    for (const exp of required) {
      // find best matching placed arrow of same type
      let bestMatch = null
      let bestAngleDiff = Infinity

      for (const p of placed) {
        if (p.type !== exp.type || matchedPlacedIds.has(p.id)) continue
        const aDiff = angleDiff(p.angle, exp.direction)
        if (aDiff < bestAngleDiff) {
          bestAngleDiff = aDiff
          bestMatch = p
        }
      }

      if (!bestMatch) {
        results.push({ type: exp.type, status: 'missing' })
        continue
      }

      matchedPlacedIds.add(bestMatch.id)

      const directionOK = bestAngleDiff <= ANGLE_TOLERANCE

      // relative magnitude check
      const expNorm = exp.relativeMagnitude / maxExpMag
      const placedNorm = bestMatch.length / maxPlacedLen
      const magOK = Math.abs(expNorm - placedNorm) <= MAG_TOLERANCE

      results.push({
        type: exp.type,
        arrowId: bestMatch.id,
        status: directionOK && magOK ? 'correct' : 'incorrect',
        directionOK,
        magOK,
      })
    }

    // extra arrows (placed but not required)
    for (const p of placed) {
      if (!matchedPlacedIds.has(p.id)) {
        results.push({ type: p.type, arrowId: p.id, status: 'extra' })
      }
    }

    const allCorrect =
      results.every((r) => r.status === 'correct') &&
      results.filter((r) => r.status === 'missing').length === 0 &&
      results.filter((r) => r.status === 'extra').length === 0

    setVerification({ results, allCorrect })

    if (allCorrect && scenario.goalId && !completedGoals.has(scenario.goalId)) {
      const next = new Set(completedGoals)
      next.add(scenario.goalId)
      setCompletedGoals(next)
      onGoalAchieved?.(scenario.goalId)

      if (next.size === scenarios.length) {
        onComplete?.()
      }
    }
  }, [arrows, scenario, completedGoals, scenarios.length, onGoalAchieved, onComplete])

  /* ---- next scenario ---- */
  const handleNext = useCallback(() => {
    const nextIdx = (scenarioIdx + 1) % scenarios.length
    setScenarioIdx(nextIdx)
    setArrows([])
    setVerification(null)
  }, [scenarioIdx, scenarios.length])

  /* ---- derive per-arrow verification state ---- */
  const arrowStates = useMemo(() => {
    if (!verification) return {}
    const map = {}
    for (const r of verification.results) {
      if (r.arrowId) map[r.arrowId] = r
    }
    return map
  }, [verification])

  /* ---- surface drawing helpers ---- */
  const surfacePoints = useMemo(() => {
    if (!hasSurface) return null
    const rad = surfAngle * DEG
    const halfLen = 220
    return {
      x1: blockCX - halfLen * Math.cos(rad),
      y1: blockCY + halfLen * Math.sin(rad),
      x2: blockCX + halfLen * Math.cos(rad),
      y2: blockCY - halfLen * Math.sin(rad),
    }
  }, [hasSurface, surfAngle, blockCX, blockCY])

  /* ---- block rect transform ---- */
  const blockSize = 56
  const blockRotation = hasSurface ? -surfAngle : 0

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* scenario header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-300 truncate">{scenario.description}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Scenario {scenarioIdx + 1} / {scenarios.length}
            {completedGoals.has(scenario.goalId) && (
              <span className="ml-2 text-emerald-400">Completed</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 rounded border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} /> Reset
          </button>
          {scenarios.length > 1 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-2 py-1 text-xs text-indigo-300 hover:text-indigo-200 rounded border border-indigo-500/30 hover:border-indigo-500/60 transition-colors cursor-pointer"
            >
              Next <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* main area: palette + SVG canvas */}
      <div className="flex gap-3 w-full">
        {/* palette */}
        <div className="flex flex-col gap-2 w-[120px] shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 px-1">
            Forces
          </span>
          {FORCE_TYPES.map((ft) => (
            <PaletteItem
              key={ft}
              type={ft}
              color={FORCE_COLORS[ft]}
              onDragStart={() => handlePaletteDragStart(ft)}
            />
          ))}
        </div>

        {/* SVG canvas */}
        <div
          className="relative flex-1 overflow-hidden rounded-lg bg-[#0f172a] border border-slate-700/40"
          style={{ minHeight: 320 }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="block w-full h-full touch-none select-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* defs: arrowhead markers per force type */}
            <defs>
              {Object.entries(FORCE_COLORS).map(([type, color]) => (
                <marker
                  key={type}
                  id={`arrow-${markerId}-${type}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 Z" fill={color} />
                </marker>
              ))}
              {/* glow filter for correct arrows */}
              <filter id={`glow-ok-${markerId}`}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* subtle grid */}
            <defs>
              <pattern
                id={`grid-${markerId}`}
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgba(148,163,184,0.05)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width={VB_W} height={VB_H} fill={`url(#grid-${markerId})`} />

            {/* surface */}
            {hasSurface && surfacePoints && (
              <line
                x1={surfacePoints.x1}
                y1={surfacePoints.y1}
                x2={surfacePoints.x2}
                y2={surfacePoints.y2}
                stroke="#475569"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {/* hatching below surface */}
            {hasSurface && surfacePoints && (
              <g opacity={0.3}>
                {Array.from({ length: 12 }).map((_, i) => {
                  const t = (i + 1) / 13
                  const sx = surfacePoints.x1 + (surfacePoints.x2 - surfacePoints.x1) * t
                  const sy = surfacePoints.y1 + (surfacePoints.y2 - surfacePoints.y1) * t
                  return (
                    <line
                      key={i}
                      x1={sx}
                      y1={sy}
                      x2={sx - 12}
                      y2={sy + 12}
                      stroke="#475569"
                      strokeWidth="1"
                    />
                  )
                })}
              </g>
            )}

            {/* hanging string for hanging-mass scenario */}
            {!hasSurface && (
              <line
                x1={blockCX}
                y1={40}
                x2={blockCX}
                y2={blockCY - blockSize / 2}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            )}

            {/* block */}
            <g transform={`translate(${blockCX}, ${blockCY}) rotate(${blockRotation})`}>
              <rect
                x={-blockSize / 2}
                y={-blockSize / 2}
                width={blockSize}
                height={blockSize}
                rx={6}
                fill="#334155"
                stroke="#64748b"
                strokeWidth="2"
              />
              <text
                x={0}
                y={4}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="12"
                fontFamily="monospace"
              >
                m
              </text>
            </g>

            {/* center dot */}
            <circle cx={blockCX} cy={blockCY} r={3} fill="#818cf8" opacity={0.6} />

            {/* placed force arrows */}
            {arrows.map((arrow) => {
              const tip = polarToXY(blockCX, blockCY, arrow.angle, arrow.length)
              const color = FORCE_COLORS[arrow.type] || '#94a3b8'
              const state = arrowStates[arrow.id]
              const isCorrect = state?.status === 'correct'
              const isWrong = state?.status === 'incorrect' || state?.status === 'extra'

              // label position: offset from midpoint
              const mid = polarToXY(blockCX, blockCY, arrow.angle, arrow.length * 0.55)
              const perpAngle = arrow.angle + 90
              const labelOffset = polarToXY(0, 0, perpAngle, 14)

              return (
                <g key={arrow.id}>
                  {/* green glow for correct */}
                  {isCorrect && (
                    <line
                      x1={blockCX}
                      y1={blockCY}
                      x2={tip.x}
                      y2={tip.y}
                      stroke="#22c55e"
                      strokeWidth="8"
                      opacity={0.3}
                      filter={`url(#glow-ok-${markerId})`}
                    />
                  )}

                  {/* arrow shaft */}
                  <motion.line
                    x1={blockCX}
                    y1={blockCY}
                    x2={tip.x}
                    y2={tip.y}
                    stroke={isCorrect ? '#22c55e' : isWrong ? '#ef4444' : color}
                    strokeWidth={3}
                    strokeLinecap="round"
                    markerEnd={`url(#arrow-${markerId}-${arrow.type})`}
                    animate={
                      isWrong
                        ? { x1: [0, -4, 4, -3, 3, 0].map((v) => blockCX + v) }
                        : {}
                    }
                    transition={{ duration: 0.35 }}
                    style={{ cursor: 'default' }}
                  />

                  {/* label */}
                  <text
                    x={mid.x + labelOffset.x}
                    y={mid.y + labelOffset.y}
                    textAnchor="middle"
                    fill={isCorrect ? '#22c55e' : isWrong ? '#ef4444' : color}
                    fontSize="11"
                    fontFamily="monospace"
                    opacity={0.9}
                    style={{ pointerEvents: 'none' }}
                  >
                    {arrow.type}
                  </text>

                  {/* draggable tip handle */}
                  <circle
                    cx={tip.x}
                    cy={tip.y}
                    r={10}
                    fill={color}
                    fillOpacity={0.2}
                    stroke={color}
                    strokeWidth={1.5}
                    strokeOpacity={0.5}
                    style={{ cursor: 'grab' }}
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      handleTipDragStart(arrow.id)
                    }}
                  />

                  {/* remove button (small X near base) */}
                  {!verification && (
                    <g
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation()
                        removeArrow(arrow.id)
                      }}
                    >
                      <circle
                        cx={blockCX + 14 * Math.cos((arrow.angle + 180) * DEG)}
                        cy={blockCY - 14 * Math.sin((arrow.angle + 180) * DEG)}
                        r={8}
                        fill="#1e293b"
                        stroke="#475569"
                        strokeWidth={1}
                      />
                      <text
                        x={blockCX + 14 * Math.cos((arrow.angle + 180) * DEG)}
                        y={blockCY - 14 * Math.sin((arrow.angle + 180) * DEG) + 3.5}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="sans-serif"
                        style={{ pointerEvents: 'none' }}
                      >
                        x
                      </text>
                    </g>
                  )}
                </g>
              )
            })}

            {/* angle guide ring */}
            {dragging && (
              <circle
                cx={blockCX}
                cy={blockCY}
                r={DEFAULT_ARROW_LEN}
                fill="none"
                stroke="#818cf8"
                strokeWidth={0.5}
                strokeDasharray="4 4"
                opacity={0.3}
              />
            )}
          </svg>
        </div>
      </div>

      {/* verify button + feedback */}
      <div className="flex items-center gap-3 px-1">
        <button
          onClick={handleVerify}
          disabled={arrows.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-500/25"
        >
          <Check size={14} />
          Verify
        </button>

        <AnimatePresence>
          {verification && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1"
            >
              {verification.allCorrect ? (
                <span className="text-sm text-emerald-400 font-medium">
                  All forces correct! Free body diagram complete.
                </span>
              ) : (
                <FeedbackSummary results={verification.results} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* completed goals tracker */}
      {scenarios.length > 1 && (
        <div className="flex items-center gap-2 px-1 pt-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Goals</span>
          {scenarios.map((s, i) => (
            <span
              key={s.goalId || i}
              className={`text-xs px-2 py-0.5 rounded-full border ${
                completedGoals.has(s.goalId)
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700/40 bg-slate-800/40 text-slate-500'
              }`}
            >
              {s.id || `#${i + 1}`}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ================================================================
   Palette item
   ================================================================ */
function PaletteItem({ type, color, onDragStart }) {
  return (
    <motion.button
      className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-700/50 bg-slate-800/40 hover:bg-slate-800/70 hover:border-slate-600 transition-colors cursor-grab active:cursor-grabbing select-none"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onPointerDown={(e) => {
        e.preventDefault()
        onDragStart()
      }}
    >
      {/* mini arrow preview */}
      <svg width="28" height="14" viewBox="0 0 28 14">
        <defs>
          <marker
            id={`pal-arr-${type}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 Z" fill={color} />
          </marker>
        </defs>
        <line
          x1="2"
          y1="7"
          x2="20"
          y2="7"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd={`url(#pal-arr-${type})`}
        />
      </svg>
      <span className="text-xs text-slate-300 whitespace-nowrap">{type}</span>
    </motion.button>
  )
}

/* ================================================================
   Feedback summary
   ================================================================ */
function FeedbackSummary({ results }) {
  const missing = results.filter((r) => r.status === 'missing')
  const incorrect = results.filter((r) => r.status === 'incorrect')
  const extra = results.filter((r) => r.status === 'extra')

  const msgs = []
  if (missing.length > 0) {
    msgs.push(`Missing: ${missing.map((r) => r.type).join(', ')}`)
  }
  if (incorrect.length > 0) {
    const details = incorrect.map((r) => {
      const issues = []
      if (!r.directionOK) issues.push('direction')
      if (!r.magOK) issues.push('magnitude')
      return `${r.type} (${issues.join(', ')})`
    })
    msgs.push(`Fix: ${details.join('; ')}`)
  }
  if (extra.length > 0) {
    msgs.push(`Extra: ${extra.map((r) => r.type).join(', ')}`)
  }

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {msgs.map((m, i) => (
        <span key={i} className="text-xs text-red-400">
          {m}
        </span>
      ))}
    </div>
  )
}

export default ForceDiagramBuilder
