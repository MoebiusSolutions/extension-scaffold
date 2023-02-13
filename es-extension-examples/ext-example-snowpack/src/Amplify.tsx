import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from "@moesol/es-runtime/build/es-api"

const AmplifyPanel: React.FC<{
    handleClose: () => void
}> = ({
    handleClose
}) => {
    const css = `.amplify {
        background: var(--es-theme-surface);
        position: absolute;
        bottom: 1em;
        padding-left: 1em;
        padding-right: 1em;
        padding-bottom: 1em;
        padding-top: 0px;
        border: 1px solid grey;
        z-index: 100;
    }
    .close {
        cursor: pointer;
        float: right;
    }
    `

    return <>
        <style>{css}</style>
        <div className = 'amplify'>
            <div className="close" onClick={handleClose}>x</div>
            <h3>BOB</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Attribute</td>
                        <td>Value</td>
                    </tr>
                    <tr>
                        <td>Attribute</td>
                        <td>Value</td>
                    </tr>
                    <tr>
                        <td>Attribute</td>
                        <td>Value</td>
                    </tr>
                    <tr>
                        <td>Attribute</td>
                        <td>Value</td>
                    </tr>
                    <tr>
                        <td>Attribute</td>
                        <td>Value</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
}

export const Amplify: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    const [open, setOpen] = React.useState(false)
    const amplifyPanelID = 'ext.snowpack.amplify.portal'

    React.useEffect(() => {
        if (open) {
            function addAmplify(portalDiv: HTMLDivElement) {
                ReactDOM.render(<AmplifyPanel handleClose={handleClose}/>, portalDiv)
            }
            es.chrome.panels.addPanel({
                id: amplifyPanelID,
                location: 'portal',
            }).then(div => addAmplify(div))
        } else {
            es.chrome.panels.removePanel(amplifyPanelID)
        }
    }, [open])

    function handleAmplify() {
        setOpen(o => !o)
    }
    function handleClose() {
        setOpen(false)
    }

    return <>
        <div>
            <button onClick={handleAmplify}>Amplify Example</button>
        </div>
    </>
}
