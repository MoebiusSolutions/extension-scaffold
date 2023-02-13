import Tonic from '@optoolco/tonic'

export class EsRibbonColumn extends Tonic {
  static hoistedStylesheet() { return /*css*/`

.ribbon-column {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
  `}
  render() {
    this.classList.add('ribbon-column')

    return this.html/*html*/`
      ${this.children}
    `
  }
}
