//registre and care
((d, w, n, c) => {

  //install service worker and validate count with serviceWorker
  if('serviceWorker' in navigator) {
    w.addEventListener('load', function() {
      n.serviceWorker.register('sw.js')
        .then(function(registration) {
        // Registration was successful
          c('ServiceWorker registration successful with scope: ', registration.scope)
      })
        .catch(function(err) {
        // registration failed :(
          c('ServiceWorker registration failed: ', err)
      });
    });
  }

  /* ================================================ notification ============================================================= */

    if( w.Notification && Notification.permission !== 'denied'){
      Notification.requestPermission(status => {
        c(status)
        let n = new Notification('Titulo', {
          body: "Im a notification",
          icon: 'images/icons/icon-72x72.png'
        })
      })
    }


    /* active to sincronitation on background */

    if( 'serviceWorker' in n && 'SyncManager' in w){

      function registerBGSync(){
        n.serviceWorker.ready
        .then(registration => {
          return registration.sync.register('github')
          .then( () => c('Sincronitation on background registred') )
          .catch( err => c('Failed registre on background', err) )
        })
      }
       registerBGSync()
    }

})(document, window, navigator, console.log);


// detection when user lost connection
((d, w, n, c) => {

  function networkStatus(e){
    c(e, e.type)

    if( n.onLine ){
        d.querySelector('meta[name=theme-color]').setAttribute('content', '#fb0b0b')
        d.querySelector('.Header').classList.remove('u-offline')
        alert('Connection recovered')
    }else{
        d.querySelector('meta[name=theme-color]').setAttribute('content', '#666')
        d.querySelector('.Header').classList.add('u-offline')
        alert('Connection lost')
    }

  }

  d.addEventListener('DOMContentLoaded', e => {

    if( !n.onLine ){
        networkStatus(this)
    }

    w.addEventListener('online', networkStatus)
    w.addEventListener('offline', networkStatus)

  })


})(document, window, navigator, console.log);


// apliaction demo interact with api of github  and sincronitation on background
((d, w, n, c) => {

  const userInfo = d.querySelector('.GitHubUser')
  searchForm = d.querySelector('.GitHubUser-form')

  function fetchGitHubUser(username, requrestFromBGSync){
    let name = username || 'BrandonAxellRuiz',
    url = `https://api.github.com/users/${name}`

    fetch(url, { method:'GET'})
      .then(response => response.json())
      .then(Data => {

        //validate if computer or person send data
        if( !requrestFromBGSync ){
          localStorage.removeItem('github')
        }

        let template = `
          <article class="GitHubUser-info">
            <h2>${Data.name}</h2>
            <img src="${Data.avatar_url}" alt="${Data.login}">
            <p>${Data.bio}</p>
            <ul>
              <li>User GitHub: ${Data.login}</li>
              <li>Url GitHub ${Data.html_url}</li>
              <li>Followers: ${Data.followers}</li>
              <li>Following: ${Data.following}</li>
              <li>Locations: ${Data.location}</li>
            </ul>
          </article>
        `

        userInfo.innerHTML = template

      })
      .catch( err => {

        //if user is in state offline send to localStorage and when recovered connection
        localStorage.setItem('github', name)

        c(err)
      })

    }

  fetchGitHubUser( localStorage.getItem('github') )

  searchForm.addEventListener('submit', e => {

    e.preventDefault()

    let user = d.getElementById('search').value

    if( user === '' ) return;

    localStorage.setItem('github', user)

    fetchGitHubUser(user)

    e.target.reset()

  })

  n.serviceWorker.addEventListener('message', e => {
      console.log('from sincronitation in background', e.data)

      fetchGitHubUser( localStorage.getItem('github'), true )

  })


})(document, window, navigator, console.log);


//shared with share api
((d, w, n, c) => {

  if( n.share !== undefined ){
    d.addEventListener('DOMContentLoaded', e => {
      let shareBtn = d.getElementById('share')

      shareBtn.addEventListener('click', e => {

        n.share({

            title: d.title,
            text: 'Hi im a content to share',
            url: w.location.href
          })

          .then( () => c('content sheared successful') )
          .catch( err => c('Error when share', err) )

      })
    })
  }


})(document, window, navigator, console.log);
