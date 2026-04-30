"use client"

import { useState, useMemo } from "react"
import {
  FlaskConical,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  X,
  ChevronRight,
  ChevronDown,
  Calendar,
  Activity,
  Heart,
  Zap,
  Sparkles,
  Info,
  Link2,
  RotateCcw,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
type BiomarkerStatus = "optimal" | "watch" | "attention" | "out-of-range"
type BiomarkerCategory = "metabolic" | "cardio" | "thyroid" | "nutrients" | "liver"
type TrendDirection = "up" | "down" | "stable"

interface Biomarker {
  id: string
  name: string
  value: number
  unit: string
  date: string
  category: BiomarkerCategory
  clinicalRange: { min: number; max: number }
  optimalRange: { min: number; max: number }
  previousValue?: number
  previousDate?: string
  interpretation: string
  fullInterpretation: string
  whyItMatters: string
  influences: string[]
  nextBestStep: string
}

// Demo biomarker data
const biomarkers: Biomarker[] = [
  {
    id: "glucose",
    name: "Glucose",
    value: 92,
    unit: "mg/dL",
    date: "Mar 15, 2026",
    category: "metabolic",
    clinicalRange: { min: 70, max: 100 },
    optimalRange: { min: 75, max: 90 },
    previousValue: 88,
    previousDate: "Dec 10, 2025",
    interpretation: "Within clinical range, slightly above optimal",
    fullInterpretation: "Your fasting glucose of 92 mg/dL falls within the normal clinical range but is slightly above the optimal zone. This suggests your body is managing blood sugar well, though there may be room for fine-tuning metabolic efficiency.",
    whyItMatters: "Glucose is your body's primary energy source. Keeping it in the optimal range supports steady energy throughout the day, reduces metabolic stress, and promotes long-term cardiometabolic health.",
    influences: ["Carbohydrate intake timing", "Sleep quality", "Stress levels", "Physical activity", "Meal composition"],
    nextBestStep: "Try having a short 10-minute walk after your largest meal today. This simple habit can gently support post-meal glucose regulation.",
  },
  {
    id: "a1c",
    name: "Hemoglobin A1c",
    value: 5.4,
    unit: "%",
    date: "Mar 15, 2026",
    category: "metabolic",
    clinicalRange: { min: 4.0, max: 5.7 },
    optimalRange: { min: 4.5, max: 5.3 },
    previousValue: 5.3,
    previousDate: "Dec 10, 2025",
    interpretation: "Optimal glucose control over 3 months",
    fullInterpretation: "Your A1c of 5.4% reflects excellent blood sugar management over the past 2-3 months. This indicates stable glucose metabolism and healthy insulin sensitivity.",
    whyItMatters: "A1c provides a window into your average blood sugar over time. Maintaining optimal levels supports energy stability, cognitive function, and reduces long-term metabolic risks.",
    influences: ["Dietary patterns", "Exercise consistency", "Sleep duration", "Stress management", "Meal timing"],
    nextBestStep: "Keep doing what you are doing. Your current lifestyle is supporting excellent long-term glucose control.",
  },
  {
    id: "hdl",
    name: "HDL Cholesterol",
    value: 48,
    unit: "mg/dL",
    date: "Mar 15, 2026",
    category: "cardio",
    clinicalRange: { min: 40, max: 100 },
    optimalRange: { min: 55, max: 80 },
    previousValue: 45,
    previousDate: "Dec 10, 2025",
    interpretation: "Within clinical range but below optimal",
    fullInterpretation: "Your HDL of 48 mg/dL is within the acceptable clinical range but below optimal levels. HDL helps transport cholesterol away from arteries, so higher levels are generally protective.",
    whyItMatters: "HDL is often called 'good cholesterol' because it helps clear excess cholesterol from your bloodstream. Higher HDL levels are associated with better cardiovascular resilience.",
    influences: ["Aerobic exercise", "Healthy fats intake", "Alcohol moderation", "Smoking cessation", "Body composition"],
    nextBestStep: "Consider adding 2-3 servings of fatty fish or a quality omega-3 supplement this week. Healthy fats can gently support HDL over time.",
  },
  {
    id: "triglycerides",
    name: "Triglycerides",
    value: 142,
    unit: "mg/dL",
    date: "Mar 15, 2026",
    category: "cardio",
    clinicalRange: { min: 0, max: 150 },
    optimalRange: { min: 0, max: 100 },
    previousValue: 155,
    previousDate: "Dec 10, 2025",
    interpretation: "Within clinical range, elevated from optimal",
    fullInterpretation: "Your triglycerides of 142 mg/dL are within the clinical normal range but elevated above optimal. This may indicate an opportunity to refine dietary patterns, particularly around refined carbohydrates and sugar intake.",
    whyItMatters: "Triglycerides are a type of fat in your blood that your body uses for energy. Elevated levels can be an early signal of metabolic stress and may affect cardiometabolic health over time.",
    influences: ["Sugar and refined carb intake", "Alcohol consumption", "Omega-3 fatty acids", "Physical activity", "Meal timing"],
    nextBestStep: "Try swapping one refined carb serving for a fiber-rich alternative today. Small consistent changes can meaningfully shift triglycerides over time.",
  },
  {
    id: "tsh",
    name: "TSH",
    value: 2.1,
    unit: "mIU/L",
    date: "Mar 15, 2026",
    category: "thyroid",
    clinicalRange: { min: 0.4, max: 4.0 },
    optimalRange: { min: 1.0, max: 2.5 },
    previousValue: 2.3,
    previousDate: "Dec 10, 2025",
    interpretation: "Optimal thyroid signaling",
    fullInterpretation: "Your TSH of 2.1 mIU/L is well within both clinical and optimal ranges. This suggests your thyroid is communicating effectively with your pituitary gland and supporting healthy metabolic function.",
    whyItMatters: "TSH is the primary signal that controls thyroid hormone production. Optimal levels support energy, metabolism, mood, body temperature regulation, and overall vitality.",
    influences: ["Iodine intake", "Selenium status", "Stress levels", "Sleep quality", "Inflammation"],
    nextBestStep: "Your thyroid is well-supported. Continue prioritizing quality sleep and stress management to maintain this balance.",
  },
  {
    id: "vitamin-d",
    name: "Vitamin D",
    value: 32,
    unit: "ng/mL",
    date: "Mar 15, 2026",
    category: "nutrients",
    clinicalRange: { min: 20, max: 100 },
    optimalRange: { min: 40, max: 60 },
    previousValue: 28,
    previousDate: "Dec 10, 2025",
    interpretation: "Below optimal despite being clinical normal",
    fullInterpretation: "Your Vitamin D of 32 ng/mL is within the clinical range but below optimal levels. This is a very common finding and represents one of the clearest opportunities for improving recovery, immune resilience, and overall vitality.",
    whyItMatters: "Vitamin D acts like a hormone in your body, influencing immune function, bone health, mood, muscle function, and even sleep quality. Optimal levels support recovery and long-term wellness.",
    influences: ["Sun exposure", "Supplementation", "Dietary intake", "Body fat percentage", "Gut health"],
    nextBestStep: "Consider a Vitamin D3 supplement with K2 (2000-4000 IU daily). Taking it with a fat-containing meal improves absorption.",
  },
  {
    id: "b12",
    name: "Vitamin B12",
    value: 380,
    unit: "pg/mL",
    date: "Mar 15, 2026",
    category: "nutrients",
    clinicalRange: { min: 200, max: 900 },
    optimalRange: { min: 500, max: 800 },
    previousValue: 360,
    previousDate: "Dec 10, 2025",
    interpretation: "Low-normal, may benefit from optimization",
    fullInterpretation: "Your B12 of 380 pg/mL is within the clinical range but at the lower end of optimal. This may be worth watching, especially if you experience fatigue, brain fog, or reduced energy levels.",
    whyItMatters: "B12 is essential for energy production at the cellular level, nervous system function, and the formation of healthy blood cells. Optimal levels support mental clarity and sustained energy.",
    influences: ["Dietary sources (animal products)", "Absorption efficiency", "Gut health", "Metformin use", "Age"],
    nextBestStep: "Add more B12-rich foods like eggs, fish, or fortified foods this week. If plant-based, consider a methylcobalamin supplement.",
  },
  {
    id: "alt",
    name: "ALT",
    value: 24,
    unit: "U/L",
    date: "Mar 15, 2026",
    category: "liver",
    clinicalRange: { min: 7, max: 56 },
    optimalRange: { min: 10, max: 30 },
    previousValue: 26,
    previousDate: "Dec 10, 2025",
    interpretation: "Optimal liver enzyme levels",
    fullInterpretation: "Your ALT of 24 U/L is well within both clinical and optimal ranges. This indicates healthy liver function and suggests your liver is processing metabolic demands effectively.",
    whyItMatters: "ALT is an enzyme found primarily in the liver. Normal levels indicate the liver is functioning well and handling its roles in metabolism, detoxification, and nutrient processing.",
    influences: ["Alcohol intake", "Medication use", "Body composition", "Dietary patterns", "Exercise intensity"],
    nextBestStep: "Your liver function looks great. Continue supporting it with adequate hydration and limiting processed foods.",
  },
  {
    id: "ast",
    name: "AST",
    value: 22,
    unit: "U/L",
    date: "Mar 15, 2026",
    category: "liver",
    clinicalRange: { min: 10, max: 40 },
    optimalRange: { min: 10, max: 30 },
    previousValue: 25,
    previousDate: "Dec 10, 2025",
    interpretation: "Optimal liver and muscle enzyme levels",
    fullInterpretation: "Your AST of 22 U/L is within optimal range. AST is found in the liver and muscles, so normal levels suggest both are functioning well without excessive stress or damage.",
    whyItMatters: "AST helps assess liver health and can also indicate muscle stress. Optimal levels support confidence that your liver and muscles are handling metabolic demands appropriately.",
    influences: ["Exercise intensity", "Alcohol intake", "Medications", "Muscle recovery", "Overall metabolic health"],
    nextBestStep: "Keep balancing exercise intensity with recovery. Your current approach is supporting healthy liver and muscle function.",
  },
]

// Category configuration
const categoryConfig: Record<BiomarkerCategory, { label: string; color: string; bgColor: string }> = {
  metabolic: { label: "Metabolic", color: "text-amber-400", bgColor: "bg-amber-500/10" },
  cardio: { label: "Cardio", color: "text-rose-400", bgColor: "bg-rose-500/10" },
  thyroid: { label: "Thyroid", color: "text-purple-400", bgColor: "bg-purple-500/10" },
  nutrients: { label: "Nutrients", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
  liver: { label: "Liver", color: "text-blue-400", bgColor: "bg-blue-500/10" },
}

// Status configuration
const statusConfig: Record<BiomarkerStatus, { label: string; color: string; bgColor: string; borderColor: string; score: number }> = {
  optimal: { label: "Optimal", color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30", score: 100 },
  watch: { label: "Watch", color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", score: 75 },
  attention: { label: "Attention", color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", score: 50 },
  "out-of-range": { label: "Out of Range", color: "text-rose-400", bgColor: "bg-rose-500/10", borderColor: "border-rose-500/30", score: 25 },
}

// Sorting priority (1 = highest priority, shown first)
const statusPriority: Record<BiomarkerStatus, number> = {
  "out-of-range": 1,
  attention: 2,
  watch: 3,
  optimal: 4,
}

// Helper functions
function getBiomarkerStatus(biomarker: Biomarker): BiomarkerStatus {
  const { value, clinicalRange, optimalRange } = biomarker

  // Out of clinical range
  if (value < clinicalRange.min || value > clinicalRange.max) {
    return "out-of-range"
  }

  // Within optimal range
  if (value >= optimalRange.min && value <= optimalRange.max) {
    return "optimal"
  }

  // Calculate distance from optimal
  const optimalMid = (optimalRange.min + optimalRange.max) / 2
  const optimalSpan = optimalRange.max - optimalRange.min
  const distance = Math.abs(value - optimalMid)
  const normalizedDistance = distance / (optimalSpan / 2)

  // Watch vs Attention based on distance
  if (normalizedDistance <= 1.5) {
    return "watch"
  }
  return "attention"
}

function getTrendDirection(current: number, previous?: number): TrendDirection {
  if (!previous) return "stable"
  const change = ((current - previous) / previous) * 100
  if (change > 2) return "up"
  if (change < -2) return "down"
  return "stable"
}

function getRangePosition(value: number, clinicalRange: { min: number; max: number }, optimalRange: { min: number; max: number }): number {
  // Extended range for visualization (20% padding on each side)
  const extendedMin = clinicalRange.min - (clinicalRange.max - clinicalRange.min) * 0.1
  const extendedMax = clinicalRange.max + (clinicalRange.max - clinicalRange.min) * 0.1
  const range = extendedMax - extendedMin
  const position = ((value - extendedMin) / range) * 100
  return Math.max(0, Math.min(100, position))
}

// Connected Insights generation
function generateConnectedInsights(biomarkers: Biomarker[]): { title: string; description: string; icon: typeof Heart; color: string }[] {
  const insights: { title: string; description: string; icon: typeof Heart; color: string }[] = []

  const glucose = biomarkers.find(b => b.id === "glucose")
  const a1c = biomarkers.find(b => b.id === "a1c")
  const hdl = biomarkers.find(b => b.id === "hdl")
  const triglycerides = biomarkers.find(b => b.id === "triglycerides")
  const tsh = biomarkers.find(b => b.id === "tsh")
  const vitaminD = biomarkers.find(b => b.id === "vitamin-d")
  const b12 = biomarkers.find(b => b.id === "b12")
  const alt = biomarkers.find(b => b.id === "alt")
  const ast = biomarkers.find(b => b.id === "ast")

  // Metabolic Stability
  if (glucose && a1c) {
    const glucoseStatus = getBiomarkerStatus(glucose)
    const a1cStatus = getBiomarkerStatus(a1c)
    if (glucoseStatus === "optimal" && a1cStatus === "optimal") {
      insights.push({
        title: "Metabolic Stability",
        description: "Your glucose regulation appears stable, supporting steady energy and metabolic balance.",
        icon: Zap,
        color: "text-emerald-400",
      })
    } else {
      insights.push({
        title: "Metabolic Monitoring",
        description: "Your glucose markers suggest some room for metabolic optimization. Consistent meal timing and balanced macros may help.",
        icon: Activity,
        color: "text-amber-400",
      })
    }
  }

  // Cardiometabolic
  if (hdl && triglycerides) {
    const hdlStatus = getBiomarkerStatus(hdl)
    const triStatus = getBiomarkerStatus(triglycerides)
    if (hdlStatus !== "optimal" || triStatus !== "optimal") {
      insights.push({
        title: "Cardiometabolic Resilience",
        description: "Your lipid profile may be showing early signs of reduced cardiometabolic resilience. This is worth watching over time.",
        icon: Heart,
        color: "text-rose-400",
      })
    } else {
      insights.push({
        title: "Cardiovascular Support",
        description: "Your lipid markers suggest good cardiovascular foundation. Maintaining exercise and healthy fats intake supports this.",
        icon: Heart,
        color: "text-emerald-400",
      })
    }
  }

  // Thyroid
  if (tsh) {
    const tshStatus = getBiomarkerStatus(tsh)
    if (tshStatus === "optimal") {
      insights.push({
        title: "Thyroid Balance",
        description: "Your thyroid signaling appears stable and supportive of metabolic and energy balance.",
        icon: Activity,
        color: "text-purple-400",
      })
    }
  }

  // Recovery & Resilience
  if (vitaminD) {
    const vdStatus = getBiomarkerStatus(vitaminD)
    if (vdStatus !== "optimal") {
      insights.push({
        title: "Recovery & Resilience",
        description: "Vitamin D may be one of the clearest opportunities to support recovery, immune resilience, and long-term vitality.",
        icon: Sparkles,
        color: "text-amber-400",
      })
    }
  }

  // Cellular Energy
  if (b12) {
    const b12Status = getBiomarkerStatus(b12)
    if (b12Status !== "optimal") {
      insights.push({
        title: "Cellular Energy",
        description: "B12 may be worth watching because it supports cellular energy production and neurological function.",
        icon: Zap,
        color: "text-amber-400",
      })
    }
  }

  // Liver Load
  if (alt && ast) {
    const altStatus = getBiomarkerStatus(alt)
    const astStatus = getBiomarkerStatus(ast)
    if (altStatus === "optimal" && astStatus === "optimal") {
      insights.push({
        title: "Liver Function",
        description: "Liver markers appear stable and supportive of normal metabolic processing.",
        icon: Activity,
        color: "text-blue-400",
      })
    }
  }

  return insights
}

// Components
function TrendIndicator({ direction, size = "sm" }: { direction: TrendDirection; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4"
  
  if (direction === "up") return <TrendingUp className={cn(sizeClass, "text-emerald-400")} />
  if (direction === "down") return <TrendingDown className={cn(sizeClass, "text-rose-400")} />
  return <Minus className={cn(sizeClass, "text-muted-foreground")} />
}

function RangeBar({ value, clinicalRange, optimalRange, status }: { value: number; clinicalRange: { min: number; max: number }; optimalRange: { min: number; max: number }; status: BiomarkerStatus }) {
  const position = getRangePosition(value, clinicalRange, optimalRange)
  
  // Calculate optimal zone position
  const extendedMin = clinicalRange.min - (clinicalRange.max - clinicalRange.min) * 0.1
  const extendedMax = clinicalRange.max + (clinicalRange.max - clinicalRange.min) * 0.1
  const range = extendedMax - extendedMin
  const optimalStart = ((optimalRange.min - extendedMin) / range) * 100
  const optimalEnd = ((optimalRange.max - extendedMin) / range) * 100

  return (
    <div className="relative h-2 bg-secondary rounded-full overflow-visible">
      {/* Optimal zone indicator */}
      <div 
        className="absolute h-full bg-emerald-500/20 rounded-full"
        style={{ left: `${optimalStart}%`, width: `${optimalEnd - optimalStart}%` }}
      />
      {/* Value marker */}
      <div 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background shadow-lg transition-all",
          statusConfig[status].bgColor,
          status === "optimal" ? "bg-emerald-400" : status === "watch" ? "bg-amber-400" : status === "attention" ? "bg-orange-400" : "bg-rose-400"
        )}
        style={{ left: `calc(${position}% - 6px)` }}
      />
    </div>
  )
}

function BiomarkerCard({ biomarker, onClick }: { biomarker: Biomarker; onClick: () => void }) {
  const status = getBiomarkerStatus(biomarker)
  const trend = getTrendDirection(biomarker.value, biomarker.previousValue)
  const config = statusConfig[status]
  const catConfig = categoryConfig[biomarker.category]

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full group p-4 rounded-xl text-left",
        "bg-card border transition-all duration-200",
        "hover:border-primary/30 hover:shadow-lg hover:scale-[1.01]",
        "active:scale-[0.99]",
        config.borderColor
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground">{biomarker.name}</h3>
            <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", catConfig.bgColor, catConfig.color)}>
              {catConfig.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{biomarker.date}</p>
        </div>
        <div className={cn("px-2 py-1 rounded-md text-xs font-medium", config.bgColor, config.color)}>
          {config.label}
        </div>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <span className="text-2xl font-bold text-foreground tabular-nums">{biomarker.value}</span>
        <span className="text-sm text-muted-foreground mb-1">{biomarker.unit}</span>
        {biomarker.previousValue && (
          <div className="flex items-center gap-1 ml-auto">
            <TrendIndicator direction={trend} />
            <span className="text-xs text-muted-foreground">vs {biomarker.previousValue}</span>
          </div>
        )}
      </div>

      <RangeBar 
        value={biomarker.value} 
        clinicalRange={biomarker.clinicalRange}
        optimalRange={biomarker.optimalRange}
        status={status}
      />

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-muted-foreground line-clamp-1 flex-1">{biomarker.interpretation}</p>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
      </div>
    </button>
  )
}

function BiomarkerDetailModal({ biomarker, onClose }: { biomarker: Biomarker | null; onClose: () => void }) {
  if (!biomarker) return null

  const status = getBiomarkerStatus(biomarker)
  const trend = getTrendDirection(biomarker.value, biomarker.previousValue)
  const config = statusConfig[status]
  const catConfig = categoryConfig[biomarker.category]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-t-2xl sm:rounded-2xl m-0 sm:m-4 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", catConfig.bgColor)}>
              <FlaskConical className={cn("w-5 h-5", catConfig.color)} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{biomarker.name}</h2>
              <p className="text-xs text-muted-foreground">{catConfig.label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Value & Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-foreground tabular-nums">{biomarker.value}</span>
                <span className="text-lg text-muted-foreground mb-1">{biomarker.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{biomarker.date}</p>
            </div>
            <div className={cn("px-3 py-2 rounded-xl text-sm font-semibold", config.bgColor, config.color)}>
              {config.label}
            </div>
          </div>

          {/* Range Visualization */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>Clinical: {biomarker.clinicalRange.min}-{biomarker.clinicalRange.max} {biomarker.unit}</span>
              <span className="text-emerald-400">Optimal: {biomarker.optimalRange.min}-{biomarker.optimalRange.max}</span>
            </div>
            <RangeBar 
              value={biomarker.value} 
              clinicalRange={biomarker.clinicalRange}
              optimalRange={biomarker.optimalRange}
              status={status}
            />
          </div>

          {/* Trend */}
          {biomarker.previousValue && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30">
              <TrendIndicator direction={trend} size="md" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {trend === "up" ? "Increased" : trend === "down" ? "Decreased" : "Stable"} from previous
                </p>
                <p className="text-xs text-muted-foreground">
                  Previous: {biomarker.previousValue} {biomarker.unit} on {biomarker.previousDate}
                </p>
              </div>
            </div>
          )}

          {/* Full Interpretation */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Interpretation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{biomarker.fullInterpretation}</p>
              </div>
            </div>
          </div>

          {/* Why It Matters */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              Why It Matters
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{biomarker.whyItMatters}</p>
          </div>

          {/* Influences */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">What Can Influence This</h3>
            <div className="flex flex-wrap gap-2">
              {biomarker.influences.map((influence, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/30 text-xs text-muted-foreground"
                >
                  {influence}
                </span>
              ))}
            </div>
          </div>

          {/* Next Best Step */}
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Next Best Step</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{biomarker.nextBestStep}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Labs Page Component
export function LabsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<BiomarkerCategory | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<BiomarkerStatus | "all">("all")
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showAllInsights, setShowAllInsights] = useState(false)

  // Calculate Labs Intelligence Score
  const labsScore = useMemo(() => {
    const scores = biomarkers.map(b => statusConfig[getBiomarkerStatus(b)].score)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }, [])

  // Count biomarkers by status
  const statusCounts = useMemo(() => {
    const counts: Record<BiomarkerStatus, number> = {
      optimal: 0,
      watch: 0,
      attention: 0,
      "out-of-range": 0,
    }
    biomarkers.forEach(b => {
      counts[getBiomarkerStatus(b)]++
    })
    return counts
  }, [])

  // Biomarkers needing attention
  const needsAttention = statusCounts.attention + statusCounts["out-of-range"] + statusCounts.watch

  // Connected insights
  const connectedInsights = useMemo(() => generateConnectedInsights(biomarkers), [])

  // Filter and sort biomarkers
  const filteredBiomarkers = useMemo(() => {
    let filtered = biomarkers

    // Search filter - includes name, category, and status
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b => {
        const status = getBiomarkerStatus(b)
        const statusLabel = statusConfig[status].label.toLowerCase()
        return (
          b.name.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query) ||
          categoryConfig[b.category].label.toLowerCase().includes(query) ||
          statusLabel.includes(query)
        )
      })
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(b => b.category === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(b => getBiomarkerStatus(b) === selectedStatus)
    }

    // Sort by priority
    filtered.sort((a, b) => {
      const statusA = getBiomarkerStatus(a)
      const statusB = getBiomarkerStatus(b)
      return statusPriority[statusA] - statusPriority[statusB]
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedStatus])

  // Get score color
  const getScoreColor = (s: number) => {
    if (s >= 85) return "text-emerald-400"
    if (s >= 70) return "text-amber-400"
    if (s >= 50) return "text-orange-400"
    return "text-rose-400"
  }

  // Score circle
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (labsScore / 100) * circumference

  return (
    <div className="space-y-6">
      {/* Labs Overview */}
      <div className="p-6 rounded-2xl bg-card border border-border/50">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Score Circle */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Labs Intelligence Score
            </div>
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-secondary"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className={cn("transition-all duration-1000", getScoreColor(labsScore))}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-4xl font-bold tabular-nums", getScoreColor(labsScore))}>
                  {labsScore}
                </span>
                <span className="text-xs text-muted-foreground">of 100</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Last Lab</span>
              <span className="text-sm font-semibold text-foreground">Mar 15, 2026</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Reviewed</span>
              <span className="text-sm font-semibold text-primary">{biomarkers.length} markers</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-widest block mb-1">Optimal</span>
              <span className="text-sm font-semibold text-emerald-400">{statusCounts.optimal}</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[10px] font-semibold text-amber-400/80 uppercase tracking-widest block mb-1">Watch</span>
              <span className="text-sm font-semibold text-amber-400">{statusCounts.watch}</span>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
              <span className="text-[10px] font-semibold text-orange-400/80 uppercase tracking-widest block mb-1">Needs Attention</span>
              <span className="text-sm font-semibold text-orange-400">{statusCounts.attention + statusCounts["out-of-range"]}</span>
            </div>
          </div>
        </div>

        {/* Primary Summary Insight */}
        <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Labs Summary</span>
              <p className="text-sm text-foreground mt-1 leading-relaxed text-pretty">
                Your biological profile appears stable, with a few early signals that may be influencing recovery and cardiometabolic efficiency. Vitamin D and HDL are the clearest opportunities for optimization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search biomarkers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all",
              showFilters 
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/30 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Reset Filters */}
            {(selectedCategory !== "all" || selectedStatus !== "all" || searchQuery) && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setSelectedCategory("all")
                    setSelectedStatus("all")
                    setSearchQuery("")
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/50 border border-border/30 hover:border-border/50 transition-all"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset filters
                </button>
              </div>
            )}
            
            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    selectedCategory === "all"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border border-border/30 hover:text-foreground"
                  )}
                >
                  All
                </button>
                {(Object.keys(categoryConfig) as BiomarkerCategory[]).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedCategory === cat
                        ? cn(categoryConfig[cat].bgColor, categoryConfig[cat].color, "border", categoryConfig[cat].color.replace("text-", "border-").replace("-400", "-500/30"))
                        : "bg-secondary/50 text-muted-foreground border border-border/30 hover:text-foreground"
                    )}
                  >
                    {categoryConfig[cat].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStatus("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    selectedStatus === "all"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border border-border/30 hover:text-foreground"
                  )}
                >
                  All
                </button>
                {(Object.keys(statusConfig) as BiomarkerStatus[]).map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedStatus === status
                        ? cn(statusConfig[status].bgColor, statusConfig[status].color, "border", statusConfig[status].borderColor)
                        : "bg-secondary/50 text-muted-foreground border border-border/30 hover:text-foreground"
                    )}
                  >
                    {statusConfig[status].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Biomarker Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredBiomarkers.map(biomarker => (
          <BiomarkerCard 
            key={biomarker.id} 
            biomarker={biomarker}
            onClick={() => setSelectedBiomarker(biomarker)}
          />
        ))}
      </div>

      {filteredBiomarkers.length === 0 && (
        <div className="text-center py-12">
          <FlaskConical className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No biomarkers match your filters</p>
        </div>
      )}

      {/* Connected Insights */}
      <section className="p-6 rounded-2xl bg-card border border-border/50">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-foreground">Connected Insights</h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Cross-System Analysis</p>
        </div>

        <div className="space-y-3">
          {(showAllInsights ? connectedInsights : connectedInsights.slice(0, 4)).map((insight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30"
            >
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                insight.color === "text-emerald-400" ? "bg-emerald-500/10" :
                insight.color === "text-amber-400" ? "bg-amber-500/10" :
                insight.color === "text-rose-400" ? "bg-rose-500/10" :
                insight.color === "text-purple-400" ? "bg-purple-500/10" :
                "bg-blue-500/10"
              )}>
                <insight.icon className={cn("w-5 h-5", insight.color)} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{insight.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All / Collapse Button */}
        {connectedInsights.length > 4 && (
          <button
            onClick={() => setShowAllInsights(!showAllInsights)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary/30 border border-border/30 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border/50 transition-all"
          >
            {showAllInsights ? (
              <>
                Show less
                <ChevronDown className="w-4 h-4 rotate-180" />
              </>
            ) : (
              <>
                View all {connectedInsights.length} insights
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground/70 text-center px-4 leading-relaxed pb-24">
        Meridian provides AI-generated wellness insights based on user-entered data. It is not a medical diagnosis and does not replace professional medical advice. Always review lab results with a licensed healthcare provider.
      </p>

      {/* Detail Modal */}
      {selectedBiomarker && (
        <BiomarkerDetailModal 
          biomarker={selectedBiomarker}
          onClose={() => setSelectedBiomarker(null)}
        />
      )}
    </div>
  )
}
