import React from 'react'
import type { ExtensionScaffoldApi } from "../../../es-api/es-api"

export const AboveLeft: React.FC<{es: ExtensionScaffoldApi}> = ({es}) => {
    const s = `
        .AboveLeft {
            background-color: grey;
        }
    `
    return <>
        <style>{s}</style>
        <div className='AboveLeft'>
            Above Left
        </div>
    </>
}
