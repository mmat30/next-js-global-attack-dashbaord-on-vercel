import { render } from "@testing-library/react"
import { GlobeWrapper } from "../globe-wrapper"

// Mock next/dynamic
jest.mock("next/dynamic", () => {
  return jest.fn(() => {
    const MockComponent = ({ markers }: { markers: any[] }) => (
      <div data-testid="globe-visualization" data-marker-count={markers.length} />
    )
    return MockComponent
  })
})

describe("GlobeWrapper", () => {
  const mockMarkers = [
    { location: [40.7128, -74.006] as [number, number], size: 0.05 },
    { location: [51.5074, -0.1278] as [number, number], size: 0.05 },
  ]

  it("should render GlobeVisualization component", () => {
    const { container } = render(<GlobeWrapper markers={mockMarkers} />)

    const globeViz = container.querySelector('[data-testid="globe-visualization"]')
    expect(globeViz).toBeInTheDocument()
  })

  it("should pass markers prop to GlobeVisualization", () => {
    const { container } = render(<GlobeWrapper markers={mockMarkers} />)

    const globeViz = container.querySelector('[data-testid="globe-visualization"]')
    expect(globeViz).toHaveAttribute("data-marker-count", "2")
  })

  it("should handle empty markers array", () => {
    const { container } = render(<GlobeWrapper markers={[]} />)

    const globeViz = container.querySelector('[data-testid="globe-visualization"]')
    expect(globeViz).toHaveAttribute("data-marker-count", "0")
  })

  it("should handle many markers", () => {
    const manyMarkers = Array.from({ length: 100 }, (_, i) => ({
      location: [i, i] as [number, number],
      size: 0.05,
    }))

    const { container } = render(<GlobeWrapper markers={manyMarkers} />)

    const globeViz = container.querySelector('[data-testid="globe-visualization"]')
    expect(globeViz).toHaveAttribute("data-marker-count", "100")
  })
})
