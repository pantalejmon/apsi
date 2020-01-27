

var cacheName = "SERP";
var filesToCache = [
    "/",
    "/index.html",
    "/css/style.css",
    "/css/materialize.min.css",
    "/js/indexScript.js",
    "/js/loginScript.js",
    "/js/registerScript.js",
    "/login.html",
    "/register.html",
    "/info.html"

];

self.addEventListener("install", function (e) {
    console.log("[ServiceWorker] Install");
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log("[ServiceWorker] Caching app shell");
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (evt) {
    // Snooze logs...
    // console.log(event.request.url);
    evt.respondWith(
        // Firstly, send request..
        fetch(evt.request).catch(function () {
            // When request failed, return file from cache...
            return caches.match(evt.request);
        })
    );
});