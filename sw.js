/*
 * ============================================================================
 * Game Board - Service Worker Version History
 * ============================================================================
 * v1.1 (2026-11-21) - Switched icon to icon.png for Android PWA installability
 *                     and updated cached app assets.
 * v1.1 (2026-11-20) - Updated app icon to blue circle with white runner.
 * v1.0 (2026-11-20) - Initial PWA release with Firestore live sync and
 *                     offline asset caching.
 * ============================================================================
 */

const CACHE_NAME = 'game-board-v1.1';
const ASSETS = [
  './',
  './index.html',
  './icon.png',
  './manifest.json'
];

// Install and cache assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Clean up old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
      ),
      clients.claim() // Takes control of all open pages immediately
    ])
  );
});
