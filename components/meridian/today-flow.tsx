"use client"

import { useState } from "react"
import { Coffee, Dumbbell, Moon, Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FlowStep {
  id: number
  label: string
  title: string
  description: string
  icon: React.ReactNode
  completed?: boolean
  active?: boolean
}

const steps: FlowStep[] = [
  {
    id: 1,
    label: "Morning",
    title: "Protein + hydration",
    description: "Start with protein and hydration so appetite, energy, and muscle preservation are supported early.",
    icon: <Coffee className="w-5 h-5" />,
    completed: true,
  },
  {
    id: 2,
    label: "Movement",
    title: "Walk or light lift",
    description: "Focus on low-intensity movement to support recovery without adding stress to your system.",
    icon: <Dumbbell className="w-5 h-5" />,
    active: true,
  },
  {
    id: 3,
    label: "Evening",
    title: "PM Method before late night",
    description: "Complete your evening supplement stack and wind-down routine to protect tomorrow's recovery.",
    icon: <Moon className="w-5 h-5" />,
  },
]

export function TodayFlow() {
  const [expandedStep, setExpandedStep] = useState<number>(2)

  return (
    <section className="px-4 py-6 lg:px-6">
      <div className="p-6 rounded-2xl bg-card border border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Today&apos;s Flow</h2>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Interactive Action Path</p>
          </div>
        </div>

        {/* Flow Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-border/50 hidden sm:block" />
          
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={cn(
                  "relative p-4 rounded-xl border transition-all cursor-pointer",
                  expandedStep === step.id
                    ? "bg-primary/5 border-primary/20"
                    : step.completed
                    ? "bg-chart-2/5 border-chart-2/20"
                    : "bg-secondary/30 border-border/30 hover:border-border"
                )}
                onClick={() => setExpandedStep(step.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number / Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center relative z-10",
                    step.completed 
                      ? "bg-chart-2/20 text-chart-2" 
                      : step.active || expandedStep === step.id
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {step.completed ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-bold">0{step.id}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-[11px] font-bold uppercase tracking-wider",
                        step.completed ? "text-chart-2" : step.active ? "text-primary" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                    
                    {/* Expanded Description */}
                    <div className={cn(
                      "overflow-hidden transition-all duration-300",
                      expandedStep === step.id ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    )}>
                      <p className="text-[13px] text-muted-foreground leading-relaxed pt-1 text-pretty">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Expand Indicator */}
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    expandedStep === step.id ? "bg-primary/10 text-primary rotate-90" : "text-muted-foreground"
                  )}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Note */}
        <div className="mt-4 p-3 rounded-xl bg-accent/5 border border-accent/10">
          <p className="text-xs text-accent leading-relaxed">
            <span className="font-semibold">Morning priority:</span> Start with protein and hydration so appetite, energy, and muscle preservation are supported early.
          </p>
        </div>
      </div>
    </section>
  )
}
