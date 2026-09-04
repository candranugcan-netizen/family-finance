import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Family Finance App',
    short_name: 'FamFin',
    description: 'Track your wealth, goals, and assets elegantly.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc', // slate-50
    theme_color: '#0f172a', // slate-900
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}