/// <reference lib="webworker" />

// Work around typing for self...
const _self: ServiceWorkerGlobalScope = self as any

// The code in `oninstall` and `onactive` will force the service worker to
// control the clients ASAP.
_self.oninstall = function(event) {
  event.waitUntil(_self.skipWaiting());
};
_self.onactivate = function(event) {
  event.waitUntil(_self.clients.claim());
};

_self.onfetch = function(event) {
  const startMillis = Date.now()
  const fetchId = nextId(startMillis)

  function beforeFetch() {
    postToWindows({
      type: 'extension-scaffold.network-debug.fetch',
      fetchId,
      url: event.request.url,
      statusText: 'Pending',
    })
  }
  function afterResponse(response: Response) {
    postToWindows({
      type: 'extension-scaffold.network-debug.response',
      fetchId,
      url: event.request.url,
      status: response.status,
      statusText: response.statusText,
      duration: duration(startMillis)
    })
    return response
  }
  function afterError(error: any) {
    postToWindows({
      type: 'extension-scaffold.network-debug.response',
      fetchId,
      url: event.request.url,
      statusText: `${error}`,
      duration: duration(startMillis),
      isError: true,
    })
  }

  beforeFetch()
  const p = fetch(event.request).then(response => afterResponse(response))
  event.respondWith(p)
  p.catch(error => afterError(error))
};

function postToWindows(msg: any) {
  _self.clients.matchAll({ type: "window" }).then(clientList => {
    for (const client of clientList) {
      client.postMessage(msg)
    }
  })
}

let _id = 0
function nextId(startMillis: number) {
  return `${startMillis}_${++_id}`
}

/**
 * @param startMillis 
 * @returns duration in seconds
 */
function duration(startMillis: number) {
  return (Date.now() - startMillis) / 1000.0
}
