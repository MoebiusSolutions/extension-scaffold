import React from 'react'

interface TitlebarProps {
    title: string
    subtitle: string
    name: string
}

export const Titlebar: React.FC<TitlebarProps> = ({
    title,
    subtitle,
    name,
}) => <div className='ribbon-titlebar'>
    <div className='ribbon-coptitle'>
        <span className='ribbon-coptitle-title'>{title}</span>
        <span className='ribbon-coptitle-subtitle'>{subtitle}</span>
    </div>
    <div className='ribbon-right'>
        <input type='text' />
        <span className='ribbon-right-name'>{name}</span>
    </div>
</div>
