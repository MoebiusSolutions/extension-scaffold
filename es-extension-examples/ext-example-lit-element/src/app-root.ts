import { customElement, property, LitElement, html, css } from 'lit-element';

@customElement('app-root')
export class AppRoot extends LitElement {
  @property() message = 'Learn LitElement';

  static get styles() {
    return css`
      h1 {
        font-size: 2rem;
      }
      .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #2196f3;
        background: linear-gradient(315deg, #b4d2ea 0%, #2196f3 100%);
        font-size: 12px;

        /* Fill grid area*/
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
      }
      .link {
        color: white;
      }
    `;
  }

  render() {
    return html`
      <div class="wrapper">
        <h1>Ext LitElement + Snowpack</h1>
        <p>Edit <code>src/app-root.ts</code> and save to reload.</p>
        <a
          class="link"
          href="https://lit-element.polymer-project.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${this.message}
        </a>
      </div>
    `;
  }
}
