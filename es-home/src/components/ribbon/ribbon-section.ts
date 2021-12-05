import Tonic from '@optoolco/tonic'

export class EsRibbonSection extends Tonic {
  static hoistedStylesheet() { return /*css*/`

es-ribbon-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.ribbon-section {
  border-right: 1px solid;
  padding: 8px;
  display: flex;
  user-select: none;
}
.ribbon-section-items {
  display: flex;
  justify-content: space-around;
  flex-grow: 1;
}
.ribbon-section-label {
  font-size: 10px;
  text-align: center;
}

  `}
  render() {
    return this.html/*html*/`
      <div class="ribbon-section-items">
        ${this.children}
      </div>
      <div class="ribbon-section-label">${this.props.label}</div>
    `
  }
}
