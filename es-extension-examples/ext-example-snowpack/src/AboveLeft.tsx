import React from 'react'
import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api"

export const AboveLeft: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    const css = `
        .AboveLeft {
            padding: 1em;
            background: rgb(255, 255, 255, .05)
        }
    `
    return <>
        <style>{css}</style>
        <div className='AboveLeft'>
            <h3>CSG9-EXER21 v</h3>
            <div>
            Find | Fix | Track | <b>Plan</b> | Target | Engage | Assess
            </div>
        </div>
    </>
}
