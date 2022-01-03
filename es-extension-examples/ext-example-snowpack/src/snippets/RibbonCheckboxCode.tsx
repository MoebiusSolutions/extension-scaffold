import React from 'react'
import { FormatCode } from './FormatCode'

export const RibbonCheckboxCode = () => {
  const codeString = `
  function toggleLayers() {
    scaffold.chrome.panels.togglePanel('ext.snowpack.left')
  }
  claimRibbonWith(scaffold, 'chart.settings', 
    <es-ribbon-section label="Status Bar">
      <label><CodeCheckBox />Show Code</label>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <label><input type="checkbox"></input>Show Mouse Location</label>
        <label><input type="checkbox"></input>Show Plan Time</label>
        <es-ribbon-button onClick={toggleLayers}><div>Layers</div></es-ribbon-button>
      </div>
    </es-ribbon-section>
  )
  `
  return <FormatCode source={codeString}/>
}
