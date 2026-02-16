"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const GlobeVisualization = dynamic(
  () =>
    import("@/components/globe/globe-visualization").then(
      (m) => m.GlobeVisualization
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <Skeleton className="aspect-square w-3/4 rounded-full" />
      </div>
    ),
  }
)

interface Marker {
  location: [number, number]
  size: number
}

interface GlobeWrapperProps {
  markers: Marker[]
}

export function GlobeWrapper({ markers }: GlobeWrapperProps) {
  return <GlobeVisualization markers={markers} />
}
