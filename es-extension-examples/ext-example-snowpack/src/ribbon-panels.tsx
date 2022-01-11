import React from 'react';
import ReactDOM from 'react-dom';

import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { ShowCode } from './snippets/ShowCode';
import { RibbonCheckboxCode } from './snippets/RibbonCheckboxCode';
import { FormatCode } from './snippets/FormatCode';
import { claimStyleFromHeadElement } from './lib/claimStyleFromHeadElement';
import { FormatFileName } from './snippets/FormatFileName';
import { ChartOptions } from './ribbon-chart-options';
import { claimTracksRibbonSections } from './ribbon-tracks';

const PlusSquareO = () => <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1344 800v64q0 14-9 23t-23 9h-352v352q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23v-352h-352q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h352v-352q0-14 9-23t23-9h64q14 0 23 9t9 23v352h352q14 0 23 9t9 23zm128 448v-832q0-66-47-113t-113-47h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113zm128-832v832q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q119 0 203.5 84.5t84.5 203.5z"/></svg>
const LoopIcon = () => <svg className="loop-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>

const ID_SNOWPACK_CODE = 'ext.example.snowpack.code'

/**
 * Helper functions to avoid if (div === null) broiler plate.
 */
function claimRibbonThen(scaffold: ExtensionScaffoldApi, id: string, f: (div: HTMLDivElement) => void) {
  const div = scaffold.chrome.ribbonBar.claimRibbonPanel(id)
  if (div === null) {
    console.error('ribbon panel not found', id)
    return
  }
  f(div)
}
function claimRibbonWith(scaffold: ExtensionScaffoldApi, id: string, node: React.ReactNode) {
  claimRibbonThen(scaffold, id, div => {
    ReactDOM.render(<React.StrictMode>{node}</React.StrictMode>,div)
  })
}

function claimTrackTab(scaffold: ExtensionScaffoldApi) {
  const tab = scaffold.chrome.ribbonBar.claimRibbonTab('Track')
  if (!tab) { return }

  ReactDOM.render(<React.StrictMode>
    <style>{/*css*/`
      .wrapper {
        display: flex;
        align-items: flex-end;
      }
      @media (prefers-reduced-motion: no-preference) {
        .loop-icon {
          fill: green;
          height: 1em;
          padding-top: 2px;
          animation: Loop-icon-spin infinite 20s linear reverse;
        }
      }
      @keyframes Loop-icon-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
    <div className="wrapper">
      <LoopIcon/>
      <label>Track</label>
    </div>
    </React.StrictMode>, tab)
}

/**
 * Function to claim several ribbon sections/panels.
 * 
 * @param scaffold 
 */
export function doClaimRibbon(scaffold: ExtensionScaffoldApi) {
  const CodeCheckBox: React.FC<{}> = () => {
    const [open, setOpen] = React.useState(false)
    React.useEffect(() => {
      window.addEventListener('example-hide-code', () => {
        setOpen(false)
      })
    }, [])
    function toggleCode(e: React.ChangeEvent<HTMLInputElement>) {
      const t: HTMLInputElement | null = e.target as any
      if (t?.checked) {
        showCode(<RibbonCheckboxCode/>)
        setOpen(true)
      } else {
        hideCode()
        setOpen(false)
      }
    }
    return <input onChange={toggleCode} type="checkbox" checked={open}></input>
  }
  window.addEventListener('example-show-code', (e: any) => {
    showCode(<FormatCode source={e.detail}/>)
  })
  
  //
  // Chart Settings
  //
  function toggleLayers() {
    scaffold.chrome.panels.togglePanel('ext.snowpack.left')
  }
  claimRibbonWith(scaffold, 'chart.settings', 
    <es-ribbon-section label="Status Bar">
      <label><CodeCheckBox />Show Code</label>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <label><input type="checkbox"></input>Show Mouse Location</label>
        <label><input type="checkbox"></input>Show Plan Time</label>
        <es-ribbon-button onClick={toggleLayers}><div>Layers</div></es-ribbon-button>
      </div>
    </es-ribbon-section>
  )

  claimRibbonWith(scaffold, 'chart.settings.options',
    <ChartOptions 
      showCode={() => showCode(<FormatFileName fileName='RibbonRadioButtonCode.txt' />)} 
      hideCode={hideCode}
    />
  )

  async function showCode(node: React.ReactNode) {
    if (scaffold.chrome.panels.panelIds('center')?.find(p => p.id === ID_SNOWPACK_CODE)) {
      hideCode()
    }
    const div = await scaffold.chrome.panels.addPanel({
      id: ID_SNOWPACK_CODE,
      location: 'center'
    })

    ReactDOM.render(
      <React.StrictMode>
        <ShowCode es={scaffold} >
          {node}
        </ShowCode>
      </React.StrictMode>,
      div
    );

    claimStyleFromHeadElement(div, '.token.entity')
  }
  function hideCode() {
    scaffold.chrome.panels.removePanel(ID_SNOWPACK_CODE)
    window.dispatchEvent(new CustomEvent('example-hide-code'))
  }

  /**
   * Split Button handlers
   * @param e 
   */
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation() // Prevents extra `Split Click` alert

    const target: HTMLElement | null = e.target as any
    const t = target?.innerText
    if (t === 'Source Code') {
      showCode(<FormatFileName fileName='RibbonButtonSplitCode.txt' />)
      const dropdown: any = target?.closest('es-ribbon-dropdown')
      dropdown?.close()
    } else {
      alert(`Child Clicked: ${t}`)
    }
  }
  claimRibbonWith(scaffold, "view.split.button",
    <div> {/* <- this div "soaks" up the flex space so the button can be small */}
      <es-ribbon-button-split onClick={() => alert('Split Click')} label="Split Button">
        <es-ribbon-dropdown>
          <es-ribbon-dropdown-item onClick={handleClick} label="Item One"></es-ribbon-dropdown-item>
          <es-ribbon-dropdown-item onClick={handleClick}><div>Item Two</div></es-ribbon-dropdown-item>
          <es-ribbon-dropdown-item onClick={handleClick} label="Ignored"><div >Item Three</div></es-ribbon-dropdown-item>
          <es-ribbon-dropdown-item disabled onClick={handleClick}><div>Item Four</div></es-ribbon-dropdown-item>
          <es-ribbon-dropdown-item onClick={handleClick}><div>Source Code</div></es-ribbon-dropdown-item>
        </es-ribbon-dropdown>
      </es-ribbon-button-split>
    </div>
  )
  claimRibbonWith(scaffold, "track.show.code", 
    <es-ribbon-section>
      <es-ribbon-button-small label="Code" 
        onClick={() => showCode(<FormatFileName fileName='RibbonTrackTabCode.txt' />)}>
      </es-ribbon-button-small>
    </es-ribbon-section>
  )

  /**
   * Adds a center panel showing the code for this ribbon section
   * @param e 
   */
   async function showNewPlan(e: MouseEvent) {
    showCode(<FormatFileName fileName='RibbonButtonCode.txt'/>)
  }
  claimRibbonWith(scaffold, 'mp.area.plans',
    <es-ribbon-section label="Area Plans">
      <es-ribbon-button label="New Plan" onClick={showNewPlan}>
        <PlusSquareO />
      </es-ribbon-button>
      <es-ribbon-button label="Edit Plan">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M888 1184l116-116-152-152-116 116v56h96v96h56zm440-720q-16-16-33 1l-350 350q-17 17-1 33t33-1l350-350q17-17 1-33zm80 594v190q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q63 0 117 25 15 7 18 23 3 17-9 29l-49 49q-14 14-32 8-23-6-45-6h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-126q0-13 9-22l64-64q15-15 35-7t20 29zm-96-738l288 288-672 672h-288v-288zm444 132l-92 92-288-288 92-92q28-28 68-28t68 28l152 152q28 28 28 68t-28 68z"/></svg>
      </es-ribbon-button>
      <es-ribbon-button label="Filter Plan">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1595 295q17 41-14 70l-493 493v742q0 42-39 59-13 5-25 5-27 0-45-19l-256-256q-19-19-19-45v-486l-493-493q-31-29-14-70 17-39 59-39h1280q42 0 59 39z"/></svg>
      </es-ribbon-button>
    </es-ribbon-section>
  )
  claimRibbonWith(scaffold, 'mp.general.area',
    <es-ribbon-section label="General Area">
      <es-ribbon-button label="New Area">
        <PlusSquareO />
      </es-ribbon-button>
      <es-ribbon-button label="Edit Summary">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M256 1312v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm1536 768v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5zm-1536-1152v192q0 13-9.5 22.5t-22.5 9.5h-192q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h192q13 0 22.5 9.5t9.5 22.5zm1536 768v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5zm0-384v192q0 13-9.5 22.5t-22.5 9.5h-1344q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1344q13 0 22.5 9.5t9.5 22.5z"/></svg>
      </es-ribbon-button>
      <es-ribbon-button label="Area Filters">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1595 295q17 41-14 70l-493 493v742q0 42-39 59-13 5-25 5-27 0-45-19l-256-256q-19-19-19-45v-486l-493-493q-31-29-14-70 17-39 59-39h1280q42 0 59 39z"/></svg>
      </es-ribbon-button>
      <es-ribbon-button label="Static Areas">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M896 1629l640-349v-636l-640 233v752zm-64-865l698-254-698-254-698 254zm832-252v768q0 35-18 65t-49 47l-704 384q-28 16-61 16t-61-16l-704-384q-31-17-49-47t-18-65v-768q0-40 23-73t61-47l704-256q22-8 44-8t44 8l704 256q38 14 61 47t23 73z"/></svg>
      </es-ribbon-button>
      <es-ribbon-button label="Dynamic Areas">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M896 1629l640-349v-636l-640 233v752zm-64-865l698-254-698-254-698 254zm832-252v768q0 35-18 65t-49 47l-704 384q-28 16-61 16t-61-16l-704-384q-31-17-49-47t-18-65v-768q0-40 23-73t61-47l704-256q22-8 44-8t44 8l704 256q38 14 61 47t23 73z"/></svg>
      </es-ribbon-button>
    </es-ribbon-section>
  )
  async function showPucksCode() {
    showCode(<FormatFileName fileName='RibbonDropdownCode.txt'/>)
  }
  claimRibbonWith(scaffold, 'mp.assets',
    <es-ribbon-section label="Assets">
      <es-ribbon-button label="OCB Manager">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1792 1248v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192q0-52 38-90t90-38h512v-192h-96q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h320q40 0 68 28t28 68v320q0 40-28 68t-68 28h-96v192h512q52 0 90 38t38 90v192h96q40 0 68 28t28 68z"/></svg>
      </es-ribbon-button>
      <es-ribbon-button>
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1683 1555q19-19 45-19t45 19l128 128-90 90-83-83-83 83q-18 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-128-128 90-90 83 83 83-83q19-19 45-19t45 19l83 83 83-83q19-19 45-19t45 19l83 83 83-83q19-19 45-19t45 19l83 83 83-83q19-19 45-19t45 19l83 83 83-83q19-19 45-19t45 19l83 83 83-83q19-19 45-19t45 19l83 83zm-1574-38q-19 19-45 19t-45-19l-128-128 90-90 83 82 83-82q19-19 45-19t45 19l83 82 64-64v-293l-210-314q-17-26-7-56.5t40-40.5l177-58v-299h128v-128h256v-128h256v128h256v128h128v299l177 58q30 10 40 40.5t-7 56.5l-210 314v293l19-18q19-19 45-19t45 19l83 82 83-82q19-19 45-19t45 19l128 128-90 90-83-83-83 83q-18 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83-83 83q-19 19-45 19t-45-19l-83-83zm403-1133v128l384-128 384 128v-128h-128v-128h-512v128h-128z"/></svg>
        <label>Pucks</label>
        <es-ribbon-dropdown>
          <div style={{ padding: '8px'}}>
            <button onClick={showPucksCode}>Show the Code</button>
            <div>This is row two</div>
          </div>
        </es-ribbon-dropdown>
      </es-ribbon-button>
    </es-ribbon-section>
  )
  claimRibbonWith(scaffold, 'mp.asw.search.planning',
    <es-ribbon-section label="ASW Search Planning">
      <es-ribbon-button label="SPA">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M896 1523q-20 0-93-73.5t-73-93.5q0-32 62.5-54t103.5-22 103.5 22 62.5 54q0 20-73 93.5t-93 73.5zm270-271q-2 0-40-25t-101.5-50-128.5-25-128.5 25-101 50-40.5 25q-18 0-93.5-75t-75.5-93q0-13 10-23 78-77 196-121t233-44 233 44 196 121q10 10 10 23 0 18-75.5 93t-93.5 75zm273-272q-11 0-23-8-136-105-252-154.5t-268-49.5q-85 0-170.5 22t-149 53-113.5 62-79 53-31 22q-17 0-92-75t-75-93q0-12 10-22 132-132 320-205t380-73 380 73 320 205q10 10 10 22 0 18-75 93t-92 75zm271-271q-11 0-22-9-179-157-371.5-236.5t-420.5-79.5-420.5 79.5-371.5 236.5q-11 9-22 9-17 0-92.5-75t-75.5-93q0-13 10-23 187-186 445-288t527-102 527 102 445 288q10 10 10 23 0 18-75.5 93t-92.5 75z"/></svg>
      </es-ribbon-button>
    </es-ribbon-section>
  )
  claimRibbonWith(scaffold, 'mp.review',
    <es-ribbon-section label="Review">
      <es-ribbon-button label="Interference Check">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z"/></svg>
      </es-ribbon-button>
      <es-ribbon-button label="Sign Plan">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M813 1299l614-614q19-19 19-45t-19-45l-102-102q-19-19-45-19t-45 19l-467 467-211-211q-19-19-45-19t-45 19l-102 102q-19 19-19 45t19 45l358 358q19 19 45 19t45-19zm851-883v960q0 119-84.5 203.5t-203.5 84.5h-960q-119 0-203.5-84.5t-84.5-203.5v-960q0-119 84.5-203.5t203.5-84.5h960q119 0 203.5 84.5t84.5 203.5z"/></svg>
      </es-ribbon-button>
      <es-ribbon-button label="Manage Reviewers">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1405q0 120-73 189.5t-194 69.5h-874q-121 0-194-69.5t-73-189.5q0-53 3.5-103.5t14-109 26.5-108.5 43-97.5 62-81 85.5-53.5 111.5-20q9 0 42 21.5t74.5 48 108 48 133.5 21.5 133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5t-271.5 112.5-271.5-112.5-112.5-271.5 112.5-271.5 271.5-112.5 271.5 112.5 112.5 271.5z"/></svg>          
      </es-ribbon-button>
      <es-ribbon-button label="Export Plan">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1472 989v259q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h255q13 0 22.5 9.5t9.5 22.5q0 27-26 32-77 26-133 60-10 4-16 4h-112q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-214q0-19 18-29 28-13 54-37 16-16 35-8 21 9 21 29zm237-496l-384 384q-18 19-45 19-12 0-25-5-39-17-39-59v-192h-160q-323 0-438 131-119 137-74 473 3 23-20 34-8 2-12 2-16 0-26-13-10-14-21-31t-39.5-68.5-49.5-99.5-38.5-114-17.5-122q0-49 3.5-91t14-90 28-88 47-81.5 68.5-74 94.5-61.5 124.5-48.5 159.5-30.5 196.5-11h160v-192q0-42 39-59 13-5 25-5 26 0 45 19l384 384q19 19 19 45t-19 45z"/></svg>
      </es-ribbon-button>
    </es-ribbon-section>
  )
  claimRibbonWith(scaffold, 'mp.messages',
    <es-ribbon-section label="Messages">
      <es-ribbon-button label="New Message">
        <PlusSquareO />
      </es-ribbon-button>
      <es-ribbon-button label="Download">
        <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1216 928q0-14-9-23t-23-9h-224v-352q0-13-9.5-22.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 22.5v352h-224q-13 0-22.5 9.5t-9.5 22.5q0 14 9 23l352 352q9 9 23 9t23-9l351-351q10-12 10-24zm640 224q0 159-112.5 271.5t-271.5 112.5h-1088q-185 0-316.5-131.5t-131.5-316.5q0-130 70-240t188-165q-2-30-2-43 0-212 150-362t362-150q156 0 285.5 87t188.5 231q71-62 166-62 106 0 181 75t75 181q0 76-41 138 130 31 213.5 135.5t83.5 238.5z"/></svg>
      </es-ribbon-button>
    </es-ribbon-section>
  )
  claimRibbonWith(scaffold, 'example.scenario.selector', 
  <div style={{ paddingRight: '8px' }}>
    <div>Plan: Untitled</div>
    <div>OPAUTH: CTF-74</div>
  </div>
  )
  claimRibbonWith(scaffold, 'ctm.users', <div style={{
    paddingRight: '8px',
  }}>Users: 1</div>)
  
  claimRibbonWith(scaffold, 'shared.search', 
    <input  style={{
      border: '1px solid var(--es-theme-text-secondary-on-background)',
      color: 'var(--es-theme-text-secondary-on-background)',
      background: 'transparent',
      marginRight: '4px'
    }} type="text" placeholder="Search"/>
  )

  claimTrackTab(scaffold)
  claimTracksRibbonSections(scaffold)
}
