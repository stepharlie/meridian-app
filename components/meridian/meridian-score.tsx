"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MeridianScoreProps {
  score?: number
  recovery?: string
  load?: string
  nextStep?: string
}

export function MeridianScore({
  score = 62,
  recovery = "Moderate",
  load = "Manage",
  nextStep = "Walk + protein"
}: MeridianScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

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

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <section className="px-4 py-6 lg:px-6">
      <div className="p-6 rounded-2xl bg-card border border-border/50">
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
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-secondary"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className={cn("transition-all duration-1000", getScoreColor(animatedScore))}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-4xl font-bold tabular-nums", getScoreColor(animatedScore))}>
                  {animatedScore}
                </span>
                <span className="text-xs text-muted-foreground">{getStatusLabel(animatedScore)}</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4 max-w-[180px] leading-relaxed">
              A combined read of readiness, sleep, activity, labs, body composition, and method adherence.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Recovery</span>
              <span className="text-sm font-semibold text-accent">{recovery}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Load</span>
              <span className="text-sm font-semibold text-chart-3">{load}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Next Step</span>
              <span className="text-sm font-semibold text-primary">{nextStep}</span>
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-lg">✦</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Meridian Insight</span>
              <p className="text-sm text-foreground mt-1 leading-relaxed text-pretty">
                Your recovery is moderate. Today your body seems to need light movement, enough protein, and a consistent night more than high intensity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
