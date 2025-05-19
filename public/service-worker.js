
const CACHE_NAME = 'sciconnect-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/bangla-lesson.json',
  '/assets/english-lesson.json'
];

// Voice-related assets that should be cached
const voiceAssets = [
  // We would list voice model files here if we had them
  // '/assets/voice/bn-model.json',
  // '/assets/voice/en-model.json'
];

// Combine all assets to cache
const allAssetsToCache = [...urlsToCache, ...voiceAssets];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(allAssetsToCache);
      })
      .catch(error => {
        console.error('Failed to cache assets:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Add message handling for voice-related communication
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'VOICE_CACHE_REQUEST') {
    // This would handle specific voice model caching requests
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(voiceAssets);
        })
    );
  }
});
