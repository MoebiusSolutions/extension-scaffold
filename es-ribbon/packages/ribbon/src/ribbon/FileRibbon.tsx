import React from 'react'
import { Tabs } from './FileTabs'
import { Menu } from './Menu'
import './Ribbon.css'

interface RibbonProps {
    children: React.ReactNode[]
    active?: number
    labels: string[]
}

export const Ribbon: React.FC<RibbonProps> = ({
    active: initActive,
    labels,
    children,
}) => {
    const [active, setActive] = React.useState(initActive)
    const [pinned, setPinned] = React.useState(true)

    const onClick = (idx: number) => {
        if (idx === active) {
            setActive(undefined)
        } else {
            setActive(idx)
        }
    }

    const onDoubleClick = (idx: number) => {
        if (pinned) {
            setPinned(false)
        } else {
            setPinned(true)
        }
        if (idx !== active) {
            setActive(idx)
        }
    }

    return (
        <div className="ribbon">
            <Tabs {...{
                active, labels, onClick, onDoubleClick,
            }}
            />
            <Menu pinned={pinned}>
                {children.map((child, childIdx) => (active === childIdx ? <>{child}</> : null))}
            </Menu>
        </div>
    )
}
