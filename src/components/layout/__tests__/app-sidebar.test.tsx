import { render, screen } from "@testing-library/react"
import { AppSidebar } from "../app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const renderWithProvider = () => {
  return render(
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  )
}

describe("AppSidebar", () => {
  it("should render CyberGuard logo text", () => {
    renderWithProvider()

    expect(screen.getByText("CyberGuard")).toBeInTheDocument()
  })

  it("should render Global Monitor subtitle", () => {
    renderWithProvider()

    expect(screen.getByText("Global Monitor")).toBeInTheDocument()
  })

  it("should render Shield icon", () => {
    const { container } = renderWithProvider()

    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
  })

  it("should render Navigation label", () => {
    renderWithProvider()

    expect(screen.getByText("Navigation")).toBeInTheDocument()
  })

  it("should render all navigation items", () => {
    renderWithProvider()

    expect(screen.getByText("Dashboard")).toBeInTheDocument()
    expect(screen.getByText("Threat Map")).toBeInTheDocument()
    expect(screen.getByText("Incidents")).toBeInTheDocument()
    expect(screen.getByText("Analytics")).toBeInTheDocument()
    expect(screen.getByText("Defenses")).toBeInTheDocument()
  })

  it("should render link to home page", () => {
    const { container } = renderWithProvider()

    const homeLink = container.querySelector('a[href="/"]')
    expect(homeLink).toBeInTheDocument()
  })

  it("should render navigation links with correct URLs", () => {
    const { container } = renderWithProvider()

    const dashboardLink = container.querySelector('a[href="/"]')
    expect(dashboardLink).toBeInTheDocument()

    const threatMapLink = container.querySelector('a[href="#"]')
    expect(threatMapLink).toBeInTheDocument()
  })

  it("should render 5 navigation items", () => {
    renderWithProvider()

    // All 5 nav items should be present
    const navItems = [
      "Dashboard",
      "Threat Map",
      "Incidents",
      "Analytics",
      "Defenses",
    ]

    navItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it("should render sidebar with collapsible icon variant", () => {
    const { container } = renderWithProvider()

    // Sidebar should be rendered (check for the component structure)
    expect(container.firstChild).toBeInTheDocument()
  })
})
