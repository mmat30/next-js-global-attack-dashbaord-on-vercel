import { renderHook, act } from "@testing-library/react"
import { useAttacks } from "../use-attacks"
import { generateAttacks } from "@/lib/mock-data"
import type { Attack } from "@/lib/types"

// Mock the generateAttack function to return predictable results
jest.mock("@/lib/mock-data", () => ({
  generateAttack: jest.fn((id: string) => ({
    id,
    timestamp: new Date("2026-02-15T12:00:00Z"),
    type: "ddos",
    severity: "high",
    source: {
      lat: 39.9,
      lng: 116.4,
      city: "Beijing",
      country: "China",
      countryCode: "CN",
    },
    target: {
      lat: 38.9,
      lng: -77.04,
      city: "Washington",
      country: "United States",
      countryCode: "US",
    },
    protocol: "TCP",
    port: 80,
  })),
  generateAttacks: jest.requireActual("@/lib/mock-data").generateAttacks,
}))

describe("useAttacks", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllTimers()
    jest.useRealTimers()
  })

  it("should return initial attacks", () => {
    const initialAttacks: Attack[] = generateAttacks(3)
    const { result } = renderHook(() => useAttacks(initialAttacks))

    expect(result.current).toHaveLength(3)
    expect(result.current).toEqual(initialAttacks)
  })

  it("should add new attack after interval (2-3 seconds)", () => {
    const initialAttacks: Attack[] = generateAttacks(2)
    const { result } = renderHook(() => useAttacks(initialAttacks))

    expect(result.current).toHaveLength(2)

    // Advance time by 3 seconds (max interval)
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(result.current.length).toBeGreaterThan(2)
  })

  it("should prepend new attacks (new attacks at start)", () => {
    const initialAttacks: Attack[] = generateAttacks(2)
    const { result } = renderHook(() => useAttacks(initialAttacks))

    const firstAttackIdBefore = result.current[0].id

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    // First attack should be different (new one added)
    expect(result.current[0].id).not.toBe(firstAttackIdBefore)
  })

  it("should enforce maxItems limit", () => {
    const initialAttacks: Attack[] = generateAttacks(5)
    const maxItems = 5
    const { result } = renderHook(() => useAttacks(initialAttacks, maxItems))

    expect(result.current).toHaveLength(5)

    // Add multiple attacks
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(result.current.length).toBeLessThanOrEqual(maxItems)
  })

  it("should use default maxItems of 20 when not provided", () => {
    const initialAttacks: Attack[] = generateAttacks(19)
    const { result } = renderHook(() => useAttacks(initialAttacks))

    // Add one attack
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(result.current.length).toBeLessThanOrEqual(20)
  })

  it("should generate unique IDs for live attacks", () => {
    const initialAttacks: Attack[] = generateAttacks(2)
    const { result } = renderHook(() => useAttacks(initialAttacks))

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    const ids = result.current.map((attack) => attack.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(ids.length)
  })

  it("should set timestamp to current time for new attacks", () => {
    const initialAttacks: Attack[] = generateAttacks(2)
    const mockDate = new Date("2026-02-15T10:00:00Z")
    jest.setSystemTime(mockDate)

    const { result } = renderHook(() => useAttacks(initialAttacks))

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    // New attack should have a recent timestamp
    const newAttack = result.current[0]
    expect(newAttack.timestamp).toBeInstanceOf(Date)
    // Check that timestamp is within a reasonable range (within a few seconds of mock time)
    const timeDiff = Math.abs(newAttack.timestamp.getTime() - mockDate.getTime())
    expect(timeDiff).toBeLessThan(5000) // Within 5 seconds
  })

  it("should use live-{counter} ID format for new attacks", () => {
    const initialAttacks: Attack[] = generateAttacks(2)
    const { result } = renderHook(() => useAttacks(initialAttacks))

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    // First live attack should be live-2 (after 2 initial attacks)
    expect(result.current[0].id).toMatch(/^live-\d+$/)
  })

  it("should increment counter for each new attack", () => {
    const initialAttacks: Attack[] = generateAttacks(2)
    const { result } = renderHook(() => useAttacks(initialAttacks))

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    const firstNewId = result.current[0].id

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    const secondNewId = result.current[0].id

    expect(firstNewId).not.toBe(secondNewId)
  })

  it("should clean up interval on unmount", () => {
    const initialAttacks: Attack[] = generateAttacks(2)
    const { unmount } = renderHook(() => useAttacks(initialAttacks))

    const intervalCount = jest.getTimerCount()

    unmount()

    // Interval should be cleared
    expect(jest.getTimerCount()).toBe(0)
  })

  it("should handle empty initial attacks array", () => {
    const { result } = renderHook(() => useAttacks([]))

    expect(result.current).toHaveLength(0)

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(result.current.length).toBeGreaterThan(0)
  })

  it("should maintain maxItems - 1 old attacks when adding new one", () => {
    const initialAttacks: Attack[] = generateAttacks(5)
    const maxItems = 5
    const { result } = renderHook(() => useAttacks(initialAttacks, maxItems))

    const lastAttackBefore = result.current[4]

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    // Should have 5 items total
    expect(result.current).toHaveLength(5)
    // Last item should be the second-to-last from before (oldest one dropped)
    expect(result.current[4]).toEqual(initialAttacks[3])
  })

  it("should add attacks continuously at intervals", () => {
    const initialAttacks: Attack[] = generateAttacks(1)
    const { result } = renderHook(() => useAttacks(initialAttacks, 10))

    expect(result.current).toHaveLength(1)

    // Add attack 1
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(result.current.length).toBeGreaterThanOrEqual(2)

    // Add attack 2
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(result.current.length).toBeGreaterThanOrEqual(3)

    // Add attack 3
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(result.current.length).toBeGreaterThanOrEqual(4)
  })
})
