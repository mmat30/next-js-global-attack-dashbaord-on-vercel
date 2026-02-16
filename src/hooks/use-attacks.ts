"use client"

import { useState, useEffect, useCallback } from "react"
import type { Attack } from "@/lib/types"
import { generateAttack } from "@/lib/mock-data"

function quickRandom() {
  return Math.random()
}

export function useAttacks(initialAttacks: Attack[], maxItems = 20) {
  const [attacks, setAttacks] = useState(initialAttacks)
  const [counter, setCounter] = useState(initialAttacks.length)

  const addAttack = useCallback(() => {
    const newAttack = generateAttack(`live-${counter}`, quickRandom)
    newAttack.timestamp = new Date()
    setAttacks((prev) => [newAttack, ...prev.slice(0, maxItems - 1)])
    setCounter((c) => c + 1)
  }, [counter, maxItems])

  useEffect(() => {
    const interval = setInterval(addAttack, 2000 + Math.random() * 1000)
    return () => clearInterval(interval)
  }, [addAttack])

  return attacks
}
