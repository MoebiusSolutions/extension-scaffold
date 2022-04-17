import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api"

const GenericModalPanel: React.FC<{
    onAccept: () => void,
    onCancel: () => void,
    content: any,
    title: string,
    showFooter: boolean,
}> = ({
    onAccept,
    onCancel,
    content,
    title,
    showFooter,
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
    }
    .modal-accept {
        float: right;
        margin: 10px;
    }
    .modal-cancel {
        float: right;
        margin: 10px;
    }
    `
    const modalContent = (
        <div>
            {content}
        </div>
    );

    const modalFooter = (
        <div>
            <div>
                <button className = 'modal-cancel' onClick={onCancel}>Cancel</button>
            </div>
            <div>
                <button className = 'modal-accept' onClick={onAccept}>Accept</button>
            </div>
        </div>
    );

    return <>
        <style>{css}</style>
        <div>
            <div className="modal" onClick={onCancel}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h4 className="modal-title">{title}</h4>
                    </div>
                    <div className="modal-body">
                        {modalContent}
                    </div>
                    {showFooter && <div className="modal-footer">
                        {modalFooter}
                    </div>}
                </div>
            </div>
        </div>
    </>
}

export const GenericModal: React.FC<{ 
    scaffold: ExtensionScaffoldApi,
    buttonText: string,
    modalId: string,
    content: any,
    title: string,
    showFooter: boolean,
  }> = ({ scaffold, buttonText, modalId, content, title, showFooter }) => {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        if (open) {
            scaffold.chrome.panels.addPanel({
                id: modalId,
                location: 'portal-wide',
            }).then(portalDiv => {
                ReactDOM.render(
                    <GenericModalPanel onCancel={onCancel} onAccept={onAccept}  
                        content={content} title={title} showFooter={showFooter} />, portalDiv)
            })
        } else {
            scaffold.chrome.panels.removePanel(modalId)
        }
    }, [open])

    function openModal() {
        setOpen(true)
    }

    function closeModal() {
        setOpen(false)
    }

    function onCancel() {
        closeModal()
    }

    function onAccept() {
        closeModal()
    }

    return <label onClick={openModal}>{buttonText}</label>
}
