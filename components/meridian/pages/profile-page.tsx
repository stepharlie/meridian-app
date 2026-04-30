"use client"

import { 
  User,
  Settings,
  Bell,
  Shield,
  Smartphone,
  Watch,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Zap,
  Target,
  Calendar,
  Award
} from "lucide-react"
import { cn } from "@/lib/utils"

const userStats = [
  { label: "Days Active", value: "127" },
  { label: "Longest Streak", value: "21" },
  { label: "Methods Tracked", value: "8" },
  { label: "Insights Generated", value: "342" },
]

const connectedDevices = [
  {
    id: 1,
    name: "Apple Watch Series 9",
    icon: Watch,
    status: "connected",
    lastSync: "2 min ago",
  },
  {
    id: 2,
    name: "Oura Ring Gen 3",
    icon: Moon,
    status: "connected",
    lastSync: "5 min ago",
  },
  {
    id: 3,
    name: "iPhone 15 Pro",
    icon: Smartphone,
    status: "connected",
    lastSync: "Just now",
  },
]

const achievements = [
  { id: 1, name: "Early Bird", description: "7 days of morning routines", unlocked: true },
  { id: 2, name: "Consistent", description: "30 day method streak", unlocked: true },
  { id: 3, name: "Data Master", description: "Connected 3+ devices", unlocked: true },
  { id: 4, name: "Sleep Champion", description: "7+ hours avg for 30 days", unlocked: false },
]

const settingsItems = [
  { id: 1, label: "Notifications", icon: Bell, badge: null },
  { id: 2, label: "Privacy & Security", icon: Shield, badge: null },
  { id: 3, label: "Connected Apps", icon: Zap, badge: "3" },
  { id: 4, label: "Goals & Targets", icon: Target, badge: null },
  { id: 5, label: "Help & Support", icon: HelpCircle, badge: null },
]

export function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <User className="w-8 h-8 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">Demo User</h2>
          <p className="text-sm text-muted-foreground">Premium Member</p>
          <p className="text-xs text-primary mt-1">Member since March 2024</p>
        </div>
        <button className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {userStats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-card border border-border/50 text-center"
          >
            <p className="text-2xl font-semibold text-foreground tabular-nums">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Connected Devices */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Watch className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Connected Devices</h2>
        </div>
        
        <div className="space-y-2">
          {connectedDevices.map((device) => (
            <div
              key={device.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center">
                <device.icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground">{device.name}</h3>
                <p className="text-xs text-muted-foreground">Last sync: {device.lastSync}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Connected</span>
              </div>
            </div>
          ))}
        </div>
        
        <button className={cn(
          "w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-xl",
          "border border-dashed border-border/50",
          "text-sm font-medium text-muted-foreground",
          "hover:border-primary/30 hover:text-foreground",
          "transition-colors min-h-[48px]"
        )}>
          <Smartphone className="w-4 h-4" />
          Add New Device
        </button>
      </section>

      {/* Achievements */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "p-3 rounded-xl border text-center transition-all",
                achievement.unlocked 
                  ? "bg-card border-primary/20" 
                  : "bg-secondary/30 border-border/30 opacity-60"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center",
                achievement.unlocked ? "bg-primary/20" : "bg-secondary"
              )}>
                <Award className={cn(
                  "w-5 h-5",
                  achievement.unlocked ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <h3 className="text-xs font-semibold text-foreground">{achievement.name}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{achievement.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Settings Menu */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Settings</h2>
        </div>
        
        <div className="space-y-1">
          {settingsItems.map((item) => (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left",
                "hover:bg-secondary/50 active:scale-[0.99]",
                "transition-all duration-200 min-h-[52px]"
              )}
            >
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <button className={cn(
        "w-full flex items-center justify-center gap-2 p-4 rounded-xl",
        "border border-rose-500/20 text-rose-400",
        "hover:bg-rose-500/10 active:scale-[0.98]",
        "transition-all duration-200 min-h-[52px]"
      )}>
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground">
        Meridian v1.0.0
      </p>
    </div>
  )
}
