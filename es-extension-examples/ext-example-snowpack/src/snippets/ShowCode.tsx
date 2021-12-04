import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import React from 'react'

export const ShowCode: React.FC<{
  es: ExtensionScaffoldApi
}> = ({ es, children }) => {
  function handleClose() {
    es.chrome.panels.removePanel('ext.example.snowpack.code')
    window.dispatchEvent(new CustomEvent('example-hide-code'))
  }

  return <>
    <style>{`
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
  border: transparent;
}
::-webkit-scrollbar-corner {
  background: transparent;
}

.es-source-code {
  position: absolute;
  inset: 0px;
}
.es-source-code pre {
  margin: 0px;
  width: 100%;
}
.close-button {
  position: absolute;
  right: 8px;
  top: 2px;
  z-index: 1;
  cursor: pointer;
  padding: 4px;
  background: rgba(0,0,0,0.4);
  color: rgba(255,255,255,0.87)
}
.scroll-source {
  overflow: auto;
  position: absolute;
  inset: 0px;
  top: 2px;
}
`}</style>
    <div className="es-source-code">
      <div className="close-button" onClick={handleClose}>X</div>
      <div className="scroll-source">
        {children}
      </div>
    </div>
  </>
}
