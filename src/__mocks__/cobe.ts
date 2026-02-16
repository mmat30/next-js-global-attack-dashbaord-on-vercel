// Mock implementation of cobe library for testing
// This avoids WebGL complexity in tests

const createGlobe = jest.fn(() => ({
  destroy: jest.fn(),
}))

export default createGlobe
export { createGlobe }
