import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25',
  secondary:
    'bg-transparent border border-slate-500 hover:border-slate-400 text-slate-200 hover:bg-slate-800/50',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25',
  warning: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/25',
  danger: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2.5',
}

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
}

function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  icon: Icon,
  type = 'button',
  ...rest
}) {
  const isDisabled = disabled || loading

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900'

  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabledClasses} ${className}`}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      whileHover={isDisabled ? {} : { scale: 1.03 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...rest}
    >
      {loading ? (
        <Loader2 size={iconSizes[size] || 16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={iconSizes[size] || 16} />
      ) : null}
      {children}
    </motion.button>
  )
}

export default Button
