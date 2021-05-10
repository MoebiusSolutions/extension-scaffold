import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api"
import { Center3 } from './Center3'
// import './Center2.css' snowpack injects this at the head

export const Center2: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    function handleClose() {
        es.removePanel('ext.example.snowpack.2')
    }
    async function handleAdd() {
        const div = await es.addPanel({
            id: 'ext.example.snowpack.3',
            location: 'center'
        })
        ReactDOM.render(
            <React.StrictMode>
                <Center3 es={es} />
            </React.StrictMode>,
            div
        );
    }
    /*
     * Note that below we link to an external stylesheet.
     * See Center3.tsx for how we can inject CSS from JS.
     */
    return <>
        <link href="http://localhost:9091/index.css" rel="stylesheet"></link>
        <div className="Center2">Second Center Panel
            <button onClick={handleClose}>Close</button>
            <button onClick={handleAdd}>Add Another</button>
        </div>
    </>
}
