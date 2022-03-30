'use strict';
// Array di configurazione del service worker
var config = {
  version: 'versionesw1::',
  staticCacheItems: []
}

// Funzione che restituisce una stringa da utilizzare come chiave per la cache
function cacheName (key, opts) {
  return '${opts.version}${key}'
}

// Evento install
self.addEventListener('install', event => {
  event.waitUntil(
    // Inserisco in cache le URL configurate in config.staticCacheItems
    caches.open( cacheName('static', config) ).then(cache => cache.addAll(config.staticCacheItems))
    // self.skipWaiting() evita l'attesa, il che significa che il service worker si attiverà immediatamente non appena conclusa l'installazione
    .then( () => self.skipWaiting() )
 )
 console.log("Service Worker Installato")
})


self.addEventListener('activate', event => {
  // Questa funzione elimina dalla cache tutte le risorse la cui chiave non contiene il nome della versione
  // impostata sul config di questo service worker
  function clearCacheIfDifferent(event, opts) {
    return caches.keys().then(cacheKeys => {
      var oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.version) !== 0);
      var deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
      return Promise.all(deletePromises);
    });
  }
  event.waitUntil(
   // Se la versione del service worker cambia, svuoto la cache
   clearCacheIfDifferent(event, config)
   // Con self.clients.claim() consento al service worker di poter intercettare le richieste (fetch) fin da subito piuttosto che attendere il refresh della pagina
   .then( () => self.clients.claim() )
  )
  console.log("Service Worker Avviato")
})


self.addEventListener('fetch', (event) => {
    console.log('Fetch request');
});


self.addEventListener('push', function(e) {
  console.log(e)
  var options = {
    body: 'This notification was generated from a push!',
    icon: 'images/example.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: 'explore', title: 'Explore this new world',
        icon: ''},
      {action: 'close', title: 'Close',
        icon: ''},
    ]
  };
  e.waitUntil(
    self.registration.showNotification('Hello world!', options)
  );
});

self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('http://www.example.com');
    notification.close();
  }
});
