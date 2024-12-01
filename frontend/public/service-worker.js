
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NOTIFICATION',
        body: data.body
      });
    });
  });

 
  event.waitUntil(
    self.registration.showNotification(data.title || 'New Notification', {
      body: `${data.body.title} : ${data.body.content}`,
      vibrate: [200, 100, 200], 
      tag: 'notification', 
      renotify: true,
      data: { url: data.url } 
    })
  );
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});