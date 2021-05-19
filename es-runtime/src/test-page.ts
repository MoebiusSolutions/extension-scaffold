/*
 * This file is one example of how to use `es-runtime`.
 */
import { extensionScaffold, PanelState, GridState } from './es-api'
//import type { gridstate } from './controllers/ExtensionController'

//const ee = new EventEmitter()

async function loadExtensions() {
  extensionScaffold.boot(document.getElementById('grid-container'))

  const gridstate: GridState = {
    left: { activeId: "ext.snowpack.left", size: 350 }, right: { activeId: null, size: 300 },
    top: { activeId: null, size: 100 }, bottom: { activeId: null, size: 170 }
  }

  extensionScaffold.setGridState(gridstate)

  await extensionScaffold.loadExtension('http://localhost:9091/dist/ext-react-snowpack.js')
  await extensionScaffold.loadExtension('http://localhost:9092/ext-react-rollup.js')
  await extensionScaffold.loadExtension('http://localhost:5000/build/ext-svelte-rollup.js')
  await extensionScaffold.loadExtension('http://localhost:9093/ext-react-webpack.js')
  await extensionScaffold.loadExtension('http://localhost:9094/dist/ext-lit-element.js')
  await extensionScaffold.loadExtension('http://localhost:7080/display-rules/_dist_/ext-dr.js')
}

loadExtensions()

extensionScaffold.events.on('grid-changed', (gs) => { console.log('Pane!', gs) })

//const ps: PanelState = { size: 400, activeId: null }

//setTimeout(() => extensionScaffold.setPanelState('left', ps), 2000)


// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
