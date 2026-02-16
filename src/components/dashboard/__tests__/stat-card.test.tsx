import { render, screen } from "@testing-library/react"
import { StatCard } from "../stat-card"
import { Activity } from "lucide-react"

describe("StatCard", () => {
  it("should render title and value", () => {
    render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        icon={Activity}
      />
    )

    expect(screen.getByText("Total Attacks")).toBeInTheDocument()
    expect(screen.getByText("1,234")).toBeInTheDocument()
  })

  it("should render numeric value", () => {
    render(
      <StatCard
        title="Active Threats"
        value={42}
        icon={Activity}
      />
    )

    expect(screen.getByText("42")).toBeInTheDocument()
  })

  it("should render description when provided", () => {
    render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        description="from last hour"
        icon={Activity}
      />
    )

    expect(screen.getByText("from last hour")).toBeInTheDocument()
  })

  it("should not render description section when not provided", () => {
    const { container } = render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        icon={Activity}
      />
    )

    const description = container.querySelector("p")
    expect(description).not.toBeInTheDocument()
  })

  it("should render positive trend correctly", () => {
    render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        icon={Activity}
        trend={{ value: 12, positive: true }}
      />
    )

    expect(screen.getByText(/\+12%/)).toBeInTheDocument()
    const trendElement = screen.getByText(/\+12%/)
    expect(trendElement).toHaveClass("text-emerald-500")
  })

  it("should render negative trend correctly", () => {
    render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        icon={Activity}
        trend={{ value: -8, positive: false }}
      />
    )

    expect(screen.getByText(/-8%/)).toBeInTheDocument()
    const trendElement = screen.getByText(/-8%/)
    expect(trendElement).toHaveClass("text-red-500")
  })

  it("should render trend with description", () => {
    render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        description="from last hour"
        icon={Activity}
        trend={{ value: 12, positive: true }}
      />
    )

    expect(screen.getByText(/\+12%/)).toBeInTheDocument()
    expect(screen.getByText(/from last hour/)).toBeInTheDocument()
  })

  it("should render zero value", () => {
    render(
      <StatCard
        title="Blocked Attacks"
        value={0}
        icon={Activity}
      />
    )

    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("should render large numbers", () => {
    render(
      <StatCard
        title="Total Attacks"
        value="1,234,567"
        icon={Activity}
      />
    )

    expect(screen.getByText("1,234,567")).toBeInTheDocument()
  })

  it("should render zero trend value", () => {
    render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        icon={Activity}
        trend={{ value: 0, positive: true }}
      />
    )

    expect(screen.getByText(/\+0%/)).toBeInTheDocument()
  })

  it("should apply correct CSS classes to card container", () => {
    const { container } = render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        icon={Activity}
      />
    )

    const card = container.firstChild
    expect(card).toBeInTheDocument()
  })

  it("should render icon", () => {
    const { container } = render(
      <StatCard
        title="Total Attacks"
        value="1,234"
        icon={Activity}
      />
    )

    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })
})
