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

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export function ActivityPage() {
  return (
    <div className="space-y-6">

      {/* Metric Cards — 2-col grid */}
      <div className="grid grid-cols-2 gap-3">
        {activityMetrics.map((m) => (
          <div key={m.label} className="p-4 rounded-xl bg-card border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", m.bgColor)}>
                <m.icon className={cn("w-4 h-4", m.color)} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-0.5">{m.label}</p>
            <span
              className="text-xl font-semibold text-foreground tabular-nums"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {m.value}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className={cn("text-xs font-bold", m.trendColor)}>{m.trend}</span>
              <span className="text-[10px] text-muted-foreground">{m.trendLabel}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{m.sub}</p>
            <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
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
        <div className="flex items-center gap-2 mb-4">
          <Footprints className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Weekly Steps — 12 Weeks</h2>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <div className="flex items-end justify-between gap-1 h-28 mb-3">
            {weeklySteps.map((w) => (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-500",
                    w.steps < 25000 ? "bg-chart-4" : "bg-primary"
                  )}
                  style={{ height: `${w.pct * 2}px` }}
                />
                <span className="text-[9px] text-muted-foreground">{w.week}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-xs text-muted-foreground">25k+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-chart-4" />
              <span className="text-xs text-muted-foreground">Below 25k</span>
            </div>
            <span className="text-xs text-muted-foreground ml-auto">Goal: 49k / week</span>
          </div>
        </div>
      </section>

      {/* Muscle Load */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Muscle Load — 4 Weeks</h2>
          </div>
          <span className="text-[10px] text-muted-foreground">16 strength sessions</span>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50 space-y-4">
          {muscleGroups.map((mg) => (
            <div key={mg.group}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-sm font-medium text-foreground">{mg.group}</span>
                <span className={cn("text-xs font-semibold", mg.statusColor)}>{mg.status}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", mg.color)}
                  style={{
                    width: `${mg.load}%`,
                    boxShadow: mg.load > 70 ? `0 0 8px rgba(248,113,113,0.5)` : "none",
                  }}
                />
              </div>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground pt-2 border-t border-border/50">
            Based on exercise type, duration, and HR from Garmin sessions
          </p>
        </div>
      </section>

      {/* Fitness Age Context */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Fitness Age Timeline</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">Best (Jun–Jul 25)</p>
            <span
              className="text-2xl font-bold text-emerald-400"
              style={{ fontFamily: "'Fraunces', serif" }}
            >32</span>
            <p className="text-[10px] text-muted-foreground mt-1">530 min / week</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-primary/30 text-center" style={{ background: "rgba(45,212,191,0.06)" }}>
            <p className="text-xs text-muted-foreground mb-1">Now</p>
            <span
              className="text-2xl font-bold text-red-400"
              style={{ fontFamily: "'Fraunces', serif" }}
            >34.5</span>
            <p className="text-[10px] text-muted-foreground mt-1">15 min / week</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
            <p className="text-xs text-muted-foreground mb-1">Potential</p>
            <span
              className="text-2xl font-bold text-primary"
              style={{ fontFamily: "'Fraunces', serif" }}
            >31</span>
            <p className="text-[10px] text-muted-foreground mt-1">75+ min / week</p>
          </div>
        </div>
      </section>

      {/* Meridian Insight */}
      <section className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Meridian Insight</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
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
