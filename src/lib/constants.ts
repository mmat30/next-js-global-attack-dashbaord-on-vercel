import type { AttackType, SeverityLevel, ThreatLevel } from "./types"
import {
  Shield,
  Activity,
  Globe,
  AlertTriangle,
  BarChart3,
  type LucideIcon,
} from "lucide-react"

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: "text-red-500 bg-red-500/10 border-red-500/20",
  high: "text-orange-500 bg-orange-500/10 border-orange-500/20",
  medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  low: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  info: "text-slate-400 bg-slate-400/10 border-slate-400/20",
}

export const THREAT_LEVEL_COLORS: Record<ThreatLevel, string> = {
  critical: "text-red-500",
  elevated: "text-orange-500",
  guarded: "text-yellow-500",
  low: "text-emerald-500",
}

export const ATTACK_TYPE_LABELS: Record<AttackType, string> = {
  ddos: "DDoS",
  "brute-force": "Brute Force",
  "sql-injection": "SQL Injection",
  xss: "XSS",
  phishing: "Phishing",
  ransomware: "Ransomware",
  "zero-day": "Zero-Day",
  "port-scan": "Port Scan",
  "man-in-the-middle": "MitM",
}

export const ATTACK_TYPE_COLORS: Record<AttackType, string> = {
  ddos: "hsl(var(--chart-1))",
  "brute-force": "hsl(var(--chart-2))",
  "sql-injection": "hsl(var(--chart-3))",
  xss: "hsl(var(--chart-4))",
  phishing: "hsl(var(--chart-5))",
  ransomware: "oklch(0.7 0.2 30)",
  "zero-day": "oklch(0.6 0.2 320)",
  "port-scan": "oklch(0.65 0.15 200)",
  "man-in-the-middle": "oklch(0.7 0.1 80)",
}

export interface NavItem {
  title: string
  icon: LucideIcon
  url: string
  isActive?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", icon: Activity, url: "/", isActive: true },
  { title: "Threat Map", icon: Globe, url: "#" },
  { title: "Incidents", icon: AlertTriangle, url: "#" },
  { title: "Analytics", icon: BarChart3, url: "#" },
  { title: "Defenses", icon: Shield, url: "#" },
]
