import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Make the Pusher client available for Echo
;(window as any).Pusher = Pusher

console.log('Echo config (Pusher):', {
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: (import.meta.env.VITE_PUSHER_SCHEME || 'https') === 'https',
})

export const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: (import.meta.env.VITE_PUSHER_SCHEME || 'https') === 'https',
})
