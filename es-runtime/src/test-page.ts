/*
 * This file is one example of how to use `es-runtime`.
 */
import { extensionScaffold, GridState } from './es-api'

async function loadExtensions() {
  extensionScaffold.boot(document.getElementById('grid-container'))

  const gridstate: GridState = {
    left: { activeId: "ext.example.rollup", size: '360px' }, right: { activeId: null, size: '300px' },
    top: { activeId: null, size: '100px' }, bottom: { activeId: null, size: '170px' }
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

extensionScaffold.events.on('grid-changed', (gs) => { console.log('Pane!', gs) })


// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
