import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { boot } from 'quasar/wrappers';
import { useActionQueue } from 'src/composables/queue';
import { QueueEvent } from 'src/types/resource';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    Echo: Echo;
    Pusher: typeof Pusher;
  }
}

console.warn('E N V', process.env.REVERB_APP_KEY)

// window.Pusher = Pusher;
const echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.REVERB_APP_KEY,
    wsHost: process.env.REVERB_HOST,
    wsPort: process.env.REVERB_PORT,
    wssPort: process.env.REVERB_PORT,
    forceTLS: (process.env.REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws'],
    // authEndpoint: process.env.API_URL + '/broadcasting/auth',

});


export default boot(({ app, router }) => {

  app.config.globalProperties.Pusher = Pusher;
  app.config.globalProperties.Echo = echo;

  const { list, removeQueueList } = useActionQueue()

  echo.channel('app-channel')
    // .listenToAll()
    .listen('.action', (event: QueueEvent) => {
      console.warn('socket-action.list', event);
      const rawIndex = list.value.findIndex(e => e.key = event.key)
      if (rawIndex >= 0) {
        const raw = list.value[rawIndex]
        if (raw.redirect) {
          const location = typeof raw.redirect === 'function'
            ? raw.redirect(event.data)
            : raw.redirect
          router.replace(location)
        }

        removeQueueList(rawIndex)
      }
    });

});

export { echo };
