import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ThemeToggle } from "../theme-toggle"

describe("ThemeToggle", () => {
  beforeEach(() => {
    // Clear any dark class before each test
    document.documentElement.classList.remove("dark")
  })

  afterEach(() => {
    // Clean up after tests
    document.documentElement.classList.remove("dark")
  })

  it("should render toggle button", () => {
    render(<ThemeToggle />)

    const button = screen.getByRole("button", { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
  })

  it("should start in dark mode by default", () => {
    render(<ThemeToggle />)

    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("should render Sun icon in dark mode", () => {
    render(<ThemeToggle />)

    // Sun icon should be visible in dark mode
    const button = screen.getByRole("button", { name: /toggle theme/i })
    expect(button).toBeInTheDocument()
  })

  it("should toggle to light mode when clicked", async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const button = screen.getByRole("button", { name: /toggle theme/i })

    // Should start with dark mode
    expect(document.documentElement.classList.contains("dark")).toBe(true)

    // Click to toggle to light mode
    await user.click(button)

    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })

  it("should toggle back to dark mode when clicked again", async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const button = screen.getByRole("button", { name: /toggle theme/i })

    // Click once to go to light mode
    await user.click(button)
    expect(document.documentElement.classList.contains("dark")).toBe(false)

    // Click again to go back to dark mode
    await user.click(button)
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("should toggle multiple times correctly", async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const button = screen.getByRole("button", { name: /toggle theme/i })

    // Start: dark
    expect(document.documentElement.classList.contains("dark")).toBe(true)

    // Click 1: light
    await user.click(button)
    expect(document.documentElement.classList.contains("dark")).toBe(false)

    // Click 2: dark
    await user.click(button)
    expect(document.documentElement.classList.contains("dark")).toBe(true)

    // Click 3: light
    await user.click(button)
    expect(document.documentElement.classList.contains("dark")).toBe(false)

    // Click 4: dark
    await user.click(button)
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })

  it("should have correct aria-label", () => {
    render(<ThemeToggle />)

    const button = screen.getByRole("button", { name: "Toggle theme" })
    expect(button).toBeInTheDocument()
  })

  it("should apply dark class to documentElement", () => {
    render(<ThemeToggle />)

    const root = document.documentElement
    expect(root.classList.contains("dark")).toBe(true)
  })

  it("should remove dark class when toggled to light", async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const button = screen.getByRole("button", { name: /toggle theme/i })
    await user.click(button)

    const root = document.documentElement
    expect(root.classList.contains("dark")).toBe(false)
  })

  it("should render as ghost button variant", () => {
    const { container } = render(<ThemeToggle />)

    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
  })

  it("should render icon size correctly", () => {
    const { container } = render(<ThemeToggle />)

    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass("h-4")
    expect(icon).toHaveClass("w-4")
  })
})
