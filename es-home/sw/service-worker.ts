/// <reference lib="webworker" />

// Work around typing for self...
const _self: ServiceWorkerGlobalScope = self as any

// The code in `oninstall` and `onactive` force the service worker to
// control the clients ASAP.
_self.oninstall = function(event) {
  event.waitUntil(_self.skipWaiting());
};

_self.onactivate = function(event) {
  event.waitUntil(_self.clients.claim());
};

_self.onfetch = function(event) {
  console.log('req', event.request.url)
  event.respondWith(fetch(event.request).then(response => response))
};
