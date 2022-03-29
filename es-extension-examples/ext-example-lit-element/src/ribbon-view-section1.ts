import { customElement, property, LitElement, html, css } from 'lit-element';

@customElement('lit-view-section')
export class RibbonViewSection extends LitElement {
  @property() message = 'Learn LitElement';

  static get styles() {
    return css`
    svg {
      fill: var(--es-theme-secondary-on-surface);
    }
    `;
  }
  // We are already in a shadow root and we want to use the existing styles...
  // this prevents the creation of a shadow root
  createRenderRoot() {
    return this;
  }
  showSource() {
    const detail = `
/**
 * Extension activation point
 */
export async function activate(scaffold: ExtensionScaffoldApi) {
  doRibbon(scaffold)
  // ...
}

function doRibbon(api: ExtensionScaffoldApi) {
  const div = api.chrome.ribbonBar.claimRibbonPanel('view.section1')
  if (!div) { return }
  const el = document.createElement('lit-view-section')
  div.innerText = ''
  div.appendChild(el)
}

@customElement('lit-view-section')
export class RibbonViewSection extends LitElement {
  // ...

  /**
   * LitElements event handler
   */
  showButton(e: MouseEvent) {
    const b : HTMLInputElement | null = e.target as any
    alert(\`\${b?.innerText}\`)
  }

  /**
   * LitElements render function
   */
  render() {
    const icon = html\`<svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1792 1248v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192q0-52 38-90t90-38h512v-192h-96q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h320q40 0 68 28t28 68v320q0 40-28 68t-68 28h-96v192h512q52 0 90 38t38 90v192h96q40 0 68 28t28 68z"/></svg>\`
    return html\`
      <es-ribbon-section label="LitElements">
        <es-ribbon-button @click=\${this.showSource} title="Source for this section">
          \${icon}
          <label>Show<br>Code</label>
        </es-ribbon-button>
        <es-ribbon-button>
          \${icon}
          <label>Split1</label>
          <label>Split2</label>
          <es-ribbon-dropdown>
            <!-- default styles -->
            <div><button @click=\${this.showButton}>One</button></div>
            <button @click=\${this.showButton}>Two</button>
            <button @click=\${this.showButton}>Three</button>
          </es-ribbon-dropdown>
        </es-ribbon-button>
        <es-ribbon-button label="Disabled" disabled>
          \${icon}
        </es-ribbon-button>
        <es-ribbon-button label="Disabled Class" class="disabled">
        </es-ribbon-button>
      </es-ribbon-section>
    \`
  }

  `
    window.dispatchEvent(new CustomEvent('example-show-code', {
      detail
    }))
  }

  /**
   * LitElements event handler
   */
  showButton(e: MouseEvent) {
    const b : HTMLInputElement | null = e.target as any
    alert(`${b?.innerText}`)
  }
  inputClick(e: MouseEvent) {
    e.stopPropagation()
  }
  /**
   * LitElements render function
   */
  render() {
    const icon = html`<svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1792 1248v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192q0-52 38-90t90-38h512v-192h-96q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h320q40 0 68 28t28 68v320q0 40-28 68t-68 28h-96v192h512q52 0 90 38t38 90v192h96q40 0 68 28t28 68z"/></svg>`
    return html`
      <es-ribbon-section label="LitElements">
        <es-ribbon-button @click=${this.showSource} title="Source for this section">
          ${icon}
          <label>Show<br>Code</label>
        </es-ribbon-button>
        <es-ribbon-button>
          ${icon}
          <label>Split1</label>
          <label>Split2</label>
          <es-ribbon-dropdown>
            <!-- default styles -->
            <div><button @click=${this.showButton}>One</button></div>
            <button @click=${this.showButton}>Two</button>
            <button @click=${this.showButton}>Three</button>
            <label>Input:
              <input @click=${this.inputClick} type="text"/>
            </label>
          </es-ribbon-dropdown>
        </es-ribbon-button>
        <es-ribbon-button @click=${this.showButton} label="Disabled" disabled>
          ${icon}
        </es-ribbon-button>
        <es-ribbon-button label="Disabled Class" class="disabled">
        </es-ribbon-button>
      </es-ribbon-section>
    `
  }
}
