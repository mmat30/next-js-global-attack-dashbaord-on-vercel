"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity } from "lucide-react"
import type { Attack } from "@/lib/types"
import { AttackFeedItem } from "./attack-feed-item"

interface AttackFeedProps {
  attacks: Attack[]
}

export function AttackFeed({ attacks }: AttackFeedProps) {

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Live Attack Feed
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[340px] px-4 pb-4">
          <div className="space-y-2">
            {attacks.map((attack, i) => (
              <AttackFeedItem
                key={attack.id}
                attack={attack}
                isNew={i === 0}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
