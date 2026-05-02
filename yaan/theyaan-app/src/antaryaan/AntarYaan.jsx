import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import SpaceBackground from './components/common/SpaceBackground'
import NavigationBar from './components/common/NavigationBar'
import WarpTransition from './components/common/WarpTransition'
import useThemeStore from './stores/themeStore'

// Lazy load pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'))
const GalaxyView = lazy(() => import('./pages/GalaxyView'))
const ConstellationView = lazy(() => import('./pages/ConstellationView'))
const StarLesson = lazy(() => import('./pages/StarLesson'))
const PlanetPractice = lazy(() => import('./pages/PlanetPractice'))
const SideQuest = lazy(() => import('./pages/SideQuest'))
const ReviewPage = lazy(() => import('./pages/ReviewPage'))
const Profile = lazy(() => import('./pages/Profile'))

function LoadingScreen() {
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: isDark ? '#0A0E1A' : '#FAFBFD' }}
    >
      <div className="text-center">
        <div
          className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${
            isDark
              ? 'border-indigo-500/30 border-t-indigo-500'
              : 'border-amber-500/30 border-t-amber-500'
          }`}
        />
        <p
          className={`text-sm font-mono tracking-wider ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          NAVIGATING THE COSMOS...
        </p>
      </div>
    </div>
  )
}

export default function AntarYaan() {
  const theme = useThemeStore((s) => s.theme)

  return (
    <div
      className={`min-h-screen relative ${theme === 'dark' ? 'dark' : ''}`}
      style={{
        background: theme === 'dark' ? '#0A0E1A' : '#FAFBFD',
        color: theme === 'dark' ? '#F1F5F9' : '#1E293B',
      }}
    >
      <SpaceBackground />
      <NavigationBar />
      <WarpTransition />
      <Suspense fallback={<LoadingScreen />}>
        <main className="relative z-10">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="galaxy/:galaxyId" element={<GalaxyView />} />
            <Route path="constellation/:constellationId" element={<ConstellationView />} />
            <Route path="star/:constellationId/:starId" element={<StarLesson />} />
            <Route path="planet/:constellationId/:planetId" element={<PlanetPractice />} />
            <Route path="quest/:constellationId/:questId" element={<SideQuest />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/antaryaan" replace />} />
          </Routes>
        </main>
      </Suspense>
    </div>
  )
}
