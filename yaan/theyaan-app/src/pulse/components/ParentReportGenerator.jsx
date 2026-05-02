import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Download, Copy, Check, Sparkles } from 'lucide-react'
import { generateParentReport, formatAsEmail } from '../data/parentTemplates'

export default function ParentReportGenerator({ student }) {
  const [selectedTemplate, setSelectedTemplate] = useState('progress')
  const [generated, setGenerated] = useState(null)
  const [copied, setCopied] = useState(false)

  const templates = [
    { id: 'celebration', label: 'Celebration', color: '#10B981', description: 'Positive achievements' },
    { id: 'progress', label: 'Progress Update', color: '#F59E0B', description: 'Regular update' },
    { id: 'concern', label: 'Concern / Support', color: '#EF4444', description: 'Needs attention' }
  ]

  const handleGenerate = () => {
    const report = generateParentReport(student, selectedTemplate, {
      parentName: 'Parent/Guardian',
      subject: 'Mathematics',
      classAverage: 70,
      positiveAction: 'helping classmates understand difficult concepts',
      homeActivity: `Practice ${student.weaknesses?.[0]?.replace(/-/g, ' ') || 'current topics'} problems`
    })
    setGenerated(report)
  }

  const handleCopy = () => {
    if (generated) {
      const emailText = formatAsEmail(generated)
      navigator.clipboard.writeText(emailText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Parent Communication Generator</h3>
        </div>
        <Sparkles className="w-4 h-4 text-yellow-400" />
      </div>

      {/* Template Selection */}
      <div>
        <label className="text-xs text-white/50 mb-2 block">Select Tone</label>
        <div className="grid grid-cols-3 gap-2">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedTemplate === template.id
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/8'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full mb-2 mx-auto"
                style={{ backgroundColor: template.color }}
              />
              <div className="text-xs font-semibold text-white text-center">
                {template.label}
              </div>
              <div className="text-xs text-white/40 text-center mt-1">
                {template.description}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGenerate}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all"
      >
        <Sparkles className="w-4 h-4" />
        Generate Parent Report
      </motion.button>

      {/* Generated Report */}
      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Preview */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {/* Subject Line */}
                <div>
                  <div className="text-xs text-white/40 mb-1">Subject:</div>
                  <div className="text-sm font-semibold text-white">{generated.subject}</div>
                </div>

                {/* Body */}
                <div className="space-y-3 text-sm text-white/70">
                  <p>{generated.body.greeting}</p>
                  <p>{generated.body.opening}</p>

                  {generated.body.sections.map((section, idx) => (
                    <div key={idx}>
                      {section.title && (
                        <h4 className="text-white font-semibold mb-2">{section.title}</h4>
                      )}
                      {section.intro && (
                        <p className="italic text-white/60 mb-2">{section.intro}</p>
                      )}
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="text-white/70">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <p>{generated.body.closing}</p>
                  <p className="whitespace-pre-line text-white/60">{generated.body.signature}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopy}
                className="flex-1 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                <Download className="w-4 h-4" />
                Print / Save PDF
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
