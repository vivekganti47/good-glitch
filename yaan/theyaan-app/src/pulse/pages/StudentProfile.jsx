import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown, BookOpen, Calendar, Users, Sparkles } from 'lucide-react'
import { getStudent, students, getAvatarColor } from '../data/mockStudents'
import { classes } from '../data/mockClasses'
import { groupingSuggestions } from '../data/mockInsights'
import RadarChart from '../components/RadarChart'
import TimelineChart from '../components/TimelineChart'
import ComprehensionBar from '../components/ComprehensionBar'
import ParentReportGenerator from '../components/ParentReportGenerator'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

function formatTopicName(key) {
  return key
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const learningStyleMaterials = {
  visual: 'diagram-heavy',
  auditory: 'discussion-based',
  kinesthetic: 'hands-on',
}

export default function StudentProfile() {
  const { studentId } = useParams()
  const student = getStudent(studentId)

  const overallAvg = useMemo(() => {
    if (!student) return 0
    const vals = Object.values(student.scores)
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }, [student])

  const attendanceRate = useMemo(() => {
    if (!student) return 0
    const present = student.attendance.filter((d) => d === 1).length
    return Math.round((present / student.attendance.length) * 100)
  }, [student])

  const studentClasses = useMemo(() => {
    if (!student) return []
    return classes.filter((c) => student.classIds.includes(c.id))
  }, [student])

  const classAvgWeekly = useMemo(() => {
    if (!student) return []
    // Gather all students that share at least one class with this student
    const classmateIds = new Set()
    studentClasses.forEach((cls) => {
      cls.studentIds.forEach((sid) => classmateIds.add(sid))
    })
    const classmates = students.filter((s) => classmateIds.has(s.id))
    if (classmates.length === 0) return []
    // Average weekly scores across classmates
    const weekCount = student.weeklyScores.length
    return Array.from({ length: weekCount }, (_, wi) => {
      const sum = classmates.reduce((acc, s) => acc + (s.weeklyScores[wi] || 0), 0)
      return Math.round(sum / classmates.length)
    })
  }, [student, studentClasses])

  const peerTutoringMatches = useMemo(() => {
    if (!student) return []
    const pairs = groupingSuggestions['peer-tutoring'] || []
    return pairs
      .filter((p) => p.students.includes(studentId))
      .map((p) => {
        const otherId = p.students.find((sid) => sid !== studentId)
        const other = getStudent(otherId)
        return { ...p, otherStudent: other }
      })
      .filter((p) => p.otherStudent)
  }, [student, studentId])

  const sortedScores = useMemo(() => {
    if (!student) return []
    return Object.entries(student.scores).sort((a, b) => a[1] - b[1])
  }, [student])

  const recommendations = useMemo(() => {
    if (!student) return []
    const recs = []

    // Peer tutoring recommendation
    peerTutoringMatches.forEach((match) => {
      recs.push({
        icon: Users,
        color: 'text-cyan-300',
        bg: 'bg-cyan-500/10',
        text: `Pair with ${match.otherStudent.name} for peer tutoring on ${formatTopicName(match.topic)}`,
        detail: match.predictedBenefit,
      })
    })

    // Learning style recommendation
    const materialType = learningStyleMaterials[student.learningStyle] || 'multi-modal'
    recs.push({
      icon: BookOpen,
      color: 'text-violet-300',
      bg: 'bg-violet-500/10',
      text: `Learning style: ${student.learningStyle} — recommend ${materialType} materials`,
      detail: `Tailor instruction to ${student.learningStyle} preferences for maximum retention`,
    })

    // Attendance recommendation
    if (attendanceRate > 95) {
      recs.push({
        icon: Calendar,
        color: 'text-emerald-300',
        bg: 'bg-emerald-500/10',
        text: 'Excellent attendance — maintain current engagement strategies',
        detail: `${attendanceRate}% attendance rate is well above target`,
      })
    } else if (attendanceRate >= 85) {
      recs.push({
        icon: Calendar,
        color: 'text-amber-300',
        bg: 'bg-amber-500/10',
        text: 'Good attendance, minor gaps — monitor for emerging pattern',
        detail: `${attendanceRate}% attendance — check if absences cluster around specific days`,
      })
    } else {
      recs.push({
        icon: Calendar,
        color: 'text-red-300',
        bg: 'bg-red-500/10',
        text: 'Attendance needs improvement — consider parent communication',
        detail: `${attendanceRate}% attendance is below the 85% threshold`,
      })
    }

    return recs
  }, [student, peerTutoringMatches, attendanceRate])

  // ──────────────── Not found ────────────────

  if (!student) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Student not found</h2>
          <p className="text-white/50 mb-6">No student exists with ID "{studentId}"</p>
          <Link
            to="/pulse"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // ──────────────── Score trend indicator ────────────────

  const trend = student.weeklyScores[student.weeklyScores.length - 1] - student.weeklyScores[0]
  const TrendIcon = trend >= 0 ? TrendingUp : TrendingDown
  const trendColor = trend >= 0 ? 'text-emerald-400' : 'text-red-400'

  // ──────────────── Render ────────────────

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Back button */}
        <motion.div variants={item}>
          <Link
            to="/pulse"
            className="inline-flex items-center gap-2 text-white/50 hover:text-emerald-400 transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* ───── Header ───── */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8"
        >
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: getAvatarColor(student.name) }}
          >
            {student.initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold truncate">{student.name}</h1>
              <span className={`inline-flex items-center gap-1 text-sm font-medium ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                {trend >= 0 ? '+' : ''}{trend} pts
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {studentClasses.map((cls) => (
                <span
                  key={cls.id}
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/8 text-white/70 border border-white/5"
                >
                  {cls.name}
                </span>
              ))}
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 capitalize">
                {student.learningStyle} learner
              </span>
              <span className="text-xs font-mono text-white/40">Overall: {overallAvg}%</span>
            </div>
          </div>
        </motion.div>

        {/* ───── Two-column layout ───── */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Left Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Performance Radar */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-5"
            >
              <h3 className="text-sm font-semibold text-white/70 mb-4">Performance Overview</h3>
              <RadarChart data={student.radarScores} />
            </motion.div>

            {/* Strengths & Gaps */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-5"
            >
              <h3 className="text-sm font-semibold text-white/70 mb-4">Strengths & Gaps</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Strengths */}
                <div>
                  <p className="text-xs text-emerald-400/70 font-medium mb-2 uppercase tracking-wider">Strengths</p>
                  <div className="flex flex-wrap gap-1.5">
                    {student.strengths.map((s) => (
                      <span
                        key={s}
                        className="bg-emerald-500/15 text-emerald-300 rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {formatTopicName(s)}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Weaknesses */}
                <div>
                  <p className="text-xs text-red-400/70 font-medium mb-2 uppercase tracking-wider">Gaps</p>
                  <div className="flex flex-wrap gap-1.5">
                    {student.weaknesses.map((w) => (
                      <span
                        key={w}
                        className="bg-red-500/15 text-red-300 rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {formatTopicName(w)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Learning Trajectory */}
            <motion.div
              variants={item}
              className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white/70">8-Week Progress</h3>
                <div className="flex items-center gap-4 text-[10px] text-white/40">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" />
                    Student
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-0.5 bg-white/20 rounded-full inline-block border-b border-dashed border-white/30" />
                    Class Avg
                  </span>
                </div>
              </div>
              <TimelineChart
                data={student.weeklyScores}
                classAvgData={classAvgWeekly}
                labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']}
              />
            </motion.div>

            {/* Key Stats Row */}
            <motion.div variants={item} className="grid grid-cols-2 gap-3">
              <StatCard label="Comprehension" value={`${student.comprehension}%`} color={statColor(student.comprehension)} />
              <StatCard label="Attendance" value={`${attendanceRate}%`} color={statColor(attendanceRate)} />
              <StatCard label="Participation" value={`${student.participationFrequency}/day`} color={student.participationFrequency >= 5 ? '#10B981' : student.participationFrequency >= 2 ? '#F59E0B' : '#EF4444'} />
              <StatCard label="Engagement" value={student.engagement.charAt(0).toUpperCase() + student.engagement.slice(1)} color={student.engagement === 'active' ? '#10B981' : student.engagement === 'passive' ? '#F59E0B' : '#EF4444'} />
            </motion.div>
          </div>
        </div>

        {/* ───── Full-width: Topic Scores ───── */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-5 mb-6"
        >
          <h3 className="text-sm font-semibold text-white/70 mb-4">Subject Performance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {sortedScores.map(([topic, value]) => (
              <ComprehensionBar key={topic} label={formatTopicName(topic)} value={value} />
            ))}
          </div>
        </motion.div>

        {/* ───── Full-width: AI Recommendations ───── */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white/70">AI Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className={`rounded-xl ${rec.bg} border border-white/5 p-4`}
              >
                <div className="flex items-start gap-3">
                  <rec.icon className={`w-4 h-4 mt-0.5 shrink-0 ${rec.color}`} />
                  <div>
                    <p className="text-sm text-white/80 leading-snug">{rec.text}</p>
                    <p className="text-xs text-white/40 mt-1">{rec.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ───── Full-width: Parent Communication Generator ───── */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-5"
        >
          <ParentReportGenerator student={student} />
        </motion.div>

        {/* ───── Full-width: Attendance Pattern ───── */}
        <motion.div
          variants={item}
          className="rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/70">Attendance Pattern</h3>
            <span className="text-xs font-mono text-white/40">{attendanceRate}% present</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {student.attendance.map((day, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${day === 1 ? 'bg-emerald-500' : 'bg-red-500/50'}`}
                title={`Day ${i + 1}: ${day === 1 ? 'Present' : 'Absent'}`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ──────────────── Helpers ────────────────

function statColor(value) {
  if (value >= 80) return '#10B981'
  if (value >= 60) return '#F59E0B'
  return '#EF4444'
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center">
      <span className="text-xs text-white/40 mb-1">{label}</span>
      <span className="text-lg font-bold font-mono" style={{ color }}>{value}</span>
    </div>
  )
}
