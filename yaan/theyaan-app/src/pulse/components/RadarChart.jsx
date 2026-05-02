import { motion } from 'framer-motion'

export default function RadarChart({ data, size = 220, color = '#10B981' }) {
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - 30
  const entries = Object.entries(data)
  const n = entries.length
  const angleStep = (2 * Math.PI) / n

  function getPoint(i, value) {
    const angle = angleStep * i - Math.PI / 2
    const r = (value / 100) * radius
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  function getLabelPoint(i) {
    const angle = angleStep * i - Math.PI / 2
    const r = radius + 18
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  // Concentric grid polygons at 25%, 50%, 75%, 100%
  const gridLevels = [25, 50, 75, 100]

  function polygonPath(level) {
    return entries
      .map((_, i) => {
        const p = getPoint(i, level)
        return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`
      })
      .join(' ') + ' Z'
  }

  // Data polygon
  const dataPath = entries
    .map(([, val], i) => {
      const p = getPoint(i, val)
      return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`
    })
    .join(' ') + ' Z'

  const dataPoints = entries.map(([, val], i) => getPoint(i, val))

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid lines */}
      {gridLevels.map((level) => (
        <path key={level} d={polygonPath(level)} fill="none" stroke="white" strokeOpacity={0.08} strokeWidth={1} />
      ))}

      {/* Axis lines */}
      {entries.map((_, i) => {
        const p = getPoint(i, 100)
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="white" strokeOpacity={0.06} strokeWidth={1} />
      })}

      {/* Data area */}
      <motion.path
        d={dataPath}
        fill={color}
        fillOpacity={0.15}
        stroke={color}
        strokeWidth={2}
        strokeOpacity={0.8}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <motion.circle
          key={i} cx={p.x} cy={p.y} r={4}
          fill={color} stroke="#0A0E1A" strokeWidth={2}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 * i }}
        />
      ))}

      {/* Labels */}
      {entries.map(([label], i) => {
        const p = getLabelPoint(i)
        return (
          <text
            key={i} x={p.x} y={p.y}
            textAnchor="middle" dominantBaseline="middle"
            className="text-[10px] fill-white/50 font-mono uppercase"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}
