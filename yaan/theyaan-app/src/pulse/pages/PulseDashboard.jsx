import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Play,
  BookOpen,
  BarChart3,
  Users,
  Clock,
  GraduationCap,
  Brain,
  Activity,
  ChevronRight,
  ClipboardCheck,
} from 'lucide-react'
import usePulseStore from '../stores/pulseStore'
import { classes } from '../data/mockClasses'
import { dailyInsights, recentActivity } from '../data/mockInsights'
import InsightCard from '../components/InsightCard'
import CultureDashboard from '../components/CultureDashboard'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

const activityIconMap = {
  class: Play,
  insight: Brain,
  assessment: BarChart3,
  group: Users,
  lesson: BookOpen,
}

const quickActions = [
  { label: 'Start Class', icon: Play, to: '/pulse/classroom/10-A' },
  { label: 'Plan Lesson', icon: BookOpen, to: '/pulse/planner' },
  { label: 'Interventions', icon: ClipboardCheck, to: '/pulse/interventions' },
  { label: 'Smart Groups', icon: Users, to: '/pulse/groups/10-A' },
]

const stats = [
  { label: 'Total Students', value: '120', icon: GraduationCap },
  { label: 'Avg Comprehension', value: '72%', icon: Brain },
  { label: 'Topics Covered', value: '48', icon: BookOpen },
  { label: 'Classes Today', value: '3', icon: Clock },
]

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTopicName(topic) {
  return topic
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function PulseDashboard() {
  const teacherName = usePulseStore((s) => s.teacherName)

  return (
    <motion.div
      className="px-4 sm:px-6 py-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Good morning, {teacherName}
        </h1>
        <p className="text-white/40 text-sm mt-1">{formatDate()}</p>
      </motion.div>

      {/* Today's Classes */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
          Today's Classes
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {classes.map((cls, index) => (
            <Link
              key={cls.id}
              to={`/pulse/classroom/${cls.id}`}
              className={`flex-shrink-0 w-64 p-4 bg-white/[0.03] border rounded-xl transition-colors hover:bg-white/[0.06] ${
                index === 0
                  ? 'border-emerald-500/30'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">{cls.name}</h3>
                <ChevronRight size={14} className="text-white/20" />
              </div>
              <p className="text-xs text-white/40 mb-3">
                {cls.schedule[0].day} {cls.schedule[0].time}
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/50">{cls.subject}</span>
                <span className="text-xs text-white/30">
                  {cls.studentIds.length} students
                </span>
              </div>
              <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 rounded-full">
                {formatTopicName(cls.currentTopic)}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* AI Insights Row */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
          AI Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyInsights.slice(0, 3).map((insight) => (
            <InsightCard
              key={insight.id}
              type={insight.type}
              icon={insight.icon}
              title={insight.title}
              description={insight.description}
              priority={insight.priority}
              actionLabel={insight.actionLabel}
              actionRoute={insight.actionRoute}
            />
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                to={action.to}
                className="p-4 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-3 transition-colors hover:border-emerald-500/30 hover:bg-white/[0.06]"
              >
                <Icon size={18} className="text-emerald-400" />
                <span className="text-sm font-medium text-white/80">
                  {action.label}
                </span>
              </Link>
            )
          })}
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="p-4 bg-white/[0.03] border border-white/10 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-white/30" />
                  <span className="text-white/40 text-xs">{stat.label}</span>
                </div>
                <p className="text-2xl font-black font-mono text-emerald-400">
                  {stat.value}
                </p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Classroom Culture Dashboard */}
      <motion.div variants={itemVariants} className="mb-8">
        <CultureDashboard classId="10-A" />
      </motion.div>

      {/* Recent Activity Feed */}
      <motion.div variants={itemVariants}>
        <h2 className="font-mono text-xs uppercase tracking-wider text-white/30 mb-3">
          Recent Activity
        </h2>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl divide-y divide-white/5">
          {recentActivity.map((activity) => {
            const Icon = activityIconMap[activity.type] || Activity
            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center">
                  <Icon size={13} className="text-white/40" />
                </div>
                <p className="flex-1 text-sm text-white/60 truncate">
                  {activity.text}
                </p>
                <span className="flex-shrink-0 text-xs text-white/25">
                  {activity.time}
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
