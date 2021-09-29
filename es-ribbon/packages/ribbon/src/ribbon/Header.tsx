import React from 'react'
import { ReactSVG } from './ReactSVG'
import { Tabs, TabsProps } from './Tabs'

interface PlanProps {
    plan: string
    opauth: string
}

// <dl className="plan-section">

export const Plan: React.FC<PlanProps> = ({
    plan, opauth,
}) => (
    <div className="plan-section">
        <div>
            Plan:
            {' '}
            <strong>{plan}</strong>
        </div>
        <div>
            OPAUTH:
            {' '}
            <strong>{opauth}</strong>
        </div>
    </div>
    // <dl className="plan-section">

    //     <dt>Plan</dt>
    //     <dd>{plan}</dd>
    //     <dt>OPAUTH</dt>
    //     <dd>{opauth}</dd>
    // </dl>
)

interface ContentProps {
    onSearchChange?: (val: string) => void // eslint-disable-line
    onSettingsClick?: () => void
    onUserClick?: () => void
}

export const Content: React.FC<ContentProps> = ({
    onSearchChange = () => {},
    onSettingsClick,
    onUserClick,
}) => {
    const [search, setSearch] = React.useState('')

    const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const searchVal = evt.target.value
        setSearch(searchVal)
        onSearchChange(searchVal)
    }

    return (
        <div className="content-section">
            {/** eslint-disable-next-line */}
            <div className="search-input">
                <ReactSVG
                    src="/static/icons/search.svg"
                    style={{ position: 'absolute', padding: '5px', top: '6px' }}
                    svgStyle={{ height: '20px', width: '20px' }}
                />
                <input
                    type="text"
                    onChange={handleSearch}
                    value={search}
                    placeholder="Search"
                />
            </div>
            {onSettingsClick
                && (
                    <div onClick={onSettingsClick}>
                        <ReactSVG src="/static/icons/cog.svg" />
                    </div>
                )}
            {onUserClick
                && (
                    <div onClick={onUserClick}>
                        <ReactSVG src="/static/icons/user.svg" />
                    </div>
                )}
        </div>
    )
}

export const Header: React.FC = ({
    children,
}) => (
    <div className="header">
        {children}
    </div>
)

type SimpleHeaderProps = PlanProps & ContentProps & TabsProps

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
    plan,
    opauth,
    labels,
    onClick,
    onDoubleClick,
    active,
    ...contentProps
}) => (
    <Header>
        <Plan {...{ plan, opauth }} />
        <Tabs {...{
            labels, onClick, onDoubleClick, active,
        }}
        />
        <Content {...contentProps} />
    </Header>
)
