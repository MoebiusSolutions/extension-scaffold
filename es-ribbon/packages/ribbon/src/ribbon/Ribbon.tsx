import React from 'react'
import { SimpleHeader } from './Header'
import { Menu } from './Menu'

export const Ribbon: React.FC = ({ children }) => (
    <div className="ribbon">{children}</div>
)

interface SimpleRibbonProps {
    children: React.ReactNode[]
    active?: number
    labels: string[]
    plan: string
    opauth: string
    onSettingsClick?: () => void
    onUserClick?: () => void
}

export const SimpleRibbon: React.FC<SimpleRibbonProps> = ({
    children,
    active: initActive = -1,
    labels,
    plan,
    opauth,
    onSettingsClick,
    onUserClick,
}) => {
    const [active, setActive] = React.useState(initActive)
    const [pinned, setPinned] = React.useState(true)

    const onClick = (idx: number) => {
        if (idx === active) {
            setActive(-1)
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
        <Ribbon>
            <SimpleHeader {...{
                labels,
                onClick,
                onDoubleClick,
                plan,
                opauth,
                active,
                onSettingsClick,
                onUserClick,
            }}
            />
            {active > -1 && (
                <Menu pinned={pinned}>
                    {children.map((child, childIdx) => (active === childIdx ? child : null))}
                </Menu>
            ) }
        </Ribbon>
    )
}
