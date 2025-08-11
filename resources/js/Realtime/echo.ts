import Echo from 'laravel-echo'

// TODO: Initialize Echo using Reverb env variables (VITE_REVERB_*)
// Example configuration:
// export const echo = new Echo({
//   broadcaster: 'reverb',
//   key: import.meta.env.VITE_REVERB_APP_KEY,
//   wsHost: import.meta.env.VITE_REVERB_HOST,
//   wsPort: parseInt(import.meta.env.VITE_REVERB_PORT || '443'),
//   wssPort: parseInt(import.meta.env.VITE_REVERB_PORT || '443'),
//   forceTLS: false,
//   enabledTransports: ['ws', 'wss'],
// })

export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT) || 6001,
  wssPort: Number(import.meta.env.VITE_REVERB_PORT) || 6001,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
})
