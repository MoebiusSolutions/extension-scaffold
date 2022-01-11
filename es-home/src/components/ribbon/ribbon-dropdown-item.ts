import Tonic from "@optoolco/tonic";

export class EsRibbonDropdownItem extends Tonic {
  static hoistedStylesheet() { return /*css*/`

es-ribbon-dropdown-item {
}
.ribbon-dropdown-item {
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 8px;
  padding-right: 8px;

  display: flex;
  align-items: center;
}
.ribbon-dropdown-item svg {
  width: 1em;
  height: 1em;
}
.ribbon-dropdown-item:hover {
  color: var(--es-theme-text-primary-on-background);
  fill: var(--es-theme-text-primary-on-background);
  background: rgba(0,0,0, 0.2);
}
.ribbon-dropdown-item.disabled,
.ribbon-dropdown-item[disabled] {
  fill: var(--es-theme-text-disabled-on-background);
  color: var(--es-theme-text-disabled-on-background);
}

  `}

  connected() {
    this.addEventListener('click', (e: MouseEvent) => {
      if (this.hasAttribute('disabled')) {
        e.stopPropagation()
      }
    }, true)
  }
  render() {
    this.classList.add('ribbon-dropdown-item')
    if (this.children.length) {
      return this.html`${this.children}`
    } else {
      return this.html/*html*/`<label>${this.props.label}</label>`
    }
  }
}
