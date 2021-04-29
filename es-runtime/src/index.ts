import { loadExtensions } from './controllers/ExtensionController';
import './index.css';

// Until we turn API into a real npm package, we have this copied here.
const LOCATIONS = [
  'header',
  'above-left',
  'above-right',
  'left-bar',
  'right-bar',
  'left',
  'right',
  'top',
  'bottom',
  'center',
  'footer',
] as const;

function addItem(div: HTMLDivElement, id: string) {
  const item = document.createElement('div')
  item.id = id
  item.innerText = id
  item.className = 'grid-panel'
  div.appendChild(item)
}

function buildScaffold() {
  const gridContainer = document.getElementById('grid-container') as HTMLDivElement
  if (!gridContainer) {
      throw new Error('#grid-container not found')
  }
  LOCATIONS.forEach(location => {
    addItem(gridContainer, location)
  })
}

buildScaffold()

loadExtensions()

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
