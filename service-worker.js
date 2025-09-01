const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/sas/',
  '/index.html',
  '/manifest.json',
  '/earthlink/index.html',
  '/radius/index.html',
  '/img/192.png',
  '/img/512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to cache files:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
