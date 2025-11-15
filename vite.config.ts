import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        'cdk.out/',
        '**/*.d.ts',
        'bin/',
        'lib/**/*.js'
      ],
      thresholds: {
        branches: 90,
        statements: 90,
        functions: 90,
        perFile: true
      }
    }
  }
});
