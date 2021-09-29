import React from 'react'
import { SimpleRibbon } from './ribbon/Ribbon'
import { MissionPlanning } from './MissionPlanning'
// @ts-ignore
import ribbonStyle from './ribbon/Ribbon.css'

export const BGORibbon = () => (
    <>
        <style>{ribbonStyle}</style>
        <SimpleRibbon
            plan="Untitled"
            opauth="CTF-74"
            onSettingsClick={() => console.log('settings clicked')}
            onUserClick={() => console.log('user clicked')}
            labels={[
                'View',
                'Chart Settings',
                'Tracks',
                'Tactical',
                'TDA',
                'Text2Tactical',
                'Mission Planning',
                'Help']}
        >
            <div>View (TODO SEE MISSION PLANNING)</div>
            <div>Chart Settings (TODO SEE MISSION PLANNING)</div>
            <div> Tracks (TODO SEE MISSION PLANNING)</div>
            <div>Tactical (TODO SEE MISSION PLANNING)</div>
            <div>TDA (TODO SEE MISSION PLANNING)</div>
            <div>Text2Tactical (TODO SEE MISSION PLANNING)</div>
            <MissionPlanning />
            <div>Help (TODO SEE MISSION PLANNING)</div>
        </SimpleRibbon>
    </>
)
