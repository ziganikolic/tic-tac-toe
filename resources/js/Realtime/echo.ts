import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Make the Pusher client available globally for Echo's Reverb connector
;(window as any).Pusher = Pusher

const reverbAppKey = import.meta.env.VITE_REVERB_APP_KEY
const reverbHost = import.meta.env.VITE_REVERB_HOST
const reverbPort = import.meta.env.VITE_REVERB_PORT
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME

if (!reverbAppKey) {
  console.warn(
    'VITE_REVERB_APP_KEY is missing; realtime features will be disabled.',
  )
}

export const echo = new Echo({
  broadcaster: 'reverb',
  key: reverbAppKey,
  wsHost: reverbHost,
  wsPort: reverbPort ?? 443,
  wssPort: reverbPort ?? 443,
  forceTLS: (reverbScheme ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],
})

const connector = (echo as any)?.connector as {
  pusher?: import('pusher-js')
}

if (connector?.pusher?.connection) {
  connector.pusher.connection.bind('state_change', (states: any) => {
    console.debug('Reverb connection state change:', states)
  })

  connector.pusher.connection.bind('connected', () => {
    console.info('Reverb connection established')
  })

  connector.pusher.connection.bind('error', (error: any) => {
    console.error('Reverb connection error:', error)
  })
} else {
  console.warn('Echo connector not ready; realtime diagnostics unavailable')
}
