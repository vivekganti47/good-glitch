import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, User, Flame, Star, Trophy, Gem, Zap,
  Shield, Award, TrendingUp, Target, BookOpen, Crown
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useUserStore from '../stores/userStore'
import useProgressStore from '../stores/progressStore'
import { galaxies } from '../data/galaxies'
import { constellations } from '../data/constellations'
import SpaceBackground from '../components/common/SpaceBackground'

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// --- Badge Definitions ---

const BADGE_DEFINITIONS = {
  'getting-started': { name: 'Getting Started', icon: Flame, color: '#F59E0B', description: '3-day streak' },
  'week-warrior': { name: 'Week Warrior', icon: Shield, color: '#EF4444', description: '7-day streak' },
  'fortnight-fighter': { name: 'Fortnight Fighter', icon: Zap, color: '#8B5CF6', description: '14-day streak' },
  'monthly-master': { name: 'Monthly Master', icon: Crown, color: '#FFD700', description: '30-day streak' },
  'dedicated-explorer': { name: 'Dedicated Explorer', icon: Star, color: '#10B981', description: '60-day streak' },
  'century-club': { name: 'Century Club', icon: Trophy, color: '#EC4899', description: '100-day streak' },
  'first-star': { name: 'First Star', icon: Star, color: '#FBBF24', description: 'Complete first lesson' },
  'first-planet': { name: 'First Planet', icon: Target, color: '#60A5FA', description: 'Complete first practice' },
  'first-quest': { name: 'First Quest', icon: Award, color: '#A78BFA', description: 'Complete first quest' },
}

// --- League Config ---

const LEAGUE_CONFIG = {
  bronze: { name: 'Bronze', color: '#CD7F32', icon: Shield },
  silver: { name: 'Silver', color: '#C0C0C0', icon: Shield },
  gold: { name: 'Gold', color: '#FFD700', icon: Trophy },
  platinum: { name: 'Platinum', color: '#E5E4E2', icon: Trophy },
  diamond: { name: 'Diamond', color: '#B9F2FF', icon: Crown },
  champion: { name: 'Champion', color: '#FF6B6B', icon: Crown },
}

const LEAGUE_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'champion']

// --- Sub-components ---

function ProfileHeader({ name, title, totalXP, currentStreak, longestStreak, gems }) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border border-white/10 p-6 text-center relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Decorative rings */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/15" />
      </div>

      <div className="relative z-10">
        {/* Avatar */}
        <motion.div
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30
            border-2 border-indigo-400/30 flex items-center justify-center"
          animate={{
            boxShadow: [
              '0 0 20px rgba(99, 102, 241, 0.15)',
              '0 0 40px rgba(99, 102, 241, 0.25)',
              '0 0 20px rgba(99, 102, 241, 0.15)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <User className="w-10 h-10 text-indigo-300" />
        </motion.div>

        <h2
          className="text-2xl font-extrabold mb-1"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #C7D2FE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {name}
        </h2>
        <p className="text-sm text-white/40 mb-5">{title}</p>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl bg-white/5 p-3">
            <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{totalXP.toLocaleString()}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Total XP</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{currentStreak}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Streak</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{longestStreak}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Best</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <Gem className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-white">{gems}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider">Gems</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function LeagueHistory({ currentLeague }) {
  const currentIndex = LEAGUE_ORDER.indexOf(currentLeague)

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border border-white/10 p-5"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      <h3 className="font-bold text-sm text-white/80 mb-4 flex items-center gap-2">
        <Trophy className="w-4 h-4 text-yellow-400" />
        League Progress
      </h3>

      <div className="flex items-center gap-1.5">
        {LEAGUE_ORDER.map((leagueKey, index) => {
          const league = LEAGUE_CONFIG[leagueKey]
          const Icon = league.icon
          const isActive = index <= currentIndex
          const isCurrent = leagueKey === currentLeague

          return (
            <div key={leagueKey} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all
                  ${isCurrent ? 'scale-110' : ''}`}
                style={{
                  background: isActive ? `${league.color}20` : 'rgba(255,255,255,0.03)',
                  borderColor: isCurrent ? `${league.color}50` : isActive ? `${league.color}20` : 'rgba(255,255,255,0.05)',
                }}
                animate={isCurrent ? {
                  boxShadow: [
                    `0 0 10px ${league.color}20`,
                    `0 0 25px ${league.color}30`,
                    `0 0 10px ${league.color}20`,
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: isActive ? league.color : 'rgba(255,255,255,0.15)' }}
                />
              </motion.div>
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? league.color : 'rgba(255,255,255,0.2)' }}
              >
                {league.name}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function BadgesGrid({ badges }) {
  const allBadgeKeys = Object.keys(BADGE_DEFINITIONS)

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border border-white/10 p-5"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      <h3 className="font-bold text-sm text-white/80 mb-4 flex items-center gap-2">
        <Award className="w-4 h-4 text-purple-400" />
        Achievements
        <span className="text-xs text-white/30 ml-auto">
          {badges.length} / {allBadgeKeys.length}
        </span>
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {allBadgeKeys.map((key) => {
          const badge = BADGE_DEFINITIONS[key]
          const earned = badges.includes(key)
          const Icon = badge.icon

          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              className={`rounded-xl border p-3 text-center transition-all duration-200
                ${earned ? 'border-white/15' : 'border-white/5 opacity-30'}`}
              style={{
                background: earned ? `${badge.color}08` : 'rgba(255,255,255,0.01)',
              }}
            >
              <div
                className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
                style={{
                  background: earned ? `${badge.color}20` : 'rgba(255,255,255,0.04)',
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: earned ? badge.color : 'rgba(255,255,255,0.15)' }}
                />
              </div>
              <p
                className="text-[11px] font-semibold truncate"
                style={{ color: earned ? badge.color : 'rgba(255,255,255,0.2)' }}
              >
                {badge.name}
              </p>
              <p className="text-[9px] text-white/25 mt-0.5">{badge.description}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function SubjectMastery({ getGalaxyProgress }) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border border-white/10 p-5"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      <h3 className="font-bold text-sm text-white/80 mb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-blue-400" />
        Subject Mastery
      </h3>

      <div className="space-y-4">
        {galaxies.map((galaxy) => {
          const galaxyConstellations = galaxy.constellationIds
            .map((cId) => constellations.find((c) => c.id === cId))
            .filter(Boolean)

          const totalStars = galaxyConstellations.reduce((sum, c) => sum + c.totalStars, 0)
          const progress = getGalaxyProgress(galaxy.id)
          const completedStars = progress?.constellations?.reduce((sum, c) => sum + c.completedStars, 0) || 0
          const mastery = totalStars > 0 ? Math.round((completedStars / totalStars) * 100) : 0

          const completedConstellations = galaxyConstellations.filter((c) => {
            const cp = progress?.constellations?.find((p) => p.id === c.id)
            return cp && cp.completedStars >= c.totalStars
          }).length

          return (
            <Link key={galaxy.id} to={`/antaryaan/galaxy/${galaxy.id}`}>
              <div className="group rounded-xl border border-white/8 p-4 hover:border-white/15 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${galaxy.colors.primary}15` }}
                  >
                    <Star className="w-5 h-5" style={{ color: galaxy.colors.primary }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-white">{galaxy.subject}</h4>
                    <p className="text-xs text-white/35">{galaxy.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold" style={{ color: galaxy.colors.primary }}>
                      {mastery}%
                    </span>
                  </div>
                </div>

                {/* Mastery bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${galaxy.colors.primary}, ${galaxy.colors.accent || galaxy.colors.secondary})`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${mastery}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>

                <div className="flex justify-between text-xs text-white/30">
                  <span>{completedStars} / {totalStars} stars</span>
                  <span>{completedConstellations} / {galaxyConstellations.length} constellations</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}

// --- Main Component ---

export default function Profile() {
  const navigate = useNavigate()
  const {
    name, title, totalXP, currentStreak, longestStreak, gems,
    currentLeague, badges, weeklyXP
  } = useUserStore()
  const { getGalaxyProgress } = useProgressStore()

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-20 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* --- Back Button --- */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => navigate('/antaryaan')}
              className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </motion.div>

          {/* --- Profile Header --- */}
          <ProfileHeader
            name={name}
            title={title}
            totalXP={totalXP}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            gems={gems}
          />

          {/* --- League History --- */}
          <LeagueHistory currentLeague={currentLeague} />

          {/* --- Badges --- */}
          <BadgesGrid badges={badges} />

          {/* --- Subject Mastery --- */}
          <SubjectMastery getGalaxyProgress={getGalaxyProgress} />
        </motion.div>
      </div>
    </div>
  )
}
