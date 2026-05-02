import { useState, useCallback, useMemo, useEffect, useRef } from 'react'

/**
 * StoichiometryFactory - Canvas-based factory assembly line game.
 *
 * Features:
 * - Reactants enter from the left at user-set rates on a conveyor belt
 * - Correct molar ratio produces products on the right
 * - Wrong ratio causes waste bin to overflow (visual indicator)
 * - User adjusts input rates to find the zero-waste ratio
 * - Equation shown at top: 2H2 + O2 -> 2H2O (and others)
 * - Visual: animated conveyor belt with molecule icons flowing
 * - Score based on how close to the correct ratio
 * - Challenge mode: find correct ratio for multiple reactions
 *
 * No external dependencies beyond React.
 */

// ---------- Data ----------

const REACTIONS = [
  {
    id: 'water',
    name: 'Water Synthesis',
    equation: '2H\u2082 + O\u2082 \u2192 2H\u2082O',
    reactants: [
      { formula: 'H\u2082', color: '#60a5fa', ratio: 2 },
      { formula: 'O\u2082', color: '#f87171', ratio: 1 },
    ],
    products: [
      { formula: 'H\u2082O', color: '#818cf8', ratio: 2 },
    ],
  },
  {
    id: 'ammonia',
    name: 'Ammonia Synthesis',
    equation: 'N\u2082 + 3H\u2082 \u2192 2NH\u2083',
    reactants: [
      { formula: 'N\u2082', color: '#818cf8', ratio: 1 },
      { formula: 'H\u2082', color: '#60a5fa', ratio: 3 },
    ],
    products: [
      { formula: 'NH\u2083', color: '#a78bfa', ratio: 2 },
    ],
  },
  {
    id: 'methane-combustion',
    name: 'Methane Combustion',
    equation: 'CH\u2084 + 2O\u2082 \u2192 CO\u2082 + 2H\u2082O',
    reactants: [
      { formula: 'CH\u2084', color: '#94a3b8', ratio: 1 },
      { formula: 'O\u2082', color: '#f87171', ratio: 2 },
    ],
    products: [
      { formula: 'CO\u2082', color: '#475569', ratio: 1 },
      { formula: 'H\u2082O', color: '#818cf8', ratio: 2 },
    ],
  },
  {
    id: 'rust',
    name: 'Iron Oxidation',
    equation: '4Fe + 3O\u2082 \u2192 2Fe\u2082O\u2083',
    reactants: [
      { formula: 'Fe', color: '#f97316', ratio: 4 },
      { formula: 'O\u2082', color: '#f87171', ratio: 3 },
    ],
    products: [
      { formula: 'Fe\u2082O\u2083', color: '#a16207', ratio: 2 },
    ],
  },
]

// ---------- Helpers ----------

/** Compute waste percentage: 0 = perfect ratio, higher = more mismatch */
function computeWaste(rates, reaction) {
  const totalInput = rates.reduce((a, b) => a + b, 0)
  if (totalInput === 0) return 0
  const requiredRatios = reaction.reactants.map(r => r.ratio)
  const totalRequired = requiredRatios.reduce((a, b) => a + b, 0)
  let mismatch = 0
  for (let i = 0; i < rates.length; i++) {
    const idealFrac = requiredRatios[i] / totalRequired
    const actualFrac = rates[i] / totalInput
    mismatch += Math.abs(idealFrac - actualFrac)
  }
  return Math.min(100, Math.round(mismatch * 100))
}

/** Compute a 0-100 score from waste */
function computeScore(waste) {
  return Math.max(0, 100 - waste * 2)
}

/** Check if rates match the stoichiometric ratio exactly (within tolerance) */
function isRatioCorrect(rates, reaction) {
  if (rates.every(r => r === 0)) return false
  const ratios = reaction.reactants.map(r => r.ratio)
  const ref = rates[0] / ratios[0]
  if (ref === 0) return false
  return ratios.every((r, i) => Math.abs(rates[i] / r - ref) < 0.01)
}

// ---------- Component ----------

function StoichiometryFactory({
  params,
  onParamChange,
  isPlaying,
  onDiscovery,
  discoveredSet,
  config,
  isComplete,
  onComplete,
  onScore,
  onGoalComplete,
  completedGoals,
  mode,
}) {
  const [rxnIdx, setRxnIdx] = useState(0)
  const [rates, setRates] = useState(() => REACTIONS[0].reactants.map(() => 1))
  const [running, setRunning] = useState(false)
  const [solvedSet, setSolvedSet] = useState(new Set())
  const [showPerfect, setShowPerfect] = useState(false)

  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const sizeRef = useRef({ width: 700, height: 360, scale: 1 })
  const rafRef = useRef(null)
  const timeRef = useRef(0)
  const moleculesRef = useRef([])  // array of animated molecule objects on belt
  const wasteRef = useRef(0)       // waste % for canvas to read
  const productCountRef = useRef(0)
  const spawnTimersRef = useRef([]) // per-reactant spawn cooldowns
  const perfectTimeoutRef = useRef(null)

  const isChallenge = mode === 'challenge'
  const reaction = REACTIONS[rxnIdx]
  const waste = useMemo(() => computeWaste(rates, reaction), [rates, reaction])
  const score = useMemo(() => computeScore(waste), [waste])
  const ratioCorrect = useMemo(() => isRatioCorrect(rates, reaction), [rates, reaction])

  // Keep waste ref current for canvas
  useEffect(() => { wasteRef.current = waste }, [waste])

  // ---------- Switching reactions ----------
  const switchReaction = useCallback((idx) => {
    setRxnIdx(idx)
    setRates(REACTIONS[idx].reactants.map(() => 1))
    setRunning(false)
    setShowPerfect(false)
    moleculesRef.current = []
    productCountRef.current = 0
    spawnTimersRef.current = REACTIONS[idx].reactants.map(() => 0)
    timeRef.current = 0
  }, [])

  // ---------- Adjust rate ----------
  const adjustRate = useCallback((idx, delta) => {
    setRates(prev => {
      const next = [...prev]
      next[idx] = Math.max(0, Math.min(10, next[idx] + delta))
      return next
    })
  }, [])

  // ---------- Detect solved ----------
  useEffect(() => {
    if (ratioCorrect && running && !solvedSet.has(rxnIdx)) {
      const newSolved = new Set(solvedSet)
      newSolved.add(rxnIdx)
      setSolvedSet(newSolved)
      setShowPerfect(true)
      if (perfectTimeoutRef.current) clearTimeout(perfectTimeoutRef.current)
      perfectTimeoutRef.current = setTimeout(() => setShowPerfect(false), 3000)

      if (onScore) onScore(score)
      if (onGoalComplete) onGoalComplete(reaction.id)
      if (newSolved.size === REACTIONS.length && onComplete && !isComplete) {
        onComplete()
      }
    }
  }, [ratioCorrect, running, rxnIdx, solvedSet, score, reaction, onScore, onGoalComplete, onComplete, isComplete])

  // Cleanup
  useEffect(() => {
    return () => { if (perfectTimeoutRef.current) clearTimeout(perfectTimeoutRef.current) }
  }, [])

  // ---------- Canvas resize ----------
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        if (width === 0) continue
        const height = Math.max(280, Math.min(420, width * 0.50))
        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        sizeRef.current = { width, height, scale: dpr }
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // ---------- Main canvas animation loop ----------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let alive = true
    const currentRxn = REACTIONS[rxnIdx]
    // Initialize spawn timers
    spawnTimersRef.current = currentRxn.reactants.map(() => 0)

    const render = () => {
      if (!alive) return
      const { width, height, scale } = sizeRef.current
      if (width === 0) { rafRef.current = requestAnimationFrame(render); return }

      const dt = 0.016  // ~60fps time step
      if (running) timeRef.current += dt

      ctx.save()
      ctx.scale(scale, scale)
      ctx.clearRect(0, 0, width, height)

      // ======== Background ========
      ctx.fillStyle = '#0a0e1a'
      ctx.fillRect(0, 0, width, height)

      // Subtle grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.03)'
      ctx.lineWidth = 0.5
      for (let gx = 0; gx < width; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke()
      }
      for (let gy = 0; gy < height; gy += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke()
      }

      // ======== Layout constants ========
      const beltY = height * 0.56
      const beltH = 20
      const reactorX = width * 0.50
      const reactorW = 90
      const reactorH = 95

      // ======== Conveyor belt ========
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, beltY - beltH / 2, width, beltH)

      // Animated dashes on belt
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      ctx.setLineDash([10, 8])
      const dashOffset = running ? -(timeRef.current * 55) % 18 : 0
      ctx.lineDashOffset = dashOffset
      ctx.beginPath()
      ctx.moveTo(0, beltY)
      ctx.lineTo(width, beltY)
      ctx.stroke()
      ctx.setLineDash([])

      // Belt edges
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, beltY - beltH / 2); ctx.lineTo(width, beltY - beltH / 2)
      ctx.moveTo(0, beltY + beltH / 2); ctx.lineTo(width, beltY + beltH / 2)
      ctx.stroke()

      // ======== Equation at top ========
      ctx.fillStyle = '#94a3b8'
      ctx.font = 'bold 14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(currentRxn.equation, width / 2, 24)

      // ======== Input hoppers (left) ========
      const hopperBaseX = 40
      const hopperSpacing = Math.min(90, (reactorX - reactorW / 2 - 60) / currentRxn.reactants.length)

      currentRxn.reactants.forEach((r, i) => {
        const hx = hopperBaseX + i * hopperSpacing
        const hy = beltY - beltH / 2 - 62
        const hw = 66
        const hh = 52

        // Hopper body
        ctx.fillStyle = '#1e293b'
        ctx.strokeStyle = r.color + '50'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.roundRect(hx - hw / 2, hy, hw, hh, 6)
        ctx.fill()
        ctx.stroke()

        // Formula
        ctx.fillStyle = r.color
        ctx.font = 'bold 13px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(r.formula, hx, hy + 20)

        // Rate display
        ctx.fillStyle = '#94a3b8'
        ctx.font = '10px sans-serif'
        ctx.fillText(`rate: ${rates[i]}`, hx, hy + 38)

        // Chute to belt
        ctx.strokeStyle = '#334155'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 3])
        ctx.beginPath()
        ctx.moveTo(hx, hy + hh)
        ctx.lineTo(hx, beltY - beltH / 2)
        ctx.stroke()
        ctx.setLineDash([])

        // Required ratio hint
        ctx.fillStyle = '#475569'
        ctx.font = '9px sans-serif'
        ctx.fillText(`ratio: ${r.ratio}`, hx, hy - 6)
      })

      // ======== Reactor vessel (center) ========
      const reactorTop = beltY - beltH / 2 - reactorH + 8

      // Glow when running
      if (running) {
        const gAlpha = 0.04 + 0.03 * Math.sin(timeRef.current * 3)
        ctx.fillStyle = `rgba(99, 102, 241, ${gAlpha})`
        ctx.beginPath()
        ctx.roundRect(reactorX - reactorW / 2 - 4, reactorTop - 4, reactorW + 8, reactorH + 8, 12)
        ctx.fill()
      }

      ctx.fillStyle = '#1e293b'
      ctx.strokeStyle = wasteRef.current > 30 ? '#f9731680' : wasteRef.current > 10 ? '#fbbf2480' : '#33415580'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.roundRect(reactorX - reactorW / 2, reactorTop, reactorW, reactorH, 8)
      ctx.fill()
      ctx.stroke()

      // Reactor label
      ctx.fillStyle = '#64748b'
      ctx.font = 'bold 10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('REACTOR', reactorX, reactorTop + 16)

      // Chimney smoke when running
      if (running) {
        for (let s = 0; s < 4; s++) {
          const smokeY = reactorTop - 8 - s * 12 - Math.sin(timeRef.current * 1.5 + s) * 3
          const smokeX = reactorX + Math.sin(timeRef.current * 0.8 + s * 1.5) * 6
          ctx.fillStyle = `rgba(148, 163, 184, ${0.12 - s * 0.025})`
          ctx.beginPath()
          ctx.arc(smokeX, smokeY, 4 + s * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ======== Waste bin (below reactor) ========
      const binX = reactorX
      const binY = beltY + beltH / 2 + 20
      const binW = 54
      const binH = 36
      const wasteLevel = Math.min(1, wasteRef.current / 100)

      ctx.fillStyle = '#1e293b'
      ctx.strokeStyle = wasteLevel > 0.5 ? '#f8717180' : '#33415580'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(binX - binW / 2, binY, binW, binH, 4)
      ctx.fill()
      ctx.stroke()

      // Waste fill bar
      if (wasteLevel > 0) {
        const fillH = (binH - 4) * wasteLevel
        ctx.fillStyle = wasteLevel > 0.5 ? 'rgba(248, 113, 113, 0.35)' : 'rgba(251, 191, 36, 0.25)'
        ctx.fillRect(binX - binW / 2 + 2, binY + binH - fillH - 2, binW - 4, fillH)
      }

      ctx.fillStyle = '#64748b'
      ctx.font = '8px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('WASTE', binX, binY + binH + 12)

      ctx.fillStyle = wasteLevel > 0.5 ? '#f87171' : '#fbbf24'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText(`${wasteRef.current}%`, binX, binY + binH / 2 + 4)

      // Pipe from reactor down to waste bin
      ctx.strokeStyle = '#33415520'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(binX, beltY + beltH / 2)
      ctx.lineTo(binX, binY)
      ctx.stroke()
      ctx.setLineDash([])

      // ======== Output chute (right) ========
      const outputX = width - 80
      const outputY = beltY - beltH / 2 - 62
      const outputW = 72
      const outputH = 52

      ctx.fillStyle = '#1e293b'
      ctx.strokeStyle = ratioCorrect && running ? '#34d39960' : '#33415580'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(outputX - outputW / 2, outputY, outputW, outputH, 6)
      ctx.fill()
      ctx.stroke()

      // Product labels
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      currentRxn.products.forEach((p, i) => {
        ctx.fillStyle = p.color
        ctx.fillText(p.formula, outputX, outputY + 18 + i * 16)
      })

      ctx.fillStyle = '#475569'
      ctx.font = '9px sans-serif'
      ctx.fillText('PRODUCTS', outputX, outputY - 6)

      // Chute from belt to output
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(outputX, outputY + outputH)
      ctx.lineTo(outputX, beltY - beltH / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // ======== Molecule animation ========
      if (running) {
        const molecules = moleculesRef.current

        // Spawn molecules based on rates
        currentRxn.reactants.forEach((r, i) => {
          spawnTimersRef.current[i] += dt
          const rate = rates[i]
          const interval = rate > 0 ? 1.2 / rate : 999
          if (spawnTimersRef.current[i] >= interval) {
            spawnTimersRef.current[i] = 0
            const hx = hopperBaseX + i * hopperSpacing
            molecules.push({
              x: hx,
              y: beltY,
              color: r.color,
              formula: r.formula,
              speed: 38 + Math.random() * 12,
              type: 'reactant',
              alive: true,
            })
          }
        })

        // Update and draw molecules
        molecules.forEach(m => {
          if (!m.alive) return
          m.x += m.speed * dt

          // Reactant hits reactor -> transform or waste
          if (m.type === 'reactant' && m.x >= reactorX - reactorW / 2 + 5) {
            m.alive = false
            // Produce product output if ratio is good
            if (wasteRef.current < 15) {
              productCountRef.current++
              // Spawn product molecule every few reactants
              if (productCountRef.current % Math.max(2, currentRxn.reactants.length) === 0) {
                const p = currentRxn.products[Math.floor(Math.random() * currentRxn.products.length)]
                molecules.push({
                  x: reactorX + reactorW / 2 + 5,
                  y: beltY,
                  color: p.color,
                  formula: p.formula,
                  speed: 45 + Math.random() * 10,
                  type: 'product',
                  alive: true,
                })
              }
            }
          }

          // Product exits screen
          if (m.type === 'product' && m.x > width + 20) {
            m.alive = false
          }
        })

        // Cull dead molecules
        moleculesRef.current = molecules.filter(m => m.alive)

        // Draw molecules
        moleculesRef.current.forEach(m => {
          ctx.fillStyle = m.color + 'cc'
          ctx.beginPath()
          ctx.arc(m.x, m.y, 9, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = '#ffffff'
          ctx.font = 'bold 7px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(m.formula, m.x, m.y)
          ctx.textBaseline = 'alphabetic' // reset
        })
      }

      // ======== Score display ========
      const scoreVal = computeScore(wasteRef.current)
      const scoreClr = scoreVal >= 90 ? '#34d399' : scoreVal >= 60 ? '#fbbf24' : '#f87171'
      ctx.fillStyle = scoreClr
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`Efficiency: ${scoreVal}%`, width - 14, 24)

      // ======== Overlay when not running ========
      if (!running) {
        ctx.fillStyle = 'rgba(10, 14, 26, 0.55)'
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = '#94a3b8'
        ctx.font = '15px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('Set the input rates, then press Start', width / 2, height / 2)
        ctx.textBaseline = 'alphabetic'
      }

      ctx.restore()
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => {
      alive = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [rxnIdx, rates, running, ratioCorrect])

  // ---------- Render ----------
  return (
    <div className="space-y-3">
      {/* Reaction selector tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {REACTIONS.map((r, i) => (
          <button
            key={r.id}
            onClick={() => switchReaction(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              i === rxnIdx
                ? 'bg-indigo-600/30 border-indigo-500/50 text-white'
                : solvedSet.has(i)
                ? 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-slate-200'
            }`}
          >
            {solvedSet.has(i) ? '\u2713 ' : ''}{r.name}
          </button>
        ))}
      </div>

      {/* Rate controls and start/stop */}
      <div className="flex items-center gap-4 flex-wrap">
        {reaction.reactants.map((r, i) => (
          <div key={`rate-${i}`} className="flex items-center gap-2">
            <span className="text-xs font-bold" style={{ color: r.color }}>{r.formula}</span>
            <span className="text-[10px] text-slate-500">rate:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => adjustRate(i, -1)}
                className="w-6 h-6 rounded bg-slate-700/60 text-slate-300 text-sm font-bold cursor-pointer hover:bg-slate-600/60 transition-colors flex items-center justify-center"
              >
                -
              </button>
              <span className={`w-8 text-center text-lg font-bold tabular-nums ${
                rates[i] === r.ratio ? 'text-emerald-400' : rates[i] > 0 ? 'text-amber-300' : 'text-slate-500'
              }`}>
                {rates[i]}
              </span>
              <button
                onClick={() => adjustRate(i, 1)}
                className="w-6 h-6 rounded bg-slate-700/60 text-slate-300 text-sm font-bold cursor-pointer hover:bg-slate-600/60 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>
            <span className="text-[10px] text-slate-600">(need: {r.ratio})</span>
          </div>
        ))}

        <button
          onClick={() => {
            if (!running) {
              moleculesRef.current = []
              productCountRef.current = 0
              spawnTimersRef.current = reaction.reactants.map(() => 0)
            }
            setRunning(r => !r)
          }}
          className={`ml-auto px-4 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
            running
              ? 'bg-red-600/20 border-red-500/40 text-red-300 hover:bg-red-600/30'
              : 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30'
          }`}
        >
          {running ? 'Stop' : 'Start'}
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl bg-slate-900/80 border border-slate-700/40"
        style={{ minHeight: 280 }}
      >
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Waste</span>
          <span className={`text-sm font-bold ${
            waste === 0 ? 'text-emerald-400' : waste < 30 ? 'text-amber-300' : 'text-red-400'
          }`}>
            {waste}%
          </span>
        </div>
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Efficiency</span>
          <span className={`text-sm font-bold ${
            score >= 90 ? 'text-emerald-400' : score >= 60 ? 'text-amber-300' : 'text-red-400'
          }`}>
            {score}%
          </span>
        </div>
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Ratio Match</span>
          <span className={`text-sm font-bold ${ratioCorrect ? 'text-emerald-400' : 'text-slate-400'}`}>
            {ratioCorrect ? '\u2713 Perfect' : '\u2717 Off'}
          </span>
        </div>
      </div>

      {/* Perfect ratio banner */}
      {showPerfect && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
          <span className="text-emerald-400 font-bold text-sm">{'\u2713'}</span>
          <span className="text-sm text-emerald-300">
            Zero-waste ratio achieved! Factory running at peak efficiency.
          </span>
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500">
          {solvedSet.size}/{REACTIONS.length} reactions optimized
        </span>
        <div className="flex-1 h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(solvedSet.size / REACTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Hint */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
        <p className="text-xs text-slate-400 leading-relaxed">
          The reaction <span className="text-slate-300 font-mono">{reaction.equation}</span> tells
          you the molar ratio of reactants. Adjust the input rates to match this ratio exactly.
          When rates match, waste drops to zero and efficiency reaches 100%.
          {isChallenge && ' Find the zero-waste ratio for all reactions to complete the challenge!'}
        </p>
      </div>
    </div>
  )
}

export default StoichiometryFactory
