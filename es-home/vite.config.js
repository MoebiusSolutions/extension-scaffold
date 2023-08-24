/// <reference types="vite/client" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const urlPath = process.env.URLPATH || ''

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills()],
  server: {
    host: '0.0.0.0',
    base: '/',
    port: 8080,
    strictPort: true,
  },
  preview: {
    port: 8080,
  },
  build: {
    minify: false,
    outDir: 'build',
    sourcemap: true,
  },
  base: urlPath
});
