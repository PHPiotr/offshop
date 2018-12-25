workbox.skipWaiting();
workbox.clientsClaim();

workbox.routing.registerRoute(
    new RegExp('https:.*min\.(css|js)'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'cdn-cache'
    })
);

workbox.routing.registerRoute(
    new RegExp('https://.*:9000/.*'),
    workbox.strategies.networkFirst()
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
