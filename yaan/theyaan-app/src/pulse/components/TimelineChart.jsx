import { motion } from 'framer-motion'

export default function TimelineChart({ data, labels, height = 140, color = '#10B981', classAvgData }) {
  const padding = { top: 10, right: 10, bottom: 28, left: 35 }
  const w = 100 // percentage-based viewBox
  const h = height
  const chartW = w - padding.left - padding.right
  const chartH = h - padding.top - padding.bottom

  const maxVal = 100
  const minVal = 0

  function getX(i) {
    return padding.left + (i / (data.length - 1)) * chartW
  }

  function getY(val) {
    return padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH
  }

  const linePath = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(v)}`).join(' ')
  const areaPath = linePath + ` L${getX(data.length - 1)},${getY(0)} L${getX(0)},${getY(0)} Z`

  const avgPath = classAvgData
    ? classAvgData.map((v, i) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(v)}`).join(' ')
    : null

  const gridLines = [25, 50, 75]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      {/* Grid lines */}
      {gridLines.map((val) => (
        <g key={val}>
          <line x1={padding.left} y1={getY(val)} x2={w - padding.right} y2={getY(val)} stroke="white" strokeOpacity={0.06} strokeWidth={0.3} />
          <text x={padding.left - 3} y={getY(val) + 1} textAnchor="end" className="text-[3px] fill-white/30 font-mono">{val}</text>
        </g>
      ))}

      {/* Class average line */}
      {avgPath && (
        <path d={avgPath} fill="none" stroke="white" strokeOpacity={0.2} strokeWidth={0.4} strokeDasharray="2,2" />
      )}

      {/* Area fill */}
      <motion.path
        d={areaPath}
        fill={color}
        fillOpacity={0.08}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Data line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={0.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* Data points */}
      {data.map((v, i) => (
        <motion.circle
          key={i} cx={getX(i)} cy={getY(v)} r={1.2}
          fill={color} stroke="#0A0E1A" strokeWidth={0.4}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.1 * i, duration: 0.2 }}
        />
      ))}

      {/* X-axis labels */}
      {(labels || data.map((_, i) => `W${i + 1}`)).map((label, i) => (
        <text key={i} x={getX(i)} y={h - 3} textAnchor="middle" className="text-[3px] fill-white/30 font-mono">{label}</text>
      ))}
    </svg>
  )
}
