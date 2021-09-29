import React from 'react'
import { ReactSVG } from './ReactSVG'

interface MenuButtonProps {
    name: string
    svgUrl: string
    onClick?: () => void
}
export const MenuButton: React.FC<MenuButtonProps> = ({
    name,
    svgUrl,
    onClick,
}) => (
    <div className="ribbon-button" onClick={onClick}>
        <ReactSVG src={svgUrl} />
        <div className="ribbon-button-label" style={{ fontSize: '10px' }}>{name}</div>
    </div>
)
