import React from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import a11yDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'

SyntaxHighlighter.registerLanguage('typescript', typescript)

export const RibbonButtonCode = () => {
    const codeString = `
    //
    // Let typescript know about our web components
    //
    declare namespace JSX {
      interface IntrinsicElements {
        "es-ribbon-section": any;
        "es-ribbon-button": any;
        "es-ribbon-dropdown": any;
      }
    }

    //
    // React component for icon based on inline svg
    //
    const PlusSquareO = () => <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1344 800v64q0 14-9 23t-23 9h-352v352q0 14-9 23t-23 9h-64q-14 0-23-9t-9-23v-352h-352q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h352v-352q0-14 9-23t23-9h64q14 0 23 9t9 23v352h352q14 0 23 9t9 23zm128 448v-832q0-66-47-113t-113-47h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113zm128-832v832q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q119 0 203.5 84.5t84.5 203.5z"/></svg>

    //
    // Helper function to check for null when id does not exist
    //
    function claimRibbonThen(scaffold: ExtensionScaffoldApi, id: string, f: (div: HTMLDivElement) => void) {
        const div = scaffold.chrome.ribbonBar.claimRibbonPanel(id)
        if (div === null) {
          console.error('ribbon panel not found', id)
          return
        }
        f(div)
      }

    //
    // Example function claiming a section and setting up its buttons using a mix of
    // web components and React
    //
    function doRibbon(scaffold: ExtensionScaffoldApi) {
      claimRibbonThen(scaffold, 'mp.area.plans', div => {
        async function handleClick(e: MouseEvent) {
          const div = await scaffold.chrome.panels.addPanel({
            id: 'ext.example.snowpack.code',
            location: 'center'
          })
          ReactDOM.render(
            <React.StrictMode>
              <ShowCode es={scaffold} >
                <RibbonButtonCode/>
              </ShowCode>
            </React.StrictMode>,
            div
          );
        }
    
        ReactDOM.render(
          <React.StrictMode>
            <es-ribbon-section name="Area Plans">
              <es-ribbon-button name="New Plan" onClick={handleClick}>
                <PlusSquareO />
              </es-ribbon-button>
              <es-ribbon-button name="Edit Plan">
                <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M888 1184l116-116-152-152-116 116v56h96v96h56zm440-720q-16-16-33 1l-350 350q-17 17-1 33t33-1l350-350q17-17 1-33zm80 594v190q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q63 0 117 25 15 7 18 23 3 17-9 29l-49 49q-14 14-32 8-23-6-45-6h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-126q0-13 9-22l64-64q15-15 35-7t20 29zm-96-738l288 288-672 672h-288v-288zm444 132l-92 92-288-288 92-92q28-28 68-28t68 28l152 152q28 28 28 68t-28 68z"/></svg>
              </es-ribbon-button>
              <es-ribbon-button name="Filter Plan">
                <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1595 295q17 41-14 70l-493 493v742q0 42-39 59-13 5-25 5-27 0-45-19l-256-256q-19-19-19-45v-486l-493-493q-31-29-14-70 17-39 59-39h1280q42 0 59 39z"/></svg>
              </es-ribbon-button>
            </es-ribbon-section>
          </React.StrictMode>,
          div
        )
      })
    }
`
    return <SyntaxHighlighter language="typescript" style={a11yDark}>
        {codeString}
    </SyntaxHighlighter>
}
