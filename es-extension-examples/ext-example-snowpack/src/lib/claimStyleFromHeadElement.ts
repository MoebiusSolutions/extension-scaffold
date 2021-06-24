/**
 * This finds a stylesheet in the `<head>` element, then
 * copies it into the shadow DOM, then finally, disables it in the main document.
 * 
 * @param uniqSelector 
 */
export function claimStyleFromHeadElement(parentDiv: HTMLDivElement, uniqSelector: string) {
    for (let i = 0; i < document.styleSheets.length; i++) {
        const ss = document.styleSheets[i]
        for (let r = 0; r < ss.cssRules.length; r++) {
            const rule = ss.cssRules[r]
            if (rule instanceof CSSStyleRule) {
                if (rule.selectorText === uniqSelector) {

                    const asText = Array.from(ss.cssRules).map(rule => rule.cssText).join('\n')
                    const styleElement = document.createElement('style')
                    styleElement.textContent = asText
                    parentDiv.appendChild(styleElement)

                    ss.disabled = true
                }
            }
        }
    }
}
