import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Make the Pusher client available globally for Echo's Ably connector
;(window as any).Pusher = Pusher

const ablyKey = import.meta.env.VITE_ABLY_KEY
  ? String(import.meta.env.VITE_ABLY_KEY).split(':')[0]
  : undefined

if (!ablyKey) {
  console.warn('VITE_ABLY_KEY is missing; realtime features will be disabled.')
}

export const echo = new Echo({
  broadcaster: 'ably',
  key: ablyKey,
  wsHost: 'realtime.ably.io',
  wsPort: 80,
  wssPort: 443,
  httpHost: 'rest.ably.io',
  forceTLS: true,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
})

const connector = (echo as any)?.connector as {
  pusher?: import('pusher-js')
}

if (connector?.pusher?.connection) {
  connector.pusher.connection.bind('state_change', (states: any) => {
    console.debug('Ably connection state change:', states)
  })

  connector.pusher.connection.bind('connected', () => {
    console.info('Ably connection established')
  })

  connector.pusher.connection.bind('error', (error: any) => {
    console.error('Ably connection error:', error)
  })
} else {
  console.warn('Echo connector not ready; realtime diagnostics unavailable')
}
