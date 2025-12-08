import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['lib/**/*.test.ts'],
    exclude: ['src/**/*.test.ts'],
    testTimeout: 30000, // CDK tests can be slower
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*.ts'],
      exclude: [
        'node_modules/',
        'test/',
        'cdk.out/',
        '**/*.d.ts',
        '**/*.js',
        'bin/',
        '**/*.test.ts',
        '**/*.spec.ts',
        'lib/stacks/constructs/mock-handler.ts', // Test utility file
        'lib/CDKConstructs.ts' // Constants file - no logic to test
      ],
      reportsDirectory: './coverage/infrastructure',
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 85,
        lines: 80,
        perFile: true
      },
      clean: true
    }
  }
});
