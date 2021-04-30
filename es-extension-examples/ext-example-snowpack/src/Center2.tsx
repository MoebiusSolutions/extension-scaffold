import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from "../../../es-api/es-api"
import { Center3 } from './Center3'
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
    }
    async function handleAdd() {
        const div = await es.claimPanel({
            id: 'ext.example.snowpack.3',
            location: 'center'
        })
        ReactDOM.render(
            <React.StrictMode>
              <Center3 es={es}/>
            </React.StrictMode>,
            div
        );
    }
    return <>
        <style>{s}</style>
        <div className="Center2">Second Center Panel
            <button onClick={handleClose}>Close</button>
            <button onClick={handleAdd}>Add Another</button>
        </div> 
    </>
}
