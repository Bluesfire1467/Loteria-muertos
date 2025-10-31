// Setup para tests con Vitest
import { vi } from 'vitest'

// Mock de window.setInterval y clearInterval para tests
Object.defineProperty(window, 'setInterval', {
  value: vi.fn((callback: Function, delay: number) => {
    return setTimeout(callback, delay)
  })
})

Object.defineProperty(window, 'clearInterval', {
  value: vi.fn((id: number) => {
    clearTimeout(id)
  })
})