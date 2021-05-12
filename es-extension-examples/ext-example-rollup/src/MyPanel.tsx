import * as React from 'react'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'

export const MyPanel: React.FC<{es: ExtensionScaffoldApi}> = ({es}) => {
    function handleClick() {
        console.log('Rollup was clicked - hiding')
        es.hidePanel('ext.example.rollup')
    }
    const css = `
    .panel {
        height: 100%;
        background: #292929;
        color: #e2e2e2
    }
    .inner {
        padding: 1em;
    }
    `
    return <>
        <style>{css}</style>
        <div className="panel">
            <div className="inner">MyPanel - rollup&nbsp;
                <button title="Close" onClick={handleClick}>X</button>
            </div>
        </div>
    </>
    
}
