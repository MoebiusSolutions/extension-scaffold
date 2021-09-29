import React from 'react'
import useDoubleClick from 'use-double-click'

export interface TabProps {
    label: string
    active?: boolean
    onClick: (e: MouseEvent) => void // eslint-disable-line
    onDoubleClick: (e: React.MouseEvent<Element, MouseEvent>) => void // eslint-disable-line
}
export const Tab: React.FC<TabProps> = ({
    label,
    active = false,
    onClick,
    onDoubleClick,
}) => {
    const ref = React.useRef(null)

    useDoubleClick({
        // @ts-ignore
        onSingleClick: onClick,
        onDoubleClick,
        ref,
        latency: 250,
    })

    return (
        <li
            ref={ref}
            className={`tab ${active ? 'active' : ''}`}
            key={label}
        >
            {label}
        </li>
    )
}

export interface TabsProps {
    labels: string[],
    active?: number
    onClick: (idx: number) => void // eslint-disable-line
    onDoubleClick: (idx: number) => void // eslint-disable-line
}

export const Tabs: React.FC<TabsProps> = ({
    labels,
    active,
    onClick = (idx: number) => console.log('Must provide onClick handler', idx), // eslint-disable-line
    onDoubleClick = (idx: number) => console.log('Must provide a double click handler'), // eslint-disable-line
}) => (
    <div className="tabs-container">
        <ul className="tabs">
            {
                labels.map((label, idx) => (
                    <Tab
                        key={label}
                        label={label}
                        active={active === idx}
                        onClick={() => onClick(idx)}
                        onDoubleClick={() => onDoubleClick(idx)}
                    />
                ))
            }
        </ul>
    </div>
)
