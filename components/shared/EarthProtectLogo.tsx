interface LogoProps {
  size?: number
  className?: string
}

export function EarthProtectIcon({ size = 32, className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="290 105 250 360"
      width={size}
      height={size}
      className={className}
      aria-label="Earth Protect"
    >
      <defs>
        <linearGradient id="ep-sun" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9F1C" />
          <stop offset="60%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#E71D36" />
        </linearGradient>
        <linearGradient id="ep-green" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1B4332" />
          <stop offset="70%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#52B788" />
        </linearGradient>
      </defs>

      {/* Africa map */}
      <g fill="url(#ep-sun)" opacity="0.95">
        <path d="M 370,110 C 390,105 430,115 450,130 C 470,145 490,150 510,180 C 520,195 530,220 520,240 C 510,260 495,270 490,290 C 485,310 500,330 495,350 C 490,370 460,420 440,440 C 430,450 415,460 410,440 C 405,420 410,390 405,370 C 400,350 380,340 375,320 C 370,300 385,280 370,260 C 360,245 330,240 315,225 C 300,210 290,190 295,170 C 300,150 320,145 340,130 C 355,115 360,112 370,110 Z" />
        <path d="M 515,360 C 520,350 525,370 522,390 C 518,410 510,405 512,380 Z" />
      </g>

      {/* Eco leaves */}
      <g fill="url(#ep-green)">
        <path d="M 410,440 C 410,380 400,320 425,260 C 440,225 470,190 460,150 C 430,170 415,210 410,250 C 405,290 408,370 410,440 Z" />
        <path d="M 413,340 C 370,320 320,330 310,370 C 350,390 390,380 411,355 Z" />
        <path d="M 420,280 C 460,260 500,240 515,200 C 485,195 440,220 418,255 Z" />
        <path d="M 415,220 C 390,190 350,185 340,150 C 375,150 405,180 413,200 Z" />
      </g>
    </svg>
  )
}

export function EarthProtectFullLogo({ height = 60, className }: { height?: number; className?: string }) {
  const width = height * (800 / 500)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 500"
      width={width}
      height={height}
      className={className}
    >
      <defs>
        <linearGradient id="ep-full-sun" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9F1C" />
          <stop offset="60%" stopColor="#FF6B6B" />
          <stop offset="100%" stopColor="#E71D36" />
        </linearGradient>
        <linearGradient id="ep-full-green" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1B4332" />
          <stop offset="70%" stopColor="#2D6A4F" />
          <stop offset="100%" stopColor="#52B788" />
        </linearGradient>
      </defs>
      <g fill="url(#ep-full-sun)" opacity="0.95">
        <path d="M 370,110 C 390,105 430,115 450,130 C 470,145 490,150 510,180 C 520,195 530,220 520,240 C 510,260 495,270 490,290 C 485,310 500,330 495,350 C 490,370 460,420 440,440 C 430,450 415,460 410,440 C 405,420 410,390 405,370 C 400,350 380,340 375,320 C 370,300 385,280 370,260 C 360,245 330,240 315,225 C 300,210 290,190 295,170 C 300,150 320,145 340,130 C 355,115 360,112 370,110 Z" />
        <path d="M 515,360 C 520,350 525,370 522,390 C 518,410 510,405 512,380 Z" />
      </g>
      <g fill="url(#ep-full-green)">
        <path d="M 410,440 C 410,380 400,320 425,260 C 440,225 470,190 460,150 C 430,170 415,210 410,250 C 405,290 408,370 410,440 Z" />
        <path d="M 413,340 C 370,320 320,330 310,370 C 350,390 390,380 411,355 Z" />
        <path d="M 420,280 C 460,260 500,240 515,200 C 485,195 440,220 418,255 Z" />
        <path d="M 415,220 C 390,190 350,185 340,150 C 375,150 405,180 413,200 Z" />
      </g>
      <g textAnchor="middle">
        <text x="400" y="475" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="42" fontWeight="700" fill="#1B4332" letterSpacing="1">
          Earth<tspan fill="#FF9F1C">Protect</tspan>
        </text>
        <text x="400" y="495" fontFamily="'Helvetica Neue', Arial, sans-serif" fontSize="13" fontWeight="600" fill="#52B788" letterSpacing="3.5">
          FOR ENVIRONMENTAL PROTECTION IN AFRICA
        </text>
      </g>
    </svg>
  )
}
