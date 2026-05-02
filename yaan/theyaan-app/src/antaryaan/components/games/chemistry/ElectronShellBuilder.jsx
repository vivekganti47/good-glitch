import { useState, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, CheckCircle, AlertTriangle, Info } from 'lucide-react'

/**
 * Electron Shell Builder - drag electrons into shells/subshells
 * to build electron configurations.
 *
 * Enforces Aufbau principle, Pauli exclusion, and Hund's rule.
 */

const SUBSHELLS = [
  { name: '1s', n: 1, l: 0, capacity: 2, orbitals: 1, energyOrder: 1 },
  { name: '2s', n: 2, l: 0, capacity: 2, orbitals: 1, energyOrder: 2 },
  { name: '2p', n: 2, l: 1, capacity: 6, orbitals: 3, energyOrder: 3 },
  { name: '3s', n: 3, l: 0, capacity: 2, orbitals: 1, energyOrder: 4 },
  { name: '3p', n: 3, l: 1, capacity: 6, orbitals: 3, energyOrder: 5 },
  { name: '4s', n: 4, l: 0, capacity: 2, orbitals: 1, energyOrder: 6 },
  { name: '3d', n: 3, l: 2, capacity: 10, orbitals: 5, energyOrder: 7 },
]

const GOALS = [
  { label: 'Build Carbon (Z=6)', z: 6, symbol: 'C', config: { '1s': 2, '2s': 2, '2p': 2 } },
  { label: 'Build Nitrogen (Z=7)', z: 7, symbol: 'N', config: { '1s': 2, '2s': 2, '2p': 3 } },
  { label: 'Build Iron (Z=26)', z: 26, symbol: 'Fe', config: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 6 } },
]

const SHELL_COLORS = {
  1: '#60a5fa',
  2: '#a78bfa',
  3: '#34d399',
  4: '#fbbf24',
}

function getShellRadius(n, cx) {
  const baseR = 50
  const step = 48
  return baseR + (n - 1) * step
}

function ElectronShellBuilder({
  config,
  params,
  onGoalAchieved,
  onComplete,
  isComplete,
  containerWidth = 800,
  containerHeight = 500,
}) {
  const [currentGoalIdx, setCurrentGoalIdx] = useState(0)
  const [electrons, setElectrons] = useState({})
  const [warnings, setWarnings] = useState([])
  const [completedGoals, setCompletedGoals] = useState(new Set())
  const [dragging, setDragging] = useState(false)
  const [dragPos, setDragPos] = useState(null)
  const svgRef = useRef(null)

  const currentGoal = GOALS[currentGoalIdx]
  const totalElectrons = useMemo(
    () => Object.values(electrons).reduce((sum, e) => sum + e, 0),
    [electrons]
  )

  const getOrbitalFill = useCallback((subshellName, count) => {
    const sub = SUBSHELLS.find(s => s.name === subshellName)
    if (!sub) return []
    const orbitals = Array.from({ length: sub.orbitals }, () => ({ up: false, down: false }))
    let remaining = count
    // Hund's rule: fill up spins first
    for (let i = 0; i < sub.orbitals && remaining > 0; i++) {
      orbitals[i].up = true
      remaining--
    }
    for (let i = 0; i < sub.orbitals && remaining > 0; i++) {
      orbitals[i].down = true
      remaining--
    }
    return orbitals
  }, [])

  const checkAufbau = useCallback((subshellName) => {
    const target = SUBSHELLS.find(s => s.name === subshellName)
    if (!target) return true
    for (const sub of SUBSHELLS) {
      if (sub.energyOrder >= target.energyOrder) break
      const filled = electrons[sub.name] || 0
      if (filled < sub.capacity) return false
    }
    return true
  }, [electrons])

  const addElectron = useCallback((subshellName) => {
    const sub = SUBSHELLS.find(s => s.name === subshellName)
    if (!sub) return

    const current = electrons[subshellName] || 0
    if (current >= sub.capacity) {
      setWarnings([{ type: 'error', msg: `${subshellName} is full (Pauli exclusion)` }])
      return
    }

    if (!checkAufbau(subshellName)) {
      setWarnings([{ type: 'aufbau', msg: `Fill lower energy subshells first (Aufbau principle)` }])
      return
    }

    // Hund's rule warning: check if pairing before all orbitals singly filled
    if (sub.orbitals > 1) {
      const newCount = current + 1
      if (newCount > sub.orbitals && newCount <= sub.orbitals * 2) {
        // This is fine - pairing after singly filling
      }
      // Inform about Hund's rule when filling starts
      if (current === 0 && sub.orbitals > 1) {
        setWarnings([{ type: 'info', msg: `Hund's rule: fill each orbital singly before pairing in ${subshellName}` }])
      } else {
        setWarnings([])
      }
    } else {
      setWarnings([])
    }

    const newElectrons = { ...electrons, [subshellName]: current + 1 }
    setElectrons(newElectrons)

    // Check goal completion
    const newTotal = Object.values(newElectrons).reduce((s, e) => s + e, 0)
    if (newTotal === currentGoal.z) {
      const configMatch = Object.entries(currentGoal.config).every(
        ([key, val]) => (newElectrons[key] || 0) === val
      )
      if (configMatch) {
        const newCompleted = new Set(completedGoals)
        newCompleted.add(currentGoalIdx)
        setCompletedGoals(newCompleted)
        if (onGoalAchieved) onGoalAchieved(currentGoal.label)
        if (newCompleted.size === GOALS.length && onComplete) {
          onComplete()
        }
      }
    }
  }, [electrons, currentGoal, currentGoalIdx, completedGoals, checkAufbau, onGoalAchieved, onComplete])

  const removeElectron = useCallback((subshellName) => {
    const current = electrons[subshellName] || 0
    if (current <= 0) return
    setElectrons({ ...electrons, [subshellName]: current - 1 })
    setWarnings([])
  }, [electrons])

  const reset = useCallback(() => {
    setElectrons({})
    setWarnings([])
  }, [])

  const handleDragStart = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
    const svg = svgRef.current
    if (!svg) return
    const pt = svg.createSVGPoint()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    pt.x = clientX
    pt.y = clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    setDragPos({ x: svgP.x, y: svgP.y })
  }, [])

  const handleDragMove = useCallback((e) => {
    if (!dragging) return
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const pt = svg.createSVGPoint()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    pt.x = clientX
    pt.y = clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    setDragPos({ x: svgP.x, y: svgP.y })
  }, [dragging])

  const handleDragEnd = useCallback((e) => {
    if (!dragging) return
    setDragging(false)
    const svg = svgRef.current
    if (!svg || !dragPos) { setDragPos(null); return }

    const cx = 400
    const cy = 210
    const dx = dragPos.x - cx
    const dy = dragPos.y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Determine which shell ring was dropped on
    let targetSub = null
    for (const sub of SUBSHELLS) {
      const r = getShellRadius(sub.n, cx)
      if (Math.abs(dist - r) < 28) {
        // Find which subshell in this shell
        const shellSubs = SUBSHELLS.filter(s => s.n === sub.n)
        if (shellSubs.length === 1) {
          targetSub = shellSubs[0]
        } else {
          // Angle-based selection for multi-subshell shells
          const angle = Math.atan2(dy, dx)
          const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle
          const segmentSize = Math.PI / shellSubs.length
          const idx = Math.floor(normalizedAngle / segmentSize) % shellSubs.length
          targetSub = shellSubs[Math.min(idx, shellSubs.length - 1)]
        }
        break
      }
    }

    if (targetSub) {
      addElectron(targetSub.name)
    }
    setDragPos(null)
  }, [dragging, dragPos, addElectron])

  const svgWidth = 800
  const svgHeight = 480
  const cx = 400
  const cy = 210

  const configString = useMemo(() => {
    return SUBSHELLS
      .filter(s => (electrons[s.name] || 0) > 0)
      .map(s => `${s.name}${toSuperscript(electrons[s.name] || 0)}`)
      .join(' ')
  }, [electrons])

  return (
    <div className="space-y-3">
      {/* Goal selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {GOALS.map((goal, idx) => (
          <button
            key={goal.label}
            onClick={() => { setCurrentGoalIdx(idx); reset() }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              idx === currentGoalIdx
                ? 'bg-indigo-600 text-white'
                : completedGoals.has(idx)
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200'
            }`}
          >
            {completedGoals.has(idx) && <CheckCircle size={12} className="inline mr-1" />}
            {goal.label}
          </button>
        ))}
        <button
          onClick={reset}
          className="ml-auto p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          title="Reset"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Warnings */}
      <AnimatePresence>
        {warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
              warnings[0].type === 'error'
                ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                : warnings[0].type === 'aufbau'
                ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
            }`}
          >
            {warnings[0].type === 'info' ? <Info size={14} /> : <AlertTriangle size={14} />}
            {warnings[0].msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG */}
      <div className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full touch-none"
          style={{ minHeight: 300, maxHeight: containerHeight || 500 }}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <rect width={svgWidth} height={svgHeight} fill="#0A0E1A" opacity="0.6" />

          {/* Shell arcs */}
          {[1, 2, 3, 4].map(n => {
            const r = getShellRadius(n, cx)
            return (
              <g key={`shell-${n}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke={SHELL_COLORS[n]}
                  strokeOpacity={0.15}
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                />
                <text
                  x={cx + r + 6}
                  y={cy - 4}
                  fill={SHELL_COLORS[n]}
                  fontSize={11}
                  opacity={0.5}
                >
                  n={n}
                </text>
              </g>
            )
          })}

          {/* Nucleus */}
          <circle cx={cx} cy={cy} r={30} fill="#1e293b" stroke="#475569" strokeWidth={2} />
          <text x={cx} y={cy - 4} textAnchor="middle" fill="#94a3b8" fontSize={11}>
            Z={currentGoal.z}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="#e2e8f0" fontSize={16} fontWeight="bold">
            {currentGoal.symbol}
          </text>

          {/* Subshell regions */}
          {SUBSHELLS.map((sub, si) => {
            const r = getShellRadius(sub.n, cx)
            const shellSubs = SUBSHELLS.filter(s => s.n === sub.n)
            const subIdx = shellSubs.indexOf(sub)
            const angleStart = -Math.PI / 2 + (subIdx * Math.PI) / Math.max(shellSubs.length, 1)
            const angleSpan = Math.PI / Math.max(shellSubs.length, 1)
            const midAngle = angleStart + angleSpan / 2

            const labelX = cx + (r) * Math.cos(midAngle)
            const labelY = cy + (r) * Math.sin(midAngle)
            const count = electrons[sub.name] || 0
            const orbitals = getOrbitalFill(sub.name, count)

            return (
              <g key={sub.name}>
                {/* Clickable zone */}
                <circle
                  cx={labelX}
                  cy={labelY}
                  r={22}
                  fill={SHELL_COLORS[sub.n]}
                  fillOpacity={count > 0 ? 0.15 : 0.05}
                  stroke={SHELL_COLORS[sub.n]}
                  strokeOpacity={0.3}
                  strokeWidth={1}
                  className="cursor-pointer"
                  onClick={() => addElectron(sub.name)}
                  onContextMenu={(e) => { e.preventDefault(); removeElectron(sub.name) }}
                />

                {/* Subshell label */}
                <text
                  x={labelX}
                  y={labelY - 10}
                  textAnchor="middle"
                  fill={SHELL_COLORS[sub.n]}
                  fontSize={11}
                  fontWeight="600"
                >
                  {sub.name}
                </text>

                {/* Electron count */}
                <text
                  x={labelX}
                  y={labelY + 4}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize={13}
                  fontWeight="bold"
                >
                  {count}/{sub.capacity}
                </text>

                {/* Orbital boxes */}
                {orbitals.map((orb, oi) => {
                  const boxSize = 12
                  const gap = 2
                  const totalW = orbitals.length * (boxSize + gap) - gap
                  const bx = labelX - totalW / 2 + oi * (boxSize + gap)
                  const by = labelY + 10

                  return (
                    <g key={`${sub.name}-orb-${oi}`}>
                      <rect
                        x={bx}
                        y={by}
                        width={boxSize}
                        height={boxSize}
                        fill="none"
                        stroke={SHELL_COLORS[sub.n]}
                        strokeOpacity={0.4}
                        strokeWidth={0.8}
                        rx={1}
                      />
                      {orb.up && (
                        <text x={bx + 3} y={by + 10} fill="#60a5fa" fontSize={10}>
                          {'\u2191'}
                        </text>
                      )}
                      {orb.down && (
                        <text x={bx + 8} y={by + 10} fill="#f87171" fontSize={10}>
                          {'\u2193'}
                        </text>
                      )}
                    </g>
                  )
                })}
              </g>
            )
          })}

          {/* Electron pool at bottom */}
          <rect
            x={200}
            y={svgHeight - 65}
            width={400}
            height={50}
            rx={8}
            fill="#1e293b"
            stroke="#334155"
            strokeWidth={1}
          />
          <text x={260} y={svgHeight - 44} fill="#94a3b8" fontSize={11}>
            Electron Pool
          </text>
          <text x={260} y={svgHeight - 28} fill="#e2e8f0" fontSize={13} fontWeight="600">
            {currentGoal.z - totalElectrons} remaining
          </text>

          {/* Draggable electron */}
          {currentGoal.z - totalElectrons > 0 && (
            <g
              className="cursor-grab"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <circle
                cx={460}
                cy={svgHeight - 40}
                r={12}
                fill="#3b82f6"
                stroke="#60a5fa"
                strokeWidth={2}
                opacity={dragging ? 0.3 : 1}
              />
              <text x={460} y={svgHeight - 36} textAnchor="middle" fill="white" fontSize={10} fontWeight="bold">
                e-
              </text>
              <text x={460} y={svgHeight - 20} textAnchor="middle" fill="#64748b" fontSize={9}>
                drag or click subshell
              </text>
            </g>
          )}

          {/* Dragged electron ghost */}
          {dragging && dragPos && (
            <circle
              cx={dragPos.x}
              cy={dragPos.y}
              r={10}
              fill="#3b82f6"
              stroke="#93c5fd"
              strokeWidth={2}
              opacity={0.8}
              pointerEvents="none"
            />
          )}
        </svg>
      </div>

      {/* Configuration readout */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
        <span className="text-xs text-slate-400 mr-2">Configuration:</span>
        <span className="text-sm text-slate-200 font-mono">
          {configString || '(empty)'}
        </span>
        <span className="text-xs text-slate-500 ml-3">
          ({totalElectrons}/{currentGoal.z} electrons)
        </span>
      </div>

      {/* Goal completion */}
      <AnimatePresence>
        {completedGoals.has(currentGoalIdx) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
          >
            <CheckCircle size={16} className="text-emerald-400" />
            <span className="text-sm text-emerald-300">
              Correct configuration for {currentGoal.symbol}!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function toSuperscript(n) {
  const superscripts = { 0: '\u2070', 1: '\u00B9', 2: '\u00B2', 3: '\u00B3', 4: '\u2074', 5: '\u2075', 6: '\u2076', 7: '\u2077', 8: '\u2078', 9: '\u2079' }
  return String(n).split('').map(d => superscripts[d] || d).join('')
}

export default ElectronShellBuilder
