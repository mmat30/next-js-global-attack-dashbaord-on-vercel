import { render, screen } from "@testing-library/react"
import { AttackFeedItem } from "../attack-feed-item"
import type { Attack } from "@/lib/types"

describe("AttackFeedItem", () => {
  const mockAttack: Attack = {
    id: "test-1",
    timestamp: new Date("2026-02-15T14:30:45"),
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
  }

  it("should render attack severity", () => {
    render(<AttackFeedItem attack={mockAttack} />)

    expect(screen.getByText("high")).toBeInTheDocument()
  })

  it("should render attack type label", () => {
    render(<AttackFeedItem attack={mockAttack} />)

    expect(screen.getByText("DDoS")).toBeInTheDocument()
  })

  it("should render source city and country code", () => {
    render(<AttackFeedItem attack={mockAttack} />)

    expect(screen.getByText(/Beijing.*CN/)).toBeInTheDocument()
  })

  it("should render target city and country code", () => {
    render(<AttackFeedItem attack={mockAttack} />)

    expect(screen.getByText(/Washington.*US/)).toBeInTheDocument()
  })

  it("should render arrow between source and target", () => {
    render(<AttackFeedItem attack={mockAttack} />)

    expect(screen.getByText(/→/)).toBeInTheDocument()
  })

  it("should render timestamp in HH:MM:SS format", () => {
    render(<AttackFeedItem attack={mockAttack} />)

    // Should be 14:30:45 in 24-hour format
    expect(screen.getByText("14:30:45")).toBeInTheDocument()
  })

  it("should render all severity levels correctly", () => {
    const severities: Array<Attack["severity"]> = [
      "critical",
      "high",
      "medium",
      "low",
      "info",
    ]

    severities.forEach((severity) => {
      const attack = { ...mockAttack, severity }
      const { unmount } = render(<AttackFeedItem attack={attack} />)
      expect(screen.getByText(severity)).toBeInTheDocument()
      unmount()
    })
  })

  it("should render all attack types correctly", () => {
    const attackTypes = [
      { type: "ddos" as const, label: "DDoS" },
      { type: "brute-force" as const, label: "Brute Force" },
      { type: "sql-injection" as const, label: "SQL Injection" },
      { type: "xss" as const, label: "XSS" },
      { type: "phishing" as const, label: "Phishing" },
      { type: "ransomware" as const, label: "Ransomware" },
      { type: "zero-day" as const, label: "Zero-Day" },
      { type: "port-scan" as const, label: "Port Scan" },
      { type: "man-in-the-middle" as const, label: "MitM" },
    ]

    attackTypes.forEach(({ type, label }) => {
      const attack = { ...mockAttack, type }
      const { unmount } = render(<AttackFeedItem attack={attack} />)
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    })
  })

  it("should apply isNew animation class when isNew is true", () => {
    const { container } = render(<AttackFeedItem attack={mockAttack} isNew={true} />)

    const attackItem = container.firstChild
    expect(attackItem).toHaveClass("animate-in")
    expect(attackItem).toHaveClass("fade-in")
    expect(attackItem).toHaveClass("slide-in-from-top-2")
  })

  it("should not apply isNew animation class when isNew is false", () => {
    const { container } = render(<AttackFeedItem attack={mockAttack} isNew={false} />)

    const attackItem = container.firstChild
    expect(attackItem).not.toHaveClass("animate-in")
  })

  it("should not apply isNew animation class when isNew is undefined", () => {
    const { container } = render(<AttackFeedItem attack={mockAttack} />)

    const attackItem = container.firstChild
    expect(attackItem).not.toHaveClass("animate-in")
  })

  it("should fallback to country name when city is missing from source", () => {
    const attackWithoutCity: Attack = {
      ...mockAttack,
      source: {
        ...mockAttack.source,
        city: undefined,
      },
    }

    render(<AttackFeedItem attack={attackWithoutCity} />)

    expect(screen.getByText(/China.*CN/)).toBeInTheDocument()
  })

  it("should fallback to country name when city is missing from target", () => {
    const attackWithoutCity: Attack = {
      ...mockAttack,
      target: {
        ...mockAttack.target,
        city: undefined,
      },
    }

    render(<AttackFeedItem attack={attackWithoutCity} />)

    expect(screen.getByText(/United States.*US/)).toBeInTheDocument()
  })

  it("should apply correct severity color classes", () => {
    const attack: Attack = {
      ...mockAttack,
      severity: "critical",
    }

    const { container } = render(<AttackFeedItem attack={attack} />)

    const badge = container.querySelector('[class*="text-red-500"]')
    expect(badge).toBeInTheDocument()
  })

  it("should render timestamp at midnight correctly", () => {
    const attack: Attack = {
      ...mockAttack,
      timestamp: new Date("2026-02-15T00:00:00"),
    }

    render(<AttackFeedItem attack={attack} />)

    expect(screen.getByText("00:00:00")).toBeInTheDocument()
  })

  it("should render timestamp at end of day correctly", () => {
    const attack: Attack = {
      ...mockAttack,
      timestamp: new Date("2026-02-15T23:59:59"),
    }

    render(<AttackFeedItem attack={attack} />)

    expect(screen.getByText("23:59:59")).toBeInTheDocument()
  })
})
