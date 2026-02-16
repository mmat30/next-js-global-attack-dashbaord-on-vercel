import { render, screen } from "@testing-library/react"
import { GlobeVisualization } from "../globe-visualization"

// Mock useGlobe hook
jest.mock("@/hooks/use-globe", () => ({
  useGlobe: jest.fn(),
}))

describe("GlobeVisualization", () => {
  const mockMarkers = [
    { location: [40.7128, -74.006] as [number, number], size: 0.05 },
    { location: [51.5074, -0.1278] as [number, number], size: 0.05 },
  ]

  it("should render canvas element", () => {
    const { container } = render(<GlobeVisualization markers={mockMarkers} />)

    const canvas = container.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })

  it("should render legend with Source label", () => {
    render(<GlobeVisualization markers={mockMarkers} />)

    expect(screen.getByText("Source")).toBeInTheDocument()
  })

  it("should render legend with Target label", () => {
    render(<GlobeVisualization markers={mockMarkers} />)

    expect(screen.getByText("Target")).toBeInTheDocument()
  })

  it("should render source color indicator (emerald)", () => {
    const { container } = render(<GlobeVisualization markers={mockMarkers} />)

    const sourceIndicator = container.querySelector('[class*="bg-emerald-500"]')
    expect(sourceIndicator).toBeInTheDocument()
  })

  it("should render target color indicator (red)", () => {
    const { container } = render(<GlobeVisualization markers={mockMarkers} />)

    const targetIndicator = container.querySelector('[class*="bg-red-500"]')
    expect(targetIndicator).toBeInTheDocument()
  })

  it("should handle empty markers array", () => {
    const { container } = render(<GlobeVisualization markers={[]} />)

    const canvas = container.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })

  it("should apply canvas styling", () => {
    const { container } = render(<GlobeVisualization markers={mockMarkers} />)

    const canvas = container.querySelector("canvas")
    expect(canvas).toHaveClass("h-full")
    expect(canvas).toHaveClass("w-full")
  })

  it("should position legend at bottom left", () => {
    const { container } = render(<GlobeVisualization markers={mockMarkers} />)

    const legend = container.querySelector('[class*="bottom-3 left-3"]')
    expect(legend).toBeInTheDocument()
  })

  it("should render with aspect square container", () => {
    const { container } = render(<GlobeVisualization markers={mockMarkers} />)

    const aspectContainer = container.querySelector('[class*="aspect-square"]')
    expect(aspectContainer).toBeInTheDocument()
  })

  it("should apply max-width constraint", () => {
    const { container } = render(<GlobeVisualization markers={mockMarkers} />)

    const aspectContainer = container.querySelector('[class*="max-w-\\[500px\\]"]')
    expect(aspectContainer).toBeInTheDocument()
  })
})
