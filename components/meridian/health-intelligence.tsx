"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Sparkles, 
  ArrowRight, 
  FlaskConical, 
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Heart,
  Zap,
  Activity,
  Upload,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNav } from "./nav-context"

// Types matching labs-page
type BiomarkerStatus = "optimal" | "watch" | "attention" | "out-of-range"

interface LabEntry {
  biomarkerId: string
  value: number
  date: string
  notes?: string
  source: "demo" | "user" | "ai"
}

// Biomarker definitions (subset for intelligence generation)
const biomarkerDefinitions: Record<string, { 
  name: string
  unit: string
  clinicalRange: { min: number; max: number }
  optimalRange: { min: number; max: number }
  nextBestStep: string
}> = {
  glucose: {
    name: "Glucose",
    unit: "mg/dL",
    clinicalRange: { min: 70, max: 100 },
    optimalRange: { min: 75, max: 90 },
    nextBestStep: "Try having a short 10-minute walk after your largest meal today.",
  },
  a1c: {
    name: "Hemoglobin A1c",
    unit: "%",
    clinicalRange: { min: 4.0, max: 5.7 },
    optimalRange: { min: 4.5, max: 5.3 },
    nextBestStep: "Your current lifestyle is supporting excellent long-term glucose control.",
  },
  hdl: {
    name: "HDL Cholesterol",
    unit: "mg/dL",
    clinicalRange: { min: 40, max: 100 },
    optimalRange: { min: 55, max: 80 },
    nextBestStep: "Consider adding 2-3 servings of fatty fish or a quality omega-3 supplement this week.",
  },
  triglycerides: {
    name: "Triglycerides",
    unit: "mg/dL",
    clinicalRange: { min: 0, max: 150 },
    optimalRange: { min: 0, max: 100 },
    nextBestStep: "Try swapping one refined carb serving for a fiber-rich alternative today.",
  },
  tsh: {
    name: "TSH",
    unit: "mIU/L",
    clinicalRange: { min: 0.4, max: 4.0 },
    optimalRange: { min: 1.0, max: 2.5 },
    nextBestStep: "Continue prioritizing quality sleep and stress management.",
  },
  "vitamin-d": {
    name: "Vitamin D",
    unit: "ng/mL",
    clinicalRange: { min: 20, max: 100 },
    optimalRange: { min: 40, max: 60 },
    nextBestStep: "Consider a Vitamin D3 supplement with K2 (2000-4000 IU daily) with a fat-containing meal.",
  },
  b12: {
    name: "Vitamin B12",
    unit: "pg/mL",
    clinicalRange: { min: 200, max: 900 },
    optimalRange: { min: 500, max: 800 },
    nextBestStep: "Add more B12-rich foods like eggs, fish, or fortified foods this week.",
  },
  alt: {
    name: "ALT",
    unit: "U/L",
    clinicalRange: { min: 7, max: 56 },
    optimalRange: { min: 10, max: 30 },
    nextBestStep: "Continue supporting your liver with adequate hydration and limiting processed foods.",
  },
  ast: {
    name: "AST",
    unit: "U/L",
    clinicalRange: { min: 10, max: 40 },
    optimalRange: { min: 10, max: 30 },
    nextBestStep: "Keep balancing exercise intensity with recovery.",
  },
}

// Demo biomarker data (matching labs-page)
const demoBiomarkers: LabEntry[] = [
  { biomarkerId: "glucose", value: 92, date: "2026-03-15", source: "demo" },
  { biomarkerId: "a1c", value: 5.4, date: "2026-03-15", source: "demo" },
  { biomarkerId: "hdl", value: 48, date: "2026-03-15", source: "demo" },
  { biomarkerId: "triglycerides", value: 142, date: "2026-03-15", source: "demo" },
  { biomarkerId: "tsh", value: 2.1, date: "2026-03-15", source: "demo" },
  { biomarkerId: "vitamin-d", value: 32, date: "2026-03-15", source: "demo" },
  { biomarkerId: "b12", value: 380, date: "2026-03-15", source: "demo" },
  { biomarkerId: "alt", value: 24, date: "2026-03-15", source: "demo" },
  { biomarkerId: "ast", value: 22, date: "2026-03-15", source: "demo" },
]

const LABS_STORAGE_KEY = "meridian-labs-data"

// Helper functions
function getBiomarkerStatus(value: number, clinicalRange: { min: number; max: number }, optimalRange: { min: number; max: number }): BiomarkerStatus {
  if (value < clinicalRange.min || value > clinicalRange.max) {
    return "out-of-range"
  }
  if (value >= optimalRange.min && value <= optimalRange.max) {
    return "optimal"
  }
  const optimalMid = (optimalRange.min + optimalRange.max) / 2
  const optimalSpan = optimalRange.max - optimalRange.min
  const distance = Math.abs(value - optimalMid)
  const normalizedDistance = distance / (optimalSpan / 2)
  if (normalizedDistance <= 1.5) {
    return "watch"
  }
  return "attention"
}

// Sorting priority
const statusPriority: Record<BiomarkerStatus, number> = {
  "out-of-range": 1,
  attention: 2,
  watch: 3,
  optimal: 4,
}

interface BiomarkerWithStatus {
  id: string
  name: string
  value: number
  unit: string
  status: BiomarkerStatus
  nextBestStep: string
}

export function HealthIntelligence() {
  const { navigateToLabs } = useNav()
  const [mounted, setMounted] = useState(false)
  const [userEntries, setUserEntries] = useState<LabEntry[]>([])

  // Load user data from localStorage
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LABS_STORAGE_KEY)
      if (saved) {
        try {
          setUserEntries(JSON.parse(saved))
        } catch {
          // Invalid data
        }
      }
    }
  }, [])

  // Combine demo and user entries
  const allEntries = useMemo(() => {
    return [...demoBiomarkers, ...userEntries]
  }, [userEntries])

  // Build biomarkers with status
  const biomarkersWithStatus: BiomarkerWithStatus[] = useMemo(() => {
    const biomarkerMap = new Map<string, LabEntry>()
    
    // Process entries (newer entries overwrite older ones for same biomarker)
    allEntries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(entry => {
        biomarkerMap.set(entry.biomarkerId, entry)
      })
    
    const results: BiomarkerWithStatus[] = []
    biomarkerMap.forEach((entry, biomarkerId) => {
      const def = biomarkerDefinitions[biomarkerId]
      if (!def) return
      
      const status = getBiomarkerStatus(entry.value, def.clinicalRange, def.optimalRange)
      results.push({
        id: biomarkerId,
        name: def.name,
        value: entry.value,
        unit: def.unit,
        status,
        nextBestStep: def.nextBestStep,
      })
    })
    
    // Sort by priority
    return results.sort((a, b) => statusPriority[a.status] - statusPriority[b.status])
  }, [allEntries])

  // Check if we have any lab data
  const hasLabData = biomarkersWithStatus.length > 0

  // Get priority biomarkers (non-optimal ones)
  const priorityBiomarkers = biomarkersWithStatus.filter(b => b.status !== "optimal")
  const optimalBiomarkers = biomarkersWithStatus.filter(b => b.status === "optimal")

  // Generate primary insight sentence
  const primaryInsight = useMemo(() => {
    if (!hasLabData) return null
    
    if (priorityBiomarkers.length === 0) {
      return "Your biological markers are well-balanced. This is a great foundation for sustained energy, recovery, and long-term health."
    }
    
    if (priorityBiomarkers.length === 1) {
      const b = priorityBiomarkers[0]
      if (b.status === "out-of-range") {
        return `Your ${b.name} needs attention and may be affecting your overall wellness. This is a manageable area to address.`
      }
      return `Your ${b.name} is worth monitoring, as it may be influencing your energy and recovery capacity.`
    }
    
    // Multiple priority markers
    const topTwo = priorityBiomarkers.slice(0, 2)
    const names = topTwo.map(b => b.name).join(" and ")
    const hasOutOfRange = topTwo.some(b => b.status === "out-of-range")
    
    if (hasOutOfRange) {
      return `Your recovery potential may be limited right now, primarily influenced by ${names} levels.`
    }
    
    return `A few markers are worth watching — ${names} — as they may be influencing your energy and cardiometabolic resilience.`
  }, [hasLabData, priorityBiomarkers])

  // Generate supporting insights (max 3)
  const supportingInsights = useMemo(() => {
    const insights: { text: string; icon: typeof Heart; color: string; biomarkerId?: string }[] = []
    
    if (!hasLabData) return insights
    
    // Add insight for each priority biomarker (max 2)
    priorityBiomarkers.slice(0, 2).forEach(b => {
      let icon = Activity
      let color = "text-amber-400"
      
      if (b.status === "out-of-range") {
        icon = AlertCircle
        color = "text-rose-400"
      } else if (b.status === "attention") {
        icon = AlertCircle
        color = "text-orange-400"
      }
      
      insights.push({
        text: `${b.name}: Within clinical range, but below optimal for peak energy and recovery.`,
        icon,
        color,
        biomarkerId: b.id,
      })
    })
    
    // Add positive insight if we have optimal markers
    if (optimalBiomarkers.length > 0) {
      const optimalNames = optimalBiomarkers.slice(0, 2).map(b => b.name).join(" and ")
      insights.push({
        text: `${optimalNames} ${optimalBiomarkers.length > 1 ? "are" : "is"} in optimal range, supporting your metabolic foundation.`,
        icon: CheckCircle,
        color: "text-emerald-400",
      })
    }
    
    return insights.slice(0, 3)
  }, [hasLabData, priorityBiomarkers, optimalBiomarkers])

  // Get next best step from top priority biomarker
  const nextBestStep = priorityBiomarkers.length > 0 
    ? priorityBiomarkers[0].nextBestStep 
    : optimalBiomarkers.length > 0 
      ? "Continue your current health practices to maintain this excellent balance."
      : null

  const handleInsightClick = (biomarkerId?: string) => {
    navigateToLabs(biomarkerId)
  }

  // SSR-safe: show loading state until mounted
  if (!mounted) {
    return (
      <section className="px-4 py-6 lg:px-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-primary/20 animate-pulse">
          <div className="h-8 bg-secondary/50 rounded w-1/3 mb-4" />
          <div className="h-16 bg-secondary/50 rounded mb-4" />
          <div className="h-12 bg-secondary/50 rounded w-2/3" />
        </div>
      </section>
    )
  }

  // Empty state - no lab data
  if (!hasLabData) {
    return (
      <section className="px-4 py-6 lg:px-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Health Intelligence</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 text-pretty">
            No lab data available yet
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-2xl text-pretty">
            Upload your latest bloodwork to unlock personalized insights about your health. Meridian will analyze your biomarkers and provide clear, actionable guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigateToLabs()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium min-h-[44px] hover:bg-primary/90 transition-colors active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Labs
            </button>
            <button
              onClick={() => navigateToLabs()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground text-sm font-medium min-h-[44px] hover:bg-secondary transition-colors active:scale-95"
            >
              <Upload className="w-4 h-4" />
              Upload PDF
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-6 lg:px-6">
      {/* Primary Intelligence Block */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-primary/20">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Health Intelligence</span>
          <span className="text-[10px] text-muted-foreground ml-auto">Based on your lab profile</span>
        </div>

        {/* Primary Insight */}
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 leading-relaxed text-pretty">
          {primaryInsight}
        </h2>

        {/* Supporting Insights */}
        {supportingInsights.length > 0 && (
          <div className="space-y-2 mb-6">
            {supportingInsights.map((insight, idx) => (
              <button
                key={idx}
                onClick={() => handleInsightClick(insight.biomarkerId)}
                className="flex items-start gap-3 w-full text-left p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/30 transition-all group"
              >
                <insight.icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", insight.color)} />
                <span className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                  {insight.text}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Next Best Step */}
        {nextBestStep && (
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent" />
              </div>
              <div>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">Next Best Step</span>
                <p className="text-sm text-foreground mt-1 leading-relaxed">{nextBestStep}</p>
              </div>
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <button
          onClick={() => navigateToLabs()}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium min-h-[44px] hover:bg-primary/90 transition-colors active:scale-95"
        >
          <FlaskConical className="w-4 h-4" />
          View full lab analysis
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Microcopy */}
        <p className="text-xs text-muted-foreground/70 mt-4">
          Sourced from your latest bloodwork
        </p>
      </div>
    </section>
  )
}
