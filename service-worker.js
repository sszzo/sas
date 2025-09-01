const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/sas/',
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
