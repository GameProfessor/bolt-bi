/**
 * Test Setup
 * Global test configuration và setup
 */

import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock fetch
global.fetch = vi.fn()

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

// Vue Test Utils global config
config.global.stubs = {
  // Stub out router-link and router-view
  'router-link': true,
  'router-view': true,
}

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: vi.fn(() => ({
    destroy: vi.fn(),
    update: vi.fn(),
    resize: vi.fn(),
  })),
  registerables: [],
}))

// Mock vue-chartjs
vi.mock('vue-chartjs', () => ({
  Bar: vi.fn(),
  Line: vi.fn(),
  Pie: vi.fn(),
  Doughnut: vi.fn(),
  Radar: vi.fn(),
  PolarArea: vi.fn(),
  Bubble: vi.fn(),
  Scatter: vi.fn(),
}))

// Mock GridStack
vi.mock('gridstack', () => ({
  GridStack: {
    init: vi.fn(() => ({
      destroy: vi.fn(),
      addWidget: vi.fn(),
      removeWidget: vi.fn(),
      update: vi.fn(),
    })),
  },
}))

// Mock Papa Parse
vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn((input, config) => {
      config?.complete?.({
        data: [],
        errors: [],
        meta: {}
      })
    })
  }
}))

// Console warnings/errors in tests
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('[Vue warn]')
    ) {
      return
    }
    originalError.call(console, ...args)
  }

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('[Vue warn]')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})
