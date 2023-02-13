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
  padding: 4px;
  display: flex;
  user-select: none;
  font-size: 10pt;
}
.ribbon-section-items {
  display: flex;
  align-items: start;
  justify-content: space-around;
  flex-grow: 1;
}
.ribbon-section-label {
  font-size: 10px;
  text-align: center;
  color: var(--es-theme-text-disabled-on-background);
}

  `}
  connected() {
    if (this.props.classname) {
      // Help react set the class
      this.className = this.props.classname
    }
  }
  render() {
    return this.html/*html*/`
      <div class="ribbon-section-items">
        ${this.children}
      </div>
      <div class="ribbon-section-label">${this.props.label}</div>
    `
  }
}
