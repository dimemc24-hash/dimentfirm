import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import path from 'path'

const publicRoutes = [
  // '/' is auto-detected from index.html — do not list it again
  '/bankruptcy',
  '/sheldon',
  '/hariette',
  '/family-law',
  '/small-business',
  '/taxes',
  '/blog',
  '/blog/how-chapter-7-works-louisiana',
  '/blog/louisiana-bankruptcy-exemptions',
  '/blog/chapter-7-vs-chapter-13',
  '/blog/bankruptcy-credit-report',
  '/blog/keep-car-bankruptcy-louisiana',
  '/blog/bankruptcy-means-test',
]

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://dimentfirm.com',
      dynamicRoutes: publicRoutes,
      exclude: ['/404'],
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
      readable: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/**/*.d.ts',
      ],
    },
  },
})
