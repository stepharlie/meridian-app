"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
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
  ArrowRight,
  Plus,
  Upload,
  FileText,
  Check,
  AlertCircle,
  Trash2,
  RotateCcw,
  Loader2,
  Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useNav } from "../nav-context"

// Types
type BiomarkerStatus = "optimal" | "watch" | "attention" | "out-of-range"
type BiomarkerCategory = "metabolic" | "cardio" | "thyroid" | "nutrients" | "liver"
type TrendDirection = "up" | "down" | "stable"
type DataSource = "demo" | "user" | "ai"

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
  source: DataSource
  notes?: string
}

interface LabEntry {
  biomarkerId: string
  value: number
  date: string
  notes?: string
  source: DataSource
}

// Biomarker definitions (metadata without values)
const biomarkerDefinitions: Record<string, Omit<Biomarker, "value" | "date" | "previousValue" | "previousDate" | "source" | "notes">> = {
  glucose: {
    id: "glucose",
    name: "Glucose",
    unit: "mg/dL",
    category: "metabolic",
    clinicalRange: { min: 70, max: 100 },
    optimalRange: { min: 75, max: 90 },
    interpretation: "Fasting blood glucose level",
    fullInterpretation: "Fasting glucose measures how well your body manages blood sugar overnight. Keeping it in the optimal range supports steady energy throughout the day, reduces metabolic stress, and promotes long-term cardiometabolic health.",
    whyItMatters: "Glucose is your body's primary energy source. Keeping it in the optimal range supports steady energy throughout the day, reduces metabolic stress, and promotes long-term cardiometabolic health.",
    influences: ["Carbohydrate intake timing", "Sleep quality", "Stress levels", "Physical activity", "Meal composition"],
    nextBestStep: "Try having a short 10-minute walk after your largest meal today. This simple habit can gently support post-meal glucose regulation.",
  },
  a1c: {
    id: "a1c",
    name: "Hemoglobin A1c",
    unit: "%",
    category: "metabolic",
    clinicalRange: { min: 4.0, max: 5.7 },
    optimalRange: { min: 4.5, max: 5.3 },
    interpretation: "Average blood sugar over 3 months",
    fullInterpretation: "A1c reflects your average blood sugar management over the past 2-3 months. This indicates stable glucose metabolism and healthy insulin sensitivity.",
    whyItMatters: "A1c provides a window into your average blood sugar over time. Maintaining optimal levels supports energy stability, cognitive function, and reduces long-term metabolic risks.",
    influences: ["Dietary patterns", "Exercise consistency", "Sleep duration", "Stress management", "Meal timing"],
    nextBestStep: "Keep doing what you are doing. Your current lifestyle is supporting excellent long-term glucose control.",
  },
  hdl: {
    id: "hdl",
    name: "HDL Cholesterol",
    unit: "mg/dL",
    category: "cardio",
    clinicalRange: { min: 40, max: 100 },
    optimalRange: { min: 55, max: 80 },
    interpretation: "Good cholesterol level",
    fullInterpretation: "HDL helps transport cholesterol away from arteries, so higher levels are generally protective for cardiovascular health.",
    whyItMatters: "HDL is often called 'good cholesterol' because it helps clear excess cholesterol from your bloodstream. Higher HDL levels are associated with better cardiovascular resilience.",
    influences: ["Aerobic exercise", "Healthy fats intake", "Alcohol moderation", "Smoking cessation", "Body composition"],
    nextBestStep: "Consider adding 2-3 servings of fatty fish or a quality omega-3 supplement this week. Healthy fats can gently support HDL over time.",
  },
  triglycerides: {
    id: "triglycerides",
    name: "Triglycerides",
    unit: "mg/dL",
    category: "cardio",
    clinicalRange: { min: 0, max: 150 },
    optimalRange: { min: 0, max: 100 },
    interpretation: "Blood fat level",
    fullInterpretation: "Triglycerides are a type of fat in your blood. Elevated levels may indicate an opportunity to refine dietary patterns, particularly around refined carbohydrates and sugar intake.",
    whyItMatters: "Triglycerides are a type of fat in your blood that your body uses for energy. Elevated levels can be an early signal of metabolic stress and may affect cardiometabolic health over time.",
    influences: ["Sugar and refined carb intake", "Alcohol consumption", "Omega-3 fatty acids", "Physical activity", "Meal timing"],
    nextBestStep: "Try swapping one refined carb serving for a fiber-rich alternative today. Small consistent changes can meaningfully shift triglycerides over time.",
  },
  tsh: {
    id: "tsh",
    name: "TSH",
    unit: "mIU/L",
    category: "thyroid",
    clinicalRange: { min: 0.4, max: 4.0 },
    optimalRange: { min: 1.0, max: 2.5 },
    interpretation: "Thyroid stimulating hormone",
    fullInterpretation: "TSH is the primary signal that controls thyroid hormone production. Well-balanced levels suggest your thyroid is communicating effectively with your pituitary gland.",
    whyItMatters: "TSH is the primary signal that controls thyroid hormone production. Optimal levels support energy, metabolism, mood, body temperature regulation, and overall vitality.",
    influences: ["Iodine intake", "Selenium status", "Stress levels", "Sleep quality", "Inflammation"],
    nextBestStep: "Your thyroid is well-supported. Continue prioritizing quality sleep and stress management to maintain this balance.",
  },
  "vitamin-d": {
    id: "vitamin-d",
    name: "Vitamin D",
    unit: "ng/mL",
    category: "nutrients",
    clinicalRange: { min: 20, max: 100 },
    optimalRange: { min: 40, max: 60 },
    interpretation: "Vitamin D status",
    fullInterpretation: "Vitamin D acts like a hormone in your body, influencing immune function, bone health, mood, muscle function, and even sleep quality.",
    whyItMatters: "Vitamin D acts like a hormone in your body, influencing immune function, bone health, mood, muscle function, and even sleep quality. Optimal levels support recovery and long-term wellness.",
    influences: ["Sun exposure", "Supplementation", "Dietary intake", "Body fat percentage", "Gut health"],
    nextBestStep: "Consider a Vitamin D3 supplement with K2 (2000-4000 IU daily). Taking it with a fat-containing meal improves absorption.",
  },
  b12: {
    id: "b12",
    name: "Vitamin B12",
    unit: "pg/mL",
    category: "nutrients",
    clinicalRange: { min: 200, max: 900 },
    optimalRange: { min: 500, max: 800 },
    interpretation: "B12 vitamin level",
    fullInterpretation: "B12 is essential for energy production at the cellular level, nervous system function, and the formation of healthy blood cells.",
    whyItMatters: "B12 is essential for energy production at the cellular level, nervous system function, and the formation of healthy blood cells. Optimal levels support mental clarity and sustained energy.",
    influences: ["Dietary sources (animal products)", "Absorption efficiency", "Gut health", "Metformin use", "Age"],
    nextBestStep: "Add more B12-rich foods like eggs, fish, or fortified foods this week. If plant-based, consider a methylcobalamin supplement.",
  },
  alt: {
    id: "alt",
    name: "ALT",
    unit: "U/L",
    category: "liver",
    clinicalRange: { min: 7, max: 56 },
    optimalRange: { min: 10, max: 30 },
    interpretation: "Liver enzyme level",
    fullInterpretation: "ALT is an enzyme found primarily in the liver. Normal levels indicate the liver is functioning well and handling its roles in metabolism, detoxification, and nutrient processing.",
    whyItMatters: "ALT is an enzyme found primarily in the liver. Normal levels indicate the liver is functioning well and handling its roles in metabolism, detoxification, and nutrient processing.",
    influences: ["Alcohol intake", "Medication use", "Body composition", "Dietary patterns", "Exercise intensity"],
    nextBestStep: "Your liver function looks great. Continue supporting it with adequate hydration and limiting processed foods.",
  },
  ast: {
    id: "ast",
    name: "AST",
    unit: "U/L",
    category: "liver",
    clinicalRange: { min: 10, max: 40 },
    optimalRange: { min: 10, max: 30 },
    interpretation: "Liver and muscle enzyme",
    fullInterpretation: "AST is found in the liver and muscles, so normal levels suggest both are functioning well without excessive stress or damage.",
    whyItMatters: "AST helps assess liver health and can also indicate muscle stress. Optimal levels support confidence that your liver and muscles are handling metabolic demands appropriately.",
    influences: ["Exercise intensity", "Alcohol intake", "Medications", "Muscle recovery", "Overall metabolic health"],
    nextBestStep: "Keep balancing exercise intensity with recovery. Your current approach is supporting healthy liver and muscle function.",
  },
}

// Demo biomarker data
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

// Previous values for demo data
const demoPreviousValues: Record<string, { value: number; date: string }> = {
  glucose: { value: 88, date: "2025-12-10" },
  a1c: { value: 5.3, date: "2025-12-10" },
  hdl: { value: 45, date: "2025-12-10" },
  triglycerides: { value: 155, date: "2025-12-10" },
  tsh: { value: 2.3, date: "2025-12-10" },
  "vitamin-d": { value: 28, date: "2025-12-10" },
  b12: { value: 360, date: "2025-12-10" },
  alt: { value: 26, date: "2025-12-10" },
  ast: { value: 25, date: "2025-12-10" },
}

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

// Source label configuration
const sourceConfig: Record<DataSource, { label: string; color: string; bgColor: string }> = {
  demo: { label: "Demo", color: "text-muted-foreground", bgColor: "bg-muted/50" },
  user: { label: "You", color: "text-primary", bgColor: "bg-primary/10" },
  ai: { label: "AI", color: "text-purple-400", bgColor: "bg-purple-500/10" },
}

// Sorting priority (1 = highest priority, shown first)
const statusPriority: Record<BiomarkerStatus, number> = {
  "out-of-range": 1,
  attention: 2,
  watch: 3,
  optimal: 4,
}

// Local Storage Key
const LABS_STORAGE_KEY = "meridian-labs-data"

// Helper functions
function getBiomarkerStatus(value: number, clinicalRange: { min: number; max: number }, optimalRange: { min: number; max: number }): BiomarkerStatus {
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

function getRangePosition(value: number, clinicalRange: { min: number; max: number }): number {
  // Extended range for visualization (20% padding on each side)
  const extendedMin = clinicalRange.min - (clinicalRange.max - clinicalRange.min) * 0.1
  const extendedMax = clinicalRange.max + (clinicalRange.max - clinicalRange.min) * 0.1
  const range = extendedMax - extendedMin
  const position = ((value - extendedMin) / range) * 100
  return Math.max(0, Math.min(100, position))
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatDateForInput(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toISOString().split("T")[0]
}

// Build biomarker from entries
function buildBiomarkerFromEntries(biomarkerId: string, entries: LabEntry[]): Biomarker | null {
  const definition = biomarkerDefinitions[biomarkerId]
  if (!definition) return null

  // Get entries for this biomarker, sorted by date (newest first)
  const biomarkerEntries = entries
    .filter(e => e.biomarkerId === biomarkerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (biomarkerEntries.length === 0) return null

  const latestEntry = biomarkerEntries[0]
  const previousEntry = biomarkerEntries.length > 1 ? biomarkerEntries[1] : null

  // Check demo previous values
  const demoPrev = demoPreviousValues[biomarkerId]
  const previousValue = previousEntry?.value ?? (latestEntry.source === "demo" ? demoPrev?.value : undefined)
  const previousDate = previousEntry?.date ?? (latestEntry.source === "demo" ? demoPrev?.date : undefined)

  // Generate dynamic interpretation based on status
  const status = getBiomarkerStatus(latestEntry.value, definition.clinicalRange, definition.optimalRange)
  let interpretation = definition.interpretation
  if (status === "optimal") {
    interpretation = "Optimal levels"
  } else if (status === "watch") {
    interpretation = "Within clinical range, worth monitoring"
  } else if (status === "attention") {
    interpretation = "Needs attention, outside optimal zone"
  } else {
    interpretation = "Out of clinical range"
  }

  return {
    ...definition,
    value: latestEntry.value,
    date: formatDate(latestEntry.date),
    previousValue,
    previousDate: previousDate ? formatDate(previousDate) : undefined,
    interpretation,
    source: latestEntry.source,
    notes: latestEntry.notes,
  }
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
    const glucoseStatus = getBiomarkerStatus(glucose.value, glucose.clinicalRange, glucose.optimalRange)
    const a1cStatus = getBiomarkerStatus(a1c.value, a1c.clinicalRange, a1c.optimalRange)
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
    const hdlStatus = getBiomarkerStatus(hdl.value, hdl.clinicalRange, hdl.optimalRange)
    const triStatus = getBiomarkerStatus(triglycerides.value, triglycerides.clinicalRange, triglycerides.optimalRange)
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
    const tshStatus = getBiomarkerStatus(tsh.value, tsh.clinicalRange, tsh.optimalRange)
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
    const vdStatus = getBiomarkerStatus(vitaminD.value, vitaminD.clinicalRange, vitaminD.optimalRange)
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
    const b12Status = getBiomarkerStatus(b12.value, b12.clinicalRange, b12.optimalRange)
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
    const altStatus = getBiomarkerStatus(alt.value, alt.clinicalRange, alt.optimalRange)
    const astStatus = getBiomarkerStatus(ast.value, ast.clinicalRange, ast.optimalRange)
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

function SourceBadge({ source }: { source: DataSource }) {
  const config = sourceConfig[source]
  return (
    <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider", config.bgColor, config.color)}>
      {config.label}
    </span>
  )
}

function ImprovedRangeBar({ 
  value, 
  clinicalRange, 
  optimalRange, 
  status 
}: { 
  value: number
  clinicalRange: { min: number; max: number }
  optimalRange: { min: number; max: number }
  status: BiomarkerStatus 
}) {
  const position = getRangePosition(value, clinicalRange)
  
  // Calculate zone positions
  const extendedMin = clinicalRange.min - (clinicalRange.max - clinicalRange.min) * 0.1
  const extendedMax = clinicalRange.max + (clinicalRange.max - clinicalRange.min) * 0.1
  const range = extendedMax - extendedMin
  
  const clinicalStartPos = ((clinicalRange.min - extendedMin) / range) * 100
  const clinicalEndPos = ((clinicalRange.max - extendedMin) / range) * 100
  const optimalStartPos = ((optimalRange.min - extendedMin) / range) * 100
  const optimalEndPos = ((optimalRange.max - extendedMin) / range) * 100

  const dotColor = status === "optimal" ? "bg-emerald-400" : status === "watch" ? "bg-amber-400" : status === "attention" ? "bg-orange-400" : "bg-rose-400"
  const glowColor = status === "optimal" ? "shadow-emerald-400/50" : status === "watch" ? "shadow-amber-400/50" : status === "attention" ? "shadow-orange-400/50" : "shadow-rose-400/50"

  return (
    <div className="relative h-3 rounded-full overflow-visible">
      {/* Background with zones */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        {/* Low zone (left of clinical) */}
        <div 
          className="absolute h-full bg-rose-500/20"
          style={{ left: 0, width: `${clinicalStartPos}%` }}
        />
        {/* Clinical but not optimal (left side) */}
        <div 
          className="absolute h-full bg-amber-500/15"
          style={{ left: `${clinicalStartPos}%`, width: `${optimalStartPos - clinicalStartPos}%` }}
        />
        {/* Optimal zone */}
        <div 
          className="absolute h-full bg-emerald-500/25"
          style={{ left: `${optimalStartPos}%`, width: `${optimalEndPos - optimalStartPos}%` }}
        />
        {/* Clinical but not optimal (right side) */}
        <div 
          className="absolute h-full bg-amber-500/15"
          style={{ left: `${optimalEndPos}%`, width: `${clinicalEndPos - optimalEndPos}%` }}
        />
        {/* High zone (right of clinical) */}
        <div 
          className="absolute h-full bg-orange-500/20"
          style={{ left: `${clinicalEndPos}%`, width: `${100 - clinicalEndPos}%` }}
        />
      </div>
      
      {/* Tick markers */}
      <div className="absolute inset-0">
        {/* Clinical range start */}
        <div 
          className="absolute h-full w-px bg-muted-foreground/30"
          style={{ left: `${clinicalStartPos}%` }}
        />
        {/* Optimal range start */}
        <div 
          className="absolute h-full w-px bg-emerald-500/50"
          style={{ left: `${optimalStartPos}%` }}
        />
        {/* Optimal range end */}
        <div 
          className="absolute h-full w-px bg-emerald-500/50"
          style={{ left: `${optimalEndPos}%` }}
        />
        {/* Clinical range end */}
        <div 
          className="absolute h-full w-px bg-muted-foreground/30"
          style={{ left: `${clinicalEndPos}%` }}
        />
      </div>

      {/* Value marker with glow */}
      <div 
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-background transition-all duration-300",
          dotColor,
          glowColor,
          "shadow-lg"
        )}
        style={{ left: `calc(${position}% - 8px)` }}
      />
    </div>
  )
}

// ── SMART FREQUENCY LOGIC ─────────────────────────────────────────
function getNextTestInfo(status: BiomarkerStatus, lastDate: string): {
  label: string
  color: string
  bg: string
  urgent: boolean
} {
  const monthsMap: Record<BiomarkerStatus, number> = {
    optimal: 12,
    watch: 6,
    attention: 3,
    "out-of-range": 2,
  }

  const months = monthsMap[status]
  const last = new Date(lastDate)
  const next = new Date(last)
  next.setMonth(next.getMonth() + months)
  const now = new Date()
  const daysUntil = Math.round((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const monthsUntil = Math.round(daysUntil / 30)

  if (daysUntil < 0) {
    const overdueDays = Math.abs(daysUntil)
    const overdueMonths = Math.round(overdueDays / 30)
    return {
      label: overdueMonths > 1 ? `Overdue ${overdueMonths}mo` : `Overdue ${overdueDays}d`,
      color: "text-red-400",
      bg: "bg-red-400/10 border border-red-400/20",
      urgent: true,
    }
  }

  if (daysUntil <= 14) {
    return {
      label: `Due in ${daysUntil}d`,
      color: "text-amber-400",
      bg: "bg-amber-400/10 border border-amber-400/20",
      urgent: true,
    }
  }

  if (daysUntil <= 30) {
    return {
      label: `Due in ~${daysUntil}d`,
      color: "text-amber-400",
      bg: "bg-amber-400/10 border border-amber-400/20",
      urgent: false,
    }
  }

  if (monthsUntil <= 2) {
    return {
      label: `Due in ~${daysUntil}d`,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10 border border-yellow-400/20",
      urgent: false,
    }
  }

  const nextMonth = next.toLocaleString("default", { month: "short", year: "2-digit" })
  return {
    label: `Next: ${nextMonth}`,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border border-emerald-400/20",
    urgent: false,
  }
}

const BiomarkerCard = ({ 
  biomarker, 
  onClick,
  onQuickAdd,
  isHighlighted,
  cardRef,
}: { 
  biomarker: Biomarker
  onClick: () => void
  onQuickAdd: () => void
  isHighlighted?: boolean
  cardRef?: (el: HTMLDivElement | null) => void
}) => {
  const status = getBiomarkerStatus(biomarker.value, biomarker.clinicalRange, biomarker.optimalRange)
  const trend = getTrendDirection(biomarker.value, biomarker.previousValue)
  const config = statusConfig[status]
  const catConfig = categoryConfig[biomarker.category]
  const nextTest = getNextTestInfo(status, biomarker.date)
  const trendText = biomarker.previousValue ? (
    trend === "up" && (biomarker.id === "hdl" || biomarker.id === "vitamin-d" || biomarker.id === "b12") 
      ? `Up from ${biomarker.previousValue}`
      : trend === "down" && (biomarker.id === "glucose" || biomarker.id === "triglycerides" || biomarker.id === "tsh" || biomarker.id === "alt" || biomarker.id === "ast")
      ? `Down from ${biomarker.previousValue}`
      : trend !== "stable"
      ? `Previously ${biomarker.previousValue}`
      : `Stable at ${biomarker.previousValue}`
  ) : null

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative w-full group p-4 rounded-xl",
        "bg-card border transition-all duration-500",
        "hover:border-primary/30 hover:shadow-lg",
        config.borderColor,
        isHighlighted && "ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse"
      )}
    >
      {/* Quick add button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onQuickAdd()
        }}
        className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-secondary/50 border border-border/30 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:border-primary/30 transition-all"
        title="Add new entry"
      >
        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      <button
        onClick={onClick}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between mb-3 pr-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-foreground">{biomarker.name}</h3>
              <span className={cn("text-[11px] font-medium px-1.5 py-0.5 rounded", catConfig.bgColor, catConfig.color)}>
                {catConfig.label}
              </span>
              <SourceBadge source={biomarker.source} />
            </div>
            <p className="text-xs text-muted-foreground">{biomarker.date}</p>
            <span className={cn("text-[10px] font-700 px-2 py-0.5 rounded-full mt-1 inline-flex items-center gap-1", nextTest.bg, nextTest.color)}>
              {nextTest.urgent && (
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "currentColor", display: "inline-block", flexShrink: 0 }} />
              )}
              {nextTest.label}
            </span>
          </div>
          <div className={cn("px-2 py-1 rounded-md text-xs font-medium", config.bgColor, config.color)}>
            {config.label}
          </div>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <span className="text-2xl font-bold text-foreground tabular-nums">{biomarker.value}</span>
          <span className="text-sm text-muted-foreground mb-1">{biomarker.unit}</span>
          {trendText && (
            <div className="flex items-center gap-1 ml-auto">
              <TrendIndicator direction={trend} />
              <span className="text-xs text-muted-foreground">{trendText}</span>
            </div>
          )}
        </div>

        <ImprovedRangeBar 
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
    </div>
  )
}

function BiomarkerDetailModal({ biomarker, onClose }: { biomarker: Biomarker | null; onClose: () => void }) {
  if (!biomarker) return null

  const status = getBiomarkerStatus(biomarker.value, biomarker.clinicalRange, biomarker.optimalRange)
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
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{biomarker.name}</h2>
                <SourceBadge source={biomarker.source} />
              </div>
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
            <ImprovedRangeBar 
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

          {/* Notes */}
          {biomarker.notes && (
            <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Notes</p>
              <p className="text-sm text-foreground">{biomarker.notes}</p>
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

// Add Labs Modal
function AddLabsModal({ 
  isOpen, 
  onClose, 
  onManualAdd,
  onPdfUpload,
}: { 
  isOpen: boolean
  onClose: () => void
  onManualAdd: () => void
  onPdfUpload: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-card border border-border rounded-t-2xl sm:rounded-2xl m-0 sm:m-4 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Add Labs</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={onManualAdd}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/30 hover:bg-secondary/50 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Pencil className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Add Manually</h3>
                <p className="text-xs text-muted-foreground">Enter biomarker values one by one</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
            </button>

            <button
              onClick={onPdfUpload}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/30 hover:bg-secondary/50 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Upload PDF</h3>
                <p className="text-xs text-muted-foreground">AI will extract biomarkers from your lab report</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Manual Entry Modal
function ManualEntryModal({ 
  isOpen, 
  onClose, 
  onSave,
  preselectedBiomarker,
  existingEntries,
}: { 
  isOpen: boolean
  onClose: () => void
  onSave: (entry: LabEntry, duplicateAction?: "replace" | "keep-both") => void
  preselectedBiomarker?: string
  existingEntries: LabEntry[]
}) {
  const [selectedBiomarker, setSelectedBiomarker] = useState(preselectedBiomarker || "")
  const [value, setValue] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState("")
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false)
  const [duplicateEntry, setDuplicateEntry] = useState<LabEntry | null>(null)

  useEffect(() => {
    if (preselectedBiomarker) {
      setSelectedBiomarker(preselectedBiomarker)
    }
  }, [preselectedBiomarker])

  const selectedDef = selectedBiomarker ? biomarkerDefinitions[selectedBiomarker] : null

  const handleSubmit = () => {
    if (!selectedBiomarker || !value || !date) return

    const numValue = parseFloat(value)
    if (isNaN(numValue)) return

    // Check for duplicate
    const existing = existingEntries.find(
      e => e.biomarkerId === selectedBiomarker && e.date === date
    )

    if (existing) {
      setDuplicateEntry(existing)
      setShowDuplicateWarning(true)
      return
    }

    onSave({
      biomarkerId: selectedBiomarker,
      value: numValue,
      date,
      notes: notes || undefined,
      source: "user",
    })

    // Reset form
    setSelectedBiomarker("")
    setValue("")
    setDate(new Date().toISOString().split("T")[0])
    setNotes("")
    onClose()
  }

  const handleDuplicateAction = (action: "replace" | "keep-both" | "cancel") => {
    if (action === "cancel") {
      setShowDuplicateWarning(false)
      setDuplicateEntry(null)
      return
    }

    const numValue = parseFloat(value)
    onSave({
      biomarkerId: selectedBiomarker,
      value: numValue,
      date,
      notes: notes || undefined,
      source: "user",
    }, action)

    setShowDuplicateWarning(false)
    setDuplicateEntry(null)
    setSelectedBiomarker("")
    setValue("")
    setDate(new Date().toISOString().split("T")[0])
    setNotes("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-card border border-border rounded-t-2xl sm:rounded-2xl m-0 sm:m-4 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {showDuplicateWarning ? (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Duplicate Entry</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              An entry for {selectedDef?.name} on {formatDate(date)} already exists with value {duplicateEntry?.value} {selectedDef?.unit}.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleDuplicateAction("replace")}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Replace existing entry
              </button>
              <button
                onClick={() => handleDuplicateAction("keep-both")}
                className="w-full py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                Keep both entries
              </button>
              <button
                onClick={() => handleDuplicateAction("cancel")}
                className="w-full py-3 rounded-xl text-muted-foreground font-medium hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Add Lab Entry</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Biomarker Select */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Biomarker
                </label>
                <select
                  value={selectedBiomarker}
                  onChange={(e) => setSelectedBiomarker(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                >
                  <option value="">Select biomarker...</option>
                  {Object.entries(biomarkerDefinitions).map(([id, def]) => (
                    <option key={id} value={id}>{def.name}</option>
                  ))}
                </select>
              </div>

              {/* Value Input */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Value {selectedDef && `(${selectedDef.unit})`}
                </label>
                <input
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={selectedDef ? `Enter value in ${selectedDef.unit}` : "Enter value"}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
                {selectedDef && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Clinical range: {selectedDef.clinicalRange.min}-{selectedDef.clinicalRange.max} {selectedDef.unit}
                  </p>
                )}
              </div>

              {/* Date Input */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Notes Input */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this result..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedBiomarker || !value || !date}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// PDF Upload Modal with AI Processing
function PdfUploadModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  existingEntries,
}: { 
  isOpen: boolean
  onClose: () => void
  onConfirm: (entries: LabEntry[], duplicateActions: Record<string, "replace" | "keep-both">) => void
  existingEntries: LabEntry[]
}) {
  const [step, setStep] = useState<"upload" | "processing" | "review">("upload")
  const [fileName, setFileName] = useState("")
  const [processingMessage, setProcessingMessage] = useState("")
  const [extractedEntries, setExtractedEntries] = useState<LabEntry[]>([])
  const [editingEntry, setEditingEntry] = useState<number | null>(null)
  const [duplicateActions, setDuplicateActions] = useState<Record<string, "replace" | "keep-both">>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetModal = () => {
    setStep("upload")
    setFileName("")
    setProcessingMessage("")
    setExtractedEntries([])
    setEditingEntry(null)
    setDuplicateActions({})
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type === "application/pdf") {
      setFileName(file.name)
    }
  }

  const processWithAI = async () => {
    setStep("processing")
    
    const messages = [
      "Extracting markers...",
      "Identifying ranges...",
      "Analyzing patterns...",
      "Generating insights...",
    ]

    for (const msg of messages) {
      setProcessingMessage(msg)
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // Simulate extracted data (mock)
    const mockExtracted: LabEntry[] = [
      { biomarkerId: "glucose", value: 95, date: new Date().toISOString().split("T")[0], source: "ai" },
      { biomarkerId: "hdl", value: 52, date: new Date().toISOString().split("T")[0], source: "ai" },
      { biomarkerId: "vitamin-d", value: 38, date: new Date().toISOString().split("T")[0], source: "ai" },
      { biomarkerId: "b12", value: 420, date: new Date().toISOString().split("T")[0], source: "ai" },
    ]

    setExtractedEntries(mockExtracted)
    setStep("review")
  }

  const updateEntry = (index: number, field: keyof LabEntry, value: string | number) => {
    setExtractedEntries(prev => {
      const updated = [...prev]
      if (field === "value") {
        updated[index] = { ...updated[index], [field]: parseFloat(value as string) || 0 }
      } else {
        updated[index] = { ...updated[index], [field]: value }
      }
      return updated
    })
  }

  const removeEntry = (index: number) => {
    setExtractedEntries(prev => prev.filter((_, i) => i !== index))
  }

  const handleConfirm = () => {
    // Check for duplicates and set default actions
    const actions: Record<string, "replace" | "keep-both"> = {}
    extractedEntries.forEach(entry => {
      const key = `${entry.biomarkerId}-${entry.date}`
      const existing = existingEntries.find(
        e => e.biomarkerId === entry.biomarkerId && e.date === entry.date
      )
      if (existing && !duplicateActions[key]) {
        actions[key] = "keep-both"
      }
    })

    onConfirm(extractedEntries, { ...duplicateActions, ...actions })
    resetModal()
    onClose()
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-t-2xl sm:rounded-2xl m-0 sm:m-4 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="p-6">
          {step === "upload" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Upload Lab Report</h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 hover:bg-secondary/20 transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-medium text-foreground mb-1">
                  {fileName || "Drop your PDF here or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF lab reports
                </p>
              </div>

              {fileName && (
                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground flex-1 truncate">{fileName}</span>
                  <span className="text-xs text-emerald-400">Ready to process</span>
                </div>
              )}

              <button
                onClick={processWithAI}
                disabled={!fileName}
                className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Process with AI
              </button>
            </>
          )}

          {step === "processing" && (
            <div className="py-12 text-center">
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-sm font-medium text-foreground">{processingMessage}</p>
            </div>
          )}

          {step === "review" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Review & Confirm</h2>
                    <p className="text-xs text-muted-foreground">AI extracted {extractedEntries.length} biomarkers</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-400">
                    Please review the extracted values before confirming. You can edit or remove any incorrect entries.
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                {extractedEntries.map((entry, idx) => {
                  const def = biomarkerDefinitions[entry.biomarkerId]
                  if (!def) return null

                  const isDuplicate = existingEntries.some(
                    e => e.biomarkerId === entry.biomarkerId && e.date === entry.date
                  )

                  return (
                    <div key={idx} className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{def.name}</span>
                          <SourceBadge source="ai" />
                          {isDuplicate && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 uppercase tracking-wider">
                              Duplicate
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeEntry(idx)}
                          className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        </button>
                      </div>
                      
                      {editingEntry === idx ? (
                        <div className="space-y-2">
                          <input
                            type="number"
                            step="any"
                            value={entry.value}
                            onChange={(e) => updateEntry(idx, "value", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50"
                          />
                          <input
                            type="date"
                            value={entry.date}
                            onChange={(e) => updateEntry(idx, "date", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 text-sm text-foreground focus:outline-none focus:border-primary/50"
                          />
                          <button
                            onClick={() => setEditingEntry(null)}
                            className="text-xs text-primary font-medium"
                          >
                            Done editing
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-foreground tabular-nums">{entry.value}</span>
                            <span className="text-sm text-muted-foreground ml-1">{def.unit}</span>
                            <span className="text-xs text-muted-foreground ml-2">• {formatDate(entry.date)}</span>
                          </div>
                          <button
                            onClick={() => setEditingEntry(idx)}
                            className="text-xs text-primary font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      )}

                      {isDuplicate && (
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <p className="text-xs text-muted-foreground mb-2">Duplicate found. Choose action:</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setDuplicateActions(prev => ({ ...prev, [`${entry.biomarkerId}-${entry.date}`]: "replace" }))}
                              className={cn(
                                "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                duplicateActions[`${entry.biomarkerId}-${entry.date}`] === "replace"
                                  ? "bg-primary/20 text-primary border border-primary/30"
                                  : "bg-secondary/50 text-muted-foreground border border-border/30 hover:text-foreground"
                              )}
                            >
                              Replace
                            </button>
                            <button
                              onClick={() => setDuplicateActions(prev => ({ ...prev, [`${entry.biomarkerId}-${entry.date}`]: "keep-both" }))}
                              className={cn(
                                "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                duplicateActions[`${entry.biomarkerId}-${entry.date}`] === "keep-both" || !duplicateActions[`${entry.biomarkerId}-${entry.date}`]
                                  ? "bg-primary/20 text-primary border border-primary/30"
                                  : "bg-secondary/50 text-muted-foreground border border-border/30 hover:text-foreground"
                              )}
                            >
                              Keep Both
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {extractedEntries.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No entries to add</p>
                </div>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirm & Add to Labs
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Toast notification component
function Toast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/90 text-white shadow-lg">
        <Check className="w-4 h-4" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState({ onAddLabs, onUploadPdf }: { onAddLabs: () => void; onUploadPdf: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <FlaskConical className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-2">No labs added yet</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        Start tracking your biomarkers to get personalized insights about your health.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={onAddLabs}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Labs
        </button>
        <button
          onClick={onUploadPdf}
          className="flex-1 py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload PDF
        </button>
      </div>
    </div>
  )
}

// Main Labs Page Component
export function LabsPage() {
  const { targetBiomarkerId, clearTargetBiomarker } = useNav()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<BiomarkerCategory | "all">("all")
  const [selectedStatus, setSelectedStatus] = useState<BiomarkerStatus | "all">("all")
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showAllInsights, setShowAllInsights] = useState(false)
  const [highlightedBiomarkerId, setHighlightedBiomarkerId] = useState<string | null>(null)
  
  // Modal states
  const [showAddLabsModal, setShowAddLabsModal] = useState(false)
  const [showManualEntryModal, setShowManualEntryModal] = useState(false)
  const [showPdfUploadModal, setShowPdfUploadModal] = useState(false)
  const [preselectedBiomarker, setPreselectedBiomarker] = useState<string>()
  
  // Data state
  const [userEntries, setUserEntries] = useState<LabEntry[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Toast state
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  // Refs for scrolling
  const biomarkersGridRef = useRef<HTMLDivElement>(null)
  const biomarkerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LABS_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUserEntries(parsed)
      } catch (e) {
        console.error("Failed to parse saved labs data")
      }
    }
    setIsLoaded(true)
  }, [])

  // Scroll to top when Labs page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Handle scrolling to target biomarker from navigation
  useEffect(() => {
    if (targetBiomarkerId && isLoaded) {
      // Small delay to ensure DOM is ready and scroll to top completed
      const timer = setTimeout(() => {
        const element = biomarkerRefs.current[targetBiomarkerId]
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
          setHighlightedBiomarkerId(targetBiomarkerId)
          // Clear highlight after animation
          setTimeout(() => setHighlightedBiomarkerId(null), 2500)
        }
        clearTargetBiomarker()
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [targetBiomarkerId, isLoaded, clearTargetBiomarker])

  // Save to localStorage when userEntries changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LABS_STORAGE_KEY, JSON.stringify(userEntries))
    }
  }, [userEntries, isLoaded])

  // Combine demo and user entries
  const allEntries = useMemo(() => {
    // If user has entries for a biomarker, use those; otherwise use demo
    const userBiomarkerIds = new Set(userEntries.map(e => e.biomarkerId))
    const demoEntriesToUse = demoBiomarkers.filter(d => !userBiomarkerIds.has(d.biomarkerId))
    return [...demoEntriesToUse, ...userEntries]
  }, [userEntries])

  // Build biomarkers from entries
  const biomarkers = useMemo(() => {
    const biomarkerIds = new Set(allEntries.map(e => e.biomarkerId))
    return Array.from(biomarkerIds)
      .map(id => buildBiomarkerFromEntries(id, allEntries))
      .filter((b): b is Biomarker => b !== null)
  }, [allEntries])

  // Check if user has any data
  const hasUserData = userEntries.length > 0

  // Calculate Labs Intelligence Score
  const labsScore = useMemo(() => {
    if (biomarkers.length === 0) return 0
    const scores = biomarkers.map(b => statusConfig[getBiomarkerStatus(b.value, b.clinicalRange, b.optimalRange)].score)
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }, [biomarkers])

  // Count biomarkers by status
  const statusCounts = useMemo(() => {
    const counts: Record<BiomarkerStatus, number> = {
      optimal: 0,
      watch: 0,
      attention: 0,
      "out-of-range": 0,
    }
    biomarkers.forEach(b => {
      counts[getBiomarkerStatus(b.value, b.clinicalRange, b.optimalRange)]++
    })
    return counts
  }, [biomarkers])

  // Connected insights
  const connectedInsights = useMemo(() => generateConnectedInsights(biomarkers), [biomarkers])

  // Get latest lab date
  const latestLabDate = useMemo(() => {
    if (allEntries.length === 0) return "No data"
    const dates = allEntries.map(e => new Date(e.date).getTime())
    const latest = new Date(Math.max(...dates))
    return latest.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }, [allEntries])

  // Filter and sort biomarkers
  const filteredBiomarkers = useMemo(() => {
    let filtered = biomarkers

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(b => {
        const status = getBiomarkerStatus(b.value, b.clinicalRange, b.optimalRange)
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
      filtered = filtered.filter(b => getBiomarkerStatus(b.value, b.clinicalRange, b.optimalRange) === selectedStatus)
    }

    // Sort by priority
    filtered.sort((a, b) => {
      const statusA = getBiomarkerStatus(a.value, a.clinicalRange, a.optimalRange)
      const statusB = getBiomarkerStatus(b.value, b.clinicalRange, b.optimalRange)
      return statusPriority[statusA] - statusPriority[statusB]
    })

    return filtered
  }, [biomarkers, searchQuery, selectedCategory, selectedStatus])

  // Handlers
  const showSuccessToast = useCallback((message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }, [])

  const handleSaveEntry = useCallback((entry: LabEntry, duplicateAction?: "replace" | "keep-both") => {
    setUserEntries(prev => {
      if (duplicateAction === "replace") {
        // Remove existing entry with same biomarker and date
        const filtered = prev.filter(
          e => !(e.biomarkerId === entry.biomarkerId && e.date === entry.date)
        )
        return [...filtered, entry]
      }
      return [...prev, entry]
    })
    showSuccessToast("Lab updated")
    
    // Scroll to biomarkers grid
    setTimeout(() => {
      biomarkersGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [showSuccessToast])

  const handlePdfConfirm = useCallback((entries: LabEntry[], duplicateActions: Record<string, "replace" | "keep-both">) => {
    setUserEntries(prev => {
      let updated = [...prev]
      
      entries.forEach(entry => {
        const key = `${entry.biomarkerId}-${entry.date}`
        const action = duplicateActions[key]
        
        if (action === "replace") {
          updated = updated.filter(
            e => !(e.biomarkerId === entry.biomarkerId && e.date === entry.date)
          )
        }
        updated.push(entry)
      })
      
      return updated
    })
    showSuccessToast(`${entries.length} labs added`)
    
    // Scroll to biomarkers grid
    setTimeout(() => {
      biomarkersGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [showSuccessToast])

  const handleQuickAdd = useCallback((biomarkerId: string) => {
    setPreselectedBiomarker(biomarkerId)
    setShowManualEntryModal(true)
  }, [])

  const handleResetLabs = useCallback(() => {
    if (confirm("Are you sure you want to reset all lab data? This will clear your entries and restore demo data.")) {
      setUserEntries([])
      localStorage.removeItem(LABS_STORAGE_KEY)
      showSuccessToast("Labs reset to demo data")
    }
  }, [showSuccessToast])

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

  // Show empty state if no data at all
  if (isLoaded && biomarkers.length === 0 && !hasUserData) {
    return (
      <>
        <EmptyState 
          onAddLabs={() => setShowManualEntryModal(true)} 
          onUploadPdf={() => setShowPdfUploadModal(true)} 
        />
        <ManualEntryModal
          isOpen={showManualEntryModal}
          onClose={() => {
            setShowManualEntryModal(false)
            setPreselectedBiomarker(undefined)
          }}
          onSave={handleSaveEntry}
          preselectedBiomarker={preselectedBiomarker}
          existingEntries={allEntries}
        />
        <PdfUploadModal
          isOpen={showPdfUploadModal}
          onClose={() => setShowPdfUploadModal(false)}
          onConfirm={handlePdfConfirm}
          existingEntries={allEntries}
        />
      </>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Add Labs CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">Track Your Labs</h3>
          <p className="text-xs text-muted-foreground mt-1">Add new lab results to see updated insights and trends</p>
        </div>
        <button
          onClick={() => setShowAddLabsModal(true)}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
        >
          <Plus className="w-4 h-4" />
          Add Labs
        </button>
      </div>

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

          {/* Stats Grid - Stack on mobile */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Last Lab</span>
              <span className="text-sm font-semibold text-foreground">{latestLabDate}</span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/30 text-center">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest block mb-1">Reviewed</span>
              <span className="text-sm font-semibold text-primary">{biomarkers.length} markers</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[11px] font-semibold text-emerald-400/80 uppercase tracking-widest block mb-1">Optimal</span>
              <span className="text-sm font-semibold text-emerald-400">{statusCounts.optimal}</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[11px] font-semibold text-amber-400/80 uppercase tracking-widest block mb-1">Watch</span>
              <span className="text-sm font-semibold text-amber-400">{statusCounts.watch}</span>
            </div>
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
              <span className="text-[11px] font-semibold text-orange-400/80 uppercase tracking-widest block mb-1">Attention</span>
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
                {labsScore >= 85 
                  ? "Your biological profile appears stable with most markers in optimal range. Continue your current health practices."
                  : labsScore >= 70
                  ? "Your biological profile appears stable, with a few early signals that may be influencing recovery and cardiometabolic efficiency."
                  : "Some biomarkers need attention. Focus on the highlighted areas to improve your overall health score."
                }
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
      <div ref={biomarkersGridRef} className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {filteredBiomarkers.map(biomarker => (
          <BiomarkerCard 
            key={biomarker.id} 
            biomarker={biomarker}
            onClick={() => setSelectedBiomarker(biomarker)}
            onQuickAdd={() => handleQuickAdd(biomarker.id)}
            isHighlighted={highlightedBiomarkerId === biomarker.id}
            cardRef={(el) => { biomarkerRefs.current[biomarker.id] = el }}
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
      {connectedInsights.length > 0 && (
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
      )}

      {/* Reset Labs Option */}
      {hasUserData && (
        <div className="flex justify-center">
          <button
            onClick={handleResetLabs}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/30 border border-border/30 hover:border-border/50 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Labs
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground/70 text-center px-4 leading-relaxed">
        Meridian provides AI-generated wellness insights based on user-entered or uploaded data. It is not a medical diagnosis and does not replace professional medical advice. Always review lab results with a licensed healthcare provider.
      </p>

      {/* Modals */}
      <AddLabsModal
        isOpen={showAddLabsModal}
        onClose={() => setShowAddLabsModal(false)}
        onManualAdd={() => {
          setShowAddLabsModal(false)
          setShowManualEntryModal(true)
        }}
        onPdfUpload={() => {
          setShowAddLabsModal(false)
          setShowPdfUploadModal(true)
        }}
      />

      <ManualEntryModal
        isOpen={showManualEntryModal}
        onClose={() => {
          setShowManualEntryModal(false)
          setPreselectedBiomarker(undefined)
        }}
        onSave={handleSaveEntry}
        preselectedBiomarker={preselectedBiomarker}
        existingEntries={allEntries}
      />

      <PdfUploadModal
        isOpen={showPdfUploadModal}
        onClose={() => setShowPdfUploadModal(false)}
        onConfirm={handlePdfConfirm}
        existingEntries={allEntries}
      />

      {/* Detail Modal */}
      {selectedBiomarker && (
        <BiomarkerDetailModal 
          biomarker={selectedBiomarker}
          onClose={() => setSelectedBiomarker(null)}
        />
      )}

      {/* Toast */}
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  )
}
