import Tonic from '@optoolco/tonic'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { EsDebugNetworkRibbonPanel } from './ribbon/debug-network-ribbon-panel'
import { EsDebugNetwork } from './ribbon/debug-network'
import { EsNetworkLines } from './ribbon/network-lines'

const NETDBG_ENABLED = 'extension-scaffold.network-debug.enabled'
let _wasActivated = false

interface DebugReq {
  url: string
  statusText: string
}
export const REQS: DebugReq[] = []
const reqChannel = new BroadcastChannel('extension-scaffold.network-debug')

function debugReqPush(req: DebugReq) {
  REQS.push(req)
  while (REQS.length > 1000) {
    REQS.shift()
  }
  reqChannel.postMessage({
    type: 'new-debug-req',
  })
}

export function wasActivated() {
  return _wasActivated
}

export function storeNetworkDebugEnabled(v: boolean) {
  localStorage.setItem(NETDBG_ENABLED, `${v}`)
}
export function isNetworkDebugEnabled() {
  return localStorage.getItem(NETDBG_ENABLED) === 'true'
}

//
// Collects network activity into a ring buffer
//
export async function activate(scaffold: ExtensionScaffoldApi, url: string) {
  Tonic.add(EsDebugNetworkRibbonPanel)
  Tonic.add(EsDebugNetwork)
  Tonic.add(EsNetworkLines)

  const div = scaffold.chrome.ribbonBar.claimRibbonPanel('debug.network')
  if (!div) { return }
  
  const s = document.createElement('es-debug-network-ribbon-panel')
  div.innerText = ''
  div.appendChild(s)

  if (isNetworkDebugEnabled()) {
    registerServiceWorker(url)
  } else {
    unregisterServiceWorker(url)
  }
}

const registerServiceWorker = async (url: string) => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Browser lacks serviceWorker support')
    return
  }
  try {
    // We neeed window.location to get the protocol etc
    const swUrl = new URL('../../debug-network-service-worker.js', new URL(url, window.location.href)).href
    const registration = await navigator.serviceWorker.register(swUrl);
    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed');
    } else if (registration.active) {
      console.log('Service worker active');
    }

    navigator.serviceWorker.addEventListener('message', msg => {
      switch  (msg.data.type) {
      case 'extension-scaffold.network-debug.fetch':
        break;
      case 'extension-scaffold.network-debug.response':
        _wasActivated = true
        debugReqPush({
          url: msg.data.url,
          statusText: msg.data.statusText
        })
        break;
      }
    })

  } catch (error) {
    console.error(`Registration failed with ${error}`);
  }
};

const unregisterServiceWorker = async (url: string) => {
  if (!('serviceWorker' in navigator)) {
    return
  }
  const r = await navigator.serviceWorker.getRegistration()
  console.log('Unregistering', r)
  r?.unregister()
}
