import React from 'react'
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import './Header.css'

export const Header: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    return <div className='header'>UNCLASSIFIED</div>
}
