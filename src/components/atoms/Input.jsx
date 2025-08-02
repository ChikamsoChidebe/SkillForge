import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Input = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className,
  type = 'text',
  ...props 
}, ref) => {
  const inputClasses = clsx(
    'block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
    error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600',
    'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
    className
  )

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input