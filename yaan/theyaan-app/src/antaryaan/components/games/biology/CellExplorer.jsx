import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Leaf, Bug } from 'lucide-react'

/**
 * CellExplorer - Interactive eukaryotic cell cross-section simulation.
 *
 * SVG illustration of a cell with clickable organelles. Hover highlights
 * with glow. Click opens detail card with name, structure, function, and
 * micro-animation. Toggles between Animal and Plant cell modes.
 */

const ORGANELLE_DATA = {
  nucleus: {
    name: 'Nucleus',
    structure: 'Double-membrane bound organelle with nuclear pores and nucleolus',
    function: 'Contains DNA, controls gene expression and cell activities',
    color: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.6)',
    animationType: 'pulse',
  },
  mitochondria: {
    name: 'Mitochondria',
    structure: 'Double-membrane with inner cristae folds increasing surface area',
    function: 'Cellular respiration: converts glucose + O2 into ATP (energy currency)',
    color: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.6)',
    animationType: 'atp',
  },
  roughER: {
    name: 'Rough Endoplasmic Reticulum',
    structure: 'Membrane-bound sheets studded with ribosomes, continuous with nuclear envelope',
    function: 'Synthesizes and folds proteins destined for membranes or secretion',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.6)',
    animationType: 'ribosomeMove',
  },
  smoothER: {
    name: 'Smooth Endoplasmic Reticulum',
    structure: 'Tubular membrane network without ribosomes',
    function: 'Lipid synthesis, detoxification, calcium storage',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.6)',
    animationType: 'wave',
  },
  golgi: {
    name: 'Golgi Apparatus',
    structure: 'Stack of flattened membrane sacs (cisternae) with cis and trans faces',
    function: 'Modifies, sorts, and packages proteins and lipids for transport',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    animationType: 'vesicle',
  },
  ribosomes: {
    name: 'Ribosomes',
    structure: 'Two-subunit complexes of rRNA and protein (60S + 40S in eukaryotes)',
    function: 'Translate mRNA into polypeptide chains (protein synthesis)',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    animationType: 'bounce',
  },
  lysosomes: {
    name: 'Lysosomes',
    structure: 'Single-membrane vesicles containing hydrolytic enzymes at pH ~5',
    function: 'Digest worn-out organelles, food particles, and pathogens',
    color: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.6)',
    animationType: 'digest',
  },
  membrane: {
    name: 'Cell Membrane',
    structure: 'Phospholipid bilayer with embedded proteins, cholesterol, and glycocalyx',
    function: 'Selective barrier controlling transport, signaling, and cell recognition',
    color: '#0ea5e9',
    glowColor: 'rgba(14, 165, 233, 0.6)',
    animationType: 'flow',
  },
  cytoskeleton: {
    name: 'Cytoskeleton',
    structure: 'Network of microfilaments (actin), intermediate filaments, and microtubules',
    function: 'Maintains cell shape, enables movement, organelle transport, and cell division',
    color: '#64748b',
    glowColor: 'rgba(100, 116, 139, 0.6)',
    animationType: 'pulse',
  },
  cellWall: {
    name: 'Cell Wall',
    structure: 'Rigid layer of cellulose fibrils outside the cell membrane',
    function: 'Provides structural support, prevents over-expansion, and protects the cell',
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.6)',
    animationType: 'pulse',
  },
  chloroplast: {
    name: 'Chloroplast',
    structure: 'Double-membrane organelle with thylakoid stacks (grana) and stroma',
    function: 'Photosynthesis: converts light energy + CO2 + H2O into glucose and O2',
    color: '#16a34a',
    glowColor: 'rgba(22, 163, 74, 0.6)',
    animationType: 'photon',
  },
  vacuole: {
    name: 'Central Vacuole',
    structure: 'Large membrane-bound compartment (tonoplast) filling up to 90% of plant cell',
    function: 'Stores water, nutrients, waste; maintains turgor pressure for rigidity',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    animationType: 'expand',
  },
}

function MicroAnimation({ type, color }) {
  switch (type) {
    case 'atp':
      return (
        <div className="flex items-center justify-center h-12 relative">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: '#fbbf24' }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [0, (Math.random() - 0.5) * 60],
                y: [0, (Math.random() - 0.5) * 30],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
          <span className="text-[10px] text-amber-400 font-bold z-10">ATP</span>
        </div>
      )
    case 'photon':
      return (
        <div className="flex items-center justify-center h-12 relative">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300"
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: [-20, 10],
                opacity: [0, 1, 0.8, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{ left: `${30 + i * 20}%` }}
            />
          ))}
          <motion.div
            className="w-8 h-3 rounded bg-green-500/40"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )
    case 'vesicle':
      return (
        <div className="flex items-center justify-center h-12 relative">
          <motion.div
            className="w-3 h-3 rounded-full border-2"
            style={{ borderColor: color }}
            animate={{ x: [0, 30], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="w-3 h-3 rounded-full border-2"
            style={{ borderColor: color }}
            animate={{ x: [0, 30], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      )
    case 'expand':
      return (
        <div className="flex items-center justify-center h-12">
          <motion.div
            className="rounded-full border-2"
            style={{ borderColor: color }}
            animate={{
              width: [20, 40, 20],
              height: [20, 40, 20],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      )
    default:
      return (
        <div className="flex items-center justify-center h-12">
          <motion.div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: color + '40' }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      )
  }
}

function DetailCard({ organelleKey, onClose }) {
  const data = ORGANELLE_DATA[organelleKey]
  if (!data) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-20"
    >
      <div
        className="rounded-xl border backdrop-blur-md p-4 shadow-xl"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderColor: data.color + '40',
          boxShadow: `0 0 30px ${data.glowColor}`,
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <h4 className="text-sm font-semibold text-slate-100">{data.name}</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        <MicroAnimation type={data.animationType} color={data.color} />

        <div className="mt-3 space-y-2">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Structure</p>
            <p className="text-xs text-slate-300 leading-relaxed">{data.structure}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Function</p>
            <p className="text-xs text-slate-300 leading-relaxed">{data.function}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CellExplorer({
  config,
  params,
  onParamChange,
  onDiscovery,
  onComplete,
  isComplete,
  containerWidth,
  containerHeight,
}) {
  const [cellType, setCellType] = useState('animal')
  const [hoveredOrganelle, setHoveredOrganelle] = useState(null)
  const [selectedOrganelle, setSelectedOrganelle] = useState(null)
  const [explored, setExplored] = useState(new Set())

  const isPlant = cellType === 'plant'

  const handleOrganelleClick = useCallback((key) => {
    setSelectedOrganelle((prev) => (prev === key ? null : key))
    setExplored((prev) => {
      const next = new Set(prev)
      next.add(key)
      return next
    })
    if (onDiscovery) {
      onDiscovery(key)
    }
  }, [onDiscovery])

  const handleCloseDetail = useCallback(() => {
    setSelectedOrganelle(null)
  }, [])

  // viewBox dimensions
  const vw = 800
  const vh = 600
  const cx = vw / 2
  const cy = vh / 2

  // Organelle SVG paths and positions
  const organelles = useMemo(() => {
    const base = [
      // Cell membrane
      {
        key: 'membrane',
        render: (hovered) => (
          <g key="membrane">
            <ellipse
              cx={cx}
              cy={cy}
              rx={isPlant ? 340 : 350}
              ry={isPlant ? 240 : 250}
              fill="none"
              stroke={ORGANELLE_DATA.membrane.color}
              strokeWidth={hovered ? 5 : 3}
              opacity={hovered ? 1 : 0.7}
              style={hovered ? { filter: `drop-shadow(0 0 8px ${ORGANELLE_DATA.membrane.glowColor})` } : {}}
            />
            {/* Membrane proteins */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180
              const rx = isPlant ? 340 : 350
              const ry = isPlant ? 240 : 250
              const px = cx + rx * Math.cos(rad)
              const py = cy + ry * Math.sin(rad)
              return (
                <rect
                  key={angle}
                  x={px - 4}
                  y={py - 8}
                  width={8}
                  height={16}
                  rx={3}
                  fill={ORGANELLE_DATA.membrane.color}
                  opacity={0.5}
                  transform={`rotate(${angle}, ${px}, ${py})`}
                />
              )
            })}
          </g>
        ),
        hitArea: { type: 'ellipse', cx, cy, rx: isPlant ? 350 : 360, ry: isPlant ? 250 : 260, innerRx: isPlant ? 330 : 340, innerRy: isPlant ? 230 : 240 },
      },
      // Nucleus
      {
        key: 'nucleus',
        render: (hovered) => (
          <g key="nucleus">
            <circle
              cx={cx}
              cy={cy}
              r={70}
              fill={ORGANELLE_DATA.nucleus.color + '25'}
              stroke={ORGANELLE_DATA.nucleus.color}
              strokeWidth={hovered ? 3 : 2}
              style={hovered ? { filter: `drop-shadow(0 0 12px ${ORGANELLE_DATA.nucleus.glowColor})` } : {}}
            />
            {/* Nuclear pores */}
            {[0, 60, 120, 180, 240, 300].map((angle) => {
              const rad = (angle * Math.PI) / 180
              const px = cx + 70 * Math.cos(rad)
              const py = cy + 70 * Math.sin(rad)
              return (
                <circle
                  key={angle}
                  cx={px}
                  cy={py}
                  r={4}
                  fill="#0f172a"
                  stroke={ORGANELLE_DATA.nucleus.color}
                  strokeWidth={1.5}
                />
              )
            })}
            {/* Nucleolus */}
            <circle
              cx={cx + 10}
              cy={cy - 10}
              r={20}
              fill={ORGANELLE_DATA.nucleus.color + '40'}
              stroke={ORGANELLE_DATA.nucleus.color}
              strokeWidth={1}
              opacity={0.8}
            />
            {/* Chromatin threads */}
            <path
              d={`M ${cx - 30} ${cy + 10} Q ${cx - 10} ${cy - 20} ${cx + 20} ${cy + 15} T ${cx + 40} ${cy - 5}`}
              fill="none"
              stroke={ORGANELLE_DATA.nucleus.color}
              strokeWidth={1.5}
              opacity={0.4}
            />
          </g>
        ),
        hitArea: { type: 'circle', cx, cy, r: 75 },
      },
      // Mitochondria (3 scattered)
      ...[[cx + 180, cy - 80, -20], [cx - 160, cy + 100, 30], [cx + 100, cy + 140, -10]].map(([mx, my, rot], i) => ({
        key: 'mitochondria',
        index: i,
        render: (hovered) => (
          <g key={`mito-${i}`} transform={`rotate(${rot}, ${mx}, ${my})`}>
            <ellipse
              cx={mx}
              cy={my}
              rx={40}
              ry={18}
              fill={ORGANELLE_DATA.mitochondria.color + '20'}
              stroke={ORGANELLE_DATA.mitochondria.color}
              strokeWidth={hovered ? 2.5 : 1.5}
              style={hovered ? { filter: `drop-shadow(0 0 8px ${ORGANELLE_DATA.mitochondria.glowColor})` } : {}}
            />
            {/* Outer membrane */}
            <ellipse
              cx={mx}
              cy={my}
              rx={38}
              ry={16}
              fill="none"
              stroke={ORGANELLE_DATA.mitochondria.color}
              strokeWidth={0.8}
              opacity={0.4}
            />
            {/* Cristae folds */}
            {[-20, -5, 10, 25].map((offset, j) => (
              <path
                key={j}
                d={`M ${mx + offset} ${my - 14} Q ${mx + offset + 5} ${my} ${mx + offset} ${my + 14}`}
                fill="none"
                stroke={ORGANELLE_DATA.mitochondria.color}
                strokeWidth={1}
                opacity={0.5}
              />
            ))}
          </g>
        ),
        hitArea: { type: 'ellipse', cx: mx, cy: my, rx: 45, ry: 22 },
      })),
      // Rough ER (studded ribbon near nucleus)
      {
        key: 'roughER',
        render: (hovered) => (
          <g key="roughER">
            {/* Ribbon sheets */}
            {[0, 1, 2, 3].map((i) => {
              const y = cy - 40 + i * 18
              return (
                <g key={i}>
                  <path
                    d={`M ${cx + 80} ${y} Q ${cx + 110} ${y + 8} ${cx + 140} ${y} Q ${cx + 170} ${y - 8} ${cx + 200} ${y}`}
                    fill="none"
                    stroke={ORGANELLE_DATA.roughER.color}
                    strokeWidth={hovered ? 3 : 2}
                    style={hovered ? { filter: `drop-shadow(0 0 6px ${ORGANELLE_DATA.roughER.glowColor})` } : {}}
                  />
                  {/* Ribosomes on ER */}
                  {[0, 1, 2, 3, 4].map((j) => (
                    <circle
                      key={j}
                      cx={cx + 85 + j * 28}
                      cy={y + (j % 2 === 0 ? 3 : -3)}
                      r={2.5}
                      fill={ORGANELLE_DATA.roughER.color}
                      opacity={0.7}
                    />
                  ))}
                </g>
              )
            })}
          </g>
        ),
        hitArea: { type: 'rect', x: cx + 75, y: cy - 50, w: 135, h: 80 },
      },
      // Smooth ER
      {
        key: 'smoothER',
        render: (hovered) => (
          <g key="smoothER">
            {[0, 1, 2].map((i) => {
              const y = cy + 40 + i * 16
              return (
                <path
                  key={i}
                  d={`M ${cx + 85} ${y} Q ${cx + 120} ${y + 10} ${cx + 155} ${y} Q ${cx + 185} ${y - 10} ${cx + 215} ${y}`}
                  fill="none"
                  stroke={ORGANELLE_DATA.smoothER.color}
                  strokeWidth={hovered ? 3 : 2}
                  style={hovered ? { filter: `drop-shadow(0 0 6px ${ORGANELLE_DATA.smoothER.glowColor})` } : {}}
                />
              )
            })}
          </g>
        ),
        hitArea: { type: 'rect', x: cx + 80, y: cy + 30, w: 145, h: 60 },
      },
      // Golgi apparatus
      {
        key: 'golgi',
        render: (hovered) => (
          <g key="golgi">
            {[0, 1, 2, 3, 4].map((i) => {
              const gx = cx - 200
              const gy = cy - 40 + i * 16
              const curve = 12 - i * 2
              return (
                <path
                  key={i}
                  d={`M ${gx} ${gy} Q ${gx + 40} ${gy + curve} ${gx + 80} ${gy}`}
                  fill={ORGANELLE_DATA.golgi.color + '15'}
                  stroke={ORGANELLE_DATA.golgi.color}
                  strokeWidth={hovered ? 2.5 : 1.5}
                  style={hovered ? { filter: `drop-shadow(0 0 6px ${ORGANELLE_DATA.golgi.glowColor})` } : {}}
                />
              )
            })}
            {/* Vesicles budding off */}
            <circle cx={cx - 110} cy={cy - 30} r={6} fill={ORGANELLE_DATA.golgi.color + '30'} stroke={ORGANELLE_DATA.golgi.color} strokeWidth={1} />
            <circle cx={cx - 105} cy={cy + 35} r={5} fill={ORGANELLE_DATA.golgi.color + '30'} stroke={ORGANELLE_DATA.golgi.color} strokeWidth={1} />
          </g>
        ),
        hitArea: { type: 'rect', x: cx - 210, y: cy - 50, w: 115, h: 110 },
      },
      // Ribosomes (scattered dots)
      {
        key: 'ribosomes',
        render: (hovered) => (
          <g key="ribosomes">
            {[
              [cx - 80, cy - 120], [cx - 110, cy - 100], [cx - 60, cy - 140],
              [cx + 50, cy - 130], [cx + 80, cy - 150], [cx - 30, cy + 150],
              [cx + 140, cy + 90], [cx - 140, cy + 60], [cx + 220, cy - 40],
              [cx - 240, cy - 100], [cx + 30, cy + 170], [cx - 180, cy + 140],
            ].map(([rx, ry], i) => (
              <circle
                key={i}
                cx={rx}
                cy={ry}
                r={hovered ? 4 : 3}
                fill={ORGANELLE_DATA.ribosomes.color}
                opacity={hovered ? 0.9 : 0.6}
                style={hovered ? { filter: `drop-shadow(0 0 4px ${ORGANELLE_DATA.ribosomes.glowColor})` } : {}}
              />
            ))}
          </g>
        ),
        hitArea: { type: 'custom', test: () => false }, // hit via individual dots
      },
      // Lysosomes
      {
        key: 'lysosomes',
        render: (hovered) => (
          <g key="lysosomes">
            {[
              [cx - 120, cy - 50],
              [cx + 250, cy + 40],
              [cx - 80, cy + 130],
            ].map(([lx, ly], i) => (
              <g key={i}>
                <circle
                  cx={lx}
                  cy={ly}
                  r={14}
                  fill={ORGANELLE_DATA.lysosomes.color + '20'}
                  stroke={ORGANELLE_DATA.lysosomes.color}
                  strokeWidth={hovered ? 2.5 : 1.5}
                  style={hovered ? { filter: `drop-shadow(0 0 6px ${ORGANELLE_DATA.lysosomes.glowColor})` } : {}}
                />
                {/* Enzyme dots inside */}
                {[0, 120, 240].map((angle) => {
                  const rad = (angle * Math.PI) / 180
                  return (
                    <circle
                      key={angle}
                      cx={lx + 6 * Math.cos(rad)}
                      cy={ly + 6 * Math.sin(rad)}
                      r={2}
                      fill={ORGANELLE_DATA.lysosomes.color}
                      opacity={0.5}
                    />
                  )
                })}
              </g>
            ))}
          </g>
        ),
        hitArea: { type: 'circles', centers: [[cx - 120, cy - 50], [cx + 250, cy + 40], [cx - 80, cy + 130]], r: 18 },
      },
      // Cytoskeleton
      {
        key: 'cytoskeleton',
        render: (hovered) => (
          <g key="cytoskeleton" opacity={hovered ? 0.6 : 0.2}>
            {[
              `M ${cx - 280} ${cy - 120} L ${cx + 100} ${cy + 180}`,
              `M ${cx - 200} ${cy + 180} L ${cx + 250} ${cy - 100}`,
              `M ${cx} ${cy - 200} L ${cx + 20} ${cy + 200}`,
              `M ${cx - 300} ${cy} L ${cx + 280} ${cy + 20}`,
              `M ${cx - 150} ${cy - 180} L ${cx + 200} ${cy + 150}`,
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={ORGANELLE_DATA.cytoskeleton.color}
                strokeWidth={1}
                strokeDasharray="6 4"
                style={hovered ? { filter: `drop-shadow(0 0 3px ${ORGANELLE_DATA.cytoskeleton.glowColor})` } : {}}
              />
            ))}
          </g>
        ),
        hitArea: { type: 'custom', test: () => false },
      },
    ]

    // Plant cell additions
    if (isPlant) {
      base.unshift(
        // Cell wall (outermost)
        {
          key: 'cellWall',
          render: (hovered) => (
            <g key="cellWall">
              <ellipse
                cx={cx}
                cy={cy}
                rx={365}
                ry={265}
                fill="none"
                stroke={ORGANELLE_DATA.cellWall.color}
                strokeWidth={hovered ? 6 : 4}
                strokeDasharray="8 3"
                opacity={hovered ? 1 : 0.6}
                style={hovered ? { filter: `drop-shadow(0 0 8px ${ORGANELLE_DATA.cellWall.glowColor})` } : {}}
              />
            </g>
          ),
          hitArea: { type: 'ellipse', cx, cy, rx: 375, ry: 275, innerRx: 355, innerRy: 255 },
        },
      )

      // Chloroplasts
      base.push({
        key: 'chloroplast',
        render: (hovered) => (
          <g key="chloroplast">
            {[[cx - 220, cy - 80, 15], [cx + 160, cy - 120, -10], [cx - 100, cy + 160, 5]].map(([chx, chy, rot], i) => (
              <g key={i} transform={`rotate(${rot}, ${chx}, ${chy})`}>
                <ellipse
                  cx={chx}
                  cy={chy}
                  rx={30}
                  ry={16}
                  fill={ORGANELLE_DATA.chloroplast.color + '25'}
                  stroke={ORGANELLE_DATA.chloroplast.color}
                  strokeWidth={hovered ? 2.5 : 1.5}
                  style={hovered ? { filter: `drop-shadow(0 0 8px ${ORGANELLE_DATA.chloroplast.glowColor})` } : {}}
                />
                {/* Thylakoid stacks */}
                {[-12, -4, 4, 12].map((offset, j) => (
                  <ellipse
                    key={j}
                    cx={chx + offset}
                    cy={chy}
                    rx={5}
                    ry={10}
                    fill={ORGANELLE_DATA.chloroplast.color + '30'}
                    stroke={ORGANELLE_DATA.chloroplast.color}
                    strokeWidth={0.5}
                  />
                ))}
              </g>
            ))}
          </g>
        ),
        hitArea: { type: 'circles', centers: [[cx - 220, cy - 80], [cx + 160, cy - 120], [cx - 100, cy + 160]], r: 35 },
      })

      // Central vacuole (large, behind other organelles)
      base.splice(2, 0, {
        key: 'vacuole',
        render: (hovered) => (
          <g key="vacuole">
            <ellipse
              cx={cx + 10}
              cy={cy + 10}
              rx={180}
              ry={130}
              fill={ORGANELLE_DATA.vacuole.color + '10'}
              stroke={ORGANELLE_DATA.vacuole.color}
              strokeWidth={hovered ? 2.5 : 1.5}
              strokeDasharray="4 4"
              style={hovered ? { filter: `drop-shadow(0 0 8px ${ORGANELLE_DATA.vacuole.glowColor})` } : {}}
            />
          </g>
        ),
        hitArea: { type: 'ellipse', cx: cx + 10, cy: cy + 10, rx: 185, ry: 135, innerRx: 90, innerRy: 65 },
      })
    }

    return base
  }, [isPlant, cx, cy])

  // Hit testing
  const hitTest = useCallback((mx, my) => {
    // Test organelles in reverse order (top-drawn first for priority)
    for (let i = organelles.length - 1; i >= 0; i--) {
      const org = organelles[i]
      const hit = org.hitArea
      if (!hit) continue

      if (hit.type === 'circle') {
        const dx = mx - hit.cx
        const dy = my - hit.cy
        if (dx * dx + dy * dy <= hit.r * hit.r) return org.key
      } else if (hit.type === 'ellipse') {
        const nx = (mx - hit.cx) / hit.rx
        const ny = (my - hit.cy) / hit.ry
        const outer = nx * nx + ny * ny <= 1
        if (hit.innerRx) {
          const inx = (mx - hit.cx) / hit.innerRx
          const iny = (my - hit.cy) / hit.innerRy
          const inner = inx * inx + iny * iny <= 1
          if (outer && !inner) return org.key
        } else {
          if (outer) return org.key
        }
      } else if (hit.type === 'rect') {
        if (mx >= hit.x && mx <= hit.x + hit.w && my >= hit.y && my <= hit.y + hit.h) return org.key
      } else if (hit.type === 'circles') {
        for (const [ccx, ccy] of hit.centers) {
          const dx = mx - ccx
          const dy = my - ccy
          if (dx * dx + dy * dy <= hit.r * hit.r) return org.key
        }
      }
    }
    return null
  }, [organelles])

  const handleMouseMove = useCallback((e) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const scaleX = vw / rect.width
    const scaleY = vh / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    setHoveredOrganelle(hitTest(mx, my))
  }, [hitTest])

  const handleClick = useCallback((e) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const scaleX = vw / rect.width
    const scaleY = vh / rect.height
    const mx = (e.clientX - rect.left) * scaleX
    const my = (e.clientY - rect.top) * scaleY
    const hit = hitTest(mx, my)
    if (hit) {
      handleOrganelleClick(hit)
    }
  }, [hitTest, handleOrganelleClick])

  const totalOrganelles = isPlant
    ? ['membrane', 'nucleus', 'mitochondria', 'roughER', 'smoothER', 'golgi', 'ribosomes', 'lysosomes', 'cellWall', 'chloroplast', 'vacuole']
    : ['membrane', 'nucleus', 'mitochondria', 'roughER', 'smoothER', 'golgi', 'ribosomes', 'lysosomes', 'cytoskeleton']

  const exploredCount = totalOrganelles.filter((k) => explored.has(k)).length

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Cell Type</span>
          <div className="flex rounded-lg overflow-hidden border border-slate-700/40">
            <button
              onClick={() => { setCellType('animal'); setSelectedOrganelle(null) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                !isPlant
                  ? 'bg-indigo-600/80 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bug size={12} /> Animal
            </button>
            <button
              onClick={() => { setCellType('plant'); setSelectedOrganelle(null) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                isPlant
                  ? 'bg-emerald-600/80 text-white'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Leaf size={12} /> Plant
            </button>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-mono tabular-nums">
          Explored: {exploredCount}/{totalOrganelles.length}
        </span>
      </div>

      {/* Cell SVG */}
      <div className="relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40" style={{ minHeight: 280, maxHeight: 500 }}>
        <svg
          viewBox={`0 0 ${vw} ${vh}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredOrganelle(null)}
          onClick={handleClick}
        >
          {/* Background */}
          <rect width={vw} height={vh} fill="#0A0E1A" opacity={0.6} />

          {/* Cytoplasm fill */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={isPlant ? 338 : 348}
            ry={isPlant ? 238 : 248}
            fill="rgba(30, 41, 59, 0.4)"
          />

          {/* Render organelles */}
          {organelles.map((org) => org.render(hoveredOrganelle === org.key))}

          {/* Labels on hover */}
          {hoveredOrganelle && ORGANELLE_DATA[hoveredOrganelle] && (() => {
            const data = ORGANELLE_DATA[hoveredOrganelle]
            return (
              <g>
                <rect
                  x={cx - 80}
                  y={12}
                  width={160}
                  height={28}
                  rx={6}
                  fill="rgba(15, 23, 42, 0.9)"
                  stroke={data.color + '60'}
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={31}
                  textAnchor="middle"
                  fill={data.color}
                  fontSize={13}
                  fontWeight={600}
                  fontFamily="system-ui, sans-serif"
                >
                  {data.name}
                </text>
              </g>
            )
          })()}
        </svg>

        {/* Detail card overlay */}
        <AnimatePresence>
          {selectedOrganelle && (
            <DetailCard
              organelleKey={selectedOrganelle}
              onClose={handleCloseDetail}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Instruction hint */}
      <p className="text-xs text-slate-500 text-center">
        Hover over organelles to see names. Click to view detailed structure and function.
      </p>
    </div>
  )
}

export default CellExplorer
