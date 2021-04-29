import React from 'react'
import type { ExtensionScaffoldApi } from "../../../es-api/es-api"
import { addCenterPanel } from './extension-entry'
// import './Center2.css' snowpack injects this at the head

export const Center2: React.FC<{es: ExtensionScaffoldApi}> = ({es}) => {
    const s = `
        .Center2 {
            background-color: grey;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            position: absolute;
        }
    `
    function handleClose() {
        es.releasePanel('ext.example.snowpack.2')
        addCenterPanel(es)
    }
    return <>
        <style>{s}</style>
        <div className="Center2">Second Center Panel
            <button onClick={handleClose}>Close</button>
        </div> 
    </>
}
