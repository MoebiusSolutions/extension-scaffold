import React from 'react'
import { MenuSection } from './ribbon/MenuSection'
import { MenuButton } from './ribbon/MenuButton'
import { VerticalDivider } from './ribbon/VerticalDivider'

export const MissionPlanning: React.FC = () => {
    const onClick = () => console.log('menu button clicked: TODO')

    return (
        <>
            <MenuSection name="Area Plans">
                <MenuButton name="New Plan" svgUrl="/static/icons/plus-square-o.svg" onClick={onClick} />
                <MenuButton name="Edit Plan" svgUrl="/static/icons/pencil-square-o.svg" onClick={onClick} />
                <MenuButton name="Filter Plan" svgUrl="/static/icons/filter.svg" onClick={onClick} />
            </MenuSection>
            <MenuSection name="General Area">
                <MenuButton name="New Area" svgUrl="/static/icons/plus-square-o.svg" onClick={onClick} />
                <MenuButton name="Edit Summary" svgUrl="/static/icons/list.svg" onClick={onClick} />
                <MenuButton name="Area Filters" svgUrl="/static/icons/filter.svg" onClick={onClick} />
                <MenuButton name="Static Areas" svgUrl="" onClick={onClick} />
                <MenuButton name="Dynamic Areas" svgUrl="/static/icons/cube.svg" onClick={onClick} />
                <VerticalDivider />
            </MenuSection>
            <MenuSection name="Assets">
                <MenuButton name="OCB Manager" svgUrl="/static/icons/sitemap.svg" onClick={onClick} />
                <MenuButton name="Pucks" svgUrl="/static/icons/ship.svg" onClick={onClick} />
            </MenuSection>
            <MenuSection name="ASW Search Planning">
                <MenuButton name="SPA" svgUrl="/static/icons/wifi.svg" onClick={onClick} />
            </MenuSection>
            <MenuSection name="Review">
                <MenuButton name="Interferance Check" svgUrl="/static/icons/exclamation-triangle.svg" onClick={onClick} />
                <MenuButton name="Sign Plan" svgUrl="/static/icons/check-square-o.svg" onClick={onClick} />
                <MenuButton name="Manage Reviewers" svgUrl="/static/icons/users.svg" onClick={onClick} />
                <MenuButton name="Export Plan" svgUrl="/static/icons/share-square-o.svg" onClick={onClick} />
            </MenuSection>
            <MenuSection name="Messages">
                <MenuButton name="New Message" svgUrl="/static/icons/plus-square-o.svg" onClick={onClick} />
                <MenuButton name="Download" svgUrl="/static/icons/cloud-download.svg" onClick={onClick} />
            </MenuSection>
        </>
    )
}
