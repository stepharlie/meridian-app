"use client"

import { useState } from "react"
import { 
  Plus,
  Check,
  Clock,
  Flame,
  Droplets,
  Pill,
  Moon,
  Sun,
  Dumbbell,
  Coffee,
  ChevronRight,
  Calendar,
  TrendingUp,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"

type Method = {
  id: number
  name: string
  icon: typeof Pill
  color: string
  bgColor: string
  frequency: string
  streak: number
  completedToday: boolean
  time?: string
}

const activeMethods: Method[] = [
  {
    id: 1,
    name: "Morning Supplements",
    icon: Pill,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    frequency: "Daily",
    streak: 14,
    completedToday: true,
    time: "7:30 AM",
  },
  {
    id: 2,
    name: "Cold Exposure",
    icon: Droplets,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    frequency: "3x weekly",
    streak: 8,
    completedToday: false,
  },
  {
    id: 3,
    name: "Zone 2 Cardio",
    icon: Dumbbell,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    frequency: "4x weekly",
    streak: 6,
    completedToday: false,
  },
  {
    id: 4,
    name: "Evening Wind-Down",
    icon: Moon,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    frequency: "Daily",
    streak: 21,
    completedToday: false,
    time: "9:00 PM",
  },
  {
    id: 5,
    name: "Morning Sunlight",
    icon: Sun,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    frequency: "Daily",
    streak: 12,
    completedToday: true,
    time: "7:00 AM",
  },
]

const suggestedMethods = [
  {
    id: 1,
    name: "Breath Work",
    description: "5-minute daily practice for stress reduction",
    icon: Flame,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 2,
    name: "Caffeine Cutoff",
    description: "No caffeine after 2pm for better sleep",
    icon: Coffee,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
]

const weeklyProgress = {
  completed: 18,
  total: 24,
  percentage: 75,
}

export function MethodsPage() {
  const [methods, setMethods] = useState(activeMethods)

  const toggleMethod = (id: number) => {
    setMethods(prev => prev.map(m => 
      m.id === id ? { ...m, completedToday: !m.completedToday } : m
    ))
  }

  const completedCount = methods.filter(m => m.completedToday).length
  const todayProgress = Math.round((completedCount / methods.length) * 100)

  return (
    <div className="space-y-6">
      {/* Today's Progress */}
      <div className="p-4 rounded-xl bg-card border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Today&apos;s Progress</span>
          </div>
          <span className="text-sm font-semibold text-primary">{completedCount}/{methods.length}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${todayProgress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {todayProgress === 100 
            ? "All methods completed! Great work today." 
            : `${methods.length - completedCount} methods remaining for today`}
        </p>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
          <p className="text-lg font-semibold text-foreground tabular-nums">{weeklyProgress.percentage}%</p>
          <p className="text-[10px] text-muted-foreground uppercase">Weekly</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
          <p className="text-lg font-semibold text-foreground tabular-nums">21</p>
          <p className="text-[10px] text-muted-foreground uppercase">Best Streak</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border/50 text-center">
          <p className="text-lg font-semibold text-foreground tabular-nums">5</p>
          <p className="text-[10px] text-muted-foreground uppercase">Active</p>
        </div>
      </div>

      {/* Active Methods */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Active Methods</h2>
          </div>
        </div>
        
        <div className="space-y-2">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => toggleMethod(method.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200",
                "bg-card border",
                method.completedToday 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border/50 hover:border-primary/20",
                "active:scale-[0.99]"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                method.completedToday ? "bg-primary/20" : method.bgColor
              )}>
                {method.completedToday ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <method.icon className={cn("w-5 h-5", method.color)} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={cn(
                    "text-sm font-semibold transition-colors",
                    method.completedToday ? "text-primary" : "text-foreground"
                  )}>
                    {method.name}
                  </h3>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground">{method.frequency}</span>
                  {method.time && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {method.time}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50">
                  <Flame className="w-3 h-3 text-accent" />
                  <span className="text-xs font-medium text-foreground tabular-nums">{method.streak}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Suggested Methods */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Suggested for You</h2>
        </div>
        
        <div className="space-y-2">
          {suggestedMethods.map((method) => (
            <button
              key={method.id}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl text-left",
                "bg-card border border-dashed border-border/50",
                "hover:border-primary/30 hover:bg-card/80",
                "active:scale-[0.99]",
                "transition-all duration-200"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                method.bgColor
              )}>
                <method.icon className={cn("w-5 h-5", method.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{method.name}</h3>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </div>
              <Plus className="w-5 h-5 text-primary" />
            </button>
          ))}
        </div>
      </section>

      {/* Add Method Button */}
      <button className={cn(
        "w-full flex items-center justify-center gap-2 p-4 rounded-xl",
        "bg-primary text-primary-foreground font-semibold",
        "hover:bg-primary/90 active:scale-[0.98]",
        "transition-all duration-200 min-h-[52px]"
      )}>
        <Plus className="w-5 h-5" />
        Add New Method
      </button>
    </div>
  )
}
