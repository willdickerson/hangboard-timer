import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.js',
        'src/types/',
        'src/main.tsx',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/__tests__/**',
        '**/__mocks__/**',
      ],
    },
  },
})
