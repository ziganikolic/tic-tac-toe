/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

// self.__WB_MANIFEST is injected by the PWA plugin
precacheAndRoute(self.__WB_MANIFEST);

// TODO: runtime cache for images/sprites
