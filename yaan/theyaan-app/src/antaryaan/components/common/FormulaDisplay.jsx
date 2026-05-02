import { BookOpen } from 'lucide-react'

function FormulaDisplay({ title = '', formulas = [], className = '' }) {
  if (!formulas || formulas.length === 0) return null

  return (
    <div
      className={`rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 backdrop-blur-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center gap-2 px-5 py-3 border-b border-indigo-500/15 bg-indigo-500/5">
          <BookOpen size={16} className="text-indigo-400" />
          <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}

      {/* Formulas list */}
      <div className="p-5 space-y-4">
        {formulas.map((item, index) => (
          <div key={index} className="space-y-1">
            {/* Label */}
            {item.label && (
              <p className="text-sm text-slate-400 font-medium">{item.label}</p>
            )}

            {/* Formula */}
            <div className="px-4 py-2.5 rounded-lg bg-slate-900/60 border border-slate-700/30">
              <code className="text-base font-mono text-indigo-200 leading-relaxed">
                <FormulaRenderer formula={item.formula} />
              </code>
            </div>

            {/* Note */}
            {item.note && (
              <p className="text-xs text-slate-500 italic pl-1">{item.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Renders a formula string with basic math notation:
 *  - ^{...} for superscripts (e.g., x^{2} becomes x with superscript 2)
 *  - _{...} for subscripts (e.g., v_{0} becomes v with subscript 0)
 *  - Fraction notation: renders a/b inline
 *  - Common symbols: sqrt, pi, theta, delta, sigma, etc.
 */
function FormulaRenderer({ formula }) {
  if (!formula) return null

  // Process the formula string into rendered segments
  const parts = parseFormula(formula)

  return (
    <span>
      {parts.map((part, i) => {
        if (part.type === 'sup') {
          return (
            <sup key={i} className="text-xs text-indigo-300">
              {part.content}
            </sup>
          )
        }
        if (part.type === 'sub') {
          return (
            <sub key={i} className="text-xs text-indigo-300">
              {part.content}
            </sub>
          )
        }
        if (part.type === 'symbol') {
          return (
            <span key={i} className="text-purple-300">
              {part.content}
            </span>
          )
        }
        return <span key={i}>{part.content}</span>
      })}
    </span>
  )
}

function parseFormula(formula) {
  const parts = []
  let i = 0

  // Symbol replacements
  const symbols = {
    '\\pi': '\u03C0',
    '\\theta': '\u03B8',
    '\\delta': '\u03B4',
    '\\Delta': '\u0394',
    '\\sigma': '\u03C3',
    '\\Sigma': '\u03A3',
    '\\alpha': '\u03B1',
    '\\beta': '\u03B2',
    '\\gamma': '\u03B3',
    '\\lambda': '\u03BB',
    '\\mu': '\u03BC',
    '\\omega': '\u03C9',
    '\\Omega': '\u03A9',
    '\\rho': '\u03C1',
    '\\tau': '\u03C4',
    '\\epsilon': '\u03B5',
    '\\phi': '\u03C6',
    '\\infty': '\u221E',
    '\\sqrt': '\u221A',
    '\\pm': '\u00B1',
    '\\times': '\u00D7',
    '\\div': '\u00F7',
    '\\approx': '\u2248',
    '\\neq': '\u2260',
    '\\leq': '\u2264',
    '\\geq': '\u2265',
    '\\rightarrow': '\u2192',
    '\\leftarrow': '\u2190',
    '\\sum': '\u2211',
    '\\int': '\u222B',
    '\\partial': '\u2202',
    '\\nabla': '\u2207',
  }

  while (i < formula.length) {
    // Check for LaTeX-like symbols
    if (formula[i] === '\\') {
      let symbolKey = ''
      let j = i
      while (j < formula.length && (j === i || /[a-zA-Z]/.test(formula[j]))) {
        symbolKey += formula[j]
        j++
      }
      if (symbols[symbolKey]) {
        parts.push({ type: 'symbol', content: symbols[symbolKey] })
        i = j
        continue
      }
    }

    // Superscript: ^{...} or ^single_char
    if (formula[i] === '^') {
      i++
      if (formula[i] === '{') {
        i++ // skip {
        let content = ''
        while (i < formula.length && formula[i] !== '}') {
          content += formula[i]
          i++
        }
        i++ // skip }
        parts.push({ type: 'sup', content })
      } else if (i < formula.length) {
        parts.push({ type: 'sup', content: formula[i] })
        i++
      }
      continue
    }

    // Subscript: _{...} or _single_char
    if (formula[i] === '_') {
      i++
      if (formula[i] === '{') {
        i++ // skip {
        let content = ''
        while (i < formula.length && formula[i] !== '}') {
          content += formula[i]
          i++
        }
        i++ // skip }
        parts.push({ type: 'sub', content })
      } else if (i < formula.length) {
        parts.push({ type: 'sub', content: formula[i] })
        i++
      }
      continue
    }

    // Regular character - accumulate into a text part
    let text = ''
    while (
      i < formula.length &&
      formula[i] !== '^' &&
      formula[i] !== '_' &&
      formula[i] !== '\\'
    ) {
      text += formula[i]
      i++
    }
    if (text) {
      parts.push({ type: 'text', content: text })
    }
  }

  return parts
}

export default FormulaDisplay
