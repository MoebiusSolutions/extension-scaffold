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
    const css = `
    .modal {
        position: fixed;
        left: 0;
        top:0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .modal-content {
        width: 500px;
        background-color: var(--es-theme-surface);
    }
    .modal-header {
        padding: 10px;
    }
    .modal-footer {
        padding: 10px;
    }
    .modal-body {
        padding: 10px;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }
    .modal-accept {
        float: right;
        margin: 10px;
    }
    .modal-cancel {
        float: right;
        margin: 10px;
    }
    .form-label {
        width: 50%;
        margin: 10px;
        white-space: nowrap;
    }
    .form-input {
        width: 50%;
        margin: 10px;
        white-space: nowrap;
    }
    `
    const [text, setText] = React.useState(buttonText)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    const modalContent = (
        <div>
            <div className = 'form-label'>
                <label htmlFor="button-name">New Text For Modal Button</label>
            </div>
            <div className = 'form-input' >
                <input type="text" id="button-name" name="button-name" required
                    minLength={1} maxLength={20} size={20} value={text} onChange={handleChange}/>
            </div>
        </div>
    );

    const modalFooter = (
        <div>
            <div>
                <button className = 'modal-cancel' onClick={onCancel}>Cancel</button>
            </div>
            <div>
                <button className = 'modal-accept' onClick={() => onAccept(text)}>Accept</button>
            </div>
        </div>
    );

    return <>
        <style>{css}</style>
        <div>
            <div className="modal" onClick={onCancel}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h4 className="modal-title">Example Modal</h4>
                    </div>
                    <div className="modal-body">
                        {modalContent}
                    </div>
                    <div className="modal-footer">
                        {modalFooter}
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
