import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * MembraneTransport - Canvas-based cell membrane transport simulation.
 *
 * Cross-section of cell membrane (phospholipid bilayer drawn as two rows
 * of circles with tails). Particles on both sides exhibit Brownian motion.
 * Small nonpolar molecules (O2, CO2) cross freely. Large/charged molecules
 * (glucose, Na+) bounce off unless channel proteins are open.
 *
 * Discoveries:
 *   'free-diffusion'  - O2 crosses the membrane
 *   'channel-needed'  - glucose blocked, then crosses with channel open
 *   'equilibrium'     - concentrations equalise on both sides
 */

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PARTICLE_TYPES = {
  o2:      { label: 'O\u2082',      color: '#e2e8f0', radius: 3,   canCross: true,  channel: null,      charge: null },
  co2:     { label: 'CO\u2082',     color: '#cbd5e1', radius: 3.5, canCross: true,  channel: null,      charge: null },
  glucose: { label: 'Glucose',      color: '#fbbf24', radius: 5,   canCross: false, channel: 'glucose', charge: null },
  na:      { label: 'Na\u207A',     color: '#ef4444', radius: 4,   canCross: false, channel: 'na',      charge: '+' },
}

const CHANNEL_DEFS = {
  glucose: { label: 'Glucose Channel', color: '#fbbf24' },
  na:      { label: 'Na\u207A Channel', color: '#ef4444' },
}

const DEFAULT_COUNTS = {
  top:    { o2: 8, co2: 6, glucose: 5, na: 5 },
  bottom: { o2: 2, co2: 2, glucose: 1, na: 1 },
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function createParticle(type, side, w, h) {
  const memY = h * 0.5
  const margin = 15
  return {
    id: Math.random().toString(36).slice(2, 10),
    type,
    x: margin + Math.random() * (w - margin * 2),
    y: side === 'top'
      ? margin + Math.random() * (memY - margin * 2 - 20)
      : memY + 20 + Math.random() * (h - memY - margin - 20),
    vx: (Math.random() - 0.5) * 1.4,
    vy: (Math.random() - 0.5) * 1.4,
    side,
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MembraneTransport({
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
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const discoveredRef = useRef(new Set())

  const [channels, setChannels] = useState({ glucose: false, na: false })
  const [counts, setCounts] = useState(DEFAULT_COUNTS)
  const [toast, setToast] = useState(null)

  const channelsRef = useRef(channels)
  channelsRef.current = channels

  /* ---------- Discovery helper ---------- */
  const triggerDiscovery = useCallback((id) => {
    if (discoveredRef.current.has(id)) return
    discoveredRef.current.add(id)
    setToast(id)
    setTimeout(() => setToast(null), 2800)
    if (onDiscovery) onDiscovery(id)
  }, [onDiscovery])

  /* ---------- Particle init ---------- */
  const initParticles = useCallback(() => {
    const { width, height } = sizeRef.current
    const ps = []
    for (const side of ['top', 'bottom']) {
      const sc = counts[side]
      for (const [type, count] of Object.entries(sc)) {
        for (let i = 0; i < count; i++) {
          ps.push(createParticle(type, side, width, height))
        }
      }
    }
    particlesRef.current = ps
  }, [counts])

  /* ---------- Add / remove particle ---------- */
  const addParticle = useCallback((side, type) => {
    const { width, height } = sizeRef.current
    particlesRef.current.push(createParticle(type, side, width, height))
    setCounts((prev) => ({
      ...prev,
      [side]: { ...prev[side], [type]: (prev[side][type] || 0) + 1 },
    }))
  }, [])

  const removeParticle = useCallback((side, type) => {
    const idx = particlesRef.current.findIndex((p) => p.type === type && p.side === side)
    if (idx >= 0) {
      particlesRef.current.splice(idx, 1)
      setCounts((prev) => ({
        ...prev,
        [side]: { ...prev[side], [type]: Math.max(0, (prev[side][type] || 0) - 1) },
      }))
    }
  }, [])

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
  useEffect(() => { initParticles() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- Animation loop ---------- */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true
    let frame = 0
    // Track O2 crossings and glucose blocks for discovery
    let o2Crossed = false
    let glucoseBlocked = false
    let glucoseCrossedWithChannel = false

    const render = () => {
      if (!running) return
      const { width, height, scale } = sizeRef.current
      const memY = height * 0.5
      const memT = 14 // membrane thickness
      const chs = channelsRef.current
      frame++

      ctx.save()
      ctx.scale(scale, scale)
      ctx.clearRect(0, 0, width, height)

      /* -- Background -- */
      ctx.fillStyle = '#070b14'
      ctx.fillRect(0, 0, width, height)

      /* -- Side labels -- */
      ctx.font = '11px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(148,163,184,0.45)'
      ctx.textAlign = 'left'
      ctx.fillText('EXTRACELLULAR (outside)', 8, 16)
      ctx.fillText('INTRACELLULAR (inside)', 8, height - 6)

      /* -- Membrane bilayer -- */
      ctx.fillStyle = 'rgba(14,165,233,0.12)'
      ctx.fillRect(0, memY - memT / 2, width, memT)

      // Phospholipid heads + tails
      ctx.strokeStyle = 'rgba(14,165,233,0.35)'
      ctx.lineWidth = 1
      for (let x = 8; x < width; x += 18) {
        // Top leaflet head
        ctx.beginPath()
        ctx.arc(x, memY - memT / 2 + 3, 3, 0, Math.PI * 2)
        ctx.stroke()
        // Top tail
        ctx.beginPath()
        ctx.moveTo(x, memY - memT / 2 + 6)
        ctx.lineTo(x, memY)
        ctx.stroke()
        // Bottom leaflet head
        ctx.beginPath()
        ctx.arc(x + 9, memY + memT / 2 - 3, 3, 0, Math.PI * 2)
        ctx.stroke()
        // Bottom tail
        ctx.beginPath()
        ctx.moveTo(x + 9, memY + memT / 2 - 6)
        ctx.lineTo(x + 9, memY)
        ctx.stroke()
      }

      /* -- Channel proteins -- */
      const channelXMap = { glucose: width * 0.35, na: width * 0.65 }
      for (const [chKey, chX] of Object.entries(channelXMap)) {
        const isOpen = chs[chKey]
        const def = CHANNEL_DEFS[chKey]
        const cW = 20, cH = memT + 12

        if (isOpen) {
          ctx.fillStyle = '#070b14'
          ctx.fillRect(chX - cW / 2, memY - cH / 2, cW, cH)
          ctx.strokeStyle = def.color
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(chX - cW / 2, memY - cH / 2)
          ctx.lineTo(chX - cW / 2, memY + cH / 2)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(chX + cW / 2, memY - cH / 2)
          ctx.lineTo(chX + cW / 2, memY + cH / 2)
          ctx.stroke()
          ctx.font = '7px system-ui'
          ctx.fillStyle = def.color
          ctx.textAlign = 'center'
          ctx.fillText(def.label, chX, memY - cH / 2 - 3)
        } else {
          ctx.fillStyle = 'rgba(51,65,85,0.5)'
          ctx.fillRect(chX - cW / 2, memY - cH / 2, cW, cH)
          ctx.strokeStyle = 'rgba(100,116,139,0.35)'
          ctx.lineWidth = 1
          ctx.strokeRect(chX - cW / 2, memY - cH / 2, cW, cH)
          ctx.font = '7px system-ui'
          ctx.fillStyle = 'rgba(100,116,139,0.45)'
          ctx.textAlign = 'center'
          ctx.fillText('CLOSED', chX, memY + 3)
        }
      }

      /* -- Update & draw particles -- */
      const particles = particlesRef.current
      for (const p of particles) {
        const pt = PARTICLE_TYPES[p.type]
        if (!pt) continue

        // Brownian motion
        p.vx += (Math.random() - 0.5) * 0.4
        p.vy += (Math.random() - 0.5) * 0.4
        p.vx *= 0.97
        p.vy *= 0.97
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 2) { p.vx = (p.vx / spd) * 2; p.vy = (p.vy / spd) * 2 }
        p.x += p.vx
        p.y += p.vy

        // Walls
        if (p.x < pt.radius) { p.x = pt.radius; p.vx *= -0.8 }
        if (p.x > width - pt.radius) { p.x = width - pt.radius; p.vx *= -0.8 }
        if (p.y < pt.radius) { p.y = pt.radius; p.vy *= -0.8 }
        if (p.y > height - pt.radius) { p.y = height - pt.radius; p.vy *= -0.8 }

        // Membrane interaction
        const atMem = Math.abs(p.y - memY) < memT / 2 + pt.radius
        if (atMem) {
          let canPass = false
          if (pt.canCross) {
            canPass = true
          } else if (pt.channel && chs[pt.channel]) {
            const chX = channelXMap[pt.channel]
            if (chX && Math.abs(p.x - chX) < 14) canPass = true
          }

          if (canPass) {
            // Track crossings for discovery
            if (p.side === 'top' && p.y > memY) {
              p.side = 'bottom'
              if (p.type === 'o2' || p.type === 'co2') o2Crossed = true
              if (p.type === 'glucose') glucoseCrossedWithChannel = true
            } else if (p.side === 'bottom' && p.y < memY) {
              p.side = 'top'
              if (p.type === 'o2' || p.type === 'co2') o2Crossed = true
              if (p.type === 'glucose') glucoseCrossedWithChannel = true
            }
          } else {
            // Bounce off
            if (p.side === 'top' && p.y > memY - memT / 2) {
              p.y = memY - memT / 2 - pt.radius
              p.vy *= -0.8
              if (p.type === 'glucose' || p.type === 'na') glucoseBlocked = true
            } else if (p.side === 'bottom' && p.y < memY + memT / 2) {
              p.y = memY + memT / 2 + pt.radius
              p.vy *= -0.8
              if (p.type === 'glucose' || p.type === 'na') glucoseBlocked = true
            }
          }
        }

        // Draw
        ctx.beginPath()
        ctx.arc(p.x, p.y, pt.radius, 0, Math.PI * 2)
        ctx.fillStyle = pt.color
        ctx.fill()

        // Charge label
        if (pt.charge) {
          ctx.font = `${pt.radius * 1.6}px system-ui`
          ctx.fillStyle = 'rgba(0,0,0,0.55)'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(pt.charge, p.x, p.y + 0.5)
        }
      }

      /* -- Concentration bars -- */
      const barW = 60, barH = 8, barX = width - barW - 12
      const topCount = particles.filter((p) => p.side === 'top').length
      const botCount = particles.filter((p) => p.side === 'bottom').length
      const total = topCount + botCount || 1
      // Top bar
      ctx.fillStyle = 'rgba(30,41,59,0.5)'
      ctx.fillRect(barX, 24, barW, barH)
      ctx.fillStyle = 'rgba(56,189,248,0.6)'
      ctx.fillRect(barX, 24, barW * (topCount / total), barH)
      ctx.font = '8px system-ui'
      ctx.fillStyle = '#94a3b8'
      ctx.textAlign = 'right'
      ctx.fillText(`${topCount}`, barX - 4, 31)
      // Bottom bar
      ctx.fillStyle = 'rgba(30,41,59,0.5)'
      ctx.fillRect(barX, height - 22, barW, barH)
      ctx.fillStyle = 'rgba(56,189,248,0.6)'
      ctx.fillRect(barX, height - 22, barW * (botCount / total), barH)
      ctx.fillText(`${botCount}`, barX - 4, height - 15)

      /* -- Discovery checks (every ~60 frames) -- */
      if (frame % 60 === 0) {
        if (o2Crossed) triggerDiscovery('free-diffusion')
        if (glucoseBlocked && glucoseCrossedWithChannel) triggerDiscovery('channel-needed')
        if (total > 8 && Math.abs(topCount - botCount) <= 2) triggerDiscovery('equilibrium')
      }

      ctx.restore()
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => { running = false; if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [triggerDiscovery])

  /* ---------- Reset ---------- */
  const handleReset = useCallback(() => {
    particlesRef.current = []
    setCounts({ ...DEFAULT_COUNTS })
    setChannels({ glucose: false, na: false })
    discoveredRef.current.clear()
    setTimeout(() => initParticles(), 50)
  }, [initParticles])

  /* ---------- Render ---------- */
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 uppercase tracking-wider">Membrane Transport</span>
        <button onClick={handleReset}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
          {'\u21BA'} Reset
        </button>
      </div>

      {/* Canvas */}
      <div ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40"
        style={{ minHeight: 280, maxHeight: 420 }}>
        <canvas ref={canvasRef} className="block w-full touch-none" />

        {/* Discovery toast */}
        {toast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 backdrop-blur-sm z-10 animate-pulse">
            <span className="text-amber-400 text-sm">{'\u2728'}</span>
            <span className="text-xs text-amber-200 font-medium">
              {toast === 'free-diffusion' && 'Small nonpolar molecules cross the membrane freely!'}
              {toast === 'channel-needed' && 'Large / charged molecules need a channel protein to cross!'}
              {toast === 'equilibrium' && 'Dynamic equilibrium reached \u2014 equal movement both ways!'}
            </span>
          </div>
        )}
      </div>

      {/* Particle controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['top', 'bottom'].map((side) => (
          <div key={side} className="space-y-2">
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {side === 'top' ? 'Extracellular (Outside)' : 'Intracellular (Inside)'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PARTICLE_TYPES).map(([type, pt]) => {
                const c = counts[side]?.[type] || 0
                return (
                  <div key={type} className="flex items-center gap-1">
                    <button onClick={() => removeParticle(side, type)} disabled={c === 0}
                      className="w-5 h-5 rounded flex items-center justify-center bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer text-xs">
                      {'\u2212'}
                    </button>
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pt.color }} />
                      <span className="text-[10px] text-slate-400">{pt.label}</span>
                      <span className="text-[10px] font-mono text-slate-500">{c}</span>
                    </div>
                    <button onClick={() => addParticle(side, type)} disabled={c >= 20}
                      className="w-5 h-5 rounded flex items-center justify-center bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer text-xs">
                      +
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Channel toggles */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Channel Proteins</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CHANNEL_DEFS).map(([key, def]) => (
            <button key={key}
              onClick={() => setChannels((prev) => ({ ...prev, [key]: !prev[key] }))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border"
              style={channels[key]
                ? { backgroundColor: def.color + '20', borderColor: def.color + '40', color: def.color }
                : { backgroundColor: 'rgba(30,41,59,0.4)', borderColor: 'rgba(51,65,85,0.4)', color: '#94a3b8' }
              }>
              <span className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: channels[key] ? def.color : '#475569' }} />
              {def.label}
              <span className="text-[10px] opacity-60">{channels[key] ? 'OPEN' : 'CLOSED'}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Small molecules (O{'\u2082'}, CO{'\u2082'}) cross freely. Glucose and Na{'\u207A'} need open channel proteins.
        Add particles and toggle channels to observe diffusion toward equilibrium.
      </p>
    </div>
  )
}
