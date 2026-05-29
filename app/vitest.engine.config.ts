import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/app/features/haulage-des/engine/**/*.spec.ts'],
    environment: 'node',
  },
});
