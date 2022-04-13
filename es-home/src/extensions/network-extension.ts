import Tonic from '@optoolco/tonic'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { EsDebugNetworkRibbonPanel } from './ribbon/debug-network-ribbon-panel'
import { EsDebugNetwork } from './ribbon/debug-network'
import { EsNetworkLines } from './ribbon/network-lines'

//
// Collects network activity output and unhandled errors into a ring buffer
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

  registerServiceWorker(url)
}

const registerServiceWorker = async (url: string) => {
  if ('serviceWorker' in navigator) {
    try {
      // We neeed window.location to get the protocol etc
      const swUrl = new URL('../../service-worker.js', new URL(url, window.location.href)).href
      const registration = await navigator.serviceWorker.register(swUrl);
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};
