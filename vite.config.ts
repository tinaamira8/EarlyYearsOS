import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
        VitePWA({
          registerType: 'autoUpdate',
          manifest: {
            name: 'EarlyYearsOS',
            short_name: 'EYOS',
            description: 'Professional Educator Suite for Early Childhood Education',
            theme_color: '#0f172a',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'any',
            categories: ['education', 'productivity'],
            icons: [
              { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
              { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'gstatic-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ]
          }
        })
      ],
      envPrefix: ['VITE_'],
      define: {
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://sdtoksvbyqmghzunmlxl.supabase.co'),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkdG9rc3ZieXFtZ2h6dW5tbHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDIzNzAsImV4cCI6MjA4NjkxODM3MH0.UrrAkkeFK-7cZpUqo94xx3EzO57HlThyF9nWQrjhzDc'),
        'import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY': JSON.stringify('pk_live_51T5naJPJNExyUUex1Wr45RvF2IZcsTkOPhjkQON8iKa1bo1xrEpxQgXMDjAl0VFKHBqNIn3xZrP3NYRMn2vP0zIZ00O854jk4b'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
