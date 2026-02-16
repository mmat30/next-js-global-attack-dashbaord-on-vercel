import { render, screen } from "@testing-library/react"
import { TopTargetedCountries } from "../top-targeted-countries"
import type { CountryAttackStat } from "@/lib/mock-data"

describe("TopTargetedCountries", () => {
  const mockCountries: CountryAttackStat[] = [
    { country: "United States", countryCode: "US", attacks: 5000 },
    { country: "United Kingdom", countryCode: "GB", attacks: 4000 },
    { country: "Germany", countryCode: "DE", attacks: 3000 },
    { country: "Japan", countryCode: "JP", attacks: 2000 },
    { country: "France", countryCode: "FR", attacks: 1000 },
  ]

  it("should render card title", () => {
    render(<TopTargetedCountries countries={mockCountries} />)

    expect(screen.getByText("Top Targeted Countries")).toBeInTheDocument()
  })

  it("should render all countries", () => {
    render(<TopTargetedCountries countries={mockCountries} />)

    expect(screen.getByText("United States")).toBeInTheDocument()
    expect(screen.getByText("United Kingdom")).toBeInTheDocument()
    expect(screen.getByText("Germany")).toBeInTheDocument()
    expect(screen.getByText("Japan")).toBeInTheDocument()
    expect(screen.getByText("France")).toBeInTheDocument()
  })

  it("should render attack counts with thousand separators", () => {
    render(<TopTargetedCountries countries={mockCountries} />)

    expect(screen.getByText("5,000")).toBeInTheDocument()
    expect(screen.getByText("4,000")).toBeInTheDocument()
    expect(screen.getByText("3,000")).toBeInTheDocument()
    expect(screen.getByText("2,000")).toBeInTheDocument()
    expect(screen.getByText("1,000")).toBeInTheDocument()
  })

  it("should render ranking numbers (1-5)", () => {
    render(<TopTargetedCountries countries={mockCountries} />)

    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("4")).toBeInTheDocument()
    expect(screen.getByText("5")).toBeInTheDocument()
  })

  it("should render progress bars for each country", () => {
    const { container } = render(<TopTargetedCountries countries={mockCountries} />)

    const progressBars = container.querySelectorAll('[class*="bg-primary"]')
    expect(progressBars).toHaveLength(5)
  })

  it("should scale progress bar width correctly (first country at 100%)", () => {
    const { container } = render(<TopTargetedCountries countries={mockCountries} />)

    const progressBars = container.querySelectorAll('[class*="bg-primary"]')
    const firstProgressBar = progressBars[0] as HTMLElement

    expect(firstProgressBar.style.width).toBe("100%")
  })

  it("should scale progress bar width correctly (proportional to attacks)", () => {
    const { container } = render(<TopTargetedCountries countries={mockCountries} />)

    const progressBars = container.querySelectorAll('[class*="bg-primary"]')
    const secondProgressBar = progressBars[1] as HTMLElement

    // Second country has 4000 attacks, max is 5000, so 80%
    expect(secondProgressBar.style.width).toBe("80%")
  })

  it("should handle empty countries array", () => {
    render(<TopTargetedCountries countries={[]} />)

    expect(screen.getByText("Top Targeted Countries")).toBeInTheDocument()
    expect(screen.queryByText("United States")).not.toBeInTheDocument()
  })

  it("should handle single country", () => {
    const singleCountry: CountryAttackStat[] = [
      { country: "United States", countryCode: "US", attacks: 5000 },
    ]

    render(<TopTargetedCountries countries={singleCountry} />)

    expect(screen.getByText("United States")).toBeInTheDocument()
    expect(screen.getByText("5,000")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("should render MapPin icon", () => {
    const { container } = render(<TopTargetedCountries countries={mockCountries} />)

    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })

  it("should handle large attack numbers with proper formatting", () => {
    const largeNumbers: CountryAttackStat[] = [
      { country: "United States", countryCode: "US", attacks: 1234567 },
    ]

    render(<TopTargetedCountries countries={largeNumbers} />)

    expect(screen.getByText("1,234,567")).toBeInTheDocument()
  })

  it("should handle zero attacks", () => {
    const zeroAttacks: CountryAttackStat[] = [
      { country: "United States", countryCode: "US", attacks: 0 },
    ]

    render(<TopTargetedCountries countries={zeroAttacks} />)

    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("should calculate progress bar width correctly when max is 0", () => {
    const zeroAttacks: CountryAttackStat[] = [
      { country: "United States", countryCode: "US", attacks: 0 },
    ]

    const { container } = render(<TopTargetedCountries countries={zeroAttacks} />)

    const progressBars = container.querySelectorAll('[class*="bg-primary"]')
    const firstProgressBar = progressBars[0] as HTMLElement

    // When max is 0, it defaults to 1, so 0/1 = 0%
    expect(firstProgressBar.style.width).toBe("0%")
  })

  it("should render countries in descending order by attacks", () => {
    render(<TopTargetedCountries countries={mockCountries} />)

    const countries = screen.getAllByText(/^(United States|United Kingdom|Germany|Japan|France)$/)

    expect(countries[0]).toHaveTextContent("United States")
    expect(countries[1]).toHaveTextContent("United Kingdom")
    expect(countries[2]).toHaveTextContent("Germany")
    expect(countries[3]).toHaveTextContent("Japan")
    expect(countries[4]).toHaveTextContent("France")
  })
})
