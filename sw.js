importScripts("./generated-assets.js"); // Must define CACHE & ASSETS

// Install and store cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate and clear old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE) // Remove outdated caches automatically
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Skip API calls to backend
  if (url.origin.includes("quiz-backend.espaderario.workers.dev")) {
    return event.respondWith(fetch(event.request));
  }

  // Network-first with cache fallback (best for PWA apps)
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const resClone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // offline support
  );
});
