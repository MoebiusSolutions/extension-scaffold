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
    render() {
      const icon = html\`<svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1792 1248v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192q0-52 38-90t90-38h512v-192h-96q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h320q40 0 68 28t28 68v320q0 40-28 68t-68 28h-96v192h512q52 0 90 38t38 90v192h96q40 0 68 28t28 68z"/></svg>\`
      return html\`
        <es-ribbon-section name="LitElements">
          <es-ribbon-button @click=\${this.showSource} title="Source for this section">
            \${icon}
            <label>Show<br>Code</label>
          </es-ribbon-button>
          <es-ribbon-button>
            \${icon}
            <label>Split1</label>
            <label>Split2</label>
            <es-ribbon-dropdown>
              <div><button>One</button></div>
              <button>Two</button>
              <button>Three</button>
            </es-ribbon-dropdown>
          </es-ribbon-button>
          <es-ribbon-button name="Disabled" disabled>
            \${icon}
          </es-ribbon-button>
          <es-ribbon-button name="Disabled Class" class="disabled">
          </es-ribbon-button>
        </es-ribbon-section>
      \`
    }
    `

    window.dispatchEvent(new CustomEvent('example-show-code', {
      detail
    }))
  }
  render() {
    const icon = html`<svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1792 1248v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192h-512v192h96q40 0 68 28t28 68v320q0 40-28 68t-68 28h-320q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h96v-192q0-52 38-90t90-38h512v-192h-96q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h320q40 0 68 28t28 68v320q0 40-28 68t-68 28h-96v192h512q52 0 90 38t38 90v192h96q40 0 68 28t28 68z"/></svg>`
    return html`
      <es-ribbon-section name="LitElements">
        <es-ribbon-button @click=${this.showSource} title="Source for this section">
          ${icon}
          <label>Show<br>Code</label>
        </es-ribbon-button>
        <es-ribbon-button>
          ${icon}
          <label>Split1</label>
          <label>Split2</label>
          <es-ribbon-dropdown>
            <div><button>One</button></div>
            <button>Two</button>
            <button>Three</button>
          </es-ribbon-dropdown>
        </es-ribbon-button>
        <es-ribbon-button name="Disabled" disabled>
          ${icon}
        </es-ribbon-button>
        <es-ribbon-button name="Disabled Class" class="disabled">
        </es-ribbon-button>
      </es-ribbon-section>
    `
  }
}
