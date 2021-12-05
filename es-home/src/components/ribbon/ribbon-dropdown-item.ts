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

  `}
  render() {
    if (this.children.length) {
      return this.html/*html*/`<div class="ribbon-dropdown-item">${this.children}</div>`
    } else {
      return this.html/*html*/`<div class="ribbon-dropdown-item">${this.props.label}</div>`
    }
  }
}
