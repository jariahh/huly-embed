import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['src/lib/__tests__/setup.ts'],
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/services/**/*.ts',
        'src/lib/components/huly-embed.component.ts',
        'src/lib/providers/**/*.ts',
      ],
      exclude: ['src/**/*.test.ts', 'src/__tests__/**', 'src/lib/__tests__/**'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
      },
    },
  },
});
