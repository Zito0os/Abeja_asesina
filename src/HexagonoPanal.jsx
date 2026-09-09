export function HexagonoPanal({ className = '', style = {} }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 300 260" 
      width="100%" 
      height="100%"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE875" />
          <stop offset="50%" stopColor="#F7A800" />
          <stop offset="100%" stopColor="#FFDA44" />
        </linearGradient>

        <linearGradient id="honeyBg" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FF8000" />
          <stop offset="100%" stopColor="#E05300" />
        </linearGradient>

        <linearGradient id="honeyGlow" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#FFAE00" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF8000" stopOpacity="0" />
        </linearGradient>
      </defs>

      <polygon points="85,10 215,10 285,130 215,250 85,250 15,130" fill="url(#goldBorder)" />
      <polygon points="92,24 208,24 270,130 208,236 92,236 30,130" fill="url(#honeyBg)" />
      <path d="M 40,145 Q 150,75 260,145 Q 210,230 150,234 Q 90,230 40,145 Z" fill="url(#honeyGlow)" />
      <ellipse cx="130" cy="168" rx="18" ry="8" fill="#FFE875" opacity="0.9" transform="rotate(-10 130 168)" />
      <ellipse cx="172" cy="170" rx="9" ry="6" fill="#FFE875" opacity="0.9" transform="rotate(15 172 170)" />
    </svg>
  )
}


{/*
import { HexagonoPanal } from './HexagonoPanal'

// Dentro de tu render/JSX:
<div style={{ width: '150px', height: '130px' }}>
  <HexagonoPanal />
</div>
*/}