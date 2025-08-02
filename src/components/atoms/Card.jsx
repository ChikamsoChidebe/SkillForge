import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const Card = ({ 
  children, 
  className, 
  hover = false, 
  padding = 'default',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  }

  const classes = clsx(
    'rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 transition-all duration-200',
    paddingClasses[padding],
    hover && 'hover:shadow-xl hover:-translate-y-1',
    className
  )

  const MotionDiv = hover ? motion.div : 'div'

  return (
    <MotionDiv
      className={classes}
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

export default Card