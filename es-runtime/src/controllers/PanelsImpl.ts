import type { Panels } from "../es-api";
import { withPanel } from "../utils";
import { extensionScaffold } from "./ExtensionController";

const copyStyles = (sourceDoc: HTMLDocument, targetDoc: HTMLDocument) => {
    Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        if (styleSheet.disabled) {
            return
        }

        if (styleSheet.cssRules) { // for <style> elements
            const newStyleEl = sourceDoc.createElement('style')

            Array.from(styleSheet.cssRules).forEach(cssRule => {
                // write the text of each rule into the body of the style element
                newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText))
            })

            targetDoc.head.appendChild(newStyleEl)
        } else if (styleSheet.href) { // for <link> elements loading CSS from a URL
            const newLinkEl = sourceDoc.createElement('link')

            newLinkEl.rel = 'stylesheet'
            newLinkEl.href = styleSheet.href
            targetDoc.head.appendChild(newLinkEl)
        }
    })
    targetDoc.body.style.padding = '0px'
}

export class PanelsImpl implements Panels {
    popOutPanel(id: string) {
        return withPanel(id, (parent, div) => {
            extensionScaffold.hidePanel(id)

            const useExternalWindow = window.open('', id)
            if (!useExternalWindow) {
                console.error('Unable to open a new window')
                return false
            }
            copyStyles(document, useExternalWindow.document)
    
            const popOutContainer = document.createElement('div')
            popOutContainer.className = 'pop-out-container'
            popOutContainer.appendChild(div)
    
            useExternalWindow.document.body.appendChild(popOutContainer)
            useExternalWindow.document.title = id // TODO

            useExternalWindow.addEventListener('beforeunload', () => {
                parent.appendChild(div) // Move the div back
                extensionScaffold.showPanel(id)
            })
        return false
        })

    }
}
