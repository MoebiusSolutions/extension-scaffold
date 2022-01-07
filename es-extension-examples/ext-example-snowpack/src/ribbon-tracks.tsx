import type { ExtensionScaffoldApi } from "@gots/es-runtime/build/es-api";
import React from 'react';
import ReactDOM from 'react-dom';

const ExtensionScaffoldContext = React.createContext<ExtensionScaffoldApi>(null as any)

const SelectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10z"/></svg>
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
const MergeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><rect fill="none" height="24" width="24"/></g><g><path d="M6.41,21L5,19.59l4.83-4.83c0.75-0.75,1.17-1.77,1.17-2.83v-5.1L9.41,8.41L8,7l4-4l4,4l-1.41,1.41L13,6.83v5.1 c0,1.06,0.42,2.08,1.17,2.83L19,19.59L17.59,21L12,15.41L6.41,21z"/></g></svg>
const UndoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>
const AddLocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm4 8h-3v3h-2v-3H8V8h3V5h2v3h3v2z"/></svg>
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
const RestoreFromTrash = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14zM6 7v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zm8 7v4h-4v-4H8l4-4 4 4h-2z"/></svg>

export function claimTracksRibbonSections(scaffold: ExtensionScaffoldApi) {
    const sections = [
        { id: 'tracks.manage', node: <TracksManage /> },
        { id: 'tracks.display', node: <TrackDisplay /> },
        { id: 'tracks.database', node: <TracksDatabase /> },
        { id: 'tracks.communications', node: <TracksCommunications /> },
        { id: 'tracks.misc', node: <TracksMisc /> },
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

const TracksManage = () => {
    return <es-ribbon-section label="Manage Tracks">
        <es-ribbon-button>
            <SelectIcon />
            <label>Select</label>
            <label>Tracks</label>
        </es-ribbon-button>
        <es-ribbon-button>
            <AddIcon />
            <label>New</label>
            <label>Track</label>
        </es-ribbon-button>
        <es-ribbon-column>
            <es-ribbon-button-small label="Edit" ><EditIcon /></es-ribbon-button-small>
            <es-ribbon-button-small label="Compare"><MergeIcon /></es-ribbon-button-small>
            <es-ribbon-button-small label="Un-merge" ><UndoIcon /></es-ribbon-button-small>
        </es-ribbon-column>
        <es-ribbon-column>
            <es-ribbon-button-small label="Quick Report" ><AddLocationIcon /></es-ribbon-button-small>
            <es-ribbon-button-small label="Find Duplicate"><SearchIcon /></es-ribbon-button-small>
            <es-ribbon-button-small label="Transmit"><SendIcon /></es-ribbon-button-small>
        </es-ribbon-column>
        <es-ribbon-column>
            <es-ribbon-button-small label="Delete"><DeleteIcon /></es-ribbon-button-small>
        </es-ribbon-column>
    </es-ribbon-section>
}
const TrackDisplay = () => {
    return <es-ribbon-section label="Track Display">
        <es-ribbon-button>
            <HistoryIcon />
            <label>History</label>
            <es-ribbon-dropdown>
                <es-ribbon-dropdown-item label="Display"></es-ribbon-dropdown-item>
            </es-ribbon-dropdown>
        </es-ribbon-button>
        <es-ribbon-button label="Status Board"><DashboardIcon /></es-ribbon-button>
    </es-ribbon-section>
}
const TracksDatabase = () => {
    const scaffold = React.useContext(ExtensionScaffoldContext)
    const [summaryOpen, setSummaryOpen] = React.useState(false)
    const CTM_TRACK_SUMMARY_ID = 'ctm.tracks.summary'

    React.useEffect(() => {
        if (summaryOpen) {
            scaffold.chrome.panels.addPanel({ 
                "id": CTM_TRACK_SUMMARY_ID,
                "title": "Tracks",
                "location": "bottom-bar",
                "iframeSource": "http://proxy.gccs-m.test:8080/otm-console/controllers/Track:Summary?zone=MGF",
                "resizeHandle": true
            })
        } else {
            scaffold.chrome.panels.removePanel(CTM_TRACK_SUMMARY_ID)
        }
    }, [summaryOpen])

    async function summary() {
        setSummaryOpen(p => !p)
    }
    return <es-ribbon-section label="Track Database">
        <es-ribbon-column>
            <es-ribbon-button-small label="Counts" />
            <es-ribbon-button-small label="Bcst Status" />
        </es-ribbon-column>
        <es-ribbon-column>
            <es-ribbon-button-small label="Timelate" />
            <es-ribbon-button-small label="Track Summary" onClick={summary}/>
            <es-ribbon-button-small label="Dynamic Missile Summary" />
        </es-ribbon-column>
    </es-ribbon-section>
}
const TracksCommunications = () => {
    return <es-ribbon-section label="Communications" >
        <es-ribbon-column>
            <es-ribbon-button-small>
                <label>CST</label>
                <es-ribbon-dropdown>
                    <es-ribbon-dropdown-item label="Configure" />
                </es-ribbon-dropdown>
            </es-ribbon-button-small>
            <es-ribbon-button-small>
                <label>Comms</label>
                <es-ribbon-dropdown>
                    <es-ribbon-dropdown-item label="Configure" />
                </es-ribbon-dropdown>
            </es-ribbon-button-small>
            <es-ribbon-button label="Comms Task Manager" />
        </es-ribbon-column>
    </es-ribbon-section>
}
const TracksMisc = () => {
    return <es-ribbon-section label="Misc" >
        <es-ribbon-button label="Trash Can"><RestoreFromTrash /></es-ribbon-button>
    </es-ribbon-section>
}
