import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    appType: 'spa' as const,
    plugins: [
      react(),
      tailwindcss(),
      // VitePWA({
      //   registerType: 'autoUpdate',
      //   includeAssets: ['apple-touch-icon.png', 'icon.svg'],
      //   manifest: {
      //     id: '/',
      //     name: 'گالری لوستر اکبر صالحی',
      //     short_name: 'لوستر صالحی',
      //     description: 'گالری لوستر اکبر صالحی - خرید آنلاین و مشاوره تخصصی لوستر و آینه شمعدان',
      //     theme_color: '#121212',
      //     background_color: '#121212',
      //     display: 'standalone',
      //     start_url: '/',
      //     scope: '/',
      //     icons: [
      //       {
      //         src: '/pwa-192x192.png',
      //         sizes: '192x192',
      //         type: 'image/png',
      //         purpose: 'any',
      //       },
      //       {
      //         src: '/pwa-512x512.png',
      //         sizes: '512x512',
      //         type: 'image/png',
      //         purpose: 'any',
      //       },
      //       {
      //         src: '/pwa-maskable-512x512.png',
      //         sizes: '512x512',
      //         type: 'image/png',
      //         purpose: 'maskable',
      //       },
      //     ],
      //   },
      //   workbox: {
      //     maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      //   },
      //   devOptions: { enabled: true, type: 'module' },
      // }),
    ],
    esbuild: {
      sourcemap: false,
    },
    css: {
      devSourcemap: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
