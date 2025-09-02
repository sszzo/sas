const CACHE_NAME = 'my-pwa-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/earthlink/index.html',
  '/earthlink/script.js',
  '/earthlink/style.css',
  '/radius/index.html',
  '/radius/1.js',
  '/radius/2.js',
  '/radius/style.css',
  'https://raw.githubusercontent.com/sszzo/sas/refs/heads/main/img/192.png',
  'https://raw.githubusercontent.com/sszzo/sas/refs/heads/main/img/512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline pages');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match('index.html');
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  }
});
