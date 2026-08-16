/* Aion service worker — cache básico do shell para suporte offline parcial. */
const CACHE = 'aion-v1'
const PRECACHE = ['/', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Nunca interceptar chamadas de chat (devem sempre ir à rede).
  if (url.pathname.startsWith('/api/')) return

  // Assets estáticos: cache-first, atualizando em opções.
  if (event.request.method === 'GET') {
    if (
      url.origin === self.location.origin &&
      /\.(png|ico|webmanifest|svg|woff|woff2|js|css)$/.test(url.pathname)
    ) {
      event.respondWith(
        caches.match(event.request).then((hit) => {
          const network = fetch(event.request)
            .then((res) => {
              if (res && res.ok) {
                const clone = res.clone()
                caches.open(CACHE).then((cache) => cache.put(event.request, clone))
              }
              return res
            })
            .catch(() => hit)
          return hit || network
        })
      )
      return
    }
  }

  // Navegação e documentos: network-first, com fallback de cache.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((cache) => cache.put(event.request, clone))
          return res
        })
        .catch(() =>
          caches.match(event.request).then((hit) => hit || caches.match('/'))
        )
    )
  }
})
