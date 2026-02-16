import { cn } from "../utils"

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("text-red-500", "bg-blue-500")
    expect(result).toBe("text-red-500 bg-blue-500")
  })

  it("should handle empty inputs", () => {
    const result = cn()
    expect(result).toBe("")
  })

  it("should handle undefined and null values", () => {
    const result = cn("text-red-500", undefined, null, "bg-blue-500")
    expect(result).toBe("text-red-500 bg-blue-500")
  })

  it("should handle falsy values", () => {
    const result = cn("text-red-500", false && "hidden", 0 && "opacity-0", "bg-blue-500")
    expect(result).toBe("text-red-500 bg-blue-500")
  })

  it("should handle conditional classes", () => {
    const isActive = true
    const result = cn("base-class", isActive && "active-class")
    expect(result).toBe("base-class active-class")
  })

  it("should resolve Tailwind class conflicts (later class wins)", () => {
    const result = cn("p-4", "p-8")
    expect(result).toBe("p-8")
  })

  it("should handle arrays of class names", () => {
    const result = cn(["text-red-500", "bg-blue-500"])
    expect(result).toBe("text-red-500 bg-blue-500")
  })

  it("should handle objects with boolean values", () => {
    const result = cn({
      "text-red-500": true,
      "bg-blue-500": true,
      "hidden": false,
    })
    expect(result).toBe("text-red-500 bg-blue-500")
  })

  it("should handle complex combinations", () => {
    const result = cn(
      "base-class",
      ["conditional-1", "conditional-2"],
      { "object-class": true, "hidden": false },
      undefined,
      "final-class"
    )
    expect(result).toBe("base-class conditional-1 conditional-2 object-class final-class")
  })

  it("should resolve complex Tailwind conflicts", () => {
    const result = cn("px-4 py-2", "p-8")
    expect(result).toBe("p-8")
  })

  it("should handle empty strings", () => {
    const result = cn("text-red-500", "", "bg-blue-500")
    expect(result).toBe("text-red-500 bg-blue-500")
  })

  it("should handle whitespace", () => {
    const result = cn("  text-red-500  ", "  bg-blue-500  ")
    expect(result).toBe("text-red-500 bg-blue-500")
  })
})
