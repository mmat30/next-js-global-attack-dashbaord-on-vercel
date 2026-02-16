import { Suspense } from "react"
import { Shield, Zap, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/components/dashboard/stat-card"
import { ThreatLevelIndicator } from "@/components/dashboard/threat-level-indicator"
import { TopTargetedCountries } from "@/components/dashboard/top-targeted-countries"
import { GlobeFeedSection } from "@/components/dashboard/globe-feed-section"
import { AttackTypeBreakdown } from "@/components/dashboard/attack-type-breakdown"
import { AttackTimeline } from "@/components/dashboard/attack-timeline"
import {
  generateAttacks,
  generateThreatStatus,
  generateTopTargetedCountries,
  generateAttackTypeBreakdown,
  generateTimeline,
} from "@/lib/mock-data"

export default function DashboardPage() {
  const attacks = generateAttacks(50)
  const threatStatus = generateThreatStatus()
  const topCountries = generateTopTargetedCountries()
  const attackTypeBreakdown = generateAttackTypeBreakdown()
  const timeline = generateTimeline()

  return (
    <div className="grid gap-4">
      {/* Row 1: Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Attacks (24h)"
          value="12,847"
          icon={Zap}
          trend={{ value: 12.5, positive: false }}
          description="from yesterday"
        />
        <StatCard
          title="Blocked"
          value="9,213"
          icon={Shield}
          trend={{ value: 8.2, positive: true }}
          description="block rate 71.7%"
        />
        <StatCard
          title="Active Threats"
          value={threatStatus.activeIncidents}
          icon={AlertTriangle}
          description="requiring attention"
        />
        <ThreatLevelIndicator status={threatStatus} />
      </div>

      {/* Row 2: Globe + Live Feed */}
      <GlobeFeedSection initialAttacks={attacks.slice(0, 20)} />

      {/* Row 3: Timeline + Breakdown + Countries */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="col-span-1 h-[300px] rounded-xl lg:col-span-2" />}>
          <AttackTimeline data={timeline} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[300px] rounded-xl" />}>
          <AttackTypeBreakdown data={attackTypeBreakdown} />
        </Suspense>
        <TopTargetedCountries countries={topCountries} />
      </div>
    </div>
  )
}
