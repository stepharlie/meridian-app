"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MeridianScoreProps {
  score?: number
  recovery?: string
  load?: string
  nextStep?: string
}

const contributingFactors = [
  { name: "Sleep", score: 75, explanation: "Sleep score hit 75 — REM was short due to late screen time" },
  { name: "Recovery/HRV", score: 45, explanation: "HRV at 19ms indicates nervous system is under load" },
  { name: "Activity", score: 60, explanation: "Activity balanced but intensity was high for luteal phase" },
  { name: "Labs", score: 72, explanation: "TSH elevated at 3.03 — thyroid needs support this season" },
  { name: "Method", score: 50, explanation: "PM stack missed 3 nights this week affecting sleep quality" },
]

export function MeridianScore({
  score = 62,
  recovery = "Moderate",
  load = "Manage",
  nextStep = "Walk + protein"
}: MeridianScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return
    
    const duration = 1500
    const start = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(score * eased))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [score, isVisible])

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-chart-2"
    if (s >= 60) return "text-accent"
    if (s >= 40) return "text-chart-3"
    return "text-chart-4"
  }

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
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

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
          transition: 'all 0.38s cubic-bezier(.22,1,.36,1)',
          borderRadius: '24px',
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Score Circle */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Meridian Score
            </div>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="rgba(232,248,245,0.07)" strokeWidth="6"
                />
                {/* Progress circle — always teal gradient */}
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#67E8F9" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="url(#scoreGrad)" strokeWidth="6"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  style={{ fontFamily: "'Fraunces', serif", fontSize: '54px', fontWeight: 700, lineHeight: 0.9, color: '#67E8F9' }}
                >
                  {animatedScore}
                </span>
                <span className="text-xs mt-1" style={{ color: '#9ACBC1' }}>{getStatusLabel(animatedScore)}</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4 max-w-[180px] leading-relaxed">
              A combined read of readiness, sleep, activity, labs, body composition, and method adherence.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Recovery</span>
              <span className="text-sm font-semibold text-accent">{recovery}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Load</span>
              <span className="text-sm font-semibold text-chart-3">{load}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Next Step</span>
              <span className="text-sm font-semibold text-primary">{nextStep}</span>
            </div>
          </div>
        </div>

        {/* Contributing Factors - Expandable */}
        <div 
          style={{
            overflow: 'hidden',
            maxHeight: isExpanded ? '400px' : '0px',
            opacity: isExpanded ? 1 : 0,
            transition: 'max-height 0.38s cubic-bezier(.22,1,.36,1), opacity 0.38s cubic-bezier(.22,1,.36,1)',
            marginTop: isExpanded ? '24px' : '0px'
          }}
        >
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Contributing Factors
          </div>
          <div className="flex flex-col gap-4">
            {contributingFactors.map((factor) => (
              <div key={factor.name} className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-xs font-medium text-foreground">{factor.name}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", getFactorBarColor(factor.score))}
                        style={{ 
                          width: `${factor.score}%`,
                          transition: 'width 0.38s cubic-bezier(.22,1,.36,1)'
                        }}
                      />
                    </div>
                    <span className="w-8 text-xs font-semibold text-muted-foreground tabular-nums">{factor.score}</span>
                  </div>
                </div>
                <div className="pl-28">
                  <span className="text-[13px] text-muted-foreground leading-relaxed">{factor.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="mt-6" style={{
          background: 'rgba(45,212,191,0.07)',
          border: '1px solid rgba(45,212,191,0.22)',
          borderLeft: '4px solid #2DD4BF',
          borderRadius: '16px',
          padding: '16px 20px',
        }}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(45,212,191,0.12)' }}>
              <span style={{ color: '#2DD4BF', fontSize: '14px' }}>✦</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#2DD4BF', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Meridian Insight</span>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: '#EAFBF7' }}>
                Your recovery is moderate. Today your body needs light movement, enough protein, and a consistent night more than high intensity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
