import React from 'react'
import useDoubleClick from 'use-double-click'

interface TabProps {
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
        <span
            ref={ref}
            className={`ribbon-tab ${active ? 'active' : ''}`}
            key={label}
        >
            {label}
        </span>
    )
}
