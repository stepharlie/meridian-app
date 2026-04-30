"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"

export type NavSection = "home" | "explore" | "insights" | "methods" | "profile" | "sleep" | "activity" | "labs" | "body" | "hormones" | "method" | "action-plan"

interface NavContextType {
  activeSection: NavSection
  setActiveSection: (section: NavSection) => void
  targetBiomarkerId: string | null
  navigateToLabs: (biomarkerId?: string) => void
  clearTargetBiomarker: () => void
}

const NavContext = createContext<NavContextType | undefined>(undefined)

export function NavProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSectionState] = useState<NavSection>("home")
  const [targetBiomarkerId, setTargetBiomarkerId] = useState<string | null>(null)

  // Wrap setActiveSection to always scroll to top
  const setActiveSection = useCallback((section: NavSection) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setActiveSectionState(section)
  }, [])

  const navigateToLabs = useCallback((biomarkerId?: string) => {
    // Set target biomarker if provided
    if (biomarkerId) {
      setTargetBiomarkerId(biomarkerId)
    }
    
    // Navigate to labs (setActiveSection handles scroll)
    setActiveSectionState("labs")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const clearTargetBiomarker = useCallback(() => {
    setTargetBiomarkerId(null)
  }, [])

  return (
    <NavContext.Provider value={{ 
      activeSection, 
      setActiveSection, 
      targetBiomarkerId, 
      navigateToLabs,
      clearTargetBiomarker 
    }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  const context = useContext(NavContext)
  if (context === undefined) {
    throw new Error("useNav must be used within a NavProvider")
  }
  return context
}
