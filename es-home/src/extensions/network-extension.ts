import Tonic from '@optoolco/tonic'
import type { ExtensionScaffoldApi } from '@moesol/es-runtime/build/es-api'
import { EsDebugNetworkRibbonPanel } from './ribbon/debug-network-ribbon-panel'
import { EsDebugNetwork } from './ribbon/debug-network'
import { EsNetworkLines } from './ribbon/network-lines'
import { emitDevTools, onDevTools } from '@moesol/es-iframe-to-dev-ext'

const NETDBG_ENABLED = 'extension-scaffold.network-debug.enabled'
let _wasActivated = false

interface DebugReq {
  fetchId: string,
  url: string
  status?: number,
  statusText?: string
  isError?: boolean,
  duration?: number,
}
export const REQS: DebugReq[] = []
const MAX_REQS = 1000
const reqChannel = new BroadcastChannel('extension-scaffold.network-debug')

/**
 * Collects network activity into a ring buffer
 * @param req 
 */
function debugReqPush(req: DebugReq) {
  REQS.push(req)
  while (REQS.length > MAX_REQS) {
    REQS.shift()
  }

  reqChannel.postMessage({type: 'new-debug-req'})
}
/**
 * Updates existing network activity in the ring buffer
 * @param req 
 * @returns 
 */
function debugReqUpdate(req: DebugReq) {
  const index = REQS.findIndex(r => r.fetchId === req.fetchId)
  if (index < 0) {
    debugReqPush(req)
    return
  }
  REQS[index] = req // replace

  reqChannel.postMessage({type: 'new-debug-req'})
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

  onDevTools('extension-scaffold.network.log.config.query', () => {
    emitDevTools('extension-scaffold.network.log.config.response', {
      enabled: isNetworkDebugEnabled()
    })
  })
  onDevTools('extension-scaffold.network.log.fetch', (_, payload) => {
    debugReqPush(payload)
  })
  onDevTools('extension-scaffold.network.log.response', (_, payload) => {
    debugReqUpdate(payload)
  })
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
        _wasActivated = true
        debugReqPush(msg.data)
        break;
      case 'extension-scaffold.network-debug.response':
        _wasActivated = true
        debugReqUpdate(msg.data)
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
