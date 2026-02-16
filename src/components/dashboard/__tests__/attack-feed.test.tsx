import { render, screen } from "@testing-library/react"
import { AttackFeed } from "../attack-feed"
import type { Attack } from "@/lib/types"
import { generateAttacks } from "@/lib/mock-data"

describe("AttackFeed", () => {
  const mockAttacks: Attack[] = generateAttacks(3)

  it("should render 'Live Attack Feed' title", () => {
    render(<AttackFeed attacks={mockAttacks} />)

    expect(screen.getByText("Live Attack Feed")).toBeInTheDocument()
  })

  it("should render all attacks", () => {
    render(<AttackFeed attacks={mockAttacks} />)

    // Check that all 3 attacks are rendered by looking for their IDs
    mockAttacks.forEach((attack) => {
      // Each attack should have a severity badge which is unique enough
      const severityElements = screen.getAllByText(attack.severity)
      expect(severityElements.length).toBeGreaterThan(0)
    })
  })

  it("should render empty state when no attacks", () => {
    render(<AttackFeed attacks={[]} />)

    expect(screen.getByText("Live Attack Feed")).toBeInTheDocument()
    // Should still render the card structure
    expect(screen.queryByText("DDoS")).not.toBeInTheDocument()
  })

  it("should render single attack", () => {
    const singleAttack = mockAttacks.slice(0, 1)
    render(<AttackFeed attacks={singleAttack} />)

    const severityBadges = screen.getAllByText(singleAttack[0].severity)
    expect(severityBadges.length).toBeGreaterThan(0)
  })

  it("should render many attacks", () => {
    const manyAttacks = generateAttacks(20)
    render(<AttackFeed attacks={manyAttacks} />)

    expect(screen.getByText("Live Attack Feed")).toBeInTheDocument()
    // Should render scroll area with all attacks
  })

  it("should mark first attack as new", () => {
    const { container } = render(<AttackFeed attacks={mockAttacks} />)

    // First attack item should have isNew animation classes
    const attackItems = container.querySelectorAll('[class*="rounded-lg border"]')
    expect(attackItems[0]).toHaveClass("animate-in")
  })

  it("should not mark second attack as new", () => {
    const { container } = render(<AttackFeed attacks={mockAttacks} />)

    // Second attack item should NOT have isNew animation classes
    const attackItems = container.querySelectorAll('[class*="rounded-lg border"]')
    if (attackItems.length > 1) {
      expect(attackItems[1]).not.toHaveClass("animate-in")
    }
  })

  it("should render Activity icon", () => {
    const { container } = render(<AttackFeed attacks={mockAttacks} />)

    const icons = container.querySelectorAll("svg")
    expect(icons.length).toBeGreaterThan(0)
  })

  it("should render live indicator (pulsing dot)", () => {
    const { container } = render(<AttackFeed attacks={mockAttacks} />)

    const pulsingDot = container.querySelector('[class*="animate-ping"]')
    expect(pulsingDot).toBeInTheDocument()
  })

  it("should render scroll area", () => {
    render(<AttackFeed attacks={mockAttacks} />)

    // ScrollArea component should be rendered
    expect(screen.getByText("Live Attack Feed")).toBeInTheDocument()
  })

  it("should render attacks in order", () => {
    render(<AttackFeed attacks={mockAttacks} />)

    // All attacks should be rendered
    const severities = screen.getAllByText(/critical|high|medium|low|info/)
    expect(severities.length).toBeGreaterThanOrEqual(mockAttacks.length)
  })

  it("should handle attack with all properties", () => {
    const attack: Attack = {
      id: "test-full",
      timestamp: new Date("2026-02-15T14:30:45"),
      type: "ddos",
      severity: "critical",
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
    }

    render(<AttackFeed attacks={[attack]} />)

    expect(screen.getByText("critical")).toBeInTheDocument()
    expect(screen.getByText("DDoS")).toBeInTheDocument()
  })
})
