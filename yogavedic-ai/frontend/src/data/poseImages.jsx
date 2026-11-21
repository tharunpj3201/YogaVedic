// Pose Reference Illustrations — YogaVedic
// Stylized line-art SVGs (not photos) so they load instantly, scale crisply,
// and stay license-clean. Each pose is a simple silhouette + dashed alignment
// guide so learners can see what the AI is checking, matching the on-screen
// skeleton overlay drawn over the live camera feed.
//
// All illustrations share the same 240x240 viewBox and color tokens so they
// drop into PoseReference.jsx without any per-pose styling.

import React from 'react'

const STROKE = '#F3EBDD'        // sandstone — body line
const GUIDE = '#E8A33D'         // turmeric — alignment guide (dashed)
const ACCENT = '#7C9C7A'        // sage — joints
const MAT = '#2A2949'           // night-soft — floor/mat

const common = {
  fill: 'none',
  stroke: STROKE,
  strokeWidth: 5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

function Joint({ cx, cy }) {
  return <circle cx={cx} cy={cy} r="4.5" fill={ACCENT} />
}

function Guide({ d }) {
  return <path d={d} stroke={GUIDE} strokeWidth="2" strokeDasharray="5 5" fill="none" opacity="0.7" />
}

function Mat({ x = 30, y = 205, w = 180 }) {
  return <rect x={x} y={y} width={w} height="8" rx="4" fill={MAT} />
}

// ── 1. Tadasana — Mountain Pose ────────────────────────────────────────────
export function Tadasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M120,40 L120,205" />
      <path {...common} d="M120,55 C124,55 128,59 128,64 C128,69 124,73 120,73 C116,73 112,69 112,64 C112,59 116,55 120,55 Z" />
      <path {...common} d="M120,73 L120,150" />
      <path {...common} d="M120,90 L95,140" />
      <path {...common} d="M120,90 L145,140" />
      <path {...common} d="M120,150 L105,205" />
      <path {...common} d="M120,150 L135,205" />
      <Joint cx={120} cy={90} /><Joint cx={120} cy={150} />
      <Joint cx={95} cy={140} /><Joint cx={145} cy={140} />
      <Joint cx={105} cy={205} /><Joint cx={135} cy={205} />
    </svg>
  )
}

// ── 2. Vrikshasana — Tree Pose ──────────────────────────────────────────────
export function Vrikshasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M105,40 L105,205" />
      <path {...common} d="M105,55 C109,55 113,59 113,64 C113,69 109,73 105,73 C101,73 97,69 97,64 C97,59 101,55 105,55 Z" />
      <path {...common} d="M105,73 L105,150" />
      <path {...common} d="M105,85 C90,70 75,65 65,60" />
      <path {...common} d="M105,85 C120,70 135,65 145,60" />
      <path {...common} d="M105,150 L105,205" />
      <path {...common} d="M105,150 C130,150 150,165 138,180 C128,191 112,182 112,168" />
      <Joint cx={105} cy={150} /><Joint cx={65} cy={60} /><Joint cx={145} cy={60} />
      <Joint cx={105} cy={205} /><Joint cx={138} cy={180} />
    </svg>
  )
}

// ── 3. Virabhadrasana II — Warrior II ───────────────────────────────────────
export function VirabhadrasanaII() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M55,135 L185,135" />
      <path {...common} d="M120,55 C124,55 128,59 128,64 C128,69 124,73 120,73 C116,73 112,69 112,64 C112,59 116,55 120,55 Z" />
      <path {...common} d="M120,73 L120,135" />
      <path {...common} d="M120,90 L60,90" />
      <path {...common} d="M120,90 L180,90" />
      <path {...common} d="M120,135 L80,135 L65,205" />
      <path {...common} d="M120,135 L165,165 L185,205" />
      <Joint cx={60} cy={90} /><Joint cx={180} cy={90} />
      <Joint cx={80} cy={135} /><Joint cx={165} cy={165} />
      <Joint cx={65} cy={205} /><Joint cx={185} cy={205} />
    </svg>
  )
}

// ── 4. Trikonasana — Triangle Pose ──────────────────────────────────────────
export function Trikonasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M75,55 L75,205" />
      <path {...common} d="M130,75 C133,75 136,78 136,81 C136,84 133,87 130,87 C127,87 124,84 124,81 C124,78 127,75 130,75 Z" />
      <path {...common} d="M130,87 L75,150" />
      <path {...common} d="M75,150 L45,205" />
      <path {...common} d="M75,150 L120,205" />
      <path {...common} d="M130,100 L75,150" />
      <path {...common} d="M75,150 C75,150 40,150 25,140" />
      <path {...common} d="M75,150 C95,130 115,90 130,60" />
      <Joint cx={75} cy={150} /><Joint cx={45} cy={205} /><Joint cx={120} cy={205} />
      <Joint cx={25} cy={140} /><Joint cx={130} cy={60} />
    </svg>
  )
}

// ── 5. Sukhasana — Easy Seated Breathing ────────────────────────────────────
export function Sukhasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M120,55 L120,150" />
      <path {...common} d="M120,55 C124,55 128,59 128,64 C128,69 124,73 120,73 C116,73 112,69 112,64 C112,59 116,55 120,55 Z" />
      <path {...common} d="M120,73 L120,150" />
      <path {...common} d="M120,90 L90,120 L70,115" />
      <path {...common} d="M120,90 L150,120 L170,115" />
      <path {...common} d="M120,150 C100,165 70,165 60,180 C75,190 100,185 120,185" />
      <path {...common} d="M120,150 C140,165 170,165 180,180 C165,190 140,185 120,185" />
      <Joint cx={90} cy={120} /><Joint cx={150} cy={120} />
      <Joint cx={60} cy={180} /><Joint cx={180} cy={180} />
    </svg>
  )
}

// ── 6. Balasana — Child's Pose ──────────────────────────────────────────────
export function Balasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M50,190 L195,150" />
      <path {...common} d="M195,160 C198,160 201,157 201,154 C201,151 198,148 195,148 C192,148 189,151 189,154 C189,157 192,160 195,160 Z" />
      <path {...common} d="M185,155 C160,170 130,185 95,190" />
      <path {...common} d="M95,190 L60,195" />
      <path {...common} d="M95,190 L60,178" />
      <path {...common} d="M95,190 L140,200" />
      <path {...common} d="M140,200 L185,195" />
      <Joint cx={95} cy={190} /><Joint cx={60} cy={195} /><Joint cx={140} cy={200} />
    </svg>
  )
}

// ── 7. Adho Mukha Svanasana — Downward Dog ──────────────────────────────────
export function AdhoMukhaSvanasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M50,195 L120,90 L190,195" />
      <path {...common} d="M118,100 C121,100 124,97 124,94 C124,91 121,88 118,88 C115,88 112,91 112,94 C112,97 115,100 118,100 Z" />
      <path {...common} d="M118,98 L80,150" />
      <path {...common} d="M80,150 L55,195" />
      <path {...common} d="M118,98 L160,150" />
      <path {...common} d="M160,150 L185,195" />
      <Joint cx={80} cy={150} /><Joint cx={160} cy={150} />
      <Joint cx={55} cy={195} /><Joint cx={185} cy={195} />
    </svg>
  )
}

// ── 8. Bhujangasana — Cobra Pose ────────────────────────────────────────────
export function Bhujangasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M60,195 C90,195 100,120 150,95" />
      <path {...common} d="M150,98 C153,98 156,95 156,92 C156,89 153,86 150,86 C147,86 144,89 144,92 C144,95 147,98 150,98 Z" />
      <path {...common} d="M144,100 C120,115 100,140 90,195" />
      <path {...common} d="M125,140 L100,170" />
      <path {...common} d="M125,140 L150,168" />
      <path {...common} d="M90,195 L60,195" />
      <Joint cx={100} cy={170} /><Joint cx={150} cy={168} /><Joint cx={90} cy={195} />
    </svg>
  )
}

// ── 9. Setu Bandhasana — Bridge Pose ────────────────────────────────────────
export function SetuBandhasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M55,195 C90,195 95,140 150,140 C190,140 195,195 195,195" />
      <path {...common} d="M58,190 C61,190 64,187 64,184 C64,181 61,178 58,178 C55,178 52,181 52,184 C52,187 55,190 58,190 Z" />
      <path {...common} d="M64,186 C90,180 100,150 150,142" />
      <path {...common} d="M150,142 C175,150 185,170 195,195" />
      <path {...common} d="M150,142 L150,175 L130,195" />
      <Joint cx={150} cy={142} /><Joint cx={150} cy={175} /><Joint cx={130} cy={195} />
    </svg>
  )
}

// ── 10. Marjaryasana-Bitilasana — Cat-Cow Flow ──────────────────────────────
export function MarjaryasanaBitilasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M55,150 Q120,110 185,150" />
      <path {...common} d="M188,158 C191,158 194,155 194,152 C194,149 191,146 188,146 C185,146 182,149 182,152 C182,155 185,158 188,158 Z" />
      <path {...common} d="M182,152 Q120,120 60,150" />
      <path {...common} d="M60,150 L55,195" />
      <path {...common} d="M75,160 L70,195" />
      <path {...common} d="M170,158 L185,195" />
      <path {...common} d="M150,150 L160,195" />
      <Joint cx={60} cy={150} /><Joint cx={170} cy={158} />
    </svg>
  )
}

// ── 11. Paschimottanasana — Seated Forward Bend ─────────────────────────────
export function Paschimottanasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M150,195 L70,195" />
      <path {...common} d="M158,150 C161,150 164,147 164,144 C164,141 161,138 158,138 C155,138 152,141 152,144 C152,147 155,150 158,150 Z" />
      <path {...common} d="M154,148 C130,165 110,178 90,182" />
      <path {...common} d="M90,182 L60,195" />
      <path {...common} d="M90,182 C90,182 95,190 105,195" />
      <path {...common} d="M150,195 L70,195" />
      <Joint cx={90} cy={182} /><Joint cx={60} cy={195} />
    </svg>
  )
}

// ── 12. Shavasana — Relaxation Pose ─────────────────────────────────────────
export function Shavasana() {
  return (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <Mat />
      <Guide d="M40,170 L200,170" />
      <path {...common} d="M200,170 C203,170 206,167 206,164 C206,161 203,158 200,158 C197,158 194,161 194,164 C194,167 197,170 200,170 Z" />
      <path {...common} d="M194,166 L60,170" />
      <path {...common} d="M120,168 L110,185" />
      <path {...common} d="M120,168 L130,185" />
      <path {...common} d="M60,170 L40,165" />
      <path {...common} d="M60,170 L40,178" />
      <Joint cx={120} cy={168} />
    </svg>
  )
}

export const POSE_ILLUSTRATIONS = {
  tadasana: Tadasana,
  vrikshasana: Vrikshasana,
  virabhadrasana2: VirabhadrasanaII,
  trikonasana: Trikonasana,
  sukhasana: Sukhasana,
  balasana: Balasana,
  adho_mukha_svanasana: AdhoMukhaSvanasana,
  bhujangasana: Bhujangasana,
  setu_bandhasana: SetuBandhasana,
  marjaryasana_bitilasana: MarjaryasanaBitilasana,
  paschimottanasana: Paschimottanasana,
  shavasana: Shavasana
}

export function getPoseIllustration(poseId) {
  return POSE_ILLUSTRATIONS[poseId] || null
}
