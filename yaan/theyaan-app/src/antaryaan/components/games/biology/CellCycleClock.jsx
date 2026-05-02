import { useState, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'

/**
 * CellCycleClock - Circular clock diagram of the cell cycle.
 *
 * SVG circular clock divided into colored wedges: G1, S, G2, M.
 * Draggable time hand rotates around the clock. As hand enters each
 * phase, side panel shows chromosome state. DNA content graph updates
 * in sync. Checkpoints marked as gates.
 */

const PHASES = [
  {
    id: 'G1',
    name: 'G1 Phase',
    label: 'G1',
    color: '#22c55e',
    startAngle: 0,
    endAngle: 150,
    description: 'Cell grows, synthesizes proteins, and prepares for DNA replication. Primary growth phase.',
    chromosomeState: 'Thin unreplicated chromosomes. Cell is growing, organelles duplicating.',
    dnaContent: 2,
  },
  {
    id: 'S',
    name: 'S Phase',
    label: 'S',
    color: '#3b82f6',
    startAngle: 150,
    endAngle: 240,
    description: 'DNA synthesis - each chromosome is replicated to form sister chromatids joined at centromere.',
    chromosomeState: 'DNA is being replicated. Each chromosome becomes two sister chromatids.',
    dnaContent: 3, // midpoint between 2n and 4n
  },
  {
    id: 'G2',
    name: 'G2 Phase',
    label: 'G2',
    color: '#a855f7',
    startAngle: 240,
    endAngle: 300,
    description: 'Cell prepares for mitosis. Checks for DNA damage. Synthesizes proteins needed for division.',
    chromosomeState: 'Thick doubled chromosomes (sister chromatids). Cell prepares to divide.',
    dnaContent: 4,
  },
  {
    id: 'M',
    name: 'M Phase (Mitosis)',
    label: 'M',
    color: '#ef4444',
    startAngle: 300,
    endAngle: 360,
    description: 'Nuclear division (mitosis) and cytoplasmic division (cytokinesis). Chromosomes separate.',
    chromosomeState: 'Chromosomes condense, align, separate. Two daughter cells form with 2n DNA each.',
    dnaContent: 2,
  },
]

const CHECKPOINTS = [
  {
    id: 'g1-checkpoint',
    name: 'G1 Checkpoint (Restriction Point)',
    angle: 140,
    description: 'Checks cell size, nutrients, growth factors, and DNA damage before committing to S phase.',
  },
  {
    id: 'g2-checkpoint',
    name: 'G2 Checkpoint',
    angle: 295,
    description: 'Verifies DNA replication is complete and checks for DNA damage before entering mitosis.',
  },
  {
    id: 'm-checkpoint',
    name: 'M Checkpoint (Spindle Assembly)',
    angle: 330,
    description: 'Ensures all chromosomes are properly attached to spindle fibers before anaphase proceeds.',
  },
]

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
}

function CellCycleClock({
  config,
  params,
  onParamChange,
  onDiscovery,
  onComplete,
  isComplete,
  containerWidth,
  containerHeight,
}) {
  const [handAngle, setHandAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredCheckpoint, setHoveredCheckpoint] = useState(null)
  const [discoveredS, setDiscoveredS] = useState(false)
  const svgRef = useRef(null)

  const vw = 800
  const vh = 500
  const clockCx = 260
  const clockCy = 250
  const clockR = 180

  // Determine current phase from hand angle
  const currentPhase = useMemo(() => {
    const normalAngle = ((handAngle % 360) + 360) % 360
    for (const phase of PHASES) {
      if (normalAngle >= phase.startAngle && normalAngle < phase.endAngle) {
        return phase
      }
    }
    return PHASES[0]
  }, [handAngle])

  // DNA content interpolation
  const dnaContent = useMemo(() => {
    const normalAngle = ((handAngle % 360) + 360) % 360
    if (normalAngle < 150) return 2 // G1
    if (normalAngle < 240) {
      // S phase: linear interpolation 2n -> 4n
      const progress = (normalAngle - 150) / 90
      return 2 + 2 * progress
    }
    if (normalAngle < 300) return 4 // G2
    // M phase: drops back
    const progress = (normalAngle - 300) / 60
    return 4 - 2 * progress
  }, [handAngle])

  // Check for S-phase discovery
  const normalAngle = ((handAngle % 360) + 360) % 360
  if (normalAngle >= 150 && normalAngle < 240 && !discoveredS) {
    setDiscoveredS(true)
    if (onDiscovery) {
      onDiscovery('dna-doubles-in-s')
    }
  }

  const getAngleFromPointer = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return 0
    const rect = svg.getBoundingClientRect()
    const scaleX = vw / rect.width
    const scaleY = vh / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const mx = (clientX - rect.left) * scaleX
    const my = (clientY - rect.top) * scaleY
    const dx = mx - clockCx
    const dy = my - clockCy
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    if (angle < 0) angle += 360
    return angle
  }, [])

  const handlePointerDown = useCallback((e) => {
    setIsDragging(true)
    setHandAngle(getAngleFromPointer(e))
  }, [getAngleFromPointer])

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return
    setHandAngle(getAngleFromPointer(e))
  }, [isDragging, getAngleFromPointer])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Hand tip position
  const handTip = polarToCartesian(clockCx, clockCy, clockR - 20, handAngle)

  // DNA graph points
  const graphX = 560
  const graphY = 60
  const graphW = 210
  const graphH = 120

  const dnaGraphPoints = useMemo(() => {
    const points = []
    for (let a = 0; a <= 360; a += 5) {
      let dna
      if (a < 150) dna = 2
      else if (a < 240) dna = 2 + 2 * ((a - 150) / 90)
      else if (a < 300) dna = 4
      else dna = 4 - 2 * ((a - 300) / 60)

      const x = graphX + (a / 360) * graphW
      const y = graphY + graphH - ((dna - 1) / 4) * graphH
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }, [])

  // Current position marker on graph
  const graphMarkerX = graphX + (normalAngle / 360) * graphW
  const graphMarkerY = graphY + graphH - ((dnaContent - 1) / 4) * graphH

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider">Cell Cycle Clock</span>
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ backgroundColor: currentPhase.color + '25', color: currentPhase.color, border: `1px solid ${currentPhase.color}40` }}
        >
          {currentPhase.name}
        </span>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40 touch-none" style={{ minHeight: 320, maxHeight: 500 }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${vw} ${vh}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <rect width={vw} height={vh} fill="#0A0E1A" opacity={0.6} />

          {/* Clock wedges */}
          {PHASES.map((phase) => (
            <path
              key={phase.id}
              d={describeArc(clockCx, clockCy, clockR, phase.startAngle, phase.endAngle)}
              fill={phase.color + (currentPhase.id === phase.id ? '35' : '15')}
              stroke={phase.color + (currentPhase.id === phase.id ? '80' : '40')}
              strokeWidth={currentPhase.id === phase.id ? 2 : 1}
            />
          ))}

          {/* Phase labels on clock */}
          {PHASES.map((phase) => {
            const midAngle = (phase.startAngle + phase.endAngle) / 2
            const labelPos = polarToCartesian(clockCx, clockCy, clockR * 0.6, midAngle)
            return (
              <text
                key={`label-${phase.id}`}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={phase.color}
                fontSize={18}
                fontWeight={700}
                fontFamily="system-ui, sans-serif"
                opacity={currentPhase.id === phase.id ? 1 : 0.5}
              >
                {phase.label}
              </text>
            )
          })}

          {/* Outer ring labels */}
          {PHASES.map((phase) => {
            const midAngle = (phase.startAngle + phase.endAngle) / 2
            const pos = polarToCartesian(clockCx, clockCy, clockR + 22, midAngle)
            return (
              <text
                key={`outer-${phase.id}`}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={phase.color}
                fontSize={10}
                fontFamily="system-ui, sans-serif"
                opacity={0.6}
              >
                {phase.name}
              </text>
            )
          })}

          {/* Checkpoints */}
          {CHECKPOINTS.map((cp) => {
            const pos = polarToCartesian(clockCx, clockCy, clockR, cp.angle)
            const isHovered = hoveredCheckpoint === cp.id
            return (
              <g
                key={cp.id}
                onPointerEnter={(e) => { e.stopPropagation(); setHoveredCheckpoint(cp.id) }}
                onPointerLeave={(e) => { e.stopPropagation(); setHoveredCheckpoint(null) }}
              >
                {/* Gate marker */}
                <rect
                  x={pos.x - 8}
                  y={pos.y - 10}
                  width={16}
                  height={20}
                  rx={3}
                  fill={isHovered ? '#fbbf24' : '#f59e0b'}
                  opacity={isHovered ? 1 : 0.7}
                  stroke="#fbbf24"
                  strokeWidth={1}
                />
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="#0f172a"
                  fontSize={10}
                  fontWeight={700}
                  fontFamily="system-ui, sans-serif"
                >
                  !
                </text>

                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={pos.x - 100}
                      y={pos.y - 55}
                      width={200}
                      height={38}
                      rx={6}
                      fill="rgba(15, 23, 42, 0.95)"
                      stroke="#f59e0b40"
                      strokeWidth={1}
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 40}
                      textAnchor="middle"
                      fill="#fbbf24"
                      fontSize={9}
                      fontWeight={600}
                      fontFamily="system-ui, sans-serif"
                    >
                      {cp.name}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y - 26}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize={8}
                      fontFamily="system-ui, sans-serif"
                    >
                      {cp.description.slice(0, 60)}...
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Clock hand */}
          <line
            x1={clockCx}
            y1={clockCy}
            x2={handTip.x}
            y2={handTip.y}
            stroke={currentPhase.color}
            strokeWidth={3}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${currentPhase.color})` }}
          />
          {/* Hand tip circle */}
          <circle
            cx={handTip.x}
            cy={handTip.y}
            r={8}
            fill={currentPhase.color}
            stroke="white"
            strokeWidth={2}
            style={{ cursor: 'grab', filter: `drop-shadow(0 0 6px ${currentPhase.color})` }}
          />
          {/* Center dot */}
          <circle cx={clockCx} cy={clockCy} r={6} fill="#1e293b" stroke="#475569" strokeWidth={2} />

          {/* ---- Right panel: Chromosome State ---- */}
          <rect
            x={530}
            y={210}
            width={240}
            height={160}
            rx={10}
            fill="rgba(15, 23, 42, 0.8)"
            stroke={currentPhase.color + '40'}
            strokeWidth={1}
          />
          <text
            x={545}
            y={232}
            fill={currentPhase.color}
            fontSize={12}
            fontWeight={700}
            fontFamily="system-ui, sans-serif"
          >
            Chromosome State
          </text>

          {/* Chromosome visualization */}
          {currentPhase.id === 'G1' && (
            <g>
              {/* Thin unreplicated chromosomes */}
              {[[580, 265], [620, 275], [660, 260], [700, 270]].map(([cx, cy], i) => (
                <line
                  key={i}
                  x1={cx}
                  y1={cy - 15}
                  x2={cx}
                  y2={cy + 15}
                  stroke={i < 2 ? '#ef4444' : '#3b82f6'}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              ))}
              <text x={545} y={310} fill="#94a3b8" fontSize={8} fontFamily="system-ui, sans-serif">
                Thin chromosomes, cell growing
              </text>
            </g>
          )}

          {currentPhase.id === 'S' && (
            <g>
              {/* Chromosomes splitting/doubling */}
              {[[580, 265], [630, 275], [680, 260], [730, 270]].map(([cx, cy], i) => (
                <g key={i}>
                  <line
                    x1={cx - 3}
                    y1={cy - 15}
                    x2={cx - 3}
                    y2={cy + 15}
                    stroke={i < 2 ? '#ef4444' : '#3b82f6'}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                  <line
                    x1={cx + 3}
                    y1={cy - 15}
                    x2={cx + 3}
                    y2={cy + 15}
                    stroke={i < 2 ? '#ef4444' : '#3b82f6'}
                    strokeWidth={2}
                    strokeLinecap="round"
                    opacity={0.5}
                    strokeDasharray="3 2"
                  />
                </g>
              ))}
              <text x={545} y={310} fill="#94a3b8" fontSize={8} fontFamily="system-ui, sans-serif">
                DNA replicating (2n -&gt; 4n)
              </text>
            </g>
          )}

          {currentPhase.id === 'G2' && (
            <g>
              {/* Thick doubled chromosomes */}
              {[[580, 265], [630, 275], [680, 260], [730, 270]].map(([cx, cy], i) => (
                <g key={i}>
                  <line
                    x1={cx - 3}
                    y1={cy - 15}
                    x2={cx - 3}
                    y2={cy + 15}
                    stroke={i < 2 ? '#ef4444' : '#3b82f6'}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <line
                    x1={cx + 3}
                    y1={cy - 15}
                    x2={cx + 3}
                    y2={cy + 15}
                    stroke={i < 2 ? '#ef4444' : '#3b82f6'}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  {/* Centromere */}
                  <circle cx={cx} cy={cy} r={3} fill={i < 2 ? '#ef4444' : '#3b82f6'} opacity={0.6} />
                </g>
              ))}
              <text x={545} y={310} fill="#94a3b8" fontSize={8} fontFamily="system-ui, sans-serif">
                Doubled chromosomes, preparing to divide
              </text>
            </g>
          )}

          {currentPhase.id === 'M' && (
            <g>
              {/* Condensing and separating */}
              {[[575, 258], [615, 268], [680, 258], [720, 268]].map(([cx, cy], i) => (
                <g key={i}>
                  {/* X shape - condensed */}
                  <line
                    x1={cx - 6}
                    y1={cy - 10}
                    x2={cx + 6}
                    y2={cy + 10}
                    stroke={i < 2 ? '#ef4444' : '#3b82f6'}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <line
                    x1={cx + 6}
                    y1={cy - 10}
                    x2={cx - 6}
                    y2={cy + 10}
                    stroke={i < 2 ? '#ef4444' : '#3b82f6'}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                </g>
              ))}
              {/* Dividing line */}
              <line x1={650} y1={245} x2={650} y2={290} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
              <text x={545} y={310} fill="#94a3b8" fontSize={8} fontFamily="system-ui, sans-serif">
                Chromosomes condense, align, separate
              </text>
            </g>
          )}

          {/* Phase description text */}
          <text x={545} y={335} fill="#64748b" fontSize={8} fontFamily="system-ui, sans-serif">
            {currentPhase.chromosomeState.slice(0, 55)}
          </text>
          <text x={545} y={348} fill="#64748b" fontSize={8} fontFamily="system-ui, sans-serif">
            {currentPhase.chromosomeState.slice(55, 110)}
          </text>
          <text x={545} y={361} fill="#64748b" fontSize={8} fontFamily="system-ui, sans-serif">
            {currentPhase.chromosomeState.slice(110)}
          </text>

          {/* ---- DNA Content Graph ---- */}
          <rect
            x={graphX - 15}
            y={graphY - 25}
            width={graphW + 40}
            height={graphH + 55}
            rx={10}
            fill="rgba(15, 23, 42, 0.8)"
            stroke="rgba(51, 65, 85, 0.4)"
            strokeWidth={1}
          />
          <text
            x={graphX + graphW / 2}
            y={graphY - 8}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize={11}
            fontWeight={600}
            fontFamily="system-ui, sans-serif"
          >
            DNA Content
          </text>

          {/* Y-axis labels */}
          <text x={graphX - 10} y={graphY + 5} textAnchor="end" fill="#64748b" fontSize={9} fontFamily="system-ui, sans-serif">4n</text>
          <text x={graphX - 10} y={graphY + graphH / 2 + 3} textAnchor="end" fill="#64748b" fontSize={9} fontFamily="system-ui, sans-serif">2n</text>

          {/* Grid lines */}
          <line x1={graphX} y1={graphY} x2={graphX + graphW} y2={graphY} stroke="#334155" strokeWidth={0.5} />
          <line x1={graphX} y1={graphY + graphH / 2} x2={graphX + graphW} y2={graphY + graphH / 2} stroke="#334155" strokeWidth={0.5} strokeDasharray="3 3" />
          <line x1={graphX} y1={graphY + graphH} x2={graphX + graphW} y2={graphY + graphH} stroke="#334155" strokeWidth={0.5} />

          {/* X-axis */}
          <line x1={graphX} y1={graphY + graphH} x2={graphX + graphW} y2={graphY + graphH} stroke="#475569" strokeWidth={1} />
          <line x1={graphX} y1={graphY} x2={graphX} y2={graphY + graphH} stroke="#475569" strokeWidth={1} />

          {/* Phase labels on X-axis */}
          {PHASES.map((phase) => {
            const midAngle = (phase.startAngle + phase.endAngle) / 2
            const xPos = graphX + (midAngle / 360) * graphW
            return (
              <text
                key={`gx-${phase.id}`}
                x={xPos}
                y={graphY + graphH + 14}
                textAnchor="middle"
                fill={phase.color}
                fontSize={9}
                fontWeight={600}
                fontFamily="system-ui, sans-serif"
              >
                {phase.label}
              </text>
            )
          })}

          {/* DNA content polyline */}
          <polyline
            points={dnaGraphPoints}
            fill="none"
            stroke="#818cf8"
            strokeWidth={2}
            opacity={0.6}
          />

          {/* Current position marker */}
          <circle
            cx={graphMarkerX}
            cy={graphMarkerY}
            r={5}
            fill={currentPhase.color}
            stroke="white"
            strokeWidth={1.5}
          />
          {/* DNA content value */}
          <text
            x={graphMarkerX}
            y={graphMarkerY - 10}
            textAnchor="middle"
            fill={currentPhase.color}
            fontSize={10}
            fontWeight={700}
            fontFamily="system-ui, sans-serif"
          >
            {dnaContent.toFixed(1)}n
          </text>
        </svg>
      </div>

      {/* Phase info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="px-3 py-2 rounded-lg border"
          style={{
            backgroundColor: currentPhase.color + '10',
            borderColor: currentPhase.color + '30',
          }}
        >
          <div className="flex items-start gap-2">
            <Info size={14} className="shrink-0 mt-0.5" style={{ color: currentPhase.color }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: currentPhase.color }}>
                {currentPhase.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {currentPhase.description}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-xs text-slate-500 text-center">
        Drag the clock hand around to explore each phase of the cell cycle.
      </p>
    </div>
  )
}

export default CellCycleClock
