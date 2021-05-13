import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { Center2 } from './Center2';
import './MyPanel.css';
import { claimStyleFromHeadElement } from './lib/claimStyleFromHeadElement';

export const MyPanel: React.FC<{ 
    es: ExtensionScaffoldApi
}> = ({ es }) => {
    function handleClick() {
        console.log('snowpack clicked')
    }
    function handleMaximize() {
        console.log('snowpack maximize')
        es.maximizePanel('ext.example.snowpack')
    }
    function handleRestore() {
        es.restorePanel('ext.example.snowpack')
    }
    function handleClose() {
        es.removePanel('ext.example.snowpack')
    }
    function handleAddCenter() {
        es.addPanel({
            id: 'ext.example.snowpack.2',
            location: 'center',
        }).then(onPanelAdded)
    }
    function onPanelAdded(div: HTMLDivElement) {
        console.log('snowpack got a div for Center2', div)
        ReactDOM.render(
            <React.StrictMode>
                <Center2 es={es} />
            </React.StrictMode>,
            div
        );
        // Must be after render above
        claimStyleFromHeadElement(div, '#ext.example.snowpack')
    }
    function handleShowRollupPanel() {
        es.showPanel('ext.example.rollup')
    }

    return <><div className='MyPanel' onClick={handleClick}>
        MyPanel - snowpack - with a whole lot of text so that if a panel is over this Panel
        you can still see that something is here.
    </div>
        <button onClick={handleMaximize}>Maximize Me</button>
        <button onClick={handleRestore}>Restore Me</button>
        <button onClick={handleClose}>Close Me</button>
        <button onClick={handleAddCenter}>Add Center</button>
        <button onClick={handleShowRollupPanel}>Show Rollup</button>
    </>
}
