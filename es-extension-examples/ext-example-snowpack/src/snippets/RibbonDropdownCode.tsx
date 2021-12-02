import React from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import a11yDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark'

SyntaxHighlighter.registerLanguage('typescript', typescript)

export const RibbonDropdownCode = () => {
    const codeString = `
    ReactDOM.render(
      <React.StrictMode>
        <es-ribbon-section name="Assets">
          <es-ribbon-button name="OCB Manager">
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
      </React.StrictMode>
      , div)
    `
    return <SyntaxHighlighter language="typescript" style={a11yDark}>
        {codeString}
    </SyntaxHighlighter>
}
