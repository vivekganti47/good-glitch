import { motion } from 'framer-motion'

function getCellStyle(value) {
  if (value === 0) return { bg: 'bg-slate-800/50', text: 'text-slate-500', border: 'border-slate-700/30' }
  if (value >= 80) return { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/20' }
  if (value >= 60) return { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/20' }
  if (value >= 40) return { bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/20' }
  return { bg: 'bg-red-500/15', text: 'text-red-300', border: 'border-red-500/20' }
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
}

export default function HeatMap({ topics, classId, onTopicClick, selectedTopicId }) {
  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {topics.map((topic) => {
        const value = topic.classComprehension[classId] ?? 0
        const style = getCellStyle(value)
        const isSelected = selectedTopicId === topic.id
        const isUpcoming = topic.status === 'upcoming'

        return (
          <motion.button
            key={topic.id}
            variants={item}
            onClick={() => onTopicClick?.(topic.id)}
            className={`
              p-4 rounded-xl border text-left transition-all duration-200
              ${style.bg} ${style.border}
              ${isSelected ? 'ring-2 ring-emerald-500/50 scale-[1.02]' : 'hover:scale-[1.02]'}
              ${isUpcoming ? 'opacity-50' : ''}
            `}
          >
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/30 mb-2">
              {topic.status === 'in-progress' ? 'In Progress' : topic.status === 'upcoming' ? 'Upcoming' : `Ch ${topic.chapter}`}
            </div>
            <div className="text-sm font-semibold text-white/80 mb-2 leading-tight">{topic.name}</div>
            {value > 0 ? (
              <div className={`text-2xl font-black font-mono ${style.text}`}>{value}%</div>
            ) : (
              <div className="text-sm font-mono text-slate-500">--</div>
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
