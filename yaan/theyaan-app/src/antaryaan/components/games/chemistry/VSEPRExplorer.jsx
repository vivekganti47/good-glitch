import { useState, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, RotateCcw, CheckCircle, X, Eye } from 'lucide-react'

/**
 * VSEPR Explorer - add bonding/lone pairs and see 3D molecular geometry.
 *
 * Uses CSS 3D transforms with perspective for molecule visualization.
 * Includes predict mode where user selects shape before revealing.
 */

// VSEPR lookup table: [bondingPairs][lonePairs] => { geometry, shape, angles }
const VSEPR_TABLE = {
  '2-0': { geometry: 'Linear', shape: 'Linear', angles: '180\u00B0', positions: [[0, 0, 1], [0, 0, -1]] },
  '3-0': { geometry: 'Trigonal Planar', shape: 'Trigonal Planar', angles: '120\u00B0', positions: [[0, 0, 1], [0.866, 0, -0.5], [-0.866, 0, -0.5]] },
  '2-1': { geometry: 'Trigonal Planar', shape: 'Bent', angles: '~117\u00B0', positions: [[0, 0, 1], [0.866, 0, -0.5]], lonePairPos: [[-0.866, 0, -0.5]] },
  '4-0': { geometry: 'Tetrahedral', shape: 'Tetrahedral', angles: '109.5\u00B0', positions: [[0, 1, 0], [0.943, -0.333, 0], [-0.471, -0.333, 0.816], [-0.471, -0.333, -0.816]] },
  '3-1': { geometry: 'Tetrahedral', shape: 'Trigonal Pyramidal', angles: '~107\u00B0', positions: [[0, 1, 0], [0.943, -0.333, 0], [-0.471, -0.333, 0.816]], lonePairPos: [[-0.471, -0.333, -0.816]] },
  '2-2': { geometry: 'Tetrahedral', shape: 'Bent', angles: '~104.5\u00B0', positions: [[0, 1, 0], [0.943, -0.333, 0]], lonePairPos: [[-0.471, -0.333, 0.816], [-0.471, -0.333, -0.816]] },
  '5-0': { geometry: 'Trigonal Bipyramidal', shape: 'Trigonal Bipyramidal', angles: '90\u00B0, 120\u00B0', positions: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-0.5, 0, 0.866], [-0.5, 0, -0.866]] },
  '4-1': { geometry: 'Trigonal Bipyramidal', shape: 'Seesaw', angles: '~90\u00B0, ~120\u00B0', positions: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-0.5, 0, 0.866]], lonePairPos: [[-0.5, 0, -0.866]] },
  '3-2': { geometry: 'Trigonal Bipyramidal', shape: 'T-shaped', angles: '~90\u00B0', positions: [[0, 1, 0], [0, -1, 0], [1, 0, 0]], lonePairPos: [[-0.5, 0, 0.866], [-0.5, 0, -0.866]] },
  '2-3': { geometry: 'Trigonal Bipyramidal', shape: 'Linear', angles: '180\u00B0', positions: [[0, 1, 0], [0, -1, 0]], lonePairPos: [[1, 0, 0], [-0.5, 0, 0.866], [-0.5, 0, -0.866]] },
  '6-0': { geometry: 'Octahedral', shape: 'Octahedral', angles: '90\u00B0', positions: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]] },
  '5-1': { geometry: 'Octahedral', shape: 'Square Pyramidal', angles: '~90\u00B0', positions: [[0, 1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]], lonePairPos: [[0, -1, 0]] },
  '4-2': { geometry: 'Octahedral', shape: 'Square Planar', angles: '90\u00B0', positions: [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]], lonePairPos: [[0, 1, 0], [0, -1, 0]] },
}

const ALL_SHAPES = [
  'Linear', 'Bent', 'Trigonal Planar', 'Trigonal Pyramidal',
  'Tetrahedral', 'Seesaw', 'T-shaped', 'Trigonal Bipyramidal',
  'Square Planar', 'Square Pyramidal', 'Octahedral',
]

function rotatePoint(x, y, z, rotX, rotY) {
  // Rotate around Y axis
  const cosY = Math.cos(rotY)
  const sinY = Math.sin(rotY)
  let x1 = x * cosY + z * sinY
  let z1 = -x * sinY + z * cosY

  // Rotate around X axis
  const cosX = Math.cos(rotX)
  const sinX = Math.sin(rotX)
  let y1 = y * cosX - z1 * sinX
  let z2 = y * sinX + z1 * cosX

  return { x: x1, y: y1, z: z2 }
}

function project(x, y, z, perspective = 400) {
  const scale = perspective / (perspective + z * 80)
  return {
    x: x * 80 * scale,
    y: y * 80 * scale,
    scale,
    z,
  }
}

function VSEPRExplorer({
  config,
  params,
  onParamChange,
  onDiscovery,
  onComplete,
  isComplete,
  containerWidth = 800,
  containerHeight = 500,
}) {
  const [bondingPairs, setBondingPairs] = useState(4)
  const [lonePairs, setLonePairs] = useState(0)
  const [rotX, setRotX] = useState(-0.3)
  const [rotY, setRotY] = useState(0.5)
  const [isDragging, setIsDragging] = useState(false)
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 })
  const [predictMode, setPredictMode] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [correctPredictions, setCorrectPredictions] = useState(0)
  const containerRef = useRef(null)

  const key = `${bondingPairs}-${lonePairs}`
  const vsepData = VSEPR_TABLE[key]

  const total = bondingPairs + lonePairs

  const handleAddBP = useCallback(() => {
    if (bondingPairs + lonePairs >= 6) return
    setBondingPairs(bp => bp + 1)
    setShowResult(false)
    setPrediction(null)
  }, [bondingPairs, lonePairs])

  const handleRemoveBP = useCallback(() => {
    if (bondingPairs <= 2) return
    setBondingPairs(bp => bp - 1)
    setShowResult(false)
    setPrediction(null)
  }, [bondingPairs])

  const handleAddLP = useCallback(() => {
    if (bondingPairs + lonePairs >= 6) return
    setLonePairs(lp => lp + 1)
    setShowResult(false)
    setPrediction(null)
  }, [bondingPairs, lonePairs])

  const handleRemoveLP = useCallback(() => {
    if (lonePairs <= 0) return
    setLonePairs(lp => lp - 1)
    setShowResult(false)
    setPrediction(null)
  }, [lonePairs])

  const handleReset = useCallback(() => {
    setBondingPairs(4)
    setLonePairs(0)
    setRotX(-0.3)
    setRotY(0.5)
    setShowResult(false)
    setPrediction(null)
  }, [])

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    const dx = e.clientX - lastMouse.x
    const dy = e.clientY - lastMouse.y
    setRotY(prev => prev + dx * 0.01)
    setRotX(prev => prev + dy * 0.01)
    setLastMouse({ x: e.clientX, y: e.clientY })
  }, [isDragging, lastMouse])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - lastMouse.x
    const dy = e.touches[0].clientY - lastMouse.y
    setRotY(prev => prev + dx * 0.01)
    setRotX(prev => prev + dy * 0.01)
    setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }, [isDragging, lastMouse])

  const handlePredict = useCallback((shape) => {
    setPrediction(shape)
    if (vsepData) {
      const correct = shape === vsepData.shape
      setShowResult(true)
      if (correct) {
        setCorrectPredictions(prev => prev + 1)
        if (onDiscovery) onDiscovery(`vsepr-${key}`)
      }
    }
  }, [vsepData, key, onDiscovery])

  // Render 3D molecule
  const renderMolecule = useMemo(() => {
    if (!vsepData) return null

    const cx = 200
    const cy = 175
    const elements = []

    // Central atom
    const central = project(0, 0, 0)
    elements.push({
      type: 'central',
      x: cx + central.x,
      y: cy + central.y,
      z: central.z,
      scale: central.scale,
    })

    // Bonding pairs
    const showGeometry = !predictMode || showResult
    if (showGeometry) {
      vsepData.positions.forEach((pos, i) => {
        const rotated = rotatePoint(pos[0], pos[1], pos[2], rotX, rotY)
        const projected = project(rotated.x, rotated.y, rotated.z)
        elements.push({
          type: 'bond',
          x: cx + projected.x,
          y: cy + projected.y,
          z: rotated.z,
          scale: projected.scale,
          idx: i,
          ox: cx,
          oy: cy,
        })
      })

      // Lone pairs
      if (vsepData.lonePairPos) {
        vsepData.lonePairPos.forEach((pos, i) => {
          const rotated = rotatePoint(pos[0], pos[1], pos[2], rotX, rotY)
          const projected = project(rotated.x, rotated.y, rotated.z)
          elements.push({
            type: 'lonepair',
            x: cx + projected.x,
            y: cy + projected.y,
            z: rotated.z,
            scale: projected.scale,
            idx: i,
            ox: cx,
            oy: cy,
          })
        })
      }
    }

    // Sort by z for painter's algorithm
    elements.sort((a, b) => a.z - b.z)

    return elements
  }, [vsepData, rotX, rotY, predictMode, showResult])

  return (
    <div className="space-y-3">
      {/* Controls row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Bonding pairs */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Bonding Pairs:</span>
          <button
            onClick={handleRemoveBP}
            disabled={bondingPairs <= 2}
            className="p-1 rounded bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm text-slate-200 font-bold w-5 text-center">{bondingPairs}</span>
          <button
            onClick={handleAddBP}
            disabled={total >= 6}
            className="p-1 rounded bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Lone pairs */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Lone Pairs:</span>
          <button
            onClick={handleRemoveLP}
            disabled={lonePairs <= 0}
            className="p-1 rounded bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm text-slate-200 font-bold w-5 text-center">{lonePairs}</span>
          <button
            onClick={handleAddLP}
            disabled={total >= 6}
            className="p-1 rounded bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Predict toggle */}
        <button
          onClick={() => { setPredictMode(!predictMode); setShowResult(false); setPrediction(null) }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            predictMode
              ? 'bg-amber-600/80 text-white'
              : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200'
          }`}
        >
          <Eye size={12} />
          {predictMode ? 'Predict Mode ON' : 'Predict Mode'}
        </button>

        <button
          onClick={handleReset}
          className="ml-auto p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Predict mode shape selector */}
      <AnimatePresence>
        {predictMode && !showResult && vsepData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-amber-300/70 mb-2">
              Predict the molecular shape for {bondingPairs} bonding pairs and {lonePairs} lone pair{lonePairs !== 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SHAPES.map(shape => (
                <button
                  key={shape}
                  onClick={() => handlePredict(shape)}
                  className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                    prediction === shape
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800/60 text-slate-400 border border-slate-700/40 hover:text-slate-200'
                  }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prediction result */}
      <AnimatePresence>
        {showResult && prediction && vsepData && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
              prediction === vsepData.shape
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-300 border border-red-500/20'
            }`}
          >
            {prediction === vsepData.shape ? <CheckCircle size={14} /> : <X size={14} />}
            {prediction === vsepData.shape
              ? `Correct! The shape is ${vsepData.shape}.`
              : `Not quite. The shape is ${vsepData.shape}, not ${prediction}.`
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Molecule Visualization */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40 select-none"
        style={{ minHeight: 320, maxHeight: containerHeight || 450 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <svg
          viewBox="0 0 400 350"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full touch-none cursor-grab active:cursor-grabbing"
        >
          <rect width="400" height="350" fill="#0A0E1A" opacity="0.6" />

          {/* Grid */}
          <defs>
            <pattern id="vsepr-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.04)" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="lp-grad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <rect width="400" height="350" fill="url(#vsepr-grid)" />

          {vsepData && renderMolecule && renderMolecule.map((el, idx) => {
            if (el.type === 'central') {
              return (
                <circle
                  key="central"
                  cx={el.x}
                  cy={el.y}
                  r={18 * el.scale}
                  fill="#475569"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                />
              )
            }

            if (el.type === 'bond') {
              return (
                <g key={`bond-${el.idx}`}>
                  <line
                    x1={el.ox}
                    y1={el.oy}
                    x2={el.x}
                    y2={el.y}
                    stroke="#60a5fa"
                    strokeWidth={Math.max(1.5, 3 * el.scale)}
                    strokeLinecap="round"
                    opacity={0.6 + el.scale * 0.3}
                  />
                  <circle
                    cx={el.x}
                    cy={el.y}
                    r={12 * el.scale}
                    fill="#3b82f6"
                    stroke="#60a5fa"
                    strokeWidth={1}
                    opacity={0.6 + el.scale * 0.3}
                  />
                  <text
                    x={el.x}
                    y={el.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize={10 * el.scale}
                    fontWeight="bold"
                    opacity={0.6 + el.scale * 0.3}
                  >
                    X
                  </text>
                </g>
              )
            }

            if (el.type === 'lonepair') {
              return (
                <g key={`lp-${el.idx}`}>
                  <line
                    x1={el.ox}
                    y1={el.oy}
                    x2={el.x}
                    y2={el.y}
                    stroke="#a78bfa"
                    strokeWidth={Math.max(1, 2 * el.scale)}
                    strokeDasharray="4 3"
                    opacity={0.4 + el.scale * 0.2}
                  />
                  <ellipse
                    cx={el.x}
                    cy={el.y}
                    rx={14 * el.scale}
                    ry={10 * el.scale}
                    fill="url(#lp-grad)"
                    stroke="#a78bfa"
                    strokeWidth={0.8}
                    strokeDasharray="3 2"
                    opacity={0.4 + el.scale * 0.3}
                  />
                  <circle cx={el.x - 4 * el.scale} cy={el.y} r={2 * el.scale} fill="#a78bfa" opacity={0.5 + el.scale * 0.3} />
                  <circle cx={el.x + 4 * el.scale} cy={el.y} r={2 * el.scale} fill="#a78bfa" opacity={0.5 + el.scale * 0.3} />
                </g>
              )
            }

            return null
          })}

          {!vsepData && (
            <text x={200} y={175} textAnchor="middle" fill="#475569" fontSize={13}>
              Invalid combination ({bondingPairs} BP + {lonePairs} LP)
            </text>
          )}

          {/* Drag hint */}
          <text x={200} y={340} textAnchor="middle" fill="#334155" fontSize={10}>
            Drag to rotate the molecule
          </text>
        </svg>
      </div>

      {/* Info readouts */}
      {vsepData && (!predictMode || showResult) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Electron Geometry</span>
            <span className="text-sm text-slate-200 font-medium">{vsepData.geometry}</span>
          </div>
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Molecular Shape</span>
            <span className="text-sm text-indigo-300 font-medium">{vsepData.shape}</span>
          </div>
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Bond Angles</span>
            <span className="text-sm text-slate-200 font-medium">{vsepData.angles}</span>
          </div>
          <div className="rounded-lg bg-slate-800/60 border border-slate-700/40 px-3 py-2 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Steric Number</span>
            <span className="text-sm text-slate-200 font-medium">{bondingPairs + lonePairs}</span>
          </div>
        </div>
      )}

      {predictMode && (
        <div className="text-xs text-slate-500 text-center">
          Correct predictions: {correctPredictions}
        </div>
      )}
    </div>
  )
}

export default VSEPRExplorer
