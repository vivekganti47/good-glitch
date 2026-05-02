import { useCallback, useId } from 'react'
import { RotateCcw } from 'lucide-react'

/**
 * Renders a set of parameter control sliders for simulations.
 *
 * Each slider has a slate-800 background, indigo gradient track,
 * monospace value display, and unit label.
 */

const layoutClasses = {
  vertical: 'flex flex-col gap-4',
  horizontal: 'flex flex-wrap gap-4 items-end',
  grid: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
}

function SimulationControls({
  controls = [],
  values = {},
  onChange,
  onReset,
  disabled = false,
  layout = 'vertical',
  isDark = true,
}) {
  const handleChange = useCallback((param, rawValue) => {
    if (onChange) {
      onChange(param, parseFloat(rawValue))
    }
  }, [onChange])

  if (controls.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className={`text-xs font-medium uppercase tracking-wider ${
          isDark ? 'text-slate-500' : 'text-slate-500'
        }`}>
          Parameters
        </h4>
        {onReset && (
          <button
            onClick={onReset}
            disabled={disabled}
            className={`flex items-center gap-1 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              isDark
                ? 'text-slate-500 hover:text-slate-300'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      <div className={layoutClasses[layout] || layoutClasses.vertical}>
        {controls.map((control) => (
          <ControlSlider
            key={control.param}
            control={control}
            value={values[control.param] ?? control.default ?? control.min ?? 0}
            onChange={handleChange}
            disabled={disabled}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  )
}

function ControlSlider({ control, value, onChange, disabled, isDark = true }) {
  const id = useId()
  const {
    param,
    label,
    min = 0,
    max = 100,
    step = 1,
    unit = '',
  } = control

  // Calculate fill percentage for custom track styling
  const fillPercent = ((value - min) / (max - min)) * 100

  // Format the display value
  const displayValue = step < 1
    ? value.toFixed(String(step).split('.')[1]?.length || 1)
    : String(value)

  const trackBgColor = isDark ? '#1e293b' : '#e2e8f0'

  return (
    <div className="flex-1 min-w-[200px]">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={`${id}-${param}`}
          className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
        >
          {label}
        </label>
        <span className={`font-mono text-sm font-medium tabular-nums ${
          isDark ? 'text-indigo-300' : 'text-indigo-600'
        }`}>
          {displayValue}
          {unit && <span className={isDark ? 'text-slate-500' : 'text-slate-400'}> {unit}</span>}
        </span>
      </div>

      <div className="relative">
        <input
          id={`${id}-${param}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(param, e.target.value)}
          disabled={disabled}
          className="sim-slider w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #818cf8 ${fillPercent}%, ${trackBgColor} ${fillPercent}%)`,
          }}
        />
      </div>

      {/* Min/Max labels */}
      <div className="flex items-center justify-between mt-0.5">
        <span className={`text-[10px] font-mono tabular-nums ${
          isDark ? 'text-slate-600' : 'text-slate-400'
        }`}>
          {min}{unit}
        </span>
        <span className={`text-[10px] font-mono tabular-nums ${
          isDark ? 'text-slate-600' : 'text-slate-400'
        }`}>
          {max}{unit}
        </span>
      </div>

      {/* Inline slider styles */}
      <style>{`
        .sim-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #818cf8;
          border: 2px solid ${isDark ? '#312e81' : '#4f46e5'};
          box-shadow: 0 0 6px rgba(129, 140, 248, 0.4);
          cursor: pointer;
          transition: box-shadow 0.15s ease;
        }
        .sim-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 12px rgba(129, 140, 248, 0.6);
        }
        .sim-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #818cf8;
          border: 2px solid ${isDark ? '#312e81' : '#4f46e5'};
          box-shadow: 0 0 6px rgba(129, 140, 248, 0.4);
          cursor: pointer;
        }
        .sim-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
      `}</style>
    </div>
  )
}

export default SimulationControls
