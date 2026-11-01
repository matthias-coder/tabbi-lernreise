// Lernreise Offline Service Worker (Network-First for instant development & cache fallback for offline)

const CACHE_NAME = 'lernreise-offline-v2';

const CORE_ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'css/lernreise.css',
  'js/app.js',
  'js/core/assets.js',
  'js/core/audio.js',
  'js/core/storage.js',
  'js/core/scoring.js',
  'js/core/rewards.js',
  'js/core/progression.js',
  'content/avatar-catalog.js',
  'content/sticker-catalog.js',
  'content/subjects.js',
  'content/mathe-content.js',
  'content/deutsch-content.js',
  'js/views/header-bar.js',
  'js/views/profile-view.js',
  'js/views/hub-view.js',
  'js/views/journey-view.js',
  'js/views/exercise-view.js',
  'js/views/summary-view.js',
  'js/views/avatar-view.js',
  'js/views/album-view.js',
  'js/views/parent-view.js',
  'assets/haende/hand_L_0.svg',
  'assets/haende/hand_L_1.svg',
  'assets/haende/hand_L_2.svg',
  'assets/haende/hand_L_3.svg',
  'assets/haende/hand_L_4.svg',
  'assets/haende/hand_L_5.svg',
  'assets/haende/hand_R_0.svg',
  'assets/haende/hand_R_1.svg',
  'assets/haende/hand_R_2.svg',
  'assets/haende/hand_R_3.svg',
  'assets/haende/hand_R_4.svg',
  'assets/haende/hand_R_5.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Network-First: Always fetch the newest version, update cache, and fallback to cache if offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html') || caches.match('index.html');
          }
        });
      })
  );
});
