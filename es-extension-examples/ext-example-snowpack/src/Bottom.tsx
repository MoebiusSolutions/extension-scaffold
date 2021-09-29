import React from 'react'
import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api"
import './Center2.css' // snowpack injects this at the head, but we claim it in MyPanel.tsx

export const Bottom: React.FC<{ 
    es: ExtensionScaffoldApi
}> = ({ es }) => {
    return <>
        <link href="http://localhost:9091/index.css" rel="stylesheet"></link>
        <div className="Bottom">Bottom Panel
        </div>
    </>
}
