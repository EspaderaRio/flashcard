importScripts("./generated-assets.js"); // Must define CACHE & ASSETS

const CACHE_NAME = CACHE;
const API_CACHE = 'api-cache-v1';

// Install and store cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate and clear old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== API_CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Enhanced fetch handler with better offline support
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Skip API calls to backend - cache them separately
  if (url.origin.includes("quiz-backend.espaderario.workers.dev")) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful API responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Return cached index.html for navigation requests
          return caches.match('/index.html') || caches.match('./');
        })
    );
    return;
  }

  // Network-first with cache fallback for other resources
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Return cached version
        return caches.match(event.request);
      })
  );
});

// Handle background sync for offline quiz submissions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

async function syncOfflineData() {
  // In a real implementation, this would sync offline quiz submissions
  console.log('Background sync triggered');
}
