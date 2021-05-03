import './index.css';
import { loadExtension } from '@gots/es-runtime/build/es-api'

export function loadExtensions() {
  loadExtension('http://localhost:9091/dist/ext-react-snowpack.js')
  loadExtension('http://localhost:9092/ext-react-rollup.js')
  loadExtension('http://localhost:5000/build/ext-svelte-rollup.js')
  loadExtension('http://localhost:9093/ext-react-webpack.js')
  loadExtension('http://localhost:9094/dist/ext-lit-element.js')
}

loadExtensions()

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
