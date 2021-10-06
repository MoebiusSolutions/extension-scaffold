import { extensionScaffold } from '@gots/es-runtime/build/es-api'

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}

async function applyHash() {
  const app = location.hash.replace('#', '').replace('..', '')
  console.log('app', app)

  const rsp = await fetch(`apps/${app}.json`)
  const config = await rsp.json()

  if (config.title) {
    document.title = config.title
  }

  if (config.extensions) {
    extensionScaffold.boot(document.getElementById('demo-grid-container'))
    await extensionScaffold.loadExtensions(config.extensions)
  } else {
    console.error('Application configuration missing extensions:', app)
  }
}

async function loadAppConfig() {
  if (!location.hash) {
    location.hash = '#example'
  }
  applyHash()
  window.addEventListener('hashchange', () => {
    window.location.reload()
  })
}

loadAppConfig()
