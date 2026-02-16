import { render, screen } from "@testing-library/react"
import { ThreatLevelIndicator } from "../threat-level-indicator"
import type { ThreatStatus } from "@/lib/types"

describe("ThreatLevelIndicator", () => {
  it("should render threat level critical", () => {
    const status: ThreatStatus = {
      level: "critical",
      attacksPerMinute: 850,
      activeIncidents: 45,
      topAttackType: "ddos",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText("critical")).toBeInTheDocument()
    expect(screen.getByText("critical")).toHaveClass("text-red-500")
  })

  it("should render threat level elevated", () => {
    const status: ThreatStatus = {
      level: "elevated",
      attacksPerMinute: 550,
      activeIncidents: 30,
      topAttackType: "brute-force",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText("elevated")).toBeInTheDocument()
    expect(screen.getByText("elevated")).toHaveClass("text-orange-500")
  })

  it("should render threat level guarded", () => {
    const status: ThreatStatus = {
      level: "guarded",
      attacksPerMinute: 350,
      activeIncidents: 15,
      topAttackType: "phishing",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText("guarded")).toBeInTheDocument()
    expect(screen.getByText("guarded")).toHaveClass("text-yellow-500")
  })

  it("should render threat level low", () => {
    const status: ThreatStatus = {
      level: "low",
      attacksPerMinute: 150,
      activeIncidents: 5,
      topAttackType: "port-scan",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText("low")).toBeInTheDocument()
    expect(screen.getByText("low")).toHaveClass("text-emerald-500")
  })

  it("should display active incidents count", () => {
    const status: ThreatStatus = {
      level: "elevated",
      attacksPerMinute: 550,
      activeIncidents: 30,
      topAttackType: "ddos",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText("30 active")).toBeInTheDocument()
  })

  it("should display attacks per minute", () => {
    const status: ThreatStatus = {
      level: "elevated",
      attacksPerMinute: 550,
      activeIncidents: 30,
      topAttackType: "ddos",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText(/550 attacks\/min/)).toBeInTheDocument()
  })

  it("should display top attack type label", () => {
    const status: ThreatStatus = {
      level: "elevated",
      attacksPerMinute: 550,
      activeIncidents: 30,
      topAttackType: "ddos",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText(/DDoS/)).toBeInTheDocument()
  })

  it("should render all attack type labels correctly", () => {
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
      const status: ThreatStatus = {
        level: "elevated",
        attacksPerMinute: 550,
        activeIncidents: 30,
        topAttackType: type,
      }

      const { unmount } = render(<ThreatLevelIndicator status={status} />)
      expect(screen.getByText(new RegExp(label))).toBeInTheDocument()
      unmount()
    })
  })

  it("should render with minimum values", () => {
    const status: ThreatStatus = {
      level: "low",
      attacksPerMinute: 0,
      activeIncidents: 0,
      topAttackType: "port-scan",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText("0 active")).toBeInTheDocument()
    expect(screen.getByText(/0 attacks\/min/)).toBeInTheDocument()
  })

  it("should render with large values", () => {
    const status: ThreatStatus = {
      level: "critical",
      attacksPerMinute: 9999,
      activeIncidents: 999,
      topAttackType: "ddos",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText("999 active")).toBeInTheDocument()
    expect(screen.getByText(/9999 attacks\/min/)).toBeInTheDocument()
  })

  it("should render title 'Threat Level'", () => {
    const status: ThreatStatus = {
      level: "elevated",
      attacksPerMinute: 550,
      activeIncidents: 30,
      topAttackType: "ddos",
    }

    render(<ThreatLevelIndicator status={status} />)

    expect(screen.getByText("Threat Level")).toBeInTheDocument()
  })

  it("should render ShieldAlert icon", () => {
    const status: ThreatStatus = {
      level: "elevated",
      attacksPerMinute: 550,
      activeIncidents: 30,
      topAttackType: "ddos",
    }

    const { container } = render(<ThreatLevelIndicator status={status} />)

    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })
})
