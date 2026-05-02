import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, ChevronRight, Trophy } from 'lucide-react'
import SimulationControls from './SimulationControls'
import SimulationReadouts from './SimulationReadouts'
import DiscoveryChecklist from './DiscoveryChecklist'
import Button from '../common/Button'
import useThemeStore from '../../stores/themeStore'

/**
 * Layout wrapper for simulation-based learning blocks.
 *
 * Provides consistent layout with title, description, canvas area,
 * controls, readouts, discovery checklist, and completion button.
 *
 * Mobile: everything stacks vertically.
 * Desktop: controls panel appears beside the canvas when space allows.
 */
function SimulationShell({
  title,
  description,
  children,
  controls,
  controlValues,
  onControlChange,
  onControlReset,
  controlLayout = 'grid',
  readouts,
  discoveries,
  isComplete = false,
  onComplete,
  isPlaying = false,
  onPlayPause,
  onReset,
  disabled = false,
  className = '',
  hidePlayControls = false,
  completionLabel = 'Complete',
  badge,
}) {
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'
  const [controlsCollapsed, setControlsCollapsed] = useState(false)

  const handleComplete = useCallback(() => {
    if (onComplete && isComplete) {
      onComplete()
    }
  }, [onComplete, isComplete])

  const hasControls = controls && controls.length > 0
  const hasReadouts = readouts && readouts.length > 0
  const hasDiscoveries = discoveries && discoveries.length > 0

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header: Title + Play controls */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${
              isDark ? 'text-slate-100' : 'text-slate-800'
            }`}>
              {title}
              {badge && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  isDark
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20'
                    : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}>
                  {badge}
                </span>
              )}
            </h3>
          )}
          {description && (
            <p className={`mt-1 text-sm leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {description}
            </p>
          )}
        </div>

        {/* Play/Pause and Reset buttons */}
        {!hidePlayControls && (onPlayPause || onReset) && (
          <div className="flex items-center gap-2 shrink-0">
            {onReset && (
              <button
                onClick={onReset}
                disabled={disabled}
                className={`p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/60 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                }`}
                title="Reset simulation"
              >
                <RotateCcw size={16} />
              </button>
            )}
            {onPlayPause && (
              <button
                onClick={onPlayPause}
                disabled={disabled}
                className="p-2 rounded-lg bg-indigo-600/80 border border-indigo-500/40 text-white hover:bg-indigo-500/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="lg:flex lg:gap-4">
        {/* Canvas/SVG area - takes most space */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Side panel for controls on large screens */}
        {hasControls && (
          <div className="hidden lg:block lg:w-72 lg:shrink-0">
            <div className="sticky top-4 space-y-4">
              <SimulationControls
                controls={controls}
                values={controlValues}
                onChange={onControlChange}
                onReset={onControlReset}
                disabled={disabled}
                layout="vertical"
                isDark={isDark}
              />
              {hasReadouts && (
                <SimulationReadouts readouts={readouts} isDark={isDark} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile/tablet controls (stacked below canvas) */}
      {hasControls && (
        <div className="lg:hidden space-y-4">
          {/* Collapsible toggle */}
          <button
            onClick={() => setControlsCollapsed((prev) => !prev)}
            className={`flex items-center gap-2 text-sm transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <motion.span
              animate={{ rotate: controlsCollapsed ? 0 : 90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={14} />
            </motion.span>
            Parameters
          </button>

          <AnimatePresence initial={false}>
            {!controlsCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <SimulationControls
                  controls={controls}
                  values={controlValues}
                  onChange={onControlChange}
                  onReset={onControlReset}
                  disabled={disabled}
                  layout={controlLayout}
                  isDark={isDark}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Mobile readouts (already shown in desktop side panel) */}
      {hasReadouts && (
        <div className="lg:hidden">
          <SimulationReadouts readouts={readouts} isDark={isDark} />
        </div>
      )}

      {/* Discovery checklist */}
      {hasDiscoveries && (
        <DiscoveryChecklist discoveries={discoveries} isDark={isDark} />
      )}

      {/* Completion button */}
      <AnimatePresence>
        {isComplete && onComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex justify-center"
          >
            <Button
              variant="success"
              size="lg"
              icon={Trophy}
              onClick={handleComplete}
              className="shadow-lg shadow-emerald-500/20"
            >
              {completionLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SimulationShell
