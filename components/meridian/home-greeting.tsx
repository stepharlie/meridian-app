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

  return (
    <section className="px-4 pt-6 pb-2 lg:px-6">
      <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.11em', textTransform: 'uppercase', color: '#2DD4BF', marginBottom: '12px' }}>
        {mounted ? timeGreeting.contextLine : defaultGreeting.contextLine}
      </div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: '6px', color: '#EAFBF7' }}>
        {mounted ? timeGreeting.greeting : defaultGreeting.greeting},{" "}
        <em style={{ fontStyle: 'normal', background: 'linear-gradient(135deg, #FFFFFF 0%, #67E8F9 44%, #2DD4BF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {userName || "Stephanie"}
        </em>
      </h1>
    </section>
  )
}
