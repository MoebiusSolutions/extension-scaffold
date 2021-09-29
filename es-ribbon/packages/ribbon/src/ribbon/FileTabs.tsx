import React from 'react'
import { Tab } from './FileTab'

interface TabsProps {
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
    <div className="ribbon-tabs">
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
    </div>
)
