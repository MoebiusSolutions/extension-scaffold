import React from 'react'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { addCenterPanel, addModalPanel, addModelessPanel, moveLeftToRight, moveRightToLeft } from './ext-react-snowpack'
import { Amplify } from './Amplify'
import { SampleModal } from './SampleModal'

export const Left: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {

    function handleAddCenter() {
        addCenterPanel(es)
    }
    function handlePopOut() {
        es.chrome.panels.popOutPanel('ext.snowpack.left')
    }
    function handlePopIn() {
        es.chrome.panels.popInPanel('ext.snowpack.left')
    }
    function handleHide() {
        es.chrome.panels.hidePanel('ext.snowpack.left')
    }
    function handleMoveToRight() {
        moveLeftToRight(es)
    }
    function handleMoveToLeft() {
        moveRightToLeft(es)
    }
    function showExampleContent() {
        const e = es.chrome.ribbonBar.showRibbonTab('Example Content')
    }

    function hideExampleContent() {
        const e = es.chrome.ribbonBar.hideRibbonTab('Example Content')
    }

    function handleModelessDialog() {
        addModelessPanel(es, 'ext.example.snowpack.modeless')
    }
    function handleModalDialog() {
        addModalPanel(es, 'ext.example.snowpack.modal')
    }
    function handleModelessDialog2() {
        addModelessPanel(es, 'ext.example.snowpack.modeless.2')
    }
    function handleIframeModeless() {
        es.chrome.panels.addPanel({
            id: 'snowpack.iframe.modeless',
            location: 'modeless',
            iframeSource: '/foo/bar',
            hideButton: true,
            initialWidthOrHeight: {
                width: '30em',
                height: '40em'
            }
        }).catch(() => {
            es.chrome.panels.showPanel('snowpack.iframe.modeless')
        })
    }

    return <div style={{
        padding: '1em',
    }}>
        Left example from snowpack
        <p></p>
        <div>
            <button onClick={handleAddCenter}>Add Center</button>
        </div>
        <div>
            <button onClick={handlePopOut}>Pop Out</button>
        </div>
        <div>
            <button onClick={handlePopIn}>Pop In</button>
        </div>
        <div>
            <button onClick={handleHide}>X</button>
        </div>
        <div>
            <button onClick={handleMoveToRight}>Move to Right</button>
        </div>
        <div>
            <button onClick={handleMoveToLeft}>Move to Left</button>
        </div>
        <div>
            <button onClick={showExampleContent}>Show Example Content Tab</button>
        </div>
        <div>
            <button onClick={hideExampleContent}>Hide Example Content Tab</button>
        </div>

        <Amplify es={es} />

        <SampleModal es={es} />

        <div>
            <button onClick={handleModalDialog}>Modal Dialog</button>
        </div>
        <div>
            <button onClick={handleModelessDialog}>Modeless Dialog</button>
        </div>
        <div>
            <button onClick={handleModelessDialog2}>Second Modeless</button>
        </div>
        <div>
            <button onClick={handleIframeModeless}>IFrame Modeless</button>
        </div>
    </div>
}
