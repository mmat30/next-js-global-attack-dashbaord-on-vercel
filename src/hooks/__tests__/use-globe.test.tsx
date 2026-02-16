import { renderHook } from "@testing-library/react"
import { useGlobe } from "../use-globe"
import createGlobe from "cobe"

// Mock the cobe module
jest.mock("cobe")

const mockCreateGlobe = createGlobe as jest.MockedFunction<typeof createGlobe>

describe("useGlobe", () => {
  let canvasRef: React.RefObject<HTMLCanvasElement>
  let mockDestroy: jest.Mock

  beforeEach(() => {
    mockDestroy = jest.fn()
    mockCreateGlobe.mockReturnValue({
      destroy: mockDestroy,
    })

    // Create a mock canvas element
    const canvas = document.createElement("canvas")
    Object.defineProperty(canvas, "offsetWidth", {
      writable: true,
      value: 400,
    })
    Object.defineProperty(canvas, "offsetHeight", {
      writable: true,
      value: 400,
    })

    canvasRef = { current: canvas }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should initialize globe with canvas and markers", () => {
    const markers = [
      { location: [40.7128, -74.006] as [number, number], size: 0.05 },
      { location: [51.5074, -0.1278] as [number, number], size: 0.05 },
    ]

    renderHook(() => useGlobe(canvasRef, markers))

    expect(mockCreateGlobe).toHaveBeenCalledTimes(1)
    expect(mockCreateGlobe).toHaveBeenCalledWith(
      canvasRef.current,
      expect.objectContaining({
        markers,
        width: 800, // offsetWidth * 2
        height: 800, // offsetHeight * 2
        onRender: expect.any(Function),
      })
    )
  })

  it("should not initialize globe when canvas is null", () => {
    const nullCanvasRef: React.RefObject<HTMLCanvasElement> = { current: null }
    const markers = [{ location: [40.7128, -74.006] as [number, number], size: 0.05 }]

    renderHook(() => useGlobe(nullCanvasRef, markers))

    expect(mockCreateGlobe).not.toHaveBeenCalled()
  })

  it("should destroy globe on unmount", () => {
    const markers = [{ location: [40.7128, -74.006] as [number, number], size: 0.05 }]

    const { unmount } = renderHook(() => useGlobe(canvasRef, markers))

    expect(mockDestroy).not.toHaveBeenCalled()

    unmount()

    expect(mockDestroy).toHaveBeenCalledTimes(1)
  })

  it("should handle empty markers array", () => {
    const markers: Array<{ location: [number, number]; size: number }> = []

    renderHook(() => useGlobe(canvasRef, markers))

    expect(mockCreateGlobe).toHaveBeenCalledWith(
      canvasRef.current,
      expect.objectContaining({
        markers: [],
      })
    )
  })

  it("should use canvas dimensions for globe size", () => {
    const canvas = document.createElement("canvas")
    Object.defineProperty(canvas, "offsetWidth", {
      writable: true,
      value: 600,
    })
    Object.defineProperty(canvas, "offsetHeight", {
      writable: true,
      value: 500,
    })

    const customCanvasRef = { current: canvas }
    const markers = [{ location: [40.7128, -74.006] as [number, number], size: 0.05 }]

    renderHook(() => useGlobe(customCanvasRef, markers))

    expect(mockCreateGlobe).toHaveBeenCalledWith(
      canvas,
      expect.objectContaining({
        width: 1200, // 600 * 2
        height: 1000, // 500 * 2
      })
    )
  })

  it("should pass onRender callback that increments phi", () => {
    const markers = [{ location: [40.7128, -74.006] as [number, number], size: 0.05 }]

    renderHook(() => useGlobe(canvasRef, markers))

    const callArgs = mockCreateGlobe.mock.calls[0][1]
    const onRender = callArgs.onRender

    expect(onRender).toBeDefined()
    expect(typeof onRender).toBe("function")

    // Simulate onRender being called
    const state = { phi: 0 }
    onRender!(state)

    // phi should be set to the initial value
    expect(state.phi).toBe(0)

    // Call again to verify increment
    onRender!(state)
    expect(state.phi).toBe(0.003)

    // Call once more
    onRender!(state)
    expect(state.phi).toBe(0.006)
  })

  it("should update markers without recreating globe", () => {
    const markers1 = [{ location: [40.7128, -74.006] as [number, number], size: 0.05 }]

    const { rerender } = renderHook(
      ({ markers }) => useGlobe(canvasRef, markers),
      {
        initialProps: { markers: markers1 },
      }
    )

    expect(mockCreateGlobe).toHaveBeenCalledTimes(1)

    // Update markers
    const markers2 = [
      { location: [40.7128, -74.006] as [number, number], size: 0.05 },
      { location: [51.5074, -0.1278] as [number, number], size: 0.05 },
    ]

    rerender({ markers: markers2 })

    // Globe should not be recreated (still only 1 call)
    expect(mockCreateGlobe).toHaveBeenCalledTimes(1)
  })

  it("should include GLOBE_CONFIG in initialization", () => {
    const markers = [{ location: [40.7128, -74.006] as [number, number], size: 0.05 }]

    renderHook(() => useGlobe(canvasRef, markers))

    const callArgs = mockCreateGlobe.mock.calls[0][1]

    // GLOBE_CONFIG should be spread into the config
    // We can check for some expected properties from GLOBE_CONFIG
    expect(callArgs).toHaveProperty("onRender")
    expect(callArgs).toHaveProperty("markers")
    expect(callArgs).toHaveProperty("width")
    expect(callArgs).toHaveProperty("height")
  })

  it("should handle multiple markers correctly", () => {
    const markers = [
      { location: [40.7128, -74.006] as [number, number], size: 0.05 },
      { location: [51.5074, -0.1278] as [number, number], size: 0.05 },
      { location: [35.6762, 139.6503] as [number, number], size: 0.05 },
      { location: [-33.8688, 151.2093] as [number, number], size: 0.05 },
    ]

    renderHook(() => useGlobe(canvasRef, markers))

    expect(mockCreateGlobe).toHaveBeenCalledWith(
      canvasRef.current,
      expect.objectContaining({
        markers: expect.arrayContaining([
          expect.objectContaining({ location: [40.7128, -74.006] }),
          expect.objectContaining({ location: [51.5074, -0.1278] }),
          expect.objectContaining({ location: [35.6762, 139.6503] }),
          expect.objectContaining({ location: [-33.8688, 151.2093] }),
        ]),
      })
    )
  })
})
