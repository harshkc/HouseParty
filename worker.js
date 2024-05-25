// self.onmessage = (event) => {
//     if (event.data === 'fetchScreenWidth') {
//         console.log('Worker: Received request to fetch screen width');

//         // Make synchronous XHR request to Service Worker
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', '/fetch-screen-width', false); // `false` makes the request synchronous
//         xhr.send();

//         if (xhr.status === 200) {
//             console.log('Worker: Received screen width from service worker:', xhr.responseText);
//             self.postMessage(xhr.responseText);
//         } else {
//             console.error('Worker: Failed to fetch screen width');
//         }
//     }
// };

function fetchScreenWidth() {
    // Use sync XHR to fetch value from main thread
    console.log('Worker: Fetching window.screen.width...');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/fetch-screen-width', false); // `false` makes the request synchronous
    xhr.send();
  
    if (xhr.status === 200) {
        console.log('Worker: Received screen width from service worker:', xhr.responseText);
        self.postMessage(xhr.responseText);
    } else {
        console.error('Worker: Failed to fetch screen width');
    }
  }

// Proxy to mimic window object
const windowProxy = new Proxy({}, {
    get: function(target, prop) {
        if (prop === 'screen') {
            return new Proxy({}, {
                get: function(target, prop) {
                    if (prop === 'width') {
                        console.log('Worker: Fetching window.screen.width...');
                        return fetchScreenWidth();
                    }
                }
            });
        }
    }
});

console.log(windowProxy.screen.width); // Trigger the fetch

// Optional: Post message to main thread
// postMessage({ type: 'result', data: windowProxy.screen.width });