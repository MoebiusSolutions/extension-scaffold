import React from 'react'

interface MenuSectionProps {
    children: React.ReactNode
    name: string
}

export const MenuSection: React.FC<MenuSectionProps> = ({
    children,
    name,
}) => (
    <div className="ribbon-section">
        <div className="ribbon-section-items">
            {children}
        </div>
        <div className="ribbon-section-label">{name}</div>
    </div>
)
