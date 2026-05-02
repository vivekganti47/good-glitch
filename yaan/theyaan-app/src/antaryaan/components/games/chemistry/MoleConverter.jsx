import { useState, useCallback, useMemo, useEffect, useRef } from 'react'

/**
 * MoleConverter - SVG flow diagram showing conversions between
 * particles, moles, and grams.
 *
 * Features:
 * - Three stations: Particles <-> Moles <-> Grams
 * - Arrows with conversion factors (Avogadro's number, molar mass)
 * - User enters a value at any station, converted values appear with animated flow
 * - Element selector to change substance
 * - Animated particle dots flowing along conversion arrows
 *
 * Substances: H2O (18g/mol), CO2 (44g/mol), NaCl (58.5g/mol), O2 (32g/mol)
 * Avogadro = 6.022 x 10^23
 *
 * Discoveries: 'avogadro-link' (convert 1 mole to particles),
 *              'mass-mole-link' (convert grams to moles)
 *
 * No external dependencies beyond React.
 */

// ---------- Data ----------

const AVOGADRO = 6.022e23

const SUBSTANCES = [
  { name: 'Water', formula: 'H\u2082O', molarMass: 18, color: '#818cf8' },
  { name: 'Carbon Dioxide', formula: 'CO\u2082', molarMass: 44, color: '#94a3b8' },
  { name: 'Sodium Chloride', formula: 'NaCl', molarMass: 58.5, color: '#c084fc' },
  { name: 'Oxygen Gas', formula: 'O\u2082', molarMass: 32, color: '#f87171' },
]

/** Format a number in scientific notation when very large or small */
function formatSci(num) {
  if (num === 0 || num === null || isNaN(num)) return '0'
  if (Math.abs(num) >= 1e6 || (Math.abs(num) < 0.001 && num !== 0)) {
    return num.toExponential(3)
  }
  if (Math.abs(num) < 100) return num.toPrecision(4)
  return num.toFixed(2)
}

// ---------- Component ----------

function MoleConverter({
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
  const [substIdx, setSubstIdx] = useState(0) // H2O
  const [activeStation, setActiveStation] = useState('moles')
  const [inputValue, setInputValue] = useState('1')
  const [flowAnim, setFlowAnim] = useState(null) // 'left' | 'right' | 'both' | null
  const flowTimerRef = useRef(null)
  const discoveredRef = useRef(new Set(discoveredSet || []))

  const substance = SUBSTANCES[substIdx]

  // Keep discovered ref in sync
  useEffect(() => {
    discoveredRef.current = new Set(discoveredSet || [])
  }, [discoveredSet])

  // Compute all three values from the active input
  const values = useMemo(() => {
    const val = parseFloat(inputValue) || 0
    let particles = 0, moles = 0, grams = 0

    if (activeStation === 'particles') {
      particles = val
      moles = val / AVOGADRO
      grams = moles * substance.molarMass
    } else if (activeStation === 'moles') {
      moles = val
      particles = val * AVOGADRO
      grams = val * substance.molarMass
    } else {
      grams = val
      moles = val / substance.molarMass
      particles = moles * AVOGADRO
    }

    return { particles, moles, grams }
  }, [inputValue, activeStation, substance])

  // Fire discoveries based on conversions
  useEffect(() => {
    if (!onDiscovery) return
    const val = parseFloat(inputValue) || 0
    if (val <= 0) return

    // Avogadro link: converting 1 mole to particles
    if (activeStation === 'moles' && Math.abs(val - 1) < 0.01) {
      if (!discoveredRef.current.has('avogadro-link')) {
        onDiscovery('avogadro-link')
      }
    }

    // Mass-mole link: entering grams and getting moles
    if (activeStation === 'grams' && val > 0) {
      if (!discoveredRef.current.has('mass-mole-link')) {
        onDiscovery('mass-mole-link')
      }
    }
  }, [activeStation, inputValue, onDiscovery])

  // Check completion
  useEffect(() => {
    const disc = discoveredSet || new Set()
    const hasAll = ['avogadro-link', 'mass-mole-link'].every(k => disc.has ? disc.has(k) : false)
    if (hasAll && onComplete && !isComplete) {
      onComplete()
    }
  }, [discoveredSet, onComplete, isComplete])

  // Trigger flow animation
  const triggerFlow = useCallback((direction) => {
    setFlowAnim(direction)
    if (flowTimerRef.current) clearTimeout(flowTimerRef.current)
    flowTimerRef.current = setTimeout(() => setFlowAnim(null), 900)
  }, [])

  // Handle station input change
  const handleInput = useCallback((station, val) => {
    setActiveStation(station)
    setInputValue(val)
    if (station === 'particles') triggerFlow('right')
    else if (station === 'grams') triggerFlow('left')
    else triggerFlow('both')
  }, [triggerFlow])

  // Handle substance change
  const handleSubstanceChange = useCallback((idx) => {
    setSubstIdx(idx)
  }, [])

  // Cleanup
  useEffect(() => {
    return () => { if (flowTimerRef.current) clearTimeout(flowTimerRef.current) }
  }, [])

  // ---------- SVG Constants ----------
  const svgW = 720
  const svgH = 320
  const stY = 140 // station center Y
  const stations = [
    { key: 'particles', label: 'Particles', x: 110, value: values.particles, unit: 'particles', color: '#60a5fa', icon: '\u2022\u2022\u2022' },
    { key: 'moles', label: 'Moles', x: 360, value: values.moles, unit: 'mol', color: '#a78bfa', icon: 'mol' },
    { key: 'grams', label: 'Grams', x: 610, value: values.grams, unit: 'g', color: '#34d399', icon: '\u2696' },
  ]

  // Flow animation: compute dot positions
  const flowDots = useMemo(() => {
    if (!flowAnim) return []
    const dots = []
    const now = Date.now()
    // Right-flowing dots (particles -> moles -> grams)
    if (flowAnim === 'right' || flowAnim === 'both') {
      for (let i = 0; i < 3; i++) {
        dots.push({ id: `r${i}`, dir: 'right', offset: i * 0.15, color: '#a78bfa' })
      }
    }
    // Left-flowing dots (grams -> moles -> particles)
    if (flowAnim === 'left' || flowAnim === 'both') {
      for (let i = 0; i < 3; i++) {
        dots.push({ id: `l${i}`, dir: 'left', offset: i * 0.15, color: '#a78bfa' })
      }
    }
    return dots
  }, [flowAnim])

  return (
    <div className="space-y-3">
      {/* Substance selector */}
      <div className="space-y-1.5">
        <span className="text-xs text-slate-400 font-medium">Substance:</span>
        <div className="flex flex-wrap gap-1.5">
          {SUBSTANCES.map((s, i) => (
            <button
              key={s.formula}
              onClick={() => handleSubstanceChange(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                i === substIdx
                  ? 'bg-indigo-600/30 border-indigo-500/60 text-white'
                  : 'bg-slate-800/60 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <span className="font-bold" style={{ color: s.color }}>{s.formula}</span>
              <span className="ml-1.5 text-slate-500">{s.molarMass} g/mol</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG flow diagram */}
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-900/80 border border-slate-700/40">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full"
          style={{ minHeight: 240 }}
        >
          {/* Background */}
          <rect width={svgW} height={svgH} fill="#0A0E1A" opacity="0.7" />

          {/* Grid pattern */}
          <defs>
            <pattern id="mc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.04)" strokeWidth="0.5" />
            </pattern>
            <marker id="mc-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#475569" />
            </marker>
          </defs>
          <rect width={svgW} height={svgH} fill="url(#mc-grid)" />

          {/* Title */}
          <text x={svgW / 2} y={28} textAnchor="middle" fill="#475569" fontSize={12} fontWeight="600">
            {substance.formula} Mole Conversion Map
          </text>

          {/* ---- Connection arrows: Particles <-> Moles ---- */}
          {/* Forward: Particles -> Moles (top arrow) */}
          <line x1={180} y1={stY - 18} x2={290} y2={stY - 18}
            stroke="#475569" strokeWidth={1.5} markerEnd="url(#mc-arrow)" />
          <text x={235} y={stY - 28} textAnchor="middle" fill="#64748b" fontSize={9}>
            {'\u00F7'} 6.022 {'\u00D7'} 10{'\u00B2\u00B3'}
          </text>

          {/* Reverse: Moles -> Particles (bottom arrow) */}
          <line x1={290} y1={stY + 18} x2={180} y2={stY + 18}
            stroke="#475569" strokeWidth={1.5} markerEnd="url(#mc-arrow)" />
          <text x={235} y={stY + 38} textAnchor="middle" fill="#64748b" fontSize={9}>
            {'\u00D7'} 6.022 {'\u00D7'} 10{'\u00B2\u00B3'}
          </text>

          {/* ---- Connection arrows: Moles <-> Grams ---- */}
          {/* Forward: Moles -> Grams (top arrow) */}
          <line x1={430} y1={stY - 18} x2={540} y2={stY - 18}
            stroke="#475569" strokeWidth={1.5} markerEnd="url(#mc-arrow)" />
          <text x={485} y={stY - 28} textAnchor="middle" fill="#64748b" fontSize={9}>
            {'\u00D7'} {substance.molarMass} g/mol
          </text>

          {/* Reverse: Grams -> Moles (bottom arrow) */}
          <line x1={540} y1={stY + 18} x2={430} y2={stY + 18}
            stroke="#475569" strokeWidth={1.5} markerEnd="url(#mc-arrow)" />
          <text x={485} y={stY + 38} textAnchor="middle" fill="#64748b" fontSize={9}>
            {'\u00F7'} {substance.molarMass} g/mol
          </text>

          {/* ---- Station boxes ---- */}
          {stations.map((st) => {
            const isActive = activeStation === st.key
            const boxW = 130
            const boxH = 120
            return (
              <g key={st.key}>
                {/* Box background */}
                <rect
                  x={st.x - boxW / 2}
                  y={stY - boxH / 2}
                  width={boxW}
                  height={boxH}
                  rx={10}
                  fill={isActive ? st.color + '12' : '#0f172a80'}
                  stroke={isActive ? st.color + '60' : '#334155'}
                  strokeWidth={isActive ? 2 : 1}
                />

                {/* Icon / symbol */}
                <text
                  x={st.x}
                  y={stY - 30}
                  textAnchor="middle"
                  fill={st.color}
                  fontSize={16}
                  opacity={0.6}
                >
                  {st.icon}
                </text>

                {/* Station label */}
                <text x={st.x} y={stY - 12} textAnchor="middle" fill={st.color} fontSize={13} fontWeight="600">
                  {st.label}
                </text>

                {/* Value */}
                <text x={st.x} y={stY + 10} textAnchor="middle" fill="#e2e8f0" fontSize={15} fontWeight="bold">
                  {isActive ? (inputValue || '0') : formatSci(st.value)}
                </text>

                {/* Unit */}
                <text x={st.x} y={stY + 28} textAnchor="middle" fill="#64748b" fontSize={10}>
                  {st.unit}
                </text>

                {/* Active indicator bar */}
                {isActive && (
                  <rect
                    x={st.x - 40}
                    y={stY + 38}
                    width={80}
                    height={3}
                    rx={1.5}
                    fill={st.color}
                    opacity={0.6}
                  />
                )}
              </g>
            )
          })}

          {/* ---- Animated flow dots ---- */}
          {flowDots.map((dot) => {
            // Animate using CSS animation class (fallback: static position)
            const startX = dot.dir === 'right' ? 180 : 540
            const endX = dot.dir === 'right' ? 540 : 180
            const cx = startX + (endX - startX) * 0.5 // Midpoint for static render
            return (
              <circle
                key={dot.id}
                cx={cx}
                cy={stY + (dot.dir === 'right' ? -18 : 18)}
                r={4}
                fill={dot.color}
                opacity={0.7}
              >
                <animate
                  attributeName="cx"
                  from={startX + (endX - startX) * dot.offset}
                  to={endX}
                  dur="0.7s"
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  from="0.8"
                  to="0"
                  dur="0.7s"
                  fill="freeze"
                />
              </circle>
            )
          })}

          {/* Bottom: Avogadro's number reference */}
          <text x={svgW / 2} y={svgH - 16} textAnchor="middle" fill="#334155" fontSize={10}>
            Avogadro's Number: 6.022 {'\u00D7'} 10{'\u00B2\u00B3'} particles/mol
          </text>
        </svg>
      </div>

      {/* Input controls row */}
      <div className="grid grid-cols-3 gap-3">
        {stations.map((st) => (
          <div key={st.key} className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider block text-center">
              {st.label}
            </label>
            <input
              type="number"
              value={activeStation === st.key ? inputValue : formatSci(st.value)}
              onChange={(e) => handleInput(st.key, e.target.value)}
              onFocus={() => {
                if (activeStation !== st.key) {
                  setActiveStation(st.key)
                  setInputValue(st.value === 0 ? '0' : formatSci(st.value))
                }
              }}
              className={`w-full text-center text-sm rounded-lg px-2 py-2 border transition-colors focus:outline-none ${
                activeStation === st.key
                  ? 'bg-slate-800/80 text-white focus:ring-1 focus:ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-700/40 text-slate-400'
              }`}
              style={{ borderColor: activeStation === st.key ? st.color + '60' : undefined }}
              step="any"
            />
            <p className="text-[10px] text-slate-600 text-center">{st.unit}</p>
          </div>
        ))}
      </div>

      {/* Conversion explanation */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
        <p className="text-xs text-slate-400 leading-relaxed">
          {activeStation === 'particles' && (
            <>Enter particle count. Divide by Avogadro's number (6.022 {'\u00D7'} 10{'\u00B2\u00B3'}) to get moles, then multiply by molar mass ({substance.molarMass} g/mol) for grams.</>
          )}
          {activeStation === 'moles' && (
            <>Enter moles of {substance.formula}. Multiply by Avogadro's number for particles, or by molar mass ({substance.molarMass} g/mol) for grams.</>
          )}
          {activeStation === 'grams' && (
            <>Enter mass in grams. Divide by molar mass ({substance.molarMass} g/mol) for moles, then multiply by Avogadro's number for particles.</>
          )}
        </p>
      </div>

      {/* Discovery tracker */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'avogadro-link', label: 'Avogadro Link', hint: 'Convert exactly 1 mole' },
          { key: 'mass-mole-link', label: 'Mass-Mole Link', hint: 'Convert grams to moles' },
        ].map((d) => {
          const found = discoveredSet && (discoveredSet.has ? discoveredSet.has(d.key) : false)
          return (
            <span
              key={d.key}
              className={`px-2 py-1 rounded text-[10px] font-medium border ${
                found
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800/40 border-slate-700/30 text-slate-600'
              }`}
              title={d.hint}
            >
              {found ? '\u2713 ' : '\u25CB '}{d.label}
            </span>
          )
        })}
      </div>

      {/* Quick-reference card */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Substance</span>
          <span className="text-sm text-slate-200 font-bold" style={{ color: substance.color }}>
            {substance.formula}
          </span>
        </div>
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Molar Mass</span>
          <span className="text-sm text-slate-200 font-bold">{substance.molarMass} g/mol</span>
        </div>
      </div>
    </div>
  )
}

export default MoleConverter
