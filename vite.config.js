import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ['3100c0b7-b757-45e5-abfb-c6edb1b7efb5-00-94yyiwel8ck7.janeway.replit.dev']
  },
})
