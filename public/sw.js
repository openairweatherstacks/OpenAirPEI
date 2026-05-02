self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));

// Pass-through fetch — just enough to satisfy the PWA install criteria
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
