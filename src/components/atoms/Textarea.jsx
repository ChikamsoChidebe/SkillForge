import { forwardRef } from 'react'
import { clsx } from 'clsx'

const Textarea = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className,
  rows = 4,
  ...props 
}, ref) => {
  const textareaClasses = clsx(
    'block w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
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
      <textarea
        ref={ref}
        rows={rows}
        className={textareaClasses}
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

Textarea.displayName = 'Textarea'

export default Textarea