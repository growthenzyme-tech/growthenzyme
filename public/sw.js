
const CACHE_NAME = "growthenzyme-offline-v1";
const OFFLINE_IMAGE = "/offline/offline-gym.png";

// Cache the offline image when the service worker installs.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.add(OFFLINE_IMAGE);
    })
  );

  self.skipWaiting();
});

// Activate the new service worker.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// Serve the cached dog image when requested.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (
    event.request.method === "GET" &&
    url.origin === self.location.origin &&
    url.pathname === OFFLINE_IMAGE
  ) {
    event.respondWith(
      caches.match(OFFLINE_IMAGE).then((cachedImage) => {
        return cachedImage || fetch(event.request);
      })
    );
  }
});
