/// Fresh Start Academy — Service Worker
/// Offline-ready PWA with cache strategies

const CACHE_VERSION = 'fsa-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// App shell resources to precache on install
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/favicon.svg',
];

// Cache size limits
const RUNTIME_CACHE_LIMIT = 50;
const IMAGE_CACHE_LIMIT = 100;

// ── Install: precache app shell ──────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ───────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// ── Fetch strategies ─────────────────────────────────────────────

/**
 * Trim a cache to maxEntries (FIFO — oldest removed first)
 */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    return trimCache(cacheName, maxEntries);
  }
}

/**
 * Cache-first: return cached response, fall back to network + cache
 * Best for hashed static assets (JS, CSS bundles)
 */
async function cacheFirst(request, cacheName, limit) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      if (limit) trimCache(cacheName, limit);
    }
    return response;
  } catch {
    // Offline fallback for navigations handled separately
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Stale-while-revalidate: return cached immediately, update in background
 * Best for fonts, non-critical images
 */
async function staleWhileRevalidate(request, cacheName, limit) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
      if (limit) trimCache(cacheName, limit);
    }
    return response;
  }).catch(() => cached);

  return cached || networkPromise;
}

/**
 * Network-first: try network, fall back to cache
 * Best for HTML navigations and API calls
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Offline fallback for navigations: serve cached index.html (SPA)
    if (request.mode === 'navigate') {
      const shell = await caches.match('/');
      if (shell) return shell;
    }

    return new Response(
      JSON.stringify({ error: 'offline', message: 'You appear to be offline.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ── Route requests to strategies ─────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (form submissions, API writes)
  if (request.method !== 'GET') return;

  // Skip Chrome extensions, browser internals
  if (!url.protocol.startsWith('http')) return;

  // Skip Stripe JS (must always be loaded fresh for PCI compliance)
  if (url.hostname === 'js.stripe.com' || url.hostname === 'hooks.stripe.com') return;

  // Skip Supabase realtime WebSocket connections
  if (url.pathname.includes('/realtime/')) return;

  // ── Hashed static assets: cache-first (immutable) ──
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // ── Google Fonts: stale-while-revalidate ──
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    return;
  }

  // ── Images & mascots: stale-while-revalidate with limit ──
  if (
    url.pathname.startsWith('/mascots/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname)
  ) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE, IMAGE_CACHE_LIMIT));
    return;
  }

  // ── Supabase API: network-first ──
  if (url.hostname.endsWith('.supabase.co')) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // ── HTML navigations: network-first (SPA shell fallback) ──
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  // ── Everything else (manifest, etc.): stale-while-revalidate ──
  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, RUNTIME_CACHE_LIMIT));
});

// ── Push notification support (future) ───────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Fresh Start Academy', {
      body: data.body || 'You have a new update!',
      icon: '/icons/icon-192.png',
      badge: '/icons/favicon-32.png',
      tag: data.tag || 'fsa-notification',
      data: { url: data.url || '/dashboard' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window if found
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      return self.clients.openWindow(url);
    })
  );
});

// ── Message handling ─────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Background sync support (future) ─────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(
      // Future: retry failed progress saves
      Promise.resolve()
    );
  }
});
