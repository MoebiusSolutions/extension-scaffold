import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import React from 'react'
import { RibbonButtonCode } from './RibbonButtonCode'

export const ShowCode: React.FC<{
  es: ExtensionScaffoldApi
}> = ({ es }) => {
  function handleClose() {
    es.chrome.panels.removePanel('ext.example.snowpack.code')
  }

  return <div>
    <div style={{
      cursor: 'pointer',
      paddingTop: '8px',
      paddingBottom: '0px',
      paddingLeft: '8px',
    }} onClick={handleClose}>Close</div>
    <RibbonButtonCode></RibbonButtonCode>
  </div>
}
