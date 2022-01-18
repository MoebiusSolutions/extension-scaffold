const busToBusChannel = new BroadcastChannel('bus-to-bus');
let remoteOrigin = ''
let port2: MessagePort | undefined

function connectBus(e: MessageEvent) {
  remoteOrigin = e.origin
  port2 = e.ports[0]
  port2.onmessage = (e: MessageEvent) => {
    // Relay to other buses on this origin
    busToBusChannel.postMessage(e.data)
  }

  busToBusChannel.onmessage = (e:MessageEvent) => {
    // Send back to my remoteOrigin unless it was from my remoteOrigin
    if (remoteOrigin === e.data.origin) {
      return
    }
    port2?.postMessage(e.data)
  }
}

window.addEventListener('message', connectBus)
