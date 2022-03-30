// Controlla i permessi per le notifiche
Notification.requestPermission(status => { console.log('Notification permission status:', status) })

// Controlla che il browser supporti il service worker.
if ('serviceWorker' in navigator) {
 // Path che contiene il service worker
 navigator.serviceWorker.register('./assets/js/sw.js')
 .then(reg => {
   console.log('Service worker installato correttamente: ', reg);

   reg.pushManager.getSubscription()
   .then(sub => {
      if (sub === null) {
        // Update UI to ask user to register for Push
        console.log('Not subscribed to push service!');
      } else {
        // We have a subscription, update the database
        console.log('Subscription object: ', sub);
        console.log('Subscription key: ', sub.getKey());
      }
    })
 })
 .catch(error => {
   console.log('Installazione service worker fallita:', error);
 })
}


// Funzione richiamata al click del pulsante
$('#id-btn-user-subscribe').click(()=>{ subscribeUser() })
$('#id-btn-test-notify').click(()=>{ displayNotification() })

// ********** FUNZIONI **********
function displayNotification() {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistrations()
    .then(reg => {
      console.log(reg)
      let options = {
        body: 'This notification was generated from a push!',
        icon: 'assets/img/Storci_Logo_1024_1024.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2'
        },
        actions: [
          {action: 'explore', title: 'Explore this new world', icon: ''},
          {action: 'close', title: 'Close', icon: ''},
        ]
      }
        reg[0].showNotification('Hello world!', options)
    })
  }
}

function subscribeUser() {
  console.log(1)
  if ('serviceWorker' in navigator) {
    console.log(2)
    navigator.serviceWorker.getRegistrations()
    .then(reg => {
      console.log(3)
      reg[0].pushManager.subscribe({userVisibleOnly: true})
      .then(sub => {
        console.log('4 - Endpoint URL: ', sub.endpoint)
      })
      .catch(e => {
        console.log(5)
        if (Notification.permission === 'denied') {
          console.warn('6 - Permission for notifications was denied')
        } else {
          console.error('7 - Unable to subscribe to push - ', e)
        }
      })
    })
    .catch(e => {
      console.log('8 - ', e)
    })
  }
}
