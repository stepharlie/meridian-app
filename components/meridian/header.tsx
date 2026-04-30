"use client"

import { useState } from "react"
import { Menu, Home, Compass, BarChart3, Beaker, User, X, Moon, Activity, FlaskConical, Heart, ListTodo } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNav, NavSection } from "./nav-context"

interface NavItem {
  id: NavSection
  icon: typeof Home
  label: string
}

// Main navigation items (bottom nav)
const mainNavItems: NavItem[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "explore", icon: Compass, label: "Explore" },
  { id: "insights", icon: BarChart3, label: "Insights" },
  { id: "methods", icon: Beaker, label: "Methods" },
  { id: "profile", icon: User, label: "Profile" },
]

// Sidebar additional sections
const sidebarSections: { label: string; items: NavItem[] }[] = [
  { 
    label: "WEARABLES", 
    items: [
      { id: "sleep", icon: Moon, label: "Sleep" },
      { id: "activity", icon: Activity, label: "Activity" },
      { id: "body", icon: User, label: "Body" },
    ]
  },
  { 
    label: "HEALTH DATA", 
    items: [
      { id: "labs", icon: FlaskConical, label: "Labs" },
      { id: "hormones", icon: Heart, label: "Hormones" },
      { id: "action-plan", icon: ListTodo, label: "Action Plan" },
    ]
  },
]

export function MeridianHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { activeSection, setActiveSection } = useNav()

  const handleNavClick = (sectionId: NavSection) => {
    setActiveSection(sectionId)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-5 h-5 text-primary"
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight text-foreground">Meridian</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2 uppercase tracking-widest">Health Intelligence</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px]",
                  activeSection === item.id
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-lg hover:bg-secondary/50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border p-4 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20">
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    className="w-5 h-5 text-primary"
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-lg font-semibold">Meridian</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-11 h-11 rounded-lg hover:bg-sidebar-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Navigation */}
            <div className="mb-6">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">
                MAIN
              </span>
              <div className="space-y-1">
                {mainNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all min-h-[44px]",
                      activeSection === item.id
                        ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20" 
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {activeSection === item.id && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Sections */}
            {sidebarSections.map((section) => (
              <div key={section.label} className="mb-6">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 block">
                  {section.label}
                </span>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium transition-all min-h-[44px]",
                        activeSection === item.id
                          ? "bg-sidebar-primary/10 text-sidebar-primary border border-sidebar-primary/20" 
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      {activeSection === item.id && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
