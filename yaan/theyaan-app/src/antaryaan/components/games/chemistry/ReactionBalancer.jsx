import { useState, useCallback, useMemo, useEffect, useRef } from 'react'

/**
 * ReactionBalancer - SVG/HTML visual equation balancer.
 *
 * Features:
 * - Shows unbalanced equations with molecule cluster visuals (SVG atom circles)
 * - Coefficients adjustable with +/- buttons
 * - Atom count table: rows turn green when balanced, red when unbalanced
 * - Multiple equations to cycle through
 * - onScore callback with percentage of correctly balanced equations
 * - Challenge mode: time pressure with visible countdown
 *
 * Equations:
 *   H2 + O2 -> H2O          (answer: 2,1 -> 2)
 *   N2 + H2 -> NH3           (answer: 1,3 -> 2)
 *   CH4 + O2 -> CO2 + H2O   (answer: 1,2 -> 1,2)
 *   Fe + O2 -> Fe2O3         (answer: 4,3 -> 2)
 *
 * No external dependencies beyond React.
 */

// ---------- Data ----------

const EQUATIONS = [
  {
    id: 'water',
    name: 'Water Synthesis',
    reactants: [
      { formula: 'H\u2082', atoms: { H: 2 }, color: '#60a5fa' },
      { formula: 'O\u2082', atoms: { O: 2 }, color: '#f87171' },
    ],
    products: [
      { formula: 'H\u2082O', atoms: { H: 2, O: 1 }, color: '#818cf8' },
    ],
    answer: { reactants: [2, 1], products: [2] },
  },
  {
    id: 'ammonia',
    name: 'Ammonia Synthesis',
    reactants: [
      { formula: 'N\u2082', atoms: { N: 2 }, color: '#818cf8' },
      { formula: 'H\u2082', atoms: { H: 2 }, color: '#60a5fa' },
    ],
    products: [
      { formula: 'NH\u2083', atoms: { N: 1, H: 3 }, color: '#a78bfa' },
    ],
    answer: { reactants: [1, 3], products: [2] },
  },
  {
    id: 'methane-combustion',
    name: 'Methane Combustion',
    reactants: [
      { formula: 'CH\u2084', atoms: { C: 1, H: 4 }, color: '#94a3b8' },
      { formula: 'O\u2082', atoms: { O: 2 }, color: '#f87171' },
    ],
    products: [
      { formula: 'CO\u2082', atoms: { C: 1, O: 2 }, color: '#475569' },
      { formula: 'H\u2082O', atoms: { H: 2, O: 1 }, color: '#818cf8' },
    ],
    answer: { reactants: [1, 2], products: [1, 2] },
  },
  {
    id: 'rust',
    name: 'Iron Oxidation',
    reactants: [
      { formula: 'Fe', atoms: { Fe: 1 }, color: '#f97316' },
      { formula: 'O\u2082', atoms: { O: 2 }, color: '#f87171' },
    ],
    products: [
      { formula: 'Fe\u2082O\u2083', atoms: { Fe: 2, O: 3 }, color: '#a16207' },
    ],
    answer: { reactants: [4, 3], products: [2] },
  },
]

/** Atom display colors */
const ATOM_COLORS = {
  H: '#60a5fa', O: '#f87171', N: '#818cf8', C: '#94a3b8', Fe: '#f97316',
}

// ---------- Helpers ----------

/** Count atoms on one side given molecules and their coefficients */
function countAtoms(molecules, coefficients) {
  const counts = {}
  molecules.forEach((mol, i) => {
    const coeff = coefficients[i] || 1
    Object.entries(mol.atoms).forEach(([atom, n]) => {
      counts[atom] = (counts[atom] || 0) + n * coeff
    })
  })
  return counts
}

/** Get all unique atom symbols from an equation */
function getAtomList(eq) {
  const atoms = new Set()
  ;[...eq.reactants, ...eq.products].forEach(mol => {
    Object.keys(mol.atoms).forEach(a => atoms.add(a))
  })
  return Array.from(atoms).sort()
}

// ---------- SVG Molecule Cluster ----------

/** Renders small colored atom circles for a molecule * coefficient */
function MoleculeCluster({ mol, coeff }) {
  const dots = []
  Object.entries(mol.atoms).forEach(([atom, count]) => {
    for (let c = 0; c < coeff; c++) {
      for (let j = 0; j < count; j++) {
        dots.push({ atom, key: `${atom}-${c}-${j}` })
      }
    }
  })
  const maxDots = Math.min(dots.length, 20)
  const cols = Math.min(maxDots, 5)
  const rows = Math.ceil(maxDots / cols)
  const r = 5
  const gap = r * 2.8
  const w = cols * gap + 4
  const h = rows * gap + 4

  return (
    <svg width={w} height={h} className="inline-block align-middle">
      {dots.slice(0, maxDots).map((d, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        return (
          <circle
            key={d.key}
            cx={r + 2 + col * gap}
            cy={r + 2 + row * gap}
            r={r}
            fill={ATOM_COLORS[d.atom] || '#64748b'}
            opacity={0.85}
          />
        )
      })}
      {dots.length > maxDots && (
        <text x={w / 2} y={h - 2} textAnchor="middle" fill="#94a3b8" fontSize={8}>
          +{dots.length - maxDots}
        </text>
      )}
    </svg>
  )
}

// ---------- Main Component ----------

function ReactionBalancer({
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
  const [eqIdx, setEqIdx] = useState(0)
  const [coefficients, setCoefficients] = useState(() => initCoeffs(0))
  const [solvedSet, setSolvedSet] = useState(new Set())
  const [showSuccess, setShowSuccess] = useState(false)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef(null)
  const successTimeoutRef = useRef(null)

  const isChallenge = mode === 'challenge'
  const eq = EQUATIONS[eqIdx]
  const atomList = useMemo(() => getAtomList(eq), [eq])

  /** Initialize coefficients for a given equation index (all start at 1) */
  function initCoeffs(idx) {
    const e = EQUATIONS[idx]
    return {
      reactants: e.reactants.map(() => 1),
      products: e.products.map(() => 1),
    }
  }

  // Challenge mode timer
  useEffect(() => {
    if (isChallenge && isPlaying) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000)
      return () => clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isChallenge, isPlaying])

  // Cleanup success timeout
  useEffect(() => {
    return () => { if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current) }
  }, [])

  // Count atoms on each side
  const leftCounts = useMemo(() => countAtoms(eq.reactants, coefficients.reactants), [eq, coefficients])
  const rightCounts = useMemo(() => countAtoms(eq.products, coefficients.products), [eq, coefficients])

  // Check if currently balanced (with at least one coefficient > 1)
  const isBalanced = useMemo(() => {
    const allMatch = atomList.every(a => (leftCounts[a] || 0) === (rightCounts[a] || 0))
    const hasNonOne = [...coefficients.reactants, ...coefficients.products].some(c => c > 1)
    return allMatch && hasNonOne
  }, [atomList, leftCounts, rightCounts, coefficients])

  // When balanced, mark equation as solved
  useEffect(() => {
    if (isBalanced && !solvedSet.has(eqIdx)) {
      const newSolved = new Set(solvedSet)
      newSolved.add(eqIdx)
      setSolvedSet(newSolved)
      setShowSuccess(true)
      successTimeoutRef.current = setTimeout(() => setShowSuccess(false), 2500)

      if (onScore) {
        onScore(Math.round((newSolved.size / EQUATIONS.length) * 100))
      }
      if (onGoalComplete) {
        onGoalComplete(eq.id)
      }
      if (newSolved.size === EQUATIONS.length && onComplete && !isComplete) {
        onComplete()
      }
    }
  }, [isBalanced, eqIdx, solvedSet, eq, onScore, onGoalComplete, onComplete, isComplete])

  // Adjust a coefficient
  const adjustCoeff = useCallback((side, idx, delta) => {
    setCoefficients(prev => {
      const updated = { ...prev, [side]: [...prev[side]] }
      updated[side][idx] = Math.max(1, Math.min(10, updated[side][idx] + delta))
      return updated
    })
    setShowSuccess(false)
  }, [])

  // Switch equation
  const switchEquation = useCallback((idx) => {
    setEqIdx(idx)
    setCoefficients(initCoeffs(idx))
    setShowSuccess(false)
  }, [])

  // Reset current equation
  const resetCurrent = useCallback(() => {
    setCoefficients(initCoeffs(eqIdx))
    setShowSuccess(false)
  }, [eqIdx])

  // ---------- Render ----------
  return (
    <div className="space-y-3">
      {/* Equation selector tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {EQUATIONS.map((e, i) => (
          <button
            key={e.id}
            onClick={() => switchEquation(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              i === eqIdx
                ? 'bg-indigo-600/30 border-indigo-500/50 text-white'
                : solvedSet.has(i)
                ? 'bg-emerald-600/15 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/40 hover:text-slate-200'
            }`}
          >
            {solvedSet.has(i) ? '\u2713 ' : ''}{e.name}
          </button>
        ))}

        {isChallenge && (
          <span className="ml-auto text-xs text-amber-400 font-mono tabular-nums">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Visual equation display */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-700/40 p-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Reactants */}
          {eq.reactants.map((mol, i) => (
            <div key={`r-${i}`} className="flex items-center gap-1">
              {i > 0 && <span className="text-slate-500 text-lg font-bold mx-1">+</span>}
              <div className="flex flex-col items-center gap-1.5">
                {/* Coefficient +/- controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustCoeff('reactants', i, -1)}
                    className="w-6 h-6 rounded bg-slate-700/60 text-slate-300 text-sm font-bold cursor-pointer hover:bg-slate-600/60 transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className={`w-8 text-center text-lg font-bold tabular-nums ${
                    coefficients.reactants[i] > 1 ? 'text-amber-300' : 'text-slate-500'
                  }`}>
                    {coefficients.reactants[i]}
                  </span>
                  <button
                    onClick={() => adjustCoeff('reactants', i, 1)}
                    className="w-6 h-6 rounded bg-slate-700/60 text-slate-300 text-sm font-bold cursor-pointer hover:bg-slate-600/60 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                {/* Molecule visual cluster + label */}
                <div className="bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/30 text-center min-w-[60px]">
                  <MoleculeCluster mol={mol} coeff={coefficients.reactants[i]} />
                  <div className="text-xs text-slate-300 font-medium mt-1">{mol.formula}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Arrow */}
          <span className="text-2xl text-slate-500 mx-3 font-bold select-none">{'\u2192'}</span>

          {/* Products */}
          {eq.products.map((mol, i) => (
            <div key={`p-${i}`} className="flex items-center gap-1">
              {i > 0 && <span className="text-slate-500 text-lg font-bold mx-1">+</span>}
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustCoeff('products', i, -1)}
                    className="w-6 h-6 rounded bg-slate-700/60 text-slate-300 text-sm font-bold cursor-pointer hover:bg-slate-600/60 transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className={`w-8 text-center text-lg font-bold tabular-nums ${
                    coefficients.products[i] > 1 ? 'text-amber-300' : 'text-slate-500'
                  }`}>
                    {coefficients.products[i]}
                  </span>
                  <button
                    onClick={() => adjustCoeff('products', i, 1)}
                    className="w-6 h-6 rounded bg-slate-700/60 text-slate-300 text-sm font-bold cursor-pointer hover:bg-slate-600/60 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700/30 text-center min-w-[60px]">
                  <MoleculeCluster mol={mol} coeff={coefficients.products[i]} />
                  <div className="text-xs text-slate-300 font-medium mt-1">{mol.formula}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Written equation string */}
        <div className="text-center mt-3 text-sm text-slate-300 font-mono select-none">
          {eq.reactants.map((m, i) => (
            <span key={`re-${i}`}>
              {i > 0 && ' + '}
              <span className={coefficients.reactants[i] > 1 ? 'text-amber-300 font-bold' : 'text-slate-500'}>
                {coefficients.reactants[i] > 1 ? coefficients.reactants[i] : ''}
              </span>
              {m.formula}
            </span>
          ))}
          <span className="text-slate-500 mx-2">{'\u2192'}</span>
          {eq.products.map((m, i) => (
            <span key={`pe-${i}`}>
              {i > 0 && ' + '}
              <span className={coefficients.products[i] > 1 ? 'text-amber-300 font-bold' : 'text-slate-500'}>
                {coefficients.products[i] > 1 ? coefficients.products[i] : ''}
              </span>
              {m.formula}
            </span>
          ))}
        </div>
      </div>

      {/* Atom count table */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-700/40 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700/40">
              <th className="px-3 py-2 text-left text-slate-500 font-medium">Atom</th>
              <th className="px-3 py-2 text-center text-slate-500 font-medium">Reactants</th>
              <th className="px-3 py-2 text-center text-slate-500 font-medium">Products</th>
              <th className="px-3 py-2 text-center text-slate-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {atomList.map((atom) => {
              const left = leftCounts[atom] || 0
              const right = rightCounts[atom] || 0
              const balanced = left === right
              return (
                <tr
                  key={atom}
                  className={`border-b border-slate-800/40 transition-colors ${
                    balanced ? 'bg-emerald-500/5' : 'bg-red-500/5'
                  }`}
                >
                  <td className="px-3 py-2 font-bold" style={{ color: ATOM_COLORS[atom] || '#94a3b8' }}>
                    {atom}
                  </td>
                  <td className="px-3 py-2 text-center text-slate-300 font-mono tabular-nums">{left}</td>
                  <td className="px-3 py-2 text-center text-slate-300 font-mono tabular-nums">{right}</td>
                  <td className="px-3 py-2 text-center">
                    {balanced ? (
                      <span className="text-emerald-400 font-bold">{'\u2713'} Balanced</span>
                    ) : (
                      <span className="text-red-400">
                        {'\u2717'} {left > right ? `+${left - right} left` : `+${right - left} right`}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetCurrent}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
        >
          Reset
        </button>

        {showSuccess && (
          <span className="text-sm text-emerald-400 font-medium animate-pulse">
            {'\u2713'} Equation balanced!
          </span>
        )}

        {/* Auto-advance button */}
        {solvedSet.has(eqIdx) && eqIdx < EQUATIONS.length - 1 && (
          <button
            onClick={() => switchEquation(eqIdx + 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 cursor-pointer transition-colors"
          >
            Next equation {'\u2192'}
          </button>
        )}

        <span className="ml-auto text-xs text-slate-500">
          {solvedSet.size}/{EQUATIONS.length} balanced
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${(solvedSet.size / EQUATIONS.length) * 100}%` }}
        />
      </div>

      {/* Hint text */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
        <p className="text-xs text-slate-400 leading-relaxed">
          Adjust the coefficients so each element has the same atom count on both sides.
          The law of conservation of mass: atoms are neither created nor destroyed.
          {isChallenge && ' Challenge mode: balance all equations as fast as you can!'}
        </p>
      </div>
    </div>
  )
}

export default ReactionBalancer
