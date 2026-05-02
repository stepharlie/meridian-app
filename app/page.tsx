"use client"

import { useEffect, useState } from "react"
import { MeridianHeader } from "@/components/meridian/header"
import { HomeGreeting } from "@/components/meridian/home-greeting"
import { HealthIntelligence } from "@/components/meridian/health-intelligence"
import { MeridianScore } from "@/components/meridian/meridian-score"
import { TodayStrategy } from "@/components/meridian/today-strategy"
import { TodayFlow } from "@/components/meridian/today-flow"
import { SystemWatchlist } from "@/components/meridian/system-watchlist"
import { BottomNav } from "@/components/meridian/bottom-nav"
import { NavProvider, useNav } from "@/components/meridian/nav-context"
import { ExplorePage } from "@/components/meridian/pages/explore-page"
import { InsightsPage } from "@/components/meridian/pages/insights-page"
import { MethodsPage } from "@/components/meridian/pages/methods-page"
import { ProfilePage } from "@/components/meridian/pages/profile-page"
import { LabsPage } from "@/components/meridian/pages/labs-page"
import { SleepPage } from "@/components/meridian/pages/sleep-page"
import { ActivityPage } from "@/components/meridian/pages/activity-page"
import { Moon, User, Heart, Beaker, ListTodo } from "lucide-react"

function SectionPlaceholder({ 
  title, 
  icon: Icon, 
  description 
}: { 
  title: string
  icon: typeof Moon
  description: string 
}) {
  return (
    <section className="px-4 py-8 lg:px-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-3">{title}</h1>
        <p className="text-muted-foreground max-w-md text-pretty">{description}</p>
        <div className="mt-8 flex gap-3">
          <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium min-h-[44px] hover:bg-primary/90 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-xl bg-secondary text-foreground font-medium min-h-[44px] hover:bg-secondary/80 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  const [ready, setReady] = useState(false)

  // Wait for full mount before showing — prevents score animation firing before visible
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      opacity: ready ? 1 : 0,
      transform: ready ? "translateY(0)" : "translateY(8px)",
      transition: "opacity 0.35s cubic-bezier(.22,1,.36,1), transform 0.35s cubic-bezier(.22,1,.36,1)"
    }}>
      <HomeGreeting />
      <HealthIntelligence />
      <MeridianScore
        score={62}
        recovery="Moderate"
        load="Manage"
        nextStep="Walk + protein"
      />
      <TodayStrategy />
      <TodayFlow />
      <SystemWatchlist />
    </div>
  )
}

function DashboardContent() {
  const { activeSection } = useNav()

  switch (activeSection) {
    case "home":
      return <HomePage />

    case "explore":
      return (
        <section className="px-4 py-6 lg:px-6">
          <h1 className="text-xl font-semibold text-foreground mb-6">Explore</h1>
          <ExplorePage />
        </section>
      )

    case "insights":
      return (
        <section className="px-4 py-6 lg:px-6">
          <h1 className="text-xl font-semibold text-foreground mb-6">Insights</h1>
          <InsightsPage />
        </section>
      )

    case "methods":
      return (
        <section className="px-4 py-6 lg:px-6">
          <h1 className="text-xl font-semibold text-foreground mb-6">Methods</h1>
          <MethodsPage />
        </section>
      )

    case "profile":
      return (
        <section className="px-4 py-6 lg:px-6">
          <h1 className="text-xl font-semibold text-foreground mb-6">Profile</h1>
          <ProfilePage />
        </section>
      )

    case "sleep":
      return (
        <section className="px-4 py-6 lg:px-6">
          <h1 className="text-xl font-semibold text-foreground mb-6">Sleep Analysis</h1>
          <SleepPage />
        </section>
      )

    case "activity":
      return (
        <section className="px-4 py-6 lg:px-6">
          <h1 className="text-xl font-semibold text-foreground mb-6">Activity</h1>
          <ActivityPage />
        </section>
      )

    case "labs":
      return (
        <section className="px-4 py-6 lg:px-6">
          <h1 className="text-xl font-semibold text-foreground mb-6">Labs</h1>
          <LabsPage />
        </section>
      )

    case "body":
      return (
        <SectionPlaceholder
          title="Body Composition"
          icon={User}
          description="Track your weight, body fat percentage, muscle mass, and other body metrics."
        />
      )

    case "hormones":
      return (
        <SectionPlaceholder
          title="Hormone Health"
          icon={Heart}
          description="Monitor your hormone levels and understand how they impact your energy, mood, and recovery."
        />
      )

    case "method":
      return (
        <SectionPlaceholder
          title="Method Adherence"
          icon={Beaker}
          description="Track your supplement stack, protocols, and health routines for optimal results."
        />
      )

    case "action-plan":
      return (
        <SectionPlaceholder
          title="Action Plan"
          icon={ListTodo}
          description="Your personalized daily actions and recommendations based on your health data."
        />
      )

    default:
      return null
  }
}

export default function MeridianDashboard() {
  return (
    <NavProvider>
      <div className="min-h-screen bg-background pb-28 lg:pb-8 gradient-mesh">
        <MeridianHeader />
        <main className="max-w-6xl mx-auto">
          <DashboardContent />
        </main>
        <BottomNav />
      </div>
    </NavProvider>
  )
}
