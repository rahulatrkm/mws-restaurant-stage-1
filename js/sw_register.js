navigator.serviceWorker.register('./sw.js').then(function (e) {
    console.log('sw registeration done.');

    if (!navigator.serviceWorker.controller) {
        return;
    }

    if (e.waiting) {
        navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
    }

    if (e.installing) {
        navigator.serviceWorker.addEventListener('statechange', function () {
            if (navigator.serviceWorker.controller.state == 'installed') {
                navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
            }
        });
    }

    e.addEventListener('updatefound', function () {
        navigator.serviceWorker.addEventListener('statechange', function () {
            if (navigator.serviceWorker.controller.state == 'installed') {
                navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
            }
        });
    });

}).catch(function () {
    console.log('sw registration failed');
});

var refreshing;
navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
})

// Request a one-off sync:
navigator.serviceWorker.ready.then(function (swRegistration) {
    return swRegistration.sync.register('myFirstSync');
});

function onOnline() {
    console.log('Online');
    DBHelper.submitOfflineReviews();
}

function onOffline() {
    console.log('Offline');
}

window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
