"use client"

import { Home, BarChart3, Beaker, User, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNav, NavSection } from "./nav-context"

interface BottomNavItem {
  id: NavSection
  icon: typeof Home
  label: string
}

const navItems: BottomNavItem[] = [
  { id: "home", icon: Home, label: "Home" },
  { id: "labs", icon: FlaskConical, label: "Labs" },
  { id: "insights", icon: BarChart3, label: "Insights" },
  { id: "methods", icon: Beaker, label: "Method" },
  { id: "profile", icon: User, label: "Profile" },
]

export function BottomNav() {
  const { activeSection, setActiveSection, navigateToLabs } = useNav()

  const handleNavClick = (id: NavSection) => {
    // Scroll to top first for smooth transition
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (id === "labs") {
      navigateToLabs()
    } else {
      setActiveSection(id)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden glass border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl min-w-[60px] min-h-[56px] transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              {isActive && (
                <span className="absolute inset-0 bg-primary/10 rounded-xl" />
              )}
              <item.icon className={cn(
                "w-5 h-5 relative z-10 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[11px] font-medium relative z-10",
                isActive && "font-semibold"
              )}>{item.label}</span>
              {isActive && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
