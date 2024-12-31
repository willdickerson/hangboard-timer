import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('nosleep.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      enable: vi.fn(),
      disable: vi.fn(),
    })),
  }
})

globalThis.Audio = vi.fn().mockImplementation(() => ({
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  currentTime: 0,
}))
