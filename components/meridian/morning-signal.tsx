"use client"

import { useState, useEffect } from "react"
import { Activity, FlaskConical, Zap, Sparkles, Sun, Moon, Sunset, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNav, NavSection } from "./nav-context"

function getTimeBasedGreeting(): { greeting: string; icon: typeof Sun; label: string } {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return { greeting: "Good morning", icon: Sun, label: "Morning Signal" }
  } else if (hour >= 12 && hour < 18) {
    return { greeting: "Good afternoon", icon: Sunset, label: "Afternoon Signal" }
  } else if (hour >= 18 && hour < 22) {
    return { greeting: "Good evening", icon: Moon, label: "Evening Signal" }
  } else {
    return { greeting: "Good night", icon: Moon, label: "Night Signal" }
  }
}

const tabs: { id: string; label: string; icon: typeof Activity; navTo?: NavSection }[] = [
  { id: "recovery", label: "Recovery", icon: Activity },
  { id: "labs", label: "Labs", icon: FlaskConical, navTo: "labs" },
  { id: "activity", label: "Activity", icon: Zap, navTo: "activity" },
  { id: "method", label: "Method", icon: Sparkles, navTo: "methods" },
]

const tabContent: Record<string, { signal: string; lever: string; watch: string }> = {
  recovery: {
    signal: "TSH is elevated at 3.03 (ideal <2.5) and HRV is only 19ms — your nervous system is under load. Sleep score hit 75, and you're on cycle day 18 in luteal phase when cortisol sensitivity is higher.",
    lever: "Today is a recovery day. Prioritize protein at every meal, light movement only, and complete your PM stack to support thyroid and sleep.",
    watch: "Avoid high-intensity training until HRV recovers above 30ms. Evening magnesium and selenium support both thyroid and sleep quality.",
  },
  labs: {
    signal: "TSH at 3.03 is elevated — ideal is under 2.5. Combined with low HRV (19ms), this suggests your thyroid and nervous system are both signaling stress.",
    lever: "Focus on selenium-rich foods (brazil nuts, sardines) and ensure adequate iodine. Avoid over-exercising which can further suppress thyroid function.",
    watch: "Retest TSH in 6 weeks. If it stays above 2.5, consider a full thyroid panel including Free T3 and T4.",
  },
  activity: {
    signal: "With HRV at 19ms and TSH elevated, your body is asking for rest. Luteal phase (day 18) means progesterone is high and recovery capacity is reduced.",
    lever: "Cap activity at light walking today — aim for 5,000 steps max. Save higher intensity for follicular phase when HRV rebounds.",
    watch: "Keep heart rate under 110bpm during any movement. Higher intensity today will deepen the recovery debt.",
  },
  method: {
    signal: "Your PM stack is critical tonight. Low HRV and elevated TSH both respond to quality sleep, and your 75 sleep score has room to improve.",
    lever: "Complete magnesium glycinate, glycine, and selenium by 9pm. These directly support both thyroid conversion and sleep architecture.",
    watch: "Caffeine cutoff by 12pm is non-negotiable with these numbers. Evening blue light exposure will further suppress melatonin.",
  },
}

// Default greeting used for SSR to avoid hydration mismatch
const defaultGreeting = { greeting: "Good morning", icon: Sun, label: "Morning Signal" }

export function MorningSignal({ userName = "Stephanie" }: { userName?: string }) {
  const [activeTab, setActiveTab] = useState("recovery")
  const [timeGreeting, setTimeGreeting] = useState(defaultGreeting)
  const [mounted, setMounted] = useState(false)
  const { setActiveSection, navigateToLabs } = useNav()
  const content = tabContent[activeTab]

  const handleTabClick = (tabId: string, navTo?: NavSection) => {
    if (navTo) {
      // Navigate to the full page for this section
      if (navTo === "labs") {
        navigateToLabs()
      } else {
        setActiveSection(navTo)
      }
    } else {
      // Just switch the tab content
      setActiveTab(tabId)
    }
  }

  const handleLabsClick = (biomarkerId?: string) => {
    navigateToLabs(biomarkerId)
  }

  // Update greeting when component mounts (client-side only)
  useEffect(() => {
    setMounted(true)
    setTimeGreeting(getTimeBasedGreeting())
    
    // Update every minute to handle time changes
    const interval = setInterval(() => {
      setTimeGreeting(getTimeBasedGreeting())
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const GreetingIcon = timeGreeting.icon

  return (
    <section className="px-4 py-6 lg:px-6">
      {/* Header Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="text-xs font-medium text-primary uppercase tracking-wider">{mounted ? timeGreeting.label : defaultGreeting.label} Live Health Overview</span>
      </div>

      {/* Greeting */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-3 text-balance flex items-center gap-3">
        <GreetingIcon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
        {mounted ? timeGreeting.greeting : defaultGreeting.greeting}, {userName}
      </h1>
      <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl text-pretty">
        Meridian reads your recovery, labs, activity, cycle, body composition, and method adherence as one connected system — so today&apos;s next step is clear.
      </p>

      {/* Current Mode */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/50">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Current Mode</span>
          <span className="text-sm font-semibold text-foreground">Recovery-first</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 text-pretty">
        TSH is elevated this season and HRV is low — your nervous system is under load. Today is a recovery day. Prioritize protein, light movement, and your PM stack.
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.navTo)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[44px]",
              "active:scale-95",
              activeTab === tab.id && !tab.navTo
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            style={{
              boxShadow: activeTab === tab.id && !tab.navTo ? '0 0 20px oklch(0.75 0.12 195 / 0.3)' : undefined
            }}
          >
            <tab.icon className={cn(
              "w-4 h-4 transition-transform duration-200",
              activeTab === tab.id && !tab.navTo && "scale-110"
            )} />
            {tab.label}
            {tab.navTo && <ArrowRight className="w-3 h-3 ml-1 opacity-50" />}
          </button>
        ))}
      </div>

      {/* Signal Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="group p-4 rounded-xl bg-card border border-border/50 hover:border-primary/40 transition-all duration-200 hover:shadow-lg cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Primary Signal</h3>
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed text-pretty mb-2">
            {activeTab === "recovery" ? "TSH 3.03 + HRV 19ms = recovery day" : 
             activeTab === "labs" ? "TSH elevated, thyroid under stress" :
             activeTab === "activity" ? "Luteal phase + low HRV = rest" : "PM stack critical tonight"}
          </p>
          <p {className="text-[13px] text-muted-foreground leading-relaxed">{content.signal}</p>
        </div>

        <div className="group p-4 rounded-xl bg-card border border-border/50 hover:border-accent/40 transition-all duration-200 hover:shadow-lg cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <h3 className="text-xs font-semibold text-accent uppercase tracking-wider">Best Lever</h3>
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed text-pretty mb-2">
            {activeTab === "recovery" ? "Protein + PM stack + light walk" :
             activeTab === "labs" ? "Selenium + iodine support" :
             activeTab === "activity" ? "5K steps max, HR under 110" : "Mag, glycine, selenium by 9pm"}
          </p>
          <p {className="text-[13px] text-muted-foreground leading-relaxed">{content.lever}</p>
        </div>

        <div className="group p-4 rounded-xl bg-card border border-border/50 hover:border-chart-5/40 transition-all duration-200 hover:shadow-lg cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-chart-5" />
            <h3 className="text-xs font-semibold text-chart-5 uppercase tracking-wider">Watch Today</h3>
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed text-pretty mb-2">
            {activeTab === "recovery" ? "No HIIT until HRV > 30ms" :
             activeTab === "labs" ? "Retest TSH in 6 weeks" :
             activeTab === "activity" ? "Intensity deepens recovery debt" : "Caffeine cutoff 12pm"}
          </p>
          <p {className="text-[13px] text-muted-foreground leading-relaxed">{content.watch}</p>
        </div>
      </div>

      {/* Labs Quick Access CTA */}
      <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Your{" "}
                <button onClick={() => handleLabsClick("vitamin-d")} className="text-primary hover:underline font-semibold">
                  Vitamin D
                </button>
                {" "}is optimal and{" "}
                <button onClick={() => handleLabsClick("hdl")} className="text-accent hover:underline font-semibold">
                  HDL
                </button>
                {" "}is trending up.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated 2 weeks ago from your blood panel.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleLabsClick()}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium min-h-[44px] hover:bg-primary/90 transition-colors active:scale-95"
          >
            View full lab analysis
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
