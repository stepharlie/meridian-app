"use client"

import { AlertTriangle, Activity, Dumbbell, Link2, FlaskConical, Footprints, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNav, NavSection } from "./nav-context"

interface WatchItem {
  icon: React.ReactNode
  title: string
  subtitle: string
  priority: "high" | "medium" | "low"
  navTo?: NavSection
}

interface ConnectionItem {
  left: { icon: React.ReactNode; label: string }
  right: { icon: React.ReactNode; label: string }
  description: string
  navTo?: NavSection
}

const watchItems: WatchItem[] = [
  {
    icon: <AlertTriangle className="w-4 h-4" />,
    title: "Thyroid trend",
    subtitle: "TSH watch",
    priority: "high",
    navTo: "labs",
  },
  {
    icon: <Activity className="w-4 h-4" />,
    title: "HRV load",
    subtitle: "Recovery context",
    priority: "high",
  },
  {
    icon: <Dumbbell className="w-4 h-4" />,
    title: "Muscle preservation",
    subtitle: "Protein + strength",
    priority: "medium",
  },
]

const connections: ConnectionItem[] = [
  {
    left: { icon: <FlaskConical className="w-4 h-4" />, label: "Labs" },
    right: { icon: <Activity className="w-4 h-4" />, label: "Recovery" },
    description: "Thyroid + HRV",
    navTo: "labs",
  },
  {
    left: { icon: <Footprints className="w-4 h-4" />, label: "Activity" },
    right: { icon: <AlertTriangle className="w-4 h-4" />, label: "Stress" },
    description: "Steps reduce load",
    navTo: "activity",
  },
  {
    left: { icon: <Moon className="w-4 h-4" />, label: "Method" },
    right: { icon: <Moon className="w-4 h-4" />, label: "Sleep" },
    description: "PM stack consistency",
    navTo: "methods",
  },
]

const priorityConfig = {
  high: { color: "text-chart-4", bg: "bg-chart-4/10", border: "border-chart-4/20", dot: "bg-chart-4" },
  medium: { color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", dot: "bg-accent" },
  low: { color: "text-muted-foreground", bg: "bg-muted/50", border: "border-border/50", dot: "bg-muted-foreground" },
}

export function SystemWatchlist() {
  const { setActiveSection } = useNav()

  const handleItemClick = (navTo?: NavSection) => {
    if (navTo) {
      setActiveSection(navTo)
    }
  }

  return (
    <section className="px-4 py-6 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Watchlist */}
        <div className="p-6 rounded-2xl bg-card border border-border/50">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-foreground">System Watchlist</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Priority Signals</p>
          </div>

          <div className="space-y-3">
            {watchItems.map((item, index) => {
              const config = priorityConfig[item.priority]
              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(item.navTo)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] cursor-pointer w-full text-left",
                    "bg-secondary/30", config.border,
                    item.navTo && "hover:border-primary/40"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg)}>
                    <span className={config.color}>{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <div className={cn("w-2 h-2 rounded-full", config.dot)} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Connected Intelligence */}
        <div className="p-6 rounded-2xl bg-card border border-border/50">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-foreground">Connected Intelligence</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Why It Matters</p>
          </div>

          <div className="space-y-3">
            {connections.map((connection, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(connection.navTo)}
                className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30 border border-border/30 transition-all hover:border-primary/20 cursor-pointer w-full text-left"
              >
                {/* Left Node */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {connection.left.icon}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{connection.left.label}</span>
                </div>

                {/* Connection */}
                <div className="flex-1 flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-border/50" />
                  <Link2 className="w-4 h-4 text-primary/50" />
                  <div className="h-px flex-1 bg-border/50" />
                </div>

                {/* Right Node */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{connection.right.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-chart-5/10 flex items-center justify-center text-chart-5">
                    {connection.right.icon}
                  </div>
                </div>

                {/* Description - Mobile */}
                <div className="text-xs font-medium text-foreground whitespace-nowrap">{connection.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
