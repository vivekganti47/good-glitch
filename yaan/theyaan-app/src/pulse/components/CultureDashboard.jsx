import { motion } from 'framer-motion'
import { Heart, Users, TrendingUp, Sparkles, Calendar } from 'lucide-react'
import { getClassCulture, getAllCelebrationMoments } from '../data/mockCulture'

export default function CultureDashboard({ classId }) {
  const culture = getClassCulture(classId)
  const allCelebrations = getAllCelebrationMoments(5)

  if (!culture) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-white/40">No culture data available for this class.</p>
      </div>
    )
  }

  const getClimateColor = (climate) => {
    switch (climate) {
      case 'positive': return '#10B981'
      case 'neutral': return '#F59E0B'
      case 'tense': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const getTemperatureColor = (score) => {
    if (score >= 8) return '#10B981'
    if (score >= 7) return '#34D399'
    if (score >= 6) return '#F59E0B'
    return '#EF4444'
  }

  const equityPercentage = Math.round(culture.participationEquity * 100)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-pink-400" />
        <h3 className="text-lg font-bold text-white">Classroom Culture</h3>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Temperature Check */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Temperature</span>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getTemperatureColor(culture.temperatureCheckScore) }}
            />
          </div>
          <div
            className="text-2xl font-bold mb-1"
            style={{ color: getTemperatureColor(culture.temperatureCheckScore) }}
          >
            {culture.temperatureCheckScore.toFixed(1)}
          </div>
          <div className="text-xs text-white/40">out of 10</div>
        </motion.div>

        {/* Participation Equity */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Equity</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {equityPercentage}%
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${equityPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* Peer Support */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Peer Support</span>
            <Heart className="w-3.5 h-3.5 text-pink-400" />
          </div>
          <div className="text-2xl font-bold text-pink-400 mb-1">
            {culture.peerSupportInstances}
          </div>
          <div className="text-xs text-white/40">this week</div>
        </motion.div>

        {/* Positive Interactions */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/50">Interactions</span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {culture.positiveInteractions}
          </div>
          <div className="text-xs text-white/40">positive this week</div>
        </motion.div>
      </div>

      {/* Celebration Moments */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <h4 className="text-sm font-semibold text-white">Recent Celebrations</h4>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {culture.celebrationMoments.slice(0, 3).map((moment) => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-white">
                    {moment.studentName}
                  </p>
                  <span className="text-xs text-white/30 whitespace-nowrap">
                    {new Date(moment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-white/60 line-clamp-2 mt-0.5">
                  {moment.achievement}
                </p>
                <p className="text-xs text-white/40 italic mt-1">
                  {moment.reaction}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {culture.celebrationMoments.length === 0 && (
          <p className="text-xs text-white/40 text-center py-4">
            No celebrations yet this week. Celebrate student wins!
          </p>
        )}
      </div>

      {/* Weekly Trend */}
      {culture.weeklyTrends && culture.weeklyTrends.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">Weekly Trend</h4>
          </div>

          <div className="space-y-2">
            {culture.weeklyTrends.map((week, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Calendar className="w-3 h-3 text-white/30 shrink-0" />
                <span className="text-xs text-white/40 w-20">{week.week}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
                      style={{ width: `${week.temperatureCheck * 10}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/60 w-8">{week.temperatureCheck.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
