
// Service Worker for Maker Brains
const CACHE_NAME = 'maker-brains-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/placeholder.svg',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip supabase API requests
  if (event.request.url.includes('supabase.co')) return;
  
  // Handle fetch event
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Return cached response immediately if available
        if (cachedResponse) {
          // Refresh cache in background
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);
            
          // Return cached response immediately
          return cachedResponse;
        }

        // If no cache, make network request
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the network response
            if (networkResponse && networkResponse.ok) {
              // Don't cache API responses
              if (!event.request.url.includes('/api/')) {
                cache.put(event.request, networkResponse.clone());
              }
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            // If fetch fails, we can't do much for non-cached resources
            return new Response('Network error occurred', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      });
    })
  );
});
