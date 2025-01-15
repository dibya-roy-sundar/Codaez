import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Codaez',
        short_name: 'Codaez',
        description: 'Analyze, Improve, Dominate Together',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/favicon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          // {
          //   src: '/icons/icon-512x512.png',
          //   sizes: '512x512',
          //   type: 'image/png',
          // },
        ],
        orientation: 'portrait'
      },
    }),
  ],
})
