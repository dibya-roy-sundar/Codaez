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
        description: 'Codaez Web App',
        theme_color: '#000',
        background_color: '#000',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/codaez.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
        // orientation: 'portrait'
      },
    }),
  ],
})
