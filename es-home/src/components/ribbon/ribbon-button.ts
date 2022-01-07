import Tonic from '@optoolco/tonic'

export class EsRibbonButton extends Tonic {
  static hoistedStylesheet() { return /*css*/`

.ribbon-button {
  fill: var(--es-theme-text-secondary-on-background);
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 1px;
  padding-left: 4px;
  padding-right: 4px;
}
}

.ribbon-button.disabled,
.ribbon-button[disabled] {
  pointer-events: none;
  fill: var(--es-theme-text-disabled-on-background);
  color: var(--es-theme-text-disabled-on-background);
}
.ribbon-button:hover,
.ribbon-button.open {
  fill: var(--es-theme-text-primary-on-background);
  color: var(--es-theme-text-primary-on-background);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--es-theme-text-secondary-on-background);
}
es-ribbon-button svg {
  height: 24px;
  position: relative;
  top: 8px;
  margin-top: -8px;
}
es-ribbon-button label {
  display: block;
}

  `}
  render() {
    this.classList.add('ribbon-button')
    return this.html/*html*/`
      ${this.children}
      <label>${this.props.label}</label>
    `
  }
}
