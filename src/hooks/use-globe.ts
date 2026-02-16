"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"
import { GLOBE_CONFIG } from "@/lib/globe-config"

interface Marker {
  location: [number, number]
  size: number
}

export function useGlobe(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  markers: Marker[]
) {
  const phiRef = useRef(0)
  const markersRef = useRef(markers)
  markersRef.current = markers

  const onRender = useCallback(
    (state: Record<string, number>) => {
      state.phi = phiRef.current
      phiRef.current += 0.003
    },
    []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const globe = createGlobe(canvas, {
      ...GLOBE_CONFIG,
      width: canvas.offsetWidth * 2,
      height: canvas.offsetHeight * 2,
      markers: markersRef.current,
      onRender,
    })

    return () => {
      globe.destroy()
    }
  }, [canvasRef, onRender])
}
