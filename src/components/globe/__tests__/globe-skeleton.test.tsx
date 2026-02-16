import { render } from "@testing-library/react"
import { GlobeSkeleton } from "../globe-skeleton"

describe("GlobeSkeleton", () => {
  it("should render skeleton component", () => {
    const { container } = render(<GlobeSkeleton />)

    const skeleton = container.querySelector('[class*="animate-pulse"]')
    expect(skeleton).toBeInTheDocument()
  })

  it("should render with aspect-square class", () => {
    const { container } = render(<GlobeSkeleton />)

    const skeleton = container.querySelector('[class*="aspect-square"]')
    expect(skeleton).toBeInTheDocument()
  })

  it("should render with rounded-full class", () => {
    const { container } = render(<GlobeSkeleton />)

    const skeleton = container.querySelector('[class*="rounded-full"]')
    expect(skeleton).toBeInTheDocument()
  })

  it("should render with w-3/4 width", () => {
    const { container } = render(<GlobeSkeleton />)

    const skeleton = container.querySelector('[class*="w-3/4"]')
    expect(skeleton).toBeInTheDocument()
  })

  it("should center skeleton in container", () => {
    const { container } = render(<GlobeSkeleton />)

    const wrapper = container.querySelector('[class*="items-center justify-center"]')
    expect(wrapper).toBeInTheDocument()
  })

  it("should fill height and width of parent", () => {
    const { container } = render(<GlobeSkeleton />)

    const wrapper = container.querySelector('[class*="h-full w-full"]')
    expect(wrapper).toBeInTheDocument()
  })
})
