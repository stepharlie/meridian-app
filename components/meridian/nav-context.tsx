"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type NavSection = "home" | "explore" | "insights" | "methods" | "profile" | "sleep" | "activity" | "labs" | "body" | "hormones" | "method" | "action-plan"

interface NavContextType {
  activeSection: NavSection
  setActiveSection: (section: NavSection) => void
}

const NavContext = createContext<NavContextType | undefined>(undefined)

export function NavProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<NavSection>("home")

  return (
    <NavContext.Provider value={{ activeSection, setActiveSection }}>
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
