import React from 'react'

export default function AccuracyRing({ accuracy = 0, size = 120, strokeWidth = 8, label = 'Accuracy' }) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (accuracy / 100) * circumference

  const color = accuracy >= 75 ? '#7C9C7A' : accuracy >= 45 ? '#E8A33D' : '#D9714E'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 8px ${color}66)` }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2A2949" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
        />
        <text x={size / 2} y={size / 2 + 6}
          fill="#F3EBDD" textAnchor="middle" fontSize={size * 0.22}
          fontFamily="Fraunces, serif" fontWeight="500"
          style={{ transform: `rotate(90deg) translateX(-${size / 2}px) translateY(-${size / 2}px)` }}
        >
          {accuracy}%
        </text>
      </svg>
      <span className="text-sandstone/50 text-xs font-body">{label}</span>
    </div>
  )
}
