import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, CheckCircle } from 'lucide-react'

/**
 * OrganelleAssembler - Drag organelles into correct positions in a blank cell.
 *
 * SVG blank cell outline with a palette of organelle icons at the bottom.
 * Drag each into the cell. Correct zone: green glow + snap.
 * Incorrect: red shake + bounce back to palette.
 */

const ORGANELLE_DEFS = [
  {
    id: 'nucleus',
    name: 'Nucleus',
    color: '#6366f1',
    zone: { cx: 400, cy: 250, r: 60 },
    paletteIcon: (x, y, s) => (
      <g>
        <circle cx={x} cy={y} r={s * 0.4} fill="#6366f1" opacity={0.3} stroke="#6366f1" strokeWidth={1.5} />
        <circle cx={x + 3} cy={y - 3} r={s * 0.15} fill="#6366f1" opacity={0.5} />
      </g>
    ),
    placedIcon: (cx, cy) => (
      <g>
        <circle cx={cx} cy={cy} r={55} fill="#6366f125" stroke="#6366f1" strokeWidth={2} />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const rad = (a * Math.PI) / 180
          return <circle key={a} cx={cx + 55 * Math.cos(rad)} cy={cy + 55 * Math.sin(rad)} r={3} fill="#0f172a" stroke="#6366f1" strokeWidth={1} />
        })}
        <circle cx={cx + 8} cy={cy - 8} r={18} fill="#6366f140" stroke="#6366f1" strokeWidth={1} />
      </g>
    ),
  },
  {
    id: 'mito1',
    name: 'Mitochondria',
    color: '#ef4444',
    zone: { cx: 550, cy: 170, r: 45 },
    paletteIcon: (x, y, s) => (
      <g>
        <ellipse cx={x} cy={y} rx={s * 0.4} ry={s * 0.2} fill="#ef444420" stroke="#ef4444" strokeWidth={1.5} />
        <line x1={x - s * 0.15} y1={y - s * 0.15} x2={x - s * 0.15} y2={y + s * 0.15} stroke="#ef4444" strokeWidth={1} opacity={0.5} />
      </g>
    ),
    placedIcon: (cx, cy) => (
      <g>
        <ellipse cx={cx} cy={cy} rx={35} ry={16} fill="#ef444420" stroke="#ef4444" strokeWidth={1.5} />
        {[-15, 0, 15].map((off, i) => (
          <line key={i} x1={cx + off} y1={cy - 13} x2={cx + off} y2={cy + 13} stroke="#ef4444" strokeWidth={0.8} opacity={0.4} />
        ))}
      </g>
    ),
  },
  {
    id: 'mito2',
    name: 'Mitochondria',
    color: '#ef4444',
    zone: { cx: 250, cy: 350, r: 45 },
    paletteIcon: (x, y, s) => (
      <g>
        <ellipse cx={x} cy={y} rx={s * 0.4} ry={s * 0.2} fill="#ef444420" stroke="#ef4444" strokeWidth={1.5} transform={`rotate(20, ${x}, ${y})`} />
      </g>
    ),
    placedIcon: (cx, cy) => (
      <g transform={`rotate(20, ${cx}, ${cy})`}>
        <ellipse cx={cx} cy={cy} rx={35} ry={16} fill="#ef444420" stroke="#ef4444" strokeWidth={1.5} />
        {[-15, 0, 15].map((off, i) => (
          <line key={i} x1={cx + off} y1={cy - 13} x2={cx + off} y2={cy + 13} stroke="#ef4444" strokeWidth={0.8} opacity={0.4} />
        ))}
      </g>
    ),
  },
  {
    id: 'mito3',
    name: 'Mitochondria',
    color: '#ef4444',
    zone: { cx: 500, cy: 360, r: 45 },
    paletteIcon: (x, y, s) => (
      <g>
        <ellipse cx={x} cy={y} rx={s * 0.4} ry={s * 0.2} fill="#ef444420" stroke="#ef4444" strokeWidth={1.5} transform={`rotate(-15, ${x}, ${y})`} />
      </g>
    ),
    placedIcon: (cx, cy) => (
      <g transform={`rotate(-15, ${cx}, ${cy})`}>
        <ellipse cx={cx} cy={cy} rx={35} ry={16} fill="#ef444420" stroke="#ef4444" strokeWidth={1.5} />
        {[-15, 0, 15].map((off, i) => (
          <line key={i} x1={cx + off} y1={cy - 13} x2={cx + off} y2={cy + 13} stroke="#ef4444" strokeWidth={0.8} opacity={0.4} />
        ))}
      </g>
    ),
  },
  {
    id: 'roughER',
    name: 'Rough ER',
    color: '#8b5cf6',
    zone: { cx: 520, cy: 260, r: 55 },
    paletteIcon: (x, y, s) => (
      <g>
        <path d={`M ${x - s * 0.3} ${y - 4} Q ${x} ${y - 12} ${x + s * 0.3} ${y - 4}`} fill="none" stroke="#8b5cf6" strokeWidth={1.5} />
        <path d={`M ${x - s * 0.3} ${y + 4} Q ${x} ${y + 12} ${x + s * 0.3} ${y + 4}`} fill="none" stroke="#8b5cf6" strokeWidth={1.5} />
        {[-1, 0, 1].map((i) => <circle key={i} cx={x + i * s * 0.2} cy={y - 5} r={1.5} fill="#8b5cf6" />)}
      </g>
    ),
    placedIcon: (cx, cy) => (
      <g>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path
              d={`M ${cx - 40} ${cy - 15 + i * 15} Q ${cx} ${cy - 25 + i * 15} ${cx + 40} ${cy - 15 + i * 15}`}
              fill="none" stroke="#8b5cf6" strokeWidth={2}
            />
            {[-30, -10, 10, 30].map((off, j) => (
              <circle key={j} cx={cx + off} cy={cy - 17 + i * 15} r={2} fill="#8b5cf6" opacity={0.7} />
            ))}
          </g>
        ))}
      </g>
    ),
  },
  {
    id: 'smoothER',
    name: 'Smooth ER',
    color: '#a78bfa',
    zone: { cx: 550, cy: 320, r: 50 },
    paletteIcon: (x, y, s) => (
      <g>
        <path d={`M ${x - s * 0.3} ${y} Q ${x} ${y - 10} ${x + s * 0.3} ${y}`} fill="none" stroke="#a78bfa" strokeWidth={2} />
        <path d={`M ${x - s * 0.3} ${y + 6} Q ${x} ${y + 16} ${x + s * 0.3} ${y + 6}`} fill="none" stroke="#a78bfa" strokeWidth={2} />
      </g>
    ),
    placedIcon: (cx, cy) => (
      <g>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${cx - 35} ${cy - 10 + i * 12} Q ${cx} ${cy - 20 + i * 12} ${cx + 35} ${cy - 10 + i * 12}`}
            fill="none" stroke="#a78bfa" strokeWidth={2}
          />
        ))}
      </g>
    ),
  },
  {
    id: 'golgi',
    name: 'Golgi',
    color: '#f59e0b',
    zone: { cx: 260, cy: 190, r: 50 },
    paletteIcon: (x, y, s) => (
      <g>
        {[-2, 0, 2].map((i) => (
          <path key={i} d={`M ${x - s * 0.3} ${y + i * 5} Q ${x} ${y + i * 5 + 4} ${x + s * 0.3} ${y + i * 5}`} fill="none" stroke="#f59e0b" strokeWidth={1.5} />
        ))}
      </g>
    ),
    placedIcon: (cx, cy) => (
      <g>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M ${cx - 35} ${cy - 15 + i * 12} Q ${cx} ${cy - 7 + i * 12} ${cx + 35} ${cy - 15 + i * 12}`}
            fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1.5}
          />
        ))}
        <circle cx={cx + 40} cy={cy - 10} r={5} fill="#f59e0b30" stroke="#f59e0b" strokeWidth={1} />
      </g>
    ),
  },
  {
    id: 'ribosomes',
    name: 'Ribosomes',
    color: '#10b981',
    zone: { cx: 400, cy: 140, r: 80 },
    paletteIcon: (x, y, s) => (
      <g>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 0]].map(([dx, dy], i) => (
          <circle key={i} cx={x + dx * s * 0.15} cy={y + dy * s * 0.15} r={2.5} fill="#10b981" />
        ))}
      </g>
    ),
    placedIcon: (cx, cy) => (
      <g>
        {[
          [-40, -15], [-15, -25], [15, -20], [35, -10],
          [-30, 10], [0, 15], [25, 5], [-10, -5],
          [40, 20], [-35, 25],
        ].map(([dx, dy], i) => (
          <circle key={i} cx={cx + dx} cy={cy + dy} r={3} fill="#10b981" opacity={0.7} />
        ))}
      </g>
    ),
  },
  {
    id: 'lysosomes',
    name: 'Lysosomes',
    color: '#f97316',
    zone: { cx: 310, cy: 300, r: 40 },
    paletteIcon: (x, y, s) => (
      <g>
        <circle cx={x} cy={y} r={s * 0.25} fill="#f9731620" stroke="#f97316" strokeWidth={1.5} />
        <circle cx={x - 3} cy={y - 2} r={1.5} fill="#f97316" opacity={0.6} />
        <circle cx={x + 3} cy={y + 2} r={1.5} fill="#f97316" opacity={0.6} />
      </g>
    ),
    placedIcon: (cx, cy) => (
      <g>
        <circle cx={cx} cy={cy} r={14} fill="#f9731620" stroke="#f97316" strokeWidth={1.5} />
        {[0, 120, 240].map((a) => {
          const rad = (a * Math.PI) / 180
          return <circle key={a} cx={cx + 6 * Math.cos(rad)} cy={cy + 6 * Math.sin(rad)} r={2} fill="#f97316" opacity={0.5} />
        })}
      </g>
    ),
  },
]

function OrganelleAssembler({
  config,
  params,
  onComplete,
  isComplete,
  containerWidth,
  containerHeight,
}) {
  const [placed, setPlaced] = useState({})
  const [dragging, setDragging] = useState(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const [shakeId, setShakeId] = useState(null)
  const [flashGreen, setFlashGreen] = useState(null)
  const svgRef = useRef(null)

  const vw = 800
  const vh = 500
  const paletteY = vh - 70

  const correctCount = Object.values(placed).filter(Boolean).length
  const totalCount = ORGANELLE_DEFS.length

  const getSvgCoords = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const scaleX = vw / rect.width
    const scaleY = vh / rect.height
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }, [])

  const handlePointerDown = useCallback((e, orgId) => {
    if (placed[orgId]) return
    e.preventDefault()
    const coords = getSvgCoords(e)
    setDragging(orgId)
    setDragPos(coords)
  }, [placed, getSvgCoords])

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return
    e.preventDefault()
    setDragPos(getSvgCoords(e))
  }, [dragging, getSvgCoords])

  const handlePointerUp = useCallback(() => {
    if (!dragging) return

    const org = ORGANELLE_DEFS.find((o) => o.id === dragging)
    if (!org) {
      setDragging(null)
      return
    }

    const dx = dragPos.x - org.zone.cx
    const dy = dragPos.y - org.zone.cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist <= org.zone.r) {
      // Correct placement
      setPlaced((prev) => ({ ...prev, [dragging]: true }))
      setFlashGreen(dragging)
      setTimeout(() => setFlashGreen(null), 600)

      const newCount = correctCount + 1
      if (newCount >= totalCount && onComplete) {
        setTimeout(() => onComplete(), 800)
      }
    } else {
      // Wrong placement - shake
      setShakeId(dragging)
      setTimeout(() => setShakeId(null), 500)
    }

    setDragging(null)
  }, [dragging, dragPos, correctCount, totalCount, onComplete])

  const handleReset = useCallback(() => {
    setPlaced({})
    setDragging(null)
    setShakeId(null)
    setFlashGreen(null)
  }, [])

  // Palette layout
  const unplacedOrgs = ORGANELLE_DEFS.filter((o) => !placed[o.id])
  const palSlotWidth = vw / (ORGANELLE_DEFS.length + 1)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 uppercase tracking-wider">
            Place Organelles
          </span>
          <span className="font-mono text-sm font-semibold text-indigo-300 tabular-nums">
            {correctCount}/{totalCount}
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
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          animate={{ width: `${(correctCount / totalCount) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div
        className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40 touch-none select-none"
        style={{ minHeight: 300, maxHeight: 500 }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${vw} ${vh}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <rect width={vw} height={vh} fill="#0A0E1A" opacity={0.6} />

          {/* Cell outline */}
          <ellipse
            cx={400}
            cy={250}
            rx={320}
            ry={200}
            fill="rgba(30, 41, 59, 0.2)"
            stroke="rgba(14, 165, 233, 0.4)"
            strokeWidth={2}
          />

          {/* Drop zone hints (subtle) */}
          {ORGANELLE_DEFS.filter((o) => !placed[o.id]).map((org) => (
            <circle
              key={`zone-${org.id}`}
              cx={org.zone.cx}
              cy={org.zone.cy}
              r={org.zone.r}
              fill="none"
              stroke="rgba(100, 116, 139, 0.15)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}

          {/* Placed organelles */}
          {ORGANELLE_DEFS.filter((o) => placed[o.id]).map((org) => (
            <g key={`placed-${org.id}`}>
              {flashGreen === org.id && (
                <circle
                  cx={org.zone.cx}
                  cy={org.zone.cy}
                  r={org.zone.r}
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke="rgba(16, 185, 129, 0.5)"
                  strokeWidth={2}
                >
                  <animate
                    attributeName="opacity"
                    from="1"
                    to="0"
                    dur="0.6s"
                    fill="freeze"
                  />
                </circle>
              )}
              {org.placedIcon(org.zone.cx, org.zone.cy)}
            </g>
          ))}

          {/* Palette background */}
          <rect
            x={0}
            y={paletteY - 20}
            width={vw}
            height={90}
            fill="rgba(15, 23, 42, 0.8)"
            stroke="rgba(51, 65, 85, 0.4)"
            strokeWidth={1}
          />
          <text
            x={20}
            y={paletteY - 5}
            fill="rgba(148, 163, 184, 0.5)"
            fontSize={10}
            fontFamily="system-ui, sans-serif"
          >
            ORGANELLE PALETTE - Drag into cell
          </text>

          {/* Palette items */}
          {ORGANELLE_DEFS.map((org, i) => {
            if (placed[org.id]) return null
            const px = palSlotWidth * (i + 0.8)
            const py = paletteY + 25

            const isShaking = shakeId === org.id
            const isDraggingThis = dragging === org.id

            if (isDraggingThis) return null

            return (
              <g
                key={`pal-${org.id}`}
                onPointerDown={(e) => handlePointerDown(e, org.id)}
                style={{ cursor: 'grab' }}
              >
                {isShaking ? (
                  <g>
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; -5,0; 5,0; -5,0; 5,0; 0,0"
                      dur="0.4s"
                      repeatCount="1"
                    />
                    <rect
                      x={px - 25}
                      y={py - 20}
                      width={50}
                      height={40}
                      rx={6}
                      fill="rgba(239, 68, 68, 0.15)"
                      stroke="rgba(239, 68, 68, 0.4)"
                      strokeWidth={1}
                    />
                    {org.paletteIcon(px, py, 30)}
                    <text
                      x={px}
                      y={py + 28}
                      textAnchor="middle"
                      fill="rgba(239, 68, 68, 0.8)"
                      fontSize={8}
                      fontFamily="system-ui, sans-serif"
                    >
                      {org.name}
                    </text>
                  </g>
                ) : (
                  <g>
                    <rect
                      x={px - 25}
                      y={py - 20}
                      width={50}
                      height={40}
                      rx={6}
                      fill="rgba(30, 41, 59, 0.6)"
                      stroke={org.color + '40'}
                      strokeWidth={1}
                    />
                    {org.paletteIcon(px, py, 30)}
                    <text
                      x={px}
                      y={py + 28}
                      textAnchor="middle"
                      fill="rgba(148, 163, 184, 0.6)"
                      fontSize={8}
                      fontFamily="system-ui, sans-serif"
                    >
                      {org.name}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Dragging ghost */}
          {dragging && (() => {
            const org = ORGANELLE_DEFS.find((o) => o.id === dragging)
            if (!org) return null
            return (
              <g transform={`translate(${dragPos.x}, ${dragPos.y})`} opacity={0.8} pointerEvents="none">
                <circle r={20} fill={org.color + '20'} stroke={org.color} strokeWidth={1.5} />
                {org.paletteIcon(0, 0, 30)}
              </g>
            )
          })()}
        </svg>
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {correctCount >= totalCount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 py-2"
          >
            <CheckCircle size={16} className="text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">
              All organelles correctly placed!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrganelleAssembler
