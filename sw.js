const CACHE_NAME = "tonnage-m3-v6";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./simple.html",
  "./multi.html",
  "./tranches.html",
  "./manifest.json",
  "./icon.png"
];

// Installation : cache + activation immédiate + prise de contrôle
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();     // active immédiatement la nouvelle version
  self.clients.claim();   // prend le contrôle direct des pages
});

// Activation : supprime les anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // contrôle total
});

// Fetch : cache + mise à jour réseau
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
          return networkResponse;
        })
        .catch(() => response);

      return response || fetchPromise;
    })
  );
});

// Auto‑update : permet à app.js de forcer skipWaiting()
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
