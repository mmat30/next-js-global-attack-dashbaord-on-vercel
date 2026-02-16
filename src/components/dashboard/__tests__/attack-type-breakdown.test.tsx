import { render, screen } from "@testing-library/react"
import { AttackTypeBreakdown } from "../attack-type-breakdown"
import type { AttackTypeStat } from "@/lib/mock-data"

// Mock Recharts components
jest.mock("recharts", () => ({
  Pie: ({ children, data }: { children: React.ReactNode; data: any[] }) => (
    <div data-testid="pie" data-length={data.length}>
      {children}
    </div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
}))

describe("AttackTypeBreakdown", () => {
  const mockData: AttackTypeStat[] = [
    { type: "ddos", count: 1500 },
    { type: "brute-force", count: 1200 },
    { type: "sql-injection", count: 900 },
    { type: "xss", count: 800 },
    { type: "phishing", count: 700 },
    { type: "ransomware", count: 600 },
    { type: "zero-day", count: 500 },
    { type: "port-scan", count: 400 },
    { type: "man-in-the-middle", count: 300 },
  ]

  it("should render card title", () => {
    render(<AttackTypeBreakdown data={mockData} />)

    expect(screen.getByText("Attack Types")).toBeInTheDocument()
  })

  it("should render PieChart", () => {
    render(<AttackTypeBreakdown data={mockData} />)

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument()
  })

  it("should render Pie with correct data length", () => {
    render(<AttackTypeBreakdown data={mockData} />)

    const pie = screen.getByTestId("pie")
    expect(pie).toBeInTheDocument()
    expect(pie).toHaveAttribute("data-length", "9")
  })

  it("should render all 9 attack type labels in legend (first 6)", () => {
    render(<AttackTypeBreakdown data={mockData} />)

    expect(screen.getByText("DDoS")).toBeInTheDocument()
    expect(screen.getByText("Brute Force")).toBeInTheDocument()
    expect(screen.getByText("SQL Injection")).toBeInTheDocument()
    expect(screen.getByText("XSS")).toBeInTheDocument()
    expect(screen.getByText("Phishing")).toBeInTheDocument()
    expect(screen.getByText("Ransomware")).toBeInTheDocument()
  })

  it("should only show first 6 types in legend", () => {
    render(<AttackTypeBreakdown data={mockData} />)

    // First 6 should be present
    expect(screen.getByText("DDoS")).toBeInTheDocument()
    expect(screen.getByText("Ransomware")).toBeInTheDocument()

    // 7th, 8th, 9th should not be in legend (only in chart)
    expect(screen.queryByText("Zero-Day")).not.toBeInTheDocument()
    expect(screen.queryByText("Port Scan")).not.toBeInTheDocument()
    expect(screen.queryByText("MitM")).not.toBeInTheDocument()
  })

  it("should render PieChartIcon", () => {
    const { container } = render(<AttackTypeBreakdown data={mockData} />)

    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })

  it("should render legend with color indicators", () => {
    const { container } = render(<AttackTypeBreakdown data={mockData} />)

    const colorIndicators = container.querySelectorAll('[class*="h-2 w-2 rounded-full"]')
    expect(colorIndicators.length).toBeGreaterThanOrEqual(6)
  })

  it("should handle empty data array", () => {
    render(<AttackTypeBreakdown data={[]} />)

    const pie = screen.getByTestId("pie")
    expect(pie).toHaveAttribute("data-length", "0")
  })

  it("should handle single attack type", () => {
    const singleData: AttackTypeStat[] = [{ type: "ddos", count: 1000 }]

    render(<AttackTypeBreakdown data={singleData} />)

    expect(screen.getByText("DDoS")).toBeInTheDocument()
    const pie = screen.getByTestId("pie")
    expect(pie).toHaveAttribute("data-length", "1")
  })

  it("should handle less than 6 attack types", () => {
    const limitedData: AttackTypeStat[] = [
      { type: "ddos", count: 1500 },
      { type: "brute-force", count: 1200 },
      { type: "sql-injection", count: 900 },
    ]

    render(<AttackTypeBreakdown data={limitedData} />)

    expect(screen.getByText("DDoS")).toBeInTheDocument()
    expect(screen.getByText("Brute Force")).toBeInTheDocument()
    expect(screen.getByText("SQL Injection")).toBeInTheDocument()

    const pie = screen.getByTestId("pie")
    expect(pie).toHaveAttribute("data-length", "3")
  })

  it("should render legend in 2-column grid", () => {
    const { container } = render(<AttackTypeBreakdown data={mockData} />)

    const legendGrid = container.querySelector('[class*="grid-cols-2"]')
    expect(legendGrid).toBeInTheDocument()
  })

  it("should render Cell components for each data point", () => {
    render(<AttackTypeBreakdown data={mockData} />)

    const cells = screen.getAllByTestId("cell")
    expect(cells).toHaveLength(9)
  })
})
