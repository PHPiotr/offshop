workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
    new RegExp('https:.*min\.(css|js)'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'cdn-cache',
    })
);

workbox.routing.registerRoute(
    new RegExp('http://offshop-1.s3.eu-central-1.amazonaws.com/.*\.jpg'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'cdn-cache',
    })
);

workbox.routing.registerRoute(
    new RegExp('https://offshop-back-end.serveo.net/(products/delivery-methods).*'),
    new workbox.strategies.NetworkFirst(),
);

self.addEventListener('fetch', event => {
    const methods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (methods.indexOf(event.request.method) > -1) {
        event.respondWith(
            fetch(event.request).catch(err => {
                return new Response(
                    JSON.stringify({error: 'This action is disabled while app is offline'}), {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );
            })
        );
    }
});

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
