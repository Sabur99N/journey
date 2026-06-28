import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.js',
        registerType: 'autoUpdate',
        injectManifest: {
          injectionPoint: 'self.__WB_MANIFEST',
        },
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          short_name: "SaburJourney",
          name: "Sabur's Journey - Elite Frontend Tracker",
          description: "Personal growth companion to transform into an Elite Creative Frontend Engineer.",
          icons: [
            {
              src: "https://img.icons8.com/nolan/256/space-port.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable"
            },
            {
              src: "https://img.icons8.com/nolan/512/space-port.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any"
            }
          ],
          start_url: "/",
          background_color: "#03030b",
          theme_color: "#00f0ff",
          display: "standalone",
          orientation: "portrait"
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'formdata-polyfill/esm.min.js': path.resolve(__dirname, './src/utils/formdata-mock.ts'),
        'formdata-polyfill': path.resolve(__dirname, './src/utils/formdata-mock.ts'),
      },
    },
    optimizeDeps: {
      exclude: ['formdata-polyfill']
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
