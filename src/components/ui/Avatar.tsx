interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const gradients = [
  'from-purple-400 to-violet-500',
  'from-pink-400 to-rose-500',
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
]

function getGradient(name?: string): string {
  if (!name) return gradients[0]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name[0].toUpperCase()
}

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white shadow-sm ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br ${getGradient(name)} flex items-center justify-center ring-2 ring-white shadow-sm flex-shrink-0 ${className}`}
    >
      <span className="text-white font-semibold leading-none">{getInitials(name)}</span>
    </div>
  )
}
