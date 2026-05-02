import { useState, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, CheckCircle, Trash2 } from 'lucide-react'

/**
 * Molecule Builder - drag atoms onto an SVG workspace to form molecules.
 *
 * Atoms auto-bond when within bonding distance and both have available
 * valence. Click bonds to cycle single/double/triple. Lewis structures
 * generated dynamically.
 */

const ATOM_TYPES = [
  { symbol: 'H', valence: 1, color: '#60a5fa', radius: 16 },
  { symbol: 'C', valence: 4, color: '#94a3b8', radius: 22 },
  { symbol: 'N', valence: 3, color: '#818cf8', radius: 20 },
  { symbol: 'O', valence: 2, color: '#f87171', radius: 20 },
  { symbol: 'F', valence: 1, color: '#fbbf24', radius: 18 },
  { symbol: 'Cl', valence: 1, color: '#34d399', radius: 18 },
]

const BOND_DISTANCE = 70

const GOALS = [
  {
    label: 'Build H\u2082O',
    formula: 'H2O',
    atoms: { H: 2, O: 1 },
    bonds: [{ from: 'O', to: 'H', type: 1 }, { from: 'O', to: 'H', type: 1 }],
  },
  {
    label: 'Build CO\u2082',
    formula: 'CO2',
    atoms: { C: 1, O: 2 },
    bonds: [{ from: 'C', to: 'O', type: 2 }, { from: 'C', to: 'O', type: 2 }],
  },
  {
    label: 'Build CH\u2084',
    formula: 'CH4',
    atoms: { C: 1, H: 4 },
    bonds: [{ from: 'C', to: 'H', type: 1 }, { from: 'C', to: 'H', type: 1 }, { from: 'C', to: 'H', type: 1 }, { from: 'C', to: 'H', type: 1 }],
  },
  {
    label: 'Build NH\u2083',
    formula: 'NH3',
    atoms: { N: 1, H: 3 },
    bonds: [{ from: 'N', to: 'H', type: 1 }, { from: 'N', to: 'H', type: 1 }, { from: 'N', to: 'H', type: 1 }],
  },
]

let atomIdCounter = 0

function MoleculeBuilder({
  config,
  params,
  onGoalAchieved,
  onComplete,
  isComplete,
  containerWidth = 800,
  containerHeight = 500,
}) {
  const [atoms, setAtoms] = useState([])
  const [bonds, setBonds] = useState([])
  const [currentGoalIdx, setCurrentGoalIdx] = useState(0)
  const [completedGoals, setCompletedGoals] = useState(new Set())
  const [draggingAtom, setDraggingAtom] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [draggingNew, setDraggingNew] = useState(null)
  const svgRef = useRef(null)

  const currentGoal = GOALS[currentGoalIdx]
  const svgW = 700
  const svgH = 420
  const paletteX = 60

  const getUsedValence = useCallback((atomId) => {
    return bonds
      .filter(b => b.from === atomId || b.to === atomId)
      .reduce((sum, b) => sum + b.type, 0)
  }, [bonds])

  const getAvailableValence = useCallback((atom) => {
    const type = ATOM_TYPES.find(t => t.symbol === atom.symbol)
    if (!type) return 0
    return type.valence - getUsedValence(atom.id)
  }, [getUsedValence])

  const getLonePairs = useCallback((atom) => {
    const type = ATOM_TYPES.find(t => t.symbol === atom.symbol)
    if (!type) return 0
    const totalElectrons = type.valence
    const bondingElectrons = getUsedValence(atom.id)
    // For main group: lone pairs = (valence electrons from group - bonding electrons) / 2
    // Simplified: unused valence electrons form lone pairs
    const groupElectrons = { H: 1, C: 4, N: 5, O: 6, F: 7, Cl: 7 }
    const total = groupElectrons[atom.symbol] || 0
    const remaining = total - bondingElectrons
    return Math.max(0, Math.floor(remaining / 2))
  }, [getUsedValence])

  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    pt.x = clientX
    pt.y = clientY
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse())
    return { x: svgP.x, y: svgP.y }
  }, [])

  const tryBond = useCallback((movedAtom, allAtoms, currentBonds) => {
    const newBonds = [...currentBonds]
    const movedType = ATOM_TYPES.find(t => t.symbol === movedAtom.symbol)
    if (!movedType) return newBonds

    const movedUsed = newBonds
      .filter(b => b.from === movedAtom.id || b.to === movedAtom.id)
      .reduce((s, b) => s + b.type, 0)

    if (movedUsed >= movedType.valence) return newBonds

    for (const other of allAtoms) {
      if (other.id === movedAtom.id) continue
      const dx = other.x - movedAtom.x
      const dy = other.y - movedAtom.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > BOND_DISTANCE) continue

      // Check if already bonded
      const existingBond = newBonds.find(
        b => (b.from === movedAtom.id && b.to === other.id) ||
             (b.from === other.id && b.to === movedAtom.id)
      )
      if (existingBond) continue

      const otherType = ATOM_TYPES.find(t => t.symbol === other.symbol)
      if (!otherType) continue

      const otherUsed = newBonds
        .filter(b => b.from === other.id || b.to === other.id)
        .reduce((s, b) => s + b.type, 0)

      if (otherUsed >= otherType.valence) continue

      // Determine bond type based on remaining valence
      const movedRemaining = movedType.valence - movedUsed
      const otherRemaining = otherType.valence - otherUsed
      const bondType = Math.min(movedRemaining, otherRemaining, 3)

      newBonds.push({
        id: `bond-${movedAtom.id}-${other.id}`,
        from: movedAtom.id,
        to: other.id,
        type: bondType > 1 ? 1 : 1, // Start with single, user can upgrade
      })

      break // One bond at a time
    }

    return newBonds
  }, [])

  const checkGoalCompletion = useCallback((currentAtoms, currentBonds) => {
    const goal = GOALS[currentGoalIdx]
    // Count atoms
    const atomCounts = {}
    currentAtoms.forEach(a => {
      atomCounts[a.symbol] = (atomCounts[a.symbol] || 0) + 1
    })

    // Check atom counts match
    const atomsMatch = Object.entries(goal.atoms).every(
      ([sym, count]) => (atomCounts[sym] || 0) === count
    ) && Object.values(atomCounts).reduce((s, v) => s + v, 0) ===
      Object.values(goal.atoms).reduce((s, v) => s + v, 0)

    if (!atomsMatch) return false

    // Check all atoms are bonded and bond types match goal
    const bondsByType = {}
    currentBonds.forEach(b => {
      const fromAtom = currentAtoms.find(a => a.id === b.from)
      const toAtom = currentAtoms.find(a => a.id === b.to)
      if (!fromAtom || !toAtom) return
      const key = [fromAtom.symbol, toAtom.symbol].sort().join('-')
      if (!bondsByType[key]) bondsByType[key] = []
      bondsByType[key].push(b.type)
    })

    const goalBondsByType = {}
    goal.bonds.forEach(b => {
      const key = [b.from, b.to].sort().join('-')
      if (!goalBondsByType[key]) goalBondsByType[key] = []
      goalBondsByType[key].push(b.type)
    })

    return Object.entries(goalBondsByType).every(([key, types]) => {
      const actual = bondsByType[key] || []
      if (actual.length !== types.length) return false
      const sortedActual = [...actual].sort()
      const sortedGoal = [...types].sort()
      return sortedActual.every((v, i) => v === sortedGoal[i])
    })
  }, [currentGoalIdx])

  const handlePaletteMouseDown = useCallback((e, atomType) => {
    e.preventDefault()
    const pos = getSVGPoint(e)
    const newAtom = {
      id: `atom-${++atomIdCounter}`,
      symbol: atomType.symbol,
      x: pos.x,
      y: pos.y,
    }
    setDraggingNew(newAtom)
  }, [getSVGPoint])

  const handleAtomMouseDown = useCallback((e, atom) => {
    e.preventDefault()
    e.stopPropagation()
    const pos = getSVGPoint(e)
    setDraggingAtom(atom.id)
    setDragOffset({ x: atom.x - pos.x, y: atom.y - pos.y })
  }, [getSVGPoint])

  const handleMouseMove = useCallback((e) => {
    const pos = getSVGPoint(e)

    if (draggingNew) {
      setDraggingNew(prev => prev ? { ...prev, x: pos.x, y: pos.y } : null)
      return
    }

    if (draggingAtom) {
      setAtoms(prev => prev.map(a =>
        a.id === draggingAtom
          ? { ...a, x: pos.x + dragOffset.x, y: pos.y + dragOffset.y }
          : a
      ))
    }
  }, [draggingNew, draggingAtom, dragOffset, getSVGPoint])

  const handleMouseUp = useCallback(() => {
    if (draggingNew) {
      if (draggingNew.x > paletteX + 50) {
        const newAtoms = [...atoms, draggingNew]
        const newBonds = tryBond(draggingNew, newAtoms, bonds)
        setAtoms(newAtoms)
        setBonds(newBonds)

        if (checkGoalCompletion(newAtoms, newBonds)) {
          const newCompleted = new Set(completedGoals)
          newCompleted.add(currentGoalIdx)
          setCompletedGoals(newCompleted)
          if (onGoalAchieved) onGoalAchieved(currentGoal.label)
          if (newCompleted.size === GOALS.length && onComplete) onComplete()
        }
      }
      setDraggingNew(null)
      return
    }

    if (draggingAtom) {
      const movedAtom = atoms.find(a => a.id === draggingAtom)
      if (movedAtom) {
        const newBonds = tryBond(movedAtom, atoms, bonds)
        setBonds(newBonds)

        if (checkGoalCompletion(atoms, newBonds)) {
          const newCompleted = new Set(completedGoals)
          newCompleted.add(currentGoalIdx)
          setCompletedGoals(newCompleted)
          if (onGoalAchieved) onGoalAchieved(currentGoal.label)
          if (newCompleted.size === GOALS.length && onComplete) onComplete()
        }
      }
      setDraggingAtom(null)
    }
  }, [draggingNew, draggingAtom, atoms, bonds, tryBond, checkGoalCompletion, currentGoalIdx, completedGoals, currentGoal, onGoalAchieved, onComplete])

  const cycleBondType = useCallback((bondId) => {
    setBonds(prev => {
      const newBonds = prev.map(b => {
        if (b.id !== bondId) return b

        const fromAtom = atoms.find(a => a.id === b.from)
        const toAtom = atoms.find(a => a.id === b.to)
        if (!fromAtom || !toAtom) return b

        const fromType = ATOM_TYPES.find(t => t.symbol === fromAtom.symbol)
        const toType = ATOM_TYPES.find(t => t.symbol === toAtom.symbol)
        if (!fromType || !toType) return b

        const fromUsed = prev
          .filter(pb => pb.id !== bondId && (pb.from === fromAtom.id || pb.to === fromAtom.id))
          .reduce((s, pb) => s + pb.type, 0)
        const toUsed = prev
          .filter(pb => pb.id !== bondId && (pb.from === toAtom.id || pb.to === toAtom.id))
          .reduce((s, pb) => s + pb.type, 0)

        const maxType = Math.min(fromType.valence - fromUsed, toType.valence - toUsed, 3)
        const newType = b.type >= maxType ? 1 : b.type + 1

        return { ...b, type: newType }
      })

      // Check goal after bond cycle
      if (checkGoalCompletion(atoms, newBonds)) {
        const nc = new Set(completedGoals)
        nc.add(currentGoalIdx)
        setCompletedGoals(nc)
        if (onGoalAchieved) onGoalAchieved(currentGoal.label)
        if (nc.size === GOALS.length && onComplete) onComplete()
      }

      return newBonds
    })
  }, [atoms, checkGoalCompletion, currentGoalIdx, completedGoals, currentGoal, onGoalAchieved, onComplete])

  const removeAtom = useCallback((atomId) => {
    setAtoms(prev => prev.filter(a => a.id !== atomId))
    setBonds(prev => prev.filter(b => b.from !== atomId && b.to !== atomId))
  }, [])

  const reset = useCallback(() => {
    setAtoms([])
    setBonds([])
    atomIdCounter = 0
  }, [])

  const lewisString = useMemo(() => {
    if (atoms.length === 0) return ''
    const parts = []
    const visited = new Set()

    // Find central atom (highest valence)
    const sorted = [...atoms].sort((a, b) => {
      const aType = ATOM_TYPES.find(t => t.symbol === a.symbol)
      const bType = ATOM_TYPES.find(t => t.symbol === b.symbol)
      return (bType?.valence || 0) - (aType?.valence || 0)
    })

    for (const atom of sorted) {
      if (visited.has(atom.id)) continue
      visited.add(atom.id)

      const atomBonds = bonds.filter(b => b.from === atom.id || b.to === atom.id)
      let part = atom.symbol

      for (const bond of atomBonds) {
        const otherId = bond.from === atom.id ? bond.to : bond.from
        const other = atoms.find(a => a.id === otherId)
        if (!other || visited.has(other.id)) continue
        visited.add(other.id)

        const bondStr = bond.type === 3 ? '\u2261' : bond.type === 2 ? '=' : '-'
        part += bondStr + other.symbol
      }

      const lp = getLonePairs(atom)
      if (lp > 0) part += ` (:${lp})`
      parts.push(part)
    }

    return parts.join(' ')
  }, [atoms, bonds, getLonePairs])

  return (
    <div className="space-y-3">
      {/* Goal selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {GOALS.map((goal, idx) => (
          <button
            key={goal.formula}
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
          title="Clear workspace"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* SVG Workspace */}
      <div className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full touch-none"
          style={{ minHeight: 300, maxHeight: containerHeight || 500 }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <rect width={svgW} height={svgH} fill="#0A0E1A" opacity="0.6" />

          {/* Grid */}
          <defs>
            <pattern id="mol-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(148,163,184,0.05)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={svgW} height={svgH} fill="url(#mol-grid)" />

          {/* Atom palette on left */}
          <rect x={0} y={0} width={paletteX + 30} height={svgH} fill="rgba(15,23,42,0.8)" />
          <line x1={paletteX + 30} y1={0} x2={paletteX + 30} y2={svgH} stroke="#334155" strokeWidth={1} />
          <text x={paletteX - 10} y={22} textAnchor="middle" fill="#64748b" fontSize={10}>Atoms</text>

          {ATOM_TYPES.map((type, i) => {
            const y = 50 + i * 58
            return (
              <g
                key={type.symbol}
                className="cursor-grab"
                onMouseDown={(e) => handlePaletteMouseDown(e, type)}
                onTouchStart={(e) => handlePaletteMouseDown(e, type)}
              >
                <circle
                  cx={paletteX - 10}
                  cy={y}
                  r={type.radius}
                  fill={type.color}
                  fillOpacity={0.3}
                  stroke={type.color}
                  strokeWidth={1.5}
                  strokeOpacity={0.6}
                />
                <text x={paletteX - 10} y={y + 1} textAnchor="middle" fill="white" fontSize={13} fontWeight="bold" dominantBaseline="central">
                  {type.symbol}
                </text>
                <text x={paletteX - 10} y={y + type.radius + 12} textAnchor="middle" fill="#64748b" fontSize={9}>
                  v={type.valence}
                </text>
              </g>
            )
          })}

          {/* Bonds */}
          {bonds.map(bond => {
            const fromAtom = atoms.find(a => a.id === bond.from)
            const toAtom = atoms.find(a => a.id === bond.to)
            if (!fromAtom || !toAtom) return null

            const dx = toAtom.x - fromAtom.x
            const dy = toAtom.y - fromAtom.y
            const len = Math.sqrt(dx * dx + dy * dy)
            if (len === 0) return null
            const nx = -dy / len
            const ny = dx / len

            const offset = bond.type === 1 ? 0 : bond.type === 2 ? 3 : 4

            return (
              <g
                key={bond.id}
                className="cursor-pointer"
                onClick={() => cycleBondType(bond.id)}
              >
                {Array.from({ length: bond.type }, (_, i) => {
                  const shift = (i - (bond.type - 1) / 2) * offset * 2
                  return (
                    <line
                      key={i}
                      x1={fromAtom.x + nx * shift}
                      y1={fromAtom.y + ny * shift}
                      x2={toAtom.x + nx * shift}
                      y2={toAtom.y + ny * shift}
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  )
                })}
                {/* Invisible wider click target */}
                <line
                  x1={fromAtom.x}
                  y1={fromAtom.y}
                  x2={toAtom.x}
                  y2={toAtom.y}
                  stroke="transparent"
                  strokeWidth={12}
                />
              </g>
            )
          })}

          {/* Workspace atoms */}
          {atoms.map(atom => {
            const type = ATOM_TYPES.find(t => t.symbol === atom.symbol)
            if (!type) return null
            const available = getAvailableValence(atom)
            const lonePairs = getLonePairs(atom)

            return (
              <g
                key={atom.id}
                className="cursor-grab"
                onMouseDown={(e) => handleAtomMouseDown(e, atom)}
                onTouchStart={(e) => handleAtomMouseDown(e, atom)}
                onDoubleClick={() => removeAtom(atom.id)}
              >
                <circle
                  cx={atom.x}
                  cy={atom.y}
                  r={type.radius}
                  fill={type.color}
                  fillOpacity={0.3}
                  stroke={type.color}
                  strokeWidth={draggingAtom === atom.id ? 2.5 : 1.5}
                  strokeOpacity={0.7}
                />
                <text
                  x={atom.x}
                  y={atom.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={14}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {atom.symbol}
                </text>

                {/* Available bonds indicator */}
                {available > 0 && (
                  <text
                    x={atom.x + type.radius + 4}
                    y={atom.y - type.radius + 4}
                    fill="#fbbf24"
                    fontSize={9}
                    pointerEvents="none"
                  >
                    {available}
                  </text>
                )}

                {/* Lone pairs as dot pairs */}
                {lonePairs > 0 && Array.from({ length: lonePairs }, (_, i) => {
                  const angle = (Math.PI * 2 * i) / lonePairs + Math.PI / 4
                  // Place lone pairs away from bonds
                  const lpX = atom.x + (type.radius + 10) * Math.cos(angle)
                  const lpY = atom.y + (type.radius + 10) * Math.sin(angle)
                  return (
                    <g key={`lp-${atom.id}-${i}`} pointerEvents="none">
                      <circle cx={lpX - 3} cy={lpY} r={2} fill={type.color} opacity={0.6} />
                      <circle cx={lpX + 3} cy={lpY} r={2} fill={type.color} opacity={0.6} />
                    </g>
                  )
                })}
              </g>
            )
          })}

          {/* Dragging new atom ghost */}
          {draggingNew && (
            <g pointerEvents="none">
              <circle
                cx={draggingNew.x}
                cy={draggingNew.y}
                r={ATOM_TYPES.find(t => t.symbol === draggingNew.symbol)?.radius || 18}
                fill={ATOM_TYPES.find(t => t.symbol === draggingNew.symbol)?.color || '#60a5fa'}
                fillOpacity={0.4}
                stroke={ATOM_TYPES.find(t => t.symbol === draggingNew.symbol)?.color || '#60a5fa'}
                strokeWidth={2}
                strokeDasharray="4 2"
              />
              <text
                x={draggingNew.x}
                y={draggingNew.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={14}
                fontWeight="bold"
              >
                {draggingNew.symbol}
              </text>
            </g>
          )}

          {/* Instructions */}
          {atoms.length === 0 && (
            <text x={svgW / 2 + 20} y={svgH / 2} textAnchor="middle" fill="#475569" fontSize={13}>
              Drag atoms from the palette to build {currentGoal.formula}
            </text>
          )}
        </svg>
      </div>

      {/* Lewis structure readout */}
      <div className="flex items-center gap-4">
        <div className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40">
          <span className="text-xs text-slate-400 mr-2">Lewis Structure:</span>
          <span className="text-sm text-slate-200 font-mono">
            {lewisString || '(empty)'}
          </span>
        </div>
        <span className="text-xs text-slate-500">
          Click bonds to cycle type. Double-click atoms to remove.
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
              {currentGoal.formula} built correctly!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MoleculeBuilder
