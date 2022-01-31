import Tonic from '@optoolco/tonic'

export class EsRibbonRow extends Tonic {
  static hoistedStylesheet() { return /*css*/`

.ribbon-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px;
}
  `}
  render() {
    this.classList.add('ribbon-row')

    return this.html/*html*/`
      ${this.children}
    `
  }
}
