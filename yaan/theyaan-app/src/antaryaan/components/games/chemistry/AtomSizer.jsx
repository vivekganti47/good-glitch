import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/**
 * Atom Sizer - compare atomic and ionic radii of two elements.
 *
 * SVG with two circles scaled proportionally. Toggle between
 * neutral atom and common ion for each element.
 */

// Element data: symbol, name, z, atomicRadius (pm), ionRadius (pm), ionCharge, electronConfig, ionConfig
const ATOM_DATA = [
  { z: 1, symbol: 'H', name: 'Hydrogen', atomicRadius: 53, ionRadius: null, ionCharge: '+1', ionConfig: '(empty)', config: '1s1' },
  { z: 3, symbol: 'Li', name: 'Lithium', atomicRadius: 167, ionRadius: 76, ionCharge: '+1', ionConfig: '1s2', config: '[He] 2s1' },
  { z: 4, symbol: 'Be', name: 'Beryllium', atomicRadius: 112, ionRadius: 45, ionCharge: '+2', ionConfig: '1s2', config: '[He] 2s2' },
  { z: 6, symbol: 'C', name: 'Carbon', atomicRadius: 77, ionRadius: 260, ionCharge: '-4', ionConfig: '[He] 2s2 2p6', config: '[He] 2s2 2p2' },
  { z: 7, symbol: 'N', name: 'Nitrogen', atomicRadius: 75, ionRadius: 146, ionCharge: '-3', ionConfig: '[He] 2s2 2p6', config: '[He] 2s2 2p3' },
  { z: 8, symbol: 'O', name: 'Oxygen', atomicRadius: 73, ionRadius: 140, ionCharge: '-2', ionConfig: '[He] 2s2 2p6', config: '[He] 2s2 2p4' },
  { z: 9, symbol: 'F', name: 'Fluorine', atomicRadius: 71, ionRadius: 133, ionCharge: '-1', ionConfig: '[He] 2s2 2p6', config: '[He] 2s2 2p5' },
  { z: 11, symbol: 'Na', name: 'Sodium', atomicRadius: 190, ionRadius: 102, ionCharge: '+1', ionConfig: '[He] 2s2 2p6', config: '[Ne] 3s1' },
  { z: 12, symbol: 'Mg', name: 'Magnesium', atomicRadius: 145, ionRadius: 72, ionCharge: '+2', ionConfig: '[He] 2s2 2p6', config: '[Ne] 3s2' },
  { z: 13, symbol: 'Al', name: 'Aluminium', atomicRadius: 118, ionRadius: 53, ionCharge: '+3', ionConfig: '[He] 2s2 2p6', config: '[Ne] 3s2 3p1' },
  { z: 16, symbol: 'S', name: 'Sulfur', atomicRadius: 102, ionRadius: 184, ionCharge: '-2', ionConfig: '[Ne] 3s2 3p6', config: '[Ne] 3s2 3p4' },
  { z: 17, symbol: 'Cl', name: 'Chlorine', atomicRadius: 99, ionRadius: 181, ionCharge: '-1', ionConfig: '[Ne] 3s2 3p6', config: '[Ne] 3s2 3p5' },
  { z: 19, symbol: 'K', name: 'Potassium', atomicRadius: 243, ionRadius: 138, ionCharge: '+1', ionConfig: '[Ne] 3s2 3p6', config: '[Ar] 4s1' },
  { z: 20, symbol: 'Ca', name: 'Calcium', atomicRadius: 194, ionRadius: 100, ionCharge: '+2', ionConfig: '[Ne] 3s2 3p6', config: '[Ar] 4s2' },
  { z: 26, symbol: 'Fe', name: 'Iron', atomicRadius: 156, ionRadius: 65, ionCharge: '+3', ionConfig: '[Ar] 3d5', config: '[Ar] 3d6 4s2' },
  { z: 29, symbol: 'Cu', name: 'Copper', atomicRadius: 145, ionRadius: 73, ionCharge: '+2', ionConfig: '[Ar] 3d9', config: '[Ar] 3d10 4s1' },
  { z: 35, symbol: 'Br', name: 'Bromine', atomicRadius: 94, ionRadius: 196, ionCharge: '-1', ionConfig: '[Ar] 3d10 4s2 4p6', config: '[Ar] 3d10 4s2 4p5' },
]

const ELEMENT_COLORS = {
  H: '#60a5fa', Li: '#a78bfa', Be: '#67e8f9', C: '#94a3b8', N: '#60a5fa',
  O: '#f87171', F: '#fbbf24', Na: '#a78bfa', Mg: '#34d399', Al: '#94a3b8',
  S: '#fbbf24', Cl: '#34d399', K: '#a78bfa', Ca: '#34d399', Fe: '#f97316',
  Cu: '#f97316', Br: '#ef4444',
}

function AtomSizer({
  config,
  params,
  onParamChange,
  onDiscovery,
  onComplete,
  isComplete,
  containerWidth = 800,
  containerHeight = 450,
}) {
  const [leftIdx, setLeftIdx] = useState(7) // Na
  const [rightIdx, setRightIdx] = useState(11) // Cl
  const [leftIon, setLeftIon] = useState(false)
  const [rightIon, setRightIon] = useState(false)

  const leftAtom = ATOM_DATA[leftIdx]
  const rightAtom = ATOM_DATA[rightIdx]

  const leftRadius = leftIon ? (leftAtom.ionRadius || leftAtom.atomicRadius) : leftAtom.atomicRadius
  const rightRadius = rightIon ? (rightAtom.ionRadius || rightAtom.atomicRadius) : rightAtom.atomicRadius

  // Scale radii to fit in SVG
  const maxR = useMemo(() => Math.max(leftRadius, rightRadius, 100), [leftRadius, rightRadius])
  const scale = 120 / maxR
  const leftR = leftRadius * scale
  const rightR = rightRadius * scale

  const svgW = 700
  const svgH = 380
  const leftCx = svgW * 0.3
  const rightCx = svgW * 0.7
  const cy = svgH * 0.45

  const handleLeftChange = useCallback((e) => {
    setLeftIdx(Number(e.target.value))
    setLeftIon(false)
  }, [])

  const handleRightChange = useCallback((e) => {
    setRightIdx(Number(e.target.value))
    setRightIon(false)
  }, [])

  const isCation = (atom, isIon) => {
    if (!isIon) return false
    return atom.ionCharge && atom.ionCharge.includes('+')
  }

  const isAnion = (atom, isIon) => {
    if (!isIon) return false
    return atom.ionCharge && atom.ionCharge.includes('-')
  }

  return (
    <div className="space-y-3">
      {/* Selectors */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Left:</label>
          <div className="relative">
            <select
              value={leftIdx}
              onChange={handleLeftChange}
              className="appearance-none bg-slate-800/60 border border-slate-700/40 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            >
              {ATOM_DATA.map((el, i) => (
                <option key={el.z} value={i}>{el.symbol} - {el.name}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setLeftIon(!leftIon)}
            disabled={!leftAtom.ionRadius}
            className={`px-2 py-1 rounded text-[10px] font-medium cursor-pointer transition-colors ${
              leftIon
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200'
            } ${!leftAtom.ionRadius ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {leftIon ? `Ion (${leftAtom.ionCharge})` : 'Neutral'}
          </button>
        </div>

        <span className="text-slate-600">vs</span>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Right:</label>
          <div className="relative">
            <select
              value={rightIdx}
              onChange={handleRightChange}
              className="appearance-none bg-slate-800/60 border border-slate-700/40 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            >
              {ATOM_DATA.map((el, i) => (
                <option key={el.z} value={i}>{el.symbol} - {el.name}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setRightIon(!rightIon)}
            disabled={!rightAtom.ionRadius}
            className={`px-2 py-1 rounded text-[10px] font-medium cursor-pointer transition-colors ${
              rightIon
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200'
            } ${!rightAtom.ionRadius ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {rightIon ? `Ion (${rightAtom.ionCharge})` : 'Neutral'}
          </button>
        </div>
      </div>

      {/* SVG Visualization */}
      <div className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full"
          style={{ minHeight: 260, maxHeight: containerHeight || 450 }}
        >
          <rect width={svgW} height={svgH} fill="#0A0E1A" opacity="0.6" />

          {/* Grid lines */}
          <defs>
            <pattern id="atom-sizer-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(148,163,184,0.06)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id={`grad-left-${leftAtom.symbol}`} cx="40%" cy="40%">
              <stop offset="0%" stopColor={ELEMENT_COLORS[leftAtom.symbol] || '#60a5fa'} stopOpacity="0.4" />
              <stop offset="100%" stopColor={ELEMENT_COLORS[leftAtom.symbol] || '#60a5fa'} stopOpacity="0.08" />
            </radialGradient>
            <radialGradient id={`grad-right-${rightAtom.symbol}`} cx="40%" cy="40%">
              <stop offset="0%" stopColor={ELEMENT_COLORS[rightAtom.symbol] || '#34d399'} stopOpacity="0.4" />
              <stop offset="100%" stopColor={ELEMENT_COLORS[rightAtom.symbol] || '#34d399'} stopOpacity="0.08" />
            </radialGradient>
          </defs>
          <rect width={svgW} height={svgH} fill="url(#atom-sizer-grid)" />

          {/* Left atom */}
          <motion.circle
            cx={leftCx}
            cy={cy}
            r={leftR}
            fill={`url(#grad-left-${leftAtom.symbol})`}
            stroke={ELEMENT_COLORS[leftAtom.symbol] || '#60a5fa'}
            strokeWidth={1.5}
            strokeOpacity={0.5}
            initial={false}
            animate={{ r: leftR }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
          <text x={leftCx} y={cy - 4} textAnchor="middle" fill="white" fontSize={20} fontWeight="bold">
            {leftAtom.symbol}
          </text>
          <text x={leftCx} y={cy + 14} textAnchor="middle" fill="white" fontSize={11} opacity={0.7}>
            {leftIon ? leftAtom.ionCharge : ''}
          </text>

          {/* Left label */}
          <text x={leftCx} y={cy + leftR + 25} textAnchor="middle" fill="#94a3b8" fontSize={12}>
            {leftRadius} pm
          </text>
          <text x={leftCx} y={cy + leftR + 42} textAnchor="middle" fill="#64748b" fontSize={10}>
            {leftIon ? `${leftAtom.symbol}${leftAtom.ionCharge} ion` : `${leftAtom.name} atom`}
          </text>

          {/* Left charge indicator */}
          {leftIon && (
            <text
              x={leftCx + leftR + 8}
              y={cy - leftR + 5}
              fill={isCation(leftAtom, leftIon) ? '#f87171' : '#60a5fa'}
              fontSize={16}
              fontWeight="bold"
            >
              {isCation(leftAtom, leftIon) ? '\u03B4+' : '\u03B4-'}
            </text>
          )}

          {/* Right atom */}
          <motion.circle
            cx={rightCx}
            cy={cy}
            r={rightR}
            fill={`url(#grad-right-${rightAtom.symbol})`}
            stroke={ELEMENT_COLORS[rightAtom.symbol] || '#34d399'}
            strokeWidth={1.5}
            strokeOpacity={0.5}
            initial={false}
            animate={{ r: rightR }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
          <text x={rightCx} y={cy - 4} textAnchor="middle" fill="white" fontSize={20} fontWeight="bold">
            {rightAtom.symbol}
          </text>
          <text x={rightCx} y={cy + 14} textAnchor="middle" fill="white" fontSize={11} opacity={0.7}>
            {rightIon ? rightAtom.ionCharge : ''}
          </text>

          {/* Right label */}
          <text x={rightCx} y={cy + rightR + 25} textAnchor="middle" fill="#94a3b8" fontSize={12}>
            {rightRadius} pm
          </text>
          <text x={rightCx} y={cy + rightR + 42} textAnchor="middle" fill="#64748b" fontSize={10}>
            {rightIon ? `${rightAtom.symbol}${rightAtom.ionCharge} ion` : `${rightAtom.name} atom`}
          </text>

          {/* Right charge indicator */}
          {rightIon && (
            <text
              x={rightCx + rightR + 8}
              y={cy - rightR + 5}
              fill={isCation(rightAtom, rightIon) ? '#f87171' : '#60a5fa'}
              fontSize={16}
              fontWeight="bold"
            >
              {isCation(rightAtom, rightIon) ? '\u03B4+' : '\u03B4-'}
            </text>
          )}

          {/* Scale bar */}
          <g>
            <line x1={50} y1={svgH - 30} x2={50 + 100 * scale} y2={svgH - 30} stroke="#475569" strokeWidth={1.5} />
            <line x1={50} y1={svgH - 35} x2={50} y2={svgH - 25} stroke="#475569" strokeWidth={1} />
            <line x1={50 + 100 * scale} y1={svgH - 35} x2={50 + 100 * scale} y2={svgH - 25} stroke="#475569" strokeWidth={1} />
            <text x={50 + 50 * scale} y={svgH - 16} textAnchor="middle" fill="#64748b" fontSize={10}>
              100 pm
            </text>
          </g>

          {/* Size comparison */}
          {leftRadius !== rightRadius && (
            <text x={svgW / 2} y={30} textAnchor="middle" fill="#94a3b8" fontSize={12}>
              {leftAtom.symbol}{leftIon ? leftAtom.ionCharge : ''} is{' '}
              {((leftRadius / rightRadius) * 100).toFixed(0)}% the size of{' '}
              {rightAtom.symbol}{rightIon ? rightAtom.ionCharge : ''}
            </text>
          )}
        </svg>
      </div>

      {/* Electron configurations */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
            {leftIon ? `${leftAtom.symbol}${leftAtom.ionCharge}` : leftAtom.symbol} Config
          </span>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            {leftIon ? leftAtom.ionConfig : leftAtom.config}
          </p>
          {leftIon && isCation(leftAtom, leftIon) && (
            <p className="text-[10px] text-amber-400/70 mt-1">Cation: lost electrons, smaller radius</p>
          )}
          {leftIon && isAnion(leftAtom, leftIon) && (
            <p className="text-[10px] text-blue-400/70 mt-1">Anion: gained electrons, larger radius</p>
          )}
        </div>
        <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
            {rightIon ? `${rightAtom.symbol}${rightAtom.ionCharge}` : rightAtom.symbol} Config
          </span>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            {rightIon ? rightAtom.ionConfig : rightAtom.config}
          </p>
          {rightIon && isCation(rightAtom, rightIon) && (
            <p className="text-[10px] text-amber-400/70 mt-1">Cation: lost electrons, smaller radius</p>
          )}
          {rightIon && isAnion(rightAtom, rightIon) && (
            <p className="text-[10px] text-blue-400/70 mt-1">Anion: gained electrons, larger radius</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AtomSizer
