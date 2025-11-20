import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'node_modules/',
        'test/',
        'cdk.out/',
        '**/*.d.ts',
        '**/*.js',
        'bin/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'src/commands/**',
        'src/domains/habit/types/**'
      ],
      thresholds: {
        branches: 70,
        statements: 70,
        functions: 70,
        perFile: true,
        '**/domains/habit/models/**': {
          branches: 95,
          statements: 95,
          functions: 95
        }
      },
      clean: true
    }
  }
});
