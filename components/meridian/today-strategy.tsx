"use client"

import { Moon, Heart, Footprints, Zap, FlaskConical, Sun, CheckCircle2, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  icon: React.ReactNode
  status: "fair" | "low" | "good" | "charged" | "watch" | "pending" | "trend"
  label: string
  value: string
  sublabel: string
  detail?: string
}

const statusConfig = {
  fair: { color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  low: { color: "text-chart-4", bg: "bg-chart-4/10", border: "border-chart-4/20" },
  good: { color: "text-chart-2", bg: "bg-chart-2/10", border: "border-chart-2/20" },
  charged: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  watch: { color: "text-chart-3", bg: "bg-chart-3/10", border: "border-chart-3/20" },
  pending: { color: "text-chart-5", bg: "bg-chart-5/10", border: "border-chart-5/20" },
  trend: { color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border/50" },
}

function MetricCard({ icon, status, label, value, sublabel, detail }: MetricCardProps) {
  const config = statusConfig[status]
  
  return (
    <div className={cn(
      "group p-4 rounded-xl border transition-all duration-200 cursor-pointer min-h-[100px]",
      "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
      "bg-card", config.border,
      "hover:border-opacity-50"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200",
          "group-hover:scale-110",
          config.bg
        )}>
          <span className={config.color}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-[11px] font-bold uppercase tracking-wider", config.color)}>
              {status}
            </span>
            <span className="text-xs font-600 text-muted-foreground">{label}</span>
          </div>
          <div className="text-lg font-semibold text-foreground truncate tabular-nums">{value}</div>
          <div className="text-[13px] text-muted-foreground leading-relaxed mt-0.5">{sublabel}</div>
          {detail && (
            <div className={cn("text-[11px] mt-1 font-medium", config.color)}>{detail}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function TodayStrategy() {
  return (
    <section className="px-4 py-6 lg:px-6">
      {/* Strategy Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Today&apos;s Strategy</h2>
        <p className="text-[15px] text-muted-foreground text-pretty leading-relaxed">
          Protect recovery, preserve muscle. Keep the day simple: walk, hit protein, complete the PM stack, and avoid turning a medium-readiness day into unnecessary stress.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={<Moon className="w-5 h-5" />}
          status="fair"
          label="Sleep"
          value="7h 9m"
          sublabel="Recovery signal: score 75 — deep sleep still needs improvement"
        />
        <MetricCard
          icon={<Heart className="w-5 h-5" />}
          status="low"
          label="HRV"
          value="19 ms"
          sublabel="Suppressed: 21% below your 24ms baseline — recovery is limited today"
        />
        <MetricCard
          icon={<Footprints className="w-5 h-5" />}
          status="good"
          label="Steps"
          value="4,920"
          sublabel="Recovery target: 70% reached — a 20 min walk completes the day"
          detail="70% complete"
        />
        <MetricCard
          icon={<Zap className="w-5 h-5" />}
          status="charged"
          label="Body Battery"
          value="64"
          sublabel="Usable — but declining faster due to systemic load"
        />
        <MetricCard
          icon={<FlaskConical className="w-5 h-5" />}
          status="watch"
          label="Labs"
          value="TSH"
          sublabel="3.03 · monitor thyroid trend"
        />
        <MetricCard
          icon={<Sun className="w-5 h-5" />}
          status="pending"
          label="Cycle"
          value="Day 18"
          sublabel="Luteal · temp stable"
          detail="Recovery context"
        />
        <MetricCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          status="pending"
          label="Method"
          value="50%"
          sublabel="Finish PM stack tonight"
          detail="2 pending"
        />
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          status="trend"
          label="Body"
          value="143.2 lb"
          sublabel="Preserve muscle while leaning out"
        />
      </div>
    </section>
  )
}
