import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary:
        'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-button hover:from-purple-700 hover:to-violet-700 active:scale-[0.98]',
      secondary:
        'bg-purple-50 text-purple-700 hover:bg-purple-100 active:scale-[0.98]',
      ghost:
        'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-[0.98]',
      danger:
        'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98] shadow-sm',
      outline:
        'border-2 border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-50 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'text-sm px-4 py-2 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" color={variant === 'primary' ? 'white' : 'purple'} />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
