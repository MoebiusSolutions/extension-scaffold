import { extensionScaffold } from '@gots/es-runtime/build/es-api'


async function loadExtensions() {
  extensionScaffold.boot(document.getElementById('demo-grid-container'))

  await extensionScaffold.loadExtensions([
    'http://localhost:9091/dist/ext-react-snowpack.js',
    'http://localhost:9092/ext-react-rollup.js',
    'http://localhost:5000/build/ext-svelte-rollup.js',
    'http://localhost:9093/ext-react-webpack.js',
    'http://localhost:9094/dist/ext-lit-element.js',
  ])
}

loadExtensions()

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
