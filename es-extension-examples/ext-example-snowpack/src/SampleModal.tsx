import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api"

const SampleModalPanel: React.FC<{
    onAccept: (text: string) => void,
    onCancel: () => void,
    buttonText: string,
}> = ({
    onAccept,
    onCancel,
    buttonText
}) => {
    const css = `.sample-modal {
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        display: block;

        padding-left: 1em;
        padding-right: 1em;
        padding-bottom: 1em;
        padding-top: 0px;
        border: 1px solid grey;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }
    .sample-modal-title {
        margin: auto;
        width: 50%;
    }
    .sample-modal-content {
        margin: auto;
        width: 50%;
    }
    .sample-modal-actions {
        margin: auto;
        width: 50%;
    }
    .sample-modal-frame {
        border: 3px solid black;
        margin: auto;
        width: 50%;
        height: 50%;
        background-color: rgb(128,128,128, 1);
    }
    .close {
        cursor: pointer;
        float: right;
    }
    `
    const [text, setText] = React.useState(buttonText)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    return <>
        <style>{css}</style>
        <div className = 'sample-modal'>
            <div className = 'sample-modal-frame'>
                <div className="close" onClick={onCancel}>x</div>
                <h3 className='sample-modal-title'>
                    Sample Content Below
                </h3>
                <div className = 'sample-modal-content'>
                    <label htmlFor="button-name">Change Label of Modal Button:</label>
                    <input type="text" id="button-name" name="button-name" required
                        minLength={1} maxLength={20} size={20} value={text} onChange={handleChange}/>
                </div>
                <div className = 'sample-modal.actions'>
                    <div>
                        <button className = 'sample-modal-actions-cancel' onClick={onCancel}>Cancel</button>
                    </div>
                    <div>
                        <button className = 'sample-modal-actions-accept' onClick={() => onAccept(text)}>Accept</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export const SampleModal: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    const [open, setOpen] = React.useState(false)
    const [buttonText, setButtonText] = React.useState('Sample Modal Example')
    const [portalDiv, setPanelDiv] = React.useState<HTMLDivElement>()

    React.useEffect(() => {
        if (portalDiv) {
            return
        }
        es.chrome.panels.addPanel({
            id: 'ext.snowpack.samplemodal.portal',
            location: 'portal-wide',
        }).then(div => setPanelDiv(div))
        es.chrome.panels.maximizePanel('ext.snowpack.samplemodal.portal');
        return () => { es.chrome.panels.removePanel('ext.snowpack.samplemodal') }
    }, [])

    function openModal() {

        setOpen(true)
    }

    function closeModal() {
        setOpen(false)
    }

    function onCancel() {
        closeModal()
    }

    function onAccept(text: string) {
        setButtonText(text)
        closeModal()
    }

    return <>
        <div>
            <button onClick={openModal}>{buttonText}</button>
        </div>
        { open && portalDiv && ReactDOM.createPortal(
        <SampleModalPanel onCancel={onCancel} onAccept={onAccept} buttonText={buttonText} />, portalDiv) }
    </>
}
