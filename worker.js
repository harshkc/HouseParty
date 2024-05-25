self.onmessage = function (e) {
    console.log("Worker: Message received from main thread", e.data);
    if (e.data === "calculateWidth") {
        checkIfMobile();
    }
};

function fetchScreenWidth() {
    // Use sync XHR to fetch value from main thread
    console.log("Worker: Fetching window.screen.width...");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/fetch-screen-width", false); // `false` makes the request synchronous
    xhr.send();

    if (xhr.status === 200) {
        console.log("Worker: Received screen width from service worker:", xhr.responseText);
        return parseInt(xhr.responseText);
    } else {
        console.error("Worker: Failed to fetch screen width");
    }
}

// Proxy to mimic window object
const window = new Proxy(
    {},
    {
        get: function (target, prop) {
            if (prop === "screen") {
                return new Proxy(
                    {},
                    {
                        get: function (target, prop) {
                            if (prop === "width") {
                                console.log("Worker: Fetching window.screen.width...");
                                return fetchScreenWidth();
                            }
                        },
                    }
                );
            }
        },
    }
);

function checkIfMobile() {
    const screenWidth = window.screen.width; //triggers the fetch

    if (screenWidth < 768) {
        console.log("Mobile View", {screenWidth});
    } else {
        console.log("Desktop View", {screenWidth});
    }

    // Send the result back to the main thread
    self.postMessage({ type: "screenWidth", width: screenWidth });
}
