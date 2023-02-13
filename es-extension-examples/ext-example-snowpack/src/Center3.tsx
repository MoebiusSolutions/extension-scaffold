import React from 'react'
import type { ExtensionScaffoldApi } from "@moesol/es-runtime/build/es-api"

export const Center3: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    const s = `
        .Center3 {
            background-color: grey;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            position: absolute;
        }
    `
    function handleClose() {
        es.chrome.panels.removePanel('ext.example.snowpack.3')
    }
    /*
     * Note that below we inject a <style> element into the shadow DOM.
     * See Center2.tsx for how we can link to a stylesheet.
     */
    return <>
        <style>{s}</style>
        <div className="Center3">Third Center Panel
            <button onClick={handleClose}>Close</button>
        </div>
    </>
}
