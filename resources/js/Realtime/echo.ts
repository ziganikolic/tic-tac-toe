import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Make the Pusher client available for Echo
;(window as any).Pusher = Pusher

console.log('Echo config (Pusher):', {
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  host: import.meta.env.VITE_PUSHER_HOST,
  port: import.meta.env.VITE_PUSHER_PORT,
  scheme: import.meta.env.VITE_PUSHER_SCHEME,
})

export const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
  wsHost:
    import.meta.env.VITE_PUSHER_HOST ??
    `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
  wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
  wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
})
