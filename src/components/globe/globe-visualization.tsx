"use client"

import { useRef } from "react"
import { useGlobe } from "@/hooks/use-globe"

interface Marker {
  location: [number, number]
  size: number
}

interface GlobeVisualizationProps {
  markers: Marker[]
}

export function GlobeVisualization({ markers }: GlobeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useGlobe(canvasRef, markers)

  return (
    <div className="relative flex h-full w-full items-center justify-center p-4">
      <div className="relative aspect-square w-full max-w-[500px]">
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ contain: "layout paint size" }}
        />
      </div>
      <div className="absolute bottom-3 left-3 text-xs text-muted-foreground">
        <span className="mr-3 inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Source
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
          Target
        </span>
      </div>
    </div>
  )
}
