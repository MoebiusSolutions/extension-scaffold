import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from '@moesol/es-runtime/build/es-api'
import { Center2 } from './Center2';
import './MyPanel.css';
import { claimStyleFromHeadElement } from './lib/claimStyleFromHeadElement';

export const MyModal: React.FC<{
    es: ExtensionScaffoldApi
    esId: string
}> = ({ es, esId }) => {
    function handleClick() {
        console.log('snowpack clicked')
    }
    function handleMaximize() {
        es.chrome.panels.maximizePanel(esId)
    }
    function handleRestore() {
        es.chrome.panels.restorePanel(esId)
    }
    function handleClose() {
        es.chrome.panels.removePanel(esId)
    }
    function onPanelAdded(div: HTMLDivElement) {
        ReactDOM.render(
            <React.StrictMode>
                <Center2 es={es} />
            </React.StrictMode>,
            div
        );
        // Must be after render above
        claimStyleFromHeadElement(div, '#ext.example.snowpack')
    }

    return <><div className='MyPanel' onClick={handleClick}>
        Modal - snowpack - with a whole lot of text so that if a panel is over this Panel
        you can still see that something is here.

        <div className='buttons'>
            <button onClick={handleMaximize}>Maximize Me</button>
            <button onClick={handleRestore}>Restore Me</button>
            <button onClick={handleClose}>Close Me</button>
        </div>
    </div>
    </>
}
