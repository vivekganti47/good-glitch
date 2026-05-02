import { motion } from 'framer-motion'

function Card({
  className = '',
  children,
  hover = false,
  glow = '',
  onClick,
  as = 'div',
  ...rest
}) {
  const glowColorMap = {
    indigo: 'rgba(99, 102, 241, 0.4)',
    purple: 'rgba(139, 92, 246, 0.4)',
    emerald: 'rgba(16, 185, 129, 0.4)',
    amber: 'rgba(245, 158, 11, 0.4)',
    red: 'rgba(239, 68, 68, 0.4)',
    blue: 'rgba(59, 130, 246, 0.4)',
    sky: 'rgba(14, 165, 233, 0.4)',
    pink: 'rgba(236, 72, 153, 0.4)',
  }

  const glowColor = glowColorMap[glow] || glow || 'rgba(99, 102, 241, 0.3)'

  const hoverEffect = hover
    ? {
        scale: 1.02,
        boxShadow: `0 0 20px ${glowColor}, 0 0 40px ${glowColor.replace('0.4', '0.1').replace('0.3', '0.08')}`,
        borderColor: glowColor,
      }
    : {}

  const Component = motion[as] || motion.div

  return (
    <Component
      className={`bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? hoverEffect : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Card
