"use client"

import { useState } from "react"
import { 
  TrendingUp, 
  TrendingDown,
  Minus,
  Calendar,
  ChevronRight,
  Lightbulb,
  Target,
  Zap,
  Heart,
  Moon,
  Activity,
  Flame
} from "lucide-react"
import { cn } from "@/lib/utils"

const timeRanges = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
]

const keyInsights = [
  {
    id: 1,
    title: "Sleep consistency improving",
    description: "Your bedtime variance decreased by 23 minutes this week",
    trend: "up",
    impact: "high",
    icon: Moon,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: 2,
    title: "HRV trending upward",
    description: "Average HRV increased 8ms over the past 2 weeks",
    trend: "up",
    impact: "high",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
  },
  {
    id: 3,
    title: "Activity goal streak",
    description: "You've hit your step goal 5 days in a row",
    trend: "up",
    impact: "medium",
    icon: Activity,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: 4,
    title: "Recovery pattern detected",
    description: "Recovery scores are higher after rest days",
    trend: "neutral",
    impact: "medium",
    icon: Zap,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
]

const weeklyStats = [
  { label: "Avg Sleep", value: "7.2h", change: "+0.3h", trend: "up" },
  { label: "Avg HRV", value: "42ms", change: "+5ms", trend: "up" },
  { label: "Avg Steps", value: "8,420", change: "-340", trend: "down" },
  { label: "Recovery", value: "72%", change: "+8%", trend: "up" },
]

const correlations = [
  {
    id: 1,
    title: "Sleep + Next Day HRV",
    description: "7+ hours sleep correlates with 15% higher HRV",
    strength: 85,
  },
  {
    id: 2,
    title: "Evening Screen Time + Sleep Quality",
    description: "Less screen time after 9pm improves deep sleep",
    strength: 72,
  },
  {
    id: 3,
    title: "Morning Exercise + Energy",
    description: "AM workouts linked to better afternoon focus",
    strength: 68,
  },
]

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-400" />
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-rose-400" />
  return <Minus className="w-4 h-4 text-muted-foreground" />
}

export function InsightsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Showing insights for</span>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-secondary/50">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all min-h-[32px]",
                timeRange === range.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {weeklyStats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-card border border-border/50"
          >
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-xl font-semibold text-foreground tabular-nums">{stat.value}</span>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                stat.trend === "up" ? "text-emerald-400" : stat.trend === "down" ? "text-rose-400" : "text-muted-foreground"
              )}>
                <TrendIcon trend={stat.trend} />
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Key Insights</h2>
        </div>
        
        <div className="space-y-3">
          {keyInsights.map((insight) => (
            <button
              key={insight.id}
              className={cn(
                "w-full group flex items-start gap-3 p-4 rounded-xl text-left",
                "bg-card border border-border/50",
                "hover:border-primary/30 hover:shadow-lg",
                "active:scale-[0.99]",
                "transition-all duration-200"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                "group-hover:scale-110 transition-transform duration-200",
                insight.bgColor
              )}>
                <insight.icon className={cn("w-5 h-5", insight.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground">{insight.title}</h3>
                  <TrendIcon trend={insight.trend} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </section>

      {/* Correlations */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Patterns Detected</h2>
        </div>
        
        <div className="space-y-3">
          {correlations.map((corr) => (
            <div
              key={corr.id}
              className="p-4 rounded-xl bg-card border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">{corr.title}</h3>
                <span className="text-xs font-medium text-primary">{corr.strength}% correlation</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{corr.description}</p>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${corr.strength}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Summary */}
      <section className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Weekly Summary</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your recovery metrics are trending positively. Focus on maintaining your improved sleep consistency 
              and consider adding one more active recovery day to optimize your HRV further.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
