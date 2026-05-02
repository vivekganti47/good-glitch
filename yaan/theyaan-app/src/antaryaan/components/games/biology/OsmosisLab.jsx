import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * OsmosisLab - Canvas-based osmosis simulation.
 *
 * Two chambers separated by a semi-permeable membrane.
 * Water molecules (blue dots) and solute molecules (red dots).
 * Add/remove solute to each chamber; water moves toward higher
 * solute concentration by osmosis. A cell in the right chamber
 * swells (hypotonic), shrinks (hypertonic), or stays normal (isotonic).
 * Toggle animal / plant cell (plant cell wall prevents bursting).
 *
 * Discoveries:
 *   'hypotonic-swell'  - cell swells in hypotonic solution
 *   'hypertonic-shrink' - cell shrinks in hypertonic solution
 *   'isotonic-balance' - cell remains normal in isotonic solution
 *   'plant-wall'       - plant cell doesn't burst in hypotonic
 */

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const WATER_COLOR = 'rgba(96,165,250,0.7)'
const SOLUTE_COLOR = 'rgba(251,146,60,0.75)'
const SOLUTE_STROKE = 'rgba(251,146,60,0.4)'

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function OsmosisLab({
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
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const sizeRef = useRef({ width: 600, height: 400, scale: 1 })
  const rafRef = useRef(null)
  const stateRef = useRef(null)
  const discoveredRef = useRef(new Set())

  const [cellMode, setCellMode] = useState('animal') // 'animal' | 'plant'
  const [leftSolute, setLeftSolute] = useState(5)
  const [rightSolute, setRightSolute] = useState(5)
  const [toast, setToast] = useState(null)

  // Refs for animation loop access
  const cellModeRef = useRef(cellMode)
  cellModeRef.current = cellMode
  const leftSoluteRef = useRef(leftSolute)
  leftSoluteRef.current = leftSolute
  const rightSoluteRef = useRef(rightSolute)
  rightSoluteRef.current = rightSolute

  /* ---------- Discovery helper ---------- */
  const triggerDiscovery = useCallback((id) => {
    if (discoveredRef.current.has(id)) return
    discoveredRef.current.add(id)
    setToast(id)
    setTimeout(() => setToast(null), 3000)
    if (onDiscovery) onDiscovery(id)
  }, [onDiscovery])

  /* ---------- Initialise simulation state ---------- */
  const initState = useCallback(() => {
    const { width, height } = sizeRef.current
    const memX = width * 0.5
    const waterCount = 80
    const waters = []

    for (let i = 0; i < waterCount; i++) {
      const side = i < waterCount / 2 ? 'left' : 'right'
      waters.push({
        x: side === 'left'
          ? 10 + Math.random() * (memX - 30)
          : memX + 20 + Math.random() * (width - memX - 30),
        y: 20 + Math.random() * (height - 40),
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        side,
      })
    }

    const solutes = { left: [], right: [] }
    for (let i = 0; i < leftSoluteRef.current; i++) {
      solutes.left.push({
        x: 20 + Math.random() * (memX - 50),
        y: 30 + Math.random() * (height - 60),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      })
    }
    for (let i = 0; i < rightSoluteRef.current; i++) {
      solutes.right.push({
        x: memX + 25 + Math.random() * (width - memX - 55),
        y: 30 + Math.random() * (height - 60),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      })
    }

    stateRef.current = {
      waters,
      solutes,
      cellSize: 1.0,
      turgorPressure: 0,
      lysed: false,
      plasmolyzed: false,
    }
  }, [])

  /* ---------- Rebuild solutes when counts change ---------- */
  useEffect(() => {
    if (!stateRef.current) return
    const { width, height } = sizeRef.current
    const memX = width * 0.5
    const solutes = { left: [], right: [] }

    for (let i = 0; i < leftSolute; i++) {
      solutes.left.push({
        x: 20 + Math.random() * (memX - 50),
        y: 30 + Math.random() * (height - 60),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      })
    }
    for (let i = 0; i < rightSolute; i++) {
      solutes.right.push({
        x: memX + 25 + Math.random() * (width - memX - 55),
        y: 30 + Math.random() * (height - 60),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      })
    }
    stateRef.current.solutes = solutes
    stateRef.current.lysed = false
    stateRef.current.plasmolyzed = false
    stateRef.current.cellSize = 1.0
  }, [leftSolute, rightSolute])

  /* ---------- Resize observer ---------- */
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const cw = e.contentRect.width
        if (cw === 0) continue
        const ch = Math.max(280, Math.min(420, cw * 0.6))
        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.round(cw * dpr)
        canvas.height = Math.round(ch * dpr)
        canvas.style.width = `${cw}px`
        canvas.style.height = `${ch}px`
        sizeRef.current = { width: cw, height: ch, scale: dpr }
      }
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  /* ---------- Init on mount ---------- */
  useEffect(() => { initState() }, [initState])

  /* ---------- Animation loop ---------- */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true
    let frame = 0

    const render = () => {
      if (!running) return
      const { width, height, scale } = sizeRef.current
      const state = stateRef.current
      if (!state) { rafRef.current = requestAnimationFrame(render); return }

      const memX = width * 0.5
      const ls = leftSoluteRef.current
      const rs = rightSoluteRef.current
      const isPlant = cellModeRef.current === 'plant'
      frame++

      ctx.save()
      ctx.scale(scale || 1, scale || 1)
      ctx.clearRect(0, 0, width, height)

      /* -- Background -- */
      ctx.fillStyle = '#070b14'
      ctx.fillRect(0, 0, width, height)

      /* -- Chamber labels -- */
      ctx.font = '11px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(148,163,184,0.5)'
      ctx.fillText('LEFT CHAMBER', memX / 2, 16)
      ctx.fillText('RIGHT CHAMBER', memX + (width - memX) / 2, 16)

      /* -- Solute count labels -- */
      ctx.font = '10px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(251,146,60,0.6)'
      ctx.fillText('Solute: ' + ls, memX / 2, height - 8)
      ctx.fillText('Solute: ' + rs, memX + (width - memX) / 2, height - 8)

      /* -- Semi-permeable membrane -- */
      ctx.setLineDash([6, 4])
      ctx.strokeStyle = 'rgba(14,165,233,0.5)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(memX, 0)
      ctx.lineTo(memX, height)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.font = '8px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(14,165,233,0.4)'
      ctx.save()
      ctx.translate(memX + 10, height / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText('Semi-permeable Membrane', 0, 0)
      ctx.restore()

      /* -- Osmotic bias -- */
      const diff = rs - ls
      const osmoticBias = diff * 0.003

      /* -- Update waters -- */
      let leftWater = 0
      let rightWater = 0

      for (const w of state.waters) {
        w.vx += (Math.random() - 0.5) * 0.3
        w.vy += (Math.random() - 0.5) * 0.3
        if (w.side === 'left' && diff > 0) w.vx += osmoticBias
        else if (w.side === 'right' && diff < 0) w.vx -= osmoticBias
        w.vx *= 0.97; w.vy *= 0.97
        const spd = Math.sqrt(w.vx * w.vx + w.vy * w.vy)
        if (spd > 2) { w.vx = (w.vx / spd) * 2; w.vy = (w.vy / spd) * 2 }
        w.x += w.vx; w.y += w.vy

        if (w.y < 3) { w.y = 3; w.vy *= -0.8 }
        if (w.y > height - 3) { w.y = height - 3; w.vy *= -0.8 }

        if (w.side === 'left') {
          if (w.x < 3) { w.x = 3; w.vx *= -0.8 }
          if (w.x > memX) {
            if (Math.random() < 0.3 + osmoticBias) { w.side = 'right' }
            else { w.x = memX - 3; w.vx *= -0.8 }
          }
        } else {
          if (w.x > width - 3) { w.x = width - 3; w.vx *= -0.8 }
          if (w.x < memX) {
            if (Math.random() < 0.3 - osmoticBias) { w.side = 'left' }
            else { w.x = memX + 3; w.vx *= -0.8 }
          }
        }

        if (w.side === 'left') leftWater++; else rightWater++

        ctx.beginPath()
        ctx.arc(w.x, w.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = WATER_COLOR
        ctx.fill()
      }

      /* -- Update solutes (cannot cross) -- */
      for (const side of ['left', 'right']) {
        for (const s of state.solutes[side]) {
          s.vx += (Math.random() - 0.5) * 0.2
          s.vy += (Math.random() - 0.5) * 0.2
          s.vx *= 0.95; s.vy *= 0.95
          s.x += s.vx; s.y += s.vy

          if (s.y < 5) { s.y = 5; s.vy *= -0.8 }
          if (s.y > height - 5) { s.y = height - 5; s.vy *= -0.8 }
          if (side === 'left') {
            if (s.x < 5) { s.x = 5; s.vx *= -0.8 }
            if (s.x > memX - 5) { s.x = memX - 5; s.vx *= -0.8 }
          } else {
            if (s.x < memX + 5) { s.x = memX + 5; s.vx *= -0.8 }
            if (s.x > width - 5) { s.x = width - 5; s.vx *= -0.8 }
          }

          ctx.beginPath()
          ctx.arc(s.x, s.y, 4.5, 0, Math.PI * 2)
          ctx.fillStyle = SOLUTE_COLOR
          ctx.fill()
          ctx.strokeStyle = SOLUTE_STROKE
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      /* -- Cell in right chamber -- */
      const cellCx = memX + (width - memX) / 2
      const cellCy = height / 2
      const baseRx = 55, baseRy = 40

      const waterRatio = rightWater / Math.max(1, leftWater + rightWater)
      const targetSize = 0.6 + waterRatio * 0.8
      state.cellSize += (targetSize - state.cellSize) * 0.02

      let cellRx = baseRx * state.cellSize
      let cellRy = baseRy * state.cellSize

      /* Plant cell logic */
      if (isPlant) {
        state.turgorPressure = Math.max(0, (state.cellSize - 1.0) * 100)
        const maxSize = 1.25
        if (state.cellSize > maxSize) state.cellSize = maxSize
        cellRx = baseRx * state.cellSize
        cellRy = baseRy * state.cellSize
        state.lysed = false
        state.plasmolyzed = state.cellSize < 0.8
      } else {
        if (state.cellSize > 1.4) state.lysed = true
        state.turgorPressure = 0
      }

      /* Draw cell */
      if (state.lysed) {
        ctx.setLineDash([3, 3])
        ctx.strokeStyle = 'rgba(239,68,68,0.5)'
        ctx.lineWidth = 1.5
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const fr = 20 + Math.random() * 15
          ctx.beginPath()
          ctx.arc(cellCx + Math.cos(angle) * fr, cellCy + Math.sin(angle) * fr, 8, angle - 0.5, angle + 0.5)
          ctx.stroke()
        }
        ctx.setLineDash([])
        ctx.font = '12px system-ui'; ctx.fillStyle = '#ef4444'; ctx.textAlign = 'center'
        ctx.fillText('LYSIS!', cellCx, cellCy + 50)
        ctx.font = '9px system-ui'; ctx.fillStyle = '#94a3b8'
        ctx.fillText('Cell has burst from excess water', cellCx, cellCy + 64)
      } else {
        if (isPlant) {
          ctx.strokeStyle = 'rgba(34,197,94,0.5)'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.ellipse(cellCx, cellCy, baseRx * 1.25, baseRy * 1.25, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.font = '7px system-ui'; ctx.fillStyle = 'rgba(34,197,94,0.4)'; ctx.textAlign = 'center'
          ctx.fillText('Cell Wall', cellCx, cellCy - baseRy * 1.25 - 6)
        }

        ctx.fillStyle = isPlant ? 'rgba(34,197,94,0.1)' : 'rgba(14,165,233,0.1)'
        ctx.strokeStyle = isPlant ? 'rgba(34,197,94,0.6)' : 'rgba(14,165,233,0.6)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(cellCx, cellCy, cellRx, cellRy, 0, 0, Math.PI * 2)
        ctx.fill(); ctx.stroke()

        if (state.plasmolyzed) {
          ctx.font = '9px system-ui'; ctx.fillStyle = '#f59e0b'; ctx.textAlign = 'center'
          ctx.fillText('Plasmolyzed', cellCx, cellCy + baseRy * 1.25 + 14)
        }

        let tonicityLabel = 'Isotonic'; let tonicityColor = '#10b981'
        if (rs > ls + 2) { tonicityLabel = 'Hypertonic outside'; tonicityColor = '#f59e0b' }
        else if (rs < ls - 2) { tonicityLabel = 'Hypotonic outside'; tonicityColor = '#3b82f6' }
        ctx.font = '10px system-ui'; ctx.fillStyle = tonicityColor; ctx.textAlign = 'center'
        ctx.fillText(tonicityLabel, cellCx, cellCy + baseRy * 1.25 + 28)

        /* Water flow arrows */
        if (Math.abs(diff) > 1 && frame % 30 < 20) {
          ctx.strokeStyle = 'rgba(96,165,250,0.6)'; ctx.fillStyle = 'rgba(96,165,250,0.6)'; ctx.lineWidth = 2
          if (diff > 0) {
            const ax = memX + 15
            ctx.beginPath(); ctx.moveTo(ax, cellCy); ctx.lineTo(ax + 25, cellCy); ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(ax + 25, cellCy - 4); ctx.lineTo(ax + 30, cellCy); ctx.lineTo(ax + 25, cellCy + 4); ctx.fill()
            ctx.font = '8px system-ui'; ctx.textAlign = 'center'
            ctx.fillText('H\u2082O', ax + 15, cellCy - 8)
          } else if (diff < 0) {
            const ax = memX - 15
            ctx.beginPath(); ctx.moveTo(ax, cellCy); ctx.lineTo(ax - 25, cellCy); ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(ax - 25, cellCy - 4); ctx.lineTo(ax - 30, cellCy); ctx.lineTo(ax - 25, cellCy + 4); ctx.fill()
            ctx.font = '8px system-ui'; ctx.textAlign = 'center'
            ctx.fillText('H\u2082O', ax - 15, cellCy - 8)
          }
        }
      }

      /* Turgor gauge (plant mode) */
      if (isPlant && !state.lysed) {
        const gx = width - 70, gy = 35, gh = height * 0.4
        const pressure = Math.min(100, state.turgorPressure)
        ctx.fillStyle = 'rgba(15,23,42,0.8)'; ctx.strokeStyle = 'rgba(51,65,85,0.4)'; ctx.lineWidth = 1
        ctx.beginPath(); ctx.roundRect(gx - 15, gy - 10, 45, gh + 30, 6); ctx.fill(); ctx.stroke()
        ctx.font = '8px system-ui'; ctx.fillStyle = 'rgba(148,163,184,0.6)'; ctx.textAlign = 'center'
        ctx.fillText('Turgor', gx + 7, gy + 2)
        ctx.fillStyle = 'rgba(30,41,59,0.6)'; ctx.fillRect(gx, gy + 8, 15, gh)
        const fH = (pressure / 100) * gh
        const gc = pressure > 70 ? '#22c55e' : pressure > 30 ? '#f59e0b' : '#ef4444'
        ctx.fillStyle = gc + '80'; ctx.fillRect(gx, gy + 8 + gh - fH, 15, fH)
        ctx.font = 'bold 9px monospace'; ctx.fillStyle = gc; ctx.fillText(Math.round(pressure) + '%', gx + 7, gy + gh + 22)
      }

      /* Water level bars */
      const barW = 10, barMaxH = height * 0.35
      const lH = (leftWater / Math.max(1, leftWater + rightWater)) * barMaxH
      const rH = (rightWater / Math.max(1, leftWater + rightWater)) * barMaxH
      // Left
      ctx.fillStyle = 'rgba(30,41,59,0.4)'; ctx.fillRect(6, 26, barW, barMaxH)
      ctx.fillStyle = 'rgba(56,189,248,0.5)'; ctx.fillRect(6, 26 + barMaxH - lH, barW, lH)
      ctx.font = '8px monospace'; ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'center'
      ctx.fillText(String(leftWater), 11, 23)
      // Right
      ctx.fillStyle = 'rgba(30,41,59,0.4)'; ctx.fillRect(width - 16, 26, barW, barMaxH)
      ctx.fillStyle = 'rgba(56,189,248,0.5)'; ctx.fillRect(width - 16, 26 + barMaxH - rH, barW, rH)
      ctx.fillText(String(rightWater), width - 11, 23)

      ctx.restore()

      /* -- Discovery checks -- */
      if (frame % 90 === 0) {
        if (state.cellSize > 1.15 && !state.lysed) {
          triggerDiscovery('hypotonic-swell')
          if (isPlant && state.cellSize < state.cellSize + 0.01) triggerDiscovery('plant-wall')
        }
        if (state.cellSize < 0.85) triggerDiscovery('hypertonic-shrink')
        if (state.cellSize >= 0.92 && state.cellSize <= 1.08) triggerDiscovery('isotonic-balance')
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => { running = false; if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [triggerDiscovery])

  /* ---------- Reset ---------- */
  const handleReset = useCallback(() => {
    setLeftSolute(5); setRightSolute(5)
    discoveredRef.current.clear()
    setTimeout(() => initState(), 50)
  }, [initState])

  /* ---------- Toast messages ---------- */
  const toastMsg = {
    'hypotonic-swell': 'Cell swells in hypotonic solution \u2014 water enters by osmosis!',
    'hypertonic-shrink': 'Cell shrinks (crenation) in hypertonic solution \u2014 water leaves!',
    'isotonic-balance': 'Cell stays normal in isotonic solution \u2014 balanced water flow!',
    'plant-wall': 'Plant cell wall prevents bursting \u2014 turgor pressure maintained!',
  }

  /* ---------- UI ---------- */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 uppercase tracking-wider">Osmosis Lab</span>
        <div className="flex items-center gap-3">
          {/* Cell type toggle */}
          <div className="flex rounded-lg overflow-hidden border border-slate-700/40">
            <button onClick={() => setCellMode('animal')}
              className={`px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${
                cellMode === 'animal' ? 'bg-indigo-600/80 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}>
              {'\uD83E\uDDA0'} Animal
            </button>
            <button onClick={() => setCellMode('plant')}
              className={`px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${
                cellMode === 'plant' ? 'bg-emerald-600/80 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}>
              {'\uD83C\uDF3F'} Plant
            </button>
          </div>
          <button onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
            {'\u21BA'}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40"
        style={{ minHeight: 280, maxHeight: 420 }}>
        <canvas ref={canvasRef} className="block w-full touch-none" />
        {toast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 backdrop-blur-sm z-10 animate-pulse">
            <span className="text-amber-400 text-sm">{'\u2728'}</span>
            <span className="text-xs text-amber-200 font-medium">{toastMsg[toast]}</span>
          </div>
        )}
      </div>

      {/* Solute controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left chamber */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Left Chamber Solute</h4>
          <div className="flex items-center gap-3">
            <button onClick={() => setLeftSolute((s) => Math.max(0, s - 1))} disabled={leftSolute === 0}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer font-bold">
              {'\u2212'}
            </button>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-400/70 inline-block" />
              <span className="font-mono text-sm font-semibold text-orange-300 tabular-nums w-6 text-center">{leftSolute}</span>
            </div>
            <button onClick={() => setLeftSolute((s) => Math.min(15, s + 1))} disabled={leftSolute >= 15}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer font-bold">
              +
            </button>
          </div>
        </div>
        {/* Right chamber */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Right Chamber Solute</h4>
          <div className="flex items-center gap-3">
            <button onClick={() => setRightSolute((s) => Math.max(0, s - 1))} disabled={rightSolute === 0}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer font-bold">
              {'\u2212'}
            </button>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-orange-400/70 inline-block" />
              <span className="font-mono text-sm font-semibold text-orange-300 tabular-nums w-6 text-center">{rightSolute}</span>
            </div>
            <button onClick={() => setRightSolute((s) => Math.min(15, s + 1))} disabled={rightSolute >= 15}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer font-bold">
              +
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Adjust solute concentration in each chamber. Water (blue) moves toward higher solute
        concentration. The cell in the right chamber responds to osmotic pressure.
        {cellMode === 'plant'
          ? ' Plant cell wall prevents bursting but can plasmolyze.'
          : ' Animal cells may lyse (burst) if too much water enters.'}
      </p>
    </div>
  )
}
