import { useState, useCallback, useRef, useEffect, useMemo } from 'react'

/**
 * BondPolarity - Canvas-based simulation showing how electron clouds shift
 * between two atoms based on electronegativity difference.
 *
 * Features:
 * - Two atoms displayed as circles with element symbols
 * - Electron cloud (gradient) shifts toward more electronegative atom
 * - Shows delta+/delta- partial charge labels
 * - Classifies bond: nonpolar covalent (<0.5), polar covalent (0.5-1.7), ionic (>1.7)
 * - User selects two elements from a palette
 * - Animated electron dots orbiting in the cloud
 *
 * Discoveries: 'nonpolar-bond', 'polar-bond', 'ionic-bond'
 */

// ---------- Data ----------

const ELEMENTS = [
  { symbol: 'H',  name: 'Hydrogen',  en: 2.1, color: '#60a5fa' },
  { symbol: 'C',  name: 'Carbon',    en: 2.5, color: '#94a3b8' },
  { symbol: 'N',  name: 'Nitrogen',  en: 3.0, color: '#818cf8' },
  { symbol: 'O',  name: 'Oxygen',    en: 3.5, color: '#f87171' },
  { symbol: 'F',  name: 'Fluorine',  en: 4.0, color: '#fbbf24' },
  { symbol: 'Na', name: 'Sodium',    en: 0.9, color: '#c084fc' },
  { symbol: 'Cl', name: 'Chlorine',  en: 3.0, color: '#4ade80' },
]

/** Classify a bond by electronegativity difference */
function classifyBond(deltaEN) {
  if (deltaEN < 0.5) return { label: 'Nonpolar Covalent', color: '#60a5fa', key: 'nonpolar-bond' }
  if (deltaEN <= 1.7) return { label: 'Polar Covalent', color: '#fbbf24', key: 'polar-bond' }
  return { label: 'Ionic', color: '#f87171', key: 'ionic-bond' }
}

// ---------- Component ----------

function BondPolarity({
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
  const [leftIdx, setLeftIdx] = useState(5)   // Na
  const [rightIdx, setRightIdx] = useState(6)  // Cl
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const sizeRef = useRef({ width: 600, height: 340, scale: 1 })
  const rafRef = useRef(null)
  const timeRef = useRef(0)
  const discoveredRef = useRef(new Set(discoveredSet || []))

  // Keep discovered ref in sync with prop
  useEffect(() => {
    discoveredRef.current = new Set(discoveredSet || [])
  }, [discoveredSet])

  const leftEl = ELEMENTS[leftIdx]
  const rightEl = ELEMENTS[rightIdx]
  const deltaEN = useMemo(() => Math.abs(leftEl.en - rightEl.en), [leftEl, rightEl])
  const classification = useMemo(() => classifyBond(deltaEN), [deltaEN])
  const moreEN = leftEl.en > rightEl.en ? 'left' : rightEl.en > leftEl.en ? 'right' : 'equal'

  // Fire discovery when bond type changes
  useEffect(() => {
    if (onDiscovery && classification.key && !discoveredRef.current.has(classification.key)) {
      onDiscovery(classification.key)
    }
  }, [classification.key, onDiscovery])

  // Check completion: all three bond types discovered
  useEffect(() => {
    const needed = ['nonpolar-bond', 'polar-bond', 'ionic-bond']
    const disc = discoveredSet || new Set()
    if (needed.every(k => disc.has ? disc.has(k) : false)) {
      if (onComplete && !isComplete) onComplete()
    }
  }, [discoveredSet, onComplete, isComplete])

  // ---------- Canvas resize observer ----------
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        if (width === 0) continue
        const height = Math.max(260, Math.min(400, width * 0.5))
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

  // ---------- Canvas render loop ----------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true

    const render = () => {
      if (!running) return
      const { width, height, scale } = sizeRef.current
      if (width === 0) { rafRef.current = requestAnimationFrame(render); return }

      timeRef.current += 0.018

      ctx.save()
      ctx.scale(scale, scale)
      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = 'rgba(10, 14, 26, 0.7)'
      ctx.fillRect(0, 0, width, height)

      const cx = width / 2
      const cy = height * 0.40
      const atomRadius = Math.min(42, width * 0.065)
      const bondLen = Math.min(220, width * 0.32)
      const leftX = cx - bondLen / 2
      const rightX = cx + bondLen / 2

      // ---- Electron cloud (gradient shifted toward more EN atom) ----
      const shift = moreEN === 'left' ? -1 : moreEN === 'right' ? 1 : 0
      const shiftAmount = (deltaEN / 4) * bondLen * 0.35
      const cloudCx = cx + shift * shiftAmount
      const cloudRx = bondLen * 0.58 + Math.sin(timeRef.current) * 3
      const cloudRy = cloudRx * 0.55

      const cloudGrad = ctx.createRadialGradient(cloudCx, cy, 0, cloudCx, cy, cloudRx)
      const intensityBase = 0.08 + (deltaEN / 4) * 0.12
      cloudGrad.addColorStop(0, `rgba(96, 165, 250, ${intensityBase + 0.08})`)
      cloudGrad.addColorStop(0.5, `rgba(96, 165, 250, ${intensityBase * 0.5})`)
      cloudGrad.addColorStop(1, 'rgba(96, 165, 250, 0)')
      ctx.fillStyle = cloudGrad
      ctx.beginPath()
      ctx.ellipse(cloudCx, cy, cloudRx, cloudRy, 0, 0, Math.PI * 2)
      ctx.fill()

      // ---- Animated electron dots within the cloud ----
      const numDots = 10
      for (let i = 0; i < numDots; i++) {
        const angle = (timeRef.current * 0.6 + i * (Math.PI * 2) / numDots) % (Math.PI * 2)
        const rFactor = 0.3 + 0.2 * Math.sin(timeRef.current * 0.8 + i * 1.3)
        const ex = cloudCx + cloudRx * rFactor * Math.cos(angle)
        const ey = cy + cloudRy * rFactor * Math.sin(angle)
        const alpha = 0.25 + 0.2 * Math.sin(timeRef.current + i * 0.9)
        ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`
        ctx.beginPath()
        ctx.arc(ex, ey, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // ---- Bond line ----
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(leftX + atomRadius, cy)
      ctx.lineTo(rightX - atomRadius, cy)
      ctx.stroke()

      // If ionic, draw dashed line instead
      if (deltaEN > 1.7) {
        ctx.setLineDash([6, 4])
        ctx.strokeStyle = '#f8717180'
        ctx.beginPath()
        ctx.moveTo(leftX + atomRadius, cy)
        ctx.lineTo(rightX - atomRadius, cy)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // ---- Draw atom helper ----
      const drawAtom = (x, el) => {
        const grad = ctx.createRadialGradient(x - atomRadius * 0.2, cy - atomRadius * 0.2, 0, x, cy, atomRadius)
        grad.addColorStop(0, el.color + 'a0')
        grad.addColorStop(1, el.color + '20')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(x, cy, atomRadius, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = el.color + '70'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Symbol
        ctx.fillStyle = '#ffffff'
        ctx.font = `bold ${Math.round(atomRadius * 0.65)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(el.symbol, x, cy)
      }

      drawAtom(leftX, leftEl)
      drawAtom(rightX, rightEl)

      // ---- Partial charges (delta+ / delta-) ----
      if (deltaEN >= 0.1 && moreEN !== 'equal') {
        const plusSide = moreEN === 'right' ? leftX : rightX
        const minusSide = moreEN === 'right' ? rightX : leftX
        ctx.font = `bold ${Math.round(atomRadius * 0.45)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#f87171'
        ctx.fillText('\u03B4+', plusSide, cy - atomRadius - 14)
        ctx.fillStyle = '#60a5fa'
        ctx.fillText('\u03B4\u2212', minusSide, cy - atomRadius - 14)
      }

      // ---- EN values under atoms ----
      ctx.font = '11px sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.textAlign = 'center'
      ctx.fillText(`EN = ${leftEl.en.toFixed(1)}`, leftX, cy + atomRadius + 22)
      ctx.fillText(`EN = ${rightEl.en.toFixed(1)}`, rightX, cy + atomRadius + 22)

      // ---- Classification bar at bottom ----
      const barY = height - 55
      const barW = width - 80
      const barX = 40
      const barH = 12

      // Three zones
      const zones = [
        { frac: 0.5 / 4, color: '#1e40af40', label: 'Nonpolar' },
        { frac: 1.7 / 4, color: '#92400e40', label: 'Polar' },
        { frac: 1.0, color: '#7f1d1d40', label: 'Ionic' },
      ]
      let prev = 0
      zones.forEach((z) => {
        const sx = barX + prev * barW
        const sw = (z.frac - prev) * barW
        ctx.fillStyle = z.color
        ctx.fillRect(sx, barY, sw, barH)
        prev = z.frac
      })

      // Bar outline
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 1
      ctx.strokeRect(barX, barY, barW, barH)

      // Marker triangle
      const markerX = barX + Math.min(deltaEN / 4, 1) * barW
      ctx.fillStyle = classification.color
      ctx.beginPath()
      ctx.moveTo(markerX, barY - 3)
      ctx.lineTo(markerX - 5, barY - 12)
      ctx.lineTo(markerX + 5, barY - 12)
      ctx.closePath()
      ctx.fill()

      // Delta EN label
      ctx.font = 'bold 13px sans-serif'
      ctx.fillStyle = classification.color
      ctx.textAlign = 'center'
      ctx.fillText(`\u0394EN = ${deltaEN.toFixed(2)}  \u2014  ${classification.label}`, cx, barY - 20)

      // Tick labels
      ctx.font = '9px sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.textAlign = 'left'
      ctx.fillText('0', barX, barY + barH + 14)
      ctx.textAlign = 'center'
      ctx.fillText('0.5', barX + (0.5 / 4) * barW, barY + barH + 14)
      ctx.fillText('1.7', barX + (1.7 / 4) * barW, barY + barH + 14)
      ctx.textAlign = 'right'
      ctx.fillText('4.0', barX + barW, barY + barH + 14)

      ctx.restore()
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [leftEl, rightEl, deltaEN, moreEN, classification])

  // ---------- Element palette button ----------
  const PaletteButton = useCallback(({ el, idx, selected, onSelect }) => (
    <button
      onClick={() => onSelect(idx)}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
        selected
          ? 'bg-indigo-600/30 border-indigo-500/60 text-white ring-1 ring-indigo-400/30'
          : 'bg-slate-800/60 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:border-slate-600'
      }`}
    >
      <span className="font-bold" style={{ color: el.color }}>{el.symbol}</span>
      <span className="ml-1 text-[10px] text-slate-500">{el.en}</span>
    </button>
  ), [])

  return (
    <div className="space-y-3">
      {/* Element A selector */}
      <div className="space-y-1.5">
        <span className="text-xs text-slate-400 font-medium">Element A:</span>
        <div className="flex flex-wrap gap-1.5">
          {ELEMENTS.map((el, i) => (
            <PaletteButton key={el.symbol + '-A'} el={el} idx={i} selected={i === leftIdx} onSelect={setLeftIdx} />
          ))}
        </div>
      </div>

      {/* Element B selector */}
      <div className="space-y-1.5">
        <span className="text-xs text-slate-400 font-medium">Element B:</span>
        <div className="flex flex-wrap gap-1.5">
          {ELEMENTS.map((el, i) => (
            <PaletteButton key={el.symbol + '-B'} el={el} idx={i} selected={i === rightIdx} onSelect={setRightIdx} />
          ))}
        </div>
      </div>

      {/* Canvas visualization */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl bg-slate-900/80 border border-slate-700/40"
        style={{ minHeight: 260 }}
      >
        <canvas ref={canvasRef} className="block w-full" />
      </div>

      {/* Readout cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: `EN (${leftEl.symbol})`, value: leftEl.en.toFixed(1), color: leftEl.color },
          { label: `EN (${rightEl.symbol})`, value: rightEl.en.toFixed(1), color: rightEl.color },
          { label: '\u0394EN', value: deltaEN.toFixed(2), color: classification.color },
          { label: 'Bond Type', value: classification.label, color: classification.color },
        ].map((card) => (
          <div key={card.label} className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">{card.label}</span>
            <span className="text-sm font-bold" style={{ color: card.color }}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
        <p className="text-xs text-slate-400 leading-relaxed">
          {moreEN === 'equal'
            ? 'Both atoms share the same electronegativity. The electron cloud is shared equally \u2014 a nonpolar covalent bond.'
            : `${moreEN === 'left' ? leftEl.name : rightEl.name} (EN ${Math.max(leftEl.en, rightEl.en).toFixed(1)}) pulls the electron cloud toward itself. `}
          {deltaEN < 0.5 && moreEN !== 'equal' && 'The difference is small enough for a nonpolar covalent bond (\u0394EN < 0.5).'}
          {deltaEN >= 0.5 && deltaEN <= 1.7 && 'This creates a polar covalent bond (0.5 \u2264 \u0394EN \u2264 1.7) with partial charges.'}
          {deltaEN > 1.7 && 'The large difference means near-complete electron transfer \u2014 an ionic bond (\u0394EN > 1.7).'}
        </p>
      </div>

      {/* Discovery tracker */}
      <div className="flex gap-2 flex-wrap">
        {['nonpolar-bond', 'polar-bond', 'ionic-bond'].map((key) => {
          const found = discoveredSet && (discoveredSet.has ? discoveredSet.has(key) : false)
          const labels = { 'nonpolar-bond': 'Nonpolar', 'polar-bond': 'Polar', 'ionic-bond': 'Ionic' }
          return (
            <span
              key={key}
              className={`px-2 py-1 rounded text-[10px] font-medium border ${
                found
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-700/30 text-slate-600'
              }`}
            >
              {found ? '\u2713 ' : '\u25CB '}{labels[key]}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default BondPolarity
