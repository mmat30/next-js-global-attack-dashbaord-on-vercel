import { render, screen } from "@testing-library/react"
import { AttackTimeline } from "../attack-timeline"
import type { TimelinePoint } from "@/lib/mock-data"

// Mock Recharts components
jest.mock("recharts", () => ({
  Area: ({ dataKey }: { dataKey: string }) => <div data-testid={`area-${dataKey}`}>{dataKey}</div>,
  AreaChart: ({ children, data }: { children: React.ReactNode; data: any[] }) => (
    <div data-testid="area-chart" data-length={data.length}>
      {children}
    </div>
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: ({ dataKey }: { dataKey: string }) => <div data-testid={`x-axis-${dataKey}`} />,
  YAxis: () => <div data-testid="y-axis" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
}))

describe("AttackTimeline", () => {
  const mockData: TimelinePoint[] = [
    { time: "00:00", attacks: 150, blocked: 120 },
    { time: "01:00", attacks: 200, blocked: 160 },
    { time: "02:00", attacks: 180, blocked: 144 },
  ]

  it("should render card title", () => {
    render(<AttackTimeline data={mockData} />)

    expect(screen.getByText("Attack Timeline (24h)")).toBeInTheDocument()
  })

  it("should render AreaChart with data", () => {
    render(<AttackTimeline data={mockData} />)

    const chart = screen.getByTestId("area-chart")
    expect(chart).toBeInTheDocument()
    expect(chart).toHaveAttribute("data-length", "3")
  })

  it("should render two Area components (attacks and blocked)", () => {
    render(<AttackTimeline data={mockData} />)

    expect(screen.getByTestId("area-attacks")).toBeInTheDocument()
    expect(screen.getByTestId("area-blocked")).toBeInTheDocument()
  })

  it("should render CartesianGrid", () => {
    render(<AttackTimeline data={mockData} />)

    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument()
  })

  it("should render XAxis with time dataKey", () => {
    render(<AttackTimeline data={mockData} />)

    expect(screen.getByTestId("x-axis-time")).toBeInTheDocument()
  })

  it("should render YAxis", () => {
    render(<AttackTimeline data={mockData} />)

    expect(screen.getByTestId("y-axis")).toBeInTheDocument()
  })

  it("should render TrendingUp icon", () => {
    const { container } = render(<AttackTimeline data={mockData} />)

    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })

  it("should handle empty data array", () => {
    render(<AttackTimeline data={[]} />)

    const chart = screen.getByTestId("area-chart")
    expect(chart).toBeInTheDocument()
    expect(chart).toHaveAttribute("data-length", "0")
  })

  it("should handle large dataset (24 hours)", () => {
    const fullDayData: TimelinePoint[] = Array.from({ length: 24 }, (_, i) => ({
      time: `${i.toString().padStart(2, "0")}:00`,
      attacks: 100 + i * 10,
      blocked: 80 + i * 8,
    }))

    render(<AttackTimeline data={fullDayData} />)

    const chart = screen.getByTestId("area-chart")
    expect(chart).toHaveAttribute("data-length", "24")
  })

  it("should render with single data point", () => {
    const singleData: TimelinePoint[] = [
      { time: "12:00", attacks: 250, blocked: 200 },
    ]

    render(<AttackTimeline data={singleData} />)

    const chart = screen.getByTestId("area-chart")
    expect(chart).toHaveAttribute("data-length", "1")
  })

  it("should apply correct CSS classes to card", () => {
    const { container } = render(<AttackTimeline data={mockData} />)

    const card = container.firstChild
    expect(card).toHaveClass("col-span-1")
    expect(card).toHaveClass("lg:col-span-2")
  })
})
