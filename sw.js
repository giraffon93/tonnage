// build 6
const CACHE_NAME = "tonnage-m3-v6";

self.addEventListener("install", event => {
  self.skipWaiting(); // active immédiatement la nouvelle version
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // force l'app à utiliser la nouvelle version
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      fetch(event.request)
        .then(response => {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => cache.match(event.request))
    )
  );
});
