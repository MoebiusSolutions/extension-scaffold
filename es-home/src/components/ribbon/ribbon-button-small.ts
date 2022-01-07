import Tonic from '@optoolco/tonic'

/**
 * Small ribbon button
 * {icon}{name}{dropdown}
 */
export class EsRibbonButtonSmall extends Tonic {
  static hoistedStylesheet() { return /*css*/`

.ribbon-button-sm:hover svg,
.ribbon-button-sm.open svg {
  fill: var(--es-theme-text-primary-on-background);
}
es-ribbon-button-small.ribbon-button,
es-ribbon-button-split.ribbon-button {
  display: flex;
  padding-left: 4px;
  justify-content: left;
}
es-ribbon-button-small svg,
es-ribbon-button-split svg {
  height: 1em;
}
es-ribbon-button-small es-ribbon-dropdown svg {
  margin-top: 0px;
}
es-ribbon-button-small.has-dropdown {
  padding-right: 0px;
  align-self: flex-start;
}

  `}

  connected() {
    if (this.querySelectorAll('es-ribbon-dropdown').length) {
      this.classList.add('has-dropdown')
    }
  }
  render() {
    this.classList.add('ribbon-button')
    return this.html/*html*/`
      ${this.children}
      <label>${this.props.label}</label>
    `
  }
}
