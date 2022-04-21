import React from 'react'

export const GenericModalPanel: React.FC<{
    onAccept: () => void,
    onCancel: () => void,
    onAcceptText?: string,
    onCancelText?: string,
    showCancelButton?: boolean,
    content: any,
    title: string,
    showFooter: boolean,
}> = ({
    onAccept,
    onCancel,
    onAcceptText,
    onCancelText,
    content,
    title,
    showFooter,
    showCancelButton,
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
            {showCancelButton && <div>
                <button className = 'modal-cancel' onClick={onCancel}>{onCancelText || 'Cancel'}</button>
            </div>}
            <div>
                <button className = 'modal-accept' onClick={onAccept}>{onAcceptText || 'Accept'}</button>
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
