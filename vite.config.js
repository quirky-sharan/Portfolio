import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // e.g. https://sharansoni.vercel.app — used for canonical + social-card URLs
  const site = (env.VITE_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '').replace(/\/$/, '')
  const siteUrl = site && !site.startsWith('http') ? `https://${site}` : site

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'site-url',
        transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
      },
    ],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1200,
    },
  }
})
