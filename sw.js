const CACHE_NAME = 'ev-calc-v5';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => 
    Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});

// 2. Aktifkan Cache
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// 3. Ambil dari memori HP jika offline (Flight Mode)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Berhasil dibuka tanpa internet
      }
      return fetch(e.request); // Mengambil dari internet jika online
    })
  );
});
