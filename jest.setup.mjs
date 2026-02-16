import '@testing-library/jest-dom'

// Mock window.matchMedia (required by useIsMobile hook)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver (required by Recharts)
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock HTMLElement offsetWidth and offsetHeight (required for canvas sizing)
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 800,
})

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 600,
})

// Mock Canvas and WebGL context (required by cobe globe rendering)
HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
  if (contextType === '2d') {
    return {
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(),
      putImageData: jest.fn(),
      createImageData: jest.fn(),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    }
  } else if (contextType === 'webgl' || contextType === 'webgl2') {
    // Full WebGL API mock for cobe
    return {
      canvas: document.createElement('canvas'),
      drawingBufferWidth: 800,
      drawingBufferHeight: 600,
      getParameter: jest.fn(),
      getExtension: jest.fn(),
      createShader: jest.fn(() => ({})),
      shaderSource: jest.fn(),
      compileShader: jest.fn(),
      getShaderParameter: jest.fn(() => true),
      createProgram: jest.fn(() => ({})),
      attachShader: jest.fn(),
      linkProgram: jest.fn(),
      getProgramParameter: jest.fn(() => true),
      useProgram: jest.fn(),
      createBuffer: jest.fn(() => ({})),
      bindBuffer: jest.fn(),
      bufferData: jest.fn(),
      enableVertexAttribArray: jest.fn(),
      vertexAttribPointer: jest.fn(),
      getAttribLocation: jest.fn(() => 0),
      getUniformLocation: jest.fn(() => ({})),
      uniform1f: jest.fn(),
      uniform2f: jest.fn(),
      uniform3f: jest.fn(),
      uniform4f: jest.fn(),
      uniformMatrix4fv: jest.fn(),
      createTexture: jest.fn(() => ({})),
      bindTexture: jest.fn(),
      texImage2D: jest.fn(),
      texParameteri: jest.fn(),
      activeTexture: jest.fn(),
      clearColor: jest.fn(),
      clear: jest.fn(),
      enable: jest.fn(),
      disable: jest.fn(),
      blendFunc: jest.fn(),
      viewport: jest.fn(),
      drawArrays: jest.fn(),
      drawElements: jest.fn(),
      deleteShader: jest.fn(),
      deleteProgram: jest.fn(),
      deleteBuffer: jest.fn(),
      deleteTexture: jest.fn(),
      ARRAY_BUFFER: 0x8892,
      ELEMENT_ARRAY_BUFFER: 0x8893,
      STATIC_DRAW: 0x88e4,
      DYNAMIC_DRAW: 0x88e8,
      FLOAT: 0x1406,
      VERTEX_SHADER: 0x8b31,
      FRAGMENT_SHADER: 0x8b30,
      COMPILE_STATUS: 0x8b81,
      LINK_STATUS: 0x8b82,
      COLOR_BUFFER_BIT: 0x4000,
      DEPTH_BUFFER_BIT: 0x0100,
      BLEND: 0x0be2,
      DEPTH_TEST: 0x0b71,
      SRC_ALPHA: 0x0302,
      ONE_MINUS_SRC_ALPHA: 0x0303,
      TEXTURE_2D: 0x0de1,
      TEXTURE0: 0x84c0,
      RGBA: 0x1908,
      UNSIGNED_BYTE: 0x1401,
      TEXTURE_MIN_FILTER: 0x2801,
      TEXTURE_MAG_FILTER: 0x2800,
      LINEAR: 0x2601,
      TRIANGLES: 0x0004,
    }
  }
  return null
})

// Suppress console errors in tests (optional - remove if you want to see them)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
