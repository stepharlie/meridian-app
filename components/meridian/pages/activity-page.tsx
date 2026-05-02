"use client"

import { Activity, Zap, TrendingUp, Battery, Timer, Footprints } from "lucide-react"
import { cn } from "@/lib/utils"

// ── DATA ─────────────────────────────────────────────────────────────────────

const activityMetrics = [
  {
    label: "Steps Today",
    value: "4,920",
    sub: "Goal: 7,000",
    progress: 70,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    icon: Footprints,
    trend: "→",
    trendColor: "text-amber-400",
    trendLabel: "avg this week",
  },
  {
    label: "Intensity Min",
    value: "15",
    sub: "Goal: 75 / week",
    progress: 20,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    icon: Zap,
    trend: "↓",
    trendColor: "text-red-400",
    trendLabel: "vs last week",
  },
  {
    label: "VO2 Max",
    value: "41",
    sub: "Top 30% · stable",
    progress: 60,
    color: "text-primary",
    bgColor: "bg-primary/10",
    icon: TrendingUp,
    trend: "→",
    trendColor: "text-amber-400",
    trendLabel: "6 months",
  },
  {
    label: "Body Battery",
    value: "64",
    sub: "Usable — pace wisely",
    progress: 64,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    icon: Battery,
    trend: "↑",
    trendColor: "text-emerald-400",
    trendLabel: "vs yesterday",
  },
  {
    label: "Fitness Age",
    value: "34.5",
    sub: "Real: 35 · Potential: 31",
    progress: 52,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    icon: Activity,
    trend: "↓",
    trendColor: "text-red-400",
    trendLabel: "from peak",
  },
  {
    label: "Inactivity",
    value: "9h 52m",
    sub: "Daily average",
    progress: 82,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    icon: Timer,
    trend: "↑",
    trendColor: "text-red-400",
    trendLabel: "too high",
  },
]

// Weekly steps — last 12 weeks (approx normalized to 0-100 scale for chart)
const weeklySteps = [
  { week: "W1", steps: 35314, pct: 41 },
  { week: "W2", steps: 23722, pct: 27 },
  { week: "W3", steps: 28162, pct: 32 },
  { week: "W4", steps: 23167, pct: 26 },
  { week: "W5", steps: 22831, pct: 26 },
  { week: "W6", steps: 35314, pct: 41 },
  { week: "W7", steps: 29440, pct: 34 },
  { week: "W8", steps: 30965, pct: 36 },
  { week: "W9", steps: 28019, pct: 32 },
  { week: "W10", steps: 32265, pct: 37 },
  { week: "W11", steps: 31590, pct: 36 },
  { week: "W12", steps: 33388, pct: 39 },
]

// Muscle load — 4-week accumulated
const muscleGroups = [
  { group: "Glutes / Hamstrings", load: 85, status: "High — rest today",    color: "bg-red-400",     statusColor: "text-red-400" },
  { group: "Quadriceps",          load: 62, status: "Moderate",             color: "bg-amber-400",   statusColor: "text-amber-400" },
  { group: "Back (lats / traps)", load: 55, status: "Moderate",             color: "bg-amber-400",   statusColor: "text-amber-400" },
  { group: "Chest / Shoulders",   load: 30, status: "Low — can load",       color: "bg-emerald-400", statusColor: "text-emerald-400" },
  { group: "Biceps / Triceps",    load: 25, status: "Low — can load",       color: "bg-emerald-400", statusColor: "text-emerald-400" },
  { group: "Core / Abs",          load: 10, status: "Not tracked",          color: "bg-primary/30",  statusColor: "text-muted-foreground" },
]

export function ActivityPage() {
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
        {activityMetrics.map((m) => (
          <div key={m.label} style={cardStyle} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", m.bgColor)}>
                <m.icon className={cn("w-4 h-4", m.color)} />
              </div>
            </div>
            <p className="text-xs mb-0.5" style={{ color: '#9ACBC1' }}>{m.label}</p>
            <span className="text-xl font-semibold tabular-nums" style={{ fontFamily: "'Fraunces', serif", color: '#EAFBF7' }}>
              {m.value}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className={cn("text-xs font-bold", m.trendColor)}>{m.trend}</span>
              <span className="text-[11px]" style={{ color: '#5F8E85' }}>{m.trendLabel}</span>
            </div>
            <p className="text-[11px] mt-1" style={{ color: '#5F8E85' }}>{m.sub}</p>
            <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className={cn("h-full rounded-full transition-all duration-700", m.color.replace("text-", "bg-"))}
                style={{ width: `${m.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Steps Chart */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Footprints className="w-4 h-4" style={{ color: '#2DD4BF' }} />
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ACBC1' }}>Weekly Steps — 12 Weeks</h2>
        </div>
        <div style={cardStyle} className="p-4">
          <div className="flex items-end justify-between gap-1 h-24 mb-3">
            {weeklySteps.map((w) => (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${w.pct * 2}px`,
                    background: w.steps < 25000 ? '#F87171' : '#2DD4BF',
                    boxShadow: w.steps < 25000 ? '0 0 5px rgba(248,113,113,0.4)' : 'none',
                  }}
                />
                <span className="text-[9px]" style={{ color: '#5F8E85' }}>{w.week}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 pt-3" style={{ borderTop: '1px solid rgba(103,232,249,0.10)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#2DD4BF' }} />
              <span className="text-xs" style={{ color: '#9ACBC1' }}>25k+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#F87171' }} />
              <span className="text-xs" style={{ color: '#9ACBC1' }}>Below 25k</span>
            </div>
            <span className="text-xs ml-auto" style={{ color: '#5F8E85' }}>Goal: 49k / week</span>
          </div>
        </div>
      </section>

      {/* Muscle Load */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: '#FCD34D' }} />
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ACBC1' }}>Muscle Load — 4 Weeks</h2>
          </div>
          <span className="text-[11px]" style={{ color: '#5F8E85' }}>16 sessions</span>
        </div>
        <div style={cardStyle} className="p-4 space-y-4">
          {muscleGroups.map((mg) => (
            <div key={mg.group}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-sm font-medium" style={{ color: '#EAFBF7' }}>{mg.group}</span>
                <span className={cn("text-xs font-semibold", mg.statusColor)}>{mg.status}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className={cn("h-full rounded-full transition-all duration-700", mg.color)}
                  style={{
                    width: `${mg.load}%`,
                    boxShadow: mg.load > 70 ? '0 0 8px rgba(248,113,113,0.5)' : 'none',
                  }}
                />
              </div>
            </div>
          ))}
          <p className="text-[11px] pt-2" style={{ color: '#5F8E85', borderTop: '1px solid rgba(103,232,249,0.10)' }}>
            Based on exercise type, duration, and HR from Garmin sessions
          </p>
        </div>
      </section>

      {/* Fitness Age */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4" style={{ color: '#2DD4BF' }} />
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9ACBC1' }}>Fitness Age Timeline</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Best (Jun–Jul 25)', val: '32', color: '#4ADE80', sub: '530 min / week' },
            { label: 'Now', val: '34.5', color: '#F87171', sub: '15 min / week', highlight: true },
            { label: 'Potential', val: '31', color: '#2DD4BF', sub: '75+ min / week' },
          ].map(({ label, val, color, sub, highlight }) => (
            <div key={label} style={{
              ...cardStyle,
              ...(highlight ? { border: '1px solid rgba(45,212,191,0.25)', background: 'rgba(45,212,191,0.06)' } : {}),
              padding: '16px',
              textAlign: 'center',
            }}>
              <p className="text-xs mb-1" style={{ color: '#9ACBC1' }}>{label}</p>
              <span className="text-2xl font-bold" style={{ fontFamily: "'Fraunces', serif", color }}>{val}</span>
              <p className="text-[11px] mt-1" style={{ color: '#5F8E85' }}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meridian Insight */}
      <section style={insightStyle}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(45,212,191,0.12)' }}>
            <Activity className="w-4 h-4" style={{ color: '#2DD4BF' }} />
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#2DD4BF', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '6px' }}>Meridian Insight</div>
            <p className="text-[13px] leading-relaxed" style={{ color: "#EAFBF7" }}>
              Your glutes and hamstrings are highly loaded — rest or pivot to chest and arms today.
              At 15 intensity minutes this week vs a goal of 75, adding two 20-minute zone 2 sessions
              (fast walk or bike) would be the single highest-impact change for your HDL, VO2 Max, and Fitness Age.
              In Jun–Jul 2025 you hit 530 min/week — stress scores were at their lowest all year.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
