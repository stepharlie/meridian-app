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

  const cardStyle = {
    background: 'rgba(232,248,245,0.055)',
    border: '1px solid rgba(103,232,249,0.13)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '18px',
  }

  const insightStyle = {
    background: 'rgba(45,212,191,0.07)',
    border: '1px solid rgba(45,212,191,0.22)',
    borderLeft: '4px solid #2DD4BF',
    borderRadius: '18px',
    padding: '20px',
  }

  return (
    <div className="space-y-5">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {sleepMetrics.map((metric) => (
          <div key={metric.label} style={cardStyle} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", metric.bgColor)}>
                <metric.icon className={cn("w-4 h-4", metric.color)} />
              </div>
            </div>
            <p className="text-xs mb-0.5" style={{ color: '#9ACBC1' }}>{metric.label}</p>
            <span className="text-xl font-semibold tabular-nums" style={{ fontFamily: "'Fraunces', serif", color: '#EAFBF7' }}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Sleep Phases Bar */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Moon className="w-4 h-4" style={{ color: '#2DD4BF' }} />
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ACBC1' }}>Sleep Phases</h2>
        </div>
        <div style={cardStyle} className="p-4">
          <div className="flex h-6 rounded-lg overflow-hidden mb-4">
            {sleepPhases.map((phase) => (
              <div key={phase.phase} className={cn("h-full", phase.color)}
                style={{ width: `${(phase.duration / totalDuration) * 100}%`, transition: 'width 0.38s cubic-bezier(.22,1,.36,1)' }} />
            ))}
          </div>
          <div className="flex justify-between">
            {sleepPhases.map((phase) => (
              <div key={phase.phase} className="flex items-center gap-1.5">
                <div className={cn("w-2.5 h-2.5 rounded-sm", phase.color)} />
                <span className="text-xs" style={{ color: '#9ACBC1' }}>
                  {phase.phase} ({Math.floor(phase.duration / 60)}h {phase.duration % 60}m)
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Score Chart */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4" style={{ color: '#67E8F9' }} />
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ACBC1' }}>Sleep Score — 12 Days</h2>
        </div>
        <div style={cardStyle} className="p-4">
          <div className="flex items-end justify-between gap-1.5 h-28 mb-3">
            {weeklyScores.map((score, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] tabular-nums" style={{ color: '#5F8E85' }}>{score}</span>
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${score}%`,
                    background: score < 65 ? '#F87171' : '#2DD4BF',
                    boxShadow: score < 65 ? '0 0 6px rgba(248,113,113,0.4)' : 'none',
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px]" style={{ color: '#5F8E85' }}>
            <span>12 days ago</span><span>Today</span>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(103,232,249,0.10)' }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: '#2DD4BF' }} />
              <span className="text-xs" style={{ color: '#9ACBC1' }}>65+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: '#F87171' }} />
              <span className="text-xs" style={{ color: '#9ACBC1' }}>Below 65</span>
            </div>
          </div>
        </div>
      </section>

      {/* Week vs Weekend */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4" style={{ color: '#A78BFA' }} />
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ACBC1' }}>Weekday vs Weekend</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div style={cardStyle} className="p-4">
            <p className="text-xs mb-1" style={{ color: '#9ACBC1' }}>Weekday Avg</p>
            <span className="text-xl font-semibold tabular-nums" style={{ fontFamily: "'Fraunces', serif", color: '#FCD34D' }}>{weekdayAvg}</span>
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: '75%', background: '#FCD34D' }} />
            </div>
          </div>
          <div style={cardStyle} className="p-4">
            <p className="text-xs mb-1" style={{ color: '#9ACBC1' }}>Weekend Avg</p>
            <span className="text-xl font-semibold tabular-nums" style={{ fontFamily: "'Fraunces', serif", color: '#4ADE80' }}>{weekendAvg}</span>
            <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: '88%', background: '#4ADE80' }} />
            </div>
          </div>
        </div>
        <p className="text-xs text-center mt-3" style={{ color: '#5F8E85' }}>
          You sleep 53 minutes more on weekends
        </p>
      </section>

      {/* Meridian Insight */}
      <section style={insightStyle}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(45,212,191,0.12)' }}>
            <Moon className="w-4 h-4" style={{ color: '#2DD4BF' }} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#2DD4BF', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '6px' }}>Meridian Insight</div>
            <p className="text-xs leading-relaxed" style={{ color: '#EAFBF7' }}>
              Your HRV of 19ms is low, and REM was cut short at 1h 51m — likely due to elevated TSH impacting sleep architecture.
              Deep sleep hit target at 1h 31m, but overall recovery is compromised. Prioritize your PM stack tonight
              (magnesium, L-Theanine) and aim for lights out by 10pm to support thyroid and nervous system recovery.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
