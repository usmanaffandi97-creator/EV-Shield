const CACHE_NAME = 'ev-calc-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 1. Install & simpan file utama ke HP
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
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
