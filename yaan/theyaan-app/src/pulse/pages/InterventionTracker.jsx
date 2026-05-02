import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Phone,
  Users,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Calendar
} from 'lucide-react'
import { getRecentInterventions, getPendingFollowUps, interventionStats } from '../data/mockInterventions'
import { getStudent } from '../data/mockStudents'

const typeIcons = {
  'one-on-one': User,
  'parent-call': Phone,
  'group-support': Users,
  'reteach-session': BookOpen,
}

const outcomeColors = {
  success: '#10B981',
  'partial-success': '#F59E0B',
  pending: '#6B7280',
  'no-change': '#EF4444',
}

export default function InterventionTracker() {
  const { classId } = useParams()
  const recentInterventions = useMemo(() => getRecentInterventions(10), [])
  const pendingFollowUps = useMemo(() => getPendingFollowUps(), [])

  return (
    <div className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/pulse"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Intervention Tracker</h1>
        <p className="text-white/40 text-sm">
          Track teacher interventions and their outcomes
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-white/50">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {Math.round(interventionStats.successRate * 100)}%
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-white/50">Avg Improvement</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            +{interventionStats.averageComprehensionGain}%
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-white/50">Follow-ups Needed</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {interventionStats.followUpsNeeded}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-white/50">Total Interventions</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {interventionStats.totalInterventions}
          </div>
        </div>
      </div>

      {/* Pending Follow-ups */}
      {pendingFollowUps.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Pending Follow-ups</h2>
          <div className="space-y-3">
            {pendingFollowUps.map((intervention) => {
              const student = getStudent(intervention.studentId)
              const Icon = typeIcons[intervention.type] || User
              return (
                <motion.div
                  key={intervention.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-white">
                          {student?.name || 'Student'}
                        </h3>
                        <span className="text-xs text-yellow-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Follow-up: {new Date(intervention.followUpDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mb-2">{intervention.trigger}</p>
                      <p className="text-xs text-white/80">{intervention.action}</p>
                      {intervention.nextSteps && intervention.nextSteps.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <span className="text-xs text-white/40">Next steps:</span>
                          {intervention.nextSteps.map((step, idx) => (
                            <div key={idx} className="text-xs text-white/70 ml-3">
                              • {step}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Interventions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Interventions</h2>
        <div className="space-y-3">
          {recentInterventions.map((intervention, idx) => {
            const student = getStudent(intervention.studentId)
            const Icon = typeIcons[intervention.type] || User
            const outcomeColor = outcomeColors[intervention.outcome] || '#6B7280'

            return (
              <motion.div
                key={intervention.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/8 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${outcomeColor}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: outcomeColor }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {student?.name || 'Student'}
                        </h3>
                        <span className="text-xs text-white/40 capitalize">
                          {intervention.type.replace(/-/g, ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-xs font-medium px-2 py-1 rounded-full capitalize"
                          style={{
                            backgroundColor: `${outcomeColor}20`,
                            color: outcomeColor,
                          }}
                        >
                          {intervention.outcome.replace(/-/g, ' ')}
                        </div>
                        <span className="text-xs text-white/30 mt-1 block">
                          {new Date(intervention.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-white/40">Trigger: </span>
                        <span className="text-xs text-white/70">{intervention.trigger}</span>
                      </div>
                      <div>
                        <span className="text-xs text-white/40">Action: </span>
                        <span className="text-xs text-white/70">{intervention.action}</span>
                      </div>
                      {intervention.notes && (
                        <div>
                          <span className="text-xs text-white/40">Notes: </span>
                          <span className="text-xs text-white/60 italic">{intervention.notes}</span>
                        </div>
                      )}

                      {/* Comprehension Change */}
                      {intervention.comprehensionBefore !== undefined && intervention.comprehensionAfter !== undefined && (
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                          <div className="flex-1">
                            <span className="text-xs text-white/40">Comprehension Change:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-white/60">
                                {intervention.comprehensionBefore}%
                              </span>
                              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-400 rounded-full"
                                  style={{ width: `${intervention.comprehensionBefore}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold" style={{ color: outcomeColor }}>
                                {intervention.comprehensionAfter}%
                              </span>
                              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${intervention.comprehensionAfter}%`,
                                    backgroundColor: outcomeColor
                                  }}
                                />
                              </div>
                              <TrendingUp
                                className="w-4 h-4"
                                style={{ color: outcomeColor }}
                              />
                              <span className="text-xs font-bold" style={{ color: outcomeColor }}>
                                +{intervention.comprehensionAfter - intervention.comprehensionBefore}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
