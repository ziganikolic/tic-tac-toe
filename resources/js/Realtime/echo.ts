import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Make the Pusher client available for Echo
;(window as any).Pusher = Pusher

export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 6001,
  wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 6001,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
})
