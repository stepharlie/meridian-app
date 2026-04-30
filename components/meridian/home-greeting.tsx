"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Sunset, CloudMoon } from "lucide-react"

interface TimeGreeting {
  greeting: string
  icon: typeof Sun
  contextLine: string
}

function getTimeBasedGreeting(): TimeGreeting {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return { 
      greeting: "Good morning", 
      icon: Sun, 
      contextLine: "Your body is primed for recovery and energy today."
    }
  } else if (hour >= 12 && hour < 18) {
    return { 
      greeting: "Good afternoon", 
      icon: Sunset, 
      contextLine: "Mid-day is a good time to check in on your energy levels."
    }
  } else if (hour >= 18 && hour < 22) {
    return { 
      greeting: "Good evening", 
      icon: CloudMoon, 
      contextLine: "You may benefit from winding down soon to support recovery."
    }
  } else {
    return { 
      greeting: "Good night", 
      icon: Moon, 
      contextLine: "Rest is your most powerful recovery tool right now."
    }
  }
}

// Default greeting used for SSR to avoid hydration mismatch
const defaultGreeting: TimeGreeting = { 
  greeting: "Good morning", 
  icon: Sun, 
  contextLine: "Your body is primed for recovery and energy today."
}

export function HomeGreeting({ userName }: { userName?: string }) {
  const [timeGreeting, setTimeGreeting] = useState(defaultGreeting)
  const [mounted, setMounted] = useState(false)

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
    <section className="px-4 pt-6 pb-2 lg:px-6">
      {/* Greeting */}
      <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 text-balance flex items-center gap-3">
        <GreetingIcon className="w-7 h-7 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
        <span>{mounted ? timeGreeting.greeting : defaultGreeting.greeting}{userName ? `, ${userName}` : ""}</span>
      </h1>
      
      {/* Contextual subtitle */}
      <p className="text-sm text-muted-foreground leading-relaxed pl-10 sm:pl-11">
        {mounted ? timeGreeting.contextLine : defaultGreeting.contextLine}
      </p>
    </section>
  )
}
