import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Riot ID Check-in',
    short_name: 'RID Check-in',
    description: 'A Riot player card generator and check-in tool.',
    start_url: '/checkin',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/assets/rcardlogo_192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: "maskable"
      },
      {
        src: '/assets/rcardlogo_512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: "maskable"
      },
    ],
  }
}