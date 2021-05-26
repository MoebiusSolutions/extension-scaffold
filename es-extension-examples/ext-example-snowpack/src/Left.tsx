import React from 'react'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { addCenterPanel } from './ext-react-snowpack'
import { Amplify } from './Amplify'

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
        es.hidePanel('ext.snowpack.left')
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

        <Amplify es={es} />
    </div>
}
