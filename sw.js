const CACHE_NAME = "tonnage-m3-v9";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./simple.html",
  "./multi.html",
  "./tranches.html",
  "./manifest.json",
  "./icon.png"
];

// Installation : active immédiatement
self.addEventListener("install", event => {
  self.skipWaiting();
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
  clients.claim();
});

// Fetch : réseau d'abord pour TOUT sauf images
self.addEventListener("fetch", event => {
  const url = event.request.url;

  // HTML / JS / CSS → jamais de cache
  if (
    url.endsWith(".html") ||
    url.endsWith(".js") ||
    url.endsWith(".css")
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Images / manifest → cache + mise à jour
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

// Auto-update
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
