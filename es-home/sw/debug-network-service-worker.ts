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
  const fetchId = nextId()
  beforeFetch(fetchId, event)
  event.respondWith(fetch(event.request).then(response => afterResponse(fetchId, event, response)))
};

function beforeFetch(fetchId: number, event: FetchEvent) {
  _self.clients.get(event.clientId).then(client => {
    if (!client) {
      return
    }
    client.postMessage({
      type: 'extension-scaffold.network-debug.fetch',
      fetchId,
      url: event.request.url,
    })
  })
}
function afterResponse(fetchId: number, event: FetchEvent, response: Response) {
  _self.clients.get(event.clientId).then(client => {
    if (!client) {
      return
    }
    client.postMessage({
      type: 'extension-scaffold.network-debug.response',
      fetchId,
      url: event.request.url,
      statusText: response.statusText,
    })
  })
  return response
}

let _id = 0
function nextId() {
  return ++_id
}
