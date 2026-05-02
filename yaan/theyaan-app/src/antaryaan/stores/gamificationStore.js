import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Bot names for simulated league competitors
const BOT_NAMES = [
  'AstroNova', 'QuantumKid', 'StarForge', 'NebulaPilot', 'CosmicRay',
  'PhotonX', 'DarkMatter', 'GravityWell', 'SolarFlare', 'LunarEclipse',
  'OrbitDrift', 'PlasmaCore', 'WarpDrive', 'NovaBlast', 'MeteorShower',
  'CometTrail', 'PulsarBeat', 'QuasarHunt', 'VoidWalker', 'GalacticAce',
  'IonStorm', 'RedShift', 'BlueNova', 'EventHorizon', 'Singularity',
  'StealthOrbit', 'TitanClimb', 'DeepSpaceX', 'HelioRush',
]

// Achievement definitions
const ACHIEVEMENTS = {
  // Streak achievements
  'getting-started': {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Maintain a 3-day streak',
    icon: 'flame',
    category: 'streak',
    rarity: 'common',
  },
  'week-warrior': {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'shield',
    category: 'streak',
    rarity: 'uncommon',
  },
  'fortnight-fighter': {
    id: 'fortnight-fighter',
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day streak',
    icon: 'swords',
    category: 'streak',
    rarity: 'rare',
  },
  'monthly-master': {
    id: 'monthly-master',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: 'crown',
    category: 'streak',
    rarity: 'epic',
  },
  'dedicated-explorer': {
    id: 'dedicated-explorer',
    name: 'Dedicated Explorer',
    description: 'Maintain a 60-day streak',
    icon: 'compass',
    category: 'streak',
    rarity: 'legendary',
  },
  'century-club': {
    id: 'century-club',
    name: 'Century Club',
    description: 'Maintain a 100-day streak',
    icon: 'trophy',
    category: 'streak',
    rarity: 'mythic',
  },

  // Learning achievements
  'first-star': {
    id: 'first-star',
    name: 'First Light',
    description: 'Complete your first star lesson',
    icon: 'star',
    category: 'learning',
    rarity: 'common',
  },
  'five-stars': {
    id: 'five-stars',
    name: 'Star Collector',
    description: 'Complete 5 star lessons',
    icon: 'stars',
    category: 'learning',
    rarity: 'uncommon',
  },
  'ten-stars': {
    id: 'ten-stars',
    name: 'Star Navigator',
    description: 'Complete 10 star lessons',
    icon: 'sparkles',
    category: 'learning',
    rarity: 'rare',
  },
  'perfect-score': {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Score 100% on any lesson or practice',
    icon: 'target',
    category: 'learning',
    rarity: 'uncommon',
  },
  'first-mastery': {
    id: 'first-mastery',
    name: 'Knowledge Master',
    description: 'Reach mastered level on any concept',
    icon: 'brain',
    category: 'learning',
    rarity: 'rare',
  },
  'legendary-concept': {
    id: 'legendary-concept',
    name: 'Legendary Mind',
    description: 'Reach legendary level on any concept',
    icon: 'gem',
    category: 'learning',
    rarity: 'legendary',
  },

  // Practice achievements
  'first-planet': {
    id: 'first-planet',
    name: 'Planet Tamer',
    description: 'Complete your first planet practice',
    icon: 'globe',
    category: 'practice',
    rarity: 'common',
  },
  'accuracy-king': {
    id: 'accuracy-king',
    name: 'Accuracy King',
    description: 'Achieve 95%+ accuracy on a practice session',
    icon: 'crosshair',
    category: 'practice',
    rarity: 'rare',
  },

  // Quest achievements
  'first-quest': {
    id: 'first-quest',
    name: 'Quest Seeker',
    description: 'Complete your first quest',
    icon: 'scroll',
    category: 'quest',
    rarity: 'common',
  },

  // XP achievements
  'xp-100': {
    id: 'xp-100',
    name: 'Rising Star',
    description: 'Earn 100 total XP',
    icon: 'zap',
    category: 'xp',
    rarity: 'common',
  },
  'xp-500': {
    id: 'xp-500',
    name: 'Bright Comet',
    description: 'Earn 500 total XP',
    icon: 'zap',
    category: 'xp',
    rarity: 'uncommon',
  },
  'xp-1000': {
    id: 'xp-1000',
    name: 'Supernova',
    description: 'Earn 1000 total XP',
    icon: 'zap',
    category: 'xp',
    rarity: 'rare',
  },
  'xp-5000': {
    id: 'xp-5000',
    name: 'Galactic Force',
    description: 'Earn 5000 total XP',
    icon: 'zap',
    category: 'xp',
    rarity: 'epic',
  },

  // League achievements
  'league-top-10': {
    id: 'league-top-10',
    name: 'Top 10',
    description: 'Finish in the top 10 of your league',
    icon: 'medal',
    category: 'league',
    rarity: 'uncommon',
  },
  'league-top-3': {
    id: 'league-top-3',
    name: 'Podium Finish',
    description: 'Finish in the top 3 of your league',
    icon: 'award',
    category: 'league',
    rarity: 'rare',
  },
  'league-champion': {
    id: 'league-champion',
    name: 'League Champion',
    description: 'Finish first in your league',
    icon: 'crown',
    category: 'league',
    rarity: 'epic',
  },
}

// League tiers and promotion thresholds
const LEAGUE_TIERS = {
  bronze: { name: 'Bronze', color: '#CD7F32', promoteTop: 10, relegateBottom: 0 },
  silver: { name: 'Silver', color: '#C0C0C0', promoteTop: 10, relegateBottom: 5 },
  gold: { name: 'Gold', color: '#FFD700', promoteTop: 10, relegateBottom: 5 },
  platinum: { name: 'Platinum', color: '#E5E4E2', promoteTop: 5, relegateBottom: 5 },
  diamond: { name: 'Diamond', color: '#B9F2FF', promoteTop: 3, relegateBottom: 5 },
  champion: { name: 'Champion', color: '#FF6B35', promoteTop: 0, relegateBottom: 10 },
}

const LEAGUE_ORDER = ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'champion']

// Daily goal templates
const DAILY_GOAL_TEMPLATES = [
  { id: 'earn-xp', description: 'Earn {target} XP today', target: 50, type: 'xp', gems: 5 },
  { id: 'complete-lesson', description: 'Complete {target} lesson(s)', target: 1, type: 'lessons', gems: 5 },
  { id: 'practice-session', description: 'Complete {target} practice session(s)', target: 1, type: 'practice', gems: 5 },
  { id: 'perfect-score', description: 'Get a perfect score on any activity', target: 1, type: 'perfect', gems: 10 },
  { id: 'review-concepts', description: 'Review {target} concept(s)', target: 3, type: 'reviews', gems: 5 },
]

function generateBotCompetitors() {
  return BOT_NAMES.map((name) => ({
    name,
    weeklyXP: Math.floor(Math.random() * 600) + 50,
    avatar: `bot-${Math.floor(Math.random() * 10)}`,
    isBot: true,
  }))
}

function selectDailyGoals(count = 3) {
  // Deterministic based on date so goals are consistent for the day
  const today = new Date().toISOString().split('T')[0]
  const seed = today.split('-').reduce((a, b) => a + parseInt(b, 10), 0)
  const shuffled = [...DAILY_GOAL_TEMPLATES].sort(
    (a, b) => ((a.id.charCodeAt(0) * seed) % 7) - ((b.id.charCodeAt(0) * seed) % 7)
  )
  return shuffled.slice(0, count).map((goal) => ({
    ...goal,
    progress: 0,
    completed: false,
    claimed: false,
  }))
}

const useGamificationStore = create(
  persist(
    (set, get) => ({
      // Simulated league competitors
      leagueCompetitors: generateBotCompetitors(),
      leagueWeekStart: null, // ISO date string for current league week

      // Daily goals
      dailyGoals: [],
      dailyGoalsDate: null, // ISO date string

      // Achievement tracking
      achievementQueue: [], // achievements to show notification for
      recentAchievement: null,

      // --- League Actions ---

      refreshLeague: () => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]

        // If no week start or it's been 7+ days, start new week
        if (!state.leagueWeekStart) {
          set({
            leagueCompetitors: generateBotCompetitors(),
            leagueWeekStart: today,
          })
        } else {
          const weekStart = new Date(state.leagueWeekStart)
          const now = new Date()
          const daysSinceStart = Math.floor((now - weekStart) / 86400000)
          if (daysSinceStart >= 7) {
            set({
              leagueCompetitors: generateBotCompetitors(),
              leagueWeekStart: today,
            })
          }
        }
      },

      simulateBotActivity: () => {
        // Add some XP to random bots to simulate activity
        const state = get()
        const updated = state.leagueCompetitors.map((bot) => ({
          ...bot,
          weeklyXP: bot.weeklyXP + Math.floor(Math.random() * 30),
        }))
        set({ leagueCompetitors: updated })
      },

      getLeagueStandings: (playerWeeklyXP, playerName) => {
        const state = get()
        const allParticipants = [
          ...state.leagueCompetitors,
          { name: playerName || 'You', weeklyXP: playerWeeklyXP, isPlayer: true },
        ]
        return allParticipants.sort((a, b) => b.weeklyXP - a.weeklyXP).map((p, i) => ({
          ...p,
          position: i + 1,
        }))
      },

      checkLeaguePromotion: (currentLeague, position) => {
        const tier = LEAGUE_TIERS[currentLeague]
        if (!tier) return { action: 'stay' }

        const leagueIndex = LEAGUE_ORDER.indexOf(currentLeague)

        if (tier.promoteTop > 0 && position <= tier.promoteTop && leagueIndex < LEAGUE_ORDER.length - 1) {
          return { action: 'promote', newLeague: LEAGUE_ORDER[leagueIndex + 1] }
        }
        if (tier.relegateBottom > 0 && position > 30 - tier.relegateBottom && leagueIndex > 0) {
          return { action: 'relegate', newLeague: LEAGUE_ORDER[leagueIndex - 1] }
        }
        return { action: 'stay' }
      },

      // --- Daily Goals ---

      refreshDailyGoals: () => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]

        if (state.dailyGoalsDate !== today) {
          set({
            dailyGoals: selectDailyGoals(3),
            dailyGoalsDate: today,
          })
        }
      },

      updateDailyGoalProgress: (type, amount = 1) => {
        const state = get()
        const updatedGoals = state.dailyGoals.map((goal) => {
          if (goal.type !== type || goal.completed) return goal
          const newProgress = goal.progress + amount
          return {
            ...goal,
            progress: newProgress,
            completed: newProgress >= goal.target,
          }
        })
        set({ dailyGoals: updatedGoals })
      },

      claimDailyGoalReward: (goalId) => {
        const state = get()
        const updatedGoals = state.dailyGoals.map((goal) => {
          if (goal.id !== goalId || !goal.completed || goal.claimed) return goal
          return { ...goal, claimed: true }
        })
        const goal = state.dailyGoals.find((g) => g.id === goalId)
        const gems = goal?.completed && !goal?.claimed ? goal.gems : 0
        set({ dailyGoals: updatedGoals })
        return { gems }
      },

      // --- Achievement Actions ---

      checkAndAwardAchievements: (context) => {
        // context: { totalXP, starCount, planetCount, questCount, leaguePosition, conceptLevels }
        const earned = []

        // XP achievements
        if (context.totalXP >= 100) earned.push('xp-100')
        if (context.totalXP >= 500) earned.push('xp-500')
        if (context.totalXP >= 1000) earned.push('xp-1000')
        if (context.totalXP >= 5000) earned.push('xp-5000')

        // Learning achievements
        if (context.starCount >= 1) earned.push('first-star')
        if (context.starCount >= 5) earned.push('five-stars')
        if (context.starCount >= 10) earned.push('ten-stars')

        // Practice achievements
        if (context.planetCount >= 1) earned.push('first-planet')
        if (context.hadPerfectScore) earned.push('perfect-score')
        if (context.highAccuracy) earned.push('accuracy-king')

        // Quest achievements
        if (context.questCount >= 1) earned.push('first-quest')

        // League achievements
        if (context.leaguePosition <= 10) earned.push('league-top-10')
        if (context.leaguePosition <= 3) earned.push('league-top-3')
        if (context.leaguePosition === 1) earned.push('league-champion')

        // Mastery achievements
        if (context.conceptLevels) {
          if (Object.values(context.conceptLevels).some((l) => l === 'mastered')) {
            earned.push('first-mastery')
          }
          if (Object.values(context.conceptLevels).some((l) => l === 'legendary')) {
            earned.push('legendary-concept')
          }
        }

        return earned
      },

      queueAchievement: (achievementId) => {
        const state = get()
        if (!state.achievementQueue.includes(achievementId)) {
          set({
            achievementQueue: [...state.achievementQueue, achievementId],
            recentAchievement: achievementId,
          })
        }
      },

      popAchievementQueue: () => {
        const state = get()
        if (state.achievementQueue.length === 0) return null
        const [next, ...rest] = state.achievementQueue
        set({ achievementQueue: rest })
        return next
      },

      clearRecentAchievement: () => set({ recentAchievement: null }),

      // --- Getters ---

      getAchievementDef: (id) => ACHIEVEMENTS[id] || null,

      getAllAchievements: () => ACHIEVEMENTS,

      getLeagueTier: (league) => LEAGUE_TIERS[league] || LEAGUE_TIERS.bronze,

      getLeagueOrder: () => LEAGUE_ORDER,
    }),
    { name: 'yaan-gamification' }
  )
)

export { ACHIEVEMENTS, LEAGUE_TIERS, LEAGUE_ORDER }
export default useGamificationStore
