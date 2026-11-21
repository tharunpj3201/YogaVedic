import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ label, value, unit, color = 'turmeric', delay = 0, icon }) {
  const colorMap = {
    turmeric: 'text-turmeric border-turmeric/25 bg-gradient-to-br from-turmeric/14 to-turmeric/[0.03] shadow-glow-turmeric/40',
    sage: 'text-sage border-sage/25 bg-gradient-to-br from-sage/14 to-sage/[0.03]',
    terracotta: 'text-terracotta border-terracotta/25 bg-gradient-to-br from-terracotta/14 to-terracotta/[0.03]',
    sandstone: 'text-sandstone border-sandstone/20 bg-gradient-to-br from-sandstone/10 to-sandstone/[0.02]'
  }
  const glowMap = {
    turmeric: 'hover:shadow-glow-turmeric',
    sage: 'hover:shadow-glow-sage',
    terracotta: 'hover:shadow-glow-terracotta',
    sandstone: 'hover:shadow-card-hover'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm hover-lift transition-shadow ${colorMap[color]} ${glowMap[color]}`}
    >
      <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-current opacity-[0.06] blur-2xl pointer-events-none" />
      {icon && <div className="mb-3 opacity-70 relative z-10">{icon}</div>}
      <p className="relative z-10 text-sandstone/50 text-xs font-body uppercase tracking-wider mb-1">{label}</p>
      <p className="relative z-10 font-display text-3xl font-semibold text-sandstone">
        {value}
        {unit && <span className="text-base font-body text-sandstone/40 ml-1">{unit}</span>}
      </p>
    </motion.div>
  )
}
