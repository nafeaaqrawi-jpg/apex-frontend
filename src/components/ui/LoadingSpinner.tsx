interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'purple' | 'white' | 'gray'
  className?: string
}

export default function LoadingSpinner({
  size = 'md',
  color = 'purple',
  className = '',
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-12 h-12 border-[3px]',
  }

  const colors = {
    purple: 'border-purple-200 border-t-purple-600',
    white: 'border-white/30 border-t-white',
    gray: 'border-gray-200 border-t-gray-500',
  }

  return (
    <div
      className={`${sizes[size]} ${colors[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" />
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  )
}
