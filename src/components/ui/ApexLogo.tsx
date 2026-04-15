import { useId } from 'react'

interface ApexLogoProps {
  size?: number
  className?: string
  showText?: boolean
  variant?: 'default' | 'white'
}

export default function ApexLogo({
  size = 32,
  className = '',
  showText = true,
  variant = 'default',
}: ApexLogoProps) {
  const uid = useId().replace(/:/g, '')
  const symbolSize = size
  const gradientId = `apex-grad-${variant}-${uid}`
  const textSize = Math.round(size * 0.44)
  const isWhite = variant === 'white'

  const symbolColor = isWhite ? '#ffffff' : `url(#${gradientId})`
  const accentLeft = isWhite ? 'rgba(255,255,255,0.76)' : '#B45309'
  const accentRight = isWhite ? 'rgba(255,255,255,0.72)' : '#5B21B6'
  const strokeColor = isWhite ? 'rgba(255,255,255,0.8)' : `url(#${gradientId})`

  return (
    <span
      className={`inline-flex select-none items-center ${className}`}
      style={{ gap: Math.round(size * 0.3) }}
    >
      <svg
        width={symbolSize}
        height={symbolSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Apex logo mark"
      >
        {!isWhite && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#171420" />
              <stop offset="58%" stopColor="#5B21B6" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
        )}

        <path d="M32 6 L54 50 H42 L32 28 L22 50 H10 Z" fill={symbolColor} />

        <rect
          x="17"
          y="38"
          width="30"
          height="5"
          fill={isWhite ? 'rgba(255,255,255,0.18)' : 'white'}
          rx="1"
        />

        <ellipse
          cx="32"
          cy="57"
          rx="20"
          ry="6"
          stroke={strokeColor}
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="8 5"
          strokeLinecap="round"
        />

        <circle cx="10" cy="50" r="2.5" fill={accentLeft} />
        <circle cx="54" cy="50" r="2.5" fill={accentRight} />
      </svg>

      {showText && (
        <span
          style={
            isWhite
              ? {
                  fontSize: textSize,
                  lineHeight: 1,
                  letterSpacing: '0.2em',
                  fontWeight: 900,
                  color: '#ffffff',
                }
              : {
                  fontSize: textSize,
                  lineHeight: 1,
                  letterSpacing: '0.2em',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #171420 0%, #5B21B6 58%, #B45309 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }
          }
        >
          APEX
        </span>
      )}
    </span>
  )
}
