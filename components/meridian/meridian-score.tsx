"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface MeridianScoreProps {
  score?: number
  recovery?: string
  load?: string
  nextStep?: string
}

const contributingFactors = [
  { name: "Sleep", score: 75, explanation: "Sleep score 75 — deep sleep still below target, REM was cut short" },
  { name: "Recovery/HRV", score: 45, explanation: "HRV 19ms — 21% below your 24ms baseline, nervous system under load" },
  { name: "Activity", score: 60, explanation: "Movement balanced but intensity too high for luteal phase day 18" },
  { name: "Labs", score: 72, explanation: "TSH 3.03 elevated vs ideal <2.5 — thyroid conversion suboptimal" },
  { name: "Method", score: 50, explanation: "PM stack missed 3 nights — directly affecting HRV and deep sleep" },
]

export function MeridianScore({
  score = 62,
  recovery = "Moderate",
  load = "Manage",
  nextStep = "Walk + protein"
}: MeridianScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(score) // Start at target, not 0
  const [displayScore, setDisplayScore] = useState(0) // Visual counter starts at 0
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    // Small delay to ensure component is mounted and visible
    const delay = setTimeout(() => {
      if (hasAnimated) return
      setHasAnimated(true)

      const duration = 1600
      const startTime = Date.now()
      const startValue = 0
      const endValue = score

      const tick = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(startValue + (endValue - startValue) * eased)
        setDisplayScore(current)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(tick)
        }
      }

      animationRef.current = requestAnimationFrame(tick)
    }, 300)

    return () => {
      clearTimeout(delay)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [score, hasAnimated])

  const getStatusLabel = (s: number) => {
    if (s >= 80) return "Optimal"
    if (s >= 60) return "Moderate"
    if (s >= 40) return "Low"
    return "Needs Attention"
  }

  const getFactorBarColor = (s: number) => {
    if (s >= 80) return "bg-chart-2"
    if (s >= 60) return "bg-accent"
    if (s >= 40) return "bg-chart-3"
    return "bg-chart-4"
  }

  const circumference = 2 * Math.PI * 45
  // Use displayScore for the ring animation
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  return (
    <section className="px-4 py-4 lg:px-6">
      <div
        className="p-6 rounded-2xl cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'rgba(232,248,245,0.055)',
          border: '1px solid rgba(103,232,249,0.13)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          transition: 'border-color 0.38s cubic-bezier(.22,1,.36,1)',
          borderRadius: '24px',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Score Ring */}
          <div className="flex flex-col items-center">
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ACBC1', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '16px' }}>
              Meridian Score
            </div>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#67E8F9" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="rgba(232,248,245,0.07)" strokeWidth="6"
                />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="6"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 0.05s linear',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: '54px',
                  fontWeight: 700,
                  lineHeight: 0.9,
                  color: '#67E8F9'
                }}>
                  {displayScore}
                </span>
                <span style={{ fontSize: '12px', color: '#9ACBC1', marginTop: '6px' }}>
                  {getStatusLabel(displayScore)}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: '#9ACBC1', textAlign: 'center', marginTop: '12px', maxWidth: '180px', lineHeight: 1.5 }}>
              Tap to see what's driving your score today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ACBC1', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Recovery</span>
              <span className="text-sm font-semibold text-accent">{recovery}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ACBC1', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Load</span>
              <span className="text-sm font-semibold text-chart-3">{load}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ACBC1', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Next Step</span>
              <span className="text-sm font-semibold text-primary">{nextStep}</span>
            </div>
          </div>
        </div>

        {/* Contributing Factors — Expandable */}
        <div style={{
          overflow: 'hidden',
          maxHeight: isExpanded ? '500px' : '0px',
          opacity: isExpanded ? 1 : 0,
          transition: 'max-height 0.38s cubic-bezier(.22,1,.36,1), opacity 0.3s ease',
          marginTop: isExpanded ? '24px' : '0px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ACBC1', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '16px' }}>
            Contributing Factors
          </div>
          <div className="flex flex-col gap-4">
            {contributingFactors.map((factor) => (
              <div key={factor.name} className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <div className="w-24 flex-shrink-0">
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#EAFBF7' }}>{factor.name}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", getFactorBarColor(factor.score))}
                        style={{ width: isExpanded ? `${factor.score}%` : '0%', transition: 'width 0.7s cubic-bezier(.22,1,.36,1) 0.1s' }}
                      />
                    </div>
                    <span style={{ width: '28px', fontSize: '13px', fontWeight: 700, color: '#9ACBC1' }}>{factor.score}</span>
                  </div>
                </div>
                <div className="pl-28">
                  <span style={{ fontSize: '13px', color: '#9ACBC1', lineHeight: 1.5 }}>{factor.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insight block */}
        <div style={{
          marginTop: '20px',
          background: 'rgba(45,212,191,0.07)',
          border: '1px solid rgba(45,212,191,0.22)',
          borderLeft: '4px solid #2DD4BF',
          borderRadius: '14px',
          padding: '16px 18px',
        }}>
          <div className="flex items-start gap-3">
            <div style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(45,212,191,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#2DD4BF', fontSize: '13px' }}>✦</span>
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#2DD4BF', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Meridian Insight</span>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#EAFBF7', marginTop: '6px', fontWeight: 500 }}>
                TSH elevated + HRV low = nervous system under load. Walk 20 min, hit protein, complete your PM stack tonight.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
