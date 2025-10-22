// Minimal push SW
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title:'WeddingTech', body:'', url:'/' };
  e.waitUntil(self.registration.showNotification(data.title, { body: data.body, data: { url: data.url } }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
