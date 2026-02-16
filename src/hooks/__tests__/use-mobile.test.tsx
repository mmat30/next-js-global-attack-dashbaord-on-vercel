import { renderHook } from "@testing-library/react"
import { useIsMobile } from "../use-mobile"

describe("useIsMobile", () => {
  let matchMediaMock: jest.Mock

  beforeEach(() => {
    matchMediaMock = jest.fn()
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should return false for desktop width (>768px)", () => {
    const listeners: Array<() => void> = []

    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn((event: string, handler: () => void) => {
        listeners.push(handler)
      }),
      removeEventListener: jest.fn(),
    }))

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it("should return true for mobile width (<768px)", () => {
    const listeners: Array<() => void> = []

    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: jest.fn((event: string, handler: () => void) => {
        listeners.push(handler)
      }),
      removeEventListener: jest.fn(),
    }))

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 375,
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it("should return false at exactly 768px (boundary)", () => {
    const listeners: Array<() => void> = []

    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn((event: string, handler: () => void) => {
        listeners.push(handler)
      }),
      removeEventListener: jest.fn(),
    }))

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 768,
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)
  })

  it("should return true at 767px (boundary)", () => {
    const listeners: Array<() => void> = []

    matchMediaMock.mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: jest.fn((event: string, handler: () => void) => {
        listeners.push(handler)
      }),
      removeEventListener: jest.fn(),
    }))

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 767,
    })

    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(true)
  })

  it("should update when matchMedia change event fires", () => {
    const listeners: Array<() => void> = []

    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn((event: string, handler: () => void) => {
        listeners.push(handler)
      }),
      removeEventListener: jest.fn(),
    }))

    // Start with desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    })

    const { result, rerender } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    // Simulate resize to mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    })

    // Trigger the change event
    listeners.forEach((listener) => listener())
    rerender()

    expect(result.current).toBe(true)
  })

  it("should call matchMedia with correct query", () => {
    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    })

    renderHook(() => useIsMobile())

    expect(matchMediaMock).toHaveBeenCalledWith("(max-width: 767px)")
  })

  it("should clean up event listener on unmount", () => {
    const removeEventListenerMock = jest.fn()
    const addEventListenerMock = jest.fn()

    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    }))

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    })

    const { unmount } = renderHook(() => useIsMobile())

    expect(addEventListenerMock).toHaveBeenCalled()

    unmount()

    expect(removeEventListenerMock).toHaveBeenCalled()
  })

  it("should initially return false when undefined", () => {
    const listeners: Array<() => void> = []

    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn((event: string, handler: () => void) => {
        listeners.push(handler)
      }),
      removeEventListener: jest.fn(),
    }))

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    })

    const { result } = renderHook(() => useIsMobile())

    // The hook converts undefined to false via !!isMobile
    expect(result.current).toBe(false)
  })
})
