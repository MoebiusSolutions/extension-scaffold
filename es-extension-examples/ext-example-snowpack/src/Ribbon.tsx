import React from 'react'
import ReactDOM from 'react-dom';
import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api"

const Tab: React.FC<{
    name: string, 
    active: string,
    handleTabClicked: (name: string) => void}>
= ({
    name,
    active,
    handleTabClicked,
}) => {
    return <div className='ribbon-tab' onClick={() => handleTabClicked(name)}>
        <div className={`${active === name && 'active'}`}>{name}</div>
    </div>
}

const RibbonBottom: React.FC<{
    active: string
    floating: boolean
}> = ({
    active,
    floating
}) => {
    return <div className='ribbon-bottom'>
        <div>Bottom part of {active} {floating ? 'floating' : ''} Ribbon</div>
        <div>Another Row on Ribbon <button>Test</button></div>
        <div>Another Row on Ribbon</div>
    </div>
}

export const Ribbon: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    const css = `
        .Ribbon {
            background: var(--es-theme-surface);
            user-select: none;
        }
        .ribbon-tabs {
            display: flex;
            flex-direction: row;
            padding-top: 0.25em;
            padding-bottom: 0.25em;
            background: rgba(255, 255, 255, 0.05);
        }
        .ribbon-tab {
            padding-right: 1em;
            padding-left: 1em;
        }
        .ribbon-tab:hover {
            background: rgba(0, 0, 0, 0.2);
            color: var(--es-theme-text-primary-on-background);
        }
        .ribbon-tab .active {
            border-bottom: 2px solid red;
            color: var(--es-theme-text-primary-on-background);
        }
        .ribbon-bottom {
            background: rgba(255, 255, 255, 0.05);
            padding-left: 1em;
            padding-right: 1em;
            padding-bottom: 0.5em;
        }
        .ribbon-float {
            background: var(--es-theme-surface);
            position: absolute;
            left: 0px;
            right: 0px;
            user-select: none;
            margin-bottom: 5px;
            box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
        }
    `
    const [portalDiv, setPanelDiv] = React.useState<HTMLDivElement>()
    const [active, setActive] = React.useState('File')
    const [open, setOpen] = React.useState(true)
    const [floating, setFloating] = React.useState(false)
    const tabs = [
        'File',
        'Display',
        'Help'
    ]

    React.useEffect(() => {
        if (portalDiv) {
            return
        }
        es.chrome.panels.addPanel({
            id: 'ext.snowpack.ribbon.portal',
            location: 'portal-wide',
        }).then(div => setPanelDiv(div))
    }, [])

    function handleTabClicked(tab: string) {
        setActive(tab)

        const newOpen = floating && tab === active? !open : true
        setOpen(newOpen)
    }
    function toggleFloat(evt: React.MouseEvent) {
        const newFloating = !floating
        setFloating(newFloating)
        setOpen(!newFloating)
    }

    return <>
        <style>{css}</style>
        <div className='Ribbon'>
            <div className="ribbon-tabs" onDoubleClick={toggleFloat}>
                {
                    tabs.map(t => <Tab key={t} active={active} name={t} handleTabClicked={handleTabClicked} />)
                }
            </div>
            { open && !floating && <RibbonBottom active={active} floating={floating} /> }
        </div>
        { open && floating && portalDiv && ReactDOM.createPortal(
            <>
                <style>{css}</style>
                <div className="ribbon-float">
                    <RibbonBottom active={active} floating={floating} />
                </div>
            </>,
            portalDiv
        )}
    </>
}
