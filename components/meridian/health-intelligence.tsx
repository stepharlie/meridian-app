"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  ArrowRight, 
  FlaskConical, 
  Upload,
  Plus,
} from "lucide-react"
import { useNav } from "./nav-context"

type BiomarkerStatus = "optimal" | "watch" | "attention" | "out-of-range"

interface LabEntry {
  biomarkerId: string
  value: number
  date: string
  notes?: string
  source: "demo" | "user" | "ai"
}

const biomarkerDefinitions: Record<string, { 
  name: string
  unit: string
  clinicalRange: { min: number; max: number }
  optimalRange: { min: number; max: number }
  nextBestStep: string
}> = {
  glucose: { name: "Glucose", unit: "mg/dL", clinicalRange: { min: 70, max: 100 }, optimalRange: { min: 75, max: 90 }, nextBestStep: "Try having a short 10-minute walk after your largest meal today." },
  a1c: { name: "Hemoglobin A1c", unit: "%", clinicalRange: { min: 4.0, max: 5.7 }, optimalRange: { min: 4.5, max: 5.3 }, nextBestStep: "Your current lifestyle is supporting excellent long-term glucose control." },
  hdl: { name: "HDL Cholesterol", unit: "mg/dL", clinicalRange: { min: 40, max: 100 }, optimalRange: { min: 55, max: 80 }, nextBestStep: "Consider adding 2-3 servings of fatty fish or a quality omega-3 supplement this week." },
  triglycerides: { name: "Triglycerides", unit: "mg/dL", clinicalRange: { min: 0, max: 150 }, optimalRange: { min: 0, max: 100 }, nextBestStep: "Try swapping one refined carb serving for a fiber-rich alternative today." },
  tsh: { name: "TSH", unit: "mIU/L", clinicalRange: { min: 0.4, max: 4.0 }, optimalRange: { min: 1.0, max: 2.5 }, nextBestStep: "Continue prioritizing quality sleep and stress management." },
  "vitamin-d": { name: "Vitamin D", unit: "ng/mL", clinicalRange: { min: 20, max: 100 }, optimalRange: { min: 40, max: 60 }, nextBestStep: "Consider a Vitamin D3 supplement with K2 (2000-4000 IU daily) with a fat-containing meal." },
  b12: { name: "Vitamin B12", unit: "pg/mL", clinicalRange: { min: 200, max: 900 }, optimalRange: { min: 500, max: 800 }, nextBestStep: "Add more B12-rich foods like eggs, fish, or fortified foods this week." },
  alt: { name: "ALT", unit: "U/L", clinicalRange: { min: 7, max: 56 }, optimalRange: { min: 10, max: 30 }, nextBestStep: "Continue supporting your liver with adequate hydration and limiting processed foods." },
  ast: { name: "AST", unit: "U/L", clinicalRange: { min: 10, max: 40 }, optimalRange: { min: 10, max: 30 }, nextBestStep: "Keep balancing exercise intensity with recovery." },
}

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

function getBiomarkerStatus(value: number, clinicalRange: { min: number; max: number }, optimalRange: { min: number; max: number }): BiomarkerStatus {
  if (value < clinicalRange.min || value > clinicalRange.max) return "out-of-range"
  if (value >= optimalRange.min && value <= optimalRange.max) return "optimal"
  const optimalMid = (optimalRange.min + optimalRange.max) / 2
  const optimalSpan = optimalRange.max - optimalRange.min
  const distance = Math.abs(value - optimalMid)
  const normalizedDistance = distance / (optimalSpan / 2)
  if (normalizedDistance <= 1.5) return "watch"
  return "attention"
}

const statusPriority: Record<BiomarkerStatus, number> = {
  "out-of-range": 1, attention: 2, watch: 3, optimal: 4,
}

interface BiomarkerWithStatus {
  id: string; name: string; value: number; unit: string
  status: BiomarkerStatus; nextBestStep: string
}

export function HealthIntelligence() {
  const { navigateToLabs } = useNav()
  const [mounted, setMounted] = useState(false)
  const [userEntries, setUserEntries] = useState<LabEntry[]>([])

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LABS_STORAGE_KEY)
      if (saved) { try { setUserEntries(JSON.parse(saved)) } catch {} }
    }
  }, [])

  const allEntries = useMemo(() => [...demoBiomarkers, ...userEntries], [userEntries])

  const biomarkersWithStatus: BiomarkerWithStatus[] = useMemo(() => {
    const biomarkerMap = new Map<string, LabEntry>()
    allEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(entry => biomarkerMap.set(entry.biomarkerId, entry))
    const results: BiomarkerWithStatus[] = []
    biomarkerMap.forEach((entry, biomarkerId) => {
      const def = biomarkerDefinitions[biomarkerId]
      if (!def) return
      results.push({ id: biomarkerId, name: def.name, value: entry.value, unit: def.unit, status: getBiomarkerStatus(entry.value, def.clinicalRange, def.optimalRange), nextBestStep: def.nextBestStep })
    })
    return results.sort((a, b) => statusPriority[a.status] - statusPriority[b.status])
  }, [allEntries])

  const hasLabData = biomarkersWithStatus.length > 0
  const priorityBiomarkers = biomarkersWithStatus.filter(b => b.status !== "optimal")
  const optimalBiomarkers = biomarkersWithStatus.filter(b => b.status === "optimal")
  const nextBestStep = priorityBiomarkers.length > 0 ? priorityBiomarkers[0].nextBestStep : optimalBiomarkers.length > 0 ? "Continue your current health practices to maintain this excellent balance." : null

  if (!mounted) {
    return (
      <section className="px-4 py-4 lg:px-6">
        <div className="animate-pulse">
          <div className="h-20 bg-secondary/30 rounded-xl mb-4" />
          <div className="h-16 bg-secondary/30 rounded-xl mb-4" />
          <div className="h-12 bg-secondary/30 rounded-xl w-48" />
        </div>
      </section>
    )
  }

  if (!hasLabData) {
    return (
      <section className="px-4 py-4 lg:px-6">
        <div className="p-5 rounded-xl bg-card border border-border/50">
          <p className="text-base text-foreground leading-relaxed mb-4">
            Upload your latest bloodwork to unlock personalized insights about your health.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button onClick={() => navigateToLabs()} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium min-h-[44px] hover:bg-primary/90 transition-colors active:scale-95">
              <Plus className="w-4 h-4" />Add Labs
            </button>
            <button onClick={() => navigateToLabs()} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground text-sm font-medium min-h-[44px] hover:bg-secondary transition-colors active:scale-95">
              <Upload className="w-4 h-4" />Upload PDF
            </button>
          </div>
          <button onClick={() => navigateToLabs()} className="flex items-center gap-2 text-sm text-primary hover:underline font-medium">
            <FlaskConical className="w-4 h-4" />View full lab analysis<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-4 lg:px-6">

      {/* Primary Insight — decision-level intelligence */}
      <div className="mb-5" style={{ background: 'rgba(45,212,191,0.07)', border: '1px solid rgba(45,212,191,0.22)', borderLeft: '4px solid #2DD4BF', borderRadius: '16px', padding: '22px 24px' }}>
        <p style={{ fontSize: '16px', lineHeight: 1.65, marginBottom: '14px', color: '#EAFBF7', fontWeight: 600 }}>
          Your TSH is elevated and your HRV is suppressed this week — your nervous system is under load.
        </p>
        <p style={{ fontSize: '16px', lineHeight: 1.65, marginBottom: '14px', color: '#EAFBF7', fontWeight: 600 }}>
          <span style={{ fontWeight: 800, color: '#2DD4BF' }}>Today: </span>
          Walk 20 minutes and prioritize protein at breakfast.
        </p>
        <p style={{ fontSize: '15px', lineHeight: 1.65, marginBottom: '16px', color: '#9ACBC1', fontWeight: 500 }}>
          Avoid high intensity — your current state will likely extend recovery into the next 48 hours.
        </p>
        <p style={{ fontSize: '12px', fontWeight: 600, color: '#9ACBC1', borderTop: '1px solid rgba(103,232,249,0.10)', paddingTop: '12px' }}>
          Derived from your thyroid labs + Oura wearable data · Meridian interprets, you decide.
        </p>
      </div>

      {/* ONE BIG BUTTON */}
      <button
        onClick={() => {}}
        style={{ width: '100%', padding: '18px 24px', borderRadius: '18px', border: 'none', background: 'linear-gradient(135deg, #2DD4BF, #67E8F9)', color: '#061316', fontSize: '16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px', boxShadow: '0 0 32px rgba(45,212,191,0.25)', transition: 'all 0.22s cubic-bezier(.22,1,.36,1)', letterSpacing: '-0.01em' }}
        onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 48px rgba(45,212,191,0.4)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)' }}
        onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(45,212,191,0.25)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Start your 20-min walk now
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </button>

      {/* Next Step */}
      {nextBestStep && (
        <div className="mb-5" style={{ background: 'rgba(45,212,191,0.07)', border: '1px solid rgba(45,212,191,0.22)', borderLeft: '4px solid #2DD4BF', borderRadius: '16px', padding: '16px 20px' }}>
          <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#EAFBF7', fontWeight: 500 }}>
            <span style={{ fontWeight: 800, color: '#2DD4BF' }}>Next step: </span>
            {nextBestStep}
          </p>
        </div>
      )}

      {/* Labs CTA */}
      <button onClick={() => navigateToLabs()} className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-4 py-3 sm:px-0 sm:py-0 rounded-xl sm:rounded-none bg-primary/5 sm:bg-transparent border border-primary/10 sm:border-0 text-sm text-primary hover:bg-primary/10 sm:hover:bg-transparent sm:hover:underline font-medium transition-colors" style={{ fontSize: '14px' }}>
        <FlaskConical className="w-4 h-4" />
        View full lab analysis
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  )
}
