// Register the Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then((registration) => {
            console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error);
        });
}

// Initialize the Web Worker
const worker = new Worker('worker.js');

// Handle messages from the worker
// worker.onmessage = (event) => {
//     console.log('Main thread received message from worker:', event.data);
//     document.getElementById('output').innerText = `Screen Width: ${event.data}`;
// };

// Button to initiate fetching screen width
// document.getElementById('fetchWidth').addEventListener('click', () => {
//     console.log('Main thread: Sending request to worker');
//     worker.postMessage('fetchScreenWidth');
// });

// Handle messages from the Service Worker
navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data === 'fetchScreenWidth') {
        console.log('Main thread: Received request for screen width from service worker');
        const screenWidth = window.screen.width;
        console.log('Main thread: Sending screen width to service worker:', screenWidth);
        navigator.serviceWorker.controller.postMessage({ type: 'screenWidth', width: screenWidth });
    }
});