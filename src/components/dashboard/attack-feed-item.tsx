import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Attack } from "@/lib/types"
import { SEVERITY_COLORS, ATTACK_TYPE_LABELS } from "@/lib/constants"

interface AttackFeedItemProps {
  attack: Attack
  isNew?: boolean
}

export function AttackFeedItem({ attack, isNew }: AttackFeedItemProps) {
  const time = attack.timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 transition-colors",
        isNew && "animate-in fade-in slide-in-from-top-2 duration-300"
      )}
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("text-[10px] uppercase", SEVERITY_COLORS[attack.severity])}
          >
            {attack.severity}
          </Badge>
          <span className="text-sm font-medium">
            {ATTACK_TYPE_LABELS[attack.type]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {attack.source.city ?? attack.source.country} ({attack.source.countryCode})
          {" → "}
          {attack.target.city ?? attack.target.country} ({attack.target.countryCode})
        </p>
      </div>
      <span className="shrink-0 font-mono text-xs text-muted-foreground">
        {time}
      </span>
    </div>
  )
}
