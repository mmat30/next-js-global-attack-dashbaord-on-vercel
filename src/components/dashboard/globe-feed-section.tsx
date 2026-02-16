"use client"

import { useMemo } from "react"
import { GlobeWrapper } from "@/components/globe/globe-wrapper"
import { AttackFeed } from "@/components/dashboard/attack-feed"
import { useAttacks } from "@/hooks/use-attacks"
import type { Attack } from "@/lib/types"

interface GlobeFeedSectionProps {
  initialAttacks: Attack[]
}

export function GlobeFeedSection({ initialAttacks }: GlobeFeedSectionProps) {
  const attacks = useAttacks(initialAttacks)

  const markers = useMemo(
    () =>
      attacks.flatMap((a) => [
        { location: [a.source.lat, a.source.lng] as [number, number], size: 0.05 },
        { location: [a.target.lat, a.target.lng] as [number, number], size: 0.03 },
      ]),
    [attacks]
  )

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="relative min-h-[400px] overflow-hidden rounded-xl border bg-card">
        <GlobeWrapper markers={markers} />
      </div>
      <AttackFeed attacks={attacks} />
    </div>
  )
}
