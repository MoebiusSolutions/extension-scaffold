import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api";
import React from 'react';
import ReactDOM from 'react-dom';

const ExtensionScaffoldContext = React.createContext<ExtensionScaffoldApi>(null as any)

const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
const FirstPageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M24 0v24H0V0h24z" fill="none" opacity=".87"/><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z"/></svg>
const LastPageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zM16 6h2v12h-2V6z"/></svg>
const TopicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M20,6h-8l-2-2H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16.77c0.68,0,1.23-0.56,1.23-1.23V8C22,6.9,21.1,6,20,6z M20,18L4,18V6h5.17l2,2H20V18z M18,12H6v-2h12V12z M14,16H6v-2h8V16z"/></svg>
const TodayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zM7 11h5v5H7z"/></svg>
const ZoomInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z"/></svg>
const ZoomOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg>
const PhotoCameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.12 4l1.83 2H20v12H4V6h4.05l1.83-2h4.24M15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2zm-3 7c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/></svg>
const FileUploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z"/></svg>
const FileDownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z"/></svg>
const AlignHorizontalCenterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect fill="none" height="24" width="24"/><polygon points="11,2 13,2 13,7 21,7 21,10 13,10 13,14 18,14 18,17 13,17 13,22 11,22 11,17 6,17 6,14 11,14 11,10 3,10 3,7 11,7"/></svg>
const PlayArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg>
const FastRewindIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 9.86v4.28L14.97 12 18 9.86m-9 0v4.28L5.97 12 9 9.86M20 6l-8.5 6 8.5 6V6zm-9 0l-8.5 6 8.5 6V6z"/></svg>

export function claimPlansRibbonSections(scaffold: ExtensionScaffoldApi) {
    const sections = [
        { id: 'tpt2.coas', node: <Tpt2Coas /> },
        { id: 'tpt2.units', node: <Tpt2Units /> },
        { id: 'tpt2.events', node: <Tpt2Events /> },
        { id: "tpt2.file", node: <TptFile />},
        { id: "tpt2.timescale", node: <TptTimescale /> },
        { id: "tpt2.planning.horizon", node: <TptPlanningHorizon /> },
        { id: "tpt2.plan.animation", node: <TptPlanAnimation /> },
        { id: "tpt2.cursors", node: <TptCursors /> },
    ]
    sections.forEach(sec => {
        const section = scaffold.chrome.ribbonBar.claimRibbonPanel(sec.id)
        if (!section) { 
            console.error('Section not found', sec.id)
            return 
        }
        ReactDOM.render(<React.StrictMode>
            <ExtensionScaffoldContext.Provider value={scaffold}>
                {sec.node}
            </ExtensionScaffoldContext.Provider>
        </React.StrictMode>, section)
    })
}
const Tpt2Coas = () => {
    return <es-ribbon-section label="COAs">
        <es-ribbon-button >
            <AddIcon />
            <label>Create</label>
        </es-ribbon-button>
        <es-ribbon-button-split label="Schedule" >
            <es-ribbon-dropdown>
                <es-ribbon-dropdown-item label="Toggle Panel" />
                <es-ribbon-dropdown-item label="Open in Window" />
            </es-ribbon-dropdown>
        </es-ribbon-button-split>
    </es-ribbon-section>
}
const Tpt2Units = () => {
    return <es-ribbon-section label="Units">
        <es-ribbon-button >
            <AddIcon />
            <label>Create</label>
        </es-ribbon-button>
        <es-ribbon-column>
            <es-ribbon-button-split label="ALCSG">
                <es-ribbon-dropdown>
                    <es-ribbon-dropdown-item label="Toggle Panel" />
                    <es-ribbon-dropdown-item label="Open in Window" />
                </es-ribbon-dropdown>
            </es-ribbon-button-split>
            <es-ribbon-button-split label="Abbreviation">
                <es-ribbon-dropdown>
                    <es-ribbon-dropdown-item label="Toggle Panel" />
                    <es-ribbon-dropdown-item label="Open in Window" />
                </es-ribbon-dropdown>
            </es-ribbon-button-split>
        </es-ribbon-column>
        <es-ribbon-column>
            <es-ribbon-button-split label="Hidden:">
                <es-ribbon-dropdown>
                    <es-ribbon-dropdown-item label="Toggle Panel" />
                    <es-ribbon-dropdown-item label="Open in Window" />
                </es-ribbon-dropdown>
            </es-ribbon-button-split>
            <es-ribbon-button-split label="Other:">
                <es-ribbon-dropdown>
                    <es-ribbon-dropdown-item label="Toggle Panel" />
                    <es-ribbon-dropdown-item label="Open in Window" />
                </es-ribbon-dropdown>
            </es-ribbon-button-split>
        </es-ribbon-column>
    </es-ribbon-section>
}
const Tpt2Events = () => {
    return <es-ribbon-section label="Events">
        <es-ribbon-button >
            <AddIcon />
            <label>Create</label>
        </es-ribbon-button>
        <es-ribbon-button-small label="Color Scheme">

        </es-ribbon-button-small>
    </es-ribbon-section>
}

const TptFile = () => {
    const css = /*css*/`
.tpt2-ribbon es-ribbon-button-small svg {
    height: 24px;
}
`
    
    return <es-ribbon-section class="tpt2-ribbon" label="File">
        <style>{css}</style>
        <es-ribbon-column>
            <es-ribbon-button-small>
                <ZoomInIcon />
            </es-ribbon-button-small>
            <es-ribbon-button-small>
                <ZoomOutIcon />
            </es-ribbon-button-small>
        </es-ribbon-column>
        <es-ribbon-column>
            <es-ribbon-button-small>
                <FileUploadIcon />
            </es-ribbon-button-small>
            <es-ribbon-button-small>
                <FileDownloadIcon />
            </es-ribbon-button-small>
        </es-ribbon-column>
        <es-ribbon-column>
            <es-ribbon-button>
                <PhotoCameraIcon />
                <label></label>
                <es-ribbon-dropdown>
                    <es-ribbon-dropdown-item label="One" />
                </es-ribbon-dropdown>
            </es-ribbon-button>
        </es-ribbon-column>
    </es-ribbon-section>
}
const TptTimescale = () => {
    const css = /*css*/`
.tpt2-ribbon es-ribbon-button-small svg {
    height: 24px;
}
.tpt2-ribbon label {
    padding-left: 4px;
    padding-right: 4px;
}
.tpt2-ribbon input {
    color: var(--es-theme-text-secondary-on-background);
    background-color: transparent;
    border: 1px solid;
}
.calendar {
    width: 9em;
}
`
    return <es-ribbon-section className="tpt2-ribbon" label="Timescale">
        <style>{css}</style>
        <es-ribbon-column>
            <es-ribbon-row>
                <input className="calendar" defaultValue="2022/01/20 14:00Z" />
                <label>TO</label> 
                <input className="calendar" defaultValue="2022/01/20 14:00Z" />

                <es-ribbon-button-split label="Select...">
                    <es-ribbon-dropdown>
                        <es-ribbon-dropdown-item label="ESSEX" />
                        <es-ribbon-dropdown-item label="LINCOLN" />
                    </es-ribbon-dropdown>
                </es-ribbon-button-split>

                <es-ribbon-button-small label="Plan" >
                    <TopicIcon />
                </es-ribbon-button-small>
            </es-ribbon-row>

            <es-ribbon-row>
                <es-ribbon-button-small>
                    <FirstPageIcon />
                </es-ribbon-button-small>
                <label>Duration:</label>
                <es-ribbon-button-split label="Custom">
                    <es-ribbon-dropdown>
                        <es-ribbon-dropdown-item label="1"/>
                        <es-ribbon-dropdown-item label="7"/>
                    </es-ribbon-dropdown>
                </es-ribbon-button-split>
                <label>days</label>
                <es-ribbon-button-small>
                    <LastPageIcon />
                </es-ribbon-button-small>

                <es-ribbon-button-small>
                    <TodayIcon />
                    <label>Center on Now</label>
                </es-ribbon-button-small>
                <es-ribbon-button-small>
                    <AlignHorizontalCenterIcon />
                    <label>Center on Plan</label>
                </es-ribbon-button-small>
            </es-ribbon-row>
        </es-ribbon-column>
    </es-ribbon-section>
}

const TptPlanningHorizon = () => {
    const css = /*css*/`
.tpt2-ribbon es-ribbon-button-small svg {
    height: 24px;
}
.tpt2-ribbon label {
    padding-left: 4px;
    padding-right: 4px;
}
.tpt2-ribbon input {
    color: var(--es-theme-text-secondary-on-background);
    background-color: transparent;
    border: 1px solid;
}
.calendar {
    width: 9em;
}
`
    return <es-ribbon-section className="tpt2-ribbon" label="Planning Horizon">
        <style>{css}</style>
        <es-ribbon-column>
            <es-ribbon-row>
                <input className="calendar" defaultValue="2021/12/28 23:33Z" />
                <label>TO</label> 
                <input className="calendar" defaultValue="2021/12/29 23:33Z" />

                <es-ribbon-button-small label="Timescale" >
                    <TopicIcon />
                </es-ribbon-button-small>
            </es-ribbon-row>
            <es-ribbon-row>
                <label>Duration:</label>
                <es-ribbon-button-split label="1">
                    <es-ribbon-dropdown>
                        <es-ribbon-dropdown-item label="1"/>
                        <es-ribbon-dropdown-item label="7"/>
                    </es-ribbon-dropdown>
                </es-ribbon-button-split>
                <label>day(s)</label>
            </es-ribbon-row>
        </es-ribbon-column>
    </es-ribbon-section>
}

const TptPlanAnimation = () => {
    const css=/*css*/`
.tpt2-ribbon label {
    padding-left: 4px;
    padding-right: 4px;
}
.tpt2-ribbon input {
    color: var(--es-theme-text-secondary-on-background);
    background-color: transparent;
    border: 1px solid;
}
.calendar {
    width: 9em;
}
`
    return <es-ribbon-section className="tpt2-ribbon" label="Plan Animation">
        <style>{css}</style>
        <es-ribbon-column>
            <es-ribbon-row>
                <label>Start:</label>
                <input className="calendar" defaultValue="2021-12/28 23:33Z" />
                <input style={{
                    width: "3em"
                }} type="number" defaultValue="1" />
                <label>min/sec</label>
            </es-ribbon-row>
            <es-ribbon-row>
                <es-ribbon-button>
                    <FastRewindIcon />
                </es-ribbon-button>
                <es-ribbon-button>
                    <PlayArrowIcon />
                </es-ribbon-button>
            </es-ribbon-row>
        </es-ribbon-column>
    </es-ribbon-section>
}

const TptCursors = () => {
    return <es-ribbon-section label="Cursors">
        <label><input type="checkbox"></input>Show Current Time</label>
    </es-ribbon-section>
}