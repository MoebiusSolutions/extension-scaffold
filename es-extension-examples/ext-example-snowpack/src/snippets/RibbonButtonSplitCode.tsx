import React from 'react'
import { FormatCode } from './FormatCode'

export const RibbonButtonSplitCode = () => {
    const codeString = `
    function handleClick(e: React.MouseEvent) {
      e.stopPropagation()
      const el: HTMLElement | null = e.target as any
      const t = el?.innerText
      if (t === 'Source Code') {
        showCode(<RibbonButtonSplitCode/>)
      } else {
        alert(\`Child Clicked: \${el?.innerText}\`)
      }
    }
    claimRibbonWith(scaffold, "view.split.button",
      <div>
        <es-ribbon-button-split onClick={() => alert('Split Click')} name="Split Button">
          <es-ribbon-dropdown>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
              <div onClick={handleClick}>Item One</div>
              <div onClick={handleClick}>Item Two</div>
              <div onClick={handleClick}>Item Three</div>
              <div onClick={handleClick}>Item Four</div>
              <div onClick={handleClick}>Source Code</div>
            </div>
          </es-ribbon-dropdown>
        </es-ribbon-button-split>
      </div>
    )
      `
    return <FormatCode source={codeString} />
}
