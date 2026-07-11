const CACHE_NAME = 'goturkey-static-v1';

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Let everything cross-origin (Firebase Auth/Firestore/Storage, Google Fonts,
  // etc.) and any /api/* route hit the network directly — never intercepted.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return;
  }

  if (request.mode === 'navigate') {
    // Page loads: always prefer the network so content stays fresh; only
    // fall back to a cached copy if the network is unavailable.
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Same-origin static assets (icons, manifest, favicon, hashed /_next/static
  // chunks, etc.): serve from cache instantly, refresh in the background.
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
