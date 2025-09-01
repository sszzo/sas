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

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
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

self.addEventListener('fetch', function(event) {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              return cache.match('index.html'); // عرض الصفحة الرئيسية من ذاكرة التخزين المؤقت عند عدم الاتصال
            });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // الكائن المستجيب موجود في ذاكرة التخزين المؤقت - قم بإرجاعه.
          if (response) {
            return response;
          }

          // لم يتم العثور على الكائن المستجيب في ذاكرة التخزين المؤقت - قم بجلب مورد جديد من الشبكة.
          return fetch(event.request).then(
            function(response) {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // الكائن المستجيب صالح - قم بتخزينه مؤقتًا وإرجاعه.
              var responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        })
    );
  }
});
