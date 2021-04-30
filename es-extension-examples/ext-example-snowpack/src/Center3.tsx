import React from 'react'
import type { ExtensionScaffoldApi } from "../../../es-api/es-api"

export const Center3: React.FC<{es: ExtensionScaffoldApi}> = ({es}) => {
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
        es.releasePanel('ext.example.snowpack.3')
    }
    return <>
        <style>{s}</style>
        <div className="Center3">Third Center Panel
            <button onClick={handleClose}>Close</button>
        </div> 
    </>
}
