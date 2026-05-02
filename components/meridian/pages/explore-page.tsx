"use client"

import { useState } from "react"
import { 
  Search, 
  TrendingUp, 
  Heart, 
  Moon, 
  Dumbbell, 
  Brain, 
  Leaf, 
  Zap,
  ChevronRight,
  Sparkles,
  Clock,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", label: "All" },
  { id: "recovery", label: "Recovery" },
  { id: "nutrition", label: "Nutrition" },
  { id: "sleep", label: "Sleep" },
  { id: "fitness", label: "Fitness" },
  { id: "mental", label: "Mental" },
]

const featuredTopics = [
  {
    id: 1,
    title: "Understanding Your HRV Patterns",
    description: "Learn how heart rate variability reflects your nervous system health",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    category: "recovery",
    readTime: "5 min",
    isNew: true,
  },
  {
    id: 2,
    title: "Optimizing Deep Sleep",
    description: "Science-backed strategies to increase your restorative sleep phases",
    icon: Moon,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    category: "sleep",
    readTime: "7 min",
    isNew: false,
  },
  {
    id: 3,
    title: "Zone 2 Training Benefits",
    description: "Why low-intensity cardio is the foundation of metabolic health",
    icon: Dumbbell,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    category: "fitness",
    readTime: "6 min",
    isNew: true,
  },
  {
    id: 4,
    title: "Stress Response & Cortisol",
    description: "Managing your body's stress hormone for better recovery",
    icon: Brain,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    category: "mental",
    readTime: "8 min",
    isNew: false,
  },
]

const quickReads = [
  {
    id: 1,
    title: "Morning Sunlight Protocol",
    icon: Zap,
    color: "text-amber-400",
    readTime: "2 min",
  },
  {
    id: 2,
    title: "Post-Workout Nutrition Window",
    icon: Leaf,
    color: "text-emerald-400",
    readTime: "3 min",
  },
  {
    id: 3,
    title: "Evening Wind-Down Routine",
    icon: Moon,
    color: "text-indigo-400",
    readTime: "2 min",
  },
]

const trendingSearches = [
  "HRV improvement",
  "Sleep optimization",
  "Protein timing",
  "Cold exposure",
  "Breath work",
]

export function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTopics = featuredTopics.filter(topic => 
    activeCategory === "all" || topic.category === activeCategory
  )

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search health topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full pl-12 pr-4 py-3.5 rounded-xl text-base",
            "bg-card border border-border/50",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
            "transition-all duration-200"
          )}
        />
      </div>

      {/* Trending Searches */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
          <TrendingUp className="w-3 h-3" /> Trending:
        </span>
        {trendingSearches.map((term) => (
          <button
            key={term}
            onClick={() => setSearchQuery(term)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors min-h-[32px]"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[44px]",
              "active:scale-95",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Featured Topics</h2>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredTopics.map((topic) => (
            <button
              key={topic.id}
              className={cn(
                "group p-4 rounded-xl text-left transition-all duration-200",
                "bg-card border hover:shadow-lg",
                "active:scale-[0.98]",
                topic.borderColor,
                "hover:border-opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200",
                  "group-hover:scale-110",
                  topic.bgColor
                )}>
                  <topic.icon className={cn("w-5 h-5", topic.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {topic.isNew && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-primary/20 text-primary">
                        New
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {topic.readTime}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {topic.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Reads */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Reads</h2>
        </div>
        
        <div className="space-y-2">
          {quickReads.map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl",
                "bg-card border border-border/50",
                "hover:border-primary/30 hover:bg-card/80",
                "active:scale-[0.99]",
                "transition-all duration-200"
              )}
            >
              <item.icon className={cn("w-5 h-5", item.color)} />
              <span className="flex-1 text-sm font-medium text-foreground text-left">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.readTime}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
