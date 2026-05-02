import { Atom, FlaskConical, Dna, Leaf } from 'lucide-react'

const subjectConfig = {
  physics: {
    icon: Atom,
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30',
  },
  chemistry: {
    icon: FlaskConical,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
  },
  biology: {
    icon: Dna,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/30',
  },
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 28,
  xl: 36,
}

function SubjectIcon({
  subject = 'physics',
  size = 'md',
  className = '',
  withBackground = false,
}) {
  const config = subjectConfig[subject] || subjectConfig.physics
  const IconComponent = config.icon
  const iconSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md

  if (withBackground) {
    const containerSize = iconSize * 2
    return (
      <div
        className={`inline-flex items-center justify-center rounded-lg ${config.bgColor} border ${config.borderColor} ${className}`}
        style={{ width: containerSize, height: containerSize }}
      >
        <IconComponent size={iconSize} className={config.color} />
      </div>
    )
  }

  return (
    <IconComponent
      size={iconSize}
      className={`${config.color} ${className}`}
    />
  )
}

export { subjectConfig }
export default SubjectIcon
