import React from 'react'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import './ClassificationBanner.css'

export const ClassificationBanner: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    return <div className='classification-banner'>UNCLASSIFIED</div>
}
