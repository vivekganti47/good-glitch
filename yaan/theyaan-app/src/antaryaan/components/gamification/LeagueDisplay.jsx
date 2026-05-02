import { useMemo } from 'react'
import useUserStore from '../../stores/userStore'
import useGamificationStore from '../../stores/gamificationStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, ChevronUp, ChevronDown, Crown, Shield, Gem, Diamond } from 'lucide-react'

const botNames = [
  'Arjun S.', 'Priya M.', 'Rahul K.', 'Ananya P.', 'Vikram R.',
  'Sneha T.', 'Aditya B.', 'Kavya N.', 'Rohan D.', 'Meera L.',
  'Karthik V.', 'Divya G.', 'Siddharth J.', 'Nisha C.', 'Amit H.',
  'Pooja S.', 'Varun M.', 'Shreya K.', 'Nikhil P.', 'Riya A.',
  'Deepak R.', 'Anjali T.', 'Suresh B.', 'Neha W.', 'Manish D.',
  'Swati L.', 'Raj G.', 'Tanvi J.', 'Hari C.',
]

const leagueConfig = {
  bronze: {
    name: 'Bronze',
    color: '#CD7F32',
    bg: 'from-amber-900/60 to-amber-800/40',
    border: 'border-amber-700/50',
    textColor: 'text-amber-400',
    icon: Shield,
  },
  silver: {
    name: 'Silver',
    color: '#C0C0C0',
    bg: 'from-slate-600/60 to-slate-500/40',
    border: 'border-slate-500/50',
    textColor: 'text-slate-300',
    icon: Shield,
  },
  gold: {
    name: 'Gold',
    color: '#FFD700',
    bg: 'from-yellow-700/60 to-yellow-600/40',
    border: 'border-yellow-600/50',
    textColor: 'text-yellow-400',
    icon: Crown,
  },
  platinum: {
    name: 'Platinum',
    color: '#E5E4E2',
    bg: 'from-sky-800/60 to-sky-700/40',
    border: 'border-sky-600/50',
    textColor: 'text-sky-300',
    icon: Gem,
  },
  diamond: {
    name: 'Diamond',
    color: '#B9F2FF',
    bg: 'from-blue-700/60 to-blue-600/40',
    border: 'border-blue-500/50',
    textColor: 'text-blue-300',
    icon: Diamond,
  },
  champion: {
    name: 'Champion',
    color: '#A855F7',
    bg: 'from-purple-700/60 to-purple-600/40',
    border: 'border-purple-500/50',
    textColor: 'text-purple-300',
    icon: Crown,
  },
}

function generateBotXPDistribution(userWeeklyXP) {
  // Create a realistic distribution around the user's weekly XP
  const base = Math.max(20, userWeeklyXP)
  return botNames.map((name) => {
    // Spread bots: some above, some below, centered around user's XP
    const variance = base * 1.8
    const rawXP = Math.round(base + (Math.random() - 0.45) * variance)
    return {
      name,
      weeklyXP: Math.max(5, rawXP),
      isBot: true,
    }
  })
}

function getWeekNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now - start
  const oneWeek = 604800000
  return Math.ceil(diff / oneWeek)
}

function getDaysUntilWeekEnd() {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday
  // Week ends Sunday
  const daysLeft = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  return daysLeft
}

function LeagueDisplay() {
  const name = useUserStore((s) => s.name)
  const weeklyXP = useUserStore((s) => s.weeklyXP)
  const currentLeague = useUserStore((s) => s.currentLeague)

  const config = leagueConfig[currentLeague] || leagueConfig.bronze
  const LeagueIcon = config.icon
  const weekNum = getWeekNumber()
  const daysLeft = getDaysUntilWeekEnd()

  // Generate standings with user included
  const standings = useMemo(() => {
    const bots = generateBotXPDistribution(weeklyXP)
    const allParticipants = [
      ...bots,
      { name: name || 'You', weeklyXP, isPlayer: true },
    ]
    return allParticipants
      .sort((a, b) => b.weeklyXP - a.weeklyXP)
      .map((p, i) => ({ ...p, position: i + 1 }))
  }, [weeklyXP, name])

  const userEntry = standings.find((s) => s.isPlayer)
  const userPosition = userEntry?.position || 15
  const totalParticipants = standings.length // 30

  // Promotion zone: top 10, Demotion zone: bottom 5 (positions 26-30)
  const promotionCutoff = 10
  const demotionCutoff = totalParticipants - 4 // position 26+

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-slate-800/50 border ${config.border} rounded-xl backdrop-blur-sm overflow-hidden`}
    >
      {/* League Header */}
      <div className={`bg-gradient-to-r ${config.bg} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${config.color}20`, border: `2px solid ${config.color}` }}
            >
              <LeagueIcon size={20} style={{ color: config.color }} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${config.textColor}`}>
                {config.name} League
              </h3>
              <p className="text-xs text-slate-400">Week {weekNum}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-300 font-medium">
              Ends in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* User Position Summary */}
      <div className="px-5 py-3 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">#{userPosition}</span>
            {userPosition <= promotionCutoff && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <ChevronUp size={12} />
                Promotion Zone
              </span>
            )}
            {userPosition > demotionCutoff && (
              <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                <ChevronDown size={12} />
                Demotion Zone
              </span>
            )}
          </div>
          <div className="text-sm text-slate-400">
            {weeklyXP} XP this week
          </div>
        </div>
      </div>

      {/* Leaderboard - show top 10 */}
      <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
        {standings.slice(0, 10).map((entry, idx) => {
          const isUser = entry.isPlayer
          const inPromoZone = entry.position <= promotionCutoff
          const inDemotionZone = entry.position > demotionCutoff

          return (
            <motion.div
              key={entry.name + idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`flex items-center gap-3 px-5 py-2.5 border-b border-slate-700/30 transition-colors
                ${isUser ? 'bg-indigo-500/10 border-l-2 border-l-indigo-400' : ''}
                ${!isUser && inPromoZone ? 'bg-emerald-500/5' : ''}
                ${!isUser && inDemotionZone ? 'bg-red-500/5' : ''}
              `}
            >
              {/* Rank */}
              <div className="w-8 text-center">
                {entry.position === 1 ? (
                  <Crown size={18} className="text-yellow-400 mx-auto" />
                ) : entry.position === 2 ? (
                  <Trophy size={16} className="text-slate-300 mx-auto" />
                ) : entry.position === 3 ? (
                  <Trophy size={16} className="text-amber-600 mx-auto" />
                ) : (
                  <span className="text-sm text-slate-500 font-medium">{entry.position}</span>
                )}
              </div>

              {/* Avatar placeholder */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${isUser ? 'bg-indigo-500/30 text-indigo-300 ring-2 ring-indigo-400' : 'bg-slate-700/50 text-slate-400'}`}
              >
                {entry.name.charAt(0)}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium truncate block ${isUser ? 'text-indigo-300' : 'text-slate-300'}`}>
                  {isUser ? `${entry.name} (You)` : entry.name}
                </span>
              </div>

              {/* XP */}
              <div className="text-right">
                <span className={`text-sm font-semibold ${isUser ? 'text-indigo-300' : 'text-slate-400'}`}>
                  {entry.weeklyXP.toLocaleString()} XP
                </span>
              </div>

              {/* Zone indicator */}
              <div className="w-3">
                {inPromoZone && (
                  <div className="w-2 h-2 rounded-full bg-emerald-400" title="Promotion zone" />
                )}
                {inDemotionZone && (
                  <div className="w-2 h-2 rounded-full bg-red-400" title="Demotion zone" />
                )}
              </div>
            </motion.div>
          )
        })}

        {/* Separator if user is not in top 10 */}
        {userPosition > 10 && (
          <>
            <div className="px-5 py-2 text-center text-xs text-slate-500">
              ...
            </div>

            {/* Show user's row */}
            {(() => {
              const entry = userEntry
              const inDemotionZone = entry.position > demotionCutoff
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 px-5 py-2.5 border-b border-slate-700/30 bg-indigo-500/10 border-l-2 border-l-indigo-400"
                >
                  <div className="w-8 text-center">
                    <span className="text-sm text-indigo-300 font-bold">{entry.position}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/30 text-indigo-300 ring-2 ring-indigo-400">
                    {entry.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-indigo-300 truncate block">
                      {entry.name} (You)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-indigo-300">
                      {entry.weeklyXP.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="w-3">
                    {inDemotionZone && (
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                    )}
                  </div>
                </motion.div>
              )
            })()}
          </>
        )}
      </div>

      {/* Footer with zone legend */}
      <div className="px-5 py-3 bg-slate-900/30 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Top {promotionCutoff}: Promotion
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            Bottom 5: Demotion
          </span>
        </div>
        <span>{totalParticipants} participants</span>
      </div>
    </motion.div>
  )
}

export default LeagueDisplay
