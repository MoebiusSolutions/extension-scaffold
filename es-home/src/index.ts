import { extensionScaffold, Location } from '@gots/es-runtime/build/es-api'
import { initialize, subscribeJson } from '@gots/noowf-inter-widget-communication';
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

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}

interface IFramePanel {
  id: string
  title: string
  location: Location
  iframeSource: string
  resizeHandle?: boolean
}
function loadIframePanels(iframes?: IFramePanel[]) {
  iframes?.reverse()?.forEach(async (config) => {
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

export async function applyConfiguration(config: any, app: string) {
  if (config.title) {
    document.title = config.title;
  }

  if (config.extensions) {
    const busUrl = new URL('/bgapp/bcst-bus/index.html', window.location.toString()).toJSON();
    const provider = 'broadcast';
    extensionScaffold.setContext({
      busUrl,
      provider
    });

    initialize({ provider, busUrl })
    subscribeJson('es.ping.topic', (sender, message, topic) => {
      console.log(sender, message, topic)
    })

    extensionScaffold.boot(document.getElementById('demo-grid-container'));
    extensionScaffold.events.on('add-iframe', addKeydownForIFrame);

    const ribbon = await EsRibbon.addPanel(extensionScaffold, config.ribbon)
    extensionScaffold.provideRibbonBar(ribbon)
    
    const p1 = loadIframePanels(enabledIframes(config.iframes));
    const p2 = extensionScaffold.loadExtensions(enabledExtensions(config.extensions));
    await Promise.all([p1, p2])
  } else {
    console.error(`Application configuration missing extensions: ${app}`);
    alert(`Application configuration missing extensions: ${app}`);
  }
}

async function loadAppConfig() {
  if (!location.hash) {
    const hp = document.getElementById('es-home-page')
    if (hp) {
      hp.style.display = 'block'
    } else {
      console.error('Could not find #es-home-page')
    }
    return
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

loadAppConfig()
