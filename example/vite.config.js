import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  base: './',
  root: './src',
  build: {
    outDir: '../out',
    emptyOutDir: true
  },
  plugins: [solidPlugin()]
})
