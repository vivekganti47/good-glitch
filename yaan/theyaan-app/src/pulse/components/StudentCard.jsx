import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ThumbsUp, Minus, Frown, HelpCircle } from 'lucide-react'
import { getAvatarColor } from '../data/mockStudents'

function getComprehensionColor(value) {
  if (value >= 70) return '#10B981'
  if (value >= 50) return '#F59E0B'
  return '#EF4444'
}

const engagementColors = {
  active: '#10B981',
  passive: '#F59E0B',
  disengaged: '#EF4444',
}

const emotionIcons = {
  confident: ThumbsUp,
  neutral: Minus,
  frustrated: Frown,
  confused: HelpCircle,
}

const emotionColors = {
  confident: 'text-emerald-400',
  neutral: 'text-slate-400',
  frustrated: 'text-red-400',
  confused: 'text-amber-400',
}

export default function StudentCard({ student, size = 'md', showIndicators = true }) {
  const compColor = getComprehensionColor(student.comprehension)
  const engColor = engagementColors[student.engagement] || '#64748B'
  const EmotionIcon = emotionIcons[student.emotion] || Minus
  const avatarBg = getAvatarColor(student.name)
  const isSm = size === 'sm'

  return (
    <Link to={`/pulse/student/${student.id}`}>
      <motion.div
        className={`
          bg-white/[0.03] border border-white/10 rounded-xl
          hover:border-emerald-500/30 transition-all cursor-pointer
          ${isSm ? 'p-2.5' : 'p-3'}
        `}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="flex items-center gap-2.5">
          {/* Avatar with comprehension ring */}
          <div className="relative flex-shrink-0">
            <div
              className={`${isSm ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs'} rounded-full flex items-center justify-center font-bold text-white`}
              style={{
                backgroundColor: avatarBg + '30',
                color: avatarBg,
                boxShadow: showIndicators ? `0 0 0 2px ${compColor}50, 0 0 8px ${compColor}20` : 'none',
              }}
            >
              {student.initials}
            </div>
            {/* Engagement dot */}
            {showIndicators && (
              <div
                className={`absolute -bottom-0.5 -right-0.5 ${isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} rounded-full border-2 border-[#0A0E1A]`}
                style={{ backgroundColor: engColor }}
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className={`${isSm ? 'text-[11px]' : 'text-xs'} font-semibold text-white/80 truncate`}>{student.name}</div>
            {showIndicators && !isSm && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono" style={{ color: compColor }}>{student.comprehension}%</span>
                <EmotionIcon size={10} className={emotionColors[student.emotion]} />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
