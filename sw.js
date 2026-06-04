const CACHE_NAME = "tonnage-m3-v2";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./multi.html",
  "./manifest.json",
  "./icon.png"
];

// Installation : cache les fichiers
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting(); // active immédiatement la nouvelle version
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
  self.clients.claim(); // prend le contrôle des pages ouvertes
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

// 🔄 Auto‑update : recharge les pages quand une nouvelle version est prête
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
