import React from 'react'

interface MenuProps {
    children: React.ReactNode[]
    pinned: boolean
}

export const Menu: React.FC<MenuProps> = ({
    children,
    pinned,
}) => (
    <div className={`ribbon-menu ${pinned ? 'pinned' : ''}`}>
        {children.map((child) => <>{child}</>)}
    </div>
)
