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
    private readonly externalWindows = new Map<string, Window>()

    private getOrCreatePopOutWindow(id: string) {
        let extWindow = this.externalWindows.get(id) ?? null
        if (extWindow && extWindow.closed === false) {
            extWindow.focus()
            const popOutContainer = extWindow.document.querySelector('.pop-out-container')
            if (!popOutContainer) {
                throw new Error('Missing <div class="pop-out-container">')
            }
            return { extWindow, popOutContainer }
        } else {
            extWindow = window.open('', id)
            if (!extWindow) {
                throw new Error('Unable to create pop out window')
            }
            copyStyles(document, extWindow.document)
            const popOutContainer = document.createElement('div')
            popOutContainer.className = 'pop-out-container'
            extWindow.document.body.appendChild(popOutContainer)

            this.externalWindows.set(id, extWindow)
            return { extWindow, popOutContainer }
        }
    }

    popOutPanel(id: string) {
        return withPanel(id, (parent, div) => {
            extensionScaffold.hidePanel(id)

            const { extWindow, popOutContainer } = this.getOrCreatePopOutWindow(id)
    
            popOutContainer.appendChild(div)
    
            extWindow.document.title = id // TODO

            extWindow.addEventListener('beforeunload', () => {
                parent.appendChild(div) // Move the div back
                div.style.display = 'none'
                extensionScaffold.showPanel(id)
            })
        })
    }

    popInPanel(id: string) {
        const externalWindow = this.externalWindows.get(id)
        if (!externalWindow) {
            console.log('No window found')
            return false
        }
        externalWindow.close()
        return true
    }

    isPoppedOut(id: string): boolean {
        const extWindow = this.externalWindows.get(id)
        if (!extWindow) {
            return false
        }
        const div = extWindow.document.getElementById(id)
        if (!div) {
            return false
        }
        return true
        // return div.style.display !== 'none'
    }

    focusPopOut(id: string) {
        const externalWindow = this.externalWindows.get(id)
        if (!externalWindow) {
            console.log('No window found')
            return false
        }
        externalWindow.focus()
    }
}
