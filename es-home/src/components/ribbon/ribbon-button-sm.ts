import Tonic from '@optoolco/tonic'

/**
 * Small ribbon button
 * {icon}{name}{dropdown}
 */
export class EsRibbonButtonSm extends Tonic {
  render() {
    this.style.cssText = "display: flex;"
    return this.html`
      ${this.children}
      <label>${this.props.name}</label>
    `
  }
}
