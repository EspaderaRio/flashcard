const CACHE = "flashcards-v1";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll([
        "./",
        "./index.html",
        "./app.js",
        "./manifest.json",
        "./styles.css",
        "./icons/add.svg",
        "./icons/ai.svg",
        "./icons/import.svg",
        "./icons/flashcard.svg"
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  
  if (url.origin.includes("quiz-backend.espaderario.workers.dev")) {
    return; 
  }

  event.respondWith(
    fetch(event.request)
  );
});
