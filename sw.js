  const CACHE_NAME = 'Cache-Names-V1',

  urlsToCache = [
    '/',
    './',
    './?utm=homescreen',
    './sw.js',
    'index.html',
    'js/script.js',
    'css/style.css',
    'manifest.json',
    'images/icons/icon-128x128.png',
    'images/icons/icon-144x144.png',
    'images/icons/icon-152x152.png',
    'images/icons/icon-192x192.png',
    'images/icons/icon-384x384.png',
    'images/icons/icon-512x512.png',
    'images/icons/icon-72x72.png',
    'images/icons/icon-96x96.png'
  ]

  //this event is for to know
  self.addEventListener('install', e => {
      console.log('Event: SW installed')
      e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache =>{
          console.log("Files in cache")
          return cache.addAll(urlsToCache)
        })
        .catch(err => console.log("Failure cache registre",err))
      )
  })

  //this event is for to know
  self.addEventListener('activate', e => {
      console.log('Event: SW actived')
      const cacheList = [CACHE_NAME]

      e.waitUntil(
        caches.keys()
        .then(cacheName => {
          return Promise.all(
            cacheName.map(cacheName => {
              if(cacheList.indexOf(cacheName) === -1){
                  return caches.delete(cacheName)
              }
            })
          )
        })
        .then(() => {
          console.log("cache is clear and updated")
          return self.clients.claim()
        })
      )

  })

  //this event is for to know return data on caches
  self.addEventListener('fetch', e => {
      console.log('Event: SW recovered')
      e.respondWith(
        caches.match(e.request)
          .then(res => {
            if( res ){
              return res
            }

            return fetch( request )
              .then(res => {
                let resToCache = res.clone()

                caches.open(cacheName)
                  .then(cache => {
                    cache
                      .put(request, resToCache)
                      .catch(err => console.log(`${request.url}: $(err.message)`))
                  })
                return res
              })
          })
      )
  })


  //this is for notification push
  self.addEventListener('push', e => {
    console.log('Event: Push')

    let title = 'Push Notification Demo'
    let options = {
      body: 'Click for return to aplication',
      icon: 'images/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: { id:1 },
      actions: [
          {
            'action': 'Yes', 'title': 'I love this aplication :D',
            icon: 'images/icons/icon-72x72.png'
         },
         {
           'action': 'No', 'title': 'I dont like this aplication :c',
           icon: 'images/icons/icon-72x72.png'
        }
      ]
    }
    e.waitUntil( self.registration.showNotification(title, options))
  })

  //configure actions of notification
  self.addEventListener('notificationclick', e => {
    console.log(e)

    if(e.action === 'Yes'){

      console.log('Love this aplication')
      clients.openWindow('https://solti.com.mx')

    }else if(e.action === 'No'){
      console.log('I dont like this aplication')
    }
    e.notification.close()
  })

  //configure SyncManager to sync in background

  self.addEventListener('sync', e => {
      console.log('Event: sincronitation on background', e)

        //validate when the etiquet of sincronitation be equals an like to define in devtoools and go to emule
        if( e.tag === 'github' || e.tag === 'test-tag-from-devtools' ){
          e.waitUntil(
            //validate  count pestanas is open and send message
            self.clients.matchAll()
              .then( all => {
                return all.map(client => {
                  return client.postMessage('onLine')
                })
              })
              .catch( err => console.log('', err))
          )
        }
  })

  //message
/*  self.addEventListener('message', e => {
    console.log('from sincronitation in background', e.data)

    fetchGitHubUser( localStorage.getItem('github'), true )

  })
*/
