import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Scroll,
  Sparkles,
  Award,
  Zap,
  Shield,
  HelpCircle,
  RotateCcw,
} from 'lucide-react'
import SpaceBackground from '../components/common/SpaceBackground'
import Button from '../components/common/Button'
import ProgressBar from '../components/common/ProgressBar'
import useProgressStore from '../stores/progressStore'
import useUserStore from '../stores/userStore'
import { constellations } from '../data/constellations'

// ---------------------------------------------------------------------------
// Data imports
// ---------------------------------------------------------------------------
import { kinesisQuests } from '../data/quests/kinesis-prime'
import { forceNexusQuests } from '../data/quests/force-nexus'
import { momentumForgeQuests } from '../data/quests/momentum-forge'
import { periodicSanctumQuests } from '../data/quests/periodic-sanctum'
import { bondMatrixQuests } from '../data/quests/bond-matrix'
import { moleNebulaQuests } from '../data/quests/mole-nebula'
import { cellCitadelQuests } from '../data/quests/cell-citadel'
import { nucleusArchiveQuests } from '../data/quests/nucleus-archive'
import { membraneGatesQuests } from '../data/quests/membrane-gates'

const allQuests = {
  'kinesis-prime': kinesisQuests || [],
  'force-nexus': forceNexusQuests || [],
  'momentum-forge': momentumForgeQuests || [],
  'periodic-sanctum': periodicSanctumQuests || [],
  'bond-matrix': bondMatrixQuests || [],
  'mole-nebula': moleNebulaQuests || [],
  'cell-citadel': cellCitadelQuests || [],
  'nucleus-archive': nucleusArchiveQuests || [],
  'membrane-gates': membraneGatesQuests || [],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderFormattedText(text) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="font-semibold text-amber-300">
          {part.slice(2, -2)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}

// =====================================================================
// NARRATIVE TEXT DISPLAY
// =====================================================================
function NarrativeCard({ text, variant = 'story' }) {
  const styleMap = {
    story: {
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-950/20',
      glow: 'rgba(99, 102, 241, 0.15)',
      label: 'Transmission Log',
      labelColor: 'text-indigo-400',
      icon: Scroll,
    },
    reveal: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20',
      glow: 'rgba(245, 158, 11, 0.15)',
      label: 'Data Crystal Decoded',
      labelColor: 'text-amber-400',
      icon: Sparkles,
    },
    conclusion: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      glow: 'rgba(16, 185, 129, 0.15)',
      label: 'Mission Report',
      labelColor: 'text-emerald-400',
      icon: Shield,
    },
  }

  const style = styleMap[variant] || styleMap.story
  const Icon = style.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-xl overflow-hidden border ${style.border} ${style.bg}`}
      style={{ boxShadow: `0 0 30px ${style.glow}` }}
    >
      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${style.glow} 50%, transparent 100%)`,
          height: '2px',
        }}
        initial={{ top: 0 }}
        animate={{ top: '100%' }}
        transition={{ duration: 2, delay: 0.5, ease: 'linear' }}
      />

      {/* Header label */}
      <div className={`flex items-center gap-2 px-5 py-3 border-b ${style.border}`}>
        <Icon size={14} className={style.labelColor} />
        <span className={`text-xs uppercase tracking-wider font-medium ${style.labelColor}`}>
          {style.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-slate-200 leading-relaxed whitespace-pre-line">
          {renderFormattedText(text)}
        </p>
      </div>

      {/* Corner decorations */}
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${style.border} rounded-tr-xl`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${style.border} rounded-bl-xl`} />
    </motion.div>
  )
}

// =====================================================================
// QUEST QUESTION
// =====================================================================
function QuestQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const options = question.options || []

  const handleSubmit = () => {
    if (selected === null) return
    const result = selected === question.correctIndex
    setIsCorrect(result)
    setSubmitted(true)
    // Notify parent after animation
    setTimeout(() => {
      onAnswer?.(result)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4"
    >
      <p className="text-white text-lg font-medium">
        {renderFormattedText(question.text || question.prompt)}
      </p>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          let style = 'border-slate-600/40 bg-slate-800/40 hover:border-slate-500/60 hover:bg-slate-800/60'
          if (selected === idx && !submitted) style = 'border-indigo-500/60 bg-indigo-500/10'
          if (submitted && idx === question.correctIndex) style = 'border-emerald-500/60 bg-emerald-500/10'
          if (submitted && idx === selected && !isCorrect) style = 'border-red-500/60 bg-red-500/10'

          return (
            <motion.button
              key={idx}
              onClick={() => !submitted && setSelected(idx)}
              disabled={submitted}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${style} disabled:cursor-default`}
              whileHover={!submitted ? { scale: 1.01 } : {}}
              whileTap={!submitted ? { scale: 0.99 } : {}}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full border border-slate-500/50 flex items-center justify-center text-sm text-slate-400 font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-slate-200">{opt}</span>
                {submitted && idx === question.correctIndex && (
                  <CheckCircle2 size={18} className="ml-auto text-emerald-400" />
                )}
                {submitted && idx === selected && !isCorrect && (
                  <XCircle size={18} className="ml-auto text-red-400" />
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {!submitted && (
        <Button onClick={handleSubmit} disabled={selected === null}>
          Submit Answer
        </Button>
      )}

      {submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-lg p-4 border ${
            isCorrect
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
        >
          {isCorrect ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Correct!</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <XCircle size={18} className="text-red-400" />
                <span className="text-red-300 font-semibold">Not quite.</span>
              </div>
              {question.explanation && (
                <p className="text-slate-300 text-sm mt-2">{question.explanation}</p>
              )}
            </div>
          )}
          {isCorrect && question.explanation && (
            <p className="text-slate-300 text-sm mt-2">{question.explanation}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// =====================================================================
// QUEST INTRO SCREEN
// =====================================================================
function QuestIntro({ quest, constellation, onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Quest icon */}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.3 }}
          className="relative mx-auto w-28 h-28"
        >
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)',
              boxShadow: '0 0 50px rgba(99, 102, 241, 0.3), 0 0 100px rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <Scroll size={44} className="text-indigo-400" />
          </div>
          {/* Orbiting particle */}
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-indigo-400"
            style={{ top: -4, left: '50%', marginLeft: -4, transformOrigin: '4px 60px' }}
            animate={{
              rotate: 360,
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">
            Side Quest
          </span>
          <h1 className="text-3xl font-bold text-white">{quest.name}</h1>
          <p className="text-slate-400 text-sm">
            {constellation?.name || 'Unknown Constellation'}
          </p>
        </motion.div>

        {/* Quest narrative intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <NarrativeCard text={quest.intro || quest.narrative || 'A mysterious signal has been detected...'} variant="story" />
        </motion.div>

        {/* Quest metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-6 text-sm"
        >
          {quest.parts && (
            <span className="text-slate-400">
              <span className="text-white font-medium">{quest.parts.length}</span> parts
            </span>
          )}
          {quest.xp && (
            <span className="text-amber-400 flex items-center gap-1">
              <Zap size={14} />
              {quest.xp} XP
            </span>
          )}
          {quest.reward && (
            <span className="text-purple-400 flex items-center gap-1">
              <Award size={14} />
              Reward
            </span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Button onClick={onStart} icon={ChevronRight} size="lg" className="w-full justify-center">
            Begin Quest
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// =====================================================================
// QUEST COMPLETION SCREEN
// =====================================================================
function QuestCompletion({ quest, constellation, earnedXP, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* Award animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.2 }}
          className="relative mx-auto w-32 h-32"
        >
          <div className="absolute inset-0 rounded-full bg-purple-500/15 animate-ping" style={{ animationDuration: '2s' }} />
          <div
            className="absolute inset-2 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(99,102,241,0.1) 70%)',
              boxShadow: '0 0 60px rgba(139, 92, 246, 0.4)',
            }}
          >
            <Award size={48} className="text-purple-400" />
          </div>
          {/* Sparkle particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-purple-300"
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos((i * Math.PI * 2) / 8) * 80,
                y: Math.sin((i * Math.PI * 2) / 8) * 80,
              }}
              transition={{ delay: 0.5 + i * 0.08, duration: 1 }}
              style={{ left: '50%', top: '50%', marginLeft: -3, marginTop: -3 }}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-white">Quest Complete!</h1>
          <p className="text-slate-400">{quest?.name}</p>
        </motion.div>

        {/* Lore reward */}
        {quest?.loreReward && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <NarrativeCard text={quest.loreReward} variant="conclusion" />
          </motion.div>
        )}

        {/* XP & Rewards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 200 }}
          className="space-y-4"
        >
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
            <div className="flex items-center justify-center gap-3">
              <Zap size={22} className="text-amber-400" />
              <span className="text-2xl font-bold text-amber-300">+{earnedXP} XP</span>
            </div>
          </div>

          {(quest?.badgeReward || quest?.titleReward) && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5 space-y-2">
              {quest.titleReward && (
                <div className="flex items-center justify-center gap-2">
                  <Shield size={16} className="text-purple-400" />
                  <span className="text-purple-300 font-medium">Title Unlocked: {quest.titleReward}</span>
                </div>
              )}
              {quest.badgeReward && (
                <div className="flex items-center justify-center gap-2">
                  <Award size={16} className="text-purple-400" />
                  <span className="text-purple-300 font-medium">Badge: {quest.badgeReward}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Button
            onClick={onBack}
            icon={ArrowLeft}
            size="lg"
            className="w-full justify-center"
          >
            Back to {constellation?.name || 'Constellation'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// =====================================================================
// MAIN COMPONENT: SideQuest
// =====================================================================
function SideQuest() {
  const { constellationId, questId } = useParams()
  const navigate = useNavigate()
  const completeQuest = useProgressStore((s) => s.completeQuest)
  const addXP = useUserStore((s) => s.addXP)

  // Find data
  const quests = allQuests[constellationId] || []
  const quest = quests.find((q) => q.id === questId)
  const constellation = constellations.find((c) => c.id === constellationId)
  const parts = quest?.parts || []

  // State
  const [started, setStarted] = useState(false)
  const [currentPart, setCurrentPart] = useState(0)
  const [partPhase, setPartPhase] = useState('story') // 'story' | 'question' | 'reveal'
  const [questComplete, setQuestComplete] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)
  const [score, setScore] = useState(0)

  const part = parts[currentPart]

  const handleStart = useCallback(() => {
    setStarted(true)
    setPartPhase('story')
  }, [])

  const handleContinueFromStory = useCallback(() => {
    if (part?.question) {
      setPartPhase('question')
    } else if (part?.reveal) {
      setPartPhase('reveal')
    } else {
      // No question, just narrative; move to next part
      advancePart()
    }
  }, [part])

  const handleAnswer = useCallback(
    (correct) => {
      if (correct) setScore((s) => s + 1)
      // After answering, show reveal if available, otherwise advance
      setTimeout(() => {
        if (part?.reveal) {
          setPartPhase('reveal')
        } else {
          advancePart()
        }
      }, 1800)
    },
    [part]
  )

  const advancePart = useCallback(() => {
    if (currentPart < parts.length - 1) {
      setCurrentPart((p) => p + 1)
      setPartPhase('story')
    } else {
      // Quest complete
      const result = completeQuest(questId, constellationId)
      const xp = addXP(result?.xpEarned || 100)
      setEarnedXP(xp || result?.xpEarned || 100)

      // Add badge/title if applicable
      if (quest?.titleReward) {
        useUserStore.getState().titles?.push?.(quest.titleReward)
      }
      if (quest?.badgeReward) {
        useUserStore.getState().addBadge?.(quest.badgeReward)
      }

      setQuestComplete(true)
    }
  }, [currentPart, parts.length, questId, constellationId, completeQuest, addXP, quest])

  const handleContinueFromReveal = useCallback(() => {
    advancePart()
  }, [advancePart])

  const handleBack = useCallback(() => {
    navigate(`/antaryaan/constellation/${constellationId}`)
  }, [navigate, constellationId])

  // Not found
  if (!quest) {
    return (
      <div className="min-h-screen relative">
        <SpaceBackground />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <HelpCircle size={48} className="text-slate-500 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Quest Not Found</h2>
            <p className="text-slate-400 max-w-md">
              This side quest hasn't been discovered yet. The data may still be loading.
            </p>
            <Button onClick={() => navigate(-1)} icon={ArrowLeft} variant="secondary">
              Go Back
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  // Intro screen
  if (!started) {
    return (
      <div className="min-h-screen relative">
        <SpaceBackground />
        <div className="relative z-10">
          <QuestIntro quest={quest} constellation={constellation} onStart={handleStart} />
        </div>
      </div>
    )
  }

  // Completion screen
  if (questComplete) {
    return (
      <div className="min-h-screen relative">
        <SpaceBackground />
        <div className="relative z-10">
          <QuestCompletion
            quest={quest}
            constellation={constellation}
            earnedXP={earnedXP}
            onBack={handleBack}
          />
        </div>
      </div>
    )
  }

  // Active quest
  return (
    <div className="min-h-screen relative">
      <SpaceBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-700/30 bg-slate-900/40 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleBack}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/40 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight flex items-center gap-2">
                <Scroll size={16} className="text-indigo-400" />
                {quest.name}
              </h1>
              <p className="text-slate-500 text-xs">
                Side Quest - {constellation?.name || constellationId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400">
              Part {currentPart + 1} of {parts.length}
            </span>
            <div className="w-28 sm:w-40">
              <ProgressBar
                value={currentPart + 1}
                max={parts.length}
                color="purple"
                size="sm"
                animated
              />
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center px-4 md:px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-2xl space-y-6">
            <AnimatePresence mode="wait">
              {/* Story phase */}
              {partPhase === 'story' && part?.story && (
                <motion.div
                  key={`story-${currentPart}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Part title */}
                  {part.title && (
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl font-bold text-white"
                    >
                      {part.title}
                    </motion.h2>
                  )}

                  <NarrativeCard text={part.story} variant="story" />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      onClick={handleContinueFromStory}
                      icon={ChevronRight}
                      size="lg"
                      className="w-full justify-center"
                    >
                      {part.question ? 'Face the Challenge' : 'Continue'}
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Question phase */}
              {partPhase === 'question' && part?.question && (
                <motion.div
                  key={`question-${currentPart}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {part.questionContext && (
                    <NarrativeCard text={part.questionContext} variant="story" />
                  )}

                  <QuestQuestion
                    question={part.question}
                    onAnswer={handleAnswer}
                  />
                </motion.div>
              )}

              {/* Reveal phase */}
              {partPhase === 'reveal' && part?.reveal && (
                <motion.div
                  key={`reveal-${currentPart}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <NarrativeCard text={part.reveal} variant="reveal" />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button
                      onClick={handleContinueFromReveal}
                      icon={currentPart < parts.length - 1 ? ChevronRight : Sparkles}
                      size="lg"
                      className="w-full justify-center"
                    >
                      {currentPart < parts.length - 1 ? 'Continue Quest' : 'Complete Quest'}
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Fallback for parts with only story and no question/reveal */}
              {partPhase === 'story' && !part?.story && (
                <motion.div
                  key={`fallback-${currentPart}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <p className="text-slate-400">This part has no content yet.</p>
                  <Button
                    onClick={() => advancePart()}
                    variant="secondary"
                    className="mt-4"
                    icon={ChevronRight}
                  >
                    Skip
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideQuest
