import { useState, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, MousePointer, ArrowRight, CheckCircle } from 'lucide-react'

/**
 * Periodic Trend Explorer - interactive heatmap of periodic table properties.
 *
 * Shows first 36 elements (H through Kr) with color-coded property values.
 * Supports "Draw Trend" mode for directional trend arrows.
 */

// Periodic table data for elements 1-36
// Values: atomicRadius (pm), ionizationEnergy (kJ/mol), electronegativity (Pauling), electronAffinity (kJ/mol)
const ELEMENTS = [
  { z: 1, symbol: 'H', name: 'Hydrogen', group: 1, period: 1, atomicRadius: 53, ionizationEnergy: 1312, electronegativity: 2.20, electronAffinity: 73 },
  { z: 2, symbol: 'He', name: 'Helium', group: 18, period: 1, atomicRadius: 31, ionizationEnergy: 2372, electronegativity: 0, electronAffinity: 0 },
  { z: 3, symbol: 'Li', name: 'Lithium', group: 1, period: 2, atomicRadius: 167, ionizationEnergy: 520, electronegativity: 0.98, electronAffinity: 60 },
  { z: 4, symbol: 'Be', name: 'Beryllium', group: 2, period: 2, atomicRadius: 112, ionizationEnergy: 900, electronegativity: 1.57, electronAffinity: 0 },
  { z: 5, symbol: 'B', name: 'Boron', group: 13, period: 2, atomicRadius: 87, ionizationEnergy: 801, electronegativity: 2.04, electronAffinity: 27 },
  { z: 6, symbol: 'C', name: 'Carbon', group: 14, period: 2, atomicRadius: 77, ionizationEnergy: 1086, electronegativity: 2.55, electronAffinity: 122 },
  { z: 7, symbol: 'N', name: 'Nitrogen', group: 15, period: 2, atomicRadius: 75, ionizationEnergy: 1402, electronegativity: 3.04, electronAffinity: 0 },
  { z: 8, symbol: 'O', name: 'Oxygen', group: 16, period: 2, atomicRadius: 73, ionizationEnergy: 1314, electronegativity: 3.44, electronAffinity: 141 },
  { z: 9, symbol: 'F', name: 'Fluorine', group: 17, period: 2, atomicRadius: 71, ionizationEnergy: 1681, electronegativity: 3.98, electronAffinity: 328 },
  { z: 10, symbol: 'Ne', name: 'Neon', group: 18, period: 2, atomicRadius: 69, ionizationEnergy: 2081, electronegativity: 0, electronAffinity: 0 },
  { z: 11, symbol: 'Na', name: 'Sodium', group: 1, period: 3, atomicRadius: 190, ionizationEnergy: 496, electronegativity: 0.93, electronAffinity: 53 },
  { z: 12, symbol: 'Mg', name: 'Magnesium', group: 2, period: 3, atomicRadius: 145, ionizationEnergy: 738, electronegativity: 1.31, electronAffinity: 0 },
  { z: 13, symbol: 'Al', name: 'Aluminium', group: 13, period: 3, atomicRadius: 118, ionizationEnergy: 578, electronegativity: 1.61, electronAffinity: 42 },
  { z: 14, symbol: 'Si', name: 'Silicon', group: 14, period: 3, atomicRadius: 111, ionizationEnergy: 786, electronegativity: 1.90, electronAffinity: 134 },
  { z: 15, symbol: 'P', name: 'Phosphorus', group: 15, period: 3, atomicRadius: 106, ionizationEnergy: 1012, electronegativity: 2.19, electronAffinity: 72 },
  { z: 16, symbol: 'S', name: 'Sulfur', group: 16, period: 3, atomicRadius: 102, ionizationEnergy: 1000, electronegativity: 2.58, electronAffinity: 200 },
  { z: 17, symbol: 'Cl', name: 'Chlorine', group: 17, period: 3, atomicRadius: 99, ionizationEnergy: 1251, electronegativity: 3.16, electronAffinity: 349 },
  { z: 18, symbol: 'Ar', name: 'Argon', group: 18, period: 3, atomicRadius: 97, ionizationEnergy: 1521, electronegativity: 0, electronAffinity: 0 },
  { z: 19, symbol: 'K', name: 'Potassium', group: 1, period: 4, atomicRadius: 243, ionizationEnergy: 419, electronegativity: 0.82, electronAffinity: 48 },
  { z: 20, symbol: 'Ca', name: 'Calcium', group: 2, period: 4, atomicRadius: 194, ionizationEnergy: 590, electronegativity: 1.00, electronAffinity: 2 },
  { z: 21, symbol: 'Sc', name: 'Scandium', group: 3, period: 4, atomicRadius: 184, ionizationEnergy: 633, electronegativity: 1.36, electronAffinity: 18 },
  { z: 22, symbol: 'Ti', name: 'Titanium', group: 4, period: 4, atomicRadius: 176, ionizationEnergy: 659, electronegativity: 1.54, electronAffinity: 8 },
  { z: 23, symbol: 'V', name: 'Vanadium', group: 5, period: 4, atomicRadius: 171, ionizationEnergy: 651, electronegativity: 1.63, electronAffinity: 51 },
  { z: 24, symbol: 'Cr', name: 'Chromium', group: 6, period: 4, atomicRadius: 166, ionizationEnergy: 653, electronegativity: 1.66, electronAffinity: 65 },
  { z: 25, symbol: 'Mn', name: 'Manganese', group: 7, period: 4, atomicRadius: 161, ionizationEnergy: 717, electronegativity: 1.55, electronAffinity: 0 },
  { z: 26, symbol: 'Fe', name: 'Iron', group: 8, period: 4, atomicRadius: 156, ionizationEnergy: 762, electronegativity: 1.83, electronAffinity: 15 },
  { z: 27, symbol: 'Co', name: 'Cobalt', group: 9, period: 4, atomicRadius: 152, ionizationEnergy: 760, electronegativity: 1.88, electronAffinity: 64 },
  { z: 28, symbol: 'Ni', name: 'Nickel', group: 10, period: 4, atomicRadius: 149, ionizationEnergy: 737, electronegativity: 1.91, electronAffinity: 112 },
  { z: 29, symbol: 'Cu', name: 'Copper', group: 11, period: 4, atomicRadius: 145, ionizationEnergy: 745, electronegativity: 1.90, electronAffinity: 119 },
  { z: 30, symbol: 'Zn', name: 'Zinc', group: 12, period: 4, atomicRadius: 142, ionizationEnergy: 906, electronegativity: 1.65, electronAffinity: 0 },
  { z: 31, symbol: 'Ga', name: 'Gallium', group: 13, period: 4, atomicRadius: 136, ionizationEnergy: 579, electronegativity: 1.81, electronAffinity: 41 },
  { z: 32, symbol: 'Ge', name: 'Germanium', group: 14, period: 4, atomicRadius: 125, ionizationEnergy: 762, electronegativity: 2.01, electronAffinity: 119 },
  { z: 33, symbol: 'As', name: 'Arsenic', group: 15, period: 4, atomicRadius: 114, ionizationEnergy: 947, electronegativity: 2.18, electronAffinity: 78 },
  { z: 34, symbol: 'Se', name: 'Selenium', group: 16, period: 4, atomicRadius: 103, ionizationEnergy: 941, electronegativity: 2.55, electronAffinity: 195 },
  { z: 35, symbol: 'Br', name: 'Bromine', group: 17, period: 4, atomicRadius: 94, ionizationEnergy: 1140, electronegativity: 2.96, electronAffinity: 325 },
  { z: 36, symbol: 'Kr', name: 'Krypton', group: 18, period: 4, atomicRadius: 88, ionizationEnergy: 1351, electronegativity: 3.00, electronAffinity: 0 },
]

const ELECTRON_CONFIGS = {
  1: '1s1', 2: '1s2', 3: '[He] 2s1', 4: '[He] 2s2', 5: '[He] 2s2 2p1',
  6: '[He] 2s2 2p2', 7: '[He] 2s2 2p3', 8: '[He] 2s2 2p4', 9: '[He] 2s2 2p5',
  10: '[He] 2s2 2p6', 11: '[Ne] 3s1', 12: '[Ne] 3s2', 13: '[Ne] 3s2 3p1',
  14: '[Ne] 3s2 3p2', 15: '[Ne] 3s2 3p3', 16: '[Ne] 3s2 3p4', 17: '[Ne] 3s2 3p5',
  18: '[Ne] 3s2 3p6', 19: '[Ar] 4s1', 20: '[Ar] 4s2', 21: '[Ar] 3d1 4s2',
  22: '[Ar] 3d2 4s2', 23: '[Ar] 3d3 4s2', 24: '[Ar] 3d5 4s1', 25: '[Ar] 3d5 4s2',
  26: '[Ar] 3d6 4s2', 27: '[Ar] 3d7 4s2', 28: '[Ar] 3d8 4s2', 29: '[Ar] 3d10 4s1',
  30: '[Ar] 3d10 4s2', 31: '[Ar] 3d10 4s2 4p1', 32: '[Ar] 3d10 4s2 4p2',
  33: '[Ar] 3d10 4s2 4p3', 34: '[Ar] 3d10 4s2 4p4', 35: '[Ar] 3d10 4s2 4p5',
  36: '[Ar] 3d10 4s2 4p6',
}

const PROPERTIES = [
  { key: 'atomicRadius', label: 'Atomic Radius', unit: 'pm' },
  { key: 'ionizationEnergy', label: 'Ionization Energy', unit: 'kJ/mol' },
  { key: 'electronegativity', label: 'Electronegativity', unit: 'Pauling' },
  { key: 'electronAffinity', label: 'Electron Affinity', unit: 'kJ/mol' },
]

const DISCOVERIES = [
  { id: 'radius-decreases-across', label: 'Atomic radius decreases across a period', direction: 'left' },
  { id: 'ie-increases-across', label: 'Ionization energy increases across a period', direction: 'right' },
  { id: 'en-increases-across', label: 'Electronegativity increases across a period', direction: 'right' },
]

function lerp(a, b, t) {
  return a + (b - a) * t
}

function valueToColor(value, min, max) {
  if (value === 0 || value === undefined) return 'rgba(30, 41, 59, 0.6)'
  const t = max === min ? 0.5 : (value - min) / (max - min)
  // Blue (low) to Red (high)
  const r = Math.round(lerp(59, 239, t))
  const g = Math.round(lerp(130, 68, t))
  const b = Math.round(lerp(246, 68, t))
  return `rgb(${r}, ${g}, ${b})`
}

function PeriodicTrendExplorer({
  config,
  params,
  onParamChange,
  onDiscovery,
  onComplete,
  isComplete,
  containerWidth = 800,
  containerHeight = 500,
}) {
  const [selectedProperty, setSelectedProperty] = useState('atomicRadius')
  const [selectedElement, setSelectedElement] = useState(null)
  const [drawMode, setDrawMode] = useState(false)
  const [drawStart, setDrawStart] = useState(null)
  const [drawEnd, setDrawEnd] = useState(null)
  const [discoveredTrends, setDiscoveredTrends] = useState(new Set())
  const [trendResult, setTrendResult] = useState(null)
  const tableRef = useRef(null)

  const property = PROPERTIES.find(p => p.key === selectedProperty)

  const { min, max } = useMemo(() => {
    const values = ELEMENTS.map(e => e[selectedProperty]).filter(v => v > 0)
    return { min: Math.min(...values), max: Math.max(...values) }
  }, [selectedProperty])

  // Build grid map: key = "period-group" -> element
  const gridMap = useMemo(() => {
    const map = {}
    ELEMENTS.forEach(el => {
      map[`${el.period}-${el.group}`] = el
    })
    return map
  }, [])

  const handleCellClick = useCallback((el) => {
    if (drawMode) return
    setSelectedElement(el)
  }, [drawMode])

  const handleDrawStart = useCallback((el, e) => {
    if (!drawMode) return
    e.preventDefault()
    setDrawStart(el)
    setDrawEnd(null)
    setTrendResult(null)
  }, [drawMode])

  const handleDrawMove = useCallback((el) => {
    if (!drawMode || !drawStart) return
    setDrawEnd(el)
  }, [drawMode, drawStart])

  const handleDrawEnd = useCallback(() => {
    if (!drawMode || !drawStart || !drawEnd) return
    if (drawStart.z === drawEnd.z) { setDrawStart(null); setDrawEnd(null); return }

    // Determine direction
    const dGroup = drawEnd.group - drawStart.group
    const dPeriod = drawEnd.period - drawStart.period

    // Check trend validity for current property
    let isCorrect = false
    let discoveryId = null

    if (Math.abs(dGroup) > Math.abs(dPeriod)) {
      // Horizontal trend (across period)
      const goingRight = dGroup > 0

      if (selectedProperty === 'atomicRadius') {
        // Radius decreases across (right direction means increase, which is wrong)
        if (!goingRight) {
          isCorrect = true
          discoveryId = 'radius-decreases-across'
        }
      } else if (selectedProperty === 'ionizationEnergy') {
        if (goingRight) {
          isCorrect = true
          discoveryId = 'ie-increases-across'
        }
      } else if (selectedProperty === 'electronegativity') {
        if (goingRight) {
          isCorrect = true
          discoveryId = 'en-increases-across'
        }
      }
    }

    if (isCorrect && discoveryId) {
      const newDiscoveries = new Set(discoveredTrends)
      newDiscoveries.add(discoveryId)
      setDiscoveredTrends(newDiscoveries)
      if (onDiscovery) onDiscovery(discoveryId)
      setTrendResult({ correct: true, msg: 'Correct trend direction!' })

      if (newDiscoveries.size === DISCOVERIES.length && onComplete) {
        onComplete()
      }
    } else if (discoveryId === null && Math.abs(dGroup) > Math.abs(dPeriod)) {
      setTrendResult({ correct: false, msg: 'Try drawing the trend for a property with a known periodic trend.' })
    } else {
      setTrendResult({ correct: false, msg: 'Incorrect direction. Try again!' })
    }

    setDrawStart(null)
    setDrawEnd(null)
  }, [drawMode, drawStart, drawEnd, selectedProperty, discoveredTrends, onDiscovery, onComplete])

  const renderCell = useCallback((period, group) => {
    const el = gridMap[`${period}-${group}`]
    if (!el) return <div key={`${period}-${group}`} className="w-full aspect-square" />

    const value = el[selectedProperty]
    const bgColor = valueToColor(value, min, max)

    return (
      <motion.div
        key={el.z}
        className={`relative w-full aspect-square rounded-sm flex flex-col items-center justify-center cursor-pointer border transition-all ${
          selectedElement?.z === el.z
            ? 'border-white/60 ring-1 ring-white/30 z-10'
            : 'border-transparent hover:border-slate-500/40'
        }`}
        style={{ backgroundColor: bgColor }}
        onClick={() => handleCellClick(el)}
        onMouseDown={(e) => handleDrawStart(el, e)}
        onMouseEnter={() => handleDrawMove(el)}
        onMouseUp={handleDrawEnd}
        whileHover={{ scale: 1.1, zIndex: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <span className="text-[8px] text-white/50 leading-none">{el.z}</span>
        <span className="text-[11px] font-bold text-white leading-tight">{el.symbol}</span>
      </motion.div>
    )
  }, [gridMap, selectedProperty, min, max, selectedElement, handleCellClick, handleDrawStart, handleDrawMove, handleDrawEnd])

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <select
            value={selectedProperty}
            onChange={(e) => { setSelectedProperty(e.target.value); setSelectedElement(null) }}
            className="appearance-none bg-slate-800/60 border border-slate-700/40 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-8 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          >
            {PROPERTIES.map(p => (
              <option key={p.key} value={p.key}>{p.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <button
          onClick={() => { setDrawMode(!drawMode); setTrendResult(null) }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            drawMode
              ? 'bg-amber-600/80 text-white'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200'
          }`}
        >
          {drawMode ? <ArrowRight size={12} /> : <MousePointer size={12} />}
          {drawMode ? 'Drawing Trend...' : 'Draw Trend'}
        </button>

        {drawMode && (
          <span className="text-xs text-amber-300/70">
            Click and drag across the table to indicate the direction of increase
          </span>
        )}
      </div>

      {/* Trend result */}
      <AnimatePresence>
        {trendResult && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
              trendResult.correct
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-300 border border-red-500/20'
            }`}
          >
            {trendResult.correct ? <CheckCircle size={14} /> : <X size={14} />}
            {trendResult.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Periodic Table Grid */}
      <div
        ref={tableRef}
        className="relative w-full overflow-x-auto rounded-lg bg-slate-900/80 border border-slate-700/40 p-3"
        onMouseUp={drawMode ? handleDrawEnd : undefined}
      >
        <div
          className="grid gap-[2px] mx-auto"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
            maxWidth: 720,
          }}
        >
          {/* Period 1 */}
          {renderCell(1, 1)}
          {Array.from({ length: 16 }, (_, i) => (
            <div key={`empty-1-${i + 2}`} className="w-full aspect-square" />
          ))}
          {renderCell(1, 18)}

          {/* Period 2 */}
          {renderCell(2, 1)}
          {renderCell(2, 2)}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={`empty-2-${i + 3}`} className="w-full aspect-square" />
          ))}
          {[13, 14, 15, 16, 17, 18].map(g => renderCell(2, g))}

          {/* Period 3 */}
          {renderCell(3, 1)}
          {renderCell(3, 2)}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={`empty-3-${i + 3}`} className="w-full aspect-square" />
          ))}
          {[13, 14, 15, 16, 17, 18].map(g => renderCell(3, g))}

          {/* Period 4 - full row */}
          {Array.from({ length: 18 }, (_, i) => renderCell(4, i + 1))}
        </div>

        {/* Color legend */}
        <div className="flex items-center gap-2 mt-3 justify-center">
          <span className="text-[10px] text-slate-500">Low</span>
          <div
            className="h-2 w-32 rounded-full"
            style={{
              background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(168, 85, 247), rgb(239, 68, 68))',
            }}
          />
          <span className="text-[10px] text-slate-500">High</span>
          <span className="text-[10px] text-slate-400 ml-2">
            {property?.label} ({property?.unit})
          </span>
        </div>
      </div>

      {/* Element detail popup */}
      <AnimatePresence>
        {selectedElement && !drawMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative rounded-lg bg-slate-800/90 border border-slate-700/40 p-4"
          >
            <button
              onClick={() => setSelectedElement(null)}
              className="absolute top-2 right-2 p-1 rounded text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X size={14} />
            </button>
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-lg flex flex-col items-center justify-center shrink-0"
                style={{
                  backgroundColor: valueToColor(selectedElement[selectedProperty], min, max),
                }}
              >
                <span className="text-[10px] text-white/60">{selectedElement.z}</span>
                <span className="text-lg font-bold text-white">{selectedElement.symbol}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-100">{selectedElement.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Group {selectedElement.group}, Period {selectedElement.period}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  {ELECTRON_CONFIGS[selectedElement.z]}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  {PROPERTIES.map(p => (
                    <div key={p.key} className="flex items-center justify-between text-xs">
                      <span className={`${p.key === selectedProperty ? 'text-indigo-300' : 'text-slate-500'}`}>
                        {p.label}:
                      </span>
                      <span className={`font-medium ml-1 ${p.key === selectedProperty ? 'text-indigo-200' : 'text-slate-300'}`}>
                        {selectedElement[p.key]} {p.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discoveries checklist */}
      <div className="space-y-1">
        <span className="text-xs text-slate-500 font-medium">Discoveries</span>
        {DISCOVERIES.map(d => (
          <div
            key={d.id}
            className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
              discoveredTrends.has(d.id)
                ? 'text-emerald-300'
                : 'text-slate-500'
            }`}
          >
            <CheckCircle
              size={12}
              className={discoveredTrends.has(d.id) ? 'text-emerald-400' : 'text-slate-600'}
            />
            {d.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PeriodicTrendExplorer
