import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { BookOpen, Calculator, Gamepad2, HelpCircle, Trophy } from 'lucide-react'
import useThemeStore from '../../stores/themeStore'

// Block type configurations
const blockTypeConfig = {
  text: {
    color: '#3B82F6', // blue
    icon: BookOpen,
    label: 'Reading',
  },
  formula: {
    color: '#8B5CF6', // purple
    icon: Calculator,
    label: 'Formulas',
  },
  keyInsight: {
    color: '#F59E0B', // amber
    icon: BookOpen,
    label: 'Insight',
  },
  reveal: {
    color: '#3B82F6', // blue
    icon: BookOpen,
    label: 'Reveal',
  },
  interactive: {
    color: '#10B981', // emerald
    icon: HelpCircle,
    label: 'Practice',
  },
  simulation: {
    color: '#F59E0B', // amber
    icon: Gamepad2,
    label: 'Game',
  },
  sandbox: {
    color: '#F59E0B', // amber
    icon: Gamepad2,
    label: 'Sandbox',
  },
  challenge: {
    color: '#EF4444', // red
    icon: Gamepad2,
    label: 'Challenge',
  },
  quiz: {
    color: '#FBBF24', // gold
    icon: Trophy,
    label: 'Quiz',
  },
}

function getBlockConfig(type) {
  return blockTypeConfig[type] || blockTypeConfig.text
}

export default function LessonProgress({ blocks, currentIndex, constellationColor }) {
  const containerRef = useRef(null)
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  const currentBlock = blocks[currentIndex]
  const currentConfig = currentBlock ? getBlockConfig(currentBlock.type) : null
  const nextBlock = blocks[currentIndex + 1]
  const nextConfig = nextBlock ? getBlockConfig(nextBlock.type) : null

  // Animate progress segment fill
  useGSAP(() => {
    // Animate current segment glow
    gsap.to(`.segment-${currentIndex}`, {
      boxShadow: `0 0 12px ${currentConfig?.color || constellationColor}60`,
      duration: 0.5,
      ease: 'power2.out',
    })

    // Remove glow from previous segments
    if (currentIndex > 0) {
      gsap.to(`.segment-${currentIndex - 1}`, {
        boxShadow: 'none',
        duration: 0.3,
      })
    }
  }, { dependencies: [currentIndex], scope: containerRef })

  return (
    <div ref={containerRef} className="w-full">
      {/* Progress bar container */}
      <div className="flex items-center gap-1.5 mb-2">
        {blocks.map((block, index) => {
          const config = getBlockConfig(block.type)
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <div
              key={index}
              className={`segment-${index} h-1.5 rounded-full transition-all duration-300 flex-1`}
              style={{
                backgroundColor: isCompleted
                  ? config.color
                  : isCurrent
                    ? `${config.color}CC`
                    : isDark
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.1)',
                opacity: isUpcoming ? 0.4 : 1,
              }}
            />
          )
        })}
      </div>

      {/* Current block info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentConfig && (
            <>
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${currentConfig.color}20` }}
              >
                <currentConfig.icon
                  className="w-3.5 h-3.5"
                  style={{ color: currentConfig.color }}
                />
              </div>
              <span className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                {currentConfig.label}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Progress counter */}
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            {currentIndex + 1} / {blocks.length}
          </span>

          {/* Next block preview */}
          {nextConfig && (
            <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
              <span>Next:</span>
              <nextConfig.icon
                className="w-3 h-3"
                style={{ color: nextConfig.color }}
              />
              <span style={{ color: nextConfig.color }}>{nextConfig.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
