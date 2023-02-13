/*
 * This file is one example of how to use `es-runtime`.
 */
import { extensionScaffold, GridState } from './es-api'

async function loadExtensions() {
  extensionScaffold.boot(document.getElementById('grid-container'))

  // We don't want 'top' to have a size. If it does it messes up the ribbon collapse function.
  const gridstate: GridState = {
    left: { activeId: "ext.example.rollup", size: '300px', isShown: true, isExpanded: false },
    right: { activeId: "ext.example.webpack", size: '300px', isShown: true, isExpanded: false },
    top: { activeId: null, size: '', isShown: false, isExpanded: false },
    bottom: { activeId: null, size: '170px', isShown: false, isExpanded: false }
  }

  const urls = ['http://localhost:9091/dist/ext-react-snowpack.js',
    'http://localhost:9092/ext-react-rollup.js',
    'http://localhost:5000/build/ext-svelte-rollup.js',
    'http://localhost:9093/ext-react-webpack.js',
    'http://localhost:9094/dist/ext-lit-element.js',
    'http://localhost:7080/display-rules/_dist_/ext-dr.js']

  extensionScaffold.loadExtensions(urls, gridstate)

}

loadExtensions()
extensionScaffold.chrome.panels.trackExtensions({ ids: ['ext.example.rollup', 'ext.example.webpack'] })
extensionScaffold.events.on('grid-changed', (gs) => { console.log('Pane!', gs) })
extensionScaffold.events.on('ext-shown-changed', (gs) => { console.log('ExtChanged!', gs) })


// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
