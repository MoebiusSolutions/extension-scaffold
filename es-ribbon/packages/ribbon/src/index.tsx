import React from 'react'
import ReactDOM from 'react-dom'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { BGORibbon } from './BGORibbon'

export const activate = async (scaffold: ExtensionScaffoldApi) => {
    const panelDiv = await scaffold.chrome.panels.addPanel({
        id: 'bgo.ribbon.test',
        location: 'top-bar',
    })

    panelDiv.style.removeProperty('height')

    ReactDOM.render(
        <React.StrictMode>
            <BGORibbon />
        </React.StrictMode>,
        panelDiv,
    )

    return panelDiv
}
