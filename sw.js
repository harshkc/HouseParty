self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.endsWith('/fetch-screen-width')) {
        console.log('Service Worker: Intercepted fetch request for screen width');

        // Respond asynchronously
        event.respondWith(
            new Promise((resolve) => {
                self.clients.matchAll().then((clients) => {
                    if (clients && clients.length) {
                        // Communicate with the main thread
                        clients[0].postMessage('fetchScreenWidth');
                        console.log('Service Worker: Sent message to main thread');

                        // Receive response back from the main thread
                        self.addEventListener('message', function handleMessage(event) {
                            if (event.data.type === 'screenWidth') {
                                console.log('Service Worker: Received screen width from main thread:', event.data.width);
                                resolve(new Response(event.data.width, { status: 200 }));
                                self.removeEventListener('message', handleMessage);
                            }
                        });
                    }
                });
            })
        );
    }
});