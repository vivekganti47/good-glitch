import { useState, useCallback, useEffect, useMemo } from 'react'

/**
 * ChromosomeCounter - SVG side-by-side comparison of mitosis vs meiosis.
 *
 * Two panels: left = Mitosis, right = Meiosis.
 * Step through stages with Next/Prev buttons.
 * Chromosome illustrations as simplified colored bars at each stage.
 * Chromosome count (2n / n) displayed at each stage.
 *
 * Discoveries:
 *   'mitosis-conserves' - user sees 2n maintained at end of mitosis
 *   'meiosis-halves'    - user sees n at end of meiosis
 *   'crossing-over'     - user steps through Prophase I
 */

/* ------------------------------------------------------------------ */
/*  Stage data                                                         */
/* ------------------------------------------------------------------ */

const MITOSIS_STAGES = [
  {
    id: 'interphase',
    name: 'Interphase',
    ploidy: '2n',
    chromosomes: 4,
    dnaMolecules: 8,
    description:
      'DNA has replicated. Each chromosome becomes two sister chromatids joined at the centromere. 2n = 4.',
  },
  {
    id: 'prophase',
    name: 'Prophase',
    ploidy: '2n',
    chromosomes: 4,
    dnaMolecules: 8,
    description:
      'Chromosomes condense and become visible. Nuclear envelope breaks down. Spindle fibres form at poles.',
  },
  {
    id: 'metaphase',
    name: 'Metaphase',
    ploidy: '2n',
    chromosomes: 4,
    dnaMolecules: 8,
    description:
      'All chromosomes align individually along the metaphase plate. Spindle fibres attach to centromeres.',
  },
  {
    id: 'anaphase',
    name: 'Anaphase',
    ploidy: '4n (transient)',
    chromosomes: 8,
    dnaMolecules: 8,
    description:
      'Sister chromatids separate and are pulled to opposite poles. Chromosome count transiently doubles.',
  },
  {
    id: 'telophase',
    name: 'Telophase + Cytokinesis',
    ploidy: '2n each',
    chromosomes: 4,
    dnaMolecules: 4,
    description:
      'Nuclear envelopes reform around each set. Chromosomes decondense. Cell divides into two identical 2n daughter cells.',
  },
]

const MEIOSIS_STAGES = [
  {
    id: 'interphase',
    name: 'Interphase',
    ploidy: '2n',
    chromosomes: 4,
    dnaMolecules: 8,
    description:
      'DNA replicates once. Same starting point as mitosis: 2 homologous pairs, each replicated.',
  },
  {
    id: 'prophase-i',
    name: 'Prophase I',
    ploidy: '2n',
    chromosomes: 4,
    dnaMolecules: 8,
    crossingOver: true,
    description:
      'Homologous chromosomes pair up (synapsis). Crossing over exchanges segments between homologs, creating genetic variation.',
  },
  {
    id: 'metaphase-i',
    name: 'Metaphase I',
    ploidy: '2n',
    chromosomes: 4,
    dnaMolecules: 8,
    description:
      'Homologous PAIRS line up at the metaphase plate (not individual chromosomes). Independent assortment occurs.',
  },
  {
    id: 'anaphase-i',
    name: 'Anaphase I',
    ploidy: '2n \u2192 n',
    chromosomes: 4,
    dnaMolecules: 8,
    description:
      'Homologous chromosomes (not sister chromatids) separate. Each pole receives one homolog from each pair.',
  },
  {
    id: 'telophase-i',
    name: 'Telophase I',
    ploidy: 'n each',
    chromosomes: 2,
    dnaMolecules: 4,
    description:
      'Two haploid cells form, each with one replicated chromosome from each pair. No DNA replication before Meiosis II.',
  },
  {
    id: 'prophase-ii',
    name: 'Prophase II',
    ploidy: 'n each',
    chromosomes: 2,
    dnaMolecules: 4,
    description:
      'No DNA replication occurs. Spindle forms again in each haploid cell. Chromosomes re-condense.',
  },
  {
    id: 'metaphase-ii',
    name: 'Metaphase II',
    ploidy: 'n each',
    chromosomes: 2,
    dnaMolecules: 4,
    description:
      'Individual chromosomes line up at the metaphase plate in each cell (like mitosis metaphase).',
  },
  {
    id: 'anaphase-ii',
    name: 'Anaphase II',
    ploidy: 'n \u2192 n',
    chromosomes: 4,
    dnaMolecules: 4,
    description:
      'Sister chromatids finally separate in each cell. Each pole gets one chromatid.',
  },
  {
    id: 'telophase-ii',
    name: 'Telophase II (Result)',
    ploidy: 'n each',
    chromosomes: 2,
    dnaMolecules: 2,
    description:
      'Four genetically unique haploid daughter cells. Each has half the original chromosome number.',
  },
]

/* ------------------------------------------------------------------ */
/*  SVG chromosome helpers                                             */
/* ------------------------------------------------------------------ */

/** X-shaped replicated chromosome */
function ChromX({ cx, cy, color, size = 12, opacity = 1 }) {
  return (
    <g opacity={opacity}>
      <line x1={cx - size * 0.4} y1={cy - size * 0.5} x2={cx + size * 0.4} y2={cy + size * 0.5}
        stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={cx + size * 0.4} y1={cy - size * 0.5} x2={cx - size * 0.4} y2={cy + size * 0.5}
        stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={1.8} fill={color} />
    </g>
  )
}

/** Single chromatid (bar) */
function ChromBar({ cx, cy, color, size = 12, opacity = 1 }) {
  return (
    <line x1={cx} y1={cy - size * 0.55} x2={cx} y2={cy + size * 0.55}
      stroke={color} strokeWidth={2.5} strokeLinecap="round" opacity={opacity} />
  )
}

const COLORS = {
  p1a: '#ef4444', p1b: '#f87171',
  p2a: '#3b82f6', p2b: '#60a5fa',
}

/* ------------------------------------------------------------------ */
/*  Mitosis SVG panel                                                  */
/* ------------------------------------------------------------------ */

function MitosisSVG({ stage, w, h }) {
  const cx = w / 2, cy = h / 2
  const r = Math.min(w, h) * 0.38
  const c = COLORS
  const showCell = stage.id !== 'telophase'

  const chroms = (() => {
    switch (stage.id) {
      case 'interphase':
        return (
          <g>
            <ChromX cx={cx - 20} cy={cy - 12} color={c.p1a} />
            <ChromX cx={cx + 5} cy={cy - 15} color={c.p1b} />
            <ChromX cx={cx - 15} cy={cy + 15} color={c.p2a} />
            <ChromX cx={cx + 15} cy={cy + 10} color={c.p2b} />
          </g>
        )
      case 'prophase':
        return (
          <g>
            <ChromX cx={cx - 18} cy={cy - 14} color={c.p1a} size={14} />
            <ChromX cx={cx + 8} cy={cy - 16} color={c.p1b} size={14} />
            <ChromX cx={cx - 12} cy={cy + 16} color={c.p2a} size={14} />
            <ChromX cx={cx + 18} cy={cy + 12} color={c.p2b} size={14} />
          </g>
        )
      case 'metaphase':
        return (
          <g>
            <line x1={cx} y1={cy - r * 0.85} x2={cx} y2={cy + r * 0.85}
              stroke="#475569" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.4} />
            <ChromX cx={cx} cy={cy - 24} color={c.p1a} size={14} />
            <ChromX cx={cx} cy={cy - 8} color={c.p1b} size={14} />
            <ChromX cx={cx} cy={cy + 8} color={c.p2a} size={14} />
            <ChromX cx={cx} cy={cy + 24} color={c.p2b} size={14} />
          </g>
        )
      case 'anaphase':
        return (
          <g>
            {/* Left pole */}
            <ChromBar cx={cx - r * 0.45} cy={cy - 14} color={c.p1a} />
            <ChromBar cx={cx - r * 0.45} cy={cy - 4} color={c.p1b} />
            <ChromBar cx={cx - r * 0.45} cy={cy + 6} color={c.p2a} />
            <ChromBar cx={cx - r * 0.45} cy={cy + 16} color={c.p2b} />
            {/* Right pole */}
            <ChromBar cx={cx + r * 0.45} cy={cy - 14} color={c.p1a} />
            <ChromBar cx={cx + r * 0.45} cy={cy - 4} color={c.p1b} />
            <ChromBar cx={cx + r * 0.45} cy={cy + 6} color={c.p2a} />
            <ChromBar cx={cx + r * 0.45} cy={cy + 16} color={c.p2b} />
            {/* Arrows */}
            <text x={cx - 8} y={cy + 3} fill="#94a3b8" fontSize={14} textAnchor="middle">{'\u2190'}</text>
            <text x={cx + 8} y={cy + 3} fill="#94a3b8" fontSize={14} textAnchor="middle">{'\u2192'}</text>
          </g>
        )
      case 'telophase':
        return (
          <g>
            {/* Two daughter cells */}
            <ellipse cx={cx - r * 0.5} cy={cy} rx={r * 0.4} ry={r * 0.8}
              fill="none" stroke="#334155" strokeDasharray="3 3" />
            <ellipse cx={cx + r * 0.5} cy={cy} rx={r * 0.4} ry={r * 0.8}
              fill="none" stroke="#334155" strokeDasharray="3 3" />
            {[c.p1a, c.p1b, c.p2a, c.p2b].map((col, i) => (
              <g key={i}>
                <ChromBar cx={cx - r * 0.5 + (i % 2 === 0 ? -6 : 6)} cy={cy + (i < 2 ? -8 : 8)}
                  color={col} size={10} />
                <ChromBar cx={cx + r * 0.5 + (i % 2 === 0 ? -6 : 6)} cy={cy + (i < 2 ? -8 : 8)}
                  color={col} size={10} />
              </g>
            ))}
            <text x={cx - r * 0.5} y={cy + r * 0.9} fill="#94a3b8" fontSize={9}
              textAnchor="middle" fontFamily="system-ui">2n</text>
            <text x={cx + r * 0.5} y={cy + r * 0.9} fill="#94a3b8" fontSize={9}
              textAnchor="middle" fontFamily="system-ui">2n</text>
          </g>
        )
      default:
        return null
    }
  })()

  return (
    <g>
      {showCell && (
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.85}
          fill="rgba(30,41,59,0.3)" stroke="rgba(148,163,184,0.3)" strokeWidth={1} />
      )}
      {chroms}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Meiosis SVG panel                                                  */
/* ------------------------------------------------------------------ */

function MeiosisSVG({ stage, w, h }) {
  const cx = w / 2, cy = h / 2
  const r = Math.min(w, h) * 0.38
  const c = COLORS
  const showMainCell = ['interphase', 'prophase-i', 'metaphase-i', 'anaphase-i'].includes(stage.id)

  const chroms = (() => {
    switch (stage.id) {
      case 'interphase':
        return (
          <g>
            <ChromX cx={cx - 20} cy={cy - 12} color={c.p1a} />
            <ChromX cx={cx + 5} cy={cy - 15} color={c.p1b} />
            <ChromX cx={cx - 15} cy={cy + 15} color={c.p2a} />
            <ChromX cx={cx + 15} cy={cy + 10} color={c.p2b} />
          </g>
        )
      case 'prophase-i':
        return (
          <g>
            {/* Bivalent 1 - synapsed homologs with crossing over */}
            <ChromX cx={cx - 14} cy={cy - 12} color={c.p1a} size={14} />
            <ChromX cx={cx - 2} cy={cy - 12} color={c.p1b} size={14} />
            {/* Crossing over line */}
            <line x1={cx - 10} y1={cy - 18} x2={cx + 2} y2={cy - 6}
              stroke="#fbbf24" strokeWidth={2} opacity={0.8} />
            <text x={cx + 14} y={cy - 16} fill="#fbbf24" fontSize={7}
              fontFamily="system-ui">crossing over</text>
            {/* Bivalent 2 */}
            <ChromX cx={cx - 10} cy={cy + 16} color={c.p2a} size={14} />
            <ChromX cx={cx + 4} cy={cy + 16} color={c.p2b} size={14} />
          </g>
        )
      case 'metaphase-i':
        return (
          <g>
            <line x1={cx} y1={cy - r * 0.8} x2={cx} y2={cy + r * 0.8}
              stroke="#475569" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.4} />
            {/* Pair 1 at plate */}
            <ChromX cx={cx - 6} cy={cy - 14} color={c.p1a} size={13} />
            <ChromX cx={cx + 6} cy={cy - 14} color={c.p1b} size={13} />
            {/* Pair 2 at plate */}
            <ChromX cx={cx - 6} cy={cy + 14} color={c.p2a} size={13} />
            <ChromX cx={cx + 6} cy={cy + 14} color={c.p2b} size={13} />
            <text x={cx + r * 0.55} y={cy - 8} fill="#f59e0b" fontSize={7}
              fontFamily="system-ui" textAnchor="middle">Independent</text>
            <text x={cx + r * 0.55} y={cy + 2} fill="#f59e0b" fontSize={7}
              fontFamily="system-ui" textAnchor="middle">Assortment</text>
          </g>
        )
      case 'anaphase-i':
        return (
          <g>
            {/* Homologs separating (NOT sister chromatids) */}
            <ChromX cx={cx - r * 0.45} cy={cy - 10} color={c.p1a} size={12} />
            <ChromX cx={cx - r * 0.45} cy={cy + 10} color={c.p2a} size={12} />
            <ChromX cx={cx + r * 0.45} cy={cy - 10} color={c.p1b} size={12} />
            <ChromX cx={cx + r * 0.45} cy={cy + 10} color={c.p2b} size={12} />
            <text x={cx} y={cy + 3} fill="#94a3b8" fontSize={10} textAnchor="middle">{'\u2190  \u2192'}</text>
          </g>
        )
      case 'telophase-i':
        return (
          <g>
            <ellipse cx={cx - r * 0.5} cy={cy} rx={r * 0.4} ry={r * 0.75}
              fill="none" stroke="#334155" strokeDasharray="3 3" />
            <ChromX cx={cx - r * 0.5} cy={cy - 10} color={c.p1a} size={11} />
            <ChromX cx={cx - r * 0.5} cy={cy + 10} color={c.p2a} size={11} />
            <ellipse cx={cx + r * 0.5} cy={cy} rx={r * 0.4} ry={r * 0.75}
              fill="none" stroke="#334155" strokeDasharray="3 3" />
            <ChromX cx={cx + r * 0.5} cy={cy - 10} color={c.p1b} size={11} />
            <ChromX cx={cx + r * 0.5} cy={cy + 10} color={c.p2b} size={11} />
            <text x={cx - r * 0.5} y={cy + r * 0.85} fill="#94a3b8" fontSize={8}
              textAnchor="middle" fontFamily="system-ui">n</text>
            <text x={cx + r * 0.5} y={cy + r * 0.85} fill="#94a3b8" fontSize={8}
              textAnchor="middle" fontFamily="system-ui">n</text>
          </g>
        )
      case 'prophase-ii':
      case 'metaphase-ii': {
        const showPlate = stage.id === 'metaphase-ii'
        return (
          <g>
            <ellipse cx={cx - r * 0.5} cy={cy} rx={r * 0.38} ry={r * 0.7}
              fill="none" stroke="#334155" />
            <ellipse cx={cx + r * 0.5} cy={cy} rx={r * 0.38} ry={r * 0.7}
              fill="none" stroke="#334155" />
            {showPlate && (
              <>
                <line x1={cx - r * 0.5} y1={cy - r * 0.6} x2={cx - r * 0.5} y2={cy + r * 0.6}
                  stroke="#475569" strokeWidth={0.5} strokeDasharray="2 2" opacity={0.3} />
                <line x1={cx + r * 0.5} y1={cy - r * 0.6} x2={cx + r * 0.5} y2={cy + r * 0.6}
                  stroke="#475569" strokeWidth={0.5} strokeDasharray="2 2" opacity={0.3} />
              </>
            )}
            <ChromX cx={cx - r * 0.5} cy={cy - 10} color={c.p1a} size={12} />
            <ChromX cx={cx - r * 0.5} cy={cy + 10} color={c.p2a} size={12} />
            <ChromX cx={cx + r * 0.5} cy={cy - 10} color={c.p1b} size={12} />
            <ChromX cx={cx + r * 0.5} cy={cy + 10} color={c.p2b} size={12} />
          </g>
        )
      }
      case 'anaphase-ii':
        return (
          <g>
            <ellipse cx={cx - r * 0.5} cy={cy} rx={r * 0.38} ry={r * 0.7}
              fill="none" stroke="#334155" />
            <ellipse cx={cx + r * 0.5} cy={cy} rx={r * 0.38} ry={r * 0.7}
              fill="none" stroke="#334155" />
            {/* Left cell: chromatids separating */}
            <ChromBar cx={cx - r * 0.5 - 12} cy={cy - 6} color={c.p1a} size={9} />
            <ChromBar cx={cx - r * 0.5 - 12} cy={cy + 6} color={c.p2a} size={9} />
            <ChromBar cx={cx - r * 0.5 + 12} cy={cy - 6} color={c.p1a} size={9} />
            <ChromBar cx={cx - r * 0.5 + 12} cy={cy + 6} color={c.p2a} size={9} />
            {/* Right cell */}
            <ChromBar cx={cx + r * 0.5 - 12} cy={cy - 6} color={c.p1b} size={9} />
            <ChromBar cx={cx + r * 0.5 - 12} cy={cy + 6} color={c.p2b} size={9} />
            <ChromBar cx={cx + r * 0.5 + 12} cy={cy - 6} color={c.p1b} size={9} />
            <ChromBar cx={cx + r * 0.5 + 12} cy={cy + 6} color={c.p2b} size={9} />
          </g>
        )
      case 'telophase-ii':
        return (
          <g>
            {[
              { dx: -r * 0.6, dy: -r * 0.35, c1: c.p1a, c2: c.p2a },
              { dx: -r * 0.2, dy: r * 0.35, c1: c.p1a, c2: c.p2a },
              { dx: r * 0.2, dy: -r * 0.35, c1: c.p1b, c2: c.p2b },
              { dx: r * 0.6, dy: r * 0.35, c1: c.p1b, c2: c.p2b },
            ].map(({ dx, dy, c1, c2 }, i) => (
              <g key={i}>
                <circle cx={cx + dx} cy={cy + dy} r={r * 0.28}
                  fill="none" stroke="#334155" strokeDasharray="3 3" />
                <ChromBar cx={cx + dx - 4} cy={cy + dy} color={c1} size={8} />
                <ChromBar cx={cx + dx + 4} cy={cy + dy} color={c2} size={8} />
                <text x={cx + dx} y={cy + dy + r * 0.35} fill="#94a3b8" fontSize={7}
                  textAnchor="middle" fontFamily="system-ui">n</text>
              </g>
            ))}
          </g>
        )
      default:
        return null
    }
  })()

  return (
    <g>
      {showMainCell && (
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.85}
          fill="rgba(30,41,59,0.3)" stroke="rgba(148,163,184,0.3)" strokeWidth={1} />
      )}
      {chroms}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ChromosomeCounter({
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
  const maxSteps = Math.max(MITOSIS_STAGES.length, MEIOSIS_STAGES.length)
  const [step, setStep] = useState(0)
  const [discovered, setDiscovered] = useState(new Set())

  const mitosisStage = MITOSIS_STAGES[Math.min(step, MITOSIS_STAGES.length - 1)]
  const meiosisStage = MEIOSIS_STAGES[Math.min(step, MEIOSIS_STAGES.length - 1)]

  const mitosisEnded = step >= MITOSIS_STAGES.length - 1
  const meiosisEnded = step >= MEIOSIS_STAGES.length - 1
  const allDone = mitosisEnded && meiosisEnded

  /* ---------- Discovery triggers ---------- */
  const triggerDiscovery = useCallback((id) => {
    setDiscovered((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      if (onDiscovery) onDiscovery(id)
      return next
    })
  }, [onDiscovery])

  useEffect(() => {
    // Mitosis end: 2n maintained
    if (mitosisEnded) triggerDiscovery('mitosis-conserves')
  }, [mitosisEnded, triggerDiscovery])

  useEffect(() => {
    // Meiosis end: n at end
    if (meiosisEnded) triggerDiscovery('meiosis-halves')
  }, [meiosisEnded, triggerDiscovery])

  useEffect(() => {
    // Crossing over: visiting Prophase I
    if (meiosisStage.crossingOver) triggerDiscovery('crossing-over')
  }, [meiosisStage, triggerDiscovery])

  /* ---------- Handlers ---------- */
  const handleNext = useCallback(() => {
    if (step < maxSteps - 1) setStep((s) => s + 1)
  }, [step, maxSteps])

  const handlePrev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1)
  }, [step])

  const handleReset = useCallback(() => setStep(0), [])

  /* ---------- SVG layout ---------- */
  const vw = 800, vh = 400
  const panelW = 370, panelH = 280

  /* ---------- Stats rows ---------- */
  const statsRows = useMemo(() => [
    { label: 'Chromosomes', mVal: mitosisStage.chromosomes, meVal: meiosisStage.chromosomes },
    { label: 'DNA molecules', mVal: mitosisStage.dnaMolecules, meVal: meiosisStage.dnaMolecules },
    { label: 'Ploidy', mVal: mitosisStage.ploidy, meVal: meiosisStage.ploidy },
  ], [mitosisStage, meiosisStage])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 uppercase tracking-wider">
          Mitosis vs Meiosis
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-slate-400 tabular-nums">
            Step {step + 1}/{maxSteps}
          </span>
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            title="Reset"
          >
            {'\u21BA'}
          </button>
        </div>
      </div>

      {/* SVG viewport */}
      <div className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40"
        style={{ minHeight: 300, maxHeight: 500 }}>
        <svg viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet" className="block w-full">
          <rect width={vw} height={vh} fill="#0A0E1A" opacity={0.6} />

          {/* Divider */}
          <line x1={vw / 2} y1={30} x2={vw / 2} y2={vh - 10}
            stroke="#334155" strokeWidth={1} strokeDasharray="4 4" />

          {/* Panel headers */}
          <text x={vw * 0.25} y={25} textAnchor="middle" fill="#818cf8" fontSize={14}
            fontWeight={700} fontFamily="system-ui, sans-serif">MITOSIS</text>
          <text x={vw * 0.75} y={25} textAnchor="middle" fill="#f59e0b" fontSize={14}
            fontWeight={700} fontFamily="system-ui, sans-serif">MEIOSIS</text>

          {/* Mitosis panel */}
          <g transform={`translate(${(vw / 2 - panelW) / 2}, 40)`}>
            <rect width={panelW} height={panelH - 60} rx={8}
              fill="rgba(99,102,241,0.05)" stroke="rgba(99,102,241,0.2)" strokeWidth={1} />
            <text x={panelW / 2} y={20} textAnchor="middle" fill="#818cf8" fontSize={11}
              fontWeight={600} fontFamily="system-ui, sans-serif">{mitosisStage.name}</text>
            <g transform="translate(0, 20)">
              <MitosisSVG stage={mitosisStage} w={panelW} h={panelH - 100} />
            </g>
          </g>

          {/* Meiosis panel */}
          <g transform={`translate(${vw / 2 + (vw / 2 - panelW) / 2}, 40)`}>
            <rect width={panelW} height={panelH - 60} rx={8}
              fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.2)" strokeWidth={1} />
            <text x={panelW / 2} y={20} textAnchor="middle" fill="#f59e0b" fontSize={11}
              fontWeight={600} fontFamily="system-ui, sans-serif">{meiosisStage.name}</text>
            <g transform="translate(0, 20)">
              <MeiosisSVG stage={meiosisStage} w={panelW} h={panelH - 100} />
            </g>
          </g>

          {/* Stats table */}
          {statsRows.map((row, i) => {
            const y = panelH + 8 + i * 22
            return (
              <g key={row.label}>
                <rect x={20} y={y} width={vw - 40} height={20} rx={4}
                  fill={i % 2 === 0 ? 'rgba(30,41,59,0.4)' : 'rgba(30,41,59,0.2)'} />
                <text x={vw / 2} y={y + 14} textAnchor="middle" fill="#64748b" fontSize={10}
                  fontFamily="system-ui">{row.label}</text>
                <text x={vw * 0.25} y={y + 14} textAnchor="middle" fill="#818cf8" fontSize={11}
                  fontWeight={600} fontFamily="monospace">{row.mVal}</text>
                <text x={vw * 0.75} y={y + 14} textAnchor="middle" fill="#f59e0b" fontSize={11}
                  fontWeight={600} fontFamily="monospace">{row.meVal}</text>
              </g>
            )
          })}

          {/* Description snippets */}
          <text x={vw * 0.25} y={vh - 18} textAnchor="middle" fill="#94a3b8" fontSize={8}
            fontFamily="system-ui">
            {mitosisStage.description.length > 60
              ? mitosisStage.description.slice(0, 57) + '...'
              : mitosisStage.description}
          </text>
          <text x={vw * 0.75} y={vh - 18} textAnchor="middle" fill="#94a3b8" fontSize={8}
            fontFamily="system-ui">
            {meiosisStage.description.length > 60
              ? meiosisStage.description.slice(0, 57) + '...'
              : meiosisStage.description}
          </text>
        </svg>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled={step === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700/40 text-slate-300 text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-700/60 transition-colors"
        >
          {'\u25C0'} Previous
        </button>
        <button
          onClick={handleNext}
          disabled={allDone}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600/80 border border-indigo-500/40 text-white text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-indigo-500/80 transition-colors"
        >
          Next Stage {'\u25B6'}
        </button>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="px-3 py-2 rounded-lg bg-indigo-500/5 border border-indigo-500/15">
          <p className="text-xs text-indigo-300 font-semibold">{mitosisStage.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{mitosisStage.description}</p>
        </div>
        <div className="px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
          <p className="text-xs text-amber-300 font-semibold">{meiosisStage.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{meiosisStage.description}</p>
        </div>
      </div>

      {/* Completion summary */}
      {allDone && (
        <div className="text-center py-2 animate-pulse">
          <p className="text-xs text-slate-400">
            <span className="text-indigo-300 font-semibold">Mitosis</span>: 1 division {'\u2192'} 2 identical diploid cells (2n) |{' '}
            <span className="text-amber-300 font-semibold">Meiosis</span>: 2 divisions {'\u2192'} 4 unique haploid cells (n)
          </p>
        </div>
      )}
    </div>
  )
}
