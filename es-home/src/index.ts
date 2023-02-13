import { AddPanelOptions, extensionScaffold, Location, GridState } from '@moesol/es-runtime/build/es-api'
import { applyGridState, getGridState } from '@moesol/es-runtime/build/utils'
import { initialize, subscribeJson } from '@moesol/inter-widget-communication';
import Tonic from '@optoolco/tonic'
import { EsAddExtension } from './components/add-extension';
import { EsBlockedExtensions } from './components/blocked-extensions';
import { EsHomePage } from './components/home-page';
import { EsKbar } from './components/kbar'
import { EsKbarResults } from './components/kbar-results';
import { addKeydownForIFrame, EsKbarRoute } from './components/kbar-route';
import { EsLoadApplication } from './components/load-application';
import { EsPopupTextarea } from './components/popup-textarea';
import { EsPrompt } from './components/prompt';
import { EsRemovePanel } from './components/remove-panel';
import { EsShowContext } from './components/show-context';
import { EsShowPanelList } from './components/show-panel-list';
import { EsTogglePanel } from './components/toggle-panel';
import { EsRibbon } from './components/ribbon/ribbon';

import './index.css'

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}

interface Placement {
  location: Location
  order: string
}

interface IFramePanel {
  id: string
  title: string
  location: Location
  iframeSource: string
  resizeHandle?: boolean
}
function loadIframePanels(iframes?: IFramePanel[]) {
  return iframes?.reverse()?.map(async (config) => {
    await extensionScaffold.chrome.panels.addPanel(config)
  })
}

async function applyHash() {
  const app = location.hash.replace('#', '').replace('..', '')
  console.log('app', app)

  const rsp = await fetch(`apps/${app}.json`)
  const config = await rsp.json()

  await applyConfiguration(config, app);
}

function getBlockedUrls(): Set<string> {
  const BLOCKED_KEY = 'es-kbar-blocked-extensions'
  const blockedString = localStorage.getItem(BLOCKED_KEY) || '[ ]'
  try {
    const blocked = JSON.parse(blockedString)
    return new Set(blocked)
  } catch (e) {
    console.error('Unable to parse blocked string', e)
    return new Set()
  }
}

function enabledIframes(iframes?: IFramePanel[]) {
  if (!iframes) {
    return []
  }
  const blockedSet = getBlockedUrls()
  return iframes.filter(i => !blockedSet.has(i.iframeSource))
}

function enabledExtensions(urls?: string[]): string[] {
  if (!urls) {
    return []
  }
  const blockedSet = getBlockedUrls()
  return urls.filter(url => !blockedSet.has(url))
}
function makeIdToPlacement(config: any): Map<string, Placement> {
  const searchKeys: Location[] = [
    'header',
    'footer',
    'left',
    'right',
    'center',
    "top-bar",
    'bottom-bar'
  ]
  const result = new Map<string, Placement>()
  searchKeys.forEach(key => {
    if (!(config[key] instanceof Array)) {
      return
    }
    const panels: string[] = config[key]
    if (!(panels instanceof Array)) {
      return
    }
    panels.forEach((pid, idx) => {
      result.set(pid, { location: key, order: `${idx}` })
    })
  })
  return result
}
function updateLocation(options: AddPanelOptions, id2placement: Map<string, Placement>): AddPanelOptions | undefined {
  const placement: Placement | undefined = id2placement.get(options.id)
  if (!placement) {
    return undefined
  }
  if (options.relocating) {
    return undefined
  }
  return {
    ...options,
    location: placement.location
  }
}
function order(options: AddPanelOptions, is2placement: Map<string, Placement>): string {
  const placement: Placement | undefined = is2placement.get(options.id)
  if (!placement) {
    return '100'
  }
  return placement.order
}

export async function applyConfiguration(config: any, app: string) {
  if (config.title) {
    document.title = config.title;
  }

  if (config.extensions) {
    // The default bcst-bus is now contained within es-home
    const def = { iwc: 'broadcast', 'busUrl': new URL('./bcst-bus/index.html', window.location.toString()).toJSON() }
    const resolved = { ...def, ...config.context }
    extensionScaffold.setContext(resolved)

    initialize({ provider: resolved.iwc, busUrl: resolved.busUrl })
    subscribeJson('es.ping.topic', (sender, message, topic) => {
      console.log(sender, message, topic)
    })

    const id2placement = makeIdToPlacement(config)
    extensionScaffold.boot(document.getElementById('demo-grid-container'));
    extensionScaffold.events.on('add-iframe', addKeydownForIFrame);
    extensionScaffold.events.on('before-add-panel', (event: any) => {
      event.response = updateLocation(event.options, id2placement)
    });
    extensionScaffold.events.on('order-panel-button', (event: any) => {
      event.order = order(event.options, id2placement)
    });

    const ribbon = await EsRibbon.addPanel(extensionScaffold, config.ribbon)
    extensionScaffold.provideRibbonBar(ribbon)

    const p1 = loadIframePanels(enabledIframes(config.iframes));
    const p2 = extensionScaffold.loadExtensions(enabledExtensions(config.extensions));
    await Promise.all([p1, p2])

    const gridState = getGridState() as GridState
    window.history.replaceState({ ...gridState, type: 'navy.es.grid.state' }, "")
  } else {
    console.error(`Application configuration missing extensions: ${app}`);
    alert(`Application configuration missing extensions: ${app}`);
  }
}

async function loadAppConfig() {
  if (!location.hash) {
    // if authenticating to keycloak (vs passing a KC token), keycloak will not 
    // forward anything after "#".
    // For some projects; desire is to skip the scaffold lspash screen when using 
    // the site proxy and instead default to a json file
    let appPage = new URLSearchParams(window.location.search).get('app');
    if (appPage != null) {
      location.hash = appPage;
    } else {
      const hp = document.getElementById('es-home-page')
      if (hp) {
        hp.style.display = 'block'
      } else {
        console.error('Could not find #es-home-page')
      }
      return
    }
  }

  const itemName = 'es-kbar-load-application'
  const configString = localStorage.getItem(itemName)
  if (!configString) {
    applyHash()
  } else {
    // TODO restrict this operation to developers
    const config = JSON.parse(configString)
    localStorage.removeItem(itemName)
    applyConfiguration(config, '#uploaded')
  }
  window.addEventListener('hashchange', () => {
    window.location.reload()
  })
}

// Back or Forward button clicked in browser
window.addEventListener('popstate', (event) => {
  // check type to ensure state is a GridState object
  if (event.state?.type == 'navy.es.grid.state') {
    applyGridState(event.state)
  }
});

Tonic.add(EsKbarRoute)
Tonic.add(EsKbar)
Tonic.add(EsKbarResults)
Tonic.add(EsAddExtension)
Tonic.add(EsBlockedExtensions)
Tonic.add(EsTogglePanel)
Tonic.add(EsShowPanelList)
Tonic.add(EsRemovePanel)
Tonic.add(EsShowContext)
Tonic.add(EsPrompt)
Tonic.add(EsPopupTextarea)
Tonic.add(EsLoadApplication)
Tonic.add(EsHomePage)

try {
  loadAppConfig()
} catch (e) {
  alert(`Unable to load application configuration`)
}
