"use client"

import { Moon, Zap, Brain, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const sleepMetrics = [
  { label: "Total Sleep", value: "7h 9m", icon: Moon, color: "text-indigo-400", bgColor: "bg-indigo-500/10" },
  { label: "Deep Sleep", value: "1h 31m", icon: Zap, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
  { label: "REM Sleep", value: "1h 51m", icon: Brain, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  { label: "HRV", value: "19ms", icon: Heart, color: "text-rose-400", bgColor: "bg-rose-500/10" },
]

const sleepPhases = [
  { phase: "Light", duration: 226, color: "bg-blue-400/60" }, // 3h 46m = 226 min
  { phase: "Deep", duration: 91, color: "bg-emerald-400" },   // 1h 31m = 91 min
  { phase: "REM", duration: 111, color: "bg-purple-400" },    // 1h 51m = 111 min
]

const weeklyScores = [71, 82, 58, 73, 79, 80, 62, 76, 84, 74, 70, 75]

const weekdayAvg = "7h 30m"
const weekendAvg = "8h 23m"

export function SleepPage() {
  const totalDuration = sleepPhases.reduce((sum, p) => sum + p.duration, 0)

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {sleepMetrics.map((metric) => (
          <div
            key={metric.label}
            className="p-4 rounded-xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                metric.bgColor
              )}>
                <metric.icon className={cn("w-4 h-4", metric.color)} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-0.5">{metric.label}</p>
            <span 
              className="text-xl font-semibold text-foreground tabular-nums"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Sleep Phases Bar */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Sleep Phases</h2>
        </div>
        
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <div className="flex h-6 rounded-lg overflow-hidden mb-4">
            {sleepPhases.map((phase) => (
              <div
                key={phase.phase}
                className={cn("h-full", phase.color)}
                style={{ 
                  width: `${(phase.duration / totalDuration) * 100}%`,
                  transition: 'width 0.38s cubic-bezier(.22,1,.36,1)'
                }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {sleepPhases.map((phase) => (
              <div key={phase.phase} className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-sm", phase.color)} />
                <span className="text-xs text-muted-foreground">
                  {phase.phase} ({Math.floor(phase.duration / 60)}h {phase.duration % 60}m)
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Score Chart */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Sleep Score (12 Days)</h2>
        </div>
        
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-end justify-between gap-1.5 h-32 mb-3">
            {weeklyScores.map((score, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground tabular-nums">{score}</span>
                <div 
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-300",
                    score < 65 ? "bg-chart-4" : "bg-primary"
                  )}
                  style={{ height: `${score}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>12 days ago</span>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-xs text-muted-foreground">65+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-chart-4" />
              <span className="text-xs text-muted-foreground">Below 65</span>
            </div>
          </div>
        </div>
      </section>

      {/* Week vs Weekend Comparison */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Weekday vs Weekend</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Weekday Avg</p>
            <span 
              className="text-xl font-semibold text-foreground tabular-nums"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {weekdayAvg}
            </span>
            <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
              <div 
                className="h-full rounded-full bg-primary"
                style={{ width: '75%' }}
              />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Weekend Avg</p>
            <span 
              className="text-xl font-semibold text-foreground tabular-nums"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {weekendAvg}
            </span>
            <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
              <div 
                className="h-full rounded-full bg-accent"
                style={{ width: '88%' }}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          You sleep 53 minutes more on weekends
        </p>
      </section>

      {/* Meridian Insight */}
      <section className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Moon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Meridian Insight</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your HRV of 19ms is low, and REM was cut short at 1h 51m — likely due to elevated TSH impacting sleep architecture. 
              Deep sleep hit target at 1h 31m, but overall recovery is compromised. Prioritize your PM stack tonight 
              (magnesium, glycine) and aim for lights out by 10pm to support thyroid and nervous system recovery.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
