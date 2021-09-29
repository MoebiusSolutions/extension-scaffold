import ReactDOM from 'react-dom'
import React from 'react'
import { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { Banner } from './Banner'
import type { SecurityType } from './Banner'

/** Change to adjust security banner */
const security: SecurityType = 'UNCLASSIFIED'

export const activate = async (scaffold: ExtensionScaffoldApi) => {
    const panelDiv = await scaffold.chrome.panels.addPanel({
        id: 'bgo.security.header',
        location: 'header',
    })

    const footerDiv = await scaffold.chrome.panels.addPanel({
        id: 'bgo.security.footer',
        location: 'footer',
    })

    ReactDOM.render(
        <React.StrictMode>
            <Banner security={security}/>
        </React.StrictMode>,
        panelDiv,
    )

    ReactDOM.render(
        <React.StrictMode>
            <Banner security={security}/>
        </React.StrictMode>,
        footerDiv,
    )

    return panelDiv
}
