import Tonic from '@optoolco/tonic'

/**
 * Small ribbon button
 * {icon}{name}{dropdown}
 */
export class EsRibbonButtonSm extends Tonic {
  static hoistedStylesheet() { return /*css*/`

.ribbon-button-sm:hover svg,
.ribbon-button-sm.open svg {
  fill: var(--es-theme-text-primary-on-background);
}
es-ribbon-button-sm,
es-ribbon-button-split {
  display: flex;
}
es-ribbon-button-sm svg,
es-ribbon-button-split svg {
  height: 1em;
}

  `}
  render() {
    this.classList.add('ribbon-button')
    return this.html/*html*/`
      ${this.children}
      <label>${this.props.name}</label>
    `
  }
}
