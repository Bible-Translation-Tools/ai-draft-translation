const CACHE_VERSION = "v1";
const CACHE_NAME = `ai-draft-translation-${CACHE_VERSION}`;
const APP_SHELL = [
  "/",
  "/index.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_SHELL);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

async function putInCache(request, response) {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
}

async function networkFirst({ request, event }) {
  try {
    // Always try network first for fresh data
    const responseFromNetwork = await fetch(request);
    
    // Only cache successful responses (status 200-299)
    if (responseFromNetwork.ok) {
      event.waitUntil(putInCache(request, responseFromNetwork.clone()));
    }
    
    return responseFromNetwork;
  } catch (_error) {
    // If network fails, try to serve from cache
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // If no cache available, return offline response
    return new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  return event.respondWith(networkFirst({ request, event }));
});

// Handle notification requests sent from the page
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;
  if (data.type === "SHOW_NOTIFICATION") {
    const title = data.title || "Notification";
    const options = data.options || {};
    self.registration.showNotification(title, options);
  }
});

// Handle push events from the server
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "New notification", body: event.data.text() };
    }
  }

  const title = data.title || "AI Draft Translation";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/vite.svg",
    badge: "/vite.svg",
    data: data.data || {},
    tag: data.tag || "default",
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    ...data.options
  };
  
  console.log("Notification data:", data);

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Focus the app when notification is clicked
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const jobId = event.notification?.data?.jobId;
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of allClients) {
        if ("focus" in client) {
          await client.focus();
          if (jobId) {
            client.postMessage({ type: "JOB_NOTIFICATION_CLICKED", jobId });
          }
          return;
        }
      }
      if (self.clients.openWindow) {
        await self.clients.openWindow("/");
      }
    })(),
  );
});


