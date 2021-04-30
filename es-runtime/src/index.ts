import { loadExtensions } from './controllers/ExtensionController';
import './index.css';

loadExtensions()

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
