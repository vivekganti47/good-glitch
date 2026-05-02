import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import PulseBackground from './components/PulseBackground'
import PulseNavBar from './components/PulseNavBar'

const PulseDashboard = lazy(() => import('./pages/PulseDashboard'))
const ClassroomPulse = lazy(() => import('./pages/ClassroomPulse'))
const SmartGroups = lazy(() => import('./pages/SmartGroups'))
const LessonPlanner = lazy(() => import('./pages/LessonPlanner'))
const StudentProfile = lazy(() => import('./pages/StudentProfile'))
const ReteachingRadar = lazy(() => import('./pages/ReteachingRadar'))
const InterventionTracker = lazy(() => import('./pages/InterventionTracker'))

function PulseLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm font-mono tracking-wider">INITIALIZING PULSE...</p>
      </div>
    </div>
  )
}

export default function Pulse() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white relative">
      <PulseBackground />
      <PulseNavBar />
      <Suspense fallback={<PulseLoadingScreen />}>
        <main className="relative z-10 pt-14">
          <Routes>
            <Route index element={<PulseDashboard />} />
            <Route path="classroom/:classId" element={<ClassroomPulse />} />
            <Route path="groups/:classId" element={<SmartGroups />} />
            <Route path="planner" element={<LessonPlanner />} />
            <Route path="student/:studentId" element={<StudentProfile />} />
            <Route path="reteach/:classId" element={<ReteachingRadar />} />
            <Route path="interventions" element={<InterventionTracker />} />
            <Route path="interventions/:classId" element={<InterventionTracker />} />
            <Route path="*" element={<Navigate to="/pulse" replace />} />
          </Routes>
        </main>
      </Suspense>
    </div>
  )
}
