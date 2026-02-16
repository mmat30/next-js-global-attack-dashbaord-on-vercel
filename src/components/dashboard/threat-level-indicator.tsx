import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ThreatStatus } from "@/lib/types"
import { THREAT_LEVEL_COLORS, ATTACK_TYPE_LABELS } from "@/lib/constants"

interface ThreatLevelIndicatorProps {
  status: ThreatStatus
}

export function ThreatLevelIndicator({ status }: ThreatLevelIndicatorProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Threat Level
        </CardTitle>
        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-2xl font-bold uppercase",
              THREAT_LEVEL_COLORS[status.level]
            )}
          >
            {status.level}
          </span>
          <Badge variant="outline" className="text-xs">
            {status.activeIncidents} active
          </Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {status.attacksPerMinute} attacks/min — Top:{" "}
          {ATTACK_TYPE_LABELS[status.topAttackType]}
        </p>
      </CardContent>
    </Card>
  )
}
