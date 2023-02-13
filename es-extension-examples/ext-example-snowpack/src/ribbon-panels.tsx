import React from 'react';
import ReactDOM from 'react-dom';

import type { ExtensionScaffoldApi } from '@moesol/es-runtime/build/es-api'
import { ShowCode } from './snippets/ShowCode';
import { RibbonCheckboxCode } from './snippets/RibbonCheckboxCode';
import { FormatCode } from './snippets/FormatCode';
import { claimStyleFromHeadElement } from './lib/claimStyleFromHeadElement';
import { FormatFileName } from './snippets/FormatFileName';
import { SettingsOptions } from './ribbon-settings-options';

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

function claimExampleTab(scaffold: ExtensionScaffoldApi) {
  const tab = scaffold.chrome.ribbonBar.claimRibbonTab('Example Tab')
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
      <label>Example</label>
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
  // Settings
  //
  function toggleSnowpackLeft() {
    scaffold.chrome.panels.togglePanel('ext.snowpack.left')
  }
  claimRibbonWith(scaffold, 'settings.group.one', 
    <es-ribbon-section label="Group 1">
      <label><CodeCheckBox />Show Code</label>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <label><input type="checkbox"></input>Show Something</label>
        <label><input type="checkbox"></input>Show Something Else</label>
        <es-ribbon-button onClick={toggleSnowpackLeft}><div>Toggle Snowpack Left</div></es-ribbon-button>
      </div>
    </es-ribbon-section>
  )

  claimRibbonWith(scaffold, 'settings.options',
    <SettingsOptions 
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
  claimRibbonWith(scaffold, "example.tab.show.code", 
    <es-ribbon-section>
      <es-ribbon-button-small label="Code" 
        onClick={() => showCode(<FormatFileName fileName='RibbonExampleTabCode.txt' />)}>
      </es-ribbon-button-small>
    </es-ribbon-section>
  )

  /**
   * Adds a center panel showing the code for this ribbon section
   * @param e 
   */
   async function showNew(e: MouseEvent) {
    showCode(<FormatFileName fileName='RibbonButtonCode.txt'/>)
  }
  claimRibbonWith(
    scaffold,
    'dc.group.one',
    <es-ribbon-section label="Group 1">
      <es-ribbon-button label="New" onClick={showNew}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-file-earmark-plus"
          viewBox="0 0 16 16"
        >
          <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z" />
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z" />
        </svg>
      </es-ribbon-button>
      <es-ribbon-button label="Open">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-folder2-open"
          viewBox="0 0 16 16"
        >
          <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
        </svg>
      </es-ribbon-button>
      <es-ribbon-button label="Save">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-save"
          viewBox="0 0 16 16"
        >
          <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z" />
        </svg>
      </es-ribbon-button>
    </es-ribbon-section>,
  );
  claimRibbonWith(
    scaffold,
    'dc.group.two',
    <es-ribbon-section label="Group 2">
      <es-ribbon-button label="Align Left">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-text-left"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </es-ribbon-button>
      <es-ribbon-button label="Center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-text-center"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </es-ribbon-button>
      <es-ribbon-button label="Alight Right">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-text-right"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </es-ribbon-button>
      <es-ribbon-button label="Justify">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-justify"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </es-ribbon-button>
    </es-ribbon-section>,
  );
  async function showPasteCode() {
    showCode(<FormatFileName fileName='RibbonDropdownCode.txt'/>)
  }
  claimRibbonWith(
    scaffold,
    'dc.group.three',
    <es-ribbon-section label="Group 3">
      <es-ribbon-button label="Copy">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-clipboard"
          viewBox="0 0 16 16"
        >
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>{' '}
      </es-ribbon-button>
      <es-ribbon-button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-clipboard-check"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
          />
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>{' '}
        <label>Paste</label>
        <es-ribbon-dropdown>
          <div style={{ padding: '8px' }}>
            <div>
              <button>With formatting</button>
            </div>
            <div>
              <button>Without formatting</button>
            </div>
            <div>
              <button onClick={showPasteCode}>Show the Code</button>
            </div>
          </div>
        </es-ribbon-dropdown>
      </es-ribbon-button>
    </es-ribbon-section>,
  );
  claimRibbonWith(scaffold, 'example.document.selector', 
  <div style={{ paddingRight: '8px' }}>
    <div>File: Untitled</div>
  </div>
  )
  claimRibbonWith(scaffold, 'example.users', <div style={{
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

  claimExampleTab(scaffold)
}
