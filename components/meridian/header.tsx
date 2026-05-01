"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, Home, BarChart3, Beaker, User, X, Moon, Activity, FlaskConical, Heart, ListTodo } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNav, NavSection } from "./nav-context"

interface NavItem {
  id: NavSection
  icon: typeof Home
  label: string
}

// Main navigation items - unified across desktop and mobile
const mainNavItems: NavItem[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "labs", icon: FlaskConical, label: "Labs" },
  { id: "insights", icon: BarChart3, label: "Insights" },
  { id: "methods", icon: Beaker, label: "Method" },
  { id: "profile", icon: User, label: "Profile" },
]

// Sidebar additional sections (secondary navigation)
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
      { id: "hormones", icon: Heart, label: "Hormones" },
      { id: "action-plan", icon: ListTodo, label: "Action Plan" },
    ]
  },
]

export function MeridianHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const { activeSection, setActiveSection, navigateToLabs } = useNav()
  
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          
          // Compact mode after 30px
          setIsCompact(currentScrollY > 30)
          
          // Hide/show based on scroll direction after 80px
          if (currentScrollY > 80) {
            if (currentScrollY > lastScrollY.current) {
              // Scrolling down
              setIsHidden(true)
            } else {
              // Scrolling up
              setIsHidden(false)
            }
          } else {
            setIsHidden(false)
          }
          
          lastScrollY.current = currentScrollY
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (sectionId: NavSection) => {
    // Scroll to top first for smooth transition
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (sectionId === "labs") {
      navigateToLabs()
    } else {
      setActiveSection(sectionId)
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header 
        className={cn(
          "sticky top-0 z-50 glass border-b border-border/50",
          isCompact && "compact"
        )}
        style={{
          transition: 'transform 0.38s cubic-bezier(.22,1,.36,1), padding 0.38s cubic-bezier(.22,1,.36,1)',
          transform: isHidden ? 'translateY(-100%)' : 'translateY(0)'
        }}
      >
        <div 
          className="flex items-center justify-between px-4 lg:px-6"
          style={{
            transition: 'padding 0.38s cubic-bezier(.22,1,.36,1)',
            paddingTop: isCompact ? '8px' : '12px',
            paddingBottom: isCompact ? '8px' : '12px'
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-[18px] flex-shrink-0"
              style={{
                background: 'linear-gradient(145deg, rgba(45,212,191,0.16), rgba(103,232,249,0.08))',
                border: '1px solid rgba(103,232,249,0.20)',
                boxShadow: '0 0 24px rgba(45,212,191,0.12), inset 0 1px 0 rgba(255,255,255,0.08)'
              }}>
              <span style={{
                fontFamily: "'Fraunces', serif",
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 0.85,
                letterSpacing: '-0.06em',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #67E8F9 40%, #2DD4BF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transform: 'translateY(-1px)',
                display: 'block'
              }}>M</span>
            </div>
            <div>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 700, letterSpacing: '-0.04em', color: '#EAFBF7' }}>
                Meridian
              </span>
              <span 
                className="hidden sm:block" 
                style={{ 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  letterSpacing: '0.12em', 
                  textTransform: 'uppercase', 
                  color: '#5F8E85', 
                  marginTop: '1px',
                  transition: 'opacity 0.38s cubic-bezier(.22,1,.36,1), max-height 0.38s cubic-bezier(.22,1,.36,1)',
                  opacity: isCompact ? 0 : 1,
                  maxHeight: isCompact ? 0 : '20px',
                  overflow: 'hidden'
                }}
              >
                Health Intelligence
              </span>
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
                <div className="flex items-center justify-center w-10 h-10 rounded-[18px] flex-shrink-0"
                  style={{
                    background: 'linear-gradient(145deg, rgba(45,212,191,0.16), rgba(103,232,249,0.08))',
                    border: '1px solid rgba(103,232,249,0.20)',
                    boxShadow: '0 0 24px rgba(45,212,191,0.12), inset 0 1px 0 rgba(255,255,255,0.08)'
                  }}>
                  <span style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: '28px',
                    fontWeight: 700,
                    lineHeight: 0.85,
                    letterSpacing: '-0.06em',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #67E8F9 40%, #2DD4BF 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transform: 'translateY(-1px)',
                    display: 'block'
                  }}>M</span>
                </div>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: 700, letterSpacing: '-0.04em', color: '#EAFBF7' }}>Meridian</span>
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
