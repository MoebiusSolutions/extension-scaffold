import * as React from 'react'
import type { ExtensionScaffoldApi } from '../../../es-api/es-api'

export const MyPanel: React.FC<{es: ExtensionScaffoldApi}> = ({es}) => {
    function handleClick() {
        console.log('Rollup was clicked - hiding')
        es.hidePanel('ext.example.rollup')
    }
    return <div onClick={handleClick}>MyPanel - rollup</div>
}
