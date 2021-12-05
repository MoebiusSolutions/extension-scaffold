import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api"
import React from 'react';
import ReactDOM from 'react-dom';
import { claimStyleFromHeadElementMatching } from './lib/claimStyleFromHeadElement';
import { Sparklines, SparklinesLine, SparklinesText } from 'react-sparklines';

function mbUsed() {
  const performance: any = window.performance
  const m = performance.memory.usedJSHeapSize/(1024*1024)
  // console.log('memory used', m)
  return m
}

// TODO move into top-level extension independent of this project
const DebugMetricsSection = () => {
  const [data, setData] = React.useState([mbUsed()])
  React.useEffect(() => {
    const t = setInterval(() => {
      setData(data => {
        const nslice = Math.max(data.length - 20, 0)
        return [...data, mbUsed()].slice(nslice)
      })
    }, 1000);
    return () => clearTimeout(t)
  }, [])

  const mbString = `${data[data.length -1].toFixed(1)} MB`
  const width = 200

  return <>
    <style>{/*css*/`
      .debug-metrics {
        width: ${width}px;
        min-height: 20px;
        border: 1px solid;
        fill: var(--es-theme-text-secondary-on-background);
      }
    `}</style>
    <div className="debug-metrics">
      <Sparklines data={data} limit={20} width={width} height={60} margin={5}>
        <SparklinesLine />
        <SparklinesText point={{ x: 5, y: 10 }} text={mbString} />
      </Sparklines>
    </div>
  </>
}

export async function activate(scaffold: ExtensionScaffoldApi) {
  const div = scaffold.chrome.ribbonBar.claimRibbonPanel('debug.metrics')
  if (!div) { return }

  const container = document.createElement('div')
  div.innerText = ''
  div.appendChild(container)

  const el = document.createElement('div')
  claimStyleFromHeadElementMatching(div, rule => el.matches(rule.selectorText))

  ReactDOM.render(<React.StrictMode><DebugMetricsSection/></React.StrictMode>, container)
}
