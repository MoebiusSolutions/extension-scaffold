import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api"

const AmplifyPanel: React.FC<{
}> = ({
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
    }`

    return <>
        <style>{css}</style>
        <div className = 'amplify'>
            <h3>BOB</h3>
            <table>
                <tr>
                    <td>Shipclass</td>
                    <td>BOBCAT</td>
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
            </table>
        </div>
    </>
}

export const Amplify: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    const [open, setOpen] = React.useState(false)
    const [portalDiv, setPanelDiv] = React.useState<HTMLDivElement>()

    React.useEffect(() => {
        if (portalDiv) {
            return
        }
        es.addPanel({
            id: 'ext.snowpack.amplify.portal',
            location: 'portal',
        }).then(div => setPanelDiv(div))
        return () => { es.removePanel('ext.snowpack.amplify') }
    }, [])

    function handleAmplify() {
        setOpen(o => !o)
    }

    return <>
        <div>
            <button onClick={handleAmplify}>Amplify Example</button>
        </div>
        { open && portalDiv && ReactDOM.createPortal(<AmplifyPanel />, portalDiv) }
    </>
}
