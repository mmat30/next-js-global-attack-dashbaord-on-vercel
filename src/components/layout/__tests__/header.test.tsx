import { render, screen } from "@testing-library/react"
import { Header } from "../header"
import { SidebarProvider } from "@/components/ui/sidebar"

// Mock ThemeToggle component
jest.mock("../theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Toggle</button>,
}))

const renderWithProvider = () => {
  return render(
    <SidebarProvider>
      <Header />
    </SidebarProvider>
  )
}

describe("Header", () => {
  it("should render breadcrumb text", () => {
    renderWithProvider()

    expect(screen.getByText("Global Attack Dashboard")).toBeInTheDocument()
  })

  it("should render ThemeToggle component", () => {
    renderWithProvider()

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument()
  })

  it("should render SidebarTrigger", () => {
    const { container } = renderWithProvider()

    // SidebarTrigger should be rendered
    expect(container.querySelector("button")).toBeInTheDocument()
  })

  it("should render separator", () => {
    const { container } = renderWithProvider()

    // Separator should be rendered
    const separator = container.querySelector('[class*="h-4"]')
    expect(separator).toBeInTheDocument()
  })

  it("should apply correct header classes", () => {
    const { container } = renderWithProvider()

    const header = container.querySelector("header")
    expect(header).toHaveClass("flex")
    expect(header).toHaveClass("h-14")
    expect(header).toHaveClass("border-b")
  })

  it("should render breadcrumb list", () => {
    renderWithProvider()

    // BreadcrumbList structure should be present
    expect(screen.getByText("Global Attack Dashboard")).toBeInTheDocument()
  })

  it("should position elements with justify-between", () => {
    const { container } = renderWithProvider()

    const header = container.querySelector("header")
    expect(header).toHaveClass("justify-between")
  })

  it("should apply padding to header", () => {
    const { container } = renderWithProvider()

    const header = container.querySelector("header")
    expect(header).toHaveClass("px-4")
  })

  it("should render left section with sidebar trigger and breadcrumb", () => {
    const { container } = renderWithProvider()

    const leftSection = container.querySelector('[class*="flex items-center gap-2"]')
    expect(leftSection).toBeInTheDocument()
  })

  it("should render right section with ThemeToggle", () => {
    renderWithProvider()

    const themeToggle = screen.getByTestId("theme-toggle")
    expect(themeToggle).toBeInTheDocument()
  })
})
